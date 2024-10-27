import "./PrivacyPolicy.scss";

import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy">
            <Navbar />

            <div className="privacy-policy__content padding">
                <div className="boxed">
                    <div className="privacy-policy__body">
                        <h1 className="heading-tertiary w-400">
                            Privacy Policy
                        </h1>

                        <section className="privacy-policy__section">
                            <h3 className="heading-quinary">Introduction</h3>
                            <p>
                                Welcome to Neurofibromatosis Simplified. This
                                Privacy Policy explains how we collect, use, and
                                protect your information when you visit our
                                website. By accessing or using our services, you
                                agree to the terms of this policy.
                            </p>
                        </section>

                        <section className="privacy-policy__section">
                            <h3 className="heading-quinary">
                                Information We Collect
                            </h3>
                            <p>
                                We collect various types of information to
                                provide and improve our services. This may
                                include personal data such as your name, email
                                address, and other contact details, as well as
                                usage data related to your interactions with our
                                site.
                            </p>
                        </section>

                        <section className="privacy-policy__section">
                            <h3 className="heading-quinary">
                                How We Use Your Information
                            </h3>
                            <p>
                                The information we collect is used to improve
                                our website, provide better content, and offer
                                personalized experiences. We may also use it for
                                communication purposes, including newsletters
                                and updates, if you have opted in.
                            </p>
                        </section>

                        <section className="privacy-policy__section">
                            <h3 className="heading-quinary">Data Protection</h3>
                            <p>
                                We prioritize the security of your data and use
                                various technical measures to protect it.
                                However, please note that no method of
                                electronic storage is 100% secure, and we cannot
                                guarantee absolute security.
                            </p>
                        </section>

                        <section className="privacy-policy__section">
                            <h3 className="heading-quinary">
                                Third-Party Services
                            </h3>
                            <p>
                                Our website may contain links to third-party
                                services that are not operated by us. We are not
                                responsible for the privacy practices of these
                                services, and we encourage you to read their
                                privacy policies.
                            </p>
                        </section>

                        <section className="privacy-policy__section">
                            <h3 className="heading-quinary">Your Rights</h3>
                            <p>
                                You have the right to access, correct, or delete
                                any personal information we have collected about
                                you. To make a request, please contact our
                                support team.
                            </p>
                        </section>

                        <section className="privacy-policy__section">
                            <h3 className="heading-quinary">
                                Changes to This Policy
                            </h3>
                            <p>
                                We may update this Privacy Policy from time to
                                time. Any changes will be posted on this page,
                                and we encourage you to review this policy
                                periodically to stay informed about how we are
                                protecting your information.
                            </p>
                        </section>

                        <section className="privacy-policy__section">
                            <h3 className="heading-quinary">Contact Us</h3>
                            <p>
                                If you have any questions about this Privacy
                                Policy or your data, please reach out to us via
                                the contact information provided on our website.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
