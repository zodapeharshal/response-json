import React from 'react'
import { useState } from 'react'

const Table = ({ content, heading }) => {

  const [open, setOpen] = useState(null)
  const [child, setChild] = useState(null)
  const [nest, setNest] = useState(4)

  const Children = ({child}) => {
    return child.map(data => {
      return (
        <>
          <tbody onClick={() => { setChild(child===child.name? -1 : child.name); setNest(nest+4) }} className="divide-y bg-gray-500 divide-gray-100 ">
            <tr className="bg-white justify-center">
              <td className={`pl-5 text-sm bg-gray-300 text-gray-700 whitespace-nowrap`}>
                {/* {(nested.child) ? nested.child.title : nested.child.name} */}
                {data && data.name}
              </td>
              <>
                {data && data.columns.map(items => {
                  return (
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {typeof(items.value)==="object" ? "" : items.value }
                    </td>
                  )
                })}
              </>
            </tr>
          </tbody>
          {data && data.subheaders && child===child.name && <Children child = {data.subheaders}></Children>}
        </>
      )
    })
  }

  const Subheader = ({parent}) => {
      return (
        <>
          <tbody onClick={() => { setOpen(open===parent.title? -1 : parent.title) }} className="divide-y bg-gray-900 divide-gray-100 ">
            <tr className="bg-white justify-center">
              <td className="p-3 text-sm bg-gray-100 text-gray-700 whitespace-nowrap">
                {/* {(parent) ? parent.title : parent.name} */}
                {parent &&  (parent.title || parent.name)}
              </td>
              {parent && parent.columns && parent.columns.map((item)=>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {item.value}
                </td>
              )}
            </tr>
          </tbody>
            {parent && parent.subheaders && open===parent.title && <Children child = {parent.subheaders}></Children>}
        </>
      )
  }

  return (
    <div className="overflow-auto rounded-lg mt-12 shadow block">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
              {heading}
            </th>
            {content[0].columnheaders.map((item) =>
              <th key={item} className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                {item}
              </th>
            )}
          </tr>
        </thead>

        {console.log(content)}
        {
          content && content.map(data => {
            if(data.heading === heading){
              return data.children.map((parent)=><Subheader parent = {parent} />) 
            }
          })
        }

      </table>
    </div>
  )
}

export default Table