/** 权限管理页 **/
import { useState, useMemo, useEffect } from "react";
import { useSetState } from "react-use";
import {
  Button,
  Table,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  message,
  Divider,
  Checkbox,
  TreeSelect,
} from "antd";
import { EyeOutlined, ToolOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
import "./index.less";
import { UseUserStore } from "@/models/user";
import { MyFetch } from "@/util/fetch";
import { UserStore } from "@/entity/user";
import { ModalType, OperateName, OperateType } from "@/entity/page";
import { RoleStore, useRoleStore } from "@/models/role";
import { PowerCode } from "@/entity/power_code";
import { ApiPath } from "@/entity/api_path";
import { Status } from "@/config";
import { ColumnsType } from "antd/es/table";
import { GetTreeNode, TreeNodeType } from "@/util/tools";
import { AddResp, UpRoleMenuReq } from "@/entity/api";
import { MenuStore, UseMenuStore } from "@/models/menu";
import { Menu } from "@/entity/menu";
type MenuTableData = Menu & TreeNodeType<Menu> & { value: number };
function MenuAdmin() {
  const userstore = UseUserStore() as UserStore;
  const menu_store = UseMenuStore() as MenuStore;
  const role_store = useRoleStore() as RoleStore;
  const [form] = Form.useForm<Menu>();
  const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
  // 模态框相关参数控制
  const [modal, setModal] = useSetState(new ModalType<Menu>());
  const [selectRoles, SetSelectRoles] = useState<number[]>([]);
  const [selectParent, setSelectParent] = useState<number>();
  useEffect(() => {
    role_store.FetchAll();
    menu_store.FetchAll();
  }, []);
  // 新增&修改 模态框出现
  const onModalShow = (data: Menu | null, type: OperateType) => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    setTimeout(() => {
      if (type === OperateType.Add) {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        form.setFieldsValue(data!);
        form.setFieldValue("parent", data?.parent == 0 ? undefined : data?.parent);
        const role_ids = role_store.items.reduce((res: number[], item) => {
          if (item.menus?.includes(data!.id)) {
            res.push(item.id);
          }
          return res;
        }, []);
        SetSelectRoles(role_ids);
      }
    });
  };
  // 新增&修改 模态框关闭
  const onClose = () => {
    setModal({ modalShow: false });
  };
  // 新增&修改 提交
  const onOk = async () => {
    if (modal.operateType === OperateType.See) {
      onClose();
      return;
    }
    try {
      const values = await form.validateFields();
      values.parent = selectParent || 0;
      console.log("up value:", values);
      setModal({ modalLoading: true });
      let roleMenus = new UpRoleMenuReq();
      roleMenus.role_ids = selectRoles;
      if (modal.operateType === OperateType.Add) {
        const addres = (await MyFetch.post(ApiPath.AddMenu, values)) as AddResp;
        roleMenus.menu_id = addres.id;
        message.success("添加成功");
      } else {
        values.id = modal.nowData!.id;
        await MyFetch.post(ApiPath.UpMenu, values);
        roleMenus.menu_id = values.id;
        message.success("修改成功");
      }
      await MyFetch.post(ApiPath.UpRoleMenu, roleMenus);
      menu_store.FetchAll(true);
      role_store.FetchAll(true);
      onClose();
    } catch {
      // 未通过校验
    } finally {
      setModal({
        modalLoading: false,
      });
    }
  };
  // 删除一条数据
  const onDel = async (record: Menu) => {
    const params = { id: record.id };
    setLoading(true);
    await MyFetch.post(ApiPath.DelMenu, params);
    menu_store.FetchAll(true);
    message.success("删除成功");
  };
  const roleCheckBoxData = useMemo(() => {
    return role_store.items.map((item) => {
      return { label: item.title, value: item.id };
    });
  }, [role_store.items]);
  // 构建表格字段
  const tableColumns: ColumnsType<TreeNodeType<Menu>> = [
    { title: "标题", dataIndex: "title", key: "title" },
    { title: "地址", dataIndex: "url", key: "url" },
    { title: "描述", dataIndex: "desc", key: "desc" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (v: number) =>
        v === Status.Enable ? <span style={{ color: "green" }}>启用</span> : <span style={{ color: "red" }}>禁用</span>,
    },
    {
      title: "操作",
      key: "control",
      width: 120,
      render: (_v: number, record) => {
        const controls = [];
        userstore.HaveRight(PowerCode.MenuQuery) &&
          record.fake !== true &&
          controls.push(
            <span key="0" className="control-btn green" onClick={() => onModalShow(record.data, OperateType.See)}>
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        userstore.HaveRight(PowerCode.MenuUp) &&
          record.fake !== true &&
          controls.push(
            <span key="1" className="control-btn blue" onClick={() => onModalShow(record.data, OperateType.Up)}>
              <Tooltip placement="top" title="修改">
                <ToolOutlined />
              </Tooltip>
            </span>
          );
        userstore.HaveRight(PowerCode.MenuDel) &&
          record.fake !== true &&
          controls.push(
            <Popconfirm key="2" title="确定删除吗?" okText="确定" cancelText="取消" onConfirm={() => onDel(record.data)}>
              <span className="control-btn red">
                <Tooltip placement="top" title="删除">
                  <DeleteOutlined />
                </Tooltip>
              </span>
            </Popconfirm>
          );
        const result: JSX.Element[] = [];
        controls.forEach((item, index) => {
          if (index) {
            result.push(<Divider key={`line${index}`} type="vertical" />);
          }
          result.push(item);
        });
        return result;
      },
    },
  ];
  const table_tree = useMemo(() => {
    return GetTreeNode(menu_store.items);
  }, [menu_store.items]);
  // 构建表格数据
  const tableData = useMemo(() => {
    table_tree.datalist.forEach((item) => {
      (item as MenuTableData).status = item.data!.status;
      (item as MenuTableData).desc = item.data!.desc;
      (item as MenuTableData).url = item.data!.url;
      (item as MenuTableData).value = item.data!.id;
    });
    const res = table_tree.trees;
    // console.log("treedata:", res);
    return res;
  }, [table_tree]);
  const formdisable = modal.operateType == OperateType.See;
  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={!userstore.HaveRight(PowerCode.PowerAdd)}
              onClick={() => onModalShow(null, OperateType.Add)}
            >
              添加菜单
            </Button>
          </li>
        </ul>
      </div>
      <div className="diy-table">
        <Table
          columns={tableColumns}
          loading={loading}
          dataSource={tableData}
          pagination={{
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
          }}
        />
      </div>
      <Modal
        title={`${OperateName[modal.operateType]}菜单->${modal.nowData?.title ?? ""}`}
        open={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form {...formItemLayout} form={form} initialValues={{ status: Status.Enable }}>
          <Form.Item
            label="菜单名"
            name="title"
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input placeholder="请输入菜单标题" disabled={formdisable} />
          </Form.Item>
          <Form.Item label="描述" name="desc" rules={[{ max: 100, message: "最多输入100位字符" }]}>
            <TextArea rows={4} disabled={formdisable} autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item label="图标" name="icon">
            <Input placeholder="输入icon" disabled={formdisable} />
          </Form.Item>
          <Form.Item label="相对地址" name="url">
            <Input placeholder="输入系统地址" disabled={formdisable} />
          </Form.Item>
          <Form.Item label="父节点" name="parent">
            <TreeSelect
              showSearch
              value={selectParent}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              onChange={(newvalue: number) => {
                setSelectParent(newvalue);
              }}
              treeData={tableData}
            ></TreeSelect>
          </Form.Item>

          <Form.Item label="排序" name="sorts" rules={[{ required: true, message: "请输入排序号" }]}>
            <InputNumber min={0} max={99999} style={{ width: "100%" }} disabled={formdisable} />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
            <Select disabled={formdisable}>
              <Option key={1} value={Status.Enable}>
                启用
              </Option>
              <Option key={-1} value={Status.Disable}>
                禁用
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="赋予">
            <Checkbox.Group
              disabled={formdisable}
              options={roleCheckBoxData}
              value={selectRoles}
              onChange={(v) => {
                SetSelectRoles(v as number[]);
              }}
            ></Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default MenuAdmin;
