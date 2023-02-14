import React, { useState, useRef, useEffect, useReducer } from "react";
import * as pdfjsLib from "pdfjs-dist";
import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
import data from "../thefile.json";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { updateFileData } from "./actions/updateFileData";
import { updateToShow } from "./actions/updateToShow";
import { updatePeriod } from "./actions/updatePeriod";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

const PdfViewer = () => {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(0);
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const requestedFileData = useSelector((state) => state.fileData);
  const periodYear = useSelector((state) => state.toActivatePeriod);
  // console.log(requestedFileData);
  const filesMetaData = data.data.metaData.documents;

  const filesURL = {};

  const updateFileLinks = () => {
    filesMetaData.map((f) => {
      filesURL[f.id] = { URL: f.source.fileURL, periodYR: f.period };
    });
  };

  useEffect(() => {
    updateFileLinks();
    console.log("filesURL", filesURL);
    // console.log("fileEndpoint", filesURL[requestedFileData.documentId]);
    // console.log("FileHash", filesURL);
    // console.log("docID", requestedFileData.documentId);
    // console.log("PageNumber", requestedFileData.pageNumber)
    console.log(requestedFileData);
    requestedFileData && loadPdf(filesURL[requestedFileData.documentId].URL);
    dispatch(updatePeriod(filesURL[requestedFileData.documentId].periodYR));
  }, [requestedFileData]);

  const baseurl = "https://webapp.factstream.ai/web/";

  const loadPdf = async (endpoint, rem = 1) => {
    const url = baseurl + endpoint;
    await pdfjsLib.getDocument(url).promise.then(async (pdfDoc) => {
      // await setPdf(pdfDoc);
      setPdf(pdfDoc);
      await renderPage(pdfDoc, requestedFileData.pageNumber, rem);
    });
    setIsActive(requestedFileData.documentId);
    setPageNum(requestedFileData.pageNumber);
  };

  const renderPage = async (pdfDoc, pageNumber, rem = 1) => {
    console.log("pageNum", pageNum);
    setPageNum(pageNumber);
    await pdfDoc.getPage(parseInt(pageNumber)).then((page) => {
      var scale = 1.5;
      var viewport = page.getViewport({ scale: scale });
      var canvas = canvasRef.current;
      var context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
        canvasContext: context,
        viewport: viewport,
        intention: "display",
        resolution: 250,
      };

      page.render(renderContext);

      context.fillStyle = "green";

      context.globalAlpha = 0.9;

      var x0 = Number(requestedFileData.x0) ? Number(requestedFileData.x0) : 0;
      var x1 = Number(requestedFileData.y0) ? Number(requestedFileData.y0) : 0;
      var x2 = Number(requestedFileData.x1)
        ? parseInt(requestedFileData.x1)
        : 0;
      var x3 = Number(requestedFileData.y1) ? Number(requestedFileData.y1) : 0;
      console.log(
        "Coordinates : ",
        x0 * scale,
        x1 * scale,
        (x2 - x0) * scale,
        (x3 - x1) * scale
      );
      requestedFileData &&
        rem &&
        context.fillRect(
          x0 * scale,
          x1 * scale,
          (x2 - x0) * scale,
          (x3 - x1) * scale
        );
      // context.stroke();
    });
  };
  const handleJump = (event)  =>{
    renderPage(pdf,parseInt(event.target.value),0) ;
  }
  var activeClass =
    "inline-block p-4 text-blue-600  text-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
  var inActiveClass =
    "inline-block p-4 rounded-t-lg text-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300";
  return (
    <div className="bg-white-200">
      <div className="flex items-center justify-between mb-4 ">
        <div>
          <button class="bg-blue-500 text-base hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={()=>dispatch(updateToShow(false))}
          >
            Close
          </button>
        </div>
        <div>
          <button>
            <ArrowCircleLeftIcon
              onClick={() =>
                renderPage(pdf, parseInt(parseInt(pageNum) - 1), 0)
              }
            />
          </button>
          Page
          <button>
            <ArrowCircleRightIcon
              onClick={() =>
                renderPage(pdf, parseInt(parseInt(pageNum) + 1), 0)
              }
            />
          </button>
        </div>
        <div className="text-base">
          <label className="font-semibold">Jump To  :</label>
          &nbsp;
          <input
            type="number"
            onChange={handleJump}
            className="border-2 border-black-400 rounded-md"
            style={{width: "50px"}}
          />
        </div>
      </div>

      <ul className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {filesMetaData.map((file) => {
          return (
            <li
              key={file.id}
              className="mr-2"
              onClick={() => {
                // setIsActive(file.id);
                dispatch(updatePeriod(file.period));
                loadPdf(file.source.fileURL, 0);
              }}
            >
              <a
                href="#"
                // className={isActive === requestedFileData.documentId ? activeClass : inActiveClass}
                className={
                  periodYear == file.period ? activeClass : inActiveClass
                }
                // className={activeClass}
              >
                {file.period}
              </a>
            </li>
          );
        })}
      </ul>
      <canvas ref={canvasRef} width="300" height="300" />
    </div>
  );
};
const mapStateToProps = (state) => ({
  ...state,
});
const mapDispatchToProps = (dispatch) => ({
  updateFileData: () => dispatch(updateFileData),
  updateToShow: () => dispatch({ type: "updateToShow" }),
  updatePeriod: () => dispatch({ type: "updatePeriod" }),
});
export default connect(mapStateToProps, mapDispatchToProps)(PdfViewer);