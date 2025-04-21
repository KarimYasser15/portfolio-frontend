import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import FieldInput from "../components/FieldInput";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log(process.env);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "User Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.bio.trim()) newErrors.title = "Bio is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const registerEndPoint = process.env.REACT_APP_BASE_URL + "auth/register";
      console.log(registerEndPoint);
      const response = await axios.post(registerEndPoint, {
        fullName: formData.name,
        email: formData.email,
        userName: formData.username,
        bio: formData.bio,
        title: formData.title,
        profilePic: "",
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token);
      console.log("Registered");

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
    <div className="auth-container">
      <h2>Create Account</h2>
      {errors.api && <div className="error-message">{errors.api}</div>}

      <form onSubmit={handleSubmit}>
        <FieldInput
          label="Full Name"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter your full name"
          required
        />
        <FieldInput
          label="User Name"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Enter your User Name"
          required
        />

        <FieldInput
          label="Job Title"
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter your Job Title"
          required
        />

        <FieldInput
          label="Email Address"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          required
        />
        <FieldInput
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          required
        />
        <FieldInput
          label="Bio"
          type="text"
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          error={errors.bio}
          placeholder="Describe your self"
          required
        />

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
};

export default Register;
