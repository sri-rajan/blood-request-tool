import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/sonner";
import "../styles/index.css";
import "../styles/tailwind.css";
import "../styles/theme.css";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
