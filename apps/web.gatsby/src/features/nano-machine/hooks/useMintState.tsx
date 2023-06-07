import { useParams } from "@reach/router";
import * as React from "react";
import { useMemo } from "react";

import SolanaLogo from "../../../common/components/SolanaLogo";
import MintCountDown from "../components/MintCountDown";
import useHasMintStarted from "./useHasMintStarted";
import useNanoMachine from "./useNanoMachine";

export default function useMintState(isLoading?: boolean) {
  const params = useParams();
  const { nanoMachine } = useNanoMachine(params.nanoMachineId);

  const hasMintStarted = useHasMintStarted(nanoMachine);
  const hasMintedEnded =
    nanoMachine?.itemsRedeemed === nanoMachine?.itemsAvailable;

  const mintState = useMemo(
    () => ({
      disabled: !nanoMachine || !hasMintStarted || hasMintedEnded,
      message:
        !!nanoMachine && !hasMintStarted ? (
          <MintCountDown />
        ) : !!nanoMachine && hasMintedEnded ? (
          "Sold out"
        ) : (
          <>
            {nanoMachine?.displayPrice === "0" ? (
              "Free mint 🤑"
            ) : (
              <>
                <span>Mint for {nanoMachine?.displayPrice}</span>
                {!nanoMachine || isLoading ? null : <SolanaLogo width={12} />}
              </>
            )}
          </>
        ),
    }),
    [hasMintStarted, hasMintedEnded, isLoading, nanoMachine]
  );

  return mintState;
}
