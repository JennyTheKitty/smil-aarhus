import { createHmac } from 'crypto';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';

const urlSafeBase64 = (buf: any) => {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const hexDecode = (hex: string) => Buffer.from(hex, 'hex');

const sign = (salt: string, target: string, secret: string): string => {
  const hmac = createHmac('sha256', hexDecode(secret));
  hmac.update(hexDecode(salt));
  hmac.update(target);
  return urlSafeBase64(hmac.digest().slice(0, 32));
};
function createUrl(
  url: string,
  options: { width: number; height: number }
): string {
  // eslint-disable-next-line no-param-reassign
  url = url.replace('http://media.localhost/', 's3://');
  console.log(url);
  const encoded_url = urlSafeBase64(url);
  const path = `/resize:auto:${options.width}:${options.height}/${encoded_url}.jpg`;
  console.log(path);
  const signature = sign(
    process.env.IMGPROXY_SALT!,
    path,
    process.env.IMGPROXY_KEY!
  );
  return `http://img.${process.env.DOMAIN}/${signature}${path}`;
}

const ImageUrlSigningPlugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      extend type Group {
        imageSrc: String! @requires(columns: ["image_file"])
        imageSrcSet: String! @requires(columns: ["image_file"])
      }
    `,
    resolvers: {
      Group: {
        imageSrc: async (group) => {
          console.log(group);
          return createUrl(group.imageFile, { width: 0, height: 0 });
        },
        imageSrcSet: async (group) => {
          const widths = [100, 250, 500, 1000, 2000];
          return widths
            .map((width) => {
              return `${createUrl(group.imageFile, {
                width,
                height: 0,
              })} ${width}w`;
            })
            .join(', ');
        },
      },
    },
  };
});

export default ImageUrlSigningPlugin;
