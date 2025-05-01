import React from 'react'
import PlotGraphs from './PlotGraphs';
import Uploadcsv from './Uploadcsv'
import { useSelector } from 'react-redux';



const Dashboard = () => {

  const {fileURL} = useSelector(store => store.fileURL);


  console.log(fileURL)

  return ( 
   <div className='w-full h-full relative'>

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