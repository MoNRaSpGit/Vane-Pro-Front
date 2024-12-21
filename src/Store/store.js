import { configureStore } from "@reduxjs/toolkit";
import empresaReducer from "../Slice/empresaSlice";

export const store = configureStore({
    reducer: {
        empresas: empresaReducer,
    },
});
