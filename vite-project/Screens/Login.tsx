import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMockState } from "../src/mockState";

export const Login: React.FC = () => {
  const { login } = useMockState();
  const navigate = useNavigate();

  type LoginData = {
    email: string;
    password: string;
  };

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const HandleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { email, password } = loginData;
    try {
      if (!email || !password) {
        toast.error("Please fill in all fields!");
        return;
      }
      const success = await login(email, password);
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

        <h2 className="text-3xl font-black text-center mt-5 text-gray-800 tracking-tight">
          Welcome Back <WavingHandRoundedIcon className="text-yellow-400 animate-bounce" />
        </h2>

        <p className="text-center text-gray-500 mt-2 font-medium">
          Sign in to your NeighbourHub account
        </p>

        <form onSubmit={HandleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. res@neighbourhub.com"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-gray-700 font-semibold mb-1 text-sm">Password</label>
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-750 hover:to-blue-750 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-indigo-500/20 mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 font-bold cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

