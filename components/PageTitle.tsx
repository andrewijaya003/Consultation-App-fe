import React from 'react'

function PageTitle(props:any) {
    return (
        <div className='flex flex-col w-full mb-5 text-secblack'>
            <div className='flex w-full justify-between items-center'>
                <div className='flex flex-col'>
                    <div className='text-normaltitle font-bold'>
                        { props.title }
                    </div>
                    <div className='h-0.5 bg-secblack my-2'></div>
                </div>
                {/* {
                    props.value !== '' ?
                    <div className='flex justify-end'>
                        <input type="submit" value={props.value} className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                    :
                    <></>
                } */}
            </div>
        </div>
    )
}

export default PageTitle