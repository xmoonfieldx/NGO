import { login, signup } from "../services/authServices";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Home({ getUserDetails, handleValidation }) {
    let navigate = useNavigate();
    const cookies = new Cookies();

    const [signupData, setSignupData] = useState({
        name: "",
        description: "",
        availability: "",
        email: "",
        password: "",
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [isLogin, setIsLogin] = useState(true);

    function handleLoginChange(e) {
        setLoginData({ ...loginData, [e.target.id]: e.target.value });
    }

    function handleSignupChange(e) {
        setSignupData({ ...signupData, [e.target.id]: e.target.value });
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        try {
            const isLoggedIn = await login(loginData.email, loginData.password);
            if (isLoggedIn.status >= 200 && isLoggedIn.status < 300) {
                getUserDetails(isLoggedIn.data);
                navigate("/dashboard");
            }
        } catch (err) {
            alert("USN or Password incorrect! Please try again.");
        }
        setLoginData({ email: "", password: "" });
    }

    async function handleSignupSubmit(e) {
        e.preventDefault();
        try {
            const isSignedUp = await signup(
                signupData.name,
                signupData.description,
                signupData.availability,
                signupData.email,
                signupData.password
            );
            if (isSignedUp.status >= 200 && isSignedUp.status < 300) {
                getUserDetails(isSignedUp.data);
                navigate("/dashboard");
            }
        } catch (err) {
            alert("Signup failed, Please try again!");
        }
        setSignupData({
            name: "",
            description: "",
            availability: "",
            email: "",
            password: "",
        });
    }

    return typeof cookies.get("authToken") != "undefined" ? (
        handleValidation() ? (
            <Navigate to="/dashboard" />
        ) : (
            <Navigate to="/" />
        )
    ) : (
        <div className="home-wrapper">
            <h1 className="title">NGO Portal</h1>
            <div className="container">
                {isLogin ? (
                    <div className="loginDiv">
                        <form
                            className="loginForm"
                            onSubmit={(e) => handleLoginSubmit(e)}
                        >
                            <p>Login</p>
                            <input
                                placeholder="Email"
                                onChange={(e) => handleLoginChange(e)}
                                type="text"
                                id="email"
                                value={loginData.email}
                            />
                            <input
                                placeholder="Password"
                                onChange={(e) => handleLoginChange(e)}
                                type="password"
                                id="password"
                                value={loginData.password}
                            />
                            <button className="btn" type="submit">
                                Log In
                            </button>
                            <Link
                                className="link"
                                onClick={() => setIsLogin(false)}
                            >
                                Click here to Register
                            </Link>
                            <Link to="/forgot" className="link">
                                Forgot Password
                            </Link>
                        </form>
                    </div>
                ) : (
                    <div className="signupDiv">
                        <form
                            className="signupForm"
                            onSubmit={(e) => handleSignupSubmit(e)}
                        >
                            <p>Signup</p>
                            <input
                                placeholder="Name"
                                onChange={(e) => handleSignupChange(e)}
                                type="text"
                                id="name"
                                value={signupData.name}
                            />
                            <input
                                placeholder="Description"
                                onChange={(e) => handleSignupChange(e)}
                                type="text"
                                id="description"
                                value={signupData.description}
                            />
                            <input
                                placeholder="Availabilty"
                                onChange={(e) => handleSignupChange(e)}
                                type="text"
                                id="availability"
                                value={signupData.availability}
                            />
                            
                            <input
                                placeholder="Email"
                                onChange={(e) => handleSignupChange(e)}
                                type="email"
                                id="email"
                                value={signupData.email}
                            />
                            <input
                                placeholder="Password"
                                onChange={(e) => handleSignupChange(e)}
                                type="password"
                                id="password"
                                value={signupData.password}
                            />
                            <button className="btn" type="submit">
                                Sign Up
                            </button>
                            <Link
                                className="link"
                                onClick={() => setIsLogin(true)}
                            >
                                Click here to Login
                            </Link>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
