import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const UpdateTask = ({ task, isOpen, onClose, queryKey }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      task_title: "",
      task_detail: "",
      required_workers: 1,
    },
  });

  // Populate form with existing task data
  useEffect(() => {
    if (task) {
      reset({
        task_title: task.task_title || "",
        task_detail: task.task_detail || "",
        required_workers: task.required_workers || 1,
      });
    }
  }, [task, reset]);

  // Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedTask) => {
      const res = await axiosSecure.put(`/allTasks/${updatedTask.id}`, updatedTask);
      return res.data;
    },
    onSuccess: () => {
      // Automatically refetch tasks to sync cache
      queryClient.invalidateQueries({ queryKey });
      Swal.fire("Success", "Task updated successfully", "success");
      onClose();
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.message || "Failed to update task", "error");
    },
  });

  const onSubmit = (data) => {
    if (!task?._id) return Swal.fire("Error", "Task ID is missing!", "error");

    const totalPayable = Number(data.required_workers) * Number(task.payable_amount || 0);

    updateMutation.mutate({
      id: task._id.toString(),
      task_title: data.task_title,
      task_detail: data.task_detail,
      required_workers: Number(data.required_workers),
      totalPayable,
    });
  };

  return (
    <>
      <input
        type="checkbox"
        id="update-task-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative bg-white backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">Update Task</h3>

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
                min={1}
                placeholder="Total number of workers"
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

            <div className="modal-action">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-error"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-[#29d409] text-white hover:text-black"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateTask;
