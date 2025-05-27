import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, FaBirthdayCake, FaLock } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Profile() {
  const { userId } = jwt_decode(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getuser/${userId}`);
      setFormDetails({
        ...temp,
        password: "",
        confpassword: "",
        mobile: temp.mobile === null ? "" : temp.mobile,
        age: temp.age === null ? "" : temp.age,
      });
      setFile(temp.pic);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const { data } = await axios.post('/user/uploadpic', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        setFile(data.file);
        toast.success("Profile picture updated successfully");
      } catch (error) {
        toast.error("Failed to update profile picture");
      }
    }
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      const {
        firstname,
        lastname,
        email,
        age,
        mobile,
        address,
        gender,
        password,
        confpassword,
      } = formDetails;

      if (!email) {
        return toast.error("Email should not be empty");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters long");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters long");
      } else if (password && password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      } else if (password !== confpassword) {
        return toast.error("Passwords do not match");
      }

      await toast.promise(
        axios.put(
          "/user/updateprofile",
          {
            firstname,
            lastname,
            age,
            mobile,
            address,
            gender,
            email,
            password: password || undefined,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Updating profile...",
          success: "Profile updated successfully",
          error: "Unable to update profile",
        }
      );

      setFormDetails({ ...formDetails, password: "", confpassword: "" });
    } catch (error) {
      console.error(error);
      return toast.error("Unable to update profile");
    }
  };

  return (
    <div className="profile-page-container">
      {loading ? (
        <Loading />
      ) : (
        <div className="profile-content">
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Update your personal information</p>
          </div>

          <div className="profile-card">
            <div className="profile-picture-section">
              <div className="profile-pic-wrapper">
                <img
                  src={file || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                  alt="profile"
                  className="profile-pic"
                />
                <label className="upload-btn">
                  Change Photo
                  <input 
                    type="file" 
                    onChange={handleImageChange} 
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <form onSubmit={formSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FaUser className="input-icon" />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Enter your first name"
                    value={formDetails.firstname}
                    onChange={inputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaUser className="input-icon" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Enter your last name"
                    value={formDetails.lastname}
                    onChange={inputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaEnvelope className="input-icon" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formDetails.email}
                    onChange={inputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaVenusMars className="input-icon" />
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formDetails.gender}
                    onChange={inputChange}
                  >
                    <option value="neither">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <FaBirthdayCake className="input-icon" />
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    value={formDetails.age}
                    onChange={inputChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaPhone className="input-icon" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter your mobile number"
                    value={formDetails.mobile}
                    onChange={inputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>
                    <FaMapMarkerAlt className="input-icon" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    placeholder="Enter your address"
                    value={formDetails.address}
                    onChange={inputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>
                    <FaLock className="input-icon" />
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formDetails.password}
                    onChange={inputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaLock className="input-icon" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confpassword"
                    placeholder="Confirm new password"
                    value={formDetails.confpassword}
                    onChange={inputChange}
                  />
                </div>
              </div>

              <button type="submit" className="update-btn">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;