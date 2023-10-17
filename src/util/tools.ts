/** 这个文件封装了一些常用的工具函数 **/
import { Status } from "@/config";
import { Md5 } from "md5-typescript";
import React from "react";
export const tools = {
  /**
   * 保留N位小数
   * 最终返回的是字符串
   * 若转换失败，返回参数原值
   * @param str - 数字或字符串
   * @param x   - 保留几位小数点
   */
  pointX(str: string | number, x = 0): string | number {
    if (!str && str !== 0) {
      return str;
    }
    const temp = Number(str);
    if (temp === 0) {
      return temp.toFixed(x);
    }
    return temp ? temp.toFixed(x) : str;
  },

  /**
   * 去掉字符串两端空格
   * @param str - 待处理的字符串
   */
  trim(str: string): string {
    const reg = /^\s*|\s*$/g;
    return str.replace(reg, "");
  },

  /**
   * 给字符串打马赛克
   * 如：将123456转换为1****6，最多将字符串中间6个字符变成*
   * 如果字符串长度小于等于2，将不会有效果
   * @param str - 待处理的字符串
   */
  addMosaic(str: string): string {
    const s = String(str);
    const lenth = s.length;
    const howmuch = ((): number => {
      if (s.length <= 2) {
        return 0;
      }
      const l = s.length - 2;
      if (l <= 6) {
        return l;
      }
      return 6;
    })();
    const start = Math.floor((lenth - howmuch) / 2);
    const ret = s.split("").map((v, i) => {
      if (i >= start && i < start + howmuch) {
        return "*";
      }
      return v;
    });
    return ret.join("");
  },

  /**
   * 验证字符串
   * 只能为字母、数字、下划线
   * 可以为空
   * @param str - 待处理的字符串
   * **/
  checkStr(str: string): boolean {
    if (str === "") {
      return true;
    }
    const rex = /^[_a-zA-Z0-9]+$/;
    return rex.test(str);
  },

  /**
   * 验证字符串
   * 只能为数字
   * 可以为空
   * @param str - 待处理的字符串
   * **/
  checkNumber(str: string): boolean {
    if (!str) {
      return true;
    }
    const rex = /^\d*$/;
    return rex.test(str);
  },

  /**
   * 正则 手机号验证
   * @param str - 待处理的字符串或数字
   * **/
  checkPhone(str: string | number): boolean {
    const rex = /^1[34578]\d{9}$/;
    return rex.test(String(str));
  },

  /**
   * 正则 邮箱验证
   * @param str - 待处理的字符串
   * **/
  checkEmail(str: string): boolean {
    const rex = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    return rex.test(str);
  },

  /**
   * 字符串加密
   * 简单的加密方法
   * @param code - 待处理的字符串
   */
  compile(code: string): string {
    let c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return c;
  },

  /**
   * 字符串解谜
   * 对应上面的字符串加密方法
   * @param code - 待处理的字符串
   */
  uncompile(code: string): string {
    let c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
  },

  md5(code: string): string {
    return Md5.init(code);
  },

  /**
   * 清除一个对象中那些属性为空值的属性
   * 0 算有效值
   * @param {Object} obj  待处理的对象
   * **/
  clearNull<T>(obj: T): T {
    const temp: any = { ...obj };
    for (const key in temp) {
      if (Object.prototype.hasOwnProperty.call(temp, key)) {
        const value = temp[key];
        if (value === null || value === undefined) {
          delete temp[key];
        }
      }
    }
    return temp as T;
  },
  GetCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  SetCookie(name: string, value: string, days: number): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },
  eraseCookie(name: string) {
    document.cookie = name + "=; Max-Age=-99999999;";
  },
  SaveValueLocal(name: string, value: string) {
    window.localStorage.setItem(name, value);
    tools.SetCookie(name, value, 365);
  },
  getValueLocal(name: string): string | null {
    return window.localStorage.getItem(name) || tools.GetCookie(name);
  },
};

type TreeSrcType = { id: number; title: string; parent: number; status: Status };
export type TreeNodeType<T> = {
  key: string;
  title: string;
  children?: TreeNodeType<T>[];
  parent?: string;
  show?: boolean;
  fake?: boolean;
  data: T;
};
//获取树
export const GetTreeNode = <T extends TreeSrcType>(
  menus: T[]
): { trees: TreeNodeType<T>[]; datalist: TreeNodeType<T>[]; datamap: Map<string, TreeNodeType<T>> } => {
  let tree_nodes: TreeNodeType<T>[] = [];
  let datalist: TreeNodeType<T>[] = [];
  let datamap = new Map<string, TreeNodeType<T>>();
  const menu_map = new Map<string, TreeSrcType>();
  if (menus.length > 0) {
    menus.forEach((item) => {
      menu_map.set(item.id.toString(), item);
    });
    const addTreeNode = (item: TreeSrcType): TreeNodeType<T> => {
      // console.log("add tree node");
      const node_item = { key: item.id.toString(), title: item.title, data: item as T };
      if (datamap.has(node_item.key.toString())) return datamap.get(node_item.key.toString())!;
      if (item.parent != 0) {
        const parent_node = addTreeNode(menu_map.get(item.parent.toString())!);
        if (parent_node.children) {
          parent_node.children.push(node_item);
        } else {
          parent_node.children = [node_item];
        }
      } else {
        tree_nodes.push(node_item);
      }
      datamap.set(node_item.key.toString(), node_item);
      datalist.push(node_item);
      return node_item;
    };
    menus.forEach((item) => {
      addTreeNode(item);
    });
  }
  return { trees: tree_nodes, datalist, datamap };
};

export const FilterTreeKeys = <T>(nodes: TreeNodeType<T>[], search_text: string, show_keys: Set<React.Key>) => {
  if (!search_text || search_text.length == 0) return false;
  let child_have_add = false;
  for (let i = 0; i < nodes.length; i++) {
    let have_add = false;
    const node = nodes[i];
    console.log("filter title", node.title);
    if (node.title.indexOf(search_text) > -1) {
      console.log("add key:", node);
      show_keys.add(node.key);
      child_have_add = true;
      have_add = true;
    }
    if (node.children) {
      if (FilterTreeKeys(node.children, search_text, show_keys)) {
        console.log("add key2", node.key);
        show_keys.add(node.key);
        child_have_add = true;
        have_add = true;
      }
    }
    if (have_add == false) {
      node.show = false;
    }
  }
  return child_have_add;
};
