import { useState } from "react";
import axios from "axios";
import "./SearchPortfolio.css";

const SearchPortfolio = () => {
  const [username, setUsername] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));

  const handleSearch = async () => {
    try {
      const ipRes = await axios.get("https://api.ipify.org?format=json");
      const userIp = ipRes.data.ip;
      const getPortfolioEndPoint =
        process.env.REACT_APP_BASE_URL + `portfolio/${username}`;
      const response = await axios.get(getPortfolioEndPoint, {
        headers: {
          Authorization: "Bearer " + userData.token,
          "X-Client-userP": userIp,
        },
      });
      setPortfolio(response.data);
      setError(null);
    } catch (err) {
      setPortfolio(null);
      setError("Portfolio not found");
    }
  };
  const handleCVAction = (action = "view") => {
    if (!portfolio.portfolioExist?.cv) return;

    window.open(portfolio.portfolioExist.cv, "_blank");
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

      <div className="main-container">
        <div className="portfolio-header">
          {portfolio ? (
            <div className="profile-info">
              {portfolio.creatorOfPortfolio.coverPicture && (
                <div className="cover-image">
                  {portfolio.creatorOfPortfolio.coverPicture && (
                    <img
                      src={portfolio.creatorOfPortfolio.coverPicture}
                      alt="Cover"
                      className="cover-img"
                    />
                  )}
                </div>
              )}
              <div className="profile-image">
                {portfolio.creatorOfPortfolio.profilePicture && (
                  <img
                    src={portfolio.creatorOfPortfolio.profilePicture}
                    alt="Profile"
                    className="profile-img"
                  />
                )}
              </div>
              <h1>Name: {portfolio.creatorOfPortfolio.fullName}</h1>
              <h2>Job Title: {portfolio.creatorOfPortfolio.title}</h2>
              <h3>Bio: {portfolio.creatorOfPortfolio.bio}</h3>
            </div>
          ) : null}
        </div>
        {portfolio ? (
          <div className="portfolio-card">
            <div className="portfolio-projects">
              <div className="projects-grid">
                {portfolio.portfolioExist.projects.map((project) => (
                  <div key={project._id} className="project">
                    <h3>Projects</h3>
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
            {portfolio.portfolioExist.cv && (
              <div className="cv-section">
                <h3>CV</h3>
                <div className="cv-actions">
                  <button
                    onClick={() => handleCVAction("view")}
                    className="btn view-cv-btn"
                  >
                    View CV
                  </button>
                </div>
              </div>
            )}

            <div className="portfolio-contacts">
              <h3>Contact</h3>
              <div className="contacts-list">
                {portfolio.portfolioExist.contacts.map((contact) => (
                  <div key={contact._id} className="contact-badge">
                    {contact.platform}: {contact.displayContact}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPortfolio;
