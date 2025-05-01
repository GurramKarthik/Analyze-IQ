import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const TableSkeleton = () => {
  const numCols =6 ;  
  const numRows = 6;   

  return (
    <Table className='mt-[17vmin]'>
      <TableHeader className="rounded-[4px] bg-gray-200 animate-pulse">
        <TableRow>
          {Array.from({ length: numCols }).map((_, index) => (
            <TableHead key={index} className="border-[0.1px] text-center">
              <div className="h-4 w-16 bg-gray-300 rounded-md"></div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        <TooltipProvider>
          {Array.from({ length: numRows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="animate-pulse">
              {Array.from({ length: numCols }).map((_, colIndex) => (
                <Tooltip key={colIndex}>
                  <TooltipTrigger asChild>
                    <TableCell className="border-[0.1px] text-center">
                      <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
                    </TableCell>
                  </TooltipTrigger>
                  <TooltipContent>
                    Loading...
                  </TooltipContent>
                </Tooltip>
              ))}
            </TableRow>
          ))}
        </TooltipProvider>
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
