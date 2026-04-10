import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { loginUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../components/Toasts/Toast";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ message: "", type: "warning" });

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

        setToastConfig({
          message: `👋 Bem-vindo de volta, ${firstName}!`,
          type: "success",
        });
        setShowToast(true);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error(error);

      setToastConfig({
        message: "❌ Erro ao logar! Verifique seu e-mail e senha.",
        type: "error",
      });
      setShowToast(true);
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
      {showToast && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
