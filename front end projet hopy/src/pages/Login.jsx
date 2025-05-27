import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/santer-auth.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";
import { FaEnvelope, FaLock } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Login() {
  const dispatch = useDispatch();
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Create floating particles
    const particles = document.querySelector('.santer-auth-bg');
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.classList.add('santer-particle');
      
      // Random properties
      const size = Math.random() * 10 + 5;
      const posX = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.4 + 0.2;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = opacity;
      
      particles.appendChild(particle);
    }
    
    return () => {
      document.querySelectorAll('.santer-particle').forEach(el => el.remove());
    };
  }, []);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { email, password } = formDetails;
      if (!email || !password) {
        setLoading(false);
        return toast.error("Please fill in all fields");
      } else if (password.length < 5) {
        setLoading(false);
        return toast.error("Password must be at least 5 characters");
      }

      const { data } = await toast.promise(
        axios.post("/user/login", {
          email,
          password,
        }),
        {
          pending: "Authenticating...",
          success: "Welcome back!",
          error: "Invalid credentials",
          loading: "Authenticating...",
        }
      );
      localStorage.setItem("token", data.token);
      dispatch(setUserInfo(jwt_decode(data.token).userId));
      getUser(jwt_decode(data.token).userId);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  const getUser = async (id) => {
    try {
      const temp = await fetchData(`/user/getuser/${id}`);
      dispatch(setUserInfo(temp));
      return navigate("/");
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="santer-auth-bg">
      <div className="santer-auth-container">
        <h1 className="santer-auth-heading">Welcome Back</h1>
        <form onSubmit={formSubmit} className="santer-auth-form">
          <div className="santer-auth-input-group">
            <FaEnvelope className="santer-auth-icon" />
            <input
              type="email"
              name="email"
              className="santer-auth-input"
              placeholder="Email address"
              value={formDetails.email}
              onChange={inputChange}
            />
          </div>
          
          <div className="santer-auth-input-group">
            <FaLock className="santer-auth-icon" />
            <input
              type="password"
              name="password"
              className="santer-auth-input"
              placeholder="Password"
              value={formDetails.password}
              onChange={inputChange}
            />
          </div>
          
          <button
            type="submit"
            className="santer-auth-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="santer-loading"></span>
                Signing In...
              </>
            ) : "Sign In"}
          </button>
        </form>
        
        <p className="santer-auth-toggle">
          New to Santer?{" "}
          <NavLink to="/register" className="santer-auth-link">
            Create Account
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
