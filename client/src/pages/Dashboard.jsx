import { useState } from "react";
import Cookies from "universal-cookie";
import Restricted from "./Restricted";

function Dashboard() {
    const cookies = new Cookies();

    return typeof cookies.get("authToken") != "undefined" ? (
        <div>Dashboard</div>
    ) : (
        <Restricted />
    );
}

export default Dashboard;
