import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

const EditArticle = ({ params }) => {
    const { id } = params;
    return (
        <div className="edit-article">
            <Navbar />

            <div className="edit-article__content padding">
                <div className="boxed">
                    <h2 className="heading-tertiary">Edit Article {id}</h2>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditArticle;
