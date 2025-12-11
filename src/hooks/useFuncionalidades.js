import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../helpers/constants";

export const useFuncionalidades = () =>
  useQuery({
    queryKey: ["funcionalidades"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/funcionalidades.json`);
      if (!res.ok) throw new Error("Error al cargar funcionalidades");
      const data = await res.json();
      return data || {};
    },
  });