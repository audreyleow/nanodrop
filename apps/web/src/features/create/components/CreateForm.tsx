import { Box, Container, Typography } from "@mui/material";
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from "@nanodrop/contracts";
import { useFormik } from "formik";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as yup from "yup";

import AppDropzone from "@/common/components/AppDropzone";
import AppInput from "@/common/components/AppInput";
import AppInputLabel from "@/common/components/AppInputLabel";
import FormHelperTextWithLength from "@/common/components/FormHelperTextWithLength";

import useCreateFormik from "../hooks/useCreateFormik";
import CreatePhases from "./CreatePhases";

const validationSchema = yup.object({
  name: yup.string().required("POAP name is required").max(MAX_NAME_LENGTH),
  description: yup
    .string()
    .required("POAP description is required")
    .max(MAX_DESCRIPTION_LENGTH),
});

export default function CreateForm() {
  const formik = useCreateFormik();

  return (
    <Container
      sx={{
        py: 2,
      }}
      fixed
      maxWidth="lg"
    >
      <CreatePhases createFormik={formik} />
    </Container>
  );

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        "& > *": {
          mb: 16,
        },
      }}
    >
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
        Let&apos;s create a POAP drop
      </Typography>
      <Box>
        <AppInputLabel required>Name</AppInputLabel>
        <AppInput
          value={formik.values.name}
          name="name"
          onChange={(e) => {
            if (e.target.value.length > MAX_NAME_LENGTH) {
              e.target.value = e.target.value.slice(0, MAX_NAME_LENGTH);
            }
            formik.handleChange(e);
          }}
        />
        <FormHelperTextWithLength
          errorText={formik.touched.name && formik.errors.name}
          length={formik.values.name.length}
          maxLength={MAX_NAME_LENGTH}
        />
      </Box>
      <Box>
        <AppInputLabel required>Description</AppInputLabel>
        <AppInput
          multiline
          rows={5}
          value={formik.values.description}
          name="description"
          onChange={(e) => {
            if (e.target.value.length > MAX_DESCRIPTION_LENGTH) {
              e.target.value = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH);
            }
            formik.handleChange(e);
          }}
        />
        <FormHelperTextWithLength
          errorText={formik.touched.description && formik.errors.description}
          length={formik.values.description.length}
          maxLength={MAX_DESCRIPTION_LENGTH}
        />
      </Box>
    </Box>
  );
}
