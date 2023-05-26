import { Router } from "itty-router";

import { handleGetFile } from "./services/get-file.service";
import { handleFileUpload } from "./services/upload-file.service";

const router = Router();

router.get("/*", handleGetFile);

router.post("/upload", handleFileUpload);

router.all("*", () => new Response("404, not found!", { status: 404 }));

const fetchHandler = { fetch: router.handle };
export default fetchHandler;
