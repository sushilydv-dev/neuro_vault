import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { BackgroundCircles } from "../design/Hero";
import { toast } from "react-toastify";
import { API_BASE } from "../../utils/api";
import { validateEmail } from "./Valtidation"

export default function Login() {
  const navigate = useNavigate();
  const { setToken, status } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      exampleInputEmail1: "email",
      exampleInputpass1: "password",
    };
    if (fieldMap[id]) {
      setFormData({ ...formData, [fieldMap[id]]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || data.message || "Login failed");
        return;
      }

      setToken(data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/workspace", { replace: true });
    }
  }, [navigate, status]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="relative top-[10rem] z-[-3]">
          <BackgroundCircles />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          Hello! let's get started
        </h2>
        <p className="text-sm text-gray-400 mb-6">Sign in to continue.</p>

        <form className="space-y-4 pt-3" onSubmit={handleSubmit}>
          <input
            type="email"
            id="exampleInputEmail1"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password" // Changed from 'pass' to 'password'
            id="exampleInputpass1"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            SIGN IN
          </button>
          <p className="text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white underline">
              Create
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
