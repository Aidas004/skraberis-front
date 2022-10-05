import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // establish socket connection
  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  // subscribe to the socket event
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setSocketConnected(socket.connected);
    });
    socket.on("disconnect", () => {
      setSocketConnected(socket.connected);
    });
  }, [socket]);

  // manage socket connection
  const handleSocketConnection = () => {
    if (socketConnected) socket.disconnect();
    else {
      socket.connect();
    }
  };

  return (
    <div>
      <h2>
        Welcome to Socket.IO App! -{" "}
      </h2>
      <div>
        <b>Connection status:</b>{" "}
        {socketConnected ? "Connected" : "Disconnected"}
      </div>
      <input
        type="button"
        style={{ marginTop: 10 }}
        value={socketConnected ? "Disconnect" : "Connect"}
        onClick={handleSocketConnection}
      />
    </div>
  );
};
export default App;
