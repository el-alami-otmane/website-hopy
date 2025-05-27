import React, { useState } from "react";
import "../styles/applydoctor.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaUserMd, FaBriefcase, FaDollarSign } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    fees: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const btnClick = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await toast.promise(
        axios.post(
          "/doctor/applyfordoctor",
          {
            formDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Application submitted successfully!",
          error: "Unable to submit application",
          loading: "Submitting your application...",
        }
      );
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="apply-doctor-container">
      <Navbar />
      
      <main className="apply-doctor-main">
        <section className="apply-doctor-hero">
          <div className="hero-content">
            <h1>Join Our Medical Team</h1>
            <p>Become part of Morocco's leading healthcare network</p>
          </div>
        </section>

        <section className="application-section">
          <div className="application-container">
            <div className="application-header">
              <h2>Doctor Application Form</h2>
              <p>Please fill in your professional details</p>
            </div>

            <form className="application-form">
              <div className="form-group">
                <label htmlFor="specialization">
                  <FaUserMd className="input-icon" />
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  placeholder="Cardiology, Neurology, etc."
                  value={formDetails.specialization}
                  onChange={inputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience">
                  <FaBriefcase className="input-icon" />
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  placeholder="Enter years of practice"
                  value={formDetails.experience}
                  onChange={inputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fees">
                  <FaDollarSign className="input-icon" />
                  Consultation Fees (USD)
                </label>
                <input
                  type="number"
                  id="fees"
                  name="fees"
                  min="0"
                  placeholder="Standard consultation fee"
                  value={formDetails.fees}
                  onChange={inputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-application"
                onClick={btnClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit Application"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ApplyDoctor;