"use client";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import * as React from "react";

const steps = ["Details", "Upload", "Deploy", "Success!"];

export default function MuiStepper() {
  return (
    <Box sx={{ width: "100%", padding: "50px 0px" }}>
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "&& .MuiStepLabel-label": { color: "#fff" },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
