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
  options: { width: number; height: number; ext: string }
): string {
  // eslint-disable-next-line no-param-reassign
  url = url.replace('http://media.localhost/', 's3://');
  const encoded_url = urlSafeBase64(url);
  const path = `/resize:auto:${options.width}:${options.height}/${encoded_url}.${options.ext}`;
  const signature = sign(
    process.env.IMGPROXY_SALT!,
    path,
    process.env.IMGPROXY_KEY!
  );
  return `http://img.${process.env.DOMAIN}/${signature}${path}`;
}

function createResponsiveImage(file: string) {
  const widths = [32, 64, 128, 256, 512, 1024, 2048];
  return {
    src: createUrl(file, { width: 0, height: 0, ext: 'jpg' }),
    srcSetWebp: widths
      .map((width) => {
        return `${createUrl(file, {
          width,
          height: 0,
          ext: 'webp',
        })} ${width}w`;
      })
      .join(', '),
    srcSetJpeg: widths
      .map((width) => {
        return `${createUrl(file, {
          width,
          height: 0,
          ext: 'jpg',
        })} ${width}w`;
      })
      .join(', '),
  };
}

const ImageUrlSigningPlugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      extend type Group {
        image: ResponsiveImage! @requires(columns: ["image_file"])
      }
      extend type EventTag {
        image: ResponsiveImage @requires(columns: ["image_file"])
      }
      extend type Event {
        image: ResponsiveImage # NOTE NEEDS imageField but it's computed
      }
      type ResponsiveImage {
        # width: Int!
        # height: Int!
        src: String!
        srcSetWebp: String!
        srcSetJpeg: String!
      }
    `,
    resolvers: {
      Group: {
        image: async (group) => {
          return createResponsiveImage(group.imageFile);
        },
      },
      EventTag: {
        image: async (eventTag) => {
          return createResponsiveImage(eventTag.imageFile);
        },
      },
      Event: {
        image: async (event) => {
          if (event['@imageFile'] === undefined) return undefined;
          if (event['@imageFile'] === null) return null;
          return createResponsiveImage(event['@imageFile']);
        },
      },
    },
  };
});

export default ImageUrlSigningPlugin;
