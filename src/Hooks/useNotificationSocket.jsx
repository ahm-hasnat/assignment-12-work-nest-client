import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

let socket; // single persistent socket

export const useNotificationSocket = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    // Initialize socket only once
    if (!socket) {
      socket = io("http://localhost:5000");

      socket.on("connect", () => console.log("Socket connected:", socket.id));

      socket.on("new_notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
    }

    // Join the user's room
    socket.emit("join", user.email);

    // Fetch previous notifications
    const fetchNotifications = async () => {
      try {
        const res = await axiosSecure.get(`/notifications?toEmail=${user.email}`);
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();

    return () => {
      socket.off("new_notification");
      socket.off("connect");
    };
  }, [user?.email, axiosSecure]);

  return { notifications, setNotifications };
};
