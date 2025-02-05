import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Select, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const carreras = [
  "Desarrollo de Software",
  "Diseño Gráfico",
  "Redes y Telecomunicaciones",
  "Electricidad",
  "Gastronomía",
  "Turismo",
  "Enfermería",
  "Marketing Digital",
  "Contabilidad y Asesoría Tributaria",
  "Educación",
  "Talento Humano",
];

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    console.log("Valores del formulario:", values);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (response.ok) {
        message.success("Usuario registrado con éxito.");
        navigate("/login");
      } else {
        alert(data.message || "Ocurrió un error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Ocurrió un error. Por favor, intenta de nuevo.");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-gradient" />
      <div className="register-form">
        <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE">
          <Card className="register-card">
            <Title
              level={3}
              style={{ textAlign: "center", marginBottom: "24px" }}
            >
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
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingresa tu nombre completo.",
                  },
                ]}
              >
                <Input
                  placeholder="Nombre completo"
                  prefix={<UserOutlined />}
                />
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
                <Input
                  placeholder="ejemplo@correo.com"
                  prefix={<MailOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="contraseña"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingresa tu contraseña.",
                  },
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

              {/* Campo actualizado: Selector de carrera */}
              <Form.Item
                label="Carrera"
                name="carrera"
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecciona una carrera.",
                  },
                ]}
              >
                <Select placeholder="Selecciona tu carrera">
                  {carreras.map((carrera) => (
                    <Select.Option key={carrera} value={carrera}>
                      {carrera}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Registrarse
                </Button>
              </Form.Item>
            </Form>

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
