import { Box, SxProps, Theme } from "@mui/material";

interface AspectRatioBoxProps {
  children?: React.ReactNode;
  aspectWidth: number;
  aspectHeight: number;
  sx?: SxProps<Theme>;
}

export default function AspectRatioBox({
  aspectHeight,
  aspectWidth,
  children,
  sx,
}: AspectRatioBoxProps) {
  return (
    <Box
      sx={{
        height: 0,
        overflow: "hidden",
        position: "relative",
        ...sx,
      }}
      style={{
        paddingTop: `calc(${aspectHeight} / ${aspectWidth} * 100%)`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <>{children}</>
      </Box>
    </Box>
  );
}
