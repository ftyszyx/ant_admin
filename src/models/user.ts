import { create } from "kl_state";
import { MyFetch } from "@/util/fetch";
import { tools } from "@/util/tools";
import { Status, TOKEN_KEY } from "@/config";
import { User, UserStore } from "@/entity/user";
import { Power } from "@/entity/power";
import { Role } from "@/entity/role";
import { Menu } from "@/entity/menu";
import { ApiPath } from "@/entity/api_path";
import { PowerCode } from "@/entity/power_code";
export const UseUserStore = create<UserStore>((set, get) => ({
  user_base: null,
  roles: [], // 当前用户拥有的角色
  menus: [], // 当前用户拥有的已授权的菜单
  powers: [], // 当前用户拥有的权限数据
  powersCode: [], // 当前用户拥有的权限code列表(仅保留了code)，页面中的按钮的权限控制将根据此数据源判断
  SetData: (info) => {
    console.log("login userinfo:", info);
    set((state) => {
      const powersCode = Array.from(new Set(info.powers.reduce((a: string[], b: Power) => [...a, b.code], [])));
      return { ...state, powersCode, ...info };
    });
  },
  LoginOut: () => {
    console.log("logout");
    set((state) => {
      tools.SaveValueLocal(TOKEN_KEY, "");
      return { ...state, powersCode: [], user_base: null, powers: [], roles: [], menus: [] };
    });
  },
  Login: (baseinfo: User) => {
    tools.SaveValueLocal(TOKEN_KEY, baseinfo.token || "");
  },
  HaveLogin: () => {
    return get().user_base != null;
  },
  HaveRight: (powercode: PowerCode): boolean => {
    return get().powersCode.includes(powercode);
  },

  FetchUserDetail: async (user_base: User) => {
    let roles: Role[] = await MyFetch.post(ApiPath.GetRoleById, {
      id: user_base.roles,
    });
    roles = roles.filter((item: Role) => item.status === Status.Enable);
    let menuids = roles.reduce((a: number[], b) => a.concat(b.menus || []), []);
    menuids = Array.from(new Set(menuids.map((item) => item)));
    let menus: Menu[] = await MyFetch.post(ApiPath.GetMenuById, {
      id: menuids,
    });
    menus = menus.filter((item) => item.status == Status.Enable);

    let powerids = roles.reduce((a: number[], b) => a.concat(b.powers || []), []);
    powerids = Array.from(new Set(powerids.map((item) => item)));
    let powers: Power[] = await MyFetch.post(ApiPath.GetPowerById, {
      id: powerids,
    });
    powers = powers.filter((item: Power) => item.status === 1);
    return { user_base, roles, menus, powers };
  },
}));
