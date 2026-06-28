import { useState } from "react";
import { X } from "lucide-react";

function ProfileImageViewer({ src, alt = "Profile picture", size = "w-11 h-11" }) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <div
        className={`${size} rounded-full bg-purple-600 text-white flex items-center justify-center font-bold`}
      >
        {alt?.charAt(0).toUpperCase() || "U"}
      </div>
    );
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        className={`${size} rounded-full object-cover cursor-pointer hover:scale-105 transition`}
        title="Click to view full picture"
      />

      

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 bg-white text-black rounded-full p-2 hover:bg-gray-200"
          >
            <X size={24} />
          </button>

          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain bg-white"
          />
        </div>
      )}
    </>
  );
}

export default ProfileImageViewer;