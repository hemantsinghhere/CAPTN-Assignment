import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage(res.data.message || "Registration successful!");

      if (res.status === 201) {
        navigate("/profile"); // Redirect to the profile page
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const goToLogin = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "#000",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        className="card p-4 text-center"
        style={{
          backgroundColor: "#222",
          borderRadius: "10px",
          width: "400px",
        }}
      >
        <h2 className="mb-4 text-white">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password (min. 8 characters)"
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Register
          </button>
        </form>
        {message && (
          <p className={`mt-3 ${message.includes("successful") ? "text-success" : "text-danger"}`}>
            {message}
          </p>
        )}
        <button onClick={goToLogin} className="btn btn-secondary mt-3 w-100">
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
