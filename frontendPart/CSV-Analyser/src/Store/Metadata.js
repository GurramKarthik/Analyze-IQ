import { createSlice } from "@reduxjs/toolkit";


const metaDataSlice = createSlice({
    name: "metaData",
    initialState: [],
    reducers: {
        setMetaData: (state, action) => {
            return action.payload;  
        }, 
        clearMetaData: () => {
             return  []
        }, 
    
    },
});

export default  metaDataSlice.reducer;

export const { setMetaData, clearMetaData } = metaDataSlice.actions;
