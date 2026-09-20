const TOKEN_KEY = "vigilens_token";
const USER_KEY = "vigilens_user";

export function saveSession(
  token: string,
  user: unknown,
  rememberMe: boolean = true,
) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const user =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
