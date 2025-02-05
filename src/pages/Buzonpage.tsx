// BuzonPage.tsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  List,
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Spin,
  Typography,
} from "antd";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import "./BuzonPage.css"; // Archivo de estilos (opcional)

const { Content } = Layout;
const { Title } = Typography;
const API_BASE_URL = "http://localhost:5000";

const BuzonPage: React.FC = () => {
  const { userId, token } = useAuth();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<any>(null);
  const [form] = Form.useForm();

  // Función para cargar las solicitudes del usuario
  const fetchSolicitudes = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/solicitudes/usuario/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSolicitudes(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      message.error("Error al cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
    // Si deseas actualizar las solicitudes cada cierto tiempo puedes usar un intervalo aquí.
  }, [userId, token]);

  // Función para aceptar una solicitud
  const handleAceptar = async (solicitud: any) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/solicitudes/solicitudes/${solicitud.id_solicitud}/responder`,
        { estado: "aceptada" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Solicitud aceptada.");
      // Actualizamos el estado local
      const updated = solicitudes.map((s) =>
        s.id_solicitud === solicitud.id_solicitud
          ? { ...s, estado: "aceptada" }
          : s
      );
      setSolicitudes(updated);
    } catch (error) {
      console.error("Error al aceptar la solicitud:", error);
      message.error("No se pudo aceptar la solicitud.");
    }
  };

  // Función para abrir el modal de rechazo
  const handleAbrirRechazo = (solicitud: any) => {
    setSelectedSolicitud(solicitud);
    setRejectModalVisible(true);
  };

  // Función para rechazar la solicitud con un motivo
  const handleRechazar = async (values: any) => {
    if (!selectedSolicitud) return;
    try {
      await axios.put(
        `${API_BASE_URL}/api/solicitudes/solicitudes/${selectedSolicitud.id_solicitud}/responder`,
        { estado: "rechazada", motivo_rechazo: values.motivo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Solicitud rechazada.");
      setRejectModalVisible(false);
      form.resetFields();
      // Actualizamos el estado local
      const updated = solicitudes.map((s) =>
        s.id_solicitud === selectedSolicitud.id_solicitud
          ? { ...s, estado: "rechazada", motivo_rechazo: values.motivo }
          : s
      );
      setSolicitudes(updated);
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      message.error("No se pudo rechazar la solicitud.");
    }
  };

  // Renderizado de cada tarjeta de solicitud
  const renderSolicitud = (solicitud: any) => {
    const {
      id_solicitud,
      tema,
      mensaje: mensajeEstudiante,
      fecha_solicitada,
      duracion,
      estado,
      motivo_rechazo,
    } = solicitud;
    return (
      <Card key={id_solicitud} className="solicitud-card">
        <Title level={4} className="solicitud-title">
          {tema}
        </Title>
        <p>
          <strong>Mensaje:</strong> {mensajeEstudiante}
        </p>
        <p>
          <strong>Fecha Solicitada:</strong>{" "}
          {new Date(fecha_solicitada).toLocaleDateString()} &nbsp;
          <strong>Duración:</strong> {duracion} hora(s)
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          {estado === "pendiente" && <Tag color="blue">Pendiente</Tag>}
          {estado === "aceptada" && <Tag color="green">Aceptada</Tag>}
          {estado === "rechazada" && <Tag color="red">Rechazada</Tag>}
        </p>
        {estado === "rechazada" && motivo_rechazo && (
          <p>
            <strong>Motivo de Rechazo:</strong> {motivo_rechazo}
          </p>
        )}
        {estado === "pendiente" && (
          <div className="button-group">
            <Button type="primary" onClick={() => handleAceptar(solicitud)}>
              Aceptar
            </Button>
            <Button danger onClick={() => handleAbrirRechazo(solicitud)}>
              Rechazar
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header ubicado en la parte superior */}
      <Header />
      <Content className="buzon-content">
        <div className="buzon-header">
          {/* <BackButton /> */}
          <Title level={2} className="buzon-heading">
            Buzón de Solicitudes
          </Title>
        </div>

        {loading ? (
          <div className="spin-container">
            <Spin size="large" />
          </div>
        ) : solicitudes.length === 0 ? (
          <p>No tienes solicitudes pendientes.</p>
        ) : (
          <List
            dataSource={solicitudes}
            renderItem={(solicitud) => (
              <List.Item>{renderSolicitud(solicitud)}</List.Item>
            )}
          />
        )}

        {/* Modal para rechazar solicitud */}
        <Modal
          title="Rechazar Solicitud"
          visible={rejectModalVisible}
          onCancel={() => {
            setRejectModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          centered
        >
          <Form form={form} layout="vertical" onFinish={handleRechazar}>
            <Form.Item
              label="Motivo de rechazo"
              name="motivo"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el motivo del rechazo.",
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Confirmar Rechazo
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default BuzonPage;
