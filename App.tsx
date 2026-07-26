import { NavigationContainer } from "@react-navigation/native";

import Navigator from "./navigator";
import React, { createContext, useEffect, useState } from "react";
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
const Context = React.createContext<SQLite.SQLiteDatabase | null>(null);
export default function App() {
  const [ready, setReady] = useState(false);
  const [db, setDB] = useState<SQLite.SQLiteDatabase | null>(null);
  useEffect(() => {
    async function startLoading() {
      try {
        const connection = await SQLite.openDatabaseAsync("nomadDiaryDB");
        await connection.execAsync(createTableQuery);
        setDB(connection);
      } catch (error) {
        console.warn(error);
      } finally {
        setReady(true);
      }
    }
    startLoading();
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
    <Context.Provider value={db}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Context.Provider>
  );
}
