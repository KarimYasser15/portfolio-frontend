import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreatePortfolio.css";

const CreatePortfolio = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    projects: [{ name: "", description: "" }],
    contacts: [{ platform: "email", displayContact: "" }],
    cv: "",
  });

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const projects = [...formData.projects];
    projects[index][name] = value;
    setFormData({ ...formData, projects });
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const contacts = [...formData.contacts];
    contacts[index][name] = value;
    setFormData({ ...formData, contacts });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: "", description: "" }],
    });
  };

  const removeProject = (index) => {
    const projects = [...formData.projects];
    projects.splice(index, 1);
    setFormData({ ...formData, projects });
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [
        ...formData.contacts,
        { platform: "email", displayContact: "" },
      ],
    });
  };

  const removeContact = (index) => {
    const contacts = [...formData.contacts];
    contacts.splice(index, 1);
    setFormData({ ...formData, contacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createPortfolioEndPoint =
        process.env.REACT_APP_BASE_URL + `portfolio/${userData.userId}/create`;

      await axios.post(createPortfolioEndPoint, formData, {
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      });
      navigate("/home");
    } catch (err) {
      console.error("Error creating portfolio:", err);
      alert(err.response?.data?.message || "Failed to create portfolio");
    }
  };

  return (
    <div className="create-portfolio-container">
      <h1>Create Your Portfolio</h1>

      <form onSubmit={handleSubmit} className="portfolio-form">
        <div className="form-section">
          <h2>Projects</h2>
          {formData.projects.map((project, index) => (
            <div key={index} className="project-input-group">
              <div className="input-row">
                <label>
                  Project Name:
                  <input
                    type="text"
                    name="name"
                    value={project.name}
                    onChange={(e) => handleProjectChange(index, e)}
                    required
                  />
                </label>
              </div>
              <div className="input-row">
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, e)}
                    required
                  />
                </label>
              </div>
              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="remove-btn"
                >
                  Remove Project
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addProject} className="add-btn">
            + Add Another Project
          </button>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          {formData.contacts.map((contact, index) => (
            <div key={index} className="contact-input-group">
              <div className="input-row">
                <label>
                  Platform:
                  <select
                    name="platform"
                    value={contact.platform}
                    onChange={(e) => handleContactChange(index, e)}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="linkedin">Linkedin</option>
                    <option value="github">Github</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
              <div className="input-row">
                <label>
                  Contact Info:
                  <input
                    type="text"
                    name="displayContact"
                    value={contact.displayContact}
                    onChange={(e) => handleContactChange(index, e)}
                    required
                  />
                </label>
              </div>
              {formData.contacts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="remove-btn"
                >
                  Remove Contact
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addContact} className="add-btn">
            + Add Another Contact
          </button>
        </div>

        <div className="form-section">
          <h2>CV/Resume</h2>
          <div className="input-row">
            <label>
              CV URL (optional):
              <input
                type="url"
                name="cv"
                value={formData.cv}
                onChange={(e) =>
                  setFormData({ ...formData, cv: e.target.value })
                }
                placeholder="https://example.com/my-cv.pdf"
              />
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="add-btn">
            Create Portfolio
          </button>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePortfolio;
