import { AwsClient } from "aws4fetch";

import { Env } from "../types";

export const getAwsClient = (env: Env) => {
  const endpointRegex = /^s3\.([a-zA-Z0-9-]+)\.backblazeb2\.com$/;
  const [, aws_region] = env.B2_ENDPOINT.match(endpointRegex) as any;

  const client = new AwsClient({
    accessKeyId: env.B2_APPLICATION_KEY_ID,
    secretAccessKey: env.B2_APPLICATION_KEY,
    service: "s3",
    region: aws_region,
  });

  return client;
};
