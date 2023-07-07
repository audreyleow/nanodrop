import { createQR, encodeURL } from "@solana/pay";
import { SignJWT } from "jose";
import qs from "qs";
import { useCallback, useEffect, useState } from "react";

import useNanoMachine from "./useNanoMachine";

export const useSolanaPayQr = (token: string) => {
  const [qrRef, setQrRef] = useState<HTMLDivElement>();

  useEffect(
    function createQrCode() {
      const link = new URL(
        `${
          process.env.NEXT_PUBLIC_API_ORIGIN
        }/v1/nano-machines/mint?${qs.stringify({
          token,
        })}`
      );

      const size = 384;
      const qr = createQR(
        encodeURL({
          link,
        }),
        size,
        "#FFFFFF"
      );
      if (qrRef) {
        qrRef.innerHTML = "";
        qr.append(qrRef);

        // allow svg to scale according to parent container
        (qrRef.children[0] as SVGElement).setAttribute(
          "viewBox",
          `0 0 ${size} ${size}`
        );
        (qrRef.children[0] as SVGElement).setAttribute("width", `100%`);
        (qrRef.children[0] as SVGElement).setAttribute("height", `100%`);
      }
    },
    [qrRef, token]
  );

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setQrRef(node);
    }
  }, []);

  return ref;
};
