import { Status } from "@/config";
import { TreeNodeType } from "@/util/tools";
import React from "react";
// 权限添加修改时的参数类型
export interface Power {
  id: number; // ID, 添加时可以没有id
  title: string; // 标题
  code: string; // CODE
  desc: string; // 描述
  sorts: number; // 排序
  status: Status; // 状态 1启用，0禁用
}

export const GetPowerTree = (
  powers: Power[]
): { trees: TreeNodeType<Power>[]; datalist: TreeNodeType<Power>[]; datamap: Map<React.Key, TreeNodeType<Power>> } => {
  let trees: TreeNodeType<Power>[] = [];
  let datalist: TreeNodeType<Power>[] = [];
  let data_code_map = new Map<React.Key, TreeNodeType<Power>>();
  let data_map = new Map<React.Key, TreeNodeType<Power>>();
  powers.forEach((item) => {
    const code_parent = item.code.split(":")[0].trim();
    const title_arr = item.desc.split("-");
    const title_node = title_arr[1].trim();
    const title_parent = title_arr[0].trim();
    const nodeitem = { key: item.id.toString(), title: title_node, data: item };
    let parent_node = data_code_map.get(code_parent);
    if (!parent_node) {
      parent_node = {
        key: code_parent,
        data: {
          id: item.id + 10000,
          code: code_parent,
          status: Status.Enable,
          sorts: item.sorts,
          title: title_parent,
          desc: title_parent,
        },
        title: title_parent,
        children: [],
        fake: true,
      };
      data_code_map.set(code_parent, parent_node);
      datalist.push(parent_node);
      trees.push(parent_node);
      data_map.set(parent_node.key, nodeitem);
    }
    parent_node.children!.push(nodeitem);
    datalist.push(nodeitem);
    data_map.set(item.id, nodeitem);
  });
  return { trees, datalist, datamap: data_code_map };
};
