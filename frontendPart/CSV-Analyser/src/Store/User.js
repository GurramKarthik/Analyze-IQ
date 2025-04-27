import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:  {user:null},
    reducers :{
        setUser : (state, action)=>{
            state.user = action.payload
        },
        addFile :(state, action) =>{
            state.user.files.push(action.payload)
        }
    }

})

export default userSlice.reducer;
export const {setUser, addFile} = userSlice.actions
