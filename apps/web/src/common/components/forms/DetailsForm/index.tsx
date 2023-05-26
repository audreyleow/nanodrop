"use client";
import { Box, Typography } from "@mui/material";
import { FileError } from "react-dropzone";
import { useStore } from "zustand";
import { shallow } from "zustand/shallow";

import AssetsUploadInstructions from "@/app/launch/components/AssetsUploadInstructions";
import useLaunchStore from "@/app/launch/hooks/useLaunchStore";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "@/common/constants/fileConstraints";
import useAppDropzone from "@/common/hooks/useAppDropzone";
import getIsValidNumber from "@/common/utils/getIsValidNumber";

import AppDropzone from "../../AppDropzone";
import DateTimePicker from "../../mui/DateTimePicker";
import SolanaLogo from "../../SolanaLogo";
import InputField from "../InputField";
import styles from "./styles.module.css";

const validateAssets = (files: File[]): FileError => {
  if (files.length % 2 !== 0) {
    return {
      message:
        "Number of metadata JSON files do not match number of images chosen",
      code: "different-number-of-metadata-and-images",
    };
  }

  const collectionSize = files.length / 2;
  const images = files.filter((file) => file.type.includes("image"));
  const metadata = files.filter((file) => file.type.includes("json"));
  for (let i = 0; i < collectionSize; i++) {
    const isImageAtIndexFound = images.some(
      (image) => image.name.split(".")[0] === i.toString()
    );

    if (!isImageAtIndexFound) {
      return {
        message: `Image with file name '${i}' not found in a a collection of ${collectionSize} items.`,
        code: "image-not-found",
      };
    }

    const isMetadataAtIndexFound = metadata.some(
      (metadata) => metadata.name.split(".")[0] === i.toString()
    );
    if (!isMetadataAtIndexFound) {
      return {
        message: `Metadata with file name '${i}.json' not found in a collection of of ${collectionSize} items.`,
        code: "metadata-not-found",
      };
    }
  }

  return undefined;
};

export default function DetailsForm() {
  const launchStore = useLaunchStore();
  const { formik } = useStore(
    launchStore,
    (state) => ({
      formik: state.formik,
    }),
    shallow
  );

  const {
    dropzone: collectionImageDropzone,
    errorMessages: collectionImageErrors,
  } = useAppDropzone({
    maxSize: MAX_FILE_SIZE_BYTES,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
  });

  const { dropzone: assetsDropzone, errorMessages: assetsErrors } =
    useAppDropzone({
      maxSize: MAX_FILE_SIZE_BYTES,
      accept: { ...ACCEPTED_IMAGE_TYPES, "application/json": [".json"] },
      maxFiles: 10_000 * 2,
      filesValidator: validateAssets,
    });

  return (
    <div className={styles.detailsForm}>
      <div className={styles.heading}>Collection Details</div>
      <div className={styles.prelimFields}>
        <InputField
          sx={{
            flex: "1 1 auto",
            width: "50%",
          }}
          labelText="Collection Name"
          placeholderText="My Awesome Collection"
          tooltipText="The name of your collection eg. 'My Awesome Collection', will be displayed as the title of your collection."
          inputValue={formik.values.collectionName}
          name="collectionName"
          inputOnChange={formik.handleChange}
          error={
            (formik.values.collectionName.length > 0 ||
              formik.touched.collectionName) &&
            Boolean(formik.errors.collectionName)
          }
          helperText={
            (formik.values.collectionName.length > 0 ||
              formik.touched.collectionName) &&
            formik.errors.collectionName
          }
        />
        <InputField
          sx={{
            flex: "1 1 auto",
            width: "50%",
          }}
          labelText="Symbol"
          placeholderText="AWESOME"
          tooltipText="This is the ticker or symbol which will be used to represent you collection on the blockchain eg. 'AWESOME'."
          inputValue={formik.values.collectionSymbol}
          name="collectionSymbol"
          inputOnChange={formik.handleChange}
          error={
            (formik.values.collectionSymbol.length > 0 ||
              formik.touched.collectionSymbol) &&
            Boolean(formik.errors.collectionSymbol)
          }
          helperText={
            (formik.values.collectionSymbol.length > 0 ||
              formik.touched.collectionSymbol) &&
            formik.errors.collectionSymbol
          }
        />
      </div>
      <InputField
        labelText="Collection Description (Optional)"
        placeholderText="This is an awesome collection of 1000 compressed NFTs on the Solana blockchain."
        tooltipText="The description of your collection."
        inputValue={formik.values.collectionDescription}
        name="collectionDescription"
        inputOnChange={formik.handleChange}
        error={
          (formik.values.collectionDescription.length > 0 ||
            formik.touched.collectionDescription) &&
          Boolean(formik.errors.collectionDescription)
        }
        helperText={
          (formik.values.collectionDescription.length > 0 ||
            formik.touched.collectionDescription) &&
          formik.errors.collectionDescription
        }
        multiline
        rows={4}
      />
      <div>
        <Typography color="rgba(255, 255, 255, 0.7)" gutterBottom>
          Collection image
        </Typography>
        <AppDropzone
          dropzone={collectionImageDropzone}
          errorMessages={collectionImageErrors}
          helperText="(Only .png, .jpg, .jpeg, and .gif images are accepted. Max file size is 10MB.)"
        />
      </div>
      <DateTimePicker
        dateTimeValue={formik.values.goLiveDate}
        setDateTimeValue={(newValue) => {
          formik.setFieldValue("goLiveDate", newValue);
        }}
      />
      <div className={styles.heading}>NFTs Breakdown</div>
      <div className={styles.nftBreakdown}>
        <Box
          sx={{
            width: "100%",
            "& > *": {
              mt: 2,
            },
          }}
        >
          <InputField
            sx={{
              width: "100%",
            }}
            labelText="NFT Base Name"
            placeholderText="Awesome NFT #"
            tooltipText="The base name of your NFT eg. 'Awesome NFT #' will name your NFTs 'Awesome NFT #1', 'Awesome NFT #2', 'Awesome NFT #3' etc."
            inputValue={formik.values.baseName}
            name="baseName"
            inputOnChange={formik.handleChange}
            error={
              (formik.values.baseName.length > 0 || formik.touched.baseName) &&
              Boolean(formik.errors.baseName)
            }
            helperText={
              (formik.values.baseName.length > 0 || formik.touched.baseName) &&
              formik.errors.baseName
            }
          />
          <div className={styles.nameDescription}>
            <InputField
              sx={{
                flex: "1 1 auto",
                width: "50%",
              }}
              labelText="Mint Cost"
              placeholderText="0.1"
              tooltipText="This is the amount of SOL you will receive when one NFT is minted. Max value: 1000 SOL"
              endLogo={<SolanaLogo width={18} />}
              inputValue={formik.values.mintCost}
              inputOnChange={(e) => {
                const value = e.target.value;
                if (
                  getIsValidNumber({
                    value,
                    allowNegative: false,
                    maxDecimals: 9,
                    maxValue: 1000,
                  })
                ) {
                  formik.setFieldValue("mintCost", value);
                }
              }}
            />
            <InputField
              sx={{
                flex: "1 1 auto",
                width: "50%",
              }}
              labelText="Secondary Royalties"
              placeholderText="2"
              tooltipText="This is the percentage royalties you will receive when your NFT is sold on the secondary market. While there are currently no compressed NFT marketplaces on Solana, this will be used in the future when one is built :) Max value: 100%"
              endLogo={<span>%</span>}
              inputValue={formik.values.secondaryRoyalties}
              inputOnChange={(e) => {
                const value = e.target.value;
                if (
                  getIsValidNumber({
                    value,
                    allowNegative: false,
                    maxDecimals: 0,
                    maxValue: 100,
                  })
                ) {
                  formik.setFieldValue("secondaryRoyalties", value);
                }
              }}
            />
          </div>
        </Box>
      </div>
      <Box
        sx={{
          "& > *": {
            mt: 4,
          },
        }}
      >
        <div className={styles.heading}>Upload Your NFT Assets</div>
        <AssetsUploadInstructions />
        <AppDropzone
          dropzone={assetsDropzone}
          errorMessages={assetsErrors}
          helperText="(Only .png, .jpg, .jpeg, and .gif images are accepted. Max file size is 10MB. Max collection size is 10,000)"
        />
      </Box>
      <div>
        {/* <Button
          variant="contained"
          disabled={!allDetailsFilled}
          onClick={handleNext}
        >
          Next
        </Button> */}
      </div>
    </div>
  );
}
