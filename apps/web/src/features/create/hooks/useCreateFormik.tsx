import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from "@nanodrop/contracts";
import { useFormik } from "formik";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as yup from "yup";

const DROPZONE_BASE_SETTINGS = {
  accept: {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
  },
  maxSize: 5 * 1024 * 1024,
};

const validationSchema = yup.object({
  phases: yup
    .array()
    .of(
      yup.object().shape({
        name: yup
          .string()
          .required("Phase name is required")
          .max(MAX_NAME_LENGTH),
        startDate: yup.date().required("Phase start time is required"),
      })
    )
    .required("At least one phase is required")
    .min(1, "At least one phase is required"),
  description: yup
    .string()
    .required("POAP description is required")
    .max(MAX_DESCRIPTION_LENGTH),
  website: yup
    .string()
    .url("Website must be a valid URL that starts with https://"),
});

interface Phase {
  id: string; // used internally as react key
  name: string;
  startDate: string;
  image: File;
}

interface CreateValues {
  phases: Phase[];
  description: string;
  website: string;
}

const MAX_NUMBER_OF_PHASES = 3;

export default function useCreateFormik() {
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);

  const getOnDrop = useCallback(
    (
        selectedFilesCount: number,
        maxFiles: number,
        setSelectedFiles?: (newFiles: File[]) => void
      ) =>
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const exceededMaxFiles =
          acceptedFiles.length + selectedFilesCount > maxFiles;
        if (rejectedFiles.length > 0 || exceededMaxFiles) {
          const firstErrorCode = rejectedFiles?.[0]?.errors?.[0]?.code;
          const errorMessage =
            firstErrorCode === "too-many-files" || exceededMaxFiles
              ? `You can only upload ${maxFiles} ${
                  maxFiles === 1 ? "file" : "files"
                } in total. Remove some files and try again.`
              : firstErrorCode === "file-invalid-type"
              ? "Only *.png and *.jpeg files are allowed"
              : firstErrorCode === "file-too-large"
              ? `File size must be less than 5MB`
              : rejectedFiles[0].errors[0].message;

          toast.error(errorMessage);
        } else if (setSelectedFiles) {
          setSelectedFiles(acceptedFiles);
        }
      },
    []
  );
  const formik = useFormik<CreateValues>({
    initialValues: {
      phases: [],
      description: "",
      website: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const phasesDropzone = useDropzone({
    ...DROPZONE_BASE_SETTINGS,
    onDrop: getOnDrop(
      formik.values.phases.length,
      MAX_NUMBER_OF_PHASES,
      (newFiles) => {
        const currentPhases = formik.values.phases;
        const newPhases: Phase[] = newFiles.map((image) => ({
          name: "",
          startDate: "",
          image,
          id: nanoid(),
        }));

        formik.setFieldValue("phases", [...currentPhases, ...newPhases]);
      }
    ),
    maxFiles: MAX_NUMBER_OF_PHASES,
  });

  const backgroundDropzone = useDropzone({
    ...DROPZONE_BASE_SETTINGS,
    onDrop: getOnDrop(0, 1, (newFiles) => {
      setBackgroundImage(newFiles[0]);
    }),
    maxFiles: 1,
  });

  return {
    ...formik,
    phasesDropzone,
    backgroundDropzone,
    backgroundImage,
    setBackgroundImage,
  };
}
