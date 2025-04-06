"use client";
import { useRouter } from "next/navigation";

const ProfileSettings = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-[400px]">
        <h2 className="text-lg font-bold">Compose Reply</h2>
        <textarea className="w-full h-20 border p-2 mt-2"></textarea>
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={() => router.back()} className="p-2 border rounded">
            Cancel
          </button>
          <button className="p-2 bg-blue-500 text-white rounded">
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
