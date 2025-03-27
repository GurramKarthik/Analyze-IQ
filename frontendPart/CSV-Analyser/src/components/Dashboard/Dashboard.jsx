import React from 'react'
import PlotGraphs from './PlotGraphs';
import Uploadcsv from './Uploadcsv'
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { clearDashboardData } from '@/Store/Dashboard';
import { setDataURL } from '@/Store/Dataframe';


const Dashboard = () => {

  const {fileURL} = useSelector(store => store.fileURL);
  const dispatch = useDispatch()
  const handleNewFileBtn = () =>{
    dispatch(setDataURL(null))
    dispatch(clearDashboardData())
  }

  console.log(fileURL)

  return ( 
   <div className='w-full h-full relative'>
      <Button className='absolute right-[20vmin] top-[-1vmin] p-[3vmin] bg-black text-white hover:bg-[#222] hover:text-white'
      onClick={handleNewFileBtn}
      >New File</Button>
   {  fileURL ? 
            (<> 
              <PlotGraphs/>
             </>) :
            (<Uploadcsv> </Uploadcsv>)
    }
   </div>
  )


}

export default Dashboard