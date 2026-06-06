import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
        otherUsers: null,
        selectedUser: null,
        receivedRequests: [],
        sentRequests: []
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setReceivedRequests: (state, action) => {
            state.receivedRequests = action.payload || [];
        },
        setSentRequests: (state, action) => {
            state.sentRequests = action.payload || [];
        }
    }
});
export const { setAuthUser, setOtherUsers, setSelectedUser, setReceivedRequests, setSentRequests } = userSlice.actions;
export default userSlice.reducer;