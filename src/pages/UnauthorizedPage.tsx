import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>403 - No Autorizado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <button 
        onClick={() => navigate('/')} 
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '20px',
          cursor: 'pointer',
        }}
      >
        Ir al inicio
      </button>
    </div>
  );
};

export default UnauthorizedPage;
