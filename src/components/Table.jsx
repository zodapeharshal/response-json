import React, { Children } from 'react'
import { useState } from 'react'

const Table = ({ content, heading }) => {

  // console.log(content)
  const [open, setOpen] = useState("")

  const Children = ({child}) => {
    return child.map(data => {
      return (
        <>
          <tbody onClick={() => { setOpen(child.name) }} className="divide-y divide-gray-100 ">
            <tr className="bg-white justify-center">
              <td className="pl-5 text-sm text-gray-700 whitespace-nowrap">
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
          {data && data.subheaders && <Children child = {data.subheaders}></Children>}
        </>
      )
    })
  }

  const Subheader = ({parent}) => {
      return (
        <>
          <tbody onClick={() => { setOpen(parent.name) }} className="divide-y divide-gray-100 ">
            <tr className="bg-white justify-center">
              <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                {/* {(parent) ? parent.title : parent.name} */}
                {parent && (parent.title || parent.name)}
              </td>
              {parent && parent.columns && parent.columns.map((item)=>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {item.value}
                </td>
              )}
            </tr>
          </tbody>
          <div>
            {parent && parent.subheaders && <Children child = {parent.subheaders}></Children>}
          </div>
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

