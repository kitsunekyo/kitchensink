import { gapi, loadAuth2 } from "gapi-script";
import { useEffect, useRef } from "react";

function initAuth2() {
  return loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID || "", "");
}

interface Props {
  onSuccess: (googleUser: gapi.auth2.GoogleUser) => void;
  onError: (reason: string) => void;
}

export const LoginButton = ({ onSuccess, onError }: Props) => {
  const loginRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const attachAuth2Signin = async () => {
      const auth2 = await initAuth2();
      if (!loginRef.current) return;
      auth2.attachClickHandler(loginRef.current, {}, onSuccess, onError);
    };
    attachAuth2Signin();
  });

  return (
    <button
      ref={loginRef}
      className="px-4 flex items-center h-9 bg-blue-600 rounded text-white"
    >
      Login with Google
    </button>
  );
};
