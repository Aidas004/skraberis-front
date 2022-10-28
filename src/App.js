import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import '../src/App.css'
import { CSVLink } from "react-csv";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const inputRef = useRef(null);
  const [log, setLog] = useState([])
  const [startAllowed, setStartAllowed] = useState(false)
  const [started, setStarted] = useState(false)
  const [productsCount, setProductsCount] = useState(0)
  const [categoriesChecked, setCategoriesChecked] = useState(0)
  const [productsFound, setProductsFound] = useState(0)
  const [categoriesFound, setCategoriesFound] = useState(0)
  const [customName, setCustomName] = useState('')
  const [data, setData] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // setSocket(io(`http://${process.env.REACT_APP_BACKEND_IP_PLUS_PORT}`));
    setSocket(io(`http://${process.env.REACT_APP_BACKEND_IP_PLUS_PORT_DEV}`));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("data", (response) => {
      if (!response.success) return
      if (response.start_allowed) setStartAllowed(true)
      if (response.message) setLog(log => [`${msToTime(new Date())} message: ${response.message}`, ...log]);
      if (response.productsFound) setProductsFound(Number(response.productsFound.replace('(', '').replace(')', '')))
      if (response.categoriesChecked) setCategoriesChecked(response.categoriesChecked)
      if (response.productCount) setProductsCount(response.productCount)
      if (response.categoriesFound) setCategoriesFound(response.categoriesFound)
    });
    socket.on('getDownloadLink', ({data}) => {
      console.log('data got')
      setData(data)
      setStartAllowed(false)
      setStarted(false)
      setReady(true)
    })
    socket.on("connect", () => {
      setSocketConnected(socket.connected);
      setLog(log => [`${msToTime(new Date())} message: Connected to server successfully...`, ...log])

    });
    socket.on("disconnect", () => {
      setSocketConnected(socket.connected);
      setLog(log => [`${msToTime(new Date())} message: Disconnected from server`, ...log])
      setStarted(false)
      setStartAllowed(false)
    });
  }, [socket]);

  const handleSocketConnection = () => {
    if (socketConnected) socket.disconnect();
    else socket.connect();
  }
  function msToTime(timeNow) {
    const time =
      "@ " +
      timeNow.getHours() +
      ":" +
      timeNow.getMinutes() +
      ":" +
      timeNow.getSeconds()
      return time
  }

  const sendUrl = () => {
    if (inputRef.current.value !== "") return socket.emit("url", { url: inputRef.current.value })
    else setLog(log => [`${msToTime(new Date())} message: Url cannot be empty`, ...log])
  };
  const mappedLog = log.map((x, i) => {
    if (i < 20)  return <div style={{paddingTop: 5, paddingBottom: 5, borderTop: '1px dotted grey'}}>{x}</div>
    else return null
  })
  const handleClick = () => {
    setStarted(!started)
    if (!started) {
      socket.emit("start", {})
      setReady(false)
    }
    else {
      socket.emit("stop", {})
      setStartAllowed(false)
    }
  }
  return (
    <div style={{ padding: 30, height: '100vh', color: '#1bad71' }} className="app flex-col">
      <div className="flex">
        <b>Connection with server status: </b>{" "}
        {socketConnected ? " Connected" : " Disconnected"}
        <div className="btn" style={{ marginLeft: 10 }} onClick={handleSocketConnection}>{socketConnected ? "Disconnect" : "Connect"}</div>
      </div>
      <div style={{ marginTop: 20 }} className="flex">
        <input style={{width: 317}} ref={inputRef} placeholder="url" />
        {!startAllowed && <div  className='btn' disabled={!socketConnected || started} style={{ marginLeft: 10 }} onClick={sendUrl}>Send url</div>}
        {startAllowed && <div className="btn" onClick={handleClick} style={{ marginLeft: 10 }}>{!started ? 'Start' : 'Stop'}</div>}
        {ready && <CSVLink style={{marginLeft: 20}} className={"btn"} filename={`${customName}.csv`} data={data}>Download</CSVLink>}
        <div className="table" style={{marginLeft: 20}}>Products: {productsCount} / {productsFound}</div>
        <div className="table">Categories Checked: {categoriesChecked} / {categoriesFound}</div>
        {/* <div className="table">Duplicates: {duplicates}</div> */}
      </div>
      <div style={{marginTop: 30}}>
        {mappedLog}
      </div>
    </div>
  );
};
export default App;
