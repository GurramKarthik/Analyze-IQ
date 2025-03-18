import React, { useState, memo, useEffect } from 'react';
import Graph from './Graph';
import GraphContainer from './GraphContainer';
import axios from 'axios';
import { BACKEND_END_POINT } from '@/utils/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@/Store';
import { setMetaData } from '@/Store/Metadata';
import { ToastMessage } from '../Home/ToastMessage';





const PlotGraphs = () => {
    const metaData = useSelector(store => store.graphMetaData);
    
    return (
        <div className="w-full grid grid-cols-2 gap-3 p-[4vmin]">
            {
                metaData.length > 0 ? metaData.map((data, index) => (
                    <GraphContainer key={index} id={index} data={data} />
                )) : <> Loading...............</>
            }
        </div>
    );
};



export default PlotGraphs;
