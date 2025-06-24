import { Stack } from "expo-router/stack";
import { AuthContext, User } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { loadUser } from "../services/AuthService";
import SplashScreen from "./splash";

export default function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function runEffect() {
      try {
        const user = await loadUser();
        setUser(user);
      } catch (error) {
        console.log("Error loading user", error);
      } finally {
        setStatus("idle");
      }
    }
    runEffect();
  }, []);

  // Add logging for user state changes
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  if (status === "loading") {
    return <SplashScreen />;
  }

  console.log("Rendering layout with user:", user ? "authenticated" : "not authenticated");

  return (
<AuthContext.Provider value={{ user, setUser }}>
    <Stack>
      {user ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
          <>
          <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
          </>
      )}
    </Stack>
    </AuthContext.Provider>
  );
}
