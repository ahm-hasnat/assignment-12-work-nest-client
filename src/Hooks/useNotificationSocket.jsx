import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

let socket; // single persistent socket

export const useNotificationSocket = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?.email) {
      // If no user, disconnect socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      return;
    }

    const newSocket = io(`https://assignment-12-work-nest-server.onrender.com`);

    newSocket.on("connect", () => console.log("Socket connected:", newSocket.id));

    newSocket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    // Join the user's room
    newSocket.emit("join", user.email);

    setSocket(newSocket);


    // Fetch previous notifications
    const fetchNotifications = async () => {
      try {
        const res = await axiosSecure.get(`/notifications?toEmail=${user.email}`);
        setNotifications(res.data);
      } catch (err) {
        // console.error(err);
      }
    };
    fetchNotifications();

    return () => {
      newSocket.off("new_notification");
      newSocket.off("connect");
      newSocket.disconnect();
    };
  }, [user?.email, axiosSecure]);

  return { notifications, setNotifications };

  
};
