import { Status } from "@/config";
import { User } from "./user";

export interface IdItem {
  id?: number;
}

// 接口的返回值类型
export interface ApiResp<T> {
  status: number; // 状态，200成功
  data?: T; // 返回的数据
  message?: string; // 返回的消息
}
export interface ListResp<T> {
  list: T[];
  total: number;
}

export interface PageReq {
  pageNum: number;
  pageSize: number;
}
export interface LoginReq {
  username: string;
  password: string;
}

export interface LoginResp extends User {
  token: string;
}

export interface UserListReq extends PageReq {
  username: string;
  status: number;
}
export interface RoleReq extends PageReq {
  title: string;
  status: Status;
}
export interface AddResp {
  id: number;
}

export enum AddOrDelType {
  Add = 1,
  Del = 0,
}
export class UpRolePowerReq {
  role_ids: number[] = [];
  power_id: number = 0;
}

export class UpRoleMenuReq {
  role_ids: number[] = [];
  menu_id: number = 0;
}
