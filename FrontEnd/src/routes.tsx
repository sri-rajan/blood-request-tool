import { createBrowserRouter } from "react-router";
import AdminLogin from "./pages/admin-login";
import AdminDashboard from "./pages/admin-dashboard";
import RequestDetails from "./pages/request-details";
import RequestForm from "./pages/request-form";
import EditRequest from "./pages/edit-request";
import ExpiredLink from "./pages/expired-link";
import ImagePreview from "./pages/image-preview";
import NotFound from "./pages/not-found";
import Settings from "./pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin/settings",
    Component: Settings,
  },
  {
    path: "/admin/request/:id",
    Component: RequestDetails,
  },
  {
    path: "/request/:token",
    Component: RequestForm,
  },
  {
    path: "/request/:token/edit",
    Component: EditRequest,
  },
  {
    path: "/expired",
    Component: ExpiredLink,
  },
  {
    path: "/admin/image/:id",
    Component: ImagePreview,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
