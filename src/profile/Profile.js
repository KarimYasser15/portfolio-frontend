import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    userName: "",
    title: "",
    bio: "",
    profilePic: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const getProfileEndPoint =
          process.env.REACT_APP_BASE_URL + `profile/${userData.userId}`;
        const res = await axios.get(getProfileEndPoint, {
          headers: {
            Authorization: "Bearer " + userData.token,
          },
        });

        const {
          email,
          fullName,
          password,
          userName,
          title,
          bio,
          profilePic,
          coverPic,
        } = res.data;

        setFormData({
          email: email || "",
          password: password,
          fullName: fullName || "",
          userName: userName || "",
          title: title || "",
          bio: bio || "",
          profilePic: profilePic || "",
          coverPic: coverPic || "",
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateProfileEndPoint =
        process.env.REACT_APP_BASE_URL + `profile/${userData.userId}`;

      await axios.put(updateProfileEndPoint, formData, {
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      });

      navigate("/home");
    } catch (err) {}
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>

      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Username:
          <input
            type="text"
            name="userName"
            value={formData.userName}
            required
            readOnly
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            readOnly
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>

        <label>
          Bio:
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </label>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
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

export default Profile;
