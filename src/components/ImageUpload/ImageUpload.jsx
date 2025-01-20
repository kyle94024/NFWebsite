import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ImageUpload = ({
    onImageUpload,
    initialImageUrl,
    uploadUrl = "/api/images/upload-image",
    deleteUrl = "/api/images/delete-image",
    imageType = "default",
}) => {
    const [file, setFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(initialImageUrl || null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    // Handle initial image URL changes from parent
    useEffect(() => {
        setUploadedUrl(initialImageUrl);
    }, [initialImageUrl]);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
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
        formData.append("imageType", imageType); // Add image type for backend routing

        try {
            const response = await fetch(uploadUrl, {
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
            setUploadedUrl(data.url);
            onImageUpload(data.url);
            setFile(null); // Reset file input after successful upload
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

            const response = await fetch(deleteUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    public_id: publicId,
                    imageType: imageType, // Add image type for backend routing
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("Delete failed:", error);
                setError("Delete failed. Please try again.");
                return;
            }

            console.log("Image deleted successfully.");
            setUploadedUrl(null);
            setFile(null);
            onImageUpload(null); // Notify parent that image was deleted
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
                className="image-upload__input w-full md:w-max file:mr-2.4rem file:py-[2rem] file:mr-8 file:mb-8 file:px-[3.5rem] file:rounded-[10px] file:border-0 file:text-2.1rem file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                accept="image/*"
                disabled={uploading || uploadedUrl} // Only disable during upload, not when image exists
            />
            {!uploadedUrl ? (
                <Button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? "Uploading..." : "Upload Image to Cloud"}
                </Button>
            ) : (
                <Button
                    className="btn btn-primary-red"
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Delete Image"}
                </Button>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default ImageUpload;