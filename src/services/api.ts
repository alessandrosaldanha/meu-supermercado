import axios from "axios";

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
  parentId?: string;
  userId: number;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (page: number = 1): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products?page=${page}`);
  const data = await response.json();
  return data.items || [];
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      "https://x8ki-letl-twmt.n7.xano.io/api:28B-MVDq/auth/login",
      { email, password },
    );
    return response.data;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw error;
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/featured`);
    const data = await response.json();
    const productsList = data.items || data;
    return Array.isArray(productsList) ? productsList : [];
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

export const postReview = async (
  productId: string | number,
  rating: number,
  comment: string,
  parentId?: string | null,
  userId?: number,
) => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Usuário não autenticado");

  const response = await axios.post(
    `https://x8ki-letl-twmt.n7.xano.io/api:jB1XPgef/reviews`,
    {
      products_id: productId,
      user_id: userId, // Usando a variável correta e o nome da coluna do Xano
      rating: rating,
      comment: comment,
      parent_id: parentId || null,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return response.data;
};

export default api;
