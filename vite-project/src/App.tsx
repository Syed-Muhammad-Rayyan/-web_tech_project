import { Route, Routes, useNavigate } from "react-router-dom";
import { About } from '../Screens/About';
import { CategoryDetails } from "../Screens/CategoryDetails";
import { Home } from "../Screens/Home";
import { Login } from "../Screens/Login";
import { MyRequests } from "../Screens/Myrequest";
import { Profile } from "../Screens/Profile";
import { Services } from "../Screens/Services";
import { Signup } from "../Screens/Signup";
import { Noticeboard } from "../Screens/Noticeboard";
import { Messages } from "../Screens/Messages";
import { ModeratorDashboard } from "../Screens/ModeratorDashboard";
import { AdminDashboard } from "../Screens/AdminDashboard";

import { Bounce, ToastContainer } from "react-toastify";
import "./App.css";
import { useMockState } from "./mockState";
import { useState } from "react";


function App() {
  // const { currentUser, login } = useMockState();
  // const navigate = useNavigate();
  // const [isOpen, setIsOpen] = useState(false);

  // const switchRole = (email: string, targetPath: string) => {
  //   login(email, "password123");
  //   navigate(targetPath);
  //   setIsOpen(false);
  // };


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/CategoryDetails/:categoryid"
          element={<CategoryDetails />}
        />
        <Route path="/myrequests" element={<MyRequests />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/services" element={<Services />} />
        <Route path="/aboutus" element={<About/>} />
        <Route path="/noticeboard" element={<Noticeboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/moderator" element={<ModeratorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      
     
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;

