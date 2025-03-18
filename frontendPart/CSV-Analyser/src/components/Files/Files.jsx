import React, { useRef, useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import Papa from "papaparse";
import FilesTable from "./DataTable";

const File = () => {
  const location = useLocation();
  const fileUrl = location.state?.url ;


  return (
    // <FilesTable url={fileUrl} />
    <></>
  );
};

export default File;
