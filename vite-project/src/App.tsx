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
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Typography } from "@mui/material";

function App() {
  const { currentUser, login } = useMockState();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const switchRole = (email: string, targetPath: string) => {
    login(email, "password123");
    navigate(targetPath);
    setIsOpen(false);
  };


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
      
      {/* Floating Demo Role Switcher Panel */}
      <div className="fixed bottom-6 right-6 z-5500">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-650 to-blue-600 hover:from-indigo-750 hover:to-blue-750 text-white font-bold px-4 py-3 rounded-full shadow-2xl transition duration-300 transform hover:scale-105 border-2 border-white/20"
        >
          <SwapHorizIcon />
          <span>Demo Role Switcher</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-150 p-4 space-y-3 animation-fade-in">
            <Typography variant="subtitle2" fontWeight="bold" className="text-gray-800 text-center border-b border-gray-100 pb-2">
              Switch Test Identity
            </Typography>
            <div className="space-y-1">
              <button
                onClick={() => switchRole("res@neighbourhub.com", "/home")}
                className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition border border-emerald-100/50"
              >
                Jane Doe (Resident)
              </button>
              <button
                onClick={() => switchRole("hassan@neighbourhub.com", "/home")}
                className="w-full text-left px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition border border-amber-100/50"
              >
                Hassan Syed (Provider)
              </button>
              <button
                onClick={() => switchRole("mod@neighbourhub.com", "/moderator")}
                className="w-full text-left px-3 py-2 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-xl transition border border-purple-100/50"
              >
                Clara Vance (Moderator)
              </button>
              <button
                onClick={() => switchRole("admin@neighbourhub.com", "/admin")}
                className="w-full text-left px-3 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-100/50"
              >
                Alex Johnson (Admin)
              </button>
            </div>
            {currentUser && (
              <div className="text-[10px] text-center text-gray-400 font-semibold border-t border-gray-100 pt-2">
                Current: {currentUser.name} ({currentUser.role})
              </div>
            )}
          </div>
        )}
      </div>

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

