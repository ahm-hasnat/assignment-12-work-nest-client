import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Footer from "../../../Components/Footer/Footer";
import { FiPlusCircle } from "react-icons/fi";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


const AddTask = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  
  const queryClient = useQueryClient();

  const [taskImage, setTaskImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();


  const { data: dbUser, } = useQuery({
  queryKey: ["buyer", user?.email], 
  queryFn: async () => {
    const res = await axiosSecure.get(`/allUsers/${user.email}`);
    return res.data;
  },
  enabled: !!user?.email,
});


  
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
        formData
      );
      setTaskImage(res.data.data.url);
    } catch (error) {
      // console.error(error);
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  
  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await axiosSecure.post("/allTasks", newTask);
      return res.data;
    },
    onSuccess: async () => {
      
      await queryClient.invalidateQueries(["buyer", user.email]);

      
      queryClient.invalidateQueries(["buyerTasks", user.email]);

      Swal.fire("Success", "Task added successfully", "success");
      reset();
      setTaskImage("");
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Something went wrong!";
      Swal.fire("Error", msg, "error");
    },
  });

  const onSubmit = (data) => {
    if (!taskImage) {
      Swal.fire("Upload Image", "Please upload a task image", "warning");
      return;
    }

    const payload = {
      ...data,
      required_workers: Number(data.required_workers),
      payable_amount: Number(data.payable_amount),
      task_image_url: taskImage,
      added_By: dbUser.name, 
  buyer_email: dbUser.email,
    };

    addTaskMutation.mutate(payload);
  };

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
              <p className="text-red-500 text-sm mt-1">Task title is required</p>
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
              onWheel={(e) => e.currentTarget.blur()}
              min={1}
              placeholder="Total number of workers (e.g. 100)"
              {...register("required_workers", { required: true, valueAsNumber: true })}
              className="input input-bordered w-full"
            />
            {errors.required_workers && (
              <p className="text-red-500 text-sm mt-1">Required workers is required</p>
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
               onWheel={(e) => e.currentTarget.blur()}
              placeholder="Amount to pay each worker (e.g. 10)"
              {...register("payable_amount", { required: true, valueAsNumber: true })}
              className="input input-bordered w-full"
            />
            {errors.payable_amount && (
              <p className="text-red-500 text-sm mt-1">Payable amount is required</p>
            )}
          </div>

          {/* Completion Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Completion Date</span>
            </label>
            <input
              type="date"
              {...register("completion_date", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.completion_date && (
              <p className="text-red-500 text-sm mt-1">Completion date is required</p>
            )}
          </div>

          {/* Submission Info */}
          <div className="form-control">
            <label className="label">
              <span className="label-text primary mb-1">Submission Info</span>
            </label>
            <input
              type="text"
              placeholder="What workers should submit (e.g. screenshot / proof)"
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
