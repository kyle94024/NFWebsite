import "./SubscriptionBanner.scss";
import Link from "next/link";
import { MessageSquare } from "lucide-react"; // Importing icon from Lucide

const SubscriptionBanner = () => {
    return (
        <div className="subscription-banner">
            <h2 className="heading-tertiary w-800">Get in Touch</h2>
            <p className="body-large color-light-grey">
                Reach out to us for any questions, partnerships, or support.
                We&apos;re here to help!
            </p>

            <Link href="/contact" className="btn btn-primary-white">
                <MessageSquare className="icon" />
                <span className="text">Contact Us</span>
            </Link>
        </div>
    );
};

export default SubscriptionBanner;
