// 所有的用户数据
import { User } from "@/entity/user";
import { Menu } from "@/entity/menu";
import { Role } from "@/entity/role";
import { Power } from "@/entity/power";
import { PowerCode } from "@/entity/power_code";
export const users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "123456",
    phone: "13600000000",
    email: "admin@react.com",
    desc: "超级管理员",
    status: 1,
    roles: [1, 2, 3],
  },
  {
    id: 2,
    username: "user1",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员",
    status: 1,
    roles: [2],
  },
  {
    id: 3,
    username: "user2",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员3",
    status: 1,
    roles: [2],
  },
  {
    id: 4,
    username: "user",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员4",
    status: 1,
    roles: [2],
  },
  {
    id: 5,
    username: "user",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员5",
    status: 1,
    roles: [2],
  },
];

// 所有的菜单数据
export const menus: Menu[] = [
  {
    id: 1,
    title: "首页",
    icon: "icon-home",
    url: "/home",
    desc: "首页",
    parent: 0,
    sorts: 0,
    status: 1,
  },
  {
    id: 2,
    title: "系统管理",
    icon: "icon-setting",
    url: "/system",
    desc: "系统管理目录分支",
    sorts: 1,
    parent: 0,
    status: 1,
  },
  {
    id: 3,
    title: "用户管理",
    icon: "icon-user",
    url: "/system/useradmin",
    parent: 2,
    desc: "系统管理/用户管理",
    sorts: 0,
    status: 1,
  },
  {
    id: 4,
    title: "角色管理",
    icon: "icon-team",
    url: "/system/roleadmin",
    parent: 2,
    desc: "系统管理/角色管理",
    sorts: 1,
    status: 1,
  },
  {
    id: 5,
    title: "权限管理",
    icon: "icon-safe",
    url: "/system/poweradmin",
    parent: 2,
    desc: "系统管理/权限管理",
    sorts: 2,
    status: 1,
  },
  {
    id: 6,
    title: "菜单管理",
    icon: "icon-menu",
    url: "/system/menuadmin",
    parent: 2,
    desc: "系统管理/菜单管理",
    sorts: 3,
    status: 1,
  },
];

// 所有的权限数据
export const powers: Power[] = [
  {
    id: 1,
    title: "新增",
    code: PowerCode.UserAdd,
    desc: "用户管理 - 添加权限",
    sorts: 1,
    status: 1,
  },
  {
    id: 2,
    title: "修改",
    code: PowerCode.UserUp,
    desc: "用户管理 - 修改权限",
    sorts: 2,
    status: 1,
  },
  {
    id: 3,
    title: "查看",
    code: PowerCode.UserQuery,
    desc: "用户管理 - 查看权限",
    sorts: 3,
    status: 1,
  },
  {
    id: 4,
    title: "删除",
    code: PowerCode.UserDel,
    desc: "用户管理 - 删除权限",
    sorts: 4,
    status: 1,
  },
  {
    id: 6,
    title: "新增",
    code: PowerCode.RoleAdd,
    desc: "角色管理 - 添加权限",
    sorts: 1,
    status: 1,
  },
  {
    id: 7,
    title: "修改",
    code: PowerCode.RoleUp,
    desc: "角色管理 - 修改权限",
    sorts: 2,
    status: 1,
  },
  {
    id: 8,
    title: "查看",
    code: PowerCode.RoleQuery,
    desc: "角色管理 - 查看权限",
    sorts: 3,
    status: 1,
  },
  {
    id: 9,
    title: "删除",
    code: PowerCode.RoleDel,
    desc: "角色管理 - 删除权限",
    sorts: 5,
    status: 1,
  },

  {
    id: 10,
    title: "新增",
    code: PowerCode.PowerAdd,
    desc: "权限管理 - 添加权限",
    sorts: 1,
    status: 1,
  },
  {
    id: 11,
    title: "修改",
    code: PowerCode.PowerUp,
    desc: "权限管理 - 修改权限",
    sorts: 2,
    status: 1,
  },
  {
    id: 12,
    title: "查看",
    code: PowerCode.PowerQuery,
    desc: "权限管理 - 查看权限",
    sorts: 3,
    status: 1,
  },
  {
    id: 13,
    title: "删除",
    code: PowerCode.PowerDel,
    desc: "权限管理 - 删除权限",
    sorts: 2,
    status: 1,
  },
  {
    id: 14,
    title: "新增",
    code: PowerCode.MenuAdd,
    desc: "菜单管理 - 添加权限",
    sorts: 1,
    status: 1,
  },
  {
    id: 15,
    title: "修改",
    code: PowerCode.MenuUp,
    desc: "菜单管理 - 修改权限",
    sorts: 2,
    status: 1,
  },
  {
    id: 16,
    title: "查看",
    code: PowerCode.MenuQuery,
    desc: "菜单管理 - 查看权限",
    sorts: 3,
    status: 1,
  },
  {
    id: 17,
    title: "删除",
    code: "menu:del",
    desc: "菜单管理 - 删除权限",
    sorts: 2,
    status: 1,
  },
];

// 所有的角色数据
export const roles: Role[] = [
  {
    id: 1,
    title: "超级管理员",
    desc: "超级管理员拥有所有权限",
    sorts: 1,
    status: 1,
    menus: [],
    powers: [],
  },
  {
    id: 2,
    title: "普通管理员",
    desc: "普通管理员",
    sorts: 2,
    status: 1,
    menus: [],
    powers: [],
  },
  {
    id: 3,
    title: "运维人员",
    desc: "运维人员不能删除对象",
    sorts: 3,
    status: 1,
    menus: [],
    powers: [],
  },
];
