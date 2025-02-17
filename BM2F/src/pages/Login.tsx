import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useSubmissions } from "../context/SubmissionContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setSubmissions } = useSubmissions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/token/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Fetch submissions after successful login
      const submissionsResponse = await axiosInstance.get(
        "/api/readers/assigned_submissions/"
      );
      setSubmissions(submissionsResponse.data);

      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
