import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    username: "",
    bio: "",
    email: "",
    password: "",
    profilePic: null,
    coverPic: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "profilePic") {
        setFormData({ ...formData, profilePic: files[0] });
      } else if (name === "coverPic") {
        setFormData({ ...formData, coverPic: files[0] });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null,
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (!formData.profilePic) {
      newErrors.profilePic = "Profile photo is required";
    } else if (!formData.profilePic.type.match("image.*")) {
      newErrors.profilePic = "Only image files are allowed for profile photo";
    }
    if (!formData.coverPic) {
      newErrors.coverPic = "Profile photo is required";
    } else if (formData.coverPic && !formData.coverPic.type.match("image.*")) {
      newErrors.coverPic = "Only image files are allowed for cover photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("userName", formData.username);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("password", formData.password);

    if (formData.profilePic) {
      formDataToSend.append("files", formData.profilePic);
    }
    if (formData.coverPic) {
      formDataToSend.append("files", formData.coverPic);
    }

    try {
      const registerEndPoint = process.env.REACT_APP_BASE_URL + "auth/register";
      const response = await axios.post(registerEndPoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/login");
    } catch (error) {
      setErrors({
        ...errors,
        api:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Register</span>

          {errors.api && <div className="error-message">{errors.api}</div>}

          <div className="form-container">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`input ${errors.name ? "error" : ""}`}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}

            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="User Name"
              className={`input ${errors.username ? "error" : ""}`}
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}

            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title"
              className={`input ${errors.title ? "error" : ""}`}
            />
            {errors.title && (
              <div className="error-message">{errors.title}</div>
            )}

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`input ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`input ${errors.password ? "error" : ""}`}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}

            <input
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
              className={`input ${errors.bio ? "error" : ""}`}
            />
            {errors.bio && <div className="error-message">{errors.bio}</div>}

            <div className="file-input-group">
              <label>Profile Photo</label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                onChange={handleChange}
                className={`input ${errors.profilePic ? "error" : ""}`}
                accept="image/*"
              />
              {errors.profilePic && (
                <div className="error-message">{errors.profilePic}</div>
              )}
            </div>

            <div className="file-input-group">
              <label>Cover Photo</label>
              <input
                type="file"
                id="coverPic"
                name="coverPic"
                onChange={handleChange}
                className={`input ${errors.coverPic ? "error" : ""}`}
                accept="image/*"
              />
              {errors.coverPic && (
                <div className="error-message">{errors.coverPic}</div>
              )}
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register"}
          </button>

          <div className="form-section">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
