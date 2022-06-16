import { gapi } from "gapi-script";

interface Props {
  onLogout: () => void;
}

export const LogoutButton = ({ onLogout }: Props) => {
  const handleLogout = async () => {
    const auth2 = gapi.auth2.getAuthInstance();
    await auth2.signOut();

    await fetch("http://localhost:8080/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    onLogout();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 flex items-center h-9 bg-blue-600 rounded text-white"
    >
      Logout
    </button>
  );
};
