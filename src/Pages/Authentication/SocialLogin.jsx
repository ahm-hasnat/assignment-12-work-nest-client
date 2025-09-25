import React from "react";
import { useLocation, useNavigate } from "react-router";

import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const SocialLogin = () => {
   const { signInWithGoogle, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const axiosSecure = useAxiosSecure();

  const handleGoogleSignIn = async () => {
    try {
      // 1️⃣ Sign in with Google
      const result = await signInWithGoogle();
      const user = result.user;

      if (!user) throw new Error("Google login failed");

      const payload = {
        name: user.displayName,
        email: user.email,
        provider: "google",
        photoURL: user.photoURL,
        role: "worker",
        coins: 10,
        created_at: new Date().toISOString(),
      };

      // 2️⃣ Check if user exists in allUsers
      let existingUser = null;
      try {
        const res = await axiosSecure.get(`/allUsers/${user.email}`);
        existingUser = res.data;
      } catch (err) {
        // User not found → will create
      }

      if (!existingUser) {
        // New user → POST
        await axiosSecure.post("/allUsers", payload);
       
        console.log("New user created in DB");
      } else {
        // Existing user → PATCH last_log_in only
        await axiosSecure.patch(`/allUsers/${user.email}`, {
          last_log_in: new Date().toISOString(),
        });
       
        console.log("Existing user last_log_in updated");
      }

      // 3️⃣ Navigate after login
      navigate(from);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="text-center">
      <p className="mb-4">OR</p>
      <button
        onClick={handleGoogleSignIn}
        className="w-full btn bg-white text-black border-[#e5e5e5]"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
