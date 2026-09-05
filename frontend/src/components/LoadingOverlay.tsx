const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
      <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-xl bg-yellow-400 text-2xl font-bold text-blue-600 shadow-lg">
        S
      </div>
    </div>
  );
};

export default LoadingOverlay;