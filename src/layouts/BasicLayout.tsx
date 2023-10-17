import { useState } from "react";
import { useHistory } from "kl_router";
import { Layout, message } from "antd";
import "./BasicLayout.less";
import Header from "@/components/Header";
import MenuCom from "@/components/Menu";
import Footer from "@/components/Footer";
import Bread from "@/components/Bread";
import { UseUserStore } from "../models/user";
import { ChildProps } from "@/entity/other";
import { UserStore } from "@/entity/user";
const { Content } = Layout;
// ==================
// 本组件
// ==================
function BasicLayout(props: ChildProps): JSX.Element {
  // console.log("render basic layout");
  const userstore = UseUserStore() as UserStore;
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false); // 菜单栏是否收起
  // 退出登录
  const onLogout = () => {
    console.log("onloginout");
    userstore.LoginOut();
    message.success("退出成功");
    history.push("/user/login");
  };

  return (
    <Layout className="page-basic" hasSider>
      <MenuCom data={userstore.menus} collapsed={collapsed} />
      <Layout>
        <Header
          collapsed={collapsed}
          userinfo={userstore.user_base}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}
        />
        <Bread menus={userstore.menus} />
        <Content className="content">{props.children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
