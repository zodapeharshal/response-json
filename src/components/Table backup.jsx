import React from 'react'
import { useState } from 'react'

const Table = ({content, heading}) => {

    // console.log(content)
    const [open, setOpen] = useState("")

    const subheader = (child) => {
        console.log(child)

        if(!child){
            return;
        }

        // {child.map((obj)=>{
        //     return <>
        //     <tbody onClick={()=>{setOpen(obj.name)}} className="divide-y divide-gray-100 ">
        //         <tr className="bg-white justify-center">
        //             <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        //                 {obj.title || obj.name}
        //             </td>
        //             {obj.columns && obj.columns.map((item)=>
        //                 <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        //                     {item.value? item.value : ""}
        //                 </td>
        //             )}
        //         </tr>
        //     </tbody>

        //     {obj.subheaders && subheader(obj.subheaders)}
        //     </>
        // })}

        for(let i=0; i< child.length; i++ ){
            return (
                <>
                    <tbody onClick={()=>{setOpen(child[i].name)}} className="divide-y divide-gray-100 ">
                        <tr className="bg-white justify-center">
                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                {child[i].title || child[i].name}
                            </td>
                            {child[i].columns && child[i].columns.map((item)=>
                                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                    {typeof(item.value)==="object"? " " : item.value}
                                </td>
                            )}
                        </tr>
                    </tbody>
                    {child[i].subheaders && child[i].subheaders.length>0 && subheader(child[i].subheaders)}
                </>
            )
        }
    }

  return (
    <div className="overflow-auto rounded-lg mt-12 shadow block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                  {heading}
                </th>
                {content[0].columnheaders.map((item)=>
                    <th key={item} className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                        {item}
                    </th>
                )}
              </tr>
            </thead>

            {content.map((item)=>( item.heading === heading &&
                subheader(item.children)
            ))}

            {/* {subheader()} */}
            

            {/* {items.map((item,i) => (
              <tbody className="divide-y divide-gray-100 ">
                <tr className="bg-white justify-center">
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {i + 1}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <img src={item.image} alt={item.name} className="h-[6rem] object-cover rounded-full" />
                  </td>
                  <td className="p-3 text-md font-semibold text-gray-700 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {item.type}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {item.sold}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {item.price}
                  </td>
                </tr>
              </tbody>
            ))} */}
          </table>
          {/* {buisnessDetails.jobsAdded.length===0?<div className="text-center my-4">You have not yet posted any Job</div>:<></>} */}
        </div>
  )
}

export default Table