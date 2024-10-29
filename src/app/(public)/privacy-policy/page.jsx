import "./PrivacyPolicy.scss";

import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

const sections = [
    {
        title: "Introduction",
        content:
            "Welcome to Neurofibromatosis Simplified. This Privacy Policy explains how we collect, use, and protect your information when you visit our website. By accessing or using our services, you agree to the terms of this policy.",
    },
    {
        title: "Information We Collect",
        content:
            "We collect various types of information to provide and improve our services. This may include personal data such as your name, email address, and other contact details, as well as usage data related to your interactions with our site.",
    },
    {
        title: "How We Use Your Information",
        content:
            "The information we collect is used to improve our website, provide better content, and offer personalized experiences. We may also use it for communication purposes, including newsletters and updates, if you have opted in.",
    },
    {
        title: "Data Protection",
        content:
            "We prioritize the security of your data and use various technical measures to protect it. However, please note that no method of electronic storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
        title: "Third-Party Services",
        content:
            "Our website may contain links to third-party services that are not operated by us. We are not responsible for the privacy practices of these services, and we encourage you to read their privacy policies.",
    },
    {
        title: "Your Rights",
        content:
            "You have the right to access, correct, or delete any personal information we have collected about you. To make a request, please contact our support team.",
    },
    {
        title: "Changes to This Policy",
        content:
            "We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review this policy periodically to stay informed about how we are protecting your information.",
    },
    {
        title: "Contact Us",
        content:
            "If you have any questions about this Privacy Policy or your data, please reach out to us via the contact information provided on our website.",
    },
];

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy">
            <Navbar />

            <main className="privacy-policy__content padding">
                <div className="boxed">
                    <div className="privacy-policy__body">
                        <h1 className="heading-tertiary w-400">
                            Privacy Policy
                        </h1>

                        {sections.map(({ title, content }, index) => (
                            <section
                                key={index}
                                className="privacy-policy__section"
                            >
                                <h3 className="heading-quinary">{title}</h3>
                                <p>{content}</p>
                            </section>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
