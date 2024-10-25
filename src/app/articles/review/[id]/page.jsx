import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

const ReviewArticle = ({ params }) => {
    const { id } = params;
    return (
        <div className="review-article">
            <Navbar />

            <div className="review-article__content padding">
                <div className="boxed">
                    <h2 className="heading-tertiary">Review Article {id}</h2>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReviewArticle;
