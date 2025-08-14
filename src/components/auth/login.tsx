/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Col, Divider, Form, Input, Row, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { authenticate } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalReactive from "./modal.reactive";
import ModalChangePassword from "./modal.change.password";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] =
    useState(false);

  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const { email, password } = values;
      setUserEmail("");
      const data = await authenticate(email, password);
      // console.log(">>>>>>>>>> check data error", data?.error);
      console.log(">>>>>>>>>> check data statusCode", data);
      if (data?.error) {
        // console.log(">>>>>>>>>> check data error", data);
        if (data?.statusCode === 400) {
          setIsModalOpen(true);
          setUserEmail(email);
          return;
        }
        api.error({
          message: "Lỗi đăng nhập",
          description: data?.error,
        });
      } else if (data) {
        // NextAuth trả về { ok: true } khi đăng nhập thành công
        api.success({
          message: "Đăng nhập thành công!",
          description: "Bạn sẽ được chuyển hướng đến dashboard",
        });
        // Chờ một chút để user thấy notification
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      api.error({
        message: "Lỗi hệ thống",
        description: "Có lỗi xảy ra, vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Row justify={"center"} style={{ marginTop: "30px" }}>
        <Col xs={24} md={16} lg={8}>
          <fieldset
            style={{
              padding: "15px",
              margin: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <legend>Đăng Nhập</legend>
            <Form
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
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

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: "100%" }}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </Form.Item>
            </Form>
            <Link href={"/"}>
              <ArrowLeftOutlined /> Quay lại trang chủ
            </Link>
            <Divider />
            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản?{" "}
              <Link href={"/auth/register"}>Đăng ký tại đây</Link>
            </div>
            <div style={{ textAlign: "center" }}>
              <Button
                type="link"
                onClick={() => setIsModalChangePasswordOpen(true)}
              >
                Quên mật khẩu
              </Button>
            </div>
          </fieldset>
        </Col>
      </Row>
      <ModalReactive
        userEmail={userEmail}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <ModalChangePassword
        userEmail={userEmail}
        isModalOpen={isModalChangePasswordOpen}
        setIsModalOpen={setIsModalChangePasswordOpen}
      />
    </>
  );
};

export default Login;
