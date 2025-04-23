import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Portfolio.css";

const Portfolio = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    projects: [{ name: "", description: "" }],
    contacts: [{ platform: "email", displayContact: "" }],
    cv: null,
  });
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode === "edit") {
      const fetchPortfolio = async () => {
        try {
          const endpoint =
            process.env.REACT_APP_BASE_URL + `portfolio/${userData.userName}`;
          const res = await axios.get(endpoint, {
            headers: {
              Authorization: "Bearer " + userData.token,
            },
          });
          const { projects, contacts, cv } = res.data.portfolioExist;
          setFormData({
            projects: projects,
            contacts: contacts,
          });
        } catch (err) {
        } finally {
          setLoading(false);
        }
      };

      fetchPortfolio();
    }
  }, [mode]);

  const handleChange = (group, index, e) => {
    const { name, value } = e.target;
    const updated = [...formData[group]];
    updated[index][name] = value;
    setFormData({ ...formData, [group]: updated });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
  };

  const addItem = (group, defaultItem) =>
    setFormData({ ...formData, [group]: [...formData[group], defaultItem] });

  const removeItem = (group, index) => {
    const updated = [...formData[group]];
    updated.splice(index, 1);
    setFormData({ ...formData, [group]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const portfolioEndPoint =
        process.env.REACT_APP_BASE_URL + `portfolio/${userData.userId}`;

      if (mode === "create") {
        const submitData = new FormData();
        submitData.append("cv", formData.cv);
        submitData.append("projects", JSON.stringify(formData.projects));
        submitData.append("contacts", JSON.stringify(formData.contacts));

        await axios.post(portfolioEndPoint, formData, {
          headers: {
            Authorization: "Bearer " + userData.token,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.put(portfolioEndPoint, formData, {
          headers: { Authorization: "Bearer " + userData.token },
        });
      }

      navigate("/home");
    } catch (err) {}
  };

  if (loading)
    return <div className="create-portfolio-container">Loading...</div>;

  return (
    <div className="create-portfolio-container">
      <h1>
        {mode === "create" ? "Create Your Portfolio" : "Edit Your Portfolio"}
      </h1>

      <form onSubmit={handleSubmit} className="portfolio-form">
        <div className="form-section">
          <h2>Projects</h2>
          {formData.projects.map((project, index) => (
            <div key={index} className="project-input-group">
              <div className="input-row">
                <label>Project Name:</label>
                <input
                  type="text"
                  name="name"
                  value={project.name}
                  onChange={(e) => handleChange("projects", index, e)}
                  required
                />
              </div>
              <div className="input-row">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={project.description}
                  onChange={(e) => handleChange("projects", index, e)}
                  required
                />
              </div>
              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem("projects", index)}
                  className="remove-btn"
                >
                  Remove Project
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("projects", { name: "", description: "" })}
            className="add-btn"
          >
            + Add Another Project
          </button>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          {formData.contacts.map((contact, index) => (
            <div key={index} className="contact-input-group">
              <div className="input-row">
                <label>Platform:</label>
                <select
                  name="platform"
                  value={contact.platform}
                  onChange={(e) => handleChange("contacts", index, e)}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-row">
                <label>Contact Info:</label>
                <input
                  type="text"
                  name="displayContact"
                  value={contact.displayContact}
                  onChange={(e) => handleChange("contacts", index, e)}
                  required
                />
              </div>
              {formData.contacts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem("contacts", index)}
                  className="remove-btn"
                >
                  Remove Contact
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addItem("contacts", { platform: "email", displayContact: "" })
            }
            className="add-btn"
          >
            + Add Another Contact
          </button>
        </div>

        {mode === "create" && (
          <div className="form-section">
            <h2>Upload CV</h2>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="add-btn">
            {mode === "create" ? "Create Portfolio" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="remove-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Portfolio;
