import {
  MAX_BASE_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SYMBOL_LENGTH,
} from "@nanodrop/contracts";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { createContext, useContext } from "react";
import * as yup from "yup";
import { createStore } from "zustand";

const validationSchema = yup.object({
  collectionName: yup
    .string()
    .max(
      MAX_NAME_LENGTH,
      `Collection name can only contain up to ${MAX_NAME_LENGTH} characters`
    )
    .required("Collection name is required"),
  collectionSymbol: yup
    .string()
    .max(
      MAX_SYMBOL_LENGTH,
      `Collection symbol can only contain up to ${MAX_SYMBOL_LENGTH} characters`
    )
    .required("Collection symbol is required"),
  collectionDescription: yup
    .string()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Collection description can only contain up to ${MAX_DESCRIPTION_LENGTH} characters`
    ),
  baseName: yup
    .string()
    .max(
      MAX_BASE_NAME_LENGTH,
      `NFT base name can only contain up to ${MAX_BASE_NAME_LENGTH} characters`
    )
    .required("NFT base name is required"),
});

interface LaunchFormikValues {
  collectionName: string;
  collectionSymbol: string;
  collectionDescription: string;
  goLiveDate: dayjs.Dayjs;
  baseName: string;
  mintCost: string;
  secondaryRoyalties: string;
}

export const useLaunchFormik = (initialValues?: LaunchFormikValues) => {
  const formik = useFormik<LaunchFormikValues>({
    initialValues: initialValues
      ? { ...initialValues }
      : {
          collectionName: "",
          collectionSymbol: "",
          collectionDescription: "",
          goLiveDate: dayjs(),
          baseName: "",
          mintCost: "",
          secondaryRoyalties: "",
        },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return formik;
};

interface LaunchStore {
  formik: ReturnType<typeof useLaunchFormik>;
  setFormik: (formik: ReturnType<typeof useLaunchFormik>) => void;
}

export const launchStore = createStore<LaunchStore>()((set) => ({
  formik: undefined,
  setFormik: (formik) => set({ formik }),
}));

export const LaunchStoreContext = createContext(launchStore);

export default function useLaunchStore() {
  return useContext(LaunchStoreContext);
}
