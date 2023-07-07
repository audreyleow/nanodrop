import { createCors } from "itty-cors";
import { Router } from "itty-router";

import { handleGetFile } from "./services/get-file.service";
import { handleFileUpload } from "./services/upload-file.service";
import { Env } from "./types";

const { preflight, corsify } = createCors({
  origins: ["https://nanodrop.it", "http://localhost:3000"],
  methods: ["POST"],
});

const router = Router();

router.all("*", preflight);

router.get("/*", async (request: Request, env: Env) => {
  const file = await handleGetFile(request, env);

  const { body, headers, status } = file;

  const existingHeaders = Object.fromEntries(headers);

  return new Response(body, {
    status,
    headers: {
      ...existingHeaders,
      "Access-Control-Allow-Origin": request.headers.get("origin") || "",
      "Access-Control-Allow-Methods": "GET",
    },
  });
});

router.post("/upload", async (request: Request, env: Env) => {
  await handleFileUpload(request, env);
  return corsify(
    new Response("OK", {
      status: 201,
    })
  );
});

router.all("*", () => new Response("404, not found!", { status: 404 }));

const fetchHandler = {
  fetch: (request: Request, ...extra: any) =>
    router
      .handle(request, ...extra)
      .catch(() => new Response("Error", { status: 500 })),
};

export default fetchHandler;
