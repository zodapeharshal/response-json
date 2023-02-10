import React, { useState, useRef, useEffect, useReducer } from "react";
import * as pdfjsLib from "pdfjs-dist";
import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
import data from "../thefile.json";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { updateFileData } from "./actions/updateFileData";

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

const PdfViewer = () => {
  const [pdf, setPdf] = useState(null);
  const canvasRef = useRef(null);
  // const pageNumber = useSelector((state) => state.fileData.pageNumber) ;
  // const docId =  useSelector((state)=> state.fileData.documentId) ;
  const requestedFileData = useSelector((state) => state.fileData);
  const filesMetaData = data.data.metaData.documents;

  const filesURL = {};

  const updateFileLinks = () => {
    filesMetaData.map((f) => {
      filesURL[f.id] = f.source.fileURL;
    });
    // console.log(filesURL) ;
  };
  useEffect(() => {
    // setfilesData(data.data.metaData.documents);
    updateFileLinks();
  }, []);
  useEffect(() => {
    console.log("fileEndpoint", filesURL[requestedFileData.documentId]);
    console.log("FileHash", filesURL);
    console.log("docID", requestedFileData.documentId);
    console.log("PageNumber", requestedFileData.pageNumber);
    loadPdf(filesURL[requestedFileData.documentId]);
  }, [requestedFileData]);
  const baseurl = "https://webapp.factstream.ai/web/";
  const loadPdf = async (endpoint) => {
    // printData();
    const url = baseurl + endpoint;
    //   "https://webapp.factstream.ai/web/11665/2016/11665_2016FY_GRIC_IR_PDF.pdf";
    pdfjsLib.getDocument(url).promise.then((pdfDoc) => {
      setPdf(pdfDoc);
      renderPage(pdfDoc, requestedFileData.pageNumber);
    });
  };

  const renderPage = (pdfDoc, pageNumber) => {
    pdfDoc.getPage(parseInt(pageNumber)).then((page) => {
      var scale = 1.5;
      var viewport = page.getViewport({ scale: scale });

      var canvas = canvasRef.current;
      var context = canvas.getContext("2d");
      context.fillStyle = "#cefad0";
      var x0 = parseInt(requestedFileData.x0)
        ? parseInt(requestedFileData.x0)
        : 0;
      var x1 = parseInt(requestedFileData.y0)
        ? parseInt(requestedFileData.y0)
        : 0;
      var x2 = parseInt(requestedFileData.x1)
        ? parseInt(requestedFileData.x1)
        : 0;
      var x3 = parseInt(requestedFileData.y1)
        ? parseInt(requestedFileData.y1)
        : 0;

      context.fillRect(x0, x1, x2, x3);

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
      // page.render(renderContext).then(function(){
      //   canvas.addEventListner('click',function(event){
      //     const x = event.clientX - canvas.offsetLeft;
      //     const y = event.clientY - canvas.offsetTop;
      //     console.log(`x: ${x}, y: ${y}`);
      //   })
      // });
    });
  };

  const [isActive, setIsActive] = useState(0);
  var activeClass =
    "inline-block p-4 text-blue-600  text-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
  var inActiveClass =
    "inline-block p-4 rounded-t-lg text-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300";
  return (
    <div className="bg-white-200">
      {/* <button onClick={loadPdf}>Load PDF</button> */}
      <ul className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {filesMetaData.map((file) => {
          return (
            <li
              key={file.id}
              className="mr-2"
              onClick={() => {
                setIsActive(file.id);
                loadPdf(file.source.fileURL);
              }}
            >
              <a
                href="#"
                className={isActive === file.id ? activeClass : inActiveClass}
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
});
export default connect(mapStateToProps, mapDispatchToProps)(PdfViewer);
