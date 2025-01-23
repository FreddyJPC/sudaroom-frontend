import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import axios from 'axios';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]); // Inicializamos como un arreglo vacío
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const token = localStorage.getItem('token'); // Obtén el token desde el almacenamiento local
  console.log(token);  // Verifica que el token esté siendo leído correctamente


  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/users',  // Asegúrate de incluir la URL completa
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/');
      if (Array.isArray(response.data)) {
        setUsers(response.data); // Solo si es un arreglo
      } else {
        throw new Error('Datos de usuarios no válidos.');
      }
    } catch (error) {
      message.error(error.message || 'Error al obtener los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  console.log(localStorage.getItem('token'));  // Debe devolver un token válido si está guardado
  

  

  const deleteUser = async (id: number) => {
    try {
      await axiosInstance.delete(`/${id}`);
      message.success('Usuario eliminado con éxito.');
      fetchUsers();
    } catch (error) {
      message.error('Error al eliminar el usuario.');
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
      await axiosInstance.put(`/${editingUser.id_usuario}`, updatedValues);
      message.success('Usuario actualizado con éxito.');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      message.error('Error al actualizar el usuario.');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_usuario',
      key: 'id_usuario',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'fecha_creacion',
      key: 'fecha_creacion',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (record: any) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="link" onClick={() => handleEditUser(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => deleteUser(record.id_usuario)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('No estás autenticado. Por favor, inicia sesión.');
      return;
    }
    fetchUsers();
  }, []);
  

  return (
    <div style={{ padding: '24px' }}>
      <h1>Panel de Administración</h1>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id_usuario"
        loading={loading}
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
          <Form.Item
            name="correo"
            label="Correo"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="Ingresa el correo" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;
