import React, { memo, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { BACKEND_END_POINT } from "@/utils/Constants";
import { ToastMessage } from "../Home/ToastMessage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import TableSkeleton from "./TableSkeleton";
import { useDispatch } from "react-redux";
import { setDataURL } from "@/Store/Dataframe";


const File = memo(() => {
  const location = useLocation();
  const fileUrl = location.state?.url;
  
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const startRow = useRef(0);
  const next = useRef(true);

  const getData = async () => {
    setLoading(true);
    const reqData = { "file_url": fileUrl, "startRow": startRow.current };
    
    try {
      const response = await axios.post(`${BACKEND_END_POINT}/getFile`, reqData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.data.success) {
        if (columns.length === 0) setColumns(response.data.columns);
        setRows(response.data.rows);
        next.current = response.data.next;
      } else {
        ToastMessage("error", response.data.message);
      }
    } catch (error) {
      ToastMessage("error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [fileUrl]);

  // Cell Renderer for Grid
  const CellRenderer = React.memo(({ columnIndex, rowIndex, style }) => {
    if (rowIndex === 0) {
      // Render header
      return (
        <div 
          style={style} 
          className="border-[0.1px] text-center font-bold "
        >
          {columns[columnIndex]}
        </div>
      );
    }

    const ele = rows[rowIndex - 1][columnIndex];
    const cellValue = typeof ele === 'object' && ele.$numberDouble 
      ? ele.$numberDouble 
      : String(ele);

    return (
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              style={style} 
              className="border-[0.1px] text-center overflow-hidden "
            >
              {cellValue}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {cellValue}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  });

  if (loading) return <TableSkeleton />;

  return (
    <>
    <div className="flex flex-col h-[96vh] p-4">
      {/* Table Container */}
      <Button className='fixed right-[20vmin] top-[4vmin] z-10 ' onClick={ () =>{ dispatch(setDataURL(fileUrl)); ToastMessage("Analysing the file...."); navigate('/dashboard') }}> Analyse this File </Button>
      <div className="flex-grow overflow-hidden mb-4">
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              columnCount={columns.length}
              columnWidth={200} // Adjust based on your needs
              height={height}
              rowCount={rows.length + 1} // +1 for header
              rowHeight={50} // Adjust based on your needs
              width={width}
              itemData={{ rows, columns }}
            >
              {CellRenderer}
            </Grid>
          )}
        </AutoSizer>
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-end space-x-3 p-2">
        {startRow.current === 0 ? (
          <Button disabled variant="outline"  className="cursor-not-allowed" >Previous</Button>
        ) : (
          <Button 
            onClick={() => {  
              startRow.current = Math.max(0, startRow.current - 100); 
              getData(); 
            }}
            variant="outline"
            
          >
            Previous
          </Button>
        )}
        {next.current ? (
          <Button 
            onClick={() => {  
              startRow.current = startRow.current + 100; 
              getData(); 
            }}
          >
            Next
          </Button>
        ) : (
          <Button disabled variant="outline"  className="cursor-not-allowed" >Next</Button>
        )}
      </div>
    </div>
    </>
  );
});

export default File;