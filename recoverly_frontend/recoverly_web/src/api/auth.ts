import { api } from "./client";

export type UserOut = {
  counsellor_id: string;
  email: string;
  full_name?: string | null;
  role: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
  user: UserOut;
};

// Backend uses OAuth2PasswordRequestForm => username + password (form-url-encoded)
export async function login(email: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const res = await api.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data as LoginResponse;
}

export async function me(): Promise<UserOut> {
  const res = await api.get("/auth/me");
  return res.data as UserOut;
}