import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ImageUpload = ({ onImageUpload }) => {
    const [file, setFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
        setUploadedUrl(null); // Reset the uploaded URL when a new file is selected
        setError(null); // Reset error on file selection
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/images/upload-image", {
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
            setUploadedUrl(data.url); // Store the uploaded URL
            onImageUpload(data.url); // Call the onImageUpload prop with the URL
        } catch (uploadError) {
            console.error("Error during upload:", uploadError);
            setError("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!uploadedUrl) return;

        setDeleting(true);
        setError(null);

        try {
            // Extract the public ID from the URL (between the last "/" and the first ".")
            const publicId = uploadedUrl.split("/").pop().split(".")[0];

            const response = await fetch("/api/images/delete-image", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ public_id: publicId }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("Delete failed:", error);
                setError("Delete failed. Please try again.");
                return;
            }

            console.log("Image deleted successfully.");
            setUploadedUrl(null); // Clear the uploaded URL
            setFile(null); // Clear the file input
            onImageUpload(null); // Clear the uploaded URL in the parent component
        } catch (deleteError) {
            console.error("Error during deletion:", deleteError);
            setError("An error occurred during deletion.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="file"
                onChange={handleChange}
                className="image-upload__input file:mr-2.4rem file:py-[2rem] file:mr-8 file:mb-8 file:px-[3.5rem] file:rounded-[10px] file:border-0 file:text-2.1rem file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                accept="image/*"
                disabled={!!uploadedUrl} // Disable file input if an image is uploaded
            />
            <Button
                className="btn btn-primary"
                type="button"
                onClick={handleUpload}
                disabled={uploading || !!uploadedUrl}
            >
                {uploading
                    ? "Uploading..."
                    : uploadedUrl
                    ? "Uploaded"
                    : "Upload Image to Cloud"}
            </Button>
            <Button
                className="btn btn-primary-red"
                type="button"
                onClick={handleDelete}
                disabled={!uploadedUrl || deleting}
            >
                {deleting ? "Deleting..." : "Delete Image"}
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default ImageUpload;
