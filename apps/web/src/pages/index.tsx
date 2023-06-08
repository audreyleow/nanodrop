import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home } from "@/features/landing-page";

import NanoMachine from "../features/nano-machine/components/NanoMachine";

const router =
  typeof window === "undefined"
    ? undefined
    : createBrowserRouter([
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/:nanoMachineId",
          element: <NanoMachine />,
        },
      ]);

export default function Root() {
  return <RouterProvider router={router} />;
}
