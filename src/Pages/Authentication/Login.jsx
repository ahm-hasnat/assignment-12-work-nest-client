import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "./SocialLogin";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useAxios from "../../Hooks/useAxios";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn } = useAuth();
  const axiosInstance = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

   const onSubmit = async (data) => {
    try {
      // 1️⃣ Check if user exists in allUsers collection
      const res = await axiosInstance.get(`/allUsers/${data.email}`);

      const user = res.data;
      console.log(res);
   

      if (!user || user.provider === "google") {
        Swal.fire({
          icon: "info", 
          title: "User Not Registered",
          text: "Please register first",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }
      

      // 2️⃣ Attempt Firebase sign-in
      await signIn(data.email, data.password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting...",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => navigate(from));

    } catch (error) {
      console.error(error);
      // Firebase failed sign-in (wrong password)
      Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: "The password you entered is incorrect",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-md mx-auto shadow-2xl mt-24">
      <div className="card-body">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <label className="label mb-2">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input input-bordered w-full mb-2"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500">Email is required</p>
          )}

          {/* Password */}
          <label className="label mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              className="input input-bordered w-full pr-10"
              placeholder="Password"
            />
            <p className="text-xs text-gray-500 font-light hover:text-blue-500 mt-1
            hover:underline cursor-pointer">Forgot password?</p>
            <span
              className="absolute right-3 top-5 -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500">Password is required</p>
          )}

          <button
            type="submit"
            className="btn bg-[#29d409] hover:bg-[#f8b02f] text-white w-full mt-4"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          <small>
            Don't have an account?{" "}
            <Link className="text-blue-500" to="/auth/register">
              Register
            </Link>
          </small>
        </p>

        {/* Social login buttons */}
        <div className="mt-4">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
