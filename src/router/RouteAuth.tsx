// 路由守卫
import { useMemo } from "react";
import { Route, useHistory } from "kl_router";
import { UseUserStore } from "../models/user";
import { ChildProps } from "@/entity/other";
import { UserStore } from "@/entity/user";
import { Menu } from "@/entity/menu";

// 未登录的用户，重定向到登录页
export function AuthNoLogin(props: ChildProps) {
  // console.log("auth nologin");
  const userstore = UseUserStore() as UserStore;
  if (!userstore.HaveLogin()) {
    // console.log("no login");
    return <Route redirect="/user/login" path="" />;
  }
  return props.children;
}

// 已登录的用户，不应该进入login页，直接重定向到主页
export function AuthWithLogin(props: ChildProps) {
  const userstore = UseUserStore() as UserStore;
  if (userstore.HaveLogin()) {
    return <Route redirect="/home" path="" />;
  }
  return props.children;
}

// 已登录，但没有权限访问当前页面，跳401
export function AuthNoPower(props: ChildProps) {
  const history = useHistory();
  const userstore = UseUserStore() as UserStore;
  // 判断当前用户是否有该路由权限，如果没有就跳转至401页
  const isHavePower = useMemo(() => {
    let menus: Menu[] = [];
    if (userstore.menus && userstore.menus.length) {
      menus = userstore.menus;
    }
    const m: string[] = menus.map((item) => item.url); // 当前用户拥有的所有菜单
    if (m.includes(history.PathName)) {
      return true;
    }
    return false;
  }, [history.CurLocation]);
  if (!isHavePower && location.pathname !== "/401") {
    return <Route redirect="/home" path="" />;
  }
  return props.children;
}
