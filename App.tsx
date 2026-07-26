import { NavigationContainer } from "@react-navigation/native";

import Navigator from "./navigator";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as SQLite from "expo-sqlite";

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS feelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emotion TEXT NOT NULL,
    message TEXT NOT NULL
  );
`;

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function startLoading() {
      try {
        const db = await SQLite.openDatabaseAsync("nomadDiaryDB");

        await db.execAsync(createTableQuery);
      } catch (error) {
        console.warn(error);
      } finally {
        setReady(true);
      }
    }
  });
  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);
  if (!ready) {
    return null;
  }
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
