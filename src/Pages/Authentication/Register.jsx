import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import SocialLogin from "./SocialLogin";
import Swal from "sweetalert2";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
   const [uploading, setUploading] = useState(false); 
  
  const [showPassword, setShowPassword] = useState(false);
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

 
  const onSubmit = (data) => {
     if (uploading) return;
    createUser(data.email, data.password)
      .then(async (result) => {
       
        const defaultCoins = data.role === "worker" ? 10 : 50;

       
        const userInfo = {
          name: data.name,
          email: data.email,
          role: data.role || "worker",
          photoURL: profilePic,
          coins: defaultCoins,
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        
        await axiosInstance.post("/allUsers", userInfo);

        
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
             Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Redirecting...",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => navigate(from));
          })
          
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Swal.fire({
            icon: "info",
            title: "User Already Exists",
            text: "Redirecting to login page...",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          })
          .then(() => navigate("/auth/login"))
        }
      });
  };

  // Image Upload
  const handleImageUpload = async (e) => {
   
    const image = e.target.files[0];
   
    if (!image) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMAGE_UPLOAD_KEY
    }`;
    const res = await axios.post(imagUploadUrl, formData);
      
    setProfilePic(res.data.data.url);
    setUploading(false);
  };

  return (
    <div className="card bg-base-100 w-full max-w-lg mx-auto border-1 border-gray-50 shadow mt-20 mb-12">
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
            {errors.name && (
              <p className="text-red-500">Name is required</p>
            )}

            {/* Profile Picture */}
            <label className="label primary">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
              required
            />
           {uploading && (
              <p className="text-blue-500 text-sm mt-1">Uploading...</p>
            )}

            {/* Email */}
            <label className="label primary">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input input-bordered w-full"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500">Email is required</p>
            )}

            {/* Password */}
            <label className="label primary">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  minLength: 6,
                  validate: (value) =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(
                      value
                    ) ||
                    "Password must include uppercase, lowercase, number, and special character",
                })}
                className="input input-bordered w-full pr-10"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
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
            {errors.password?.type === "validate" && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            {/* Role */}
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
              className="btn btn1 w-full mt-4"
             disabled={uploading}>
              Register
            </button>
          </fieldset>

          <p className="mt-4 text-center">
            <small>
              Already have an account?{" "}
              <Link className="text-blue-500 hover:underline" to="/auth/login">
                Login
              </Link>
            </small>
          </p>
        </form>
         <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Register;
