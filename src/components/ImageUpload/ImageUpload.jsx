// components/ImageUpload.js

import { useState } from "react";

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
        <div>
            <input type="file" onChange={handleChange} />
            <button type="button" onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload Image"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default ImageUpload;
