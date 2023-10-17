import { useState, useCallback } from "react";
import { Link } from "kl_router";
import { Layout, Tooltip, Dropdown } from "antd";
import { MenuFoldOutlined, FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { ChromeOutlined, LogoutOutlined, SmileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
const { Header } = Layout;
import "./index.less";
import { User } from "@/entity/user";
import { AUTHOR, AUTHOR_WEB } from "@/config";

interface Element {
  webkitRequestFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  mozCancelFullScreen?: () => void;
  msRequestFullscreen?: () => void;
  msExitFullscreen?: () => void;
}

interface Props {
  collapsed: boolean; // 菜单的状态
  userinfo: User | null; // 用户信息
  onToggle: () => void; // 菜单收起与展开状态切换
  onLogout: () => void; // 退出登录
}

export default function HeaderCom(props: Props): JSX.Element {
  const [fullScreen, setFullScreen] = useState(false); // 当前是否是全屏状态
  // 进入全屏
  const requestFullScreen = useCallback(() => {
    const element: HTMLElement & Element = document.documentElement;
    // 判断各种浏览器，找到正确的方法
    const requestMethod =
      element.requestFullscreen || // W3C
      element.webkitRequestFullscreen || // Chrome等
      element.mozRequestFullScreen || // FireFox
      element.msRequestFullscreen; // IE11
    if (requestMethod) {
      requestMethod.call(element);
    }
    setFullScreen(true);
  }, []);

  // 退出全屏
  const exitFullScreen = useCallback(() => {
    // 判断各种浏览器，找到正确的方法
    const element: Document & Element = document;
    const exitMethod =
      element.exitFullscreen || // W3C
      element.mozCancelFullScreen || // firefox
      element.webkitExitFullscreen || // Chrome等
      element.msExitFullscreen; // IE11

    if (exitMethod) {
      exitMethod.call(document);
    }
    setFullScreen(false);
  }, []);

  // 退出登录
  const onMenuClick: MenuProps["onClick"] = (e) => {
    // 退出按钮被点击
    if (e.key === "logout") {
      props.onLogout();
    }
  };

  const u = props.userinfo;
  return (
    <Header className="header">
      <MenuFoldOutlined className={props.collapsed ? "trigger fold" : "trigger"} onClick={() => props.onToggle()} />

      <div className="rightBox">
        <Tooltip placement="bottom" title={fullScreen ? "退出全屏" : "全屏"}>
          <div className="full all_center">
            {fullScreen ? (
              <FullscreenExitOutlined className="icon" onClick={exitFullScreen} />
            ) : (
              <FullscreenOutlined className="icon" onClick={requestFullScreen} />
            )}
          </div>
        </Tooltip>
        {u ? (
          <Dropdown
            menu={{
              className: "menu",
              onClick: onMenuClick,
              items: [
                {
                  key: "item-1",
                  label: (
                    <a href={AUTHOR_WEB} target="_blank" rel={AUTHOR}>
                      <ChromeOutlined />
                      {AUTHOR}
                    </a>
                  ),
                },
                {
                  type: "divider",
                },
                {
                  key: "logout",
                  label: (
                    <>
                      <LogoutOutlined />
                      退出登录
                    </>
                  ),
                },
              ],
            }}
            placement="bottomRight"
          >
            <div className="userhead all_center">
              <SmileOutlined />
              <span className="username">{u.username}</span>
            </div>
          </Dropdown>
        ) : (
          <Tooltip placement="bottom" title="点击登录">
            <div className="full all_center">
              <Link to="/user/login">未登录</Link>
            </div>
          </Tooltip>
        )}
      </div>
    </Header>
  );
}