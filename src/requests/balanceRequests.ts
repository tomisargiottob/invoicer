import axios from "axios";
import { User } from "../store/UserSlice";
import IBalance from "../class/Profile/interface/IBalance";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api",
});

export async function importBalances(balances: IBalance[], cuit: string, user: User) {
    const response = await api.post(`/organizations/${user.organization}/cuits/${cuit}/balances`, { balances }, {headers: {Authorization: user.token}});
    return response.data
}

export async function getBalances({user, cuit}: {user:User, cuit: string}) {
    const response = await api.get(`/organizations/${user.organization}/cuits/${cuit}/balances`, {headers: {Authorization: user.token}})
    return response.data
}
