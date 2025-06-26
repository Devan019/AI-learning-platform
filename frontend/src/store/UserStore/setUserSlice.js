import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchUser = createAsyncThunk("/getUser/fetchUser", async () => {
  try {
    const api = await axios.get(`${import.meta.env.VITE_API}/auth/user`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    const data = api.data;
    if (!data) {
      localStorage.removeItem("login");
      localStorage.removeItem("adminlogin");
      window.location.href = "/login";
      throw new Error("No user data found");
    }
    return data;
  } catch (err) {
    console.error("Fetch user failed:", err);
    throw err;
  }
});

export const getUser = createSlice({
  name :'getUser',
  initialState : {
    id : null,
    email : null,
    loading : false,
    error : null,
    obj : null,
  },
  reducers : {
    setuserdata : (state, action) => {
      state.id = action.payload.id
      state.email = action.payload.email
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.obj = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
}) 

export const { setuserdata } = getUser.actions;
export default getUser.reducer;