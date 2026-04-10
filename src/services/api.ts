import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: number;
  name: string;
  email: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  complemento?: string;
}
export interface Review {
  id: string | number;
  products_id: string | number;
  user_id: number;
  rating: number;
  parent_id?: string | null;
  replies?: Review[];
  comment: string;
  created_at: number;
  user?: {
    name: string;
  };
  user_name: string;
}
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
  reviews: Review[];
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (page: number = 1): Promise<Product[]> => {
  const response = await api.get(`products`, {
    params: { page },
  });
  return response.data.items || response.data || [];
};

export const loginUser = async (email: string, password: string) => {
  try {
    // Agora usa o baseURL correto automaticamente
    const response = await api.post("auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw error;
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get(`featured`);
    const data = response.data;
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
    const response = await api.get<Product>(`products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do produto", error);
    return null;
  }
};

export const postReview = async (
  productId: string,
  rating: number,
  comment: string,
  parentId: string | null = null,
  userId: number,
) => {
  const savedUser = localStorage.getItem("user");
  const parsedUser = savedUser ? JSON.parse(savedUser) : null;
  const userName = parsedUser?.name || "Cliente Vital";
  const response = await api.post("reviews", {
    products_id: productId,
    user_id: userId,
    user_name: userName,
    rating: rating,
    comment: comment,
    parent_id: parentId,
  });

  return response.data;
};

export const updateUserProfile = async (
  userId: number,
  data: Partial<User>,
): Promise<User> => {
  try {
    const response = await api.patch(`user/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

export default api;
