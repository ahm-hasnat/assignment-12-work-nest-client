import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNotificationSocket } from "../../Hooks/useNotificationSocket";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const NotificationBell = () => {
  const { notifications, setNotifications } = useNotificationSocket();
  const [open, setOpen] = useState(false);
  const popupRef = useRef();
  const axiosSecure = useAxiosSecure();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

   const markAsRead = async (e, notification) => {
    e.stopPropagation(); // 🚀 prevents route navigation
    if (!notification.read) {
      await axiosSecure.patch(`/notifications/${notification._id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
      );
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await axiosSecure.patch(`/notifications/${notification._id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
      );
    }
    window.location.href = notification.actionRoute;
  };

  return (
    <div className="relative inline-block"> {/* <-- make parent relative */}
  <FaBell
    className="text-xl mt-2 cursor-pointer hover:text-[#49ed2c] transition-colors duration-200"
    onClick={(e) => {
      e.stopPropagation();
      setOpen(!open);
    }}
  />

  {unreadCount > 0 && (
    <span className="absolute top-0.5 -right-1 bg-red-500 text-white text-xs
                     w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
      {unreadCount}
    </span>
  )}

  {open && (
    <div
      ref={popupRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute -left-1 top-full mt-5 w-80 max-h-96 overflow-y-auto
                 bg-white shadow-xl border border-gray-200 rounded-lg z-50"
    >
      {notifications.length === 0 ? (
        <p className="p-3 text-center text-gray-500">No notifications</p>
      ) : (
        notifications.map((n, idx) => (
          <div
            key={idx}
            className={`p-3 flex items-start gap-3 hover:bg-gray-100 cursor-pointer ${
              !n.read ? "bg-gray-100 font-medium" : ""
            }`}
            onClick={() => handleNotificationClick(n)}
          >
            <div className="mt-1 bg-green-500 p-1 rounded-lg"><FaBell className="text-md text-white "></FaBell></div>
            <div><p className="text-sm">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(n.time).toLocaleString()}
            </p>
            {!n.read && (
                <div className="flex mt-1">
                <button
                  onClick={(e) => markAsRead(e, n)} // stopPropagation passed
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  Mark as Read
                </button>
                </div>
              )}
            </div>
             
          </div>
        ))
      )}
    </div>
  )}
</div>

  );
};

export default NotificationBell;
