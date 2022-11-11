import React from 'react'

function LabelInput(props:any) {
    return (
        <div className='flex flex-col mb-6'>
            <label htmlFor={ props.id } className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                { props.title } <div className='text-red'>{ props.star }</div> { props.ex }
            </label>
            { 
                // props.tag === 'date' ?
                // props.star !== '*' ?
                //     <input value={props.value} className="w-full cursor-pointer border border-gray-300 focus:ring-1 focus:border-blue text-sm rounded-md file:px-3 file:py-2 bg-white file:border-0" aria-describedby="user_avatar_help" id="user_avatar" type="date" />
                //     :
                //     <input value={props.value} className="w-full cursor-pointer border border-gray-300 focus:ring-1 focus:border-blue text-sm rounded-md file:px-3 file:py-2 bg-white file:border-0" aria-describedby="user_avatar_help" id="user_avatar" type="date" required />
                // :
                props.tag === 'file' ?
                props.star !== '*' ?
                    <div className="flex justify-center">
                        <input value={props.value} className="w-full cursor-pointer border border-gray-300 focus:ring-1 focus:border-blue text-sm rounded-md file:px-3 file:py-2 bg-white file:border-0" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
                    </div>
                    :
                    <div className="flex justify-center">
                        <input value={props.value} className="w-full cursor-pointer border border-gray-300 focus:ring-1 focus:border-blue text-sm rounded-md file:px-3 file:py-2 bg-white file:border-0" aria-describedby="user_avatar_help" id="user_avatar" type="file" required />
                    </div>
                :
                props.tag === 'input' ? 
                props.star === '*' ? 
                    <input value={props.value} name={ props.id } id={ props.id } type={ props.type } className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required /> 
                    :
                    <input value={props.value} name={ props.id } id={ props.id } type={ props.type } className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' /> 
                : 
                props.star === '*' ? 
                    <textarea value={props.value} name={ props.id } id={ props.id } maxLength='500' rows="8" className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required />
                    :
                    <textarea value={props.value} name={ props.id } id={ props.id } maxLength='500' rows="8" className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' />
            }
            
        </div>
    )
}

export default LabelInput