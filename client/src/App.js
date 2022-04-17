import "./App.css";
import { useState, useEffect } from "react";
import { Home } from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LinkLogs } from "./components/LinkLogs";
import M from "materialize-css/dist/js/materialize.min";
import axios from "axios";
function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  async function refresh() {
    setLoading(true);
    const myres = await axios.get("/api/v1/data");
    if (myres.status === 200) {
      setData(myres.data.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    try {
      refresh();
      setInterval(() => {
        refresh();
      }, 100000);
    } catch (error) {
      M.toast({ html: "something went wrong" });
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                data={data}
                loading={loading}
                setLoading={setLoading}
                setData={setData}
              />
            }
          />
          <Route
            path="/:Linkid"
            element={<LinkLogs refresh={refresh}/>}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
