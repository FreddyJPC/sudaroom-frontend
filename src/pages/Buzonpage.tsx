import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Button, Modal, Form, Input, message, Tag, Spin } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

const BuzonPage: React.FC = () => {
  const { userId, token } = useAuth();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<any>(null);
  const [form] = Form.useForm();

  // Función para obtener las solicitudes del profesor
  const fetchSolicitudes = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/solicitudes/usuario/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSolicitudes(response.data.data || []); // Asumiendo que la respuesta es { success: true, data: [...] }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      message.error('Error al cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
    // Puedes establecer un intervalo para refrescar las solicitudes si lo deseas.
  }, [userId, token]);

  // Función para aceptar una solicitud
  const handleAceptar = async (solicitud: any) => {
    try {
      await axios.put(
        `http://localhost:5000/api/solicitudes/solicitudes/${solicitud.id_solicitud}/responder`,
        { estado: 'aceptada' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success('Solicitud aceptada.');
      fetchSolicitudes();
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
      message.error('No se pudo aceptar la solicitud.');
    }
  };

  // Función para abrir el modal de rechazo
  const handleAbrirRechazo = (solicitud: any) => {
    setSelectedSolicitud(solicitud);
    setRejectModalVisible(true);
  };

  // Función para rechazar la solicitud (con motivo)
  const handleRechazar = async (values: any) => {
    if (!selectedSolicitud) return;
    try {
      await axios.put(
        `http://localhost:5000/api/solicitudes/solicitudes/${selectedSolicitud.id_solicitud}/responder`,
        { estado: 'rechazada', motivo_rechazo: values.motivo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success('Solicitud rechazada.');
      setRejectModalVisible(false);
      form.resetFields();
      fetchSolicitudes();
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
      message.error('No se pudo rechazar la solicitud.');
    }
  };

  // Renderizamos la tarjeta de cada solicitud
  const renderSolicitud = (solicitud: any) => {
    const { id_solicitud, tema, mensaje: mensajeEstudiante, fecha_solicitada, duracion, estado, motivo_rechazo } = solicitud;
    return (
      <Card key={id_solicitud} style={{ marginBottom: 16 }}>
        <h3>{tema}</h3>
        <p><strong>Mensaje:</strong> {mensajeEstudiante}</p>
        <p>
          <strong>Fecha Solicitada:</strong> {new Date(fecha_solicitada).toLocaleDateString()} &nbsp;
          <strong>Duración:</strong> {duracion} hora(s)
        </p>
        <p>
          <strong>Estado:</strong> {estado === 'pendiente' && <Tag color="blue">Pendiente</Tag>}
          {estado === 'aceptada' && <Tag color="green">Aceptada</Tag>}
          {estado === 'rechazada' && <Tag color="red">Rechazada</Tag>}
        </p>
        {estado === 'rechazada' && motivo_rechazo && (
          <p>
            <strong>Motivo de Rechazo:</strong> {motivo_rechazo}
          </p>
        )}
        {estado === 'pendiente' && (
          <div style={{ display: 'flex', gap: 16 }}>
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
    <Content style={{ padding: '24px', background: '#fff' }}>
      <h2>Buzón de Solicitudes</h2>
      {loading ? (
        <Spin size="large" />
      ) : solicitudes.length === 0 ? (
        <p>No tienes solicitudes pendientes.</p>
      ) : (
        <List
          dataSource={solicitudes}
          renderItem={(solicitud) => <List.Item>{renderSolicitud(solicitud)}</List.Item>}
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
      >
        <Form form={form} layout="vertical" onFinish={handleRechazar}>
          <Form.Item
            label="Motivo de rechazo"
            name="motivo"
            rules={[{ required: true, message: 'Por favor ingresa el motivo del rechazo.' }]}
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
  );
};

export default BuzonPage;
