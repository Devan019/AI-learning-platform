import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchUser = createAsyncThunk("/getUser/fetchUser", async() => {
  const api = await axios.get(`${import.meta.env.VITE_API}/auth/user`, {withCredentials : true})
  return api.data
})

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