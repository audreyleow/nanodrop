import { styled } from "@mui/material/styles";

const MorphingArrow = styled("div")({
  width: "28px",
  height: "28px",
  background: "#000000",
  transition: "0.2s",
  clipPath: "polygon(50% 100%, 50% 100%, 0 0, 0 0, 100% 0, 100% 0, 100% 0)",
});

export default MorphingArrow;
