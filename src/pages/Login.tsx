import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Importando o CSS específico

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:28B-MVDq/auth/login",
        {
          email,
          password,
        },
      );

      if (response.data.authToken) {
        localStorage.setItem("token", response.data.authToken);
        navigate("/");
      }
    } catch (error) {
      alert("Erro ao logar!");
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
          />
        </div>

        <div className="input-container">
          <Lock className="icon" size={18} />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
