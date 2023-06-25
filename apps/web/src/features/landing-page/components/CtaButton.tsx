import { styled } from "@mui/material/styles";

const CtaButton = styled("button")<{
  href?: string;
  target?: string;
  ref?: string;
}>({
  outline: "none",
  backgroundColor: "#fff",
  marginTop: 24,
  padding: 12,
  border: 0,
  borderRadius: 0,
  cursor: "pointer",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  gap: 8,
  "&:hover > div": {
    clipPath:
      "polygon(0 45%, 80% 45%, 80% 30%, 100% 50%, 80% 70%, 80% 55%, 0 55%)",
  },
  textDecoration: "none",
});

export default CtaButton;
