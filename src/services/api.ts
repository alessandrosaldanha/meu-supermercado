import axios from "axios";

// Sua URL real do Xano
const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:jB1XPgef";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  image: {
    url: string;
  }[];
  category: string;
  is_featured: boolean;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (page: number = 1): Promise<Product[]> => {
  // Se no Xano o input chama "page", aqui tem que ser ?page=
  const response = await fetch(`${API_URL}/products?page=${page}`);
  const data = await response.json();

  // Lembre-se: como ativamos Metadata, use data.items
  return data.items || [];
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
    // Chamando o endpoint que você acabou de filtrar no Xano
    const response = await fetch(`${API_URL}/featured`);
    const data = await response.json();

    // Como você ativou 'Include Metadata', os produtos estão em data.items
    const productsList = data.items || data;

    if (!Array.isArray(productsList)) return [];

    // Retorna a lista para o FeaturedSlider.tsx
    return productsList;
  } catch (error) {
    console.error("Erro ao buscar destaques:", error);
    return [];
  }
};

export const getProductById = async (
  id: string | undefined,
): Promise<Product | null> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do produto", error);
    return null;
  }
};

export default api;
