import CanvasBack from "@/components/CanvasBack";
import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { useHistory } from "kl_router";
import LogoImg from "@/assets/logo.png";
import { UseUserStore } from "@/models/user";
import { MyFetch } from "@/util/fetch";
import { TOKEN_KEY } from "@/config";
import "./index.less";
import { Md5 } from "md5-typescript";
import { User, UserStore } from "@/entity/user";
import { ApiPath } from "@/entity/api_path";

function Login() {
  const history = useHistory();
  console.log("render login", history);
  const userstore = UseUserStore() as UserStore;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 是否正在登录中
  useEffect(() => {
    async function fetchdata() {
      const userLoginInfo = localStorage.getItem(TOKEN_KEY);
      if (userLoginInfo) {
        console.log("get userinfo", userLoginInfo);
        const logindata = await FetchUserInfo();
        userstore.SetData(logindata);
        history.push("/");
      }
    }
    fetchdata().catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const FetchUserInfo = async () => {
    const userbase = (await MyFetch.post(ApiPath.GetUserInfo, {})) as User;
    return await userstore.FetchUserDetail(userbase);
  };

  const LoginIn = async (username: string, password: string) => {
    password = Md5.init(password);
    const user_base = (await MyFetch.post(ApiPath.Login, {
      username,
      password,
    })) as User;
    userstore.Login(user_base);
    return await userstore.FetchUserDetail(user_base);
  };

  const onSubmit = async (): Promise<void> => {
    const values = await form.validateFields();
    try {
      setLoading(true);
      const res = await LoginIn(values.username, values.password);
      message.success("登录成功");
      userstore.SetData(res);
      history.replace("/"); // 跳转到主页
    } catch (e) {
      console.trace("submit err", e);
      setLoading(false);
    }
  };

  return (
    <div className="page-login">
      <div className="canvasBox">
        <CanvasBack row={12} col={8} />
      </div>
      <div className={"loginBox show"}>
        <Form form={form}>
          <div className="title">
            <img src={LogoImg} alt="logo" />
            <span>Admin</span>
          </div>
          <div>
            <Form.Item
              name="username"
              rules={[
                { max: 12, message: "最大长度为12位字符" },
                {
                  required: true,
                  whitespace: true,
                  message: "请输入用户名",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ fontSize: 13 }} />}
                size="large"
                id="username" // 为了获取焦点
                placeholder="请输入用户名"
                onPressEnter={onSubmit}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码" },
                { max: 18, message: "最大长度18个字符" },
              ]}
            >
              <Input
                prefix={<KeyOutlined style={{ fontSize: 13 }} />}
                size="large"
                type="password"
                placeholder=""
                onPressEnter={onSubmit}
              />
            </Form.Item>
            <div style={{ lineHeight: "40px" }}>
              <Button className="submit-btn" size="large" type="primary" loading={loading} onClick={onSubmit}>
                {loading ? "请稍后" : "登录"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
