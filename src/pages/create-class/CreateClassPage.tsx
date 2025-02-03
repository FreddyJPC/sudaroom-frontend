import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import Header from "../../components/Header";
import BackButton from "../../components/BackButton";
import "./CreateClassPage.css";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5000";

const CreateClassPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

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

  const handleSubmit = async (values: any) => {
    // Convertimos el valor de fecha (un objeto moment) a una cadena en formato ISO truncado
    const formattedValues = {
      ...values,
      fecha_hora: values.fecha_hora.toISOString().slice(0, 16),
      // Convertimos los números a string si es necesario (según la API)
      duracion: values.duracion.toString(),
      capacidad_maxima: values.capacidad_maxima.toString(),
    };

    try {
      await axios.post(`${API_BASE_URL}/api/clases`, formattedValues, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Clase creada con éxito");
      setTimeout(() => {
        navigate("/clases");
      }, 1000);
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Error al crear la clase"
      );
    }
  };

  // Función para deshabilitar fechas pasadas en el DatePicker
  const disabledDate = (current: any) => {
    return current && current < moment().startOf("day");
  };

  return (
    <Layout style={styles.layout}>
      {/* Componente Header en la parte superior */}
      <Header />

      <Content style={styles.content}>
        <Card style={styles.card}>
          <div style={styles.backButtonContainer}>
            <BackButton />
          </div>
          <div style={styles.formHeader}>
            <Title level={3} style={styles.formTitle}>
              Crear Nueva Clase
            </Title>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={styles.formContainer}
          >
            <Form.Item
              label="Título"
              name="titulo"
              rules={[{ required: true, message: "Por favor ingresa el título" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Descripción"
              name="descripcion"
              rules={[
                { required: true, message: "Por favor ingresa la descripción" },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Fecha y hora"
              name="fecha_hora"
              rules={[
                { required: true, message: "Por favor selecciona la fecha y hora" },
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                disabledDate={disabledDate}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Duración (minutos)"
              name="duracion"
              rules={[
                { required: true, message: "Por favor ingresa la duración" },
              ]}
            >
              <InputNumber min={15} max={180} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Capacidad máxima"
              name="capacidad_maxima"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la capacidad máxima",
                },
              ]}
            >
              <InputNumber min={1} max={50} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Carrera"
              name="carrera"
              rules={[
                { required: true, message: "Por favor selecciona la carrera" },
              ]}
            >
              <Select placeholder="Selecciona la carrera">
                {carreras.map((carrera) => (
                  <Option key={carrera} value={carrera}>
                    {carrera}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={styles.submitButton}
                block
              >
                Crear Clase
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

const styles = {
  layout: {
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "'Poppins', sans-serif",
  },
  content: {
    padding: "24px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    backgroundColor: "#fff",
  },
  backButtonContainer: {
    marginBottom: "16px",
  },
  formHeader: {
    textAlign: "center" as const,
    marginBottom: "24px",
  },
  formTitle: {
    color: "#00AFB5",
    fontWeight: "bold" as const,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  submitButton: {
    backgroundColor: "#015C5C",
    borderColor: "#015C5C",
  },
};

export default CreateClassPage;
