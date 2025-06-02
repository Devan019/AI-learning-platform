import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStudent = createAsyncThunk(
  "/getStudent/fetchStudent",
  async (id) => {
    const api = await axios.get(
      `${import.meta.env.VITE_API}/users/student/${id}`,
      { withCredentials: true }
    );
    
    return api.data;
  }
);

export const getStudent = createSlice({
  name: "getStudent",
  initialState: {
    student: null,
    loading: false,
    error: null,
  },
  reducers: {
    setuserdata: (state, action) => {
      state.student = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setuserdata } = getStudent.actions;
export default getStudent.reducer;
