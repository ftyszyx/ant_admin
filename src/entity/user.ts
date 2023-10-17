import { Menu } from "./menu";
import { Power } from "./power";
import { PowerCode } from "./power_code";
import { Role } from "./role";
import { Status } from "@/config";
// 用户的基本信息
export interface User {
  id: number; // ID
  username: string; // 用户名
  password: string; // 密码
  phone: string; // 手机
  email: string; // 邮箱
  desc: string; // 描述
  status: Status; // 状态 1启用，0禁用
  roles: number[]; // 拥有的所有角色ID
  token?: string;
}

export type SetUserInfoDef = Pick<UserStore, "user_base" | "roles" | "powers" | "menus">;
export interface UserStore {
  user_base: User | null;
  menus: Menu[]; // 拥有的所有菜单对象
  roles: Role[]; // 拥有的所有角色对象
  powers: Power[]; // 拥有的所有权限对象
  powersCode: string[];
  SetData: (params: SetUserInfoDef) => void;
  LoginOut: () => void;
  HaveLogin: () => boolean;
  Login: (baseinfo: User) => void;
  HaveRight: (code: PowerCode) => boolean;
  FetchUserDetail: (info: User) => Promise<SetUserInfoDef>;
}
