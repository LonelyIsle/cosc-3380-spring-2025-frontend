import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);
const getToken = () => localStorage.getItem("token");
const URL_PATH = `${import.meta.env.VITE_API_URL}`;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);

  // Authorization header for requests that require auth
  const token = getToken();
  const authHeader = { headers: { Authorization: token } };

  // Fetch all notifications (GET notification)
  const fetchNotifications = async () => {
    setNotificationsLoaded(false);
    try {
      const res = await axios.get(`${URL_PATH}/notification`, authHeader);
      const mappedNotifications = res.data.data.rows.map((notification) => ({
        id: notification.id,
        employee_id: notification.employee_id,
        title: notification.title,
        description: notification.description,
        status: notification.status,
        created_at: notification.created_at,
        updated_at: notification.updated_at,
        deleted_at: notification.deleted_at,
        is_deleted: notification.is_deleted,
        employee: notification.employee,
      }));
      setNotifications(mappedNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setNotificationsLoaded(true);
    }
  };

  // Fetch a single notification by ID (GET notification/:id)
  const fetchNotificationById = async (id) => {
    try {
      const res = await axios.get(`${URL_PATH}/notification/${id}`, authHeader);
      return res.data.data;
    } catch (err) {
      console.error(`Failed to fetch notification with id ${id}:`, err);
      throw err;
    }
  };

  // Update a notification (PATCH notification/:id)
  // For example, to update the notification's status.
  const updateNotification = async (id, data) => {
    try {
      const res = await axios.patch(
        `${URL_PATH}/notification/${id}`,
        data,
        authHeader,
      );
      const updatedNotification = res.data.data;
      // Update the local state to reflect the updated notification.
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? updatedNotification : notification,
        ),
      );
      return updatedNotification;
    } catch (err) {
      console.error(`Failed to update notification with id ${id}:`, err);
      throw err;
    }
  };

  // Initially load notifications when the provider mounts.
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationsLoaded,
        fetchNotifications,
        fetchNotificationById,
        updateNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
