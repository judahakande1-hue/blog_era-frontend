import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

function ImageCropper({ image, onCancel, onCropDone }) {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  function onCropComplete(croppedArea, croppedAreaPixelsValue) {
    setCroppedAreaPixels(croppedAreaPixelsValue);
  }

  async function handleSave() {
    const croppedFile = await getCroppedImg(image, croppedAreaPixels);
    onCropDone(croppedFile);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between p-4 text-white">
        <button
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>

        <h2 className="font-bold text-lg">Adjust Profile Picture</h2>

        <button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          Save
        </button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="p-5 bg-black text-white">
        <label className="block text-sm mb-2">Zoom</label>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default ImageCropper;