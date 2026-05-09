import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { z } from "zod";

import { env } from "~/env";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { s3 } from "~/server/s3";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const uploadRouter = createTRPCRouter({
  /**
   * Returns a presigned PUT URL for the admin to upload a file directly to S3,
   * plus the eventual public CloudFront URL to store on the Product row.
   */
  presign: adminProcedure
    .input(
      z.object({
        contentType: z.string(),
        prefix: z.enum(["graded", "sealed"]),
      }),
    )
    .mutation(async ({ input }) => {
      if (!ALLOWED_TYPES.has(input.contentType)) {
        throw new Error(`Unsupported content type: ${input.contentType}`);
      }
      const ext = input.contentType.split("/")[1] ?? "bin";
      const key = `${input.prefix}/${nanoid()}.${ext}`;

      const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        ContentType: input.contentType,
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
      const publicUrl = `${env.CLOUDFRONT_URL.replace(/\/$/, "")}/${key}`;

      return { uploadUrl, publicUrl, key };
    }),
});
