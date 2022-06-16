import { useEffect, useState } from "react";

import { api, FetchError } from "./api";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { useAppDispatch, useAppSelector } from "./store";
import { logout, setUser, User } from "./userSlice";

async function getUser() {
  return await api("/me");
}

function App() {
  const user = useAppSelector((state) => state.user.value);
  const dispatch = useAppDispatch();
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const handleLoginSuccess = async (googleUser: gapi.auth2.GoogleUser) => {
    await api("/auth/google", {
      method: "POST",
      body: JSON.stringify({ token: googleUser.getAuthResponse().id_token }),
    });

    const data = await getUser();
    dispatch(setUser(data));
  };

  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      try {
        const data = await getUser();
        if (ignore) return;
        dispatch(setUser(data));
      } catch (e) {
        if (e instanceof FetchError) {
          console.log(e.code);
        }
      }
    };
    fetchUser();

    return () => {
      ignore = true;
    };
  }, [dispatch]);

  const handleGetProtected = async () => {
    const data = await api("/me");
    setUserProfile(data);
  };

  return (
    <div>
      <header className="flex items-center p-4 bg-gray-100">
        <div className="flex items-center gap-4">
          {user ? (
            <LogoutButton onLogout={() => dispatch(logout())} />
          ) : (
            <LoginButton
              onSuccess={handleLoginSuccess}
              onError={(reason) => console.error(reason)}
            />
          )}
          {user ? (
            <>
              <img
                src={user.picture}
                alt={user.email}
                className="h-9 w-9 rounded-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <span className="text-gray-600">{user.name}</span>
            </>
          ) : null}
        </div>
      </header>
      <div className="p-4">
        <button
          className="px-4 flex items-center h-9 bg-blue-600 rounded text-white"
          onClick={handleGetProtected}
        >
          get protected 🔒
        </button>

        <pre className="block whitespace-pre overflow-auto bg-gray-100 p-6 mt-4">
          <code>{JSON.stringify(userProfile, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;
