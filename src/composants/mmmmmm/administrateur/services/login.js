import { saveTokens } from "../services/jwtServices";

export async function login(email, password) {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  saveTokens(data.accessToken, data.refreshToken);
  return data; 
}

