import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.authToken) {
        localStorage.setItem("token", data.authToken);

        const rawName =
          data.user?.name ||
          data.name ||
          data.userName ||
          data.result?.name ||
          "Usuário";
        const firstName = String(rawName).trim().split(" ")[0];

        localStorage.setItem("userName", firstName);
        localStorage.setItem("userRole", data.user_role || "admin");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user_id || data.user?.id,
            name: firstName,
          }),
        );

        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("focus"));

        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao logar! Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Mercado Vital</h2>
        <div className="input-container">
          <Mail className="icon" size={18} />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <Lock className="icon" size={18} />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? (
            "Entrando..."
          ) : (
            <>
              <LogIn size={20} /> Entrar
            </>
          )}
        </button>
      </form>
    </div>
  );
}
