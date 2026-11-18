
"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast } from "@base-ui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();

const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const [formData, setFormData]= useState({
  name: "",
  email:'',
  password:'',
  confirmPassword:"",
  image:"",
})
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


 const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }

  if (formData.password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  if (!formData.name.trim() || !formData.email.trim()) {
    toast.error("Name and email are required");
    return;
  }

  try {
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      image: formData.image || undefined,
    });
    console.log(formData, "from sign up")

    if (error) {
      toast.error(error.message || "Signup failed");
      return;
    }

    toast.success("Account created successfully!");

    router.push("/");
    router.refresh();

  } catch (error) {
    console.error("Signup error:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
         onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
                autoComplete="uesrname"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

           <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3 text-blue-600"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>


          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              required
            />
            I agree to the Terms and Conditions
          </label>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-7">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
