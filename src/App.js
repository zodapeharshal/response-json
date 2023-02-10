import { useEffect, useState } from "react";
import data from "./thefile.json";
import "./App.css";
import Table from "./components/Table";
import PdfViewer from "./components/PdfViewer";
import { connect } from "react-redux";

function App() {

  const [content, setContent] = useState(data.data.json);
  const [heading, setHeading] = useState("Disclosure");

  var activeClass =
    "inline-block p-4 text-blue-600  text-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
  var inActiveClass =
    "inline-block p-4 rounded-t-lg text-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300";
  const [isActive, setIsActive] = useState(0);

  useEffect(() => {
    setContent(data.data.json);
    // setHeading("Disclousre");
  }, []);

  return (
    <div className="text-4xl mt-8">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li
          className="mr-2"
          onClick={() => {
            setIsActive(0);
            // setContent(data.data.json[0]);
            setHeading("Disclosure");
          }}
        >
          <a href="#" className={isActive === 0 ? activeClass : inActiveClass}>
            Disclosure
          </a>
        </li>
        <li
          className="mr-2"
          onClick={() => {
            setIsActive(1);
            // setContent(data.data.json[1]);
            setHeading("Environmental");
          }}
        >
          <a href="#" className={isActive === 1 ? activeClass : inActiveClass}>
            Environmental
          </a>
        </li>
        <li
          className="mr-2"
          onClick={() => {
            setIsActive(2);
            // setContent(data.data.json[2]);
            setHeading("Social");
          }}
        >
          <a href="#" className={isActive === 2 ? activeClass : inActiveClass}>
            Social
          </a>
        </li>
        <li
          className="mr-2"
          onClick={() => {
            setIsActive(3);
            // setContent(data.data.json[3]);
            setHeading("Governance");
          }}
        >
          <a href="#" className={isActive === 3 ? activeClass : inActiveClass}>
            Governance
          </a>
        </li>
      </ul>
  
          {content  && isActive===0 && <Table tablecontent={content[0]} heading={heading}/>}
          {content  && isActive===1 && <Table tablecontent={content[1]} heading={heading}/>}
          {content  && isActive===2 && <Table tablecontent={content[2]} heading={heading}/>}
          {content  && isActive===3 && <Table tablecontent={content[3]} heading={heading}/>}

          {/* {content && <Table content={content} heading={heading} />} */}
    </div>
  );
}

export default App;

// class="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
// class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
