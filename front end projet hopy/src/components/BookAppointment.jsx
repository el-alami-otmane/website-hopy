import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.post(
          "/appointment/bookappointment",
          {
            doctorId: ele?.userId?._id,
            date: formDetails.date,
            time: formDetails.time,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment booked successfully!",
          error: "Unable to book appointment",
          loading: "Securing your appointment...",
        }
      );
      setModalOpen(false);
    } catch (error) {
      return error;
    }
  };

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="appointment-modal">
      <div className="modal-overlay" onClick={() => setModalOpen(false)}></div>
      
      <div className="modal-container">
        <div className="modal-header">
          <h2>Book Appointment with Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}</h2>
          <button 
            className="close-button"
            onClick={() => setModalOpen(false)}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="doctor-info-summary">
          <div className="info-item">
            <span className="info-label">Specialization:</span>
            <span className="info-value">{ele?.specialization}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Consultation Fee:</span>
            <span className="info-value">${ele?.fees}</span>
          </div>
        </div>

        <form className="appointment-form" onSubmit={bookAppointment}>
          <div className="form-group">
            <label htmlFor="date">Appointment Date</label>
            <input
              type="date"
              id="date"
              name="date"
              min={today}
              value={formDetails.date}
              onChange={inputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Preferred Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formDetails.time}
              onChange={inputChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Confirm Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;