import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  message,
  Select,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import { registerService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const { Title, Text, Link } = Typography;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    nombre: string;
    correo: string;
    contraseña: string;
    rol: string;
  }) => {
    setLoading(true);
    try {
      const response = await registerService(
        values.nombre,
        values.correo,
        values.contraseña,
        values.rol
      );
      message.success(response.message || "Usuario registrado con éxito.");
      navigate("/login");
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Error al registrar usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Card
        className="register-card"
        title={<Title level={3}>Crear una Cuenta</Title>}
        bordered
      >
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[
              {
                required: true,
                message: "Por favor, ingresa tu nombre completo.",
              },
            ]}
          >
            <Input placeholder="Nombre completo" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Correo"
            name="correo"
            rules={[
              {
                required: true,
                message: "Por favor, ingresa tu correo electrónico.",
              },
              { type: "email", message: "Ingresa un correo válido." },
            ]}
          >
            <Input placeholder="ejemplo@correo.com" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="contraseña"
            rules={[
              { required: true, message: "Por favor, ingresa tu contraseña." },
            ]}
          >
            <Input.Password
              placeholder="••••••••"
              prefix={<LockOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Rol"
            name="rol"
            rules={[
              { required: true, message: "Por favor, selecciona un rol." },
            ]}
          >
            <Select placeholder="Selecciona tu rol">
              <Select.Option value="estudiante">Estudiante</Select.Option>
              <Select.Option value="profesor">Profesor</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Registrarse
          </Button>
        </Form>

        <Divider>O regístrate con</Divider>

        <div className="register-buttons">
          <Button shape="circle" icon={<GoogleOutlined />} />
          <Button shape="circle" icon={<AppleOutlined />} />
        </div>

        <Text className="login-text">
          ¿Ya tienes una cuenta?{" "}
          <Link onClick={() => navigate("/login")} className="login-link">
            Inicia sesión aquí
          </Link>
        </Text>
      </Card>
    </div>
  );
};

export default RegisterPage;
