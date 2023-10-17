/* Footer 页面底部 */
import { Layout } from "antd";
import "./index.less";
import { AUTHOR, AUTHOR_WEB } from "@/config";

const { Footer } = Layout;

interface Props {
  className?: string;
}

export default function FooterCom(props: Props) {
  return (
    <Footer className={`footer ${props.className}`}>
      © 2018-{new Date().getFullYear() + " "}
      <a href={AUTHOR_WEB} target="_blank" rel="author">
        {AUTHOR}
      </a>
      , Inc.
    </Footer>
  );
}
