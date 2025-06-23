import axios from "../utils/axios";
import { getToken, setToken } from "./TokenService";

export async function login(credentials: {
  email: string;
  password: string;
  device_name: string;
}) {
  console.log("Attempting login with:", credentials);
  console.log("Making request to:", axios.defaults.baseURL + "/login");
  
  const { data } = await axios.post("/login", credentials);
  console.log("Login response:", data);

  await setToken(data.token);
}

export async function loadUser() {
  const token = await getToken();
  const { data: user } = await axios.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return user;
}
