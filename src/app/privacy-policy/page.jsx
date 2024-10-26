import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy">
            <Navbar />

            <div className="privacy-policy__content padding">
                <div className="boxed">
                    <h2 className="heading-tertiary">Privacy Policy</h2>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
