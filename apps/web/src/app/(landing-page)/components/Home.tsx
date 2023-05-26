"use client";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import NanodropLogo from "@/common/components/NanodropLogo";

import LandingPageBackground from "./LandingPageBackground";
import MorphingArrow from "./MorphingTriangle";

export const Home = () => {
  return (
    <>
      <LandingPageBackground />
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 4,
          paddingTop: "20vh",
          [theme.breakpoints.down("sm")]: {
            paddingTop: "10vh",
          },
        })}
      >
        <Box
          sx={(theme) => ({
            display: "none",
            alignItems: "center",
            mb: 2,
            [theme.breakpoints.down("sm")]: {
              display: "flex",
            },
          })}
        >
          <NanodropLogo width="50" height="50" />
        </Box>
        <Typography
          component="div"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          variant="h1"
        >
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              [theme.breakpoints.down("sm")]: {
                display: "none",
              },
            })}
          >
            <NanodropLogo width="100" height="100" />
          </Box>
          NanoDrop
        </Typography>
        <Typography
          sx={{
            mt: 4,
            textAlign: "center",
          }}
        >
          The first NFT launchpad built for compressed NFTs.
          <br />
          Say hi to ultra-low gas fees.
        </Typography>
        <CtaButton>
          <Typography
            variant="button"
            sx={{
              fontWeight: 700,
            }}
          >
            gm, you are early
          </Typography>
          <MorphingArrow />
        </CtaButton>
      </Box>
    </>
  );
};

const CtaButton = styled("button")((theme) => ({
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
}));
