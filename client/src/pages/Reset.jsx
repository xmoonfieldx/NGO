import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../services/authServices";
import { useState } from "react";

function Reset() {
    const { id, token } = useParams();

    const [password, setPassword] = useState("");

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    async function handleResetSubmit(e) {
        e.preventDefault();
        try {
            const isSent = await resetPassword(id, token, password);
            if (isSent.status >= 200 && isSent.status < 300) {
                alert(
                    isSent.data +
                        "\nYou can close this tab now and log in with your new password."
                );
            }
        } catch (err) {
            alert("Incorrect reset link! Please try again.");
        }

        setPassword("");
    }

    return (
        <form className="loginForm" onSubmit={(e) => handleResetSubmit(e)}>
            <p>Enter your Password</p>
            <input
                placeholder="Password"
                onChange={(e) => handlePasswordChange(e)}
                type="password"
                id="password"
                value={password}
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

export default Reset;
