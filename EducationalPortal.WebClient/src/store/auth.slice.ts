import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Auth} from '../graphQL/modules/auth/auth.types';

const initialState = {
    isAuth: false,
    me: null as Auth | null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ me: Auth }>) => {
            localStorage.setItem('token', action.payload.me.token);
            state.isAuth = true;
            state.me = action.payload.me;
        },
        logout: (state, action: PayloadAction) => {
            localStorage.removeItem('token');
            state.me = null;
            state.isAuth = false;
        },
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
