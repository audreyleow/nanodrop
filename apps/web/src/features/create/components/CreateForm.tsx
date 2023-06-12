import { Box, FormHelperText, InputLabel, Typography } from "@mui/material";
import { MAX_NAME_LENGTH } from "@nanodrop/contracts";
import { useFormik } from "formik";
import * as yup from "yup";

import AppInput from "@/common/components/AppInput";
import FormHelperTextWithLength from "@/common/components/FormHelperTextWithLength";

const validationSchema = yup.object({
  name: yup.string().required("POAP name is required").max(MAX_NAME_LENGTH),
});

export default function CreateForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Box
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
        <InputLabel required>Name</InputLabel>
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
    </Box>
  );
}
