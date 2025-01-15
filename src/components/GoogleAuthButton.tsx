import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleAuthButtonProps {
  onSuccess: (user: any) => void;
  onFailure?: () => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onFailure,
}) => {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const decodedUser  = jwtDecode(credentialResponse.credential);
        onSuccess(decodedUser );
      } catch (error) {
        console.error("Error decoding token:", error);
        if (onFailure) onFailure();
      }
    } else {
      console.error("No credential received");
      if (onFailure) onFailure();
    }
  };

  const handleError = () => {
    console.error("Error en Google Login");
    if (onFailure) onFailure();
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap={false} 
      text="continue_with"
    />
  );
};

export default GoogleAuthButton;