import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="default"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(-1)}
    >
      
    </Button>
  );
};

export default BackButton;
