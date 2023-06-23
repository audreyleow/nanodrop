import { Box, FormHelperText, Grid, Typography } from "@mui/material";

import AppDropzone from "@/common/components/AppDropzone";

import useCreateFormik from "../hooks/useCreateFormik";
import CreatePhase from "./CreatePhase";

export default function CreatePhases({
  createFormik,
}: {
  createFormik: ReturnType<typeof useCreateFormik>;
}) {
  console.log("createFormik", createFormik.touched);
  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 8 }}>
        1. Create drop phases
      </Typography>
      <AppDropzone dropzoneState={createFormik.phasesDropzone}>
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography>
            Drop or upload POAP image for your mint phases here{" "}
          </Typography>
          <Typography variant="caption">(PNG, JPEG - Max. 5 MiB)</Typography>
        </Box>
      </AppDropzone>
      <Grid
        sx={{
          mt: 0,
        }}
        container
        spacing={8}
      >
        {createFormik.values.phases.map((phase, index) => (
          <CreatePhase
            key={phase.id}
            index={index}
            image={phase.image}
            name={phase.name}
            startDate={phase.startDate}
            setName={(newName) => {
              createFormik.setFieldValue(`phases.${index}.name`, newName);
            }}
            setStartDate={(newStartDate) => {
              createFormik.setFieldValue(
                `phases.${index}.startDate`,
                newStartDate
              );
            }}
            deletePhase={() => {
              createFormik.setFieldValue(
                "phases",
                createFormik.values.phases.filter((_, i) => i !== index)
              );
            }}
            error={{
              name:
                createFormik.touched.website && // hack to show errors
                (createFormik.errors.phases?.[index] as any)?.name,
              startDate:
                createFormik.touched.website && // hack to show errors
                (createFormik.errors.phases?.[index] as any)?.startDate,
            }}
          />
        ))}
      </Grid>
      {createFormik.touched.website &&
        typeof createFormik.errors.phases === "string" && (
          <FormHelperText error>{createFormik.errors.phases}</FormHelperText>
        )}
    </Box>
  );
}
