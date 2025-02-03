import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Typography,
} from "antd";
import axios from "axios";
import "antd/dist/reset.css";
import Header from '../../components/Header'; // Importamos el Header creado anteriormente

const { Title } = Typography;
const { Content } = Layout;

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/admin",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/usuarios");
      setUsers(response.data);
    } catch (error) {
      message.error("Error al obtener los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axiosInstance.delete(`/usuarios/${id}`);
      message.success("Usuario eliminado con éxito.");
      fetchUsers();
    } catch (error) {
      message.error("Error al eliminar el usuario.");
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updatedValues = form.getFieldsValue();
      await axiosInstance.put(`/usuarios/${editingUser.id_usuario}`, updatedValues);
      message.success("Usuario actualizado con éxito.");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      message.error("Error al actualizar el usuario.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_usuario",
      key: "id_usuario",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
    },
    {
      title: "Rol",
      dataIndex: "rol",
      key: "rol",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record: any) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="primary" onClick={() => handleEditUser(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => deleteUser(record.id_usuario)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    fetchUsers();
  }, []);

  return (
    <Layout style={styles.layout}>
      {/* Llamada al componente Header */}
      <Header />

      <Content style={styles.content}>
        <Title style={styles.title}>Panel de Administración</Title>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id_usuario"
          loading={loading}
          bordered
          style={styles.table}
        />

        <Modal
          title="Editar Usuario"
          open={isModalOpen}
          onOk={handleUpdateUser}
          onCancel={() => setIsModalOpen(false)}
          okText="Actualizar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
              <Input placeholder="Ingresa el nombre" />
            </Form.Item>
            <Form.Item name="rol" label="Rol" rules={[{ required: true }]}>
            <Input placeholder="Ingresa el rol" />
          </Form.Item>

            <Form.Item
              name="correo"
              label="Correo"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Ingresa el correo" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

// 🎨 Estilos mejorados y coherentes en toda la página
const styles = {
  layout: {
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "'Poppins', sans-serif",
  },
  content: {
    padding: "24px",
  },
  title: {
    textAlign: "center" as const,
    fontSize: "28px",
    fontWeight: "bold" as const,
    marginBottom: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default AdminPanel;
