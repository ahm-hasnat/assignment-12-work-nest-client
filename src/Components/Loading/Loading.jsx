const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-base-100 text-center px-4">
      {/* Animated truck icon */}

      <span className="loading loading-bars loading-lg text-primary my-6"></span>
      {/* Main message */}
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Loading......
      </h2>

      {/* DaisyUI spinner for extra visual feedback */}
    </div>
  );
};

export default Loading;
