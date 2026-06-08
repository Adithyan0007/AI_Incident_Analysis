const API_URL = "http://localhost:4000";

export const api = {
  async post(path: string, body: unknown, token?: string | null) {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    return res.json();
  },

  async get(path: string, token?: string | null) {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return res.json();
  },
};
