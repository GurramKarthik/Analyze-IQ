import { store } from '@/Store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Uploadcsv from './Uploadcsv'
import useLoadData from '@/hooks/useLoadData'
import { setDataLoading, setDataURL } from '@/Store/Dataframe'
import PlotGraphs from './PlotGraphs'

const Dashboard = () => {
  const {fileURL, fileLoading} = useSelector(store => store.fileURL);
  const dispatch = useDispatch();

  




  return (
    <>
    {  fileURL ? 
            (<> 
              {
                fileLoading ? (<>
                {dispatch(setDataLoading(false))}
                  File is Loading...........
                </>) :
                (<PlotGraphs/>)
              }
             </>) :
            (<Uploadcsv> </Uploadcsv>)
    }

    </>
    
  )
}

export default Dashboard
