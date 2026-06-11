import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setAuth } from "../services/api";

function LoginAnalyticsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      setAuth(data.access_token, data.username);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate("/create-account");
  };

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleLoginClick}
        style={{
          backgroundColor: "white",
          padding: "50px 40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            color: "black",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Log In
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid lightgray",
            backgroundColor: "#fafafa",
            fontSize: "14px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid lightgray",
            backgroundColor: "#fafafa",
            fontSize: "14px",
          }}
        />

        {error && (
          <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "black",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div
          style={{
            fontSize: "13px",
            color: "black",
            textAlign: "center",
          }}
        >
          Don&apos;t have an account?{" "}
          <span
            onClick={handleSignUpClick}
            style={{
              color: "#1e40af",
              textDecoration: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
}

export default LoginAnalyticsPage;
