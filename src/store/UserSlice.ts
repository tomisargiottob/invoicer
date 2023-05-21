import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CuitAccount } from "./CuitSlice";

export interface User {
    id: string;
    name: string;
    cuitAccounts: CuitAccount[];
    organization: string,
    role: string,
    token: string,
    email: string,
    maxCuits: number,
    paymentRequired: boolean
}

export interface UserCuitAccount {
    id: string,
    fullname: string,
    cuit: string
}
  
const initialState: User = {
    id: '',
    name: '',
    organization: '',
    role: '',
    token: '',
    cuitAccounts: [],
    email: '',
    maxCuits: 0,
    paymentRequired: false,
}

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<({user: User})>) => {
            state.id = action.payload.user.id;
            state.name = action.payload.user.name
            state.organization = action.payload.user.organization
            state.role = action.payload.user.role
            state.token = action.payload.user.token
            state.email = action.payload.user.email
            state.maxCuits = action.payload.user.maxCuits
            state.paymentRequired = action.payload.user.paymentRequired
        },
        setUserCuitAccounts:(state, action: PayloadAction<({cuitAccounts: CuitAccount[]})>) => {
            state.cuitAccounts = action.payload.cuitAccounts
        },
        unsetUser: (state) => {
            state.id = initialState.id;
            state.name = initialState.name
            state.organization = initialState.organization
            state.role = initialState.role
            state.token = initialState.token
            state.email = initialState.email
            state.maxCuits = initialState.maxCuits
            state.paymentRequired = initialState.paymentRequired
        }
    }
})

export default UserSlice.reducer
export const { setUser, setUserCuitAccounts, unsetUser } = UserSlice.actions