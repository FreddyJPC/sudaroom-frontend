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
      const decodedUser = jwtDecode(credentialResponse.credential);
      onSuccess(decodedUser);
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
      useOneTap
      text="continue_with"
    />
  );
};

export default GoogleAuthButton;
