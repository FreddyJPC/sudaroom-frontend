import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Divider, Select } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleAuthButton from "../components/GoogleAuthButton";
import "./RegisterPage.css";

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = (user: any) => {
    console.log("Usuario autenticado con Google:", user);
    // Lógica adicional, como guardar el usuario en el backend
  };

  const onFinish = (values: any) => {
    setLoading(true);
    console.log(values);
    // Aquí iría tu lógica de registro
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="register-container">
      <div className="register-gradient" />
      <div className="register-form">
        <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE">
          <Card className="register-card">
            <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
              Crear una Cuenta
            </Title>

            <Form
              name="register"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                label="Nombre"
                name="nombre"
                rules={[{ required: true, message: "Por favor, ingresa tu nombre completo." }]}
              >
                <Input placeholder="Nombre completo" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Correo"
                name="correo"
                rules={[
                  { required: true, message: "Por favor, ingresa tu correo electrónico." },
                  { type: "email", message: "Ingresa un correo válido." },
                ]}
              >
                <Input placeholder="ejemplo@correo.com" prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="contraseña"
                rules={[{ required: true, message: "Por favor, ingresa tu contraseña." }]}
              >
                <Input.Password
                  placeholder="••••••••"
                  prefix={<LockOutlined />}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label="Rol"
                name="rol"
                rules={[{ required: true, message: "Por favor, selecciona un rol." }]}
              >
                <Select placeholder="Selecciona tu rol">
                  <Select.Option value="estudiante">Estudiante</Select.Option>
                  <Select.Option value="profesor">Profesor</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Registrarse
                </Button>
              </Form.Item>
            </Form>

            <Divider>O regístrate con</Divider>

            <div className="register-buttons">
              <GoogleAuthButton onSuccess={handleGoogleSuccess} />
            </div>

            <div className="login-text">
              <Text>
                ¿Ya tienes una cuenta?{" "}
                <a href="/login" className="login-link">
                  Inicia sesión aquí
                </a>
              </Text>
            </div>
          </Card>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default RegisterPage;