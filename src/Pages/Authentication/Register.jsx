import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import useAxios from "../../Hooks/useAxios";
import SocialLogin from "./SocialLogin";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Eye icons

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // toggle state
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const passwordValue = watch("password", "");

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
    } catch (error) {
      console.error("Image upload failed", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload profile picture",
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setUploading(false);
    }
  };

  // Password strength check
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{6,}$/;
    return regex.test(password);
  };

  const onSubmit = async (data) => {
    if (!profilePic) {
      Swal.fire({
        icon: "warning",
        title: "Profile Picture Required",
        text: "Please upload a profile picture first",
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    if (!validatePassword(data.password)) return;

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

      await axiosInstance.post("/allUsers", userInfo);

      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic,
      });

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Redirecting...",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => navigate(from));
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire({
          icon: "info",
          title: "User Already Exists",
          text: "Redirecting to login page...",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => navigate("/login"));
      } else {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-lg mx-auto shadow-2xl mt-24">
      <div className="card-body">
        <h1 className="text-3xl font-bold text-center mb-4">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset space-y-1">
            {/* Name */}
            <label className="label primary">Your Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input input-bordered w-full"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500">Name is required</p>}

            {/* Profile Picture */}
            <label className="label primary">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
              required
            />

            {/* Email */}
            <label className="label primary">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input input-bordered w-full"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}

            {/* Password */}
            <label className="label primary">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true, minLength: 6 })}
                className="input input-bordered w-full pr-10"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 
                cursor-pointer text-gray-600 text-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">
                Password must be at least 6 characters
              </p>
            )}
            {passwordValue && !validatePassword(passwordValue) && (
              <p className="text-red-500">
                Password must include uppercase, lowercase, number, and special
                character
              </p>
            )}

            {/* Role Selection */}
            <label className="label primary">Select Role</label>
            <select
              {...register("role", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="worker">worker</option>
              <option value="buyer">buyer</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              className="btn bg-[#29d409] hover:bg-[#f8b02f]
               text-white w-full mt-4"
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
