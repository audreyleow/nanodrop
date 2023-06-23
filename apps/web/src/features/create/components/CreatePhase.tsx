/* eslint-disable @next/next/no-img-element */
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { MAX_NAME_LENGTH } from "@nanodrop/contracts";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import AppInput from "@/common/components/AppInput";
import AppInputLabel from "@/common/components/AppInputLabel";
import AspectRatioBox from "@/common/components/AspectRatioBox";
import FormHelperTextWithLength from "@/common/components/FormHelperTextWithLength";

export default React.memo(function CreatePhase({
  index,
  image,
  name,
  setName,
  setStartDate,
  startDate,
  deletePhase,
  error,
}: {
  index: number;
  image: File;
  name: string;
  startDate: string;
  setName: (name: string) => void;
  setStartDate: (startDate: string) => void;
  deletePhase: () => void;
  error: {
    name?: string;
    startDate?: string;
  };
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(
    function updateImageUrl() {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    },
    [image]
  );

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={5}
      lg={4}
      sx={{
        overflow: "hidden",
        mt: 8,
      }}
    >
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
        Phase {index + 1}
      </Typography>
      <AspectRatioBox
        aspectHeight={1}
        aspectWidth={1}
        sx={{
          position: "relative",
        }}
      >
        <IconButton
          onClick={deletePhase}
          sx={{
            position: "absolute",
            top: 1,
            right: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          component="img"
          src={imageUrl}
          alt={name}
          sx={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            borderRadius: 2,
          }}
        />
      </AspectRatioBox>
      <Box
        sx={{
          "& > *": {
            mt: 2,
          },
        }}
      >
        <div>
          <AppInputLabel required>Name</AppInputLabel>
          <AppInput
            placeholder="e.g. Hacker house early bird"
            value={name}
            onChange={(e) => {
              if (e.target.value.length > MAX_NAME_LENGTH) {
                e.target.value = e.target.value.slice(0, MAX_NAME_LENGTH);
              }
              setName(e.target.value);
            }}
          />
          <FormHelperTextWithLength
            errorText={error.name}
            length={name.length}
            maxLength={MAX_NAME_LENGTH}
          />
        </div>
        <div>
          <AppInputLabel required>Phase start</AppInputLabel>
          <MobileDateTimePicker
            value={dayjs(startDate)}
            onChange={(newStartDate) => {
              setStartDate(newStartDate.toISOString());
            }}
            minDate={dayjs()}
            slots={{
              textField: AppInput as any,
            }}
          />
          <FormHelperText error={!!error.startDate}>
            {!!error.startDate
              ? error.startDate
              : "Timezone: " + Intl.DateTimeFormat().resolvedOptions().timeZone}
          </FormHelperText>
        </div>
      </Box>
    </Grid>
  );
});
