"use client";
import { AdminContext } from "@/library/admin.context";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useContext } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
interface PropAdminHeader {
  session: Session;
}

const AdminHeader = (prop: PropAdminHeader) => {
  // const { data: session, status } = useSession();
  const { session } = prop;
  console.log(">>>>>>>>>> check session", session);
  const { Header } = Layout;
  const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
  const handleLogout = () => {
    console.log(">>>>>>>>>> check handleLogout - START");
    try {
      console.log(">>>>>>>>>> calling signOut...");
      signOut({ callbackUrl: "/auth/login" });
      console.log(">>>>>>>>>> signOut called successfully");
    } catch (error) {
      console.error(">>>>>>>>>> Error in handleLogout:", error);
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Setting",
    },
    {
      key: "2",
      danger: true,
      label: "Logout",
      onClick: () => {
        console.log(">>>>>>>>>> Menu item clicked directly");
        handleLogout();
      },
    },
  ];

  return (
    <>
      <Header
        style={{
          padding: 0,
          display: "flex",
          background: "#f5f5f5",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapseMenu(!collapseMenu)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Dropdown menu={{ items }}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              color: "unset",
              lineHeight: "0 !important",
              marginRight: 20,
            }}
          >
            <Space>
              Welcome {session?.user?.email}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </>
  );
};

export default AdminHeader;
