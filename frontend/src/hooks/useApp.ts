import { useContext } from "react";
import { AppContext } from "../context/appContext";

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AppProvider");
  }
  return context;
}
