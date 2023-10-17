import { Status } from "@/config";
// 菜单添加，修改时的参数类型
export interface Menu {
  id: number; // ID,添加时可以没有id
  title: string; // 标题
  icon: string; // 图标
  url: string; // 链接路径
  parent: number; // 父级ID
  desc: string; // 描述
  sorts: number; // 排序编号
  status: Status; // 状态，1启用，0禁用
  children?: number[]; // 子菜单
}
