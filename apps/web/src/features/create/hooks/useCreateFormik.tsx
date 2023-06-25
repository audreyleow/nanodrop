import { Box, Link, Typography } from "@mui/material";
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from "@nanodrop/contracts";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { useFormik } from "formik";
import { nanoid } from "nanoid";
import { ReactNode, useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as yup from "yup";

import { Phase } from "../types/phase";
import createNanoMachine from "../utils/createNanoMachine";
import getCreateAccountsTransaction from "../utils/getCreateAccountsTransaction";
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
          .trim()
          .required("Phase name is required")
          .max(MAX_NAME_LENGTH),
        startDate: yup.date().required("Phase start time is required"),
      })
    )
    .required("At least one mint phase is required")
    .min(1, "At least one mint phase is required"),
  collectionName: yup.string().trim().required("Drop name is required"),
  symbol: yup.string().trim().required("Symbol is required"),
  description: yup
    .string()
    .trim()
    .required("POAP description is required")
    .max(MAX_DESCRIPTION_LENGTH),
  website: yup
    .string()
    .trim()
    .url("Website must be a valid URL that starts with https://"),
});

interface CreateValues {
  phases: Phase[];
  collectionName: string;
  symbol: string;
  description: string;
  website: string;
}

const MAX_NUMBER_OF_PHASES = 3;

export default function useCreateFormik() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [submissionState, setSubmissionState] = useState<ReactNode | null>(
    null
  );
  const formik = useFormik<CreateValues>({
    initialValues: {
      phases: [],
      collectionName: "",
      symbol: "",
      description: "",
      website: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError, validateForm }) => {
      if (wallet.publicKey) {
        try {
          const error = getPhasesError(values.phases);
          if (error !== null) {
            for (let i = 0; i < values.phases.length; i++) {
              setFieldError(`phases.${i}.startDate`, error);
            }
            return;
          }

          const nanoMachineKeypair = Keypair.generate();
          const nanoMachineId = nanoMachineKeypair.publicKey.toBase58();

          setSubmissionState(<Typography>Uploading images...</Typography>);
          await upload({
            nanoMachineId,
            backgroundImage,
            description: values.description,
            phases: values.phases,
            website: values.website,
            collectionName: values.collectionName,
            symbol: values.symbol,
          });

          const collectionMintKeypair = Keypair.generate();
          const transaction = await getCreateAccountsTransaction({
            collectionName: values.collectionName,
            connection,
            metadataUrl: `https://files.nanodrop.it/${nanoMachineId}/collection.json`,
            nanoMachineKeypair,
            phasesCount: values.phases.length,
            symbol: values.symbol,
            walletAdapter: wallet,
            collectionMintKeypair,
          });

          setSubmissionState(<Typography>Sending transaction...</Typography>);

          transaction.sign([nanoMachineKeypair, collectionMintKeypair]);
          const signedTransaction = await wallet.signTransaction(transaction);

          const txId = await connection.sendRawTransaction(
            signedTransaction.serialize()
          );

          setSubmissionState(
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Typography>Sending transaction...</Typography>
              <Link
                href={`https://solscan.io/tx/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View transaction in explorer
              </Link>
            </Box>
          );

          const result = await connection.confirmTransaction(txId);
          if (result.value.err) {
            throw new Error(JSON.stringify(result.value.err));
          }

          await createNanoMachine({
            backgroundImageUrl:
              backgroundImage === null
                ? null
                : `https://files.nanodrop.it/${nanoMachineId}/background.${
                    backgroundImage.type.split("/")[1]
                  }`,
            collectionMint: collectionMintKeypair.publicKey,
            nanoMachineId: nanoMachineKeypair.publicKey,
            phases: values.phases,
            symbol: values.symbol,
            user: wallet.publicKey,
          });

          toast.success("Successfully created POAP drop!");
          window.location.href = `/${nanoMachineId}`;
        } catch (error) {
          toast.error(error.message);
        } finally {
          setSubmissionState(null);
        }
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
    submissionState,
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
