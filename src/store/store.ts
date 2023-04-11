import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { CuitSlice } from "./CuitSlice";
import { UserSlice } from "./UserSlice";

export const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    cuit: CuitSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const useAppDispatch: () => typeof store.dispatch= useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>= useSelector