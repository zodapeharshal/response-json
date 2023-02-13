import React from "react";
import Subheader from "./Subheader";
import PdfViewer from "./PdfViewer";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { updateFileData } from "./actions/updateFileData";
import Divider from "@mui/material/Divider";
const Table = ({ tablecontent, heading }) => {
  const toShow = useSelector((state) => state.toShow);
  return (
    <div className="flex overflow-auto rounded-lg mt-12 shadow block">
      <table className={toShow ? "w-[69%]" : "w-[100%]"}>
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

        {tablecontent &&
          tablecontent.children.map((data) => {
            return (
              <Subheader
                key={data.rowId}
                subhead={data}
                columnHeaders={tablecontent.columnheaders}
              ></Subheader>
            );
          })}
      </table>
      <div className="w-[.5%]"></div>
      <Divider orientation="vertical" flexItem></Divider>
      <div className="w-[.5%]"></div>

      {toShow ? (
        <div className="w-[30%] overflow-scroll border border-gray-400 p-5">
          <PdfViewer> </PdfViewer>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
const mapStateToProps = (state) => ({
  ...state,
});
const mapDispatchToProps = (dispatch) => ({
  updateFileData: () => dispatch(updateFileData),
});
export default connect(mapStateToProps, mapDispatchToProps)(Table);
