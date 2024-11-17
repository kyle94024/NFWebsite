import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";

import { ToastContainer } from "react-toastify";

import '../lib/polyfills.js';


// Importing Outfit font from Google Fonts
const outfitFont = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
    title: "NF Simplified",
    description:
        "Neurofibromatosis Simplified - Get simplified information about Neurofibromatosis",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfitFont.variable} antialiased`}>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                />

                {children}
            </body>
        </html>
    );
}
