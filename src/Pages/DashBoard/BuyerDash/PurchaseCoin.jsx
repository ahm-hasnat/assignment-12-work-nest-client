import React from "react";
import { FaCoins, FaWallet } from "react-icons/fa";
import Footer from "../../../Components/Footer/Footer";
import { useNavigate } from "react-router";

const coinPackages = [
  {
    name: "Basic",
    coins: 10,
    price: 1,
    features: [
      "Instant coin delivery",
      "Secure payment gateway",
      "Line-through Access to premium tasks",
      "Line-through Priority support",
      "Line-through Daily bonus",
    ],
  },
  {
    name: "Regular",
    coins: 150,
    price: 10,
    features: [
      "Instant coin delivery",
      "Secure payment gateway",
      "Priority support",
      "Line-through Access to premium tasks",
      "Line-through Daily bonus",
    ],
  },
  {
    name: "Pro",
    coins: 500,
    price: 20,
    popular: true,
    features: [
      "Instant coin delivery",
      "Secure payment gateway",
      "Priority support",
      "Access to premium tasks",
      "Line-through Daily bonus",
    ],
  },
  {
    name: "Premium",
    coins: 1000,
    price: 35,
    features: [
      "Instant coin delivery",
      "Secure payment gateway",
      "Priority support",
      "Access to premium tasks",
      "Daily bonus",
    ],
  },
];


const PurchaseCoin = () => {
     const navigate = useNavigate();

     const handlePay = (p,n,c) => {
   

    console.log(p,n,c);
    navigate(`/dashboard/payment/${p}/${n}/${c}`)
}

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 mb-10 px-4 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <FaWallet className="text-green-500 text-4xl" />
          Purchase Coins
        </h1>
        <p className="text-gray-600 mb-10 text-center max-w-xl">
          Choose a coin package to top up your account and unlock more tasks!
        </p>

        {/* Center the cards */}
        <div className="grid gap-12 place-items-center sm:grid-cols-1 
        md:grid-cols-2  max-w-fit">
          {coinPackages.map((pkg, idx) => (
            <div
              key={idx}
              className="card w-xs shadow-md rounded-xl border border-gray-200 transition-transform transform hover:scale-105 duration-300"
            >
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {pkg.name}
                    {pkg.popular && (
                      <span className="ml-2 font-semibold text-xs px-2 py-1 badge badge-soft badge-warning rounded-full">
                        Most Popular
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <FaCoins />{" "}
                    <span className="text-xl font-semibold">{pkg.coins}</span>
                  </div>
                </div>

                <span className="text-xl font-semibold mt-2">${pkg.price}</span>

                <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
                  {pkg.features.map((feat, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 ${
                        feat.includes("Line-through")
                          ? "line-through opacity-50"
                          : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 flex-shrink-0 ${
                          feat.includes("Line-through")
                            ? "text-gray-400"
                            : "text-green-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feat.replace("Line-through ", "")}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <button onClick={()=>handlePay(pkg.price,pkg.name,pkg.coins)} className="btn btn1 btn-block">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PurchaseCoin;
