/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Col, Divider, Form, Input, Row, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { authenticate } from "@/utils/actions";
import { useRouter } from "next/navigation";
const Login = () => {
  const router = useRouter();
  const onFinish = async (values: any) => {
    const { username, password } = values;
    const data = await authenticate(username, password);
    console.log(">>>>>>>>>> check data", JSON.stringify(data));

    if (data?.error) {
      notification.error({
        message: data.error,
        description: data.error,
      });
    } else if (data.success) {
      notification.success({
        message: "Đăng nhập thành công!",
      });
      router.push("/dashboard");
    }
  };

  return (
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
              name="username"
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
              <Button type="primary" htmlType="submit">
                Login
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
        </fieldset>
      </Col>
    </Row>
  );
};

export default Login;
