// components/ImageUpload.js

import { useState } from "react";
import { Input } from "../ui/input";

const ImageUpload = ({ onImageUpload }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
        setError(null); // Reset error on file selection
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("Upload failed:", error);
                setError("Upload failed. Please try again.");
                return;
            }

            const data = await response.json();
            console.log("Uploaded image URL:", data.url);
            onImageUpload(data.url); // Call the onImageUpload prop
        } catch (uploadError) {
            console.error("Error during upload:", uploadError);
            setError("An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="file"
                onChange={handleChange}
                className="image-upload__input file:mr-2.4rem file:py-[2rem] file:mr-8 file:mb-8 file:px-[3.5rem] file:rounded-[10px] file:border-0 file:text-2.1rem file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                accept="image/*"
            />
            <button
                className="btn btn-primary"
                type="button"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload Image to Cloud"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default ImageUpload;
