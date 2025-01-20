import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
});

// Define the POST route for uploading images to the 'profiles' folder
export async function POST(req) {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("file"); // Get the file from the form data

    if (!file) {
        return new Response(JSON.stringify({ error: "No file uploaded" }), {
            status: 400,
        });
    }

    // Convert the buffer to a Node.js readable stream
    const buffer = await file.arrayBuffer(); // Get the file buffer
    const readableStream = new Readable({
        read() {
            this.push(Buffer.from(buffer)); // Push the buffer to the stream
            this.push(null); // Signal the end of the stream
        },
    });

    try {
        // Upload the image buffer to Cloudinary in the 'profiles' folder
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto", // Automatically detect resource type
                    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                    folder: "profiles", // Specify the 'profiles' folder
                },
                (error, result) => {
                    if (error) {
                        console.error("Error uploading to Cloudinary:", error);
                        reject(
                            new Response(
                                JSON.stringify({
                                    error: "Failed to upload image to Cloudinary",
                                }),
                                { status: 500 }
                            )
                        );
                    } else {
                        resolve(result); // Resolve with the result
                    }
                }
            );

            // Pipe the readable stream to Cloudinary
            readableStream.pipe(uploadStream);
        });

        // Return the image URL in the response
        return new Response(JSON.stringify({ url: uploadResult.secure_url }), {
            status: 200,
        });
    } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return new Response(
            JSON.stringify({ error: "Failed to upload image to Cloudinary" }),
            { status: 500 }
        );
    }
}