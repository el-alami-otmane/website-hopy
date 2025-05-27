import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "../helper/apiCall";
import Loading from "../components/Loading";
import Empty from "../components/Empty";
import "../styles/user.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const { userId } = useParams();
  const navigate = useNavigate();

  const getUserAppointments = async () => {
    try {
      dispatch(setLoading(true));
      const [appointmentsData, userData] = await Promise.all([
        fetchData(`/appointment/user/${userId}`),
        fetchData(`/user/getuser/${userId}`),
      ]);
      setAppointments(appointmentsData);
      setUser(userData);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUserAppointments();
  }, [userId]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <button
            className="btn back-btn"
            onClick={() => navigate(-1)}
            style={{ marginBottom: "20px" }}
          >
            Back to Users
          </button>
          <h3 className="home-sub-heading">
            Appointments for {user?.firstname} {user?.lastname}
          </h3>
          {appointments.length > 0 ? (
            <div className="appointment-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr key={appointment._id}>
                      <td>{index + 1}</td>
                      <td>
                        {appointment.doctorId?.firstname}{" "}
                        {appointment.doctorId?.lastname}
                      </td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty message="No appointments found for this user" />
          )}
        </section>
      )}
    </>
  );
};

export default UserAppointments;