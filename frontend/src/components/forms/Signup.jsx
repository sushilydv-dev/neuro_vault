import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { BackgroundCircles } from "../design/Hero";
import { toast } from "react-toastify";
import { API_BASE } from "../../utils/api";
import { validateEmail, validatePassword, validateName } from "./Valtidation";

export default function Register() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [agree, setAgree] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setAgree(checked);
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (
      !validateName(formData.first_name) ||
      !validateName(formData.last_name)
    ) {
      toast.error("Please enter valid names (letters only)");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Password must be 8+ chars, with uppercase and a number");
      return;
    }

    if (!agree) {
      toast.warning("You must agree with the terms");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.first_name} ${formData.last_name}`.trim(),
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.msg || "Signup failed");
        return;
      }

      if (data.token) setToken(data.token);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="relative top-[10rem] z-[-3]">
          <BackgroundCircles />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="first_name"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10"
          />
          <input
            name="last_name"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10"
          />

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={agree}
              onChange={handleChange}
              className="w-4 h-4 accent-white"
            />
            <span>I agree to the Terms & Conditions</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
