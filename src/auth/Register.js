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
    files: [],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        files: [...formData.files, ...files],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!formData.name.trim()) newErrors.name = "Name is required";
  //   if (!formData.username.trim()) newErrors.username = "User Name is required";
  //   if (!formData.email.trim()) newErrors.email = "Email is required";
  //   if (!formData.password) newErrors.password = "Password is required";
  //   else if (formData.password.length < 6) {
  //     newErrors.password = "Password must be at least 6 characters";
  //   }
  //   if (!formData.title.trim()) newErrors.title = "Title is required";
  //   if (!formData.bio.trim()) newErrors.bio = "Bio is required";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("userName", formData.username);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("password", formData.password);

    formData.files.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const registerEndPoint = process.env.REACT_APP_BASE_URL + "auth/register";
      const response = await axios.post(registerEndPoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
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
              className="input"
              required
            />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="User Name"
              className="input"
              required
            />
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="input"
              required
            />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="input"
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="input"
              required
            />
            <input
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="input"
              required
            />
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              onChange={handleChange}
              className="input"
            />
            <input
              type="file"
              id="coverPic"
              name="coverPic"
              onChange={handleChange}
              className="input"
            />
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
