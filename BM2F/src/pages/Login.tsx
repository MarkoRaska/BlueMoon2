import React, { useState } from "react";
import { Form, Input, Button, Card } from "antd";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useSubmissions } from "../context/SubmissionContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setSubmissions } = useSubmissions();

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await axiosInstance.post("/api/token/", values);
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Fetch submissions after successful login
      const submissionsResponse = await axiosInstance.get(
        "/api/readers/assigned_submissions/"
      );
      setSubmissions(submissionsResponse.data);

      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #0091ff, #00ccff)", // Gradient blue
      }}
    >
      <Card title="Login" style={{ width: 300 }}>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
