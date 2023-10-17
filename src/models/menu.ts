import { Menu } from "@/entity/menu";
import { create } from "kl_state";
import { MyFetch } from "@/util/fetch";
import { ApiPath } from "@/entity/api_path";
import { StoreBase } from "@/entity/other";
export type MenuStore = StoreBase<Menu>;
export const UseMenuStore = create<MenuStore>((set, get) => {
  return {
    items: [],
    FetchAll: async (force: boolean = false) => {
      if (get().items.length > 0 && force == false) return;
      let menus = (await MyFetch.post(ApiPath.GetMenus)) as Menu[];
      get().setItems(menus);
    },
    setItems: (items) => {
      set((state) => {
        return { ...state, items };
      });
    },
  };
});
