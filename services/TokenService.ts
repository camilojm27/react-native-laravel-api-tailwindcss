import * as SecureStore from "expo-secure-store";

let token: string | null = null;

export async function setToken(newToken: string) {
  token = newToken;
  if (token !== null) {
    await SecureStore.setItemAsync("token", token);
    return;
  }
  await SecureStore.deleteItemAsync("token");
}

export async function getToken() {
  if (token !== null) {
    return token;
  }
  token = await SecureStore.getItemAsync("token");
  return token;
}
