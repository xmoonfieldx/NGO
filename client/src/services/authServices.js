import axios from "axios";
const apiUrl = "";

export async function login(usn, password) {
    const res = await axios.post(`${apiUrl}/auth/login`, { usn, password });
    return res;
}

export async function signup(name, usn, admn_num, email, password) {
    const signUpRes = await axios.post(`${apiUrl}/auth/register`, {
        name,
        usn,
        admn_num,
        email,
        password,
    });
    if (signUpRes.status >= 200 && signUpRes.status < 300) {
        const res = await axios.post(`${apiUrl}/auth/login`, {
            usn,
            password,
        }); //auto login after signup
        return res;
    } else return signUpRes.status;
}

export async function forgotPassword(usn) {
    const res = await axios.post(`${apiUrl}/auth/forgot-password`, { usn });
    return res;
}

export async function resetPassword(id, token, password) {
    const res = await axios.post(`${apiUrl}/auth/reset-password`, {
        id,
        token,
        password,
    });
    return res;
}
