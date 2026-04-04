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
        // 1. Salva o Token
        localStorage.setItem("token", data.authToken);

        // 2. Busca o objeto do usuário (O Pente Fino)
        // Tentamos todas as formas que o Xano costuma enviar
        const userToSave =
          data.user || data.result?.user || data.result || data;

        // 3. Salva o objeto completo (crucial para o ID do comentário)
        localStorage.setItem("user", JSON.stringify(userToSave));

        // 4. Tenta pegar o nome (tenta 'name' ou 'nome')
        const rawName =
          userToSave.name ||
          userToSave.nome ||
          userToSave.first_name ||
          "Vital";
        const firstName = rawName.split(" ")[0];

        localStorage.setItem("userName", firstName);
        localStorage.setItem(
          "userRole",
          data.user_role || userToSave.role || "user",
        );

        window.dispatchEvent(new Event("storage"));
        navigate("/");
      }
    } catch (error) {
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
