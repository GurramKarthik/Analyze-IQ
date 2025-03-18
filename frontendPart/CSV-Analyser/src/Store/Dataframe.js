import { createSlice } from "@reduxjs/toolkit";


const dataframeSlice = createSlice({
    name: "csv",
    initialState: {fileURL : null, fileLoading:false, fileInBackend:false},
    reducers: {
        setDataURL: (state, action) => {
           state.fileURL =  action.payload
        }, 
        clearDataURL: () => {
             return  {fileURL : null, fileLoading:false } 
        }, 
        setDataLoading : (state, action) =>{
            state.fileLoading = action.payload
        }, 
        setDatainBackend: (state , action) =>{
            state.fileInBackend = action.payload
        }
    },
});

export default  dataframeSlice.reducer;

export const { setDataURL, clearDataURL, setDataLoading, setDatainBackend } = dataframeSlice.actions;
