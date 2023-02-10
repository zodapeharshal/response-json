import React from "react";
import Subheader from "./Subheader";
import PdfViewer from "./PdfViewer";
const Table = ({ tablecontent, heading }) => {
  return (
    <div className="flex overflow-auto rounded-lg mt-12 shadow block">
      <table className="w-[69%]">
        <thead className="bg-neutral-200 border-b-2 border-black">
          <tr>
            <th className="w-20 p-3 text-lg font-semibold tracking-wide text-left">
              {tablecontent.heading}
            </th>
            {tablecontent &&
              tablecontent.columnheaders.map((item) => (
                <th
                  key={item}
                  className="w-200 p-6 text-lg font-semibold tracking-wide text-left"
                >
                  {item}
                </th>
              ))}
          </tr>
        </thead>

        {
          tablecontent &&
            tablecontent.children.map((data) => {
              return (
                <Subheader
                  subhead={data}
                  columnHeaders={tablecontent.columnheaders}
                ></Subheader>
              );
            })
          // tablecontent.map((data) => {
          //   if (data.heading === heading) {
          //     return data.children.map((parent) => (
          //       <Subheader
          //         key={parent.rowId}
          //         parent={parent}
          //         columnHeaders={content[0].columnheaders}
          //       />
          //     ));
          //   }
          // }
        }
      </table>
        <div className="w-[1%]"></div>
      <div className="w-[30%] overflow-scroll border border-gray-400 p-5">
        <PdfViewer> </PdfViewer>
      </div>
    </div>
  );
};

export default Table;
