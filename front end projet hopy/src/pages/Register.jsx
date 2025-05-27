import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/santer-auth.css";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Choose profile image");
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });
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

  const onUpload = async (element) => {
    setLoading(true);
    if (element.type === "image/jpeg" || element.type === "image/png") {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
      fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFile(data.url.toString());
          setFileName(element.name);
          toast.success("Profile image uploaded successfully");
        });
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("Please select an image in JPEG or PNG format");
    }
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();

      if (loading) return;
      if (file === "") {
        return toast.error("Please upload a profile picture");
      }

      const { firstname, lastname, email, password, confpassword } =
        formDetails;
      if (!firstname || !lastname || !email || !password || !confpassword) {
        return toast.error("All fields are required");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters");
      } else if (password !== confpassword) {
        return toast.error("Passwords do not match");
      }

      setLoading(true);
      await toast.promise(
        axios.post("/user/register", {
          firstname,
          lastname,
          email,
          password,
          pic: file,
        }),
        {
          pending: "Creating your account...",
          success: "Account created successfully!",
          error: "Registration failed",
          loading: "Creating your account...",
        }
      );
      setLoading(false);
      return navigate("/login");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="santer-auth-bg">
      <div className="santer-auth-container">
        <h1 className="santer-auth-heading">Join Santer</h1>
        <form onSubmit={formSubmit} className="santer-auth-form">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="santer-auth-input-group" style={{ flex: 1 }}>
              <FaUser className="santer-auth-icon" />
              <input
                type="text"
                name="firstname"
                className="santer-auth-input"
                placeholder="First name"
                value={formDetails.firstname}
                onChange={inputChange}
              />
            </div>
            <div className="santer-auth-input-group" style={{ flex: 1 }}>
              <FaUser className="santer-auth-icon" />
              <input
                type="text"
                name="lastname"
                className="santer-auth-input"
                placeholder="Last name"
                value={formDetails.lastname}
                onChange={inputChange}
              />
            </div>
          </div>
          
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
          
          <input
            type="file"
            onChange={(e) => onUpload(e.target.files[0])}
            id="santer-file-upload"
            className="santer-file-upload"
            accept="image/jpeg, image/png"
          />
          <label htmlFor="santer-file-upload" className="santer-file-label">
            <FaImage style={{ marginRight: '10px', color: '#667eea' }} />
            <span className="santer-file-text">{fileName}</span>
            <span className="santer-file-btn">Browse</span>
          </label>
          
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
          
          <div className="santer-auth-input-group">
            <FaLock className="santer-auth-icon" />
            <input
              type="password"
              name="confpassword"
              className="santer-auth-input"
              placeholder="Confirm password"
              value={formDetails.confpassword}
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
                Creating Account...
              </>
            ) : "Sign Up"}
          </button>
        </form>
        
        <p className="santer-auth-toggle">
          Already have an account?{" "}
          <NavLink to="/login" className="santer-auth-link">
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
