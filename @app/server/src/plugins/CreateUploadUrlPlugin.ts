import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import { Client as MinioClient } from "minio";
import { v4 as uuidv4 } from "uuid";

const uploadBucket = process.env.AWS_UPLOADS_BUCKET!;

// NOTE: Only for presigning, not actual requests
// Actual requests would need minio as endpoint
var minioClient = new MinioClient({
  endPoint: "media." + process.env.DOMAIN!,
  region: "test",
  port: 80,
  useSSL: false,
  accessKey: process.env.AWS_ACCESS_KEY_ID!,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

interface CreateUploadUrlInput {
  clientMutationId?: string;
  contentType: string;
}

async function generatePresignedPostPolicy(
  key: string,
  contentType: string,
  { expiry = 300, minLength = 1024, maxLength = 10 * 1024 * 1024 }
) {
  try {
    const policy = minioClient.newPostPolicy();
    policy.setBucket(uploadBucket);
    policy.setKeyStartsWith(key);

    const expires = new Date();
    expires.setSeconds(expiry);
    policy.setExpires(expires);

    policy.setContentType(contentType);
    policy.setContentLengthRange(minLength, maxLength);

    return await minioClient.presignedPostPolicy(policy);
  } catch (error) {
    console.error("ERROR GENERATING PRESIGNED POST POLICY: ", error);
    throw new Error(error as any);
  }
}

/** The set of content types that we allow users to upload.*/
const ALLOWED_UPLOAD_CONTENT_TYPES = ["image/jpeg", "image/png"];

const CreateUploadUrlPlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    """
    All input for the \`createUploadUrl\` mutation.
    """
    input CreateUploadUrlInput @scope(isMutationInput: true) {
      """
      An arbitrary string value with no semantic meaning. Will be included in the
      payload verbatim. May be used to track mutations by the client.
      """
      clientMutationId: String

      """
      You must provide the content type (or MIME type) of the content you intend
      to upload. For further information about content types, see
      https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
      """
      contentType: String!
    }

    """
    The output of our \`createUploadUrl\` mutation.
    """
    type CreateUploadUrlPayload @scope(isMutationPayload: true) {
      """
      The exact same \`clientMutationId\` that was provided in the mutation input,
      unchanged and unused. May be used by a client to track mutations.
      """
      clientMutationId: String

      """
      Upload content to this signed URL.
      """
      uploadUrl: String!

      formData: String!
    }

    extend type Mutation {
      """
      Get a signed URL for uploading files. It will expire in 5 minutes.
      """
      createUploadUrl(
        """
        The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
        """
        input: CreateUploadUrlInput!
      ): CreateUploadUrlPayload
    }
  `,
  resolvers: {
    Mutation: {
      async createUploadUrl(
        _query,
        args: { input: CreateUploadUrlInput },
        _resolveInfo
      ) {
        if (!uploadBucket) {
          const err = new Error(
            "Server misconfigured: missing `MINIO_UPLOADS_BUCKET` envvar"
          );
          // @ts-ignore
          err.code = "MSCFG";
          throw err;
        }

        const {
          input: { contentType, clientMutationId },
        } = args;
        if (!ALLOWED_UPLOAD_CONTENT_TYPES.includes(contentType)) {
          throw new Error(
            `Not allowed to upload that type; allowed types include: '${ALLOWED_UPLOAD_CONTENT_TYPES.join(
              "', '"
            )}'`
          );
        }

        const data = await generatePresignedPostPolicy(
          `media/${uuidv4()}`,
          contentType,
          {}
        );
        return {
          clientMutationId,
          uploadUrl: data.postURL,
          formData: JSON.stringify(data.formData),
        };
      },
    },
  },
}));

export default CreateUploadUrlPlugin;
