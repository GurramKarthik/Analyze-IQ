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
import { clearDashboardData } from "@/Store/Dashboard";

const File = memo(() => {
  const location = useLocation();
  const fileUrl = location.state?.url;

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        withCredentials: true,
      });

      if (response.data.success) {
        setColumns(response.data.columns); 
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
    if (fileUrl) {
      getData(); 
    } else {
      setLoading(false); 
    }
  }, [fileUrl]); 

  
  const CellRenderer = React.useCallback(({ columnIndex, rowIndex, style }) => {
    if (rowIndex === 0) {
      
      return (
        <div
          style={style}
          className="border-[0.1px] text-center font-bold"
        >
          {columns[columnIndex]}
        </div>
      );
    }

    const ele = rows[rowIndex - 1]?.[columnIndex];
    const cellValue = typeof ele === 'object' && ele.$numberDouble
      ? ele.$numberDouble
      : String(ele);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              style={style}
              className="border-[0.1px] text-center overflow-hidden"
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
  }, [columns, rows]); // Add columns and rows as dependencies

  if (loading) return <TableSkeleton />;

  return (
    <>
      <div className="flex flex-col  p-4">
        {/* Analyze Button */}
        <button
          style={{ backgroundImage: 'linear-gradient(to bottom, #24C6DC, #514A9D)' }} 
          className='absolute right-[10vw] top-[2.7vh] p-[2rem] pt-[0.7rem] pb-[0.7rem] bg-linear-to-b from-[#DAE2F8] to-[#D6A4A4] rounded-[5px] shadow-md hover:scale-105 transform transition-transform duration-200 active:scale-95 text-white'
          onClick={() => {
            dispatch(setDataURL(fileUrl));
            dispatch(clearDashboardData());
            ToastMessage("Analysing the file....");
            navigate('/dashboard');
          }}
        >
          Analyse this File
        </button>

        {/* Table Container */}
        <div className="flex-grow overflow-hidden mb-4 mt-20 h-[90vh]">
          <AutoSizer>
            {({ height, width }) => (
              <Grid
                columnCount={columns.length}
                columnWidth={200} // Adjust based on your needs
                height={height}
                rowCount={rows.length + 1} // +1 for header
                rowHeight={50} // Adjust based on your needs
                width={width}
              >
                {CellRenderer}
              </Grid>
            )}
          </AutoSizer>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-end space-x-3 p-2">
          {startRow.current === 0 ? (
            <Button disabled variant="outline" className="cursor-not-allowed">
              Previous
            </Button>
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
            <Button disabled variant="outline" className="cursor-not-allowed">
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
});

export default File;