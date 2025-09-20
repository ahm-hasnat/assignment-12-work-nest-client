import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import useAxios from "../../Hooks/useAxios";
import SocialLogin from "./SocialLogin";
import useAuth from "../../Hooks/useAuth";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  // Upload image to ImgBB
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_UPLOAD_KEY
      }`;

      const res = await axios.post(imagUploadUrl, formData);
      setProfilePic(res.data.data.url);
      setUploading(false);
    } catch (error) {
      console.error("Image upload failed", error);
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!profilePic) {
      alert("Please upload a profile picture first!");
      return;
    }

    try {
      const result = await createUser(data.email, data.password);

      const userInfo = {
        name: data.name,
        email: data.email,
        role: data.role || "user",
        photoURL: profilePic,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      await axiosInstance.post("/users", userInfo);

      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic,
      });

      console.log("Profile updated successfully");
      navigate(from);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm mx-auto shadow-2xl">
      <div className="card-body">
        <h1 className="text-3xl font-bold text-center mb-4">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset space-y-3">
            {/* Name */}
            <label className="label">Your Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input input-bordered w-full"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500">Name is required</p>}

            {/* Profile Picture */}
            <label className="label">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
            />
            {uploading && <p className="text-blue-500">Uploading...</p>}
            {profilePic && (
              <img
                src={profilePic}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full mt-2 border shadow"
              />
            )}

            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input input-bordered w-full"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}

            {/* Password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input input-bordered w-full"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">
                Password must be at least 6 characters
              </p>
            )}

            {/* Role Selection */}
            <label className="label">Select Role</label>
            <select
              {...register("role", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="worker">Worker</option>
              <option value="buyer">Buyer</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              className="btn bg-[#29d409] hover:bg-[#f8b02f] text-white w-full mt-4"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Register"}
            </button>
          </fieldset>

          <p className="mt-4 text-center">
            <small>
              Already have an account?{" "}
              <Link className="text-blue-500" to="/login">
                Login
              </Link>
            </small>
          </p>
        </form>

        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
