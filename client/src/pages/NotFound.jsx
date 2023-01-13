import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="error">
            <h1>Oops !</h1>
            <p>404 - Page Not Found</p>
            <Link to="/" className="link">
                Back To Home
            </Link>
        </div>
    );
};

export default NotFound;
