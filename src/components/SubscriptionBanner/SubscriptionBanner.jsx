import "./SubscriptionBanner.scss";

import { Input } from "../ui/input";

const SubscriptionBanner = () => {
    return (
        <div className="subscription-banner">
            <h2 className="heading-tertiary w-800">Stay Up-To-Date</h2>
            <p className="body-large color-light-grey">
                Join our mailing list for news, exclusive resources, articles
                and updates.
            </p>

            <div className="subscription-banner__input-group">
                <Input
                    type="email"
                    placeholder="Enter Email"
                    className="subscription-banner__input"
                />
                <button className="btn btn-primary-white">Subscribe</button>
            </div>
        </div>
    );
};

export default SubscriptionBanner;
