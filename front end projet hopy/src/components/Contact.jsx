import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../styles/contact.css";

const Contact = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const { data } = await axios.post(
      // Remove the duplicate /api
      `${process.env.REACT_APP_SERVER_DOMAIN}/contact`,
      formDetails
    );
    
    if (data.success) {
      toast.success("Message sent successfully!");
      setFormDetails({
        name: "",
        email: "",
        message: "",
      });
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send message");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <section className="register-section flex-center" id="contact">
      <div className="contact-container flex-center contact">
        <h2 className="form-heading">Contact Us</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            value={formDetails.name}
            onChange={inputChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
            required
          />
          <textarea
            name="message"
            className="form-input"
            placeholder="Enter your message"
            value={formDetails.message}
            onChange={inputChange}
            rows="8"
            cols="12"
            required
          ></textarea>

          <button
            type="submit"
            className="btn form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;