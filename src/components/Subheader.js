import React from "react";
import { useState } from "react";
import Children from "./Children";

import AddCircleIcon from "@mui/icons-material/AddCircle";

const Subheader = ({ subhead, columnHeaders }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tbody
        onClick={() => {
          setOpen(!open);
        }}
        className="divide-y bg-cyan-200 divide-gray-100 "
      >
        <tr className="bg-white justify-center">
          <td className="p-3 text-lg bg-cyan-50 text-black whitespace-nowrap">
            <AddCircleIcon />
            {subhead && (subhead.title || subhead.name)}
          </td>

          {/* subhead ki values set karo  */}
          {subhead &&
            subhead.columns &&
            subhead.columns.map((item) => {
              <td
                key={item.rowId}
                className="p-3 text-lg bg-cyan-50 whitespace-nowrap border border-gray-50 border-r-2"
              >
                {item.value}
              </td>;
            })}
          {columnHeaders.map((col,idx) => {
                return (
                  <td
                  key={subhead.rowId + idx}
                    className={`p-1 text-base bg-cyan-50 text--700 text-center h-full   `}
                  >{}</td>
                );
              })}
        </tr>
      </tbody>
      {/* {console.log("here", subhead)} */}
      {subhead &&
        subhead.subheaders &&
        open  && 
        subhead.subheaders.map((data,idx) => {
          return (
            <Children
              rowdata={data}
              columnHeaders={columnHeaders}
              indent={15}
              key={subhead.rowId + "children" + idx}
            ></Children>
          );
        })}
    </>
  );
};

export default Subheader;
