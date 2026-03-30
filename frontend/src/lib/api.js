const envApiBase =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE;

const fallbackApiBase =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://makemyfinance-a-personal-finance.onrender.com/api"
    : "http://localhost:8000/api";

export const API_BASE = (envApiBase || fallbackApiBase).replace(/\/$/, "");