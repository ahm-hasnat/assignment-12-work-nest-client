// src/hooks/useNotificationSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";


let socket;

export const useNotificationSocket = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [notifications, setNotifications] = useState([]);

  // Connect socket & fetch initial notifications
  useEffect(() => {
    if (!user?.email) return;

    // Connect to server
    socket = io("http://localhost:5000"); // replace with backend URL
    socket.emit("register", user.email);

    // Listen for new notifications
    socket.on("newNotification", (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    // Fetch existing notifications
    const fetchNotifications = async () => {
      const res = await axiosSecure.get(`/notifications?toEmail=${user.email}`);
      setNotifications(res.data);
    };
    fetchNotifications();

    return () => socket.disconnect();
  }, [user?.email, axiosSecure]);

  return { notifications, setNotifications };
};
