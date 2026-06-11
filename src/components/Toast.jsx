function Toast({ type, message, onClose }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`mb-6 rounded-xl mt-5 border p-4 shadow-sm ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold">
            {isSuccess ? "Success" : "Error"}
          </h2>

          <p className="text-sm mt-1">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`font-bold ${
            isSuccess
              ? "text-green-500 hover:text-green-700"
              : "text-red-500 hover:text-red-700"
          }`}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;