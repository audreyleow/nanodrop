import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { SignJWT } from "jose";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import AspectRatioBox from "@/common/components/AspectRatioBox";

import useNanoMachine from "../hooks/useNanoMachine";
import { useSolanaPayQr } from "../hooks/useSolanaPayQr";
import SolanaPayQrOverlay from "./SolanaPayQrOverlay";

const DUMMY_JWT =
  "eyJhbGciOiJIUzI1NiJ9.eyJjb2xsZWN0aW9uTWludCI6IkZXZEttd2l1SGlSWE10ZHBFRURkSmp5NUVQUmhHb0xVY0dXdlhUQ0dNeXkiLCJuYW5vTWFjaGluZUlkIjoiNWNoQ3g3dHVmdEJlOFJXclhqZm9uQ21EZVJBMTZlMW82cWp5Z0JmVXdVckgiLCJpYXQiOjE2ODc2NDYzNzcsImV4cCI6MTY4NzY0NjM5Mn0.HMKq1mg-pJCOSXp6T05tGxQZEUdkvcysH1JEwuyaCzg";
const SOLFLARE_ICON =
  "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgNTAgNTAiIHdpZHRoPSI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmMxMGIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYjNmMmUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI2LjQ3ODM1IiB4Mj0iMzQuOTEwNyIgeGxpbms6aHJlZj0iI2EiIHkxPSI3LjkyIiB5Mj0iMzMuNjU5MyIvPjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjAiIGN5PSIwIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDQuOTkyMTg4MzIgMTIuMDYzODc5NjMgLTEyLjE4MTEzNjU1IDUuMDQwNzEwNzQgMjIuNTIwMiAyMC42MTgzKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHI9IjEiIHhsaW5rOmhyZWY9IiNhIi8+PHBhdGggZD0ibTI1LjE3MDggNDcuOTEwNGMuNTI1IDAgLjk1MDcuNDIxLjk1MDcuOTQwM3MtLjQyNTcuOTQwMi0uOTUwNy45NDAyLS45NTA3LS40MjA5LS45NTA3LS45NDAyLjQyNTctLjk0MDMuOTUwNy0uOTQwM3ptLTEuMDMyOC00NC45MTU2NWMuNDY0Ni4wMzgzNi44Mzk4LjM5MDQuOTAyNy44NDY4MWwxLjEzMDcgOC4yMTU3NGMuMzc5OCAyLjcxNDMgMy42NTM1IDMuODkwNCA1LjY3NDMgMi4wNDU5bDExLjMyOTEtMTAuMzExNThjLjI3MzMtLjI0ODczLjY5ODktLjIzMTQ5Ljk1MDcuMDM4NTEuMjMwOS4yNDc3Mi4yMzc5LjYyNjk3LjAxNjEuODgyNzdsLTkuODc5MSAxMS4zOTU4Yy0xLjgxODcgMi4wOTQyLS40NzY4IDUuMzY0MyAyLjI5NTYgNS41OTc4bDguNzE2OC44NDAzYy40MzQxLjA0MTguNzUxNy40MjM0LjcwOTMuODUyNC0uMDM0OS4zNTM3LS4zMDc0LjYzOTUtLjY2MjguNjk0OWwtOS4xNTk0IDEuNDMwMmMtMi42NTkzLjM2MjUtMy44NjM2IDMuNTExNy0yLjEzMzkgNS41NTc2bDMuMjIgMy43OTYxYy4yNTk0LjMwNTguMjE4OC43NjE1LS4wOTA4IDEuMDE3OC0uMjYyMi4yMTcyLS42NDE5LjIyNTYtLjkxMzguMDIwM2wtMy45Njk0LTIuOTk3OGMtMi4xNDIxLTEuNjEwOS01LjIyOTctLjI0MTctNS40NTYxIDIuNDI0M2wtLjg3NDcgMTAuMzk3NmMtLjAzNjIuNDI5NS0uNDE3OC43NDg3LS44NTI1LjcxMy0uMzY5LS4wMzAzLS42NjcxLS4zMDk3LS43MTcxLS42NzIxbC0xLjM4NzEtMTAuMDQzN2MtLjM3MTctMi43MTQ0LTMuNjQ1NC0zLjg5MDQtNS42NzQzLTIuMDQ1OWwtMTIuMDUxOTUgMTAuOTc0Yy0uMjQ5NDcuMjI3MS0uNjM4MDkuMjExNC0uODY4LS4wMzUtLjIxMDk0LS4yMjYyLS4yMTczNS0uNTcyNC0uMDE0OTMtLjgwNmwxMC41MTgxOC0xMi4xMzg1YzEuODE4Ny0yLjA5NDIuNDg0OS01LjM2NDQtMi4yODc2LTUuNTk3OGwtOC43MTg3Mi0uODQwNWMtLjQzNDEzLS4wNDE4LS43NTE3Mi0uNDIzNS0uNzA5MzYtLjg1MjQuMDM0OTMtLjM1MzcuMzA3MzktLjYzOTQuNjYyNy0uNjk1bDkuMTUzMzgtMS40Mjk5YzIuNjU5NC0uMzYyNSAzLjg3MTgtMy41MTE3IDIuMTQyMS01LjU1NzZsLTIuMTkyLTIuNTg0MWMtLjMyMTctLjM3OTItLjI3MTMtLjk0NDMuMTEyNi0xLjI2MjEuMzI1My0uMjY5NC43OTYzLS4yNzk3IDEuMTMzNC0uMDI0OWwyLjY5MTggMi4wMzQ3YzIuMTQyMSAxLjYxMDkgNS4yMjk3LjI0MTcgNS40NTYxLTIuNDI0M2wuNzI0MS04LjU1OTk4Yy4wNDU3LS41NDA4LjUyNjUtLjk0MjU3IDEuMDczOS0uODk3Mzd6bS0yMy4xODczMyAyMC40Mzk2NWMuNTI1MDQgMCAuOTUwNjcuNDIxLjk1MDY3Ljk0MDNzLS40MjU2My45NDAzLS45NTA2Ny45NDAzYy0uNTI1MDQxIDAtLjk1MDY3LS40MjEtLjk1MDY3LS45NDAzcy40MjU2MjktLjk0MDMuOTUwNjctLjk0MDN6bTQ3LjY3OTczLS45NTQ3Yy41MjUgMCAuOTUwNy40MjEuOTUwNy45NDAzcy0uNDI1Ny45NDAyLS45NTA3Ljk0MDItLjk1MDctLjQyMDktLjk1MDctLjk0MDIuNDI1Ny0uOTQwMy45NTA3LS45NDAzem0tMjQuNjI5Ni0yMi40Nzk3Yy41MjUgMCAuOTUwNi40MjA5NzMuOTUwNi45NDAyNyAwIC41MTkzLS40MjU2Ljk0MDI3LS45NTA2Ljk0MDI3LS41MjUxIDAtLjk1MDctLjQyMDk3LS45NTA3LS45NDAyNyAwLS41MTkyOTcuNDI1Ni0uOTQwMjcuOTUwNy0uOTQwMjd6IiBmaWxsPSJ1cmwoI2IpIi8+PHBhdGggZD0ibTI0LjU3MSAzMi43NzkyYzQuOTU5NiAwIDguOTgwMi0zLjk3NjUgOC45ODAyLTguODgxOSAwLTQuOTA1My00LjAyMDYtOC44ODE5LTguOTgwMi04Ljg4MTlzLTguOTgwMiAzLjk3NjYtOC45ODAyIDguODgxOWMwIDQuOTA1NCA0LjAyMDYgOC44ODE5IDguOTgwMiA4Ljg4MTl6IiBmaWxsPSJ1cmwoI2MpIi8+PC9zdmc+";
