import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AlertError from '../AlertError'
import LabelInput from '../LabelInput'
import PageTitle2 from '../PageTitle2'

function CategoryAddPopup(props:any) {
    const [description, setDescription] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        setErrorMsg('')
    }, [props.add])
    

    async function addCategoryHandler() {
        if(description === '') {
            setErrorMsg('Description must be filled')
        }

        if(description !== '') {
            await fetch(process.env.BASE_URL + '/category', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    category: description
                })
            }).then(res => res.json()).then((data) => props.refetch(data.id))
        }
    }
    
    return (
        props.add ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <div className='px-4'>
                    <PageTitle2 title='Insert Category' sectitle='category' />
                </div>
                <form className='flex flex-col mt-6 max-h-[420px] display-scrollbar px-4'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Description <div className='text-red'>*</div>
                        </label>
                        <input name='description' id='description' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setDescription(e.target.value)} /> 
                    </div>
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2'>
                        <input type="button" value='Insert' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={addCategoryHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default CategoryAddPopup