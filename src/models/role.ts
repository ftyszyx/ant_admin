import { create } from "kl_state";
import { MyFetch } from "@/util/fetch";
import { ApiPath } from "@/entity/api_path";
import { Role } from "@/entity/role";
import { StoreBase } from "@/entity/other";
export type RoleStore = StoreBase<Role>;
export const useRoleStore = create<StoreBase<Role>>((set, get) => {
  return {
    items: [],
    FetchAll: async (force: boolean = false) => {
      if (get().items.length > 0 && force == false) return;
      let roles = (await MyFetch.post(ApiPath.GetAllRoles)) as [];
      get().setItems(roles);
    },
    setItems: (items: Role[]) => {
      set((state) => {
        return { ...state, items };
      });
    },
  };
});
