import { useEffect, useState } from 'react';
import data from "./thefile.json"
import './App.css';
import Table from './components/Table';

function App() {

  // console.log(data)
  const [content, setContent] = useState(null)
  const [heading, setHeading] = useState("")
  // console.log(heading)
 
  // console.log(content)
  function TreeNode({ node }) {
    return (
      <div>

        {typeof(node)!=="object" && <li>{node.value}</li>}

        {node && typeof(node)==="object" && node.map(childNode => (
          <TreeNode node={childNode} />
        ))}
        
      </div>
    );
  }

  //data.colums contains table heading
  //data.children.title  => accordion (dropdown)
  //childre->subheaders->subheaders...

  useEffect(()=>{
    setContent(data.data.json)
    setHeading(data.data.json[0].heading)
  },[])

  return (
    <div className=" mt-8">
      
      <div className='w-full items-center justify-center flex gap-8'>
        { content && content.map((item)=>(
          <div key={item.rowId} onClick={(e)=>{setHeading(item.heading)}} className="border border-gray-300 px-2 hover:cursor-pointer">
            <p>{item.heading}</p>
          </div>
        ))}
      </div>

      {content && <Table content={content} heading={heading}/>}

    </div>
  );
}

export default App;