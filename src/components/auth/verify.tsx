"use client";

import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendRequest } from "@/utils/api";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Verify(props: any) {
  const { id } = props;
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const onFinish = async (values: any) => {
  //     setLoading(true);
  //     const { _id, code } = values;
  //     console.log(">>>>>>>>>> check _id", _id);
  //     console.log(">>>>>>>>>> check code", code);
  //     const res = await sendRequest<IBackendRes<IRegister>>({
  //       url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/send-mail-otp`,
  //       method: "POST",
  //       body: {
  //         _id,
  //         code,
  //       },
  //     });
  //     console.log(">>>>>>>>>> check res", res);
  //     if (res.data) {
  //       api.success({
  //         message: "Xác thực thành công",
  //         description: "Vui lòng đăng nhập để tiếp tục",
  //         duration: 1500,
  //       });
  //       setTimeout(() => {
  //         router.push("/auth/login");
  //       }, 1500);
  //     } else {
  //       api.error({
  //         message: "Lỗi xác thực",
  //         description: res.error as string,
  //       });
  //     }
  //     setLoading(false);
  //   };
  const onResendCode = async () => {
    const res = await sendRequest<IBackendRes<IRegister>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify/resend-mail-otp`,
      method: "POST",
      body: {
        _id: id,
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
            <legend>Xác thực tài khoản</legend>
            <Form
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item label="id" name="id" initialValue={id} hidden>
                <Input disabled />
              </Form.Item>
              <div style={{ textAlign: "center" }}>
                <p>Vui lòng nhập mã xác thực đã được gửi đến email của bạn.</p>
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
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <Link href={"/"}>
              <ArrowLeftOutlined /> Quay lại trang chủ
            </Link>
            <Divider />
            <div style={{ textAlign: "center" }}>
              Đã có tài khoản? <Link href={"/auth/login"}>Đăng nhập</Link>
            </div>
          </fieldset>
        </Col>
      </Row>
    </>
  );
}
