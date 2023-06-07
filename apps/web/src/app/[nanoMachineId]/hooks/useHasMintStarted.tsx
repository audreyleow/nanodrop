import { useEffect, useState } from "react";

import { NanoMachine } from "../types/nanoMachine";

export default function useHasMintStarted(
  nanoMachine: NanoMachine | undefined
) {
  const [hasMintStarted, setHasMintStarted] = useState(false);

  useEffect(() => {
    if (!!nanoMachine) {
      setHasMintStarted(
        nanoMachine.goLiveDate === null || nanoMachine.goLiveDate < new Date()
      );
    }
    const interval = setInterval(() => {
      if (!!nanoMachine) {
        setHasMintStarted(
          nanoMachine.goLiveDate === null || nanoMachine.goLiveDate < new Date()
        );
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [hasMintStarted, nanoMachine]);

  return hasMintStarted;
}
