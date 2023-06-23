import { Backdrop, Container } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
      </Container>
    </>
  );
}
