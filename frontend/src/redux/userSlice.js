import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
        otherUsers: null,
        selectedUser: null,
        receivedRequests: [],
        sentRequests: [],
        unreadUsers: []
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
        },
        addUnreadUser: (state, action) => {
            if (!state.unreadUsers.includes(action.payload)) {
                state.unreadUsers.push(action.payload);
            }
        },
        removeUnreadUser: (state, action) => {
            state.unreadUsers = (state.unreadUsers || []).filter(id => id !== action.payload);
        }
    }
});
export const { setAuthUser, setOtherUsers, setSelectedUser, setReceivedRequests, setSentRequests, addUnreadUser, removeUnreadUser } = userSlice.actions;
export default userSlice.reducer;