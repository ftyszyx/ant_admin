import { useState, useMemo, useEffect } from "react";
import { useSetState } from "react-use";
import qs from "qs";
import { Form, Button, Input, Table, message, Popconfirm, Modal, Tooltip, Divider, Select } from "antd";
import { EyeOutlined, ToolOutlined, DeleteOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { tools } from "@/util/tools"; // 工具函数
const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
import "./index.less";
import { UseUserStore } from "@/models/user";
import { MyFetch } from "@/util/fetch";
import { User, UserStore } from "@/entity/user";
import { PowerCode } from "@/entity/power_code";
import { ListResp, PageReq } from "@/entity/api";
import { Status } from "@/config";
import { ModalType, Page, TableData, OperateType, OperateName } from "@/entity/page";
import { ApiPath } from "@/entity/api_path";
import { RoleStore, useRoleStore } from "@/models/role";

function UserAdmin() {
  console.log("render useradmin 2");
  const userstore = UseUserStore() as UserStore;
  const [form] = Form.useForm<User>();
  const [data, setData] = useState<TableData<User>[]>([]); // 当前页面列表数据
  const [loading, setLoading] = useState(false); // 数据是否正在加载中
  const role_store = useRoleStore() as RoleStore;
  console.log("render useradmin");
  // 分页相关参数
  const [page, setPage] = useSetState<Page>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框相关参数
  const [modal, setModal] = useSetState(new ModalType<User>());
  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useSetState<Partial<User>>({});

  useEffect(() => {
    console.log("get user data");
    GetData(page);
    role_store.FetchAll();
  }, []);

  // 函数 - 查询当前页面所需列表数据
  async function GetData(page: PageReq): Promise<void> {
    if (!userstore.powersCode.includes(PowerCode.UserQuery)) {
      return;
    }
    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      username: searchInfo.username,
      status: searchInfo.status,
    };
    setLoading(true);
    try {
      const res = (await MyFetch.get(`${ApiPath.GetUserList}?${qs.stringify(params)}`)) as ListResp<User>;
      setData(res.list as TableData<User>[]);
      setPage({
        pageNum: page.pageNum,
        pageSize: page.pageSize,
        total: res.total,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  const onModalShow = (data: TableData<User> | null, type: OperateType): void => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    // 用setTimeout是因为首次让Modal出现时得等它挂载DOM，不然form对象还没来得及挂载到Form上
    setTimeout(() => {
      if (type === OperateType.Add) {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else if (data) {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        form.setFieldsValue(data);
      }
    });
  };

  /** 模态框确定 **/
  const onOk = async (): Promise<void> => {
    try {
      if (modal.operateType === OperateType.See) {
        onClose();
        return;
      }
      const values = await form.validateFields();
      setModal({ modalLoading: true });
      if (modal.operateType === "add") {
        // 新增
        await MyFetch.post(ApiPath.AddUser, values);
        message.success("添加成功");
      } else {
        // 修改
        values.id = modal.nowData!.id;
        await MyFetch.post(ApiPath.UpUser, values);
        message.success("修改成功");
      }
      GetData(page);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setModal({ modalLoading: false });
    }
  };

  // 删除某一条数据
  const onDel = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      MyFetch.post("/api/delUser", { id });
      message.success("删除成功");
      GetData(page);
    } finally {
      setLoading(false);
    }
  };

  /** 模态框关闭 **/
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };

  // table字段
  const tableColumns = [
    // { title: "序号", dataIndex: "serial", key: "serial" },
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "电话", dataIndex: "phone", key: "phone" },
    { title: "邮箱", dataIndex: "email", key: "email" },
    { title: "描述", dataIndex: "desc", key: "desc" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (v: number): JSX.Element =>
        v === 1 ? <span style={{ color: "green" }}>启用</span> : <span style={{ color: "red" }}>禁用</span>,
    },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: (_: null, record: TableData<User>) => {
        const controls = [];
        const u = userstore.user_base || { id: -1 };
        userstore.powersCode.includes(PowerCode.UserQuery) &&
          controls.push(
            <span key="0" className="control-btn green" onClick={() => onModalShow(record, OperateType.See)}>
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        userstore.powersCode.includes(PowerCode.UserUp) &&
          controls.push(
            <span key="1" className="control-btn blue" onClick={() => onModalShow(record, OperateType.Up)}>
              <Tooltip placement="top" title="修改">
                <ToolOutlined />
              </Tooltip>
            </span>
          );
        userstore.powersCode.includes(PowerCode.UserDel) &&
          u.id !== record.id &&
          controls.push(
            <Popconfirm key="3" title="确定删除吗?" onConfirm={() => onDel(record.id!)} okText="确定" cancelText="取消">
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

  // table列表所需数据
  const tableData = useMemo(() => {
    console.log("data", data);
    return data.map((item) => {
      item.key = item.id;
      return {
        ...item,
      };
    });
  }, [page, data]);

  const form_view = modal.operateType == OperateType.See;
  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={!userstore.HaveRight(PowerCode.UserAdd)}
              onClick={() => onModalShow(null, OperateType.Add)}
            >
              添加用户
            </Button>
          </li>
        </ul>
        <Divider type="vertical" />
        {userstore.powersCode.includes(PowerCode.UserQuery) && (
          <ul className="search-ul">
            <li>
              <Input
                placeholder="请输入用户名"
                onChange={(e) => {
                  setSearchInfo({ username: e.target.value });
                }}
                value={searchInfo.username}
              />
            </li>
            <li>
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: "200px" }}
                onChange={(e: number) => {
                  setSearchInfo({ status: e });
                }}
                value={searchInfo.status}
              >
                <Option value={Status.Enable}>启用</Option>
                <Option value={Status.Disable}>禁用</Option>
              </Select>
            </li>
            <li>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  GetData(page);
                }}
              >
                搜索
              </Button>
            </li>
          </ul>
        )}
      </div>
      <div className="diy-table">
        <Table
          columns={tableColumns}
          loading={loading}
          dataSource={tableData}
          pagination={{
            total: page.total,
            current: page.pageNum,
            pageSize: page.pageSize,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条数据`,
            onChange: () => {
              GetData(page);
            },
          }}
        />
      </div>
      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={OperateName[modal.operateType]}
        open={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form
          {...formItemLayout}
          form={form}
          initialValues={{
            status: Status.Enable,
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input placeholder="请输入用户名" disabled={form_view} />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { min: 6, message: "最少输入6位字符" },
              { max: 18, message: "最多输入18位字符" },
            ]}
          >
            <Input type="password" placeholder="请输入密码" disabled={form_view} />
          </Form.Item>
          <Form.Item
            label="电话"
            name="phone"
            rules={[
              () => ({
                validator: (_, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkPhone(v)) {
                      return Promise.reject("请输入有效的手机号码");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="请输入手机号" maxLength={11} disabled={form_view} />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              () => ({
                validator: (_, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkEmail(v)) {
                      return Promise.reject("请输入有效的邮箱地址");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="请输入邮箱地址" disabled={form_view} />
          </Form.Item>
          <Form.Item label="描述" name="desc" rules={[{ max: 100, message: "最多输入100个字符" }]}>
            <TextArea rows={4} disabled={form_view} autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
            <Select disabled={form_view}>
              <Option key={1} value={Status.Enable}>
                启用
              </Option>
              <Option key={-1} value={Status.Disable}>
                禁用
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="角色" name="roles" required>
            <Select disabled={form_view} mode="multiple">
              {role_store.items.map((item) => {
                return (
                  <Option key={item.id} label={item.title} value={item.id}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserAdmin;
