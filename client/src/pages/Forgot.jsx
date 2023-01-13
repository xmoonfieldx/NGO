import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authServices";

function Forgot() {
    const [usn, setUsn] = useState("");

    function handleUsnChange(e) {
        setUsn(e.target.value);
    }

    async function handleForgotSubmit(e) {
        e.preventDefault();
        try {
            const isSent = await forgotPassword(usn);
            if (isSent.status >= 200 && isSent.status < 300) {
                alert("Email sent for password reset!");
            }
        } catch (err) {
            alert("Email incorrect! Please try again.");
        }

        setUsn("");
    }

    return (
        <form className="loginForm" onSubmit={(e) => handleForgotSubmit(e)}>
            <p>Enter your Email</p>
            <input
                placeholder="USN"
                onChange={(e) => handleUsnChange(e)}
                type="text"
                id="usn"
                value={usn}
            />
            <button className="btn" type="submit">
                Submit
            </button>
            <Link className="link" to="/">
                Go To Home
            </Link>
        </form>
    );
}

export default Forgot;
