import { Request } from "itty-router";

import { Env } from "../types";
import { filterHeaders } from "../utils/filterHeaders";
import { getAwsClient } from "../utils/getAwsClient";

export const handleGetFile = async (request: Request, env: Env) => {
  const url = new URL(request.url);

  // Remove leading slashes from path
  let path = url.pathname.replace(/^\//, "");
  // Remove trailing slashes
  path = path.replace(/\/$/, "");

  // Don't allow list bucket requests
  if (path.length === 0) {
    // https://endpoint/
    return new Response("404, not found!", { status: 404 });
  }

  url.hostname = env.BUCKET_NAME + "." + env.B2_ENDPOINT;
  url.protocol = "https:";
  url.port = "443";

  const headers = filterHeaders((request as any).headers);

  const client = getAwsClient(env);
  const signedRequest = await client.sign(url.toString(), {
    method: request.method,
    headers,
    body: (request as any).body,
  });

  return fetch(signedRequest);
};
