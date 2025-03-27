import { configureStore } from "@reduxjs/toolkit";
import getUserReducer from "./UserStore/setUserSlice";
import getStudentReducer from "./StudentSlice/getStudentSlice"

export const store = configureStore({
  reducer : {
    getUser : getUserReducer,
    getStudent: getStudentReducer
  }
})
