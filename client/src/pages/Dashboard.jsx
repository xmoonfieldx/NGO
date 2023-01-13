import Cookies from "universal-cookie";
import NavBar from "../components/NavBar";
import Restricted from "./Restricted";

function Dashboard() {
    const cookies = new Cookies();

    return typeof cookies.get("authToken") != "undefined" ? (
        <div className="wrapper">
            <NavBar />
            <div className="dashboard">
                <h1 className="welcome">Welcome {cookies.get("name")}</h1>
            </div>
        </div>
    ) : (
        <Restricted />
    );
}

export default Dashboard;
