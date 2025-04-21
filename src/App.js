import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import "./App.css";
import Home from "./home/Home";
import CreatePortfolio from "./portfolio/create/CreatePortfolio";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-portfolio" element={<CreatePortfolio />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
