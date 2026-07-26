import { NavigationContainer } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import Navigator from "./navigator";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { DBContext } from "./context";

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
  const [db, setDB] = useState<SQLite.SQLiteDatabase | null>(null);
  useEffect(() => {
    async function initDB() {
      try {
        const connection = await SQLite.openDatabaseAsync("nomadDiaryDB");
        await connection.execAsync(createTableQuery);

        setDB(connection);
        console.log("DB 초기화 및 테이블 생성 완료!");
      } catch (error) {
        console.warn("DB 초기화 실패:", error);
      } finally {
        setReady(true);
      }
    }
    initDB();
  }, []);
  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);
  if (!ready) {
    return null;
  }
  return (
    <DBContext.Provider value={db}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
