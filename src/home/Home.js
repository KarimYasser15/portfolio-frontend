import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const ipRes = await axios.get(
          `https://corsproxy.io/?${encodeURIComponent(
            "https://api.ipify.org?format=json"
          )}`
        );
        const userIp = ipRes.data.ip;
        const getPortfolioEndPoint =
          process.env.REACT_APP_BASE_URL + `portfolio/${userData.userName}`;
        const response = await axios.get(getPortfolioEndPoint, {
          headers: {
            Authorization: "Bearer " + userData.token,
            "X-Client-userP": userIp,
          },
        });
        setPortfolio(response.data?.portfolioExist ? response.data : null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch portfolio");
        setPortfolio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleDeletePortfolio = async () => {
    if (!window.confirm("Are you sure you want to delete your portfolio?"))
      return;

    try {
      const deleteEndpoint =
        process.env.REACT_APP_BASE_URL + `portfolio/${userData.userId}`;
      await axios.delete(deleteEndpoint, {
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      });

      setPortfolio(null);
      alert("Portfolio deleted successfully");
    } catch (err) {}
  };
  const handleCVAction = (action = "view") => {
    if (!portfolio?.portfolioExist?.cv) return;

    window.open(portfolio.portfolioExist.cv, "_blank");
  };

  return (
    <div className="home">
      <div className="header-container">
        <h1 className="header-title">Portfolio</h1>
        <div className="header-buttons">
          <button
            onClick={() => navigate("/search-portfolio")}
            className="btn search-btn"
          >
            Search Portfolio
          </button>
          <Link to="/profile" className="btn profile-btn">
            Profile
          </Link>
          <button
            onClick={() =>
              navigate(portfolio ? "/edit-portfolio" : "/create-portfolio")
            }
            className="btn edit-btn"
          >
            {portfolio ? "Edit Portfolio" : "Create Portfolio"}
          </button>
          {portfolio && (
            <button onClick={handleDeletePortfolio} className="btn logout-btn">
              Delete Portfolio
            </button>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="btn logout-btn"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="main-container">
        <div className="portfolio-header">
          <div className="profile-info">
            {userData.coverPicture && (
              <div className="cover-image">
                {userData.coverPicture && (
                  <img
                    src={userData.coverPicture}
                    alt="Cover"
                    className="cover-img"
                  />
                )}
              </div>
            )}
            <div className="profile-image">
              {userData.profilePicture && (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="profile-img"
                />
              )}
            </div>
            <h1>Name: {userData.fullName}</h1>
            <h2>Job Title: {userData.title}</h2>
            <h3>Bio: {userData.bio}</h3>
          </div>
        </div>
        {portfolio ? (
          <div className="portfolio-card">
            <h4>
              Number Of Views:{" "}
              {
                new Map(
                  Object.entries(portfolio?.portfolioExist?.numberOfView || {})
                ).size
              }
            </h4>
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
        ) : (
          <div className="empty-state">
            <h3>No portfolio found</h3>
            <p>Get started by creating your portfolio</p>
            <button
              onClick={() => navigate("/create-portfolio")}
              className="btn create-btn"
            >
              Create Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
