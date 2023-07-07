import { Box, LinearProgress } from "@mui/material";
import { SignJWT } from "jose";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import AspectRatioBox from "@/common/components/AspectRatioBox";

import useNanoMachine from "../hooks/useNanoMachine";
import { useSolanaPayQr } from "../hooks/useSolanaPayQr";
import SolanaPayQrOverlay from "./SolanaPayQrOverlay";
import UnlockDialog from "./UnlockDialog";
import WorksOnText from "./WorksOnText";

const DUMMY_JWT =
  "eyJhbGciOiJIUzI1NiJ9.eyJjb2xsZWN0aW9uTWludCI6IkZXZEttd2l1SGlSWE10ZHBFRURkSmp5NUVQUmhHb0xVY0dXdlhUQ0dNeXkiLCJuYW5vTWFjaGluZUlkIjoiNWNoQ3g3dHVmdEJlOFJXclhqZm9uQ21EZVJBMTZlMW82cWp5Z0JmVXdVckgiLCJpYXQiOjE2ODc2NDYzNzcsImV4cCI6MTY4NzY0NjM5Mn0.HMKq1mg-pJCOSXp6T05tGxQZEUdkvcysH1JEwuyaCzg";

export default React.memo(function SolanaPayQr() {
  const [jwtSecret, setJwtSecret] = useState<string>();
  const [jwt, setJwt] = useState<string>();
  const solanaPayQrRef = useSolanaPayQr(jwt ?? DUMMY_JWT);
  const [secondsToNewJwt, setSecondsToNewJwt] = useState<number>(10);
  const secondsToNewJwtRef = React.useRef<number>(10);
  const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState<boolean>(false);

  const { nanoMachine } = useNanoMachine();

  const nanoMachineId = useMemo(
    () => nanoMachine?.id,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nanoMachine?.id]
  );
  const creator = useMemo(
    () => nanoMachine?.creator,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nanoMachine?.creator]
  );

  const getJwt = useCallback(async () => {
    if (jwtSecret && creator && nanoMachineId) {
      const secret = new TextEncoder().encode(jwtSecret);
      const token = await new SignJWT({
        nanoMachineId: nanoMachineId,
        creator: creator,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15s")
        .sign(secret);
      return token;
    }
  }, [creator, jwtSecret, nanoMachineId]);

  useEffect(
    function initJwt() {
      let hasUnmounted = false;

      if (jwtSecret) {
        (async () => {
          const token = await getJwt();

          if (!hasUnmounted) {
            setJwt(token);
          }
        })();

        return () => {
          hasUnmounted = true;
        };
      }
    },
    [getJwt, jwtSecret]
  );

  useEffect(
    function refreshJwt() {
      let hasUnmounted = false;

      if (!jwtSecret) {
        return;
      }

      const interval = setInterval(() => {
        secondsToNewJwtRef.current -= 1;
        setSecondsToNewJwt(Math.max(secondsToNewJwtRef.current, 0));

        if (secondsToNewJwtRef.current <= 0) {
          (async () => {
            const token = await getJwt();
            if (!hasUnmounted) {
              setJwt(token);
              secondsToNewJwtRef.current = 10;
              setSecondsToNewJwt(10);
            }
          })();
        }
      }, 1000);

      return () => {
        hasUnmounted = true;
        clearInterval(interval);
      };
    },
    [getJwt, jwtSecret]
  );

  const QrCode = useMemo(
    () => (
      <Box
        ref={solanaPayQrRef}
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      />
    ),
    [solanaPayQrRef]
  );

  return (
    <>
      <UnlockDialog
        open={isUnlockDialogOpen}
        onClose={() => setIsUnlockDialogOpen(false)}
        setJwtSecret={setJwtSecret}
      />
      <div>
        <AspectRatioBox
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            mt: 2,
            position: "relative",
          }}
          aspectHeight={1}
          aspectWidth={1}
        >
          <SolanaPayQrOverlay
            openUnlockDialog={() => {
              setIsUnlockDialogOpen(true);
            }}
            jwtSecret={jwtSecret}
          />
          {jwt && (
            <LinearProgress
              variant="determinate"
              value={secondsToNewJwt * 10}
              color="primary"
              sx={{
                height: "0.25rem",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1,
              }}
            />
          )}
          {isUnlockDialogOpen ? null : QrCode}
        </AspectRatioBox>
        <WorksOnText />
      </div>
    </>
  );
});
