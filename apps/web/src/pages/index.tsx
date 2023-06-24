import dynamic from "next/dynamic";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "@/common/components/AppLayout";
import { Home } from "@/features/landing-page";

const NanoMachine = dynamic(
  async () => await import("../features/nano-machine/components/NanoMachine"),
  {
    ssr: false,
  }
);

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
          element: (
            <AppLayout>
              <NanoMachine />
            </AppLayout>
          ),
        },
      ]);

export default function Root() {
  return <RouterProvider router={router} />;
}
