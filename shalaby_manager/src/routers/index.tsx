import ErrorHandler from "@/components/error/ErrorHandler";
import AuthLayout from "@/components/layouts/auth.layout";
import MainLayout from "@/components/layouts/main.layout";
// import Layout from "@/components/layout";
import PersistentLogin from "@/components/routing/persistent-login";
import RequireAuth from "@/components/routing/require-auth";
import Login from "@/pages/Auth/Login";
import Attendance from "@/pages/Main-Page/Attendance";
import Payments from "@/pages/Main-Page/Payments";
import Users from "@/pages/Main-Page/Users";
// import Articles from "@/pages/articles";
// import Login from "@/pages/auth/login";
// import LoginLayout from "@/pages/auth/login/layout";
// import MainPage from "@/pages/main page";
// import Resume from "@/pages/resume";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PersistentLogin />}>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route
            path="/unauthorized"
            element={<ErrorHandler status={403} title="Unauthorized!" />}
          />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route element={<RequireAuth />}>
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payments" element={<Payments />} />
          </Route>
        </Route>
        <Route path="/users" element={<MainLayout />}>
          <Route
            element={<RequireAuth allowedRoles={["admin", "superadmin"]} />}
          >
            <Route index element={<Users />} />
          </Route>
        </Route>

        {/* <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="resume" element={<Resume />} />
          <Route path="articles">
            <Route index element={<Articles />} />
          </Route>
        </Route> */}
      </Route>
      <Route
        path="*"
        element={<ErrorHandler status={404} title="Page Not Found!" />}
      />
    </>
  )
);

export default router;
