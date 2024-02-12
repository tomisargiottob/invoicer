import axios from "axios";
import { User } from "../store/UserSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api",
});

export async function createSuscription(cuitAmount: number, user: User) {
    const response = await api.post(`/organizations/${user.organization}/suscription`,{ cuitAmount }, {headers: {Authorization: user.token}});
    return response.data
}
export async function cancelSuscription(user: User) {
    const response = await api.delete(`/organizations/${user.organization}/suscription`, {headers: {Authorization: user.token}});
    return response.data
}
