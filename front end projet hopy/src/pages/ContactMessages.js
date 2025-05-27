import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { FiMail, FiUser, FiClock, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/contact-messages.css";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'read', 'unread'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/contact`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setMessages(data?.data || []);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
        setError(err.response?.data?.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate]);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/contact/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, isRead: true } : msg
      ));
      toast.success("Marked as read");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark as read");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${process.env.REACT_APP_SERVER_DOMAIN}/contact/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setMessages(messages.filter(msg => msg._id !== id));
        toast.success("Message deleted");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete");
      }
    }
  };

  const filteredMessages = messages
    .filter(message => {
      const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === "read") return matchesSearch && message.isRead;
      if (filter === "unread") return matchesSearch && !message.isRead;
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="modern-messages-container">
      <div className="messages-header">
        <h1>Contact Messages</h1>
        <div className="controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={filter === "all" ? "active" : ""} 
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button 
              className={filter === "unread" ? "active" : ""} 
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
            <button 
              className={filter === "read" ? "active" : ""} 
              onClick={() => setFilter("read")}
            >
              Read
            </button>
          </div>
        </div>
      </div>

      <div className="messages-grid">
        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            <FiMail size={48} />
            <p>No messages found</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div 
              key={message._id} 
              className={`message-card ${!message.isRead ? "unread" : ""}`}
            >
              <div className="card-header">
                <div className="user-info">
                  <FiUser className="icon" />
                  <h3>{message.name}</h3>
                </div>
                <div className="message-meta">
                  <span className="timestamp">
                    <FiClock className="icon" />
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                  <span className={`status ${message.isRead ? "read" : "unread"}`}>
                    {message.isRead ? "Read" : "Unread"}
                  </span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="email-row">
                  <FiMail className="icon" />
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                </div>
                <p className="message-content">{message.message}</p>
              </div>
              
              <div className="card-actions">
                {!message.isRead ? (
                  <button 
                    onClick={() => handleMarkAsRead(message._id)}
                    className="action-btn mark-read"
                  >
                    <FiEye className="icon" /> Mark Read
                  </button>
                ) : (
                  <button 
                    onClick={() => handleMarkAsRead(message._id)}
                    className="action-btn mark-unread"
                    disabled
                  >
                    <FiEyeOff className="icon" /> Read
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(message._id)}
                  className="action-btn delete"
                >
                  <FiTrash2 className="icon" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactMessages;