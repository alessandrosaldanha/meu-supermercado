import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Save, MapPin, Loader2, Edit3 } from "lucide-react";
import { Button } from "../../components/Buttons/Button";
import "./Profile.css";
import type { User } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar edição
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
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Pegamos o ID do usuário que está logado
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return;

      const parsedUser = JSON.parse(savedUser);
      const userId = parsedUser.id;

      setLoading(true);
      try {
        const response = await api.get(`user/${userId}`);
        setUserData(response.data);

        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Erro ao carregar dados do Xano:", error);
        showToast("❌ Não conseguimos carregar seus dados.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCEPBlur = async () => {
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

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setLoading(true);
    try {
      const response = await api.patch(`user/${userData.id}`, userData);
      localStorage.setItem("user", JSON.stringify(response.data));

      showToast("✅ Seus dados foram atualizados com sucesso!", "success");

      setIsEditing(false); // Volta para o modo de leitura
    } catch (error) {
      console.error(error);
      showToast("❌ Erro ao salvar os dados. Tente novamente.", "error");
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
              disabled={!isEditing}
              className={!isEditing ? "input-readonly" : ""}
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
                disabled={!isEditing}
                className={!isEditing ? "input-readonly" : ""}
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
                disabled={!isEditing}
                className={!isEditing ? "input-readonly" : ""}
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
              disabled={!isEditing}
              className={!isEditing ? "input-readonly" : ""}
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
              disabled={!isEditing}
              className={!isEditing ? "input-readonly" : ""}
              value={userData.complemento}
              onChange={(e) =>
                setUserData({ ...userData, complemento: e.target.value })
              }
              placeholder="Ex: Próximo ao Posto BR"
            />
          </div>
        </section>

        <Button
          type="submit"
          variant={isEditing ? "primary" : "secondary"}
          disabled={loading}
          className="profile-submit"
        >
          {loading ? (
            <Loader2 className="spinner" />
          ) : isEditing ? (
            <>
              <Save size={20} /> Salvar Alterações
            </>
          ) : (
            <>
              <Edit3 size={20} /> Editar Endereço
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
