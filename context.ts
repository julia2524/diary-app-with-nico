import * as SQLite from "expo-sqlite";

import React, { useContext } from "react";
export const DBContext = React.createContext<SQLite.SQLiteDatabase | null>(
  null
);

export const useDB = () => {
  return useContext(DBContext);
};
