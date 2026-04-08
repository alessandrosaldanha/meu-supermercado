import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Buttons/Button";
import "./Signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:28B-MVDq/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Conta criada com sucesso! Bem-vindo, ${name}!`);
        localStorage.setItem("token", data.authToken);
        navigate("/");
      } else {
        let errorMessage = "Não foi possível realizar o cadastro.";

        if (data.message && data.message.includes("already exists")) {
          errorMessage =
            "Este e-mail já está cadastrado. Tente fazer login ou use outro!";
        } else if (data.message && data.message.includes("required")) {
          errorMessage = "Por favor, preencha todos os campos.";
        } else if (data.message && data.message.includes("short")) {
          errorMessage =
            "Sua senha é muito curta. Use pelo menos 6 caracteres.";
        }

        alert(`⚠️ Ops! ${errorMessage}`);
      }
    } catch (error) {
      console.error("Erro ao conectar com Xano:", error);
      alert(
        "📡 Verifique sua conexão. Não conseguimos falar com o Mercado Vital.",
      );
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
    </div>
  );
}
