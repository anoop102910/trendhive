import { type NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";

export const shadcnNotificationProvider: NotificationProvider = {
  open: ({ key, message, description, type }) => {
    console.log(message, description);
    switch (type) {
      case "success":
        toast.success(message, {
          id: key,
          description,
        });
        break;
      case "error":
        toast.error(message, {
          id: key,
          description,
        });
        break;
      default:
        toast(message, {
          id: key,
          description,
        });
        break;
    }
  },
  close: key => {
    toast.dismiss(key);
  },
};
