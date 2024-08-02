import React, { useState, useEffect } from "react";
import socket from "../../services/socket";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log("Setting up notification listener");
    socket.on("notification", (data) => {
      console.log("Notification received:", data);
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      console.log("Removing notification listener");
      socket.off("notification");
    };
  }, []);
  console.log("Notification received:", notifications);
  return (
    <div>
      {notifications.map((notification, index) => (
        <Snackbar key={index} open={true} autoHideDuration={6000} onClose={() => setNotifications([])}>
          {notification.messageType == "like" ? (
            <Alert severity="info">{notification.message}</Alert>
          ) : (
            <Alert severity="error">{notification.message}</Alert>
          )}
        </Snackbar>
      ))}
    </div>
  );
};

export default Notification;
