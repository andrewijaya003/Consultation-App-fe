import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MultiSelect } from 'react-multi-select-component'
import AlertError from '../AlertError'
import LabelInput from '../LabelInput'
import PageTitle2 from '../PageTitle2'

function AnnouncementEditPopup(props:any) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [option, setOption] = useState([
        {label:'FS',value:'FS'},
        {label:'SS',value:'SS'},
        {label:'STUDENT',value:'STUDENT'}
    ])
    const [roles, setRoles] = useState([])

    useEffect(() => {
        // setTitle('')
        // setDescription('')
        // setImage('')
        // setErrorMsg('')
        // setRoles([])
    }, [props.edit])

    useEffect(() => {
        if(props.announcement != undefined) {
            setTitle(props.announcement.title)
            setDescription(props.announcement.description)
            setImage(props.announcement.file)
        }
    }, [props.announcement])

    async function editAnnouncementHandler() {
        if(title == '') {
            setErrorMsg('Title must be filled')
        } else if(description == '') {
            setErrorMsg('Description must be filled')
        } else if(roles.length == 0) {
            setErrorMsg('Role must be choosen')
        }

        if(title !== '' && description !== '') {
            let announcement = new FormData()
            announcement.append('id', props.announcement.id)
            announcement.append('title', title)
            announcement.append('description', description)
            announcement.append('file', image)
            roles.map((role:any) => (
                announcement.append('target[]', role.value)
            ))
            
            await fetch(process.env.BASE_URL + '/announcement', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                },
                method: 'PUT',
                body: announcement
            }).then(res => res.json()).then(props.refetch)
        }       
    }

    return (
        props.edit ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <div className='px-4'>
                    <PageTitle2 title='Update Announcement' sectitle='announcement' />
                </div>
                <form className='flex flex-col mt-6 max-h-[420px] display-scrollbar px-4'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='title' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Title <div className='text-red'>*</div>
                        </label>
                        <input value={title} name='title' id='title' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setTitle(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Desription <div className='text-red'>*</div>
                        </label>
                        <textarea value={description} name='description' id='description' maxLength='500' rows="8" className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='image' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Image <div className='text-red'></div>
                        </label>
                        <label htmlFor='image' className="w-full flex items-center border border-gray-300 rounded-md">
                            <div className='w-[100px] text-center text-sm bg-gray-200 px-3 py-2 mr-2'>Choose File</div>
                            <div className='w-10/12 h-full cursor-pointer text-sm rounded-md bg-white whitespace-nowrap overflow-x-auto z-10'>{image != null ? image.name : 'No File Chosen'}</div>
                            <input id='image' className="w-0 cursor-pointer text-sm rounded-md  bg-white file:border-0" aria-describedby="user_avatar_help" type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </label>
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Role <div className='text-red'>*</div>
                        </label>
                        <MultiSelect
                            options={option}
                            value={roles}
                            onChange={setRoles}
                            labelledBy="Please select role"
                        />
                    </div>
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2 border-t-2 border-secblack'>
                        <input type="button" value='Update' className='bg-blue text-white text-normal mt-2 font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={editAnnouncementHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default AnnouncementEditPopup