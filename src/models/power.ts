import { create } from "kl_state";
import { MyFetch } from "@/util/fetch";
import { ApiPath } from "@/entity/api_path";
import { Power } from "@/entity/power";
import { StoreBase } from "@/entity/other";
export type PowerStore = StoreBase<Power>;
export const usePowerStore = create<PowerStore>((set, get) => {
  return {
    items: [],
    FetchAll: async (force: boolean = false) => {
      if (get().items.length > 0 && force == false) return;
      let powers = (await MyFetch.post(ApiPath.GetPowers)) as Power[];
      get().setItems(powers);
    },
    setItems: (items: Power[]) => {
      set((state) => {
        return { ...state, items };
      });
    },
  };
});
