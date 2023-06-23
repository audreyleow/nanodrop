import { Backdrop, Box, Button, Container, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import ErrorPage from "@/common/components/ErrorPage";

import useCreateFormik from "../hooks/useCreateFormik";
import CreateMetadata from "./CreateMetadata";
import CreatePhases from "./CreatePhases";

const Background3d = dynamic(
  async () =>
    (await import("@/features/nano-machine/components/MintBackground"))
      .Background3d,
  {
    ssr: false,
  }
);

export default function CreateForm() {
  const formik = useCreateFormik();
  const { wallet } = useWallet();

  const [backgroundImageUri, setBackgroundImageUri] = useState<string | null>(
    null
  );

  useEffect(
    function getBackgroundImageUri() {
      if (formik.backgroundImage) {
        const imageUri = URL.createObjectURL(formik.backgroundImage);
        setBackgroundImageUri(imageUri);

        return () => {
          URL.revokeObjectURL(imageUri);
        };
      } else {
        setBackgroundImageUri(null);
      }
    },
    [formik.backgroundImage]
  );

  if (!wallet) {
    return (
      <ErrorPage>
        <Typography variant="h6">Please connect your Solana wallet</Typography>
      </ErrorPage>
    );
  }

  return (
    <>
      <Background3d backgroundImageUri={backgroundImageUri} />
      <Backdrop
        sx={{
          zIndex: 1,
          pointerEvents: "none",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
        open
      />
      <Container
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          position: "relative",
          py: 2,
          zIndex: 2,
        }}
        fixed
        maxWidth="lg"
      >
        <CreatePhases createFormik={formik} />
        <CreateMetadata createFormik={formik} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            mt: 8,
          }}
        >
          <Button type="submit" variant="contained">
            Create Drop
          </Button>
        </Box>
      </Container>
    </>
  );
}