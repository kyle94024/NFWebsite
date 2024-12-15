import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
    try {
        // Parse the request to get the public ID of the image to delete
        const { public_id } = await req.json();

        if (!public_id) {
            return new Response(
                JSON.stringify({ error: "Public ID is required" }),
                { status: 400 }
            );
        }

        // Ensure the public_id corresponds to the 'profiles' folder
        const fullPublicId = `profiles/${public_id}`;

        // Call Cloudinary to delete the image by its public ID
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(fullPublicId, (error, result) => {
                if (error) {
                    console.error("Error deleting from Cloudinary:", error);
                    reject(
                        new Response(
                            JSON.stringify({
                                error: "Failed to delete image from Cloudinary",
                            }),
                            { status: 500 }
                        )
                    );
                } else {
                    resolve(result);
                }
            });
        });

        return new Response(JSON.stringify({ success: true, result }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error deleting image:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}