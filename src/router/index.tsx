import React from "react";
import { AuthNoLogin } from "./RouteAuth";
import BasicLayout from "@/layouts/BasicLayout";
import Loading from "@/components/Loading";
import { BrowerRouter, Route } from "kl_router";
import NotFound from "../pages/errpages/404";
import NoPower from "../pages/errpages/401";
import { ChildProps } from "@/entity/other";

// import PowerAdmin from "../pages/system/PowerAdmin";
// import RoleAdmin from "../pages/system/RoleAdmin";
// import UserAdmin from "../pages/system/UserAdmin";

const [Home, Login, MenuAdmin, PowerAdmin, RoleAdmin, UserAdmin] = [
  () => import("../pages/home"),
  () => import("../pages/login"),
  () => import("../pages/system/MenuAdmin"),
  () => import("../pages/system/PowerAdmin"),
  () => import("../pages/system/RoleAdmin"),
  () => import("../pages/system/UserAdmin"),
].map((item: any) => {
  const TmpLoad = React.lazy(item);
  return (
    <React.Suspense fallback={<Loading />}>
      <TmpLoad />
    </React.Suspense>
  );
});
const RootLayout = (props: ChildProps) => {
  return (
    <AuthNoLogin>
      <BasicLayout>{props.children}</BasicLayout>
    </AuthNoLogin>
  );
};
const RootRouter = () => {
  return (
    <BrowerRouter debug={false}>
      <Route>
        <Route path="/user/login" element={Login} match={{ end: true }}></Route>
        <Route path="/" element={RootLayout} errorElement={NotFound}>
          <Route path="/" redirect="/home" match={{ end: true }} />
          <Route path="home" element={Home} />
          <Route path="system/menuadmin" element={MenuAdmin} />
          <Route path="system/poweradmin" element={PowerAdmin} />
          <Route path="system/roleadmin" element={RoleAdmin} />
          <Route path="system/useradmin" element={UserAdmin} />
          <Route path="401" element={NoPower} />
          <Route path="404" element={NotFound} />
        </Route>
      </Route>
    </BrowerRouter>
  );
};
export default RootRouter;
