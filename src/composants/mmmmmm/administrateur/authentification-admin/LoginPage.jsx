import { login } from "../services/login";
import { useAuth } from "../../../AuthContext";

export default function LoginPage() {
  const { setUser } = useAuth();

  const handleLogin = async () => {
    const data = await login("test@mail.com", "1234");
    setUser(data.user);
  };

  return <button onClick={handleLogin}>Login</button>;
}

