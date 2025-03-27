import { createSlice } from "@reduxjs/toolkit";


const metaDataSlice = createSlice({
    name: "DashboardData",
    initialState: { content :null , loading : false},
    reducers: {
        setDashboardData: (state, action) => {
            state.content =  action.payload;  
        }, 
        clearDashboardData: (state) => {
           state.content = null;
        }, 
        setLoading :(state, action) =>{
            state.loading = action.payload
        }
    
    },
});

export default  metaDataSlice.reducer;

export const { setDashboardData, clearDashboardData, setLoading } = metaDataSlice.actions;
