import { createCors } from "itty-cors";
import { Router } from "itty-router";

import { handleGetFile } from "./services/get-file.service";
import { handleFileUpload } from "./services/upload-file.service";
import { Env } from "./types";

const { preflight, corsify } = createCors({
  origins: ["*"],
});

const router = Router();

router.all("*", preflight);

router.get("/*", async (request: Request, env: Env) => {
  const file = await handleGetFile(request, env);
  return corsify(
    new Response(file.body, {
      status: file.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": file.headers.get("Content-Type") || "",
      },
    })
  );
});

router.post("/upload", async (request: Request, env: Env) => {
  await handleFileUpload(request, env);
  return corsify(
    new Response("OK", {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
  );
});

router.all("*", () => new Response("404, not found!", { status: 404 }));

const fetchHandler = {
  fetch: (request: Request, ...extra: any) =>
    router
      .handle(request, ...extra)
      .catch(() => new Response("Error", { status: 500 }))
      .then(corsify),
};

export default fetchHandler;
