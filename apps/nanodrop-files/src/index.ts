import { createCors } from "itty-cors";
import { Router } from "itty-router";

import { handleGetFile } from "./services/get-file.service";
import { handleFileUpload } from "./services/upload-file.service";
import { Env } from "./types";

const { preflight, corsify } = createCors();

const router = Router();

router.all("*", preflight);

router.get("/*", async (request: Request, env: Env) =>
  corsify(await handleGetFile(request, env))
);

router.post("/upload", handleFileUpload);

router.all("*", () => new Response("404, not found!", { status: 404 }));

const fetchHandler = {
  fetch: (request: Request, ...extra: any) =>
    router
      .handle(request, ...extra)
      .catch(() => new Response("Error", { status: 500 })),
};

export default fetchHandler;
