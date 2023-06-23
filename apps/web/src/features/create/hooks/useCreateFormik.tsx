import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from "@nanodrop/contracts";
import { useFormik } from "formik";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as yup from "yup";

const DROPZONE_BASE_SETTINGS = {
  accept: {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/gif": [".gif"],
  },
  maxSize: 5 * 1024 * 1024,
};

const validationSchema = yup.object({
  phases: yup
    .array()
    .min(1)
    .of(
      yup.object({
        name: yup
          .string()
          .required("Phase name is required")
          .max(MAX_NAME_LENGTH),
        startDate: yup.date().required("Phase start date is required"),
      })
    ),
  description: yup
    .string()
    .required("POAP description is required")
    .max(MAX_DESCRIPTION_LENGTH),
  website: yup.string().url("Website must be a valid URL"),
  startDate: yup.date().required("Start date is required"),
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
  startDate: string;
}

const MAX_NUMBER_OF_PHASES = 3;

export default function useCreateFormik() {
  const getOnDrop = useCallback(
    (
        selectedFiles: File[],
        addSelectedFiles: (newFiles: File[]) => void,
        maxFiles: number
      ) =>
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const exceededMaxFiles =
          acceptedFiles.length + selectedFiles.length > maxFiles;
        if (rejectedFiles.length > 0 || exceededMaxFiles) {
          const firstErrorCode = rejectedFiles?.[0]?.errors?.[0]?.code;
          const errorMessage =
            firstErrorCode === "too-many-files" || exceededMaxFiles
              ? `You can only upload ${maxFiles} ${
                  maxFiles === 1 ? "file" : "files"
                } in total. Remove some files and try again.`
              : firstErrorCode === "file-invalid-type"
              ? "Only *.png, *.jpeg, and *.gif files are allowed"
              : firstErrorCode === "file-too-large"
              ? `File size must be less than 5MB`
              : rejectedFiles[0].errors[0].message;

          toast.error(errorMessage);
        } else {
          addSelectedFiles(acceptedFiles);
        }
      },
    []
  );
  const formik = useFormik<CreateValues>({
    initialValues: {
      phases: [],
      description: "",
      website: "",
      startDate: new Date().toISOString(),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const phasesDropzone = useDropzone({
    ...DROPZONE_BASE_SETTINGS,
    onDrop: getOnDrop(
      formik.values.phases.map((phase) => phase.image),
      (acceptedImages) => {
        const currentPhases = formik.values.phases;
        const newPhases: Phase[] = acceptedImages.map((image) => ({
          name: "",
          startDate: "",
          image,
          id: nanoid(),
        }));

        formik.setFieldValue("phases", [...currentPhases, ...newPhases]);
      },
      MAX_NUMBER_OF_PHASES
    ),
    maxFiles: MAX_NUMBER_OF_PHASES,
  });

  return { ...formik, phasesDropzone };
}
