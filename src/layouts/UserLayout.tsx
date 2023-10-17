import { Layout } from "antd";
import "./UserLayout.less";
import Footer from "../components/Footer";
import { ChildProps } from "@/entity/other";

const { Content } = Layout;

// ==================
// 本组件
// ==================
export default function UserLayout(props: ChildProps): JSX.Element {
  return (
    <Layout className="page-user">
      <Content className="content">{props.children}</Content>
      <Footer className="user-layout" />
    </Layout>
  );
}
