import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: '',
};

export const usersProSlice = createSlice({
 name: 'usersPro',

  initialState,
 reducers: {
   addToken: (state, action) => {
     state.value = action.payload;
   },
   disconnect: (state, action) =>{
    state.value = ''
   }
 },
});

export const { addToken, disconnect } = usersProSlice.actions;
export default usersProSlice.reducer;