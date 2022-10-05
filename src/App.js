import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const inputRef = useRef(null);
  const back_end_port = 1337;
  const [log, setLog] = useState([])
  const [startAllowed, setStartAllowed] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setSocket(io(`http://localhost:${back_end_port}`));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("data", (response) => {
      if (response.success) {
        if (response.start_allowed) setStartAllowed(true)
        setLog(log => [`${msToTime(new Date())} message: ${response.message}`, ...log]);

      }
    });
    socket.on("connect", () => {
      setSocketConnected(socket.connected);
      setLog(log => [`${msToTime(new Date())} message: Connected to server successfully...`, ...log]);

    });
    socket.on("disconnect", () => {
      setSocketConnected(socket.connected);
      setLog(log => [`${msToTime(new Date())} message: Disconnected from server`, ...log]);
    });
  }, [socket]);

  const handleSocketConnection = () => {
    if (socketConnected) socket.disconnect();
    else {
      socket.connect();
    }
  };
  function msToTime(currentdate) {
    const datetime =
      "@ " +
      // currentdate.getDate() +
      // "/" +
      // (currentdate.getMonth() + 1) +
      // "/" +
      // currentdate.getFullYear() +
      // " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

      return datetime
  }

  const sendUrl = () => {
    if (inputRef.current.value !== "") {
      return socket.emit("url", { url: inputRef.current.value });
    } else {
      setLog(log => [`${msToTime(new Date())} message: Url cannot be empty`, ...log]);
    }
  };
  const mappedLog = log.map((x, i) => {
    if (i < 20) {
      return <div style={{paddingTop: 5, paddingBottom: 5, borderTop: '1px dotted grey'}}>{x}</div>;
    }
  })
  const handleClick = () => {
    setStarted(!started)
    if (!started) socket.emit("start", {});
    else socket.emit("stop", {});
  }
  return (
    <div style={{ padding: 30 }} className="app flex-col">
      <div>
        <b>Connection with server status:</b>{" "}
        {socketConnected ? "Connected" : "Disconnected"}
        <input
          type="button"
          style={{ marginTop: 10, marginLeft: 10 }}
          value={socketConnected ? "Disconnect" : "Connect"}
          onClick={handleSocketConnection}
        />
      </div>
      <div style={{ marginTop: 20 }} className="flex flex-col">
        <input style={{width: 317}} ref={inputRef} placeholder="url" />
        <button disabled={!socketConnected || started} style={{ marginLeft: 10 }} onClick={sendUrl}>
          Send url
        </button>
        {startAllowed && <button onClick={handleClick} style={{ marginLeft: 10 }}>{!started ? 'Start' : 'Stop'}</button>}
      </div>
      <div style={{marginTop: 30}}>
        {mappedLog}
      </div>
    </div>
  );
};
export default App;
