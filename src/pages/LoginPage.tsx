import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginService } from "../services/authService";
import { Button, Card, Form, Input, Typography, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import "./LoginPage.css";

const { Title, Text, Link } = Typography;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { token } = await loginService(values.email, values.password);
      login(token);
      navigate("/dashboard");
      message.success("Inicio de sesión exitoso");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-section"></div>

      <div className="right-section">
        <Card className="login-card" bordered>
          
          <div className="login-title">
            <Title level={3}>Iniciar Sesión</Title>
          </div>

         
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Por favor, ingresa tu correo electrónico",
                },
                {
                  type: "email",
                  message: "Ingresa un correo electrónico válido",
                },
              ]}
            >
              <Input placeholder="E-mail" prefix={<UserOutlined />} />
            </Form.Item>

            
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Por favor, ingresa tu contraseña" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined />}
              />
            </Form.Item>

           
            <Button
              className="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </Form>

          
          <Divider>O continúa con</Divider>

          
          <div className="login-buttons">
            <Button shape="circle" icon={<GoogleOutlined />} />
            <Button shape="circle" icon={<AppleOutlined />} />
          </div>

          
          <Text className="register-text">
            ¿No tienes cuenta?{" "}
            <Link
              onClick={() => navigate("/register")}
              className="register-link"
            >
              Regístrate aquí
            </Link>
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
