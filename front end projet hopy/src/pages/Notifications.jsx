import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import "../styles/notifications.css";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/notification/getallnotifs`);
      setNotifications(temp);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllNotif();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notifications-container">
      <Navbar />
      
      {loading ? (
        <Loading />
      ) : (
        <main className="notifications-main">
          <div className="notifications-header">
            <div className="header-icon">
              <FaBell size={28} className="bell-icon" />
              <h1>Notifications</h1>
            </div>
            <p>Your recent updates and alerts</p>
          </div>

          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((notification, index) => (
                <div key={notification._id} className="notification-card">
                  <div className="notification-content">
                    <div className="notification-number">{index + 1}</div>
                    <div className="notification-text">
                      <p className="notification-message">{notification.content}</p>
                      <div className="notification-meta">
                        <span className="notification-date">{formatDate(notification.updatedAt)}</span>
                        <span className="notification-time">{formatTime(notification.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty message="No notifications yet" />
          )}
        </main>
      )}
      
      <Footer />
    </div>
  );
};

export default Notifications;