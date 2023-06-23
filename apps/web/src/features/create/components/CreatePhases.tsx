import { Box, Grid, Typography } from "@mui/material";

import AppDropzone from "@/common/components/AppDropzone";

import useCreateFormik from "../hooks/useCreateFormik";
import CreatePhase from "./CreatePhase";

export default function CreatePhases({
  createFormik,
}: {
  createFormik: ReturnType<typeof useCreateFormik>;
}) {
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
          <Typography variant="caption">
            (PNG, JPEG, GIF - Max. 5 MiB)
          </Typography>
        </Box>
      </AppDropzone>
      <Grid container spacing={8}>
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
                createFormik.touched.phases?.[index]?.name &&
                (createFormik.errors.phases?.[index] as any)?.name,
              startDate:
                createFormik.touched.phases?.[index]?.startDate &&
                (createFormik.errors.phases?.[index] as any)?.startDate,
            }}
          />
        ))}
      </Grid>
    </Box>
  );
}
