import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import { NotificationProvider } from "./context/notificationContext";
import { AppProvider } from "./context/appContext";
import { Home, OurServices, Contact } from "./routes/Pages/routes";
import { Tasks, Timer } from "./routes/Dashboard/routes";
import "./styles/main.scss";

function authGuard() {
  if (!localStorage.getItem("token")) return redirect("/");
  return null;
}

const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/services", element: <OurServices /> },
    { path: "/contact", element: <Contact /> },
    { path: "/tasks", element: <Tasks />, loader: authGuard },
    { path: "/timer", element: <Timer />, loader: authGuard },
  ],
  { basename: "/stagen" },
);

const rootElement = document.getElementById("root")!;
let root: ReturnType<typeof createRoot> | null = null;

if (!root) {
  root = createRoot(rootElement);
}
root.render(
  <NotificationProvider>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </NotificationProvider>,
);
