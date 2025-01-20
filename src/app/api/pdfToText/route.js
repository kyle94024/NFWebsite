import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req) {
  try {
    // Parse the FormData from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF file
    const pdfData = await pdfParse(buffer);

    return NextResponse.json(
      { message: "File uploaded successfully", text: pdfData.text },
      { status: 200 }
    );
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Error processing the file" },
      { status: 500 }
    );
  }
}
