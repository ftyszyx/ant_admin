import React from "react";
export type ChildProps = {
  children?: React.ReactNode;
};

export interface StoreBase<T> {
  items: T[]; // 拥有的所有菜单对象
  setItems: (items: T[]) => void;
  FetchAll: (force?: boolean) => Promise<void>;
}
