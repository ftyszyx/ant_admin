import { Status } from "@/config";
import { Menu } from "@/entity/menu";
import { StoreBase } from "@/entity/other";
import { OperateName, OperateType } from "@/entity/page";
import { GetPowerTree, Power } from "@/entity/power";
import { Role } from "@/entity/role";
import { UseMenuStore } from "@/models/menu";
import { usePowerStore } from "@/models/power";
import { FilterTreeKeys, GetTreeNode, TreeNodeType } from "@/util/tools";
import { Form, Input, InputNumber, Modal, Select, Tree } from "antd";
import TextArea from "antd/es/input/TextArea";
import { DataNode } from "antd/es/tree";
import React, { useEffect, useMemo, useState } from "react";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
interface RoleEditProps {
  title?: string;
  data: Role | null;
  show: boolean;
  operate_type: OperateType;
  onOk?: (info?: Role) => Promise<void>;
  onCancel?: () => void;
  loading: boolean; // 提交表单时，树的确定按钮是否处于等待状态
}
export function RenderTreeItem<T>(data: TreeNodeType<T>[], search: string, dest: DataNode[]) {
  data.forEach((item) => {
    const index = item.title.indexOf(search);
    const beforestr = item.title.substring(0, index);
    const afterstr = item.title.substring(index + search.length);
    const title =
      index > -1 ? (
        <span>
          {beforestr} <span style={{ color: "red" }}>{search}</span>
          {afterstr}
        </span>
      ) : (
        <span>{item.title}</span>
      );
    if (item.show !== false) {
      if (item.children) {
        const childs: DataNode[] = [];
        RenderTreeItem(item.children, search, childs);
        dest.push({ title, key: item.key, children: childs });
      } else {
        dest.push({ title, key: item.key });
      }
    }
  });
}
export default function RolePowerEdit(props: RoleEditProps) {
  const [forminfo] = Form.useForm<Role>();
  const [menuSearch, SetMenuSearch] = useState("");
  const [powerSearch, SetPowerSearch] = useState("");
  const [MenuChecks, SetMenuChecks] = useState<React.Key[]>([]);
  const [PowerChecks, SetPowerChecks] = useState<React.Key[]>([]);
  const [expandedMenuKeys, setExpandedMenuKeys] = useState<React.Key[]>([]);
  const [autoExpandMenuParent, setAutoExpandMenuParent] = useState(true);
  const [expandedPowerKeys, setExpandedPowerKeys] = useState<React.Key[]>([]);
  const [autoExpandPowerParent, setAutoExpandPowerParent] = useState(true);
  const menu_store = UseMenuStore() as StoreBase<Menu>;
  const power_store = usePowerStore() as StoreBase<Power>;
  const onMenuExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedMenuKeys(newExpandedKeys);
    setAutoExpandMenuParent(false);
  };
  console.info("render power edit");
  useEffect(() => {
    if (props.operate_type == OperateType.Add) {
      forminfo.resetFields();
    } else {
      forminfo.setFieldsValue({ ...props.data });
    }
    console.log("form info:", forminfo.getFieldValue("status"));
    getData();
  }, []);
  const getData = async () => {
    menu_store.FetchAll();
    power_store.FetchAll();
  };
  const onPowerExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedPowerKeys(newExpandedKeys);
    setAutoExpandPowerParent(false);
  };
  const onOk = async () => {
    if (props.operate_type == OperateType.See) props.onOk?.();
    const values = await forminfo.validateFields();
    values.menus = MenuChecks as number[];
    values.powers = PowerChecks.filter((x) => {
      let info = power_treeinfo.datamap.get(x);
      return info?.fake !== true;
    }) as number[];
    console.log("form value:", values);
    await props.onOk?.({ ...values });
  };
  const onCancel = () => {
    console.log("oncancel");
    props.onCancel?.();
  };

  const menu_treeinfo = useMemo(() => {
    const res = GetTreeNode(menu_store.items.filter((x) => x.status == Status.Enable));
    return res;
  }, [menu_store.items]);
  const power_treeinfo = useMemo(() => {
    const res = GetPowerTree(power_store.items.filter((x) => x.status == Status.Enable));
    return res;
  }, [power_store.items]);
  const onMenuSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    SetMenuSearch(value);
    const show_keys = new Set<React.Key>();
    menu_treeinfo.datalist.forEach((item) => {
      item.show = true;
    });
    FilterTreeKeys(menu_treeinfo.trees, value, show_keys);
    setExpandedMenuKeys(Array.from(show_keys));
  };
  const onPowerSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    SetPowerSearch(value);
    const show_keys = new Set<React.Key>();
    power_treeinfo.datalist.forEach((item) => {
      item.show = true;
    });
    FilterTreeKeys(power_treeinfo.trees, value, show_keys);
    setExpandedPowerKeys(Array.from(show_keys));
  };
  const menu_treedata = useMemo(() => {
    const rootnodes: DataNode[] = [];
    RenderTreeItem(menu_treeinfo.trees, menuSearch, rootnodes);
    return rootnodes;
  }, [expandedMenuKeys, menu_treeinfo]);
  const power_treedata = useMemo(() => {
    const rootnodes: DataNode[] = [];
    RenderTreeItem(power_treeinfo.trees, powerSearch, rootnodes);
    return rootnodes;
  }, [expandedPowerKeys, power_treeinfo]);
  return (
    <Modal
      className="role-edit-page"
      zIndex={10001}
      width={750}
      title={props.title || OperateName[props.operate_type]}
      open={props.show}
      onOk={onOk}
      okText={"确定"}
      cancelText={"取消"}
      onCancel={onCancel}
      confirmLoading={props.loading}
    >
      <Form initialValues={{ status: Status.Enable }} form={forminfo} {...formItemLayout}>
        <Form.Item name="title" label="角色名">
          <Input placeholder="请输入角色名" disabled={props.operate_type == "see"} />
        </Form.Item>
        <Form.Item label="描述" name="desc" rules={[{ max: 100, message: "最多输入100个字符" }]}>
          <TextArea rows={4} disabled={props.operate_type === "see"} autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item label="排序" name="sorts" rules={[{ required: true, message: "请输入排序号" }]}>
          <InputNumber min={0} max={99999} style={{ width: "100%" }} disabled={props.operate_type === "see"} />
        </Form.Item>
        <Form.Item label="状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
          <Select
            disabled={props.operate_type === OperateType.See}
            options={[
              { value: Status.Enable, label: "启用" },
              { value: Status.Disable, label: "禁用" },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item label="菜单权限">
          <Input
            value={menuSearch}
            style={{ marginBottom: 8 }}
            onChange={onMenuSearchChange}
            placeholder="输入关键字进行过滤"
          ></Input>
        </Form.Item>
        <Form.Item>
          <Tree
            disabled={props.operate_type == OperateType.See}
            checkable
            onCheck={(checked) => {
              SetMenuChecks(checked as React.Key[]);
            }}
            checkedKeys={MenuChecks}
            onExpand={onMenuExpand}
            autoExpandParent={autoExpandMenuParent}
            expandedKeys={expandedMenuKeys}
            treeData={menu_treedata}
          />
        </Form.Item>
        <Form.Item label="接口权限">
          <Input
            value={powerSearch}
            style={{ marginBottom: 8 }}
            onChange={onPowerSearchChange}
            placeholder="输入关键字进行过滤"
          ></Input>
        </Form.Item>
        <Form.Item>
          <Tree
            checkable
            disabled={props.operate_type == OperateType.See}
            onCheck={(checked) => {
              SetPowerChecks(checked as React.Key[]);
            }}
            checkedKeys={PowerChecks}
            onExpand={onPowerExpand}
            autoExpandParent={autoExpandPowerParent}
            expandedKeys={expandedPowerKeys}
            treeData={power_treedata}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
