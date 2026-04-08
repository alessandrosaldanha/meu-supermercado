import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Save, MapPin, Loader2 } from "lucide-react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

// CORREÇÃO 1: Importação de tipo para evitar o erro TS1484
import type { User } from "../services/api";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "Maceió",
    complemento: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserData((prev) => ({ ...prev, ...parsedUser }));
    }
  }, []);

  const handleCEPBlur = async () => {
    // Agora o .cep sempre será uma string (mesmo que vazia), então o replace funciona
    const cleanCEP = (userData.cep || "").replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCEP}/json/`,
      );
      const data = await response.json();

      if (!data.erro) {
        setUserData((prev) => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.patch(`user/${userData.id}`, userData);
      localStorage.setItem("user", JSON.stringify(response.data));
      alert("✅ Dados atualizados com sucesso!");
      navigate("/");
    } catch (error) {
      alert("Erro ao salvar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Meu Perfil</h1>
      <form onSubmit={handleSave} className="profile-form">
        <section>
          <h3>
            <MapPin size={20} /> Endereço de Entrega
          </h3>

          <div className="input-group">
            <label>CEP</label>
            <input
              type="text"
              value={userData.cep}
              onChange={(e) =>
                setUserData({ ...userData, cep: e.target.value })
              }
              onBlur={handleCEPBlur}
              placeholder="00000-000"
            />
          </div>

          <div className="row">
            <div className="input-group flex-3">
              <label htmlFor="rua-field">Rua/Logradouro</label>
              <input
                id="rua-field"
                type="text"
                value={userData.logradouro}
                onChange={(e) =>
                  setUserData({ ...userData, logradouro: e.target.value })
                }
              />
            </div>
            <div className="input-group flex-1">
              <label htmlFor="num-field">Número</label>
              <input
                id="num-field"
                type="text"
                value={userData.numero}
                onChange={(e) =>
                  setUserData({ ...userData, numero: e.target.value })
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="bairro-field">Bairro</label>
            <input
              id="bairro-field"
              type="text"
              value={userData.bairro}
              onChange={(e) =>
                setUserData({ ...userData, bairro: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label htmlFor="comp-field">
              Ponto de Referência / Complemento
            </label>
            <input
              id="comp-field"
              type="text"
              value={userData.complemento}
              onChange={(e) =>
                setUserData({ ...userData, complemento: e.target.value })
              }
              placeholder="Ex: Próximo ao Posto BR"
            />
          </div>
        </section>

        <button type="submit" disabled={loading} className="btn-save">
          {loading ? <Loader2 className="spinner" /> : <Save size={20} />}
          Salvar Endereço
        </button>
      </form>
    </div>
  );
}
