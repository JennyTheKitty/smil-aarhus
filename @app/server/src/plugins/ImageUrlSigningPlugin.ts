import { createHmac } from 'crypto';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { Client } from 'pg';
import { SQLQuery } from 'pg-sql2';

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
  const encoded_url = urlSafeBase64(url);
  const path = `/resize:auto:${options.width}:${options.height}/${encoded_url}.${options.ext}`;
  const signature = sign(
    process.env.IMGPROXY_SALT!,
    path,
    process.env.IMGPROXY_KEY!
  );
  return `http://img.${process.env.DOMAIN}/${signature}${path}`;
}

interface Image {
  path: string;
  width: number;
  height: number;
}

function createResponsiveImage({ path, width, height }: Image) {
  const widths = [32, 64, 128, 256, 512, 1024, 2048];
  const url = `s3://${process.env.AWS_UPLOADS_BUCKET}/${path}`;
  return {
    src: createUrl(url, { width: 0, height: 0, ext: 'jpg' }),
    srcSetWebp: widths
      .map((width) => {
        return `${createUrl(url, {
          width,
          height: 0,
          ext: 'webp',
        })} ${width}w`;
      })
      .join(', '),
    srcSetJpeg: widths
      .map((width) => {
        return `${createUrl(url, {
          width,
          height: 0,
          ext: 'jpg',
        })} ${width}w`;
      })
      .join(', '),
    width,
    height,
  };
}

async function getImage(
  sql: typeof import('pg-sql2'),
  pgClient: Client,
  idQuery: SQLQuery
): Promise<Image> {
  const query = sql.query`select * from smil_aarhus.image where (smil_aarhus.image.id = (${idQuery}))`;
  const { rows } = await pgClient.query(sql.compile(query));
  return rows[0];
}

const ImageUrlSigningPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type Group {
        img: ResponsiveImage! @requires(columns: ["image"])
      }
      extend type EventTag {
        img: ResponsiveImage! @requires(columns: ["image"])
      }
      extend type Picture {
        img: ResponsiveImage! @requires(columns: ["image"])
      }
      extend type Image {
        img: ResponsiveImage! @requires(columns: ["path", "width", "height"])
      }
      extend type Event {
        img: ResponsiveImage @requires(columns: ["id", "override_image"])
      }
      type ResponsiveImage {
        width: Int!
        height: Int!
        src: String!
        srcSetWebp: String!
        srcSetJpeg: String!
      }
    `,
    resolvers: {
      Group: {
        img: async (group, _, context) => {
          return createResponsiveImage(
            await getImage(
              sql,
              context.pgClient,
              sql.query`${sql.value(group.image)}`
            )
          );
        },
      },
      EventTag: {
        img: async (eventTag, _, context) => {
          return createResponsiveImage(
            await getImage(
              sql,
              context.pgClient,
              sql.query`${sql.value(eventTag.image)}`
            )
          );
        },
      },
      Picture: {
        img: async (picture, _, context) => {
          return createResponsiveImage(
            await getImage(
              sql,
              context.pgClient,
              sql.query`${sql.value(picture.image)}`
            )
          );
        },
      },
      Image: {
        img: async (image, _, _context) => {
          return createResponsiveImage(image);
        },
      },
      Event: {
        img: async (event, _, context) => {
          const idQuery = sql.query`SELECT * from smil_aarhus.event_image(${sql.value(
            event.id
          )}, ${sql.value(event.overrideImage)})`;
          const image = await getImage(sql, context.pgClient, idQuery);
          if (!image) return null;
          return createResponsiveImage(image);
        },
      },
    },
  };
});

export default ImageUrlSigningPlugin;
