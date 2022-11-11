import React from 'react'

function PageTitle2(props:any) {
    return (
        <div className='flex flex-col'>
            <div className='text-normaltitle font-bold w-full text-center'>
                { props.title }
            </div>
            <div className='text-tinytext text-gray-500 my-1 w-full text-center'>
                Input { props.sectitle } details
            </div>
            <div className='text-smalltext flex whitespace-pre-wrap break-all w-full font-semibold text-gray-700'>
                <div className='text-red text-normal'>*</div> Required
            </div>
        </div>
)
}

export default PageTitle2