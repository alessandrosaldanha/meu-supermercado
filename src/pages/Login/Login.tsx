import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { loginUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/Buttons/Button";
import { Stamp } from "../../components/Stamp/Stamp";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.authToken) {
        const userId = data.user_id || data.user?.id || data.id;
        const rawName =
          data.user?.name || data.name || data.userName || "Usuário";
        const firstName = String(rawName).trim().split(" ")[0];

        localStorage.setItem("token", data.authToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: userId,
            name: firstName,
          }),
        );
        localStorage.setItem("userName", firstName);
        localStorage.setItem("userRole", data.user_role || "member");

        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("focus"));

        showToast(`👋 Bem-vindo de volta, ${firstName}!`, "success");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error(error);

      showToast("❌ Erro ao logar! Verifique seu e-mail e senha.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header-top">
            <span className="auth-eyebrow">Mercado de bairro, em Maceió</span>
            <Stamp variant="tag" tone="papaya" className="auth-badge">
              Feira Livre
            </Stamp>
          </div>
          <h1 className="auth-title">Bem-vindo de volta</h1>
          <p className="auth-sub">
            Entre para continuar suas compras na feira.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
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

          <Button
            type="submit"
            variant="primary"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              "Entrando..."
            ) : (
              <>
                <LogIn size={20} /> Entrar
              </>
            )}
          </Button>
        </form>

        <p className="auth-footer">
          Ainda não tem conta?{" "}
          <span onClick={() => navigate("/signup")}>Criar conta</span>
        </p>
      </div>
    </div>
  );
}
