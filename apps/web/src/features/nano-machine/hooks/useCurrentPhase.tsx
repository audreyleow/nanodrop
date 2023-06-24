import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import { FetchedPhase } from "../types/nanoMachine";

export default function useCurrentPhase(phases: FetchedPhase[] | undefined) {
  const [currentPhase, setCurrentPhase] = useState<FetchedPhase | undefined>();

  const getCurrentPhase = useCallback(() => {
    if (phases) {
      const sortedPhases = [...phases].sort(
        (a, b) => b.startDate.getTime() - a.startDate.getTime()
      );

      const now = new Date();
      const currentPhase = sortedPhases.find((phase) => now >= phase.startDate);

      if (!currentPhase) {
        return setCurrentPhase(sortedPhases.at(-1));
      }

      return setCurrentPhase(currentPhase);
    }
  }, [phases]);

  useEffect(
    function pollCurrentPhase() {
      getCurrentPhase();
      const interval = setInterval(getCurrentPhase, 500);

      return () => {
        clearInterval(interval);
      };
    },
    [getCurrentPhase]
  );

  const { data: phaseImageUrl } = useSWR(
    currentPhase ? currentPhase.metadata : null,
    (metadata) => axios.get(metadata).then((res) => res.data.image)
  );

  if (!currentPhase || !phaseImageUrl) {
    return undefined;
  }

  return {
    ...currentPhase,
    phaseImageUrl: phaseImageUrl as string,
    hasMintStarted: new Date() >= currentPhase.startDate,
  };
}
