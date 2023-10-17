import { Status } from "@/config";
// import { FieldInfo, FieldType, OperateType } from "./page";
export interface Role {
  id: number; // ID,添加时可以不传id
  title: string; // 角色名
  desc: string; // 描述
  sorts: number; // 排序编号
  status: Status; // 状态，1启用，0禁用
  menus: number[]; // 添加时可以不传菜单和权限
  powers: number[]; // 添加时可以不传菜单和权限
}

// export const getFromField = () => {
//   let fields: FieldInfo<Role>[] = [
//     { name: "title", label: "角色名", field_type: FieldType.Input_type },
//     { name: "desc", label: "描述", field_type: FieldType.Input_type },
//     { name: "status", label: "状态", field_type: FieldType.Select_type },
//     { name: "sorts", label: "排序", field_type: FieldType.Input_number, min: 0, max: 9999 },
//     { name: "menus", label: "菜单权限", field_type: FieldType.Tree_type },
//     { name: "powers", label: "接口权限", field_type: FieldType.Tree_type },
//   ];
//   return fields;
// };
