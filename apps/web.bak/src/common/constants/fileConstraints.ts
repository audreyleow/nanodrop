import { Accept } from "react-dropzone";

export const MAX_FILE_SIZE_BYTES = 1000 * 1000 * 10; // 10MB
export const ACCEPTED_IMAGE_TYPES: Accept = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/jpg": [".jpg", ".jpeg"],
  "image/gif": [".gif"],
};
