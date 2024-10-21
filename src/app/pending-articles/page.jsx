import "./PendingArticlesPage.scss";
import ArticlesListPaginated from "@/components/ArticlesListPaginated/ArticlesListPaginated";
import img from "../../assets/article-thumbnail.jpeg";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const articles = [
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
];
const PendingArticles = () => {
    return (
        <div className="pending-articles">
            <Navbar />

            <div className="pending-articles__content padding">
                <div className="boxed">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold"
                    >
                        <ArrowLeft />
                        <span> Back</span>
                    </Link>

                    <ArticlesListPaginated
                        articles={articles}
                        articlesPerPage={6}
                    />
                </div>
            </div>
        </div>
    );
};

export default PendingArticles;
