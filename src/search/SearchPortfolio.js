import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchPortfolio.css";

const SearchPortfolio = () => {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const handleSearch = async () => {
    try {
      const getPortfolioEndPoint =
        process.env.REACT_APP_BASE_URL + `portfolio/${username}`;
      const response = await axios.get(getPortfolioEndPoint, {
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError("Portfolio not found");
    }
  };

  return (
    <div className="search-portfolio">
      <h2>Search for a Portfolio</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      />
      <button onClick={handleSearch} className="btn search-btn">
        Search
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="search-result">
          <div className="portfolio-card">
            <h3>{result.user.fullName}</h3>
            <p>Title: {result.user.title}</p>
            <p>Bio: {result.user.bio}</p>
            <h4>Projects:</h4>
            <div className="portfolio-projects">
              <div className="projects-grid">
                {result.portfolioExist.projects.map((project) => (
                  <div key={project._id} className="project">
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="portfolio-contacts">
              <h3>Contact</h3>
              <div className="contacts-list">
                {result.portfolioExist.contacts.map((contact) => (
                  <div key={contact._id} className="contact-badge">
                    {contact.platform}: {contact.displayContact}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPortfolio;
