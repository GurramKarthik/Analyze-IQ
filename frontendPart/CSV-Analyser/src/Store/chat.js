import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:  [],
    reducers :{
        addChat : (state, action)=>{
            state.push(action.payload)
        },
        clearChat : (state, action) =>{
            return [];
        }
    }

})

export default chatSlice.reducer;
export const {addChat, clearChat} = chatSlice.actions
