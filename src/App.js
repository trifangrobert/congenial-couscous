import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Login from "./components/Login";
import Home from "./pages/Home";
import Register from "./components/Register";
import Reset from "./components/Reset";
import Dashboard from "./components/Dashboard";
import PvP from "./chess/PvP";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/home" exact element={<Home />} />
          <Route path="/reset" exact element={<Reset />} />
          <Route path="/dashboard" exact element={<Dashboard />} />
          <Route path="/game/:gameid" exact>
            
          </Route>
          <Route path="/pvp" exact element={<PvP />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

