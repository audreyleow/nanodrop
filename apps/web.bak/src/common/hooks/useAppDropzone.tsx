import { useState } from "react";
import { DropzoneOptions, FileError, useDropzone } from "react-dropzone";

export interface UseAppDropzoneParams
  extends Omit<DropzoneOptions, "validator"> {
  fileValidator?: <T extends File>(file: T) => FileError | FileError[];
  filesValidator?: <T extends File>(files: T[]) => FileError | undefined;
}

export default function useAppDropzone({
  fileValidator,
  filesValidator,
  ...rest
}: UseAppDropzoneParams = {}) {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const dropzone = useDropzone({
    validator: fileValidator,
    maxSize: 1024 * 1024 * 10, // 10mb
    onDrop: (acceptedFiles, fileRejections) => {
      const errors: string[] = [];

      if (fileRejections.length > 0) {
        errors.push(fileRejections[0].errors[0].message);
      }
      if (filesValidator && filesValidator(acceptedFiles) !== undefined) {
        errors.push(filesValidator(acceptedFiles).message);
      }

      setErrorMessages(errors);
    },
    ...rest,
  });

  return { dropzone, errorMessages };
}
