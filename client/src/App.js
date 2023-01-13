import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Cookie from "universal-cookie";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import { validate } from "./services/authServices";

function App() {
    const cookies = new Cookie();

    function getUserDetails(data) {
        let date = new Date();
        date.setDate(date.getDate() + 30);

        cookies.set("name", data.name, { expires: date });
        cookies.set("authToken", data.accessToken, { expires: date });
        cookies.set("userId", data._id, { expires: date });
    }

    async function handleValidation() {
        try {
            const res = await validate(cookies.get("authToken"));
            if (res.status >= 200 && res.status < 300) {
                return true;
            }
        } catch (err) {
            cookies.remove("authToken");
            return false;
        }
    }

    return (
        <Router>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        <Home
                            getUserDetails={getUserDetails}
                            handleValidation={handleValidation}
                        />
                    }
                />
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/forgot" element={<Forgot />} />
                <Route
                    exact
                    path="reset-password/:id/:token"
                    element={<Reset />}
                />
                <Route exact path="/*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
