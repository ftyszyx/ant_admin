/** Role 系统管理/角色管理 **/
import React, { useState, useMemo, useEffect } from "react";
import { useSetState } from "react-use";
import { Button, Input, Table, message, Popconfirm, Tooltip, Divider, Select } from "antd";
import { EyeOutlined, ToolOutlined, DeleteOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { tools } from "@/util/tools"; // 工具
import { UserStore } from "@/entity/user";
import qs from "qs";
import "./index.less";
import { UseUserStore } from "@/models/user";
import { MyFetch } from "@/util/fetch";
import { Role } from "@/entity/role";
import { ModalType, Page, TableData, OperateType } from "@/entity/page";
import { PowerCode } from "@/entity/power_code";
import { ApiPath } from "@/entity/api_path";
import { ListResp } from "@/entity/api";
import { Status } from "@/config";
import RolePowerEdit from "./RolePowerEdit";
function RoleAdmin() {
  const userstore = UseUserStore() as UserStore;
  const [data, setData] = useState<Role[]>([]); // 当前页面列表数据
  const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
  // 分页相关参数控制
  const [page, setPage] = useSetState<Page>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  // 模态框相关参数控制
  const [modal, setModal] = useSetState<ModalType<Role>>({
    operateType: OperateType.Add,
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });
  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useSetState<Partial<Role>>({
    title: undefined, // 角色名
    status: undefined, // 状态
  });
  useEffect(() => {
    getData(page);
  }, []);

  // 函数- 查询当前页面所需列表数据
  const getData = async (page: { pageNum: number; pageSize: number }) => {
    if (!userstore.HaveRight(PowerCode.RoleQuery)) {
      return;
    }
    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      title: searchInfo.title,
      status: searchInfo.status,
    };
    try {
      setLoading(true);
      const new_params = tools.clearNull(params);
      const res = (await MyFetch.get(`${ApiPath.GetRoles}?${qs.stringify(new_params)}`)) as ListResp<Role>;
      setData(res.list);
      setPage({
        total: res.total,
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      });
    } finally {
      setLoading(false);
    }
  };

  // 搜索 - 名称输入框值改变时触发
  const searchTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 20) {
      setSearchInfo({ title: e.target.value });
    }
  };

  // 搜索 - 状态下拉框选择时触发
  const searchConditionsChange = (v: number) => {
    setSearchInfo({ status: v });
  };

  // 搜索
  const onSearch = () => {
    getData(page);
  };

  const onModalShow = (data: TableData<Role> | null, type: OperateType) => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
  };

  /** 模态框确定 **/
  const onOk = async (data?: Role) => {
    if (modal.operateType === OperateType.See) {
      onClose();
      return;
    }
    try {
      console.log("onok data", data);
      setModal({ modalLoading: true });
      if (modal.operateType === OperateType.Add) {
        await MyFetch.post(ApiPath.AddRole, data);
      } else if (modal.operateType === OperateType.Up) {
        data!.id = modal.nowData?.id!;
        await MyFetch.post(ApiPath.UpRole, data);
      }
      message.success("成功");
      getData(page);
      onClose();
    } catch {
      // 未通过校验
    } finally {
      setModal({ modalLoading: false });
    }
  };

  // 删除某一条数据
  const onDel = async (id: number) => {
    setLoading(true);
    try {
      await MyFetch.post("/api/delRole", { id });
      message.success("删除成功");
      getData(page);
    } finally {
      setLoading(false);
    }
  };

  /** 模态框关闭 **/
  const onClose = () => {
    setModal({ modalShow: false });
  };

  // 表单页码改变
  const onTablePageChange = (pageNum: number, pageSize: number | undefined) => {
    getData({ pageNum, pageSize: pageSize || page.pageSize });
  };

  // 构建字段
  const tableColumns = [
    {
      title: "角色名",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "排序",
      dataIndex: "sorts",
      key: "sorts",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (v: number) =>
        v === 1 ? <span style={{ color: "green" }}>启用</span> : <span style={{ color: "red" }}>禁用</span>,
    },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: (_v: number, record: TableData<Role>) => {
        const controls = [];
        userstore.HaveRight(PowerCode.RoleQuery) &&
          controls.push(
            <span key="0" className="control-btn green" onClick={() => onModalShow(record, OperateType.See)}>
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        userstore.HaveRight(PowerCode.RoleUp) &&
          controls.push(
            <span key="1" className="control-btn blue" onClick={() => onModalShow(record, OperateType.Up)}>
              <Tooltip placement="top" title="修改">
                <ToolOutlined />
              </Tooltip>
            </span>
          );
        userstore.HaveRight(PowerCode.RoleDel) &&
          controls.push(
            <Popconfirm key="3" title="确定删除吗?" onConfirm={() => onDel(record.id)} okText="确定" cancelText="取消">
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

  const tableData = useMemo(() => {
    return data.map((item, index): TableData<Role> => {
      return { ...item, key: index };
    });
  }, [page, data]);

  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={!userstore.HaveRight(PowerCode.RoleAdd)}
              onClick={() => onModalShow(null, OperateType.Add)}
            >
              添加角色
            </Button>
          </li>
        </ul>
        <Divider type="vertical" />
        {userstore.HaveRight(PowerCode.RoleQuery) && (
          <ul className="search-ul">
            <li>
              <Input placeholder="请输入角色名" onChange={searchTitleChange} value={searchInfo.title} />
            </li>
            <li>
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: "200px" }}
                onChange={searchConditionsChange}
                value={searchInfo.status}
                options={[
                  { value: Status.Enable, title: "启用" },
                  { value: Status.Disable, title: "禁用" },
                ]}
              ></Select>
            </li>
            <li>
              <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
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
            showTotal: (total) => `共 ${total} 条数据`,
            onChange: (page, pageSize) => onTablePageChange(page, pageSize),
          }}
        />
      </div>
      {modal.modalShow ? (
        <RolePowerEdit
          show={modal.modalShow}
          operate_type={modal.operateType}
          data={modal.nowData}
          onCancel={() => onClose()}
          onOk={onOk}
          loading={modal.modalLoading}
        ></RolePowerEdit>
      ) : null}
    </div>
  );
}

export default RoleAdmin;
