import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Buttons/Button";
import { Toast } from "../../components/Toasts/Toast";
import "./Signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ message: "", type: "warning" });

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToastConfig({
        message: "❌ As senhas não coincidem!",
        type: "error",
      });
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:28B-MVDq/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setToastConfig({
          message: `🚀 Conta criada com sucesso! Bem-vindo, ${name}!`,
          type: "success",
        });
        setShowToast(true);

        localStorage.setItem("token", data.authToken);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        let errorMessage = "Não foi possível realizar o cadastro.";

        if (data.message?.includes("already exists")) {
          errorMessage = "Este e-mail já está cadastrado!";
        } else if (data.message?.includes("short")) {
          errorMessage = "Senha muito curta (mínimo 6 caracteres).";
        }

        setToastConfig({
          message: `⚠️ ${errorMessage}`,
          type: "warning",
        });
        setShowToast(true);
      }
    } catch (error) {
      setToastConfig({
        message: "📡 Erro de conexão com o servidor.",
        type: "error",
      });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleRegister}>
        <h2>Criar Conta</h2>

        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Finalizar Cadastro"}
        </Button>

        <div className="signup-footer">
          Já tem uma conta?{" "}
          <span onClick={() => navigate("/login")}>Entrar</span>
        </div>
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
