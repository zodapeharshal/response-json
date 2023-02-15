import React, { useState, useRef, useEffect, useReducer, useMemo } from "react";
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
import { updateIsLoading } from "./actions/updateIsLoading";
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

const PdfViewer = () => {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const requestedFileData = useSelector((state) => state.fileData);
  const periodYear = useSelector((state) => state.toActivatePeriod);
  const isLoading = useSelector((state) => state.isLoading);
  const reqPage = useSelector((state) => state.fileData.pageNumber);
  const filesMetaData = data.data.metaData.documents;
  const baseurl = "https://webapp.factstream.ai/web/";


  const filesURL = useMemo(() => {
    const hash = {};
    filesMetaData.map((f) => {
      hash[f.id] = { URL: f.source.fileURL, periodYR: f.period };
    });
    return hash;
  }, []);

  useEffect(() => {
    const viewer = document.getElementById("pdf-viewer");
    viewer.replaceChildren();
    requestedFileData && loadPdf(filesURL[requestedFileData.documentId].URL);

    console.log("Calling here 1 times with data", requestedFileData);
  }, [requestedFileData.documentId]);

  useEffect(() => {
    const updateRenderPage = async () => {
      const activeCanvas = await document.getElementById(
        `canvas-${requestedFileData.pageNumber}`
      );
      console.log("Fetching page");
      highLight(activeCanvas.getContext("2d"));
      console.log("callled highlight function ");
      activeCanvas.scrollIntoView();
    };
    updateRenderPage();
  }, [
    requestedFileData.pageNumber,
    requestedFileData.x0,
    requestedFileData.x1,
    requestedFileData.y0,
    requestedFileData.y1,
  ]);

  const loadSpecificFile = (url, rem = 1) => {
    const viewer = document.getElementById("pdf-viewer");
    viewer.replaceChildren();
    loadPdf(url, 0);
  };

  const loadPdf = async (endpoint, rem = 1) => {
    const url = baseurl + endpoint;
    await pdfjsLib.getDocument(url).promise.then(async (pdfDoc) => {
      const viewer = await document.getElementById("pdf-viewer");
      for (let page = 1; page <= pdfDoc.numPages; page++) {
        const canvas = await document.createElement("canvas");
        canvas.id = `canvas-${page}`;
        viewer.appendChild(canvas);
        renderPage(pdfDoc, page, canvas);
      }
      console.log("tyeing to render wait ");
      const activeCanvas = document.getElementById(
        `canvas-${requestedFileData.pageNumber}`
      );
      activeCanvas.scrollIntoView();
      dispatch(updateIsLoading(false));
    });
  };
  
  const renderPage = async (pdfDoc, pageNumber, canvas) => {
    return await pdfDoc.getPage(pageNumber).then(async (page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const context = canvas.getContext("2d");
      context.willReadFrequently = true;
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
      if (parseInt(reqPage) === parseInt(pageNumber)) {
        highLight(context);
      }
      return canvas;
    });
  };

  const highLight = (context) => {
    context.fillStyle = "rgba(0,255,0,0.5)";
    const scale = 1.5;
    context.globalAlpha = 0.9;

    var x0 = Number(requestedFileData.x0) || 0;
    var x1 = Number(requestedFileData.y0) || 0;
    var x2 = Number(requestedFileData.x1) || 0;
    var x3 = Number(requestedFileData.y1) || 0;
    console.log("Coordinates", x0, x1, x2, x3);
    requestedFileData &&
      context.fillRect(
        x0 * scale,
        x1 * scale,
        (x2 - x0) * scale,
        (x3 - x1) * scale
      );
  };

  const handleJump = (event) => {
    const activeCanvas = document.getElementById(
      `canvas-${event.target.value}`
    );
    activeCanvas.scrollIntoView();
  };

  var activeClass =
    "inline-block p-4 text-blue-600  text-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
  var inActiveClass =
    "inline-block p-4 rounded-t-lg text-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300";
  return (
    <div className="bg-white-200">
      <div className="flex items-center justify-between mb-4 ">
        <div>
          <button
            className="bg-blue-500 text-base hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => dispatch(updateToShow(false))}
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
          <label className="font-semibold">Jump To :</label>
          &nbsp;
          <input
            type="number"
            onChange={handleJump}
            className="border-2 border-black-400 rounded-md"
            style={{ width: "50px" }}
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
                dispatch(updatePeriod(file.period));

                loadSpecificFile(file.source.fileURL, 0);
              }}
            >
              <a
                href="#"
                className={
                  periodYear == file.period ? activeClass : inActiveClass
                }
              >
                {file.period}
              </a>
            </li>
          );
        })}
      </ul>
      {isLoading ? (
        <div className="justify-center">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
            disabled=""
          >
            Processing...
          </button>
        </div>
      ) : (
        ""
      )}
      <div id="pdf-viewer" className="h-[64rem] overflow-y-scroll"></div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ...state,
});
const mapDispatchToProps = (dispatch) => ({
  updateFileData: () => dispatch({ type: "updateData" }),
  updateToShow: () => dispatch({ type: "updateToShow" }),
  updatePeriod: () => dispatch({ type: "updatePeriod" }),
  updateIsLoading: () => dispatch({ type: "updateIsLoading" }),
});
export default connect(mapStateToProps, mapDispatchToProps)(PdfViewer);
