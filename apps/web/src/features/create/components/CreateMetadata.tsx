import { Box, Button, FormHelperText, Grid, Typography } from "@mui/material";
import { MAX_DESCRIPTION_LENGTH } from "@nanodrop/contracts";

import AppDropzone from "@/common/components/AppDropzone";
import AppInput from "@/common/components/AppInput";
import AppInputLabel from "@/common/components/AppInputLabel";
import FormHelperTextWithLength from "@/common/components/FormHelperTextWithLength";

import useCreateFormik from "../hooks/useCreateFormik";

export default function CreateMetadata({
  createFormik,
}: {
  createFormik: ReturnType<typeof useCreateFormik>;
}) {
  return (
    <Box
      sx={{
        mt: 16,
      }}
    >
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 8 }}>
        2. POAP Metadata
      </Typography>
      <Box
        sx={{
          "& > *": {
            mt: 2,
          },
        }}
      >
        <div>
          <AppInputLabel required>Description</AppInputLabel>
          <AppInput
            multiline
            rows={5}
            placeholder="Describe your POAP!"
            value={createFormik.values.description}
            onChange={(e) => {
              if (e.target.value.length > MAX_DESCRIPTION_LENGTH) {
                e.target.value = e.target.value.slice(
                  0,
                  MAX_DESCRIPTION_LENGTH
                );
              }
              createFormik.setFieldValue("description", e.target.value);
            }}
          />
          <FormHelperTextWithLength
            errorText={
              createFormik.touched.description &&
              createFormik.errors.description
            }
            length={createFormik.values.description.length}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
        </div>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <AppInputLabel>Website</AppInputLabel>
            <AppInput
              placeholder="https://mywebsite.com"
              value={createFormik.values.website}
              name="website"
              onChange={createFormik.handleChange}
            />
            {createFormik.touched.website && !!createFormik.errors.website && (
              <FormHelperText error>
                {createFormik.errors.website}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6} mt={2}>
            <Box>
              <AppDropzone dropzoneState={createFormik.backgroundDropzone}>
                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Typography>
                    Drop or upload background image for the mint page here
                    (optional)
                  </Typography>
                  <Typography variant="caption">
                    (PNG, JPEG - Max. 5 MiB)
                  </Typography>
                </Box>
              </AppDropzone>
              {createFormik.backgroundImage !== null && (
                <Button
                  onClick={() => {
                    createFormik.setBackgroundImage(null);
                  }}
                  sx={{
                    mt: 2,
                  }}
                >
                  Remove background image
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
