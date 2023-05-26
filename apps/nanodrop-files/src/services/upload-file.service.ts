import { Env } from "../types";
import { getAwsClient } from "../utils/getAwsClient";

export const ACCEPTED_TYPES: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/jpg": [".jpg", ".jpeg"],
  "image/gif": [".gif"],
  "application/json": [".json"],
};

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10 MB

export const handleFileUpload = async (request: Request, env: Env) => {
  const formData = await request.formData();

  const fileName = formData.get("fileName");
  const file = formData.get("file") as unknown as File;

  if (!fileName || !file) {
    return new Response("Missing fileName or file", { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return new Response("File too large", { status: 400 });
  }

  // fileName must be in the format of "folder/filename.ext"
  if (fileName.split("/").length !== 2) {
    return new Response("Invalid fileName", { status: 400 });
  }

  const fileExtension = fileName.split(".")[1];
  if (
    !fileExtension ||
    !ACCEPTED_TYPES[file.type]?.includes("." + fileExtension)
  ) {
    return new Response("Invalid file type", { status: 400 });
  }

  // use production endpoint to ensure that we fetch via Cloudflare
  const checkIfExistsResponse = await env["nanodrop-files"].fetch(
    new URL(request.url).origin + "/" + fileName
  );
  if (checkIfExistsResponse.status !== 404) {
    return new Response("File already exists", { status: 400 });
  }

  const url = new URL(request.url);
  url.hostname = env.BUCKET_NAME + "." + env.B2_ENDPOINT;
  url.protocol = "https:";
  url.port = "443";
  url.pathname = "/" + fileName;

  const client = getAwsClient(env);
  return client.fetch(url, {
    method: "PUT",
    headers: [
      ["content-type", file.type],
      ["content-length", "" + file.size],
    ],
    body: file,
  });
};
