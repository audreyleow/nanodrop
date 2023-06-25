import { Box, LinearProgress, Typography } from "@mui/material";
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
  "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB3aWR0aD0iMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1MzRiYjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1NTFiZjkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9Ii41IiB4Mj0iLjUiIHkxPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii44MiIvPjwvbGluZWFyR3JhZGllbnQ+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgZmlsbD0idXJsKCNhKSIgcj0iMTciLz48cGF0aCBkPSJtMjkuMTcwMiAxNy4yMDcxaC0yLjk5NjljMC02LjEwNzQtNC45NjgzLTExLjA1ODE3LTExLjA5NzUtMTEuMDU4MTctNi4wNTMyNSAwLTEwLjk3NDYzIDQuODI5NTctMTEuMDk1MDggMTAuODMyMzctLjEyNDYxIDYuMjA1IDUuNzE3NTIgMTEuNTkzMiAxMS45NDUzOCAxMS41OTMyaC43ODM0YzUuNDkwNiAwIDEyLjg0OTctNC4yODI5IDEzLjk5OTUtOS41MDEzLjIxMjMtLjk2MTktLjU1MDItMS44NjYxLTEuNTM4OC0xLjg2NjF6bS0xOC41NDc5LjI3MjFjMCAuODE2Ny0uNjcwMzggMS40ODQ3LTEuNDkwMDEgMS40ODQ3LS44MTk2NCAwLTEuNDg5OTgtLjY2ODMtMS40ODk5OC0xLjQ4NDd2LTIuNDAxOWMwLS44MTY3LjY3MDM0LTEuNDg0NyAxLjQ4OTk4LTEuNDg0Ny44MTk2MyAwIDEuNDkwMDEuNjY4IDEuNDkwMDEgMS40ODQ3em01LjE3MzggMGMwIC44MTY3LS42NzAzIDEuNDg0Ny0xLjQ4OTkgMS40ODQ3LS44MTk3IDAtMS40OS0uNjY4My0xLjQ5LTEuNDg0N3YtMi40MDE5YzAtLjgxNjcuNjcwNi0xLjQ4NDcgMS40OS0xLjQ4NDcuODE5NiAwIDEuNDg5OS42NjggMS40ODk5IDEuNDg0N3oiIGZpbGw9InVybCgjYikiLz48L3N2Zz4K";

export default React.memo(function SolanaPayQr() {
  const [jwtSecret, setJwtSecret] = useState<string>();
  const [jwt, setJwt] = useState<string>();
  const solanaPayQrRef = useSolanaPayQr(jwt ?? DUMMY_JWT);
  const [secondsToNewJwt, setSecondsToNewJwt] = useState<number>(10);
  const secondsToNewJwtRef = React.useRef<number>(10);

  const { nanoMachine } = useNanoMachine();

  const collectionMint = useMemo(
    () => nanoMachine?.collectionMint,
    [nanoMachine?.collectionMint]
  );
  const nanoMachineId = useMemo(
    () => nanoMachine?.id,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nanoMachine?.id.toBase58()]
  );
  const creator = useMemo(
    () => nanoMachine?.creator,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nanoMachine?.creator.toBase58()]
  );

  const getJwt = useCallback(async () => {
    if (jwtSecret && creator && nanoMachineId && collectionMint) {
      const secret = new TextEncoder().encode(jwtSecret);
      const token = await new SignJWT({
        collectionMint,
        nanoMachineId: nanoMachineId.toBase58(),
        creator: creator.toBase58(),
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15s")
        .sign(secret);
      return token;
    }
  }, [collectionMint, creator, jwtSecret, nanoMachineId]);

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
