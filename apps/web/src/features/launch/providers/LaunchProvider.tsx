import React, { useEffect } from "react";
import { useStore } from "zustand";
import { shallow } from "zustand/shallow";

import useLaunchStore, {
  launchStore,
  LaunchStoreContext,
  useLaunchFormik,
} from "../hooks/useLaunchStore";

const FormikLoader = React.memo(function FormikLoader() {
  const launchFormikStore = useLaunchStore();
  const formik = useLaunchFormik();

  const { setFormik } = useStore(
    launchFormikStore,
    (state) => ({
      setFormik: state.setFormik,
    }),
    shallow
  );

  useEffect(
    function updateFormik() {
      setFormik(formik);
    },
    [formik, setFormik]
  );

  return null;
});

interface LaunchStoreProviderProps {
  children: React.ReactNode;
}

export default function LaunchStoreProvider({
  children,
}: LaunchStoreProviderProps) {
  const { formik } = useStore(
    launchStore,
    (state) => ({
      formik: state.formik,
    }),
    shallow
  );

  return (
    <LaunchStoreContext.Provider value={launchStore}>
      <FormikLoader />
      {!formik ? null : children}
    </LaunchStoreContext.Provider>
  );
}
