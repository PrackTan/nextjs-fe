"use client";

import { Button, Divider, Form, Input, Modal, notification, Steps } from "antd";
import { useHasMounted } from "@/utils/customHook";
import { useRouter } from "next/navigation";
import {
  CheckCircleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SolutionOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { SmileOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModalChangePassword = (props: any) => {
  const { isModalOpen, setIsModalOpen, userEmail } = props;
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const hasMounted = useHasMounted();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  console.log("check userEmail", userEmail);
  useEffect(() => {
    if (userEmail) {
      form.setFieldsValue({ email: userEmail });
    }
  }, [userEmail, form]);
  if (!hasMounted) return <></>;

  const onFinishStep1 = async (values: LoginFormValues) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<IRegister>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-mail-otp`,
      method: "POST",
      body: {
        email: email,
      },
    });
    if (res.data) {
      setEmail(email);
      setUserId(res.data._id);
      setCurrent(1);
    } else {
      api.error({
        message: "Lỗi xác thực",
        description: res.message as string,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishStep2 = async (values: any) => {
    const { code } = values;
    console.log("check code", code);
    const res = await sendRequest<IBackendRes<IRegister>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: {
        _id: userId,
        codeId: code,
      },
    });
    if (res.data) {
      setCurrent(2);
    } else {
      api.error({
        message: "Lỗi xác thực",
        description: res.message as string,
      });
    }
  };
  const onResendCode = async () => {
    const res = await sendRequest<IBackendRes<IRegister>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-mail-otp`,
      method: "POST",
      body: {
        email: email,
      },
    });
    if (res.data) {
      api.success({
        message: "Mã xác thực đã được gửi đến email của bạn",
      });
    } else {
      api.error({
        message: "Lỗi gửi mã xác thực",
        description: res.error as string,
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        title="Kích hoạt tài khoản"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        closable={false}
        footer={null}
      >
        <div>
          <Steps
            current={current}
            items={[
              {
                title: "Login",
                status: current === 0 ? "finish" : "wait",
                icon: <UserOutlined />,
              },
              {
                title: "Verification",
                status: current === 1 ? "finish" : "wait",
                icon: <SolutionOutlined />,
              },
              {
                title: "Change Password",
                status: current === 2 ? "finish" : "wait",
                icon: <LockOutlined />,
              },
              {
                title: "Done",
                icon: <CheckCircleOutlined />,
              },
            ]}
          />
          {current === 0 && (
            <>
              <div style={{ margin: "10px 0" }}>
                <p>Tài khoản chưa được xác thực</p>
              </div>
              <Form
                form={form}
                name="basic"
                onFinish={onFinishStep1}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item label="" name="email">
                  <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: "100%" }}
                  >
                    {loading ? "đang gửi lại..." : "Gửi"}
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
          {current === 1 && (
            <div>
              <h1>Tài khoản chưa được xác thực</h1>
              <Form
                name="basic"
                onFinish={onFinishStep2}
                autoComplete="off"
                layout="vertical"
              >
                <div style={{ textAlign: "center" }}>
                  <p>
                    Vui lòng nhập mã xác thực đã được gửi đến email của bạn.
                  </p>
                </div>
                <Divider />
                <Form.Item
                  label="Mã xác thực"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your code!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Divider />
                <div style={{ textAlign: "center" }}>
                  <p>
                    Nếu bạn không nhận được mã xác thực, vui lòng nhấn nút bên
                    dưới để gửi lại mã xác thực.{" "}
                    <span
                      onClick={onResendCode}
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Gửi lại mã xác thực
                    </span>
                  </p>
                </div>
                <Form.Item style={{ textAlign: "center" }}>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Kích hoạt
                  </Button>
                </Form.Item>
              </Form>{" "}
            </div>
          )}
          {current === 2 && (
            <div>
              <h1>Thay đổi mật khẩu</h1>
              <Form
                name="basic"
                onFinish={onFinishStep2}
                autoComplete="off"
                layout="vertical"
              >
                <div style={{ textAlign: "center" }}>
                  <p>Vui lòng nhập mật khẩu mới.</p>
                </div>
                <Divider />
                <Form.Item
                  label="Mật khẩu mới"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Nhập lại mật khẩu mới"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please input your confirm password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Divider />
                <div style={{ textAlign: "center" }}>
                  <p>
                    Nếu bạn không nhận được mã xác thực, vui lòng nhấn nút bên
                    dưới để gửi lại mã xác thực.{" "}
                    <span
                      onClick={onResendCode}
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Gửi lại mã xác thực
                    </span>
                  </p>
                </div>
                <Form.Item style={{ textAlign: "center" }}>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Kích hoạt
                  </Button>
                </Form.Item>
              </Form>{" "}
            </div>
          )}
          {current === 3 && (
            <div>
              <h1>Tài khoản đã được xác thực</h1>
              <p>Vui lòng đăng nhập để tiếp tục</p>
              {setIsModalOpen(false)}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalChangePassword;
