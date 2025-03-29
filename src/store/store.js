import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

// api fetch checking process
// const fetchingData=async()=>{
//   const res=await fetch("https://gorest.co.in/public/v1/users?page=1")
//   const data=await res.json();
//   console.log(data)
// }
// fetchingData()


const API_URL = "https://gorest.co.in/public/v1/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (page) => {
  const response = await axios.get(`${API_URL}?page=${page}`);
  // console.log(response);
  return response.data.data;
});
const userSlice = createSlice({
  name: 'users',
  initialState: { users: [], page: 1, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Remove duplicate users before adding new ones
        const uniqueUsers = [...state.users, ...action.payload].reduce((acc, user) => {
          if (!acc.some((existingUser) => existingUser.id === user.id)) {
            acc.push(user);
          }
          return acc;
        }, []);

        state.users = uniqueUsers;
        state.page += 1;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});


export const store = configureStore({
  reducer: { users: userSlice.reducer },
});