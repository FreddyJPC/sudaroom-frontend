import React from "react";
import AppleSignin from "react-apple-signin-auth";

interface AppleAuthButtonProps {
  onSuccess: (response: any) => void;
  onFailure?: (error: any) => void;
}

const AppleAuthButton: React.FC<AppleAuthButtonProps> = ({
  onSuccess,
  onFailure,
}) => {
  return (
    <AppleSignin
      authOptions={{
        clientId: "com.example.client", // Reemplaza con tu Client ID
        scope: "email name", // Información solicitada
        redirectURI: "https://example.com/auth/callback", // URL de redirección
        state: "state", // Estado opcional
        nonce: "nonce", // Nonce opcional
        usePopup: true, // Abrir como un popup
      }}
      uiType="dark" // Define el diseño del botón (dark o light)
      onSuccess={(response: any) => {
        console.log("Inicio de sesión exitoso:", response);
        onSuccess(response);
      }}
      onError={(error: any) => {
        console.error("Error en Apple Sign-In:", error);
        if (onFailure) onFailure(error);
      }}
      render={(props: any) => (
        <button
          onClick={props.onClick}
          disabled={props.disabled}
          className="apple-signin-button"
        >
          Iniciar sesión con Apple
        </button>
      )}
    />
  );
};

export default AppleAuthButton;
