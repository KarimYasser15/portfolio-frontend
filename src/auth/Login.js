import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import FieldInput from "./FieldInput";

const Login = () => {
  const [formData, setFormData] = useState({
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const loginEndPoint = process.env.REACT_APP_BASE_URL + "auth/login";
      const response = await axios.post(loginEndPoint, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/home");
    } catch (error) {
      setErrors({
        ...errors,
        api: error.response?.data?.message || "Login failed. Please try again.",
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

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Login Account..." : "Login"}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
