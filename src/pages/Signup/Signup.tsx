import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { Button } from "../../components/Buttons/Button";
import { Stamp } from "../../components/Stamp/Stamp";
import { useToast } from "../../context/ToastContext";
import "./Signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("❌ As senhas não coincidem!", "error");
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
        showToast(`🚀 Conta criada com sucesso! Bem-vindo, ${name}!`, "success");

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

        showToast(`⚠️ ${errorMessage}`, "warning");
      }
    } catch (error) {
      showToast("📡 Erro de conexão com o servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header-top">
            <span className="auth-eyebrow">Novo por aqui?</span>
            <Stamp variant="tag" tone="papaya" className="auth-badge">
              Feira Livre
            </Stamp>
          </div>
          <h1 className="auth-title">Criar conta</h1>
          <p className="auth-sub">
            Cadastre-se e receba a colheita de hoje direto em casa.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-container">
            <User className="icon" size={18} />
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <Mail className="icon" size={18} />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <Lock className="icon" size={18} />
            <input
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <Lock className="icon" size={18} />
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Finalizar Cadastro"}
          </Button>
        </form>

        <p className="auth-footer">
          Já tem uma conta?{" "}
          <span onClick={() => navigate("/login")}>Entrar</span>
        </p>
      </div>
    </div>
  );
}
