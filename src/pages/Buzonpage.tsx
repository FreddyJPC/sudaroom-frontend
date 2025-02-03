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

  // Definición de estilos para la página
  const styles = {
    content: {
      padding: '24px',
      background: '#fff',
      fontFamily: "'Poppins', sans-serif",
      minHeight: '100vh',
    },
    heading: {
      color: '#00AFB5',
      fontFamily: "'Poppins', sans-serif",
      marginBottom: '24px',
      fontSize: '2rem',
      fontWeight: 600,
    },
    card: {
      marginBottom: 16,
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    cardTitle: {
      margin: 0,
      color: '#00AFB5',
      fontSize: '1.4rem',
      fontWeight: 600,
    },
    buttonGroup: {
      display: 'flex',
      gap: 16,
      marginTop: 16,
    },
    spinContainer: {
      textAlign: 'center' as 'center',
      padding: '40px 0',
    },
  };

  // Función para obtener las solicitudes del profesor
  const fetchSolicitudes = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/solicitudes/usuario/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSolicitudes(response.data.data || []); // Se asume que la respuesta es { success: true, data: [...] }
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
      <Card key={id_solicitud} style={styles.card}>
        <h3 style={styles.cardTitle}>{tema}</h3>
        <p>
          <strong>Mensaje:</strong> {mensajeEstudiante}
        </p>
        <p>
          <strong>Fecha Solicitada:</strong>{' '}
          {new Date(fecha_solicitada).toLocaleDateString()} &nbsp;
          <strong>Duración:</strong> {duracion} hora(s)
        </p>
        <p>
          <strong>Estado:</strong>{' '}
          {estado === 'pendiente' && <Tag color="blue">Pendiente</Tag>}
          {estado === 'aceptada' && <Tag color="green">Aceptada</Tag>}
          {estado === 'rechazada' && <Tag color="red">Rechazada</Tag>}
        </p>
        {estado === 'rechazada' && motivo_rechazo && (
          <p>
            <strong>Motivo de Rechazo:</strong> {motivo_rechazo}
          </p>
        )}
        {estado === 'pendiente' && (
          <div style={styles.buttonGroup}>
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
    <Content style={styles.content}>
      <h2 style={styles.heading}>Buzón de Solicitudes</h2>
      {loading ? (
        <div style={styles.spinContainer}>
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
              { required: true, message: 'Por favor ingresa el motivo del rechazo.' },
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
  );
};

export default BuzonPage;
