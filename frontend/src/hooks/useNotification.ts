import { useContext } from "react";
import { NotificationContext } from "../context/notificationContext";

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
};
