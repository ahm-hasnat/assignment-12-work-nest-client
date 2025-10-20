import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const Payment = () => {
  const { p, n,c, postalCode } = useParams(); 
   const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {user} = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!stripe || !elements) {
      setErrorMsg("Stripe is not loaded yet.");
      return;
    }

    if (!cardComplete) {
      setErrorMsg("Please complete your card information.");
      return;
    }

    setLoading(true);

    try {
      
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: Number(p) * 100, 
      });

      const clientSecret = data.clientSecret;
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not found");

     
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user.displayName, 
            email: user.email, 
            address: {
              postal_code: postalCode || "", 
            },
          },
        },
      });

      if (result.error) {
        setErrorMsg(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        setErrorMsg("");

        
        await axiosSecure.post("/save-payment", {
            paid_by: user.displayName,
          email: user.email,
           packageName: n,
          coins: Number(c),
          price: Number(p),
          
          transactionId: result.paymentIntent.id,
         
        });

         queryClient.invalidateQueries(["payments", user.email]);

        
        await Swal.fire({
          icon: "success",
          title: "Payment Successful 🎉",
          html: `<strong>Transaction ID:</strong> <code>${result.paymentIntent.id}</code>`,
          confirmButtonColor: "#16a34a",
        });

        
        navigate("/dashboard/purchase-coin");
      }
    } catch (err) {
      // console.error("Payment error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
          <FaLock className="text-green-600" /> Secure Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 border border-gray-300 rounded focus-within:border-green-500">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": { color: "#a0aec0" },
                  },
                  invalid: { color: "#fa755a" },
                },
              }}
              onChange={(event) => {
                setCardComplete(event.complete);
                setErrorMsg(event.error ? event.error.message : "");
              }}
            />
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm font-medium text-center">
              {errorMsg}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={!stripe || loading}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : `Pay $${p}`}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Payment;
