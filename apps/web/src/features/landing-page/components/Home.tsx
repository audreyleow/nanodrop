"use client";

import { Box, Link, Typography } from "@mui/material";
import dynamic from "next/dynamic";

import NanodropLogo from "@/common/components/NanodropLogo";

import CtaButton from "./CtaButton";
import MorphingArrow from "./MorphingTriangle";

const LandingPageBackground = dynamic(() => import("./LandingPageBackground"), {
  ssr: false,
});

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
          Proof of attendance NFTs + compression
          <br />
          Say hi to ultra-low gas fees.
        </Typography>
        <CtaButton as={Link} href="/create">
          <Typography
            variant="button"
            sx={{
              fontWeight: 700,
              color: "#000000",
            }}
          >
            create your first drop
          </Typography>
          <MorphingArrow />
        </CtaButton>
        <Typography
          sx={{
            mt: 2,
            zIndex: 1,
            color: "#fff",
          }}
          component="a"
          href="/me"
        >
          View my drops
        </Typography>
      </Box>
    </>
  );
};
