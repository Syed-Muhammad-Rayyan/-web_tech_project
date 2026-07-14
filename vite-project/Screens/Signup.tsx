import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMockState } from "../src/mockState";

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, zones } = useMockState();

  type UserData = {
    name: string;
    email: string;
    zone: string;
    password: string;
    confirmpass: string;
  };
  const [userdata, setuserData] = useState<UserData>({
    name: "",
    email: "",
    zone: "Zone A (North)",
    password: "",
    confirmpass: "",
  });

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { name, email, zone, password, confirmpass } = userdata;
    try {
      if (!name || !email || !password || !confirmpass) {
        toast.error("Please fill in all fields!");
        return;
      } else if (password.length < 8) {
        toast.error("Password length should be at least 8 characters!");
        return;
      } else if (password !== confirmpass) {
        toast.error("Passwords do not match!");
        return;
      }
      const success = await signup(name, email, zone, password);
      if (success) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-8">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/30">
            NH
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-black text-center mt-4 text-gray-800 tracking-tight">
          Join NeighbourHub <WavingHandRoundedIcon className="text-yellow-500 animate-bounce" />
        </h2>

        <p className="text-center text-gray-500 mt-2 font-medium">
          Create your account and connect with your community.
        </p>

        {/* Form */}
        <form onSubmit={HandleSubmit} className="mt-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              onChange={(e) =>
                setuserData({ ...userdata, name: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. jane@gmail.com"
              onChange={(e) =>
                setuserData({ ...userdata, email: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          {/* Zone Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Residential Zone
            </label>
            <select
              value={userdata.zone}
              onChange={(e) =>
                setuserData({ ...userdata, zone: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-800 bg-white"
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              onChange={(e) =>
                setuserData({ ...userdata, password: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Repeat your password"
              onChange={(e) =>
                setuserData({ ...userdata, confirmpass: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>



          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-750 hover:to-blue-750 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-indigo-500/20 mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-xs font-bold uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 font-bold cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

