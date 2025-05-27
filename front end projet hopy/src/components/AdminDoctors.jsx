import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]); // Store all doctors for filtering
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllDoctors = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/doctor/getalldoctors`);
      setAllDoctors(temp); // Store all doctors
      setDoctors(temp); // Initially show all doctors
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to fetch doctors");
    }
  };

  const getSpecializations = async () => {
    try {
      const data = await fetchData("/doctor/specializations");
      setSpecializations(data);
    } catch (error) {
      toast.error("Failed to fetch specializations");
    }
  };

  const filterDoctorsBySpecialization = () => {
    if (selectedSpecialization === "all") {
      setDoctors(allDoctors);
    } else {
      const filtered = allDoctors.filter(
        (doctor) => doctor.specialization === selectedSpecialization
      );
      setDoctors(filtered);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/doctor/deletedoctor",
            { userId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Doctor deleted successfully",
            error: "Unable to delete Doctor",
            loading: "Deleting Doctor...",
          }
        );
        getAllDoctors();
        getSpecializations(); // Refresh specializations in case we deleted the last doctor in a category
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const toggleAvailability = async (doctorId, currentStatus) => {
    try {
      const endpoint = currentStatus 
        ? `/doctor/set-unavailable/${doctorId}`
        : `/doctor/set-available/${doctorId}`;

      await toast.promise(
        axios.put(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: `Doctor marked as ${currentStatus ? "unavailable" : "available"}`,
          error: "Failed to update availability",
          loading: "Updating availability...",
        }
      );
      getAllDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getAllDoctors();
    getSpecializations();
  }, []);

  useEffect(() => {
    filterDoctorsBySpecialization();
  }, [selectedSpecialization, allDoctors]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <div className="filter-header">
            <h3 className="home-sub-heading">All Doctors</h3>
            <div className="specialization-filter">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="all">All Specializations</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {doctors.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Experience</th>
                    <th>Specialization</th>
                    <th>Fees</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors?.map((ele, i) => {
                    return (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>
                          <img
                            className="user-table-pic"
                            src={ele?.userId?.pic}
                            alt={ele?.userId?.firstname}
                          />
                        </td>
                        <td>{ele?.userId?.firstname}</td>
                        <td>{ele?.userId?.lastname}</td>
                        <td>{ele?.userId?.email}</td>
                        <td>{ele?.userId?.mobile}</td>
                        <td>{ele?.experience}</td>
                        <td>{ele?.specialization}</td>
                        <td>{ele?.fees}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              ele?.isAvailable ? "available" : "unavailable"
                            }`}
                          >
                            {ele?.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="actions">
                          <button
                            className={`btn ${
                              ele?.isAvailable ? "btn-danger" : "btn-success"
                            }`}
                            onClick={() => toggleAvailability(ele?._id, ele?.isAvailable)}
                          >
                            {ele?.isAvailable ? "Set Unavailable" : "Set Available"}
                          </button>
                          <button
                            className="btn user-btn"
                            onClick={() => deleteUser(ele?.userId?._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty message={`No doctors found${selectedSpecialization !== "all" ? ` for ${selectedSpecialization}` : ""}`} />
          )}
        </section>
      )}
    </>
  );
};

export default AdminDoctors;