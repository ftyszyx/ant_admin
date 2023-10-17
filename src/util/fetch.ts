import { baseURL, Net_Retcode, TOKEN_KEY } from "../config";
import { message } from "antd";
import axios from "axios";
import { tools } from "./tools.js";
import Mock from "better-mock";
//@ifdef dev
import mock from "../../mock/app_api";
if (import.meta.env.DEV) {
  Mock.mock(/\/api.*/, (options: any) => {
    const res = mock(options);
    return res;
  });
}
//@endif
export const MyFetch = axios.create({
  baseURL,
  timeout: 0,
  withCredentials: false, //请求是否带上cookie
});

// 请求是否带上cookie
MyFetch.interceptors.request.use(
  (req) => {
    console.log("fetch req ", req.method, req.url, req.data);
    // console.log("get token", tools.getValueLocal("token"));
    req.headers.Authorizaion = tools.getValueLocal(TOKEN_KEY);
    //加载中
    return req;
  },
  (error) => {
    console.trace(error);
    Promise.reject(error);
  }
);
// 对返回的结果做处理
MyFetch.interceptors.response.use(
  (response) => {
    console.log("fetch res:", response.config.url, response.data);
    const res_data = response.data;
    const code = res_data?.status;
    // 没有权限，登录超时，登出，跳转登录
    if (code === Net_Retcode.NEEDLOGIN) {
      message.error("登录超时，请重新登录");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else if (code == Net_Retcode.SUCCESS) {
      // console.log("success");
      return response.data.data;
    } else {
      message.error(res_data?.message);
    }
    return Promise.reject(new Error(res_data?.message));
  },
  (error) => {
    console.trace("reponse err:", error);
    return Promise.reject(error);
  }
);

// export default MyFetch;
