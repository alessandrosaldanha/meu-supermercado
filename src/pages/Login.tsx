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
        const nomeVindoDaAPI =
          data.userName || data.user?.name || data.result?.name || "Usuário";
        const firstName = String(nomeVindoDaAPI).trim().split(" ")[0];

        localStorage.setItem("userName", firstName);
        localStorage.setItem("userRole", data.user_role || "member");

        window.dispatchEvent(new Event("storage"));
        navigate("/");
      }
    } catch (error) {
      console.error("Erro no login:", error);
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
