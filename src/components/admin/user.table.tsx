"use client";
import { Button, Table } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserTable = (props: any) => {
  const { data, meta } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IUser | null>(null);
  // Map data để thêm key cho Ant Design Table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataSource =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.map((user: any, index: number) => ({
      ...user,
      key: user._id || index,
    })) || [];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (isActive ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: () => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button size="small" type="primary">
            Edit
          </Button>
          <Button size="small" danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];
  const pagination = {
    current: meta?.current,
    pageSize: meta?.pageSize,
    total: meta?.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} của ${total} mục`,
  };
  const handleChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pagination: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sorter: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extra: any
  ) => {
    console.log(">>>>>>>>>> check pagination from user table", pagination);
    if (pagination && pagination.current) {
      const params = new URLSearchParams(searchParams);
      params.set("current", pagination.current.toString());
      replace(`${pathname}?${params.toString()}`);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span>Manager Users</span>
        <Button>Create User</Button>
      </div>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey={(record: any) => record._id}
        pagination={pagination}
        onChange={handleChange}
      />
    </>
  );
};

export default UserTable;
