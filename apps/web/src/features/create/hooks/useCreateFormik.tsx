import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from "@nanodrop/contracts";
import { Keypair } from "@solana/web3.js";
import { useFormik } from "formik";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as yup from "yup";

import { Phase } from "../types/phase";
import generateMetadata from "../utils/generateMetadata";
import upload from "../utils/upload";

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
    .required("At least one mint phase is required")
    .min(1, "At least one mint phase is required"),
  description: yup
    .string()
    .required("POAP description is required")
    .max(MAX_DESCRIPTION_LENGTH),
  website: yup
    .string()
    .url("Website must be a valid URL that starts with https://"),
});

interface CreateValues {
  phases: Phase[];
  description: string;
  website: string;
}

const MAX_NUMBER_OF_PHASES = 3;

export default function useCreateFormik() {
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [submissionState, setSubmissionState] = useState<string | null>(null);

  const formik = useFormik<CreateValues>({
    initialValues: {
      phases: [],
      description: "",
      website: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const error = getPhasesError(values.phases);
        if (error !== null) {
          for (let i = 0; i < values.phases.length; i++) {
            setFieldError(`phases.${i}.startDate`, error);
          }
        }

        const nanoMachineKeypair = Keypair.generate();
        const nanoMachineId = nanoMachineKeypair.publicKey.toBase58();

        setSubmissionState("Uploading images");
        await upload({
          nanoMachineId,
          backgroundImage,
          description: values.description,
          phases: values.phases,
          website: values.website,
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setSubmissionState(null);
      }
    },
  });

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

const getPhasesError = (phases: Phase[]) => {
  const startDateSet = new Set<string>();

  for (const phase of phases) {
    if (startDateSet.has(phase.startDate)) {
      return "Phase start dates must be unique";
    }

    startDateSet.add(phase.startDate);
  }

  return null;
};
