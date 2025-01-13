import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials");
    }
  };

  const handleRegister = () => {
    navigate("/register");
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
        <h2 className="mb-4 text-white">Login</h2>
        <form onSubmit={handleSubmit}>
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
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        {message && <p className="text-danger mt-3">{message}</p>}
        <hr className="my-4 text-white" />
        <button className="btn btn-secondary w-100" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
