import axios from "axios";
const apiUrl = "http://localhost:8080/api";

export async function login(email, password) {
    const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
    return res;
}

export async function signup(name, description, availability, email, password) {
    const signUpRes = await axios.post(`${apiUrl}/auth/register`, {
        name,
        description,
        availability,
        email,
        password,
    });
    if (signUpRes.status >= 200 && signUpRes.status < 300) {
        const res = await axios.post(`${apiUrl}/auth/login`, {
            email,
            password,
        }); 
        return res;
    } else return signUpRes.status;
}

export async function forgotPassword(email) {
    const res = await axios.post(`${apiUrl}/auth/forgot-password`, { email });
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

export async function validate(token) {
    const res = await axios.post(`${apiUrl}/auth/validate`, {
        token: token,
    });
    return res;
}
