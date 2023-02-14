import { useState, useReducer } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import { updateFileData } from "./actions/updateFileData";
import { updateToShow } from "./actions/updateToShow";
import { updateIsLoading } from "./actions/updateIsLoading" ;
const Children = ({ rowdata, columnHeaders, indent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const setHash = (id, sh, hash) => {
    hash[id] = sh;
  };
  var hash = {};
  var subhash = {};
  return (
    <>
      {}
      <tbody
        key={rowdata.rowId}
        className="divide-y bg-neutral-50 divide-gray-100 "
      >
        <tr className="justify-center">
          <td
            className={`text-lg bg-neutral-200 text-gray-600 whitespace-nowrap`}
            style={{ paddingLeft: `${indent + 10}px` }}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <span style={{ paddingLeft: `${indent + 10}px` }}>
              {rowdata && rowdata.subheaders.length > 0 ? (
                <AddCircleIcon />
              ) : (
                <ArrowRightIcon />
              )}
              {rowdata && rowdata.name}
            </span>
          </td>
          <>
            {rowdata &&
              rowdata.columns.map((cols) => {
                subhash[cols.header] = {
                  val: cols.value,
                  pageDetails: cols.pageInfo,
                };
                // hash[key] = {cols.header : cols.value}
                // hash[cols.header] = cols.value;
              })}
            {
              subhash && setHash(rowdata.rowId, subhash, hash)
              // hash[data.rowId] = subhash
            }
            {/* {console.log("hash",hash)} */}
            {/* returns td values  */}
            {rowdata &&
              columnHeaders.map((attr) => {
                return (
                  <td
                    key={rowdata.rowId + attr}
                    onClick={() => {
                      if (attr !== "Units" && attr !=="Target") {
                        dispatch(updateIsLoading(true)) ;
                        dispatch(
                          updateFileData(hash[rowdata.rowId][attr].pageDetails)
                        );
                        dispatch(updateToShow(true));
                      }
                    }}
                    className={`p-1 text-base text-gray-700 text-center h-full border-x border-gray-300 border-b `}
                  >
                    <div
                    // onClick={()=>dispatch({type:"showData", payload:{pageNumber:49,documentId:40413,isActive:40413}})}
                    // onClick={()=>console.log(hash[attr])}
                    >
                      {/* {hash[rowdata.rowId]["Target"] &&
                          console.log(hash[rowdata.rowId]["Target"])} */}
                      {hash[rowdata.rowId][attr] && attr !== "Target"
                        ? hash[rowdata.rowId][attr].val
                        : hash[rowdata.rowId][attr] &&
                          hash[rowdata.rowId][attr].val.length > 0
                        ? hash[rowdata.rowId][attr].val.map((item, idx) => {
                            return (
                              <div key={rowdata.rowId + attr + idx}>
                                <p
                                  onClick={() => {
                                    console.log("item.pageInfo",item.pageInfo) ;
                                    
                                    dispatch(updateFileData(item.pageInfo));
                                    dispatch(updateToShow(true));
                                  }}
                                >
                                  {item.year}
                                  {": "}
                                  {item.value}
                                </p>
                              </div>
                            );
                          })
                        : ""}
                      {/* {console.log(hash)} */}
                    </div>
                  </td>
                );
              })}
          </>
        </tr>
      </tbody>
      {rowdata &&
        rowdata.subheaders.length > 0 &&
        isOpen &&
        rowdata.subheaders.map((data) => {
          return (
            <Children
              key={data.rowId}
              rowdata={data}
              columnHeaders={columnHeaders}
              indent={parseInt(indent) + 10}
            ></Children>
          );
        })}
      {/* {console.log('End')} */}
    </>
  );
};
const mapStateToProps = (state) => ({
  ...state,
});
const mapDispatchToProps = (dispatch) => ({
  updateFileData: () => dispatch({ type: "updateData" }),
  updateToShow: () => dispatch({ type: "updateToShow" }),
  updateIsLoading: () => dispatch({type: "updateIsLoading"})
});
export default connect(mapStateToProps, mapDispatchToProps)(Children);
