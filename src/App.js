import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import "./App.css";
import Home from "./home/Home";
import Portfolio from "./portfolio/Portfolio";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/create-portfolio"
            element={<Portfolio mode="create" />}
          />
          <Route path="/edit-portfolio" element={<Portfolio mode="edit" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
