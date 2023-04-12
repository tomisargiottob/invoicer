import axios from "axios";
import { CuitAccountInput } from "../store/CuitSlice";
import { User } from "../store/UserSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api",
});

api.interceptors.response.use((response) => {
    return response
}, (error) => {
    throw new Error(error?.response?.data?.message || 'Error deconocido, vuelva a intentarlo')
})

export async function createCuit({user, cuit}: {user:User, cuit: CuitAccountInput}) {
    const response = await api.post(`/organizations/${user.organization}/cuits`, cuit, {headers: {Authorization: user.token}});
    return response.data
}

export async function removeCuit({user, id}: {user:User, id: string}) {
    const response = await api.delete(`/organizations/${user.organization}/cuits/${id}`, {headers: {Authorization: user.token}});
    return response.data
}

export async function getUserCuits({user}: {user:User}) {
    const response = await api.get(`/organizations/${user.organization}/cuits`,{headers: {Authorization: user.token}});
    return response.data
}

export async function getUserCuit({user, id}: {user:User, id: string}) {
    const response = await api.get(`/organizations/${user.organization}/cuits/${id}`,{headers: {Authorization: user.token}});
    return response.data
}

export async function activateUserAccount({user, id}: {user:User, id: string}) {
    const response = await api.get(`/organizations/${user.organization}/cuits/${id}/login`,{headers: {Authorization: user.token}});
    return response.data
}

