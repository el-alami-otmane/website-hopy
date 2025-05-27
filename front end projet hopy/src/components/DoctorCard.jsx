import "../styles/doctorcard.css";
import React, { useState } from "react";
import BookAppointment from "../components/BookAppointment";
import { toast } from "react-hot-toast";

const DoctorCard = ({ ele }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleModal = () => {
    if (token === "") {
      return toast.error("You must log in first");
    }
    setModalOpen(true);
  };

  return (
    <div className="doctor-card">
      <div className="doctor-image-container">
        <img
          src={
            ele?.userId?.pic ||
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
          }
          alt="profile"
          className="doctor-image"
        />
        <div className="availability-badge">
          <span>Available</span>
        </div>
      </div>
      
      <div className="doctor-details">
        <h3 className="doctor-name">
          Dr. {ele?.userId?.firstname + " " + ele?.userId?.lastname}
        </h3>
        <p className="doctor-specialty">
          {ele?.specialization}
        </p>
        
        <div className="doctor-info">
          <div className="info-item">
            <span className="info-label">Experience:</span>
            <span className="info-value">{ele?.experience} years</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fees:</span>
            <span className="info-value">${ele?.fees}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Contact:</span>
            <span className="info-value">{ele?.userId?.mobile}</span>
          </div>
        </div>
        
        <button
          className="appointment-btn"
          onClick={handleModal}
        >
          Book Appointment
        </button>
      </div>
      
      {modalOpen && (
        <BookAppointment
          setModalOpen={setModalOpen}
          ele={ele}
        />
      )}
    </div>
  );
};

export default DoctorCard;