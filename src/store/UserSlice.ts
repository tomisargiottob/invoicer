import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CuitAccount } from "./CuitSlice";

export interface User {
    id: string;
    name: string;
    cuitAccounts: CuitAccount[];
    organization: string,
    role: string,
    token: string,
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
        },
        setUserCuitAccounts:(state, action: PayloadAction<({cuitAccounts: CuitAccount[]})>) => {
            state.cuitAccounts = action.payload.cuitAccounts
        }
    }
})

export default UserSlice.reducer
export const { setUser, setUserCuitAccounts  } = UserSlice.actions