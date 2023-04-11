import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api",
});

export async function login(values: {email: string, password: string}) {
    const response = await api.post('/users/login', values);
    return response.data
}

export async function getUserData(token: string) {
    const response = await api.get('/users', {headers: {Authorization: token}} );
    return response.data
}
