import { createQR, encodeURL } from "@solana/pay";
import qs from "qs";
import { useCallback, useEffect, useState } from "react";

import useNanoMachine from "./useNanoMachine";

export const useSolanaPayQr = () => {
  const { nanoMachine } = useNanoMachine();

  const [qrRef, setQrRef] = useState<HTMLDivElement>();

  const collectionMint = nanoMachine?.collectionMint.toBase58();
  const creator = nanoMachine?.creator.toBase58();
  const merkleTree = nanoMachine?.merkleTree.toBase58();
  const nanoMachineId = nanoMachine?.id.toBase58();
  useEffect(
    function createQrCode() {
      if (collectionMint && creator && merkleTree && nanoMachineId) {
        const link = new URL(
          `${process.env.NEXT_PUBLIC_API_ORIGIN}/mint?${qs.stringify({
            collectionMint,
            creator,
            merkleTree,
            nanoMachineId,
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
    [collectionMint, creator, merkleTree, nanoMachineId, qrRef]
  );

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setQrRef(node);
    }
  }, []);

  return ref;
};
