import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  const navigate = useNavigate();

  const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Profile", href: "/profile", current: false },
  ];

  const userNavigation = [
    {
      name: portfolio ? "Edit Portfolio" : "Create Portfolio",
      onClick: () =>
        navigate(portfolio ? "/edit-portfolio" : "/create-portfolio"),
    },
    {
      name: "Sign out",
      onClick: () => {
        localStorage.removeItem("user");
        navigate("/login");
      },
    },
  ];

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const getPortfolioEndPoint =
          process.env.REACT_APP_BASE_URL + `portfolio/${userData.userName}`;

        const response = await axios.get(getPortfolioEndPoint, {
          headers: {
            Authorization: "Bearer " + userData.token,
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
      const userData = JSON.parse(localStorage.getItem("user"));
      const deleteEndpoint =
        process.env.REACT_APP_BASE_URL + `portfolio/${userData.userName}`;

      await axios.delete(deleteEndpoint, {
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      });

      setPortfolio(null);
      alert("Portfolio deleted successfully");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong while deleting portfolio"
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHeader(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="home">
      <div className="header-container">
        <h1 className="header-title">Portfolio</h1>
        <div className="header-buttons">
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
            <button onClick={handleDeletePortfolio} className="btn delete-btn">
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

      <main className="main">
        <div className="main-container">
          {loading ? (
            <div>Loading...</div>
          ) : portfolio ? (
            <div className="portfolio-card">
              <div className="portfolio-header">
                <h1>{portfolio.user.fullName}'s Portfolio</h1>
                <h2>{portfolio.user.title}</h2>
                <h3>{portfolio.user.bio}</h3>
                <p>
                  Views:{" "}
                  {Object.keys(portfolio.portfolioExist.numberOfView).length}
                </p>
              </div>

              <div className="portfolio-projects">
                <h3>Projects</h3>
                <div className="projects-grid">
                  {portfolio.portfolioExist.projects.map((project) => (
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
      </main>
    </div>
  );
};

export default Home;
