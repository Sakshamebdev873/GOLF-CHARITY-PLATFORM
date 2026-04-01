import { useState } from "react";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, folder: string = "golf-charity"): Promise<string> => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = Cookies.get("token");

      const res = await fetch(`${API_URL}/uploads/image?folder=${folder}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Upload failed");

      setProgress(100);
      return data.data.url;
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress };
}