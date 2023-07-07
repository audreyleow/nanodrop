import { createCors } from "itty-cors";
import { Router } from "itty-router";

import { handleGetFile } from "./services/get-file.service";
import { handleFileUpload } from "./services/upload-file.service";
import { Env } from "./types";

const ORIGINS = ["https://nanodrop.it", "http://localhost:3000"];

const { preflight, corsify } = createCors({
  origins: ORIGINS,
  methods: ["POST"],
});

const router = Router();

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

router
  .all("*", preflight)
  .post("/upload", async (request: Request, env: Env) => {
    if (!ORIGINS.includes(request.headers.get("origin") ?? "")) {
      return new Response("Unauthorized", { status: 401 });
    }
    await handleFileUpload(request, env);
    return corsify(new Response("OK", { status: 201 }));
  })
  .all("*", () => new Response("404, not found!", { status: 404 }));

const fetchHandler = {
  fetch: (request: Request, ...extra: any) =>
    router
      .handle(request, ...extra)
      .catch(() => corsify(new Response("Error", { status: 500 }))),
};

export default fetchHandler;