const PHANTOM_ICON =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjEwOCIgdmlld0JveD0iMCAwIDEwOCAxMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xNzY3XzQzOTczKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDMuMDk5OCA3Ny41MDMxQzM2LjkxODggODYuOTc0MyAyNi41NjE1IDk4Ljk2IDEyLjc3OTYgOTguOTZDNi4yNjQ1IDk4Ljk2IDAgOTYuMjc3OSAwIDg0LjYyNzVDMCA1NC45NTY2IDQwLjUxMDQgOS4wMjU0NCA3OC4wOTc1IDkuMDI1NDRDOTkuNDgwMyA5LjAyNTQ0IDEwOCAyMy44NjA5IDEwOCA0MC43MDc5QzEwOCA2Mi4zMzI0IDkzLjk2NzUgODcuMDU4MSA4MC4wMTg2IDg3LjA1ODFDNzUuNTkxNyA4Ny4wNTgxIDczLjQyIDg0LjYyNzUgNzMuNDIgODAuNzcxOUM3My40MiA3OS43NjYyIDczLjU4NyA3OC42NzY1IDczLjkyMTEgNzcuNTAzMUM2OS4xNjAxIDg1LjYzMzMgNTkuOTcyMiA5My4xNzY3IDUxLjM2ODkgOTMuMTc2N0M0NS4xMDQ0IDkzLjE3NjcgNDEuOTMwNCA4OS4yMzc0IDQxLjkzMDQgODMuNzA1NUM0MS45MzA0IDgxLjY5MzkgNDIuMzQ4IDc5LjU5ODUgNDMuMDk5OCA3Ny41MDMxWk05My44ODY0IDQwLjEyMjJDOTMuODg2NCA0NS4wMzEzIDkwLjk5IDQ3LjQ4NTkgODcuNzUgNDcuNDg1OUM4NC40NjA5IDQ3LjQ4NTkgODEuNjEzNiA0NS4wMzEzIDgxLjYxMzYgNDAuMTIyMkM4MS42MTM2IDM1LjIxMzEgODQuNDYwOSAzMi43NTg2IDg3Ljc1IDMyLjc1ODZDOTAuOTkgMzIuNzU4NiA5My44ODY0IDM1LjIxMzEgOTMuODg2NCA0MC4xMjIyWk03NS40NzczIDQwLjEyMjJDNzUuNDc3MyA0NS4wMzEzIDcyLjU4MDkgNDcuNDg1OSA2OS4zNDA5IDQ3LjQ4NTlDNjYuMDUxOCA0Ny40ODU5IDYzLjIwNDYgNDUuMDMxMyA2My4yMDQ2IDQwLjEyMjJDNjMuMjA0NiAzNS4yMTMxIDY2LjA1MTggMzIuNzU4NiA2OS4zNDA5IDMyLjc1ODZDNzIuNTgwOSAzMi43NTg2IDc1LjQ3NzMgMzUuMjEzMSA3NS40NzczIDQwLjEyMjJaIiBmaWxsPSIjQUI5RkYyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTc2N180Mzk3MyI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";

export default React.memo(function SolanaPayQr() {
  const [jwtSecret, setJwtSecret] = useState<string>();
  const [jwt, setJwt] = useState<string>();
  const solanaPayQrRef = useSolanaPayQr(jwt ?? DUMMY_JWT);
  const [secondsToNewJwt, setSecondsToNewJwt] = useState<number>(10);
  const secondsToNewJwtRef = React.useRef<number>(10);

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
        <SolanaPayQrOverlay jwtSecret={jwtSecret} setJwtSecret={setJwtSecret} />
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
        {QrCode}
      </AspectRatioBox>
      <Typography
        variant="caption"
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 1,
          gap: 1,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Image src={PHANTOM_ICON} width={20} height={20} alt="Phantom icon" />
          <Image
            src={SOLFLARE_ICON}
            width={20}
            height={20}
            alt="solflare icon"
          />
        </Box>
        Works on Phantom or Solflare app
      </Typography>
    </div>
  );
});
