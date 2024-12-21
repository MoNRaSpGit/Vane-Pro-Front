import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk para cargar las empresas desde el backend
export const fetchEmpresas = createAsyncThunk("empresas/fetchEmpresas", async () => {
    const response = await fetch("https://vane-pro-back.onrender.com/api/empresas");

    if (!response.ok) {
        throw new Error("Error al cargar las empresas");
    }

    const data = await response.json();
    console.log("Datos recibidos del backend:", data);
    return data;
});


// Slice para manejar las empresas
const empresaSlice = createSlice({
    name: "empresas",
    initialState: {
        empresas: [], // Lista de empresas
        status: "idle", // "idle" | "loading" | "succeeded" | "failed"
        error: null, // Manejo de errores
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmpresas.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchEmpresas.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.empresas = action.payload;
            })
            .addCase(fetchEmpresas.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default empresaSlice.reducer;
