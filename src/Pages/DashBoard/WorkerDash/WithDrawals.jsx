import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Footer from "../../../Components/Footer/Footer";
import { FaCoins, FaDollarSign, FaMoneyBillWave } from "react-icons/fa";

const Withdrawals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const minCoins = 200;
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, reset } = useForm();
  const withdrawCoins = watch("withdrawal_coin", 0);
  const calculatedAmount = (withdrawCoins / 20).toFixed(2);

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ["userCoins", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/allUsers/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const userCoins = userData?.coins || 0;

  // Fetch all withdrawal requests
  const { data: allWithdraws = [] } = useQuery({
    queryKey: ["allWithdraws"],
    queryFn: async () => {
      const res = await axiosSecure.get("/allWithdraws");
      return res.data;
    },
  });

  // Calculate total coins already requested by this user
 const totalRequested = allWithdraws
  .filter(
    (w) => w.worker_email === user?.email && w.status === "pending"
  )
  .reduce((sum, w) => sum + (Number(w.withdrawal_coin) || 0), 0);
  // Available coins for new request
  const availableCoins = Math.max(userCoins - totalRequested, 0);

  const isValid = withdrawCoins >= minCoins && withdrawCoins <= availableCoins;
  const dollarValue = (availableCoins / 20).toFixed(2);

  const remainingCoins = Math.max(availableCoins - withdrawCoins, 0);

  const onSubmit = async (data) => {
    if (!isValid) {
      return Swal.fire("Error", "Invalid coin amount!", "error");
    }

    const withdrawalData = {
      worker_email: userData.email,
      worker_name: userData.name || userData.displayName,
      withdrawal_coin: Number(data.withdrawal_coin),
      withdrawal_amount: Number(calculatedAmount),
      payment_system: data.payment_system,
      account_number: data.account_number,
      withdraw_date: new Date(),
    };

    try {
      const res = await axiosSecure.post("/withdrawals", withdrawalData);
      if (res.data.insertedId) {
        Swal.fire("Success", "Withdrawal request submitted!", "success");
        reset();
        queryClient.invalidateQueries(["allWithdraws"]);
        queryClient.invalidateQueries(["userCoins", user.email]);
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 mb-10 mt-5">
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <FaMoneyBillWave className="text-green-600" />
          Withdraw your Money
        </h2>

        {/* User Balance */}
        <div className="p-4 mb-6 text-center space-y-2">
          <p className="text-lg font-semibold flex items-center justify-center gap-2">
            Total Coins: <FaCoins className="text-yellow-500" /> {userCoins}
          </p>
          <p className="text-lg font-semibold flex items-center justify-center gap-2">
            After withdraw Request: <FaCoins className="text-yellow-500" /> {availableCoins}
          </p>
          <p className="text-lg flex items-center justify-center gap-1">
            Withdrawal amount: <FaDollarSign className="text-blue-500" />
            <span className="font-bold">{dollarValue}</span>
          </p>
        </div>

        {availableCoins < minCoins ? (
          <p className="text-red-500 text-center font-semibold">
            
            Insufficient coin or All coins has been sent for withdrawal request. (Minimum {minCoins} coins required)
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-4 shadow-lg p-5 rounded-2xl">
            <div>
              <label className="block font-medium mb-1">Coins to Withdraw</label>
              <input
                type="number"
                {...register("withdrawal_coin", { required: true })}
                className={`input input-bordered w-full ${!isValid && withdrawCoins > 0 ? "border-red-500" : ""}`}
                placeholder="Enter coin amount"
                max={availableCoins}
                min={minCoins}
              />
              {!isValid && withdrawCoins > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Amount must be between {minCoins} and {availableCoins} coins.
                </p>
              )}
              {isValid && withdrawCoins > 0 && (
                <p className="text-green-500 text-sm mt-1">
                  Remaining Coins after withdrawal: {remainingCoins}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Withdrawal Amount ($)</label>
              <input type="text" value={calculatedAmount} readOnly className="input input-bordered w-full bg-gray-100" />
            </div>

            <div>
              <label className="block font-medium mb-1">Select Payment System</label>
              <select {...register("payment_system", { required: true })} className="select select-bordered w-full">
                <option value="">-- Select Payment System --</option>
                <option value="Bkash">Bkash</option>
                <option value="Rocket">Rocket</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank">Bank</option>
                <option value="Paypal">Paypal</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Account Number</label>
              <input type="text" {...register("account_number", { required: true })} className="input input-bordered w-full" placeholder="Enter account number" />
            </div>

            <div className="flex justify-center">
              <button type="submit" className="btn btn1 w-full mt-3" disabled={!isValid}>
                Withdraw
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Withdrawals;
