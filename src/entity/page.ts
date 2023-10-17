import { Rule } from "antd/es/form";

export type Page = {
  pageNum: number;
  pageSize: number;
  total: number;
};

export const OperateName = { add: "新增", up: "修改", see: "查看", del: "删除" };
export enum OperateType {
  Add = "add",
  Up = "up",
  See = "see",
  Del = "del",
}

export class ModalType<T> {
  operateType: OperateType = OperateType.Add;
  nowData: T | null = null;
  modalShow: boolean = false;
  modalLoading: boolean = false;
}

export type TableData<T> = T & {
  key: number;
  // serial: number;
};

export enum FieldType {
  Input_type,
  Tree_type,
  Select_type,
  TextArea_type,
  Input_number,
}

export interface FieldInfo<T> {
  name: keyof T;
  field_type: FieldType;
  place_holder?: string;
  label: string;
  rules?: Rule[];
  min?: number;
  max?: number;
}
