import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

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
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const response = await axios.post(loginEndPoint, formData);

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
    <div className="auth-wrapper">
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Login</span>

          {errors.api && <div className="api-error">{errors.api}</div>}

          <div className="form-container">
            <div className="form-group">
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
                <div className="error-message show">{errors.email}</div>
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
                <div className="error-message show">{errors.password}</div>
              )}
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="form-section">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
