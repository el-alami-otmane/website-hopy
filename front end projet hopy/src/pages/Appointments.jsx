import React, { useEffect, useState } from "react";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const { userId } = jwt_decode(localStorage.getItem("token"));

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(
        `/appointment/getallappointments?search=${userId}`
      );
      setAppointments(temp);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const completeAppointment = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: ele?._id,
            doctorId: ele?.doctorId?._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment marked as completed",
          error: "Failed to complete appointment",
          loading: "Updating appointment status...",
        }
      );
      getAllAppoint();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span className="status-badge completed">{status}</span>;
      case "Pending":
        return <span className="status-badge pending">{status}</span>;
      case "Cancelled":
        return <span className="status-badge cancelled">{status}</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="appointments-container">
      <Navbar />
      
      {loading ? (
        <Loading />
      ) : (
        <main className="appointments-main">
          <div className="appointments-header">
            <h1>Your Appointments</h1>
            <p>View and manage your upcoming and past appointments</p>
          </div>

          {appointments.length > 0 ? (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Appointment Date</th>
                    <th>Time</th>
                    <th>Booked On</th>
                    <th>Status</th>
                    {userId === appointments[0].doctorId?._id && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr key={appointment._id}>
                      <td>{index + 1}</td>
                      <td>
                        {appointment?.doctorId?.firstname} {appointment?.doctorId?.lastname}
                      </td>
                      <td>
                        {appointment?.userId?.firstname} {appointment?.userId?.lastname}
                      </td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{appointment.time}</td>
                      <td>{new Date(appointment.createdAt).toLocaleDateString()}</td>
                      <td>{getStatusBadge(appointment.status)}</td>
                      {userId === appointment?.doctorId?._id && (
                        <td>
                          <button
                            className={`complete-btn ${appointment.status === "Completed" ? "disabled" : ""}`}
                            onClick={() => completeAppointment(appointment)}
                            disabled={appointment.status === "Completed"}
                          >
                            {appointment.status === "Completed" ? "Completed" : "Mark Complete"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty message="No appointments found" />
          )}
        </main>
      )}
      
      <Footer />
    </div>
  );
};

export default Appointments;