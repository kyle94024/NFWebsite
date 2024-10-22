"use client";
import "./AddArticle.scss";
import AddArticleForm from "@/components/AddArticleForm/AddArticleForm";
import Navbar from "@/components/Navbar/Navbar";
import { withAuth } from "@/components/withAuth/withAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const AddArticle = () => {
    return (
        <div className="add-article">
            <Navbar />

            <div className="add-article__content padding">
                <div className="boxed">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold"
                    >
                        <ArrowLeft />
                        <span> Back</span>
                    </Link>
                    <AddArticleForm />
                </div>
            </div>
        </div>
    );
};

export default withAuth(AddArticle);
