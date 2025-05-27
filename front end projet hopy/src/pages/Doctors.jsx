import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/doctors.css";
import fetchData from "../helper/apiCall";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import Empty from "../components/Empty";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchAllDocs = async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchData(
        selectedSpecialization === "all"
          ? "/doctor/getalldoctors"
          : `/doctor/specialization/${selectedSpecialization}`
      );
      const availableDoctors = data.filter(doctor => doctor.isAvailable);
      setDoctors(availableDoctors);
    } catch (error) {
      console.error(error);
    }
    dispatch(setLoading(false));
  };

  const fetchSpecializations = async () => {
    try {
      const data = await fetchData("/doctor/specializations");
      setSpecializations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  useEffect(() => {
    fetchAllDocs();
  }, [selectedSpecialization]);

  return (
    <div className="doctors-container">
      <Navbar />
      {loading && <Loading />}
      {!loading && (
        <main className="doctors-main">
          <section className="doctors-section">
            <div className="section-header">
              <h1 className="section-title">Meet Our Specialists</h1>
              <p className="section-subtitle">Book an appointment with Morocco's finest medical professionals</p>
              
              <div className="filter-controls">
                <div className="specialization-filter">
                  <label htmlFor="specialization">Filter by Specialty:</label>
                  <select
                    id="specialization"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="specialization-select"
                  >
                    <option value="all">All Specialties</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {doctors.length > 0 ? (
              <div className="doctors-grid">
                {doctors.map((ele) => (
                  <DoctorCard ele={ele} key={ele._id} />
                ))}
              </div>
            ) : (
              <Empty message={`No available ${selectedSpecialization === "all" ? "" : selectedSpecialization + " "}doctors at the moment`} />
            )}
          </section>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default Doctors;