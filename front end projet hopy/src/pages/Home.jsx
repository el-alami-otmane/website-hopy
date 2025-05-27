import React from "react";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Quality Healthcare Made Simple</h1>
            <p>Book appointments with Morocco's top specialists in minutes</p>
            <div className="hero-buttons">
              <a href="/doctors" className="primary-btn">Find a Doctor</a>
              <a href="/appointments" className="secondary-btn">Book Appointment</a>
            </div>
          </div>
         <div className="hero-image-container">
            <svg className="medical-illustration" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
              {/* Doctor silhouette */}
              <path d="M150,200 Q200,150 250,200 Q300,250 350,200" fill="none" stroke="#4a90e2" strokeWidth="8"/>
              <circle cx="250" cy="120" r="30" fill="#4a90e2"/>
              <path d="M250,150 L250,220 M230,180 L270,180" stroke="#fff" strokeWidth="4"/>
              
              {/* Medical cross */}
              <rect x="380" y="150" width="40" height="120" fill="#e74c3c" rx="5"/>
              <rect x="350" y="180" width="100" height="40" fill="#e74c3c" rx="5"/>
              
              {/* Nurse silhouette */}
              <path d="M100,250 Q150,200 200,250 Q250,300 300,250" fill="none" stroke="#9b59b6" strokeWidth="8"/>
              <circle cx="200" cy="170" r="30" fill="#9b59b6"/>
              <path d="M200,200 L200,270 M180,230 L220,230" stroke="#fff" strokeWidth="4"/>
              
              {/* Heart rate monitor */}
              <rect x="50" y="300" width="300" height="80" fill="#f8f9fa" stroke="#bdc3c7" strokeWidth="2" rx="5"/>
              <path d="M70,340 L90,320 L110,350 L130,310 L150,340 L170,330 L190,360 L210,340 L230,350 L250,330 L270,360 L290,340" 
                    stroke="#e74c3c" strokeWidth="3" fill="none"/>
              
              {/* Medical equipment */}
              <circle cx="400" cy="300" r="30" fill="#2ecc71" stroke="#27ae60" strokeWidth="2"/>
              <path d="M400,270 L400,330 M370,300 L430,300" stroke="#fff" strokeWidth="4"/>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-card">
            <h3>50+</h3>
            <p>Specialized Doctors</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Emergency Services</p>
          </div>
          <div className="stat-card">
            <h3>10,000+</h3>
            <p>Patients Treated</p>
          </div>
          <div className="stat-card">
            <h3>98%</h3>
            <p>Patient Satisfaction</p>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h2 className="section-title">Our Specialized Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">❤️</div>
              <h3>Cardiology</h3>
              <p>Comprehensive heart care from prevention to treatment</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🦴</div>
              <h3>Orthopedics</h3>
              <p>Expert care for bones, joints, and musculoskeletal system</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🧠</div>
              <h3>Neurology</h3>
              <p>Specialized treatment for brain and nervous system disorders</p>
            </div>
            <div className="service-card">
              <div className="service-icon">👶</div>
              <h3>Pediatrics</h3>
              <p>Compassionate care for your little ones</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <h2 className="section-title">What Our Patients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"The doctors here are truly exceptional. My treatment was thorough and compassionate."</p>
              <div className="patient-info">
                <div>
                  <h4>Ahmed Benali</h4>
                  <span>Cardiac Patient</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"Easy appointment booking and minimal wait times. Highly recommended!"</p>
              <div className="patient-info">
                <div>
                  <h4>Fatima Zahra</h4>
                  <span>Pediatric Care</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;