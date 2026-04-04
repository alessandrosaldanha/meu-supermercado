import axios from "axios";

// Sua URL real do Xano
const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:jB1XPgef";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: {
    url: string;
  };
  category: string;
  is_featured: boolean;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (): Promise<Product[]> => {
  try {
    // Note que aqui chamamos o endpoint /products que está no seu grupo Event Logs
    const response = await api.get<Product[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};

// Função de Login
export const loginUser = async (email: string, password: string) => {
  try {
    // Usamos a URL completa do seu endpoint de auth
    const response = await axios.post(
      "https://x8ki-letl-twmt.n7.xano.io/api:28B-MVDq/auth/login",
      {
        email,
        password,
      },
    );

    // O Xano costuma retornar { authToken: "..." }
    return response.data;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw error; // Repassamos o erro para a tela de Login tratar
  }
};
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data: Product[] = await response.json();
    return data.filter((product) => product.is_featured === true);
  } catch (error) {
    console.error("Erro ao buscar destaques:", error);
    return [];
  }
};

export default api;
