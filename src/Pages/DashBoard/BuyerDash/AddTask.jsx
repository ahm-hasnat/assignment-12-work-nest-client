import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Footer from "../../../Components/Footer/Footer";
import { FiPlusCircle } from "react-icons/fi";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";

const AddTask = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [taskImage, setTaskImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch buyer data
  const { data: buyerData, isLoading: buyerLoading } = useQuery({
    queryKey: ["buyer", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/allUsers/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch buyer tasks
  const { data: buyerTasks = [] } = useQuery({
    queryKey: ["buyerTasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/allTasks");
      return res.data.filter((task) => task.addedBy === user.email);
    },
    enabled: !!user?.email,
  });

  // Image upload handler
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_UPLOAD_KEY
        }`,
        formData
      );
      setTaskImage(res.data.data.url);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // Mutation to add task
  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await axiosSecure.post("/allTasks", newTask);
      return res.data;
    },
    onSuccess: async (_, variables) => {
      // Use latest cached data
      const currentBuyerData = queryClient.getQueryData([
        "buyer",
        user.email,
      ]) || { coins: 0 };

      const newCoins = Math.round(
        currentBuyerData.coins - variables.totalPayable
      );

      // Update DB
      await axiosSecure.put(`/allUsers/upsert/${user.email}`, {
        coins: newCoins,
      });

      // Optimistic UI update
      queryClient.setQueryData(["buyer", user.email], (old) => {
        console.log("Old cached data:", old);
        if (!old) return { coins: newCoins, email: user.email };
        return { ...old, coins: newCoins };
      });

      // Refetch user and tasks
      await queryClient.invalidateQueries(["buyer", user.email]);
      queryClient.invalidateQueries(["buyerTasks", user.email]);

      Swal.fire("Success", "Task added successfully", "success");

      // Reset form
      reset();
      setTaskImage("");
    },
  });

  const onSubmit = async (data) => {
    if (!taskImage) {
      Swal.fire("Upload Image", "Please upload a task image", "warning");
      return;
    }

    // Calculate new task total
    const newTaskTotal =
      Number(data.required_workers) * Number(data.payable_amount);

    // Calculate total coins used for existing tasks
    const existingTotal = buyerTasks.reduce(
      (sum, task) => sum + Number(task.total_payable_amount),
      0
    );

    const grandTotal = existingTotal + newTaskTotal;

    if (grandTotal > buyerData.coins) {
      Swal.fire({
        title: "Insufficient Coins",
        text: "Not enough coins. Please purchase coins.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Purchase Coins",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/purchase-coin");
        }
      });
      return;
    }

    const payload = {
      ...data, // all form fields from react-hook-form
      required_workers: Number(data.required_workers),
      payable_amount: Number(data.payable_amount),
      totalPayable: newTaskTotal, // for coin deduction in mutation
      task_image_url: taskImage,
      added_By: user.email, // buyer email
    };

    addTaskMutation.mutate(payload);
  };

  if (buyerLoading) return <p>Loading buyer data...</p>;

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow my-5 mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <FiPlusCircle className="text-green-500" size={28} />
          Add New Task
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Task Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Task Title</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Watch my YouTube video and comment"
              {...register("task_title", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.task_title && (
              <p className="text-red-500 text-sm mt-1">
                Task title is required
              </p>
            )}
          </div>

          {/* Task Detail */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Task Detail</span>
            </label>
            <textarea
              placeholder="Add a detailed description for the workers"
              {...register("task_detail")}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Required Workers */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Required Workers</span>
            </label>
            <input
              type="number"
              min={1}
              placeholder="Total number of workers (e.g. 100)"
              {...register("required_workers", {
                required: true,
                valueAsNumber: true,
              })}
              className="input input-bordered w-full"
            />
            {errors.required_workers && (
              <p className="text-red-500 text-sm mt-1">
                Required workers is required
              </p>
            )}
          </div>

          {/* Payable Amount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Payable Amount</span>
            </label>
            <input
              type="number"
              min={1}
              placeholder="Amount to pay each worker (e.g. 10)"
              {...register("payable_amount", {
                required: true,
                valueAsNumber: true,
              })}
              className="input input-bordered w-full"
            />
            {errors.payable_amount && (
              <p className="text-red-500 text-sm mt-1">
                Payable amount is required
              </p>
            )}
          </div>

          {/* Completion Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Completion Date</span>
            </label>
            <input
              placeholder="Select completion date"
              type="date"
              {...register("completion_date", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.completion_date && (
              <p className="text-red-500 text-sm mt-1">
                Completion date is required
              </p>
            )}
          </div>

          {/* Submission Info */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Submission Info</span>
            </label>
            <input
              placeholder="What workers should submit (e.g. screenshot / proof)"
              type="text"
              {...register("submission_info")}
              className="input input-bordered w-full"
            />
          </div>

          {/* Task Image */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Task Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
              disabled={uploading}
            />
            {uploading && (
              <p className="text-gray-500 text-sm mt-1">Uploading image...</p>
            )}
          </div>

          <button
            type="submit"
            className="btn bg-[#29d409] hover:bg-[#f8b02f] text-white w-full"
            disabled={isSubmitting || uploading || addTaskMutation.isLoading}
          >
            {isSubmitting || addTaskMutation.isLoading ? "Adding…" : "Add Task"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddTask;
