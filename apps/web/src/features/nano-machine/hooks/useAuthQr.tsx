import { createQR, encodeURL } from "@solana/pay";
import axios from "axios";
import { createHash } from "crypto";
import qs from "qs";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWRImmutable from "swr/immutable";

import useNanoMachine from "./useNanoMachine";
import usePollTransactionSignature from "./usePollTransactionSignature";

interface UseAuthQrParams {
  setJwtSecret: (jwtSecret: string) => void;
  onClose: () => void;
}

export default function useAuthQr({ onClose, setJwtSecret }: UseAuthQrParams) {
  const { nanoMachine } = useNanoMachine();

  const { data: authMessage } = useSWRImmutable(
    nanoMachine ? `/v1/auth/${nanoMachine.creator}` : null,
    (url) => axios.get<string>(url).then((res) => res.data),
    {
      refreshInterval: 1000 * 30,
    }
  );

  const messageHash = useMemo(
    () =>
      !authMessage
        ? undefined
        : createHash("sha256").update(authMessage).digest("base64"),
    [authMessage]
  );

  const solanaPayReference = usePollTransactionSignature({
    setJwtSecret,
    authMessage,
    onClose,
  });

  const [qrRef, setQrRef] = useState<HTMLDivElement>();
  useEffect(
    function createQrCode() {
      if (messageHash) {
        const link = new URL(
          `${process.env.NEXT_PUBLIC_API_ORIGIN}/v1/auth?${qs.stringify({
            messageHash,
            solanaPayReference,
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
      }
    },
    [messageHash, qrRef, solanaPayReference]
  );

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setQrRef(node);
    }
  }, []);

  return ref;
}
