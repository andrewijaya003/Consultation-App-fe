import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import AlertLoading from '../components/AlertLoading'
import CategoryAddPopup from '../components/Category/CategoryAddPopup'
import CategoryList from '../components/Category/CategoryList'
import PageTitle from '../components/PageTitle'

const DUMMY_CATEGORIES = [
    {
        id: "1",
        description: "Log Book",
        updatedBy: 'AD21-1',
        lastUpdate: '2022-10-30'
    },
    {
        id: "2",
        description: "Faculty Supervisor",
        updatedBy: 'AD21-1',
        lastUpdate: '2022-10-30'
    },
    {
        id: "3",
        description: "Site Supervisor",
        updatedBy: 'AD21-1',
        lastUpdate: '2022-10-30'
    },
    {
        id: "4",
        description: "Learning Plan",
        updatedBy: 'AD21-1',
        lastUpdate: '2022-10-30'
    },
    {
        id: "5",
        description: "Final Report",
        updatedBy: 'AD21-1',
        lastUpdate: '2022-10-30'
    }
]

const DUMMY_FAQS = [
    {
        id: '1',
        categoryId: '1',
        problem: 'Apakah log book bulan Agustus perlu di accept?',
        solution: 'Tidak harus di accept',
        lastUpdate: '2022-10-30',
        updatedBy: 'AD21-1'
    },
    {
        id: '2',
        categoryId: '1',
        problem: 'Log book harus diisi apa?',
        solution: 'Isi dengan kegiatan yang dilakukan ditanggal tersebut',
        lastUpdate: '2022-10-30',
        updatedBy: 'AD21-1'
    },
    {
        id: '3',
        categoryId: '2',
        problem: 'Faculty supervisor tidak bisa dihubungi melalu email dan WA?',
        solution: 'Kami akan coba follow up kepada FS anda untuk segera menghubungi anda',
        lastUpdate: '2022-10-30',
        updatedBy: 'AD21-1'
    },
    {
        id: '4',
        categoryId: '3',
        problem: 'Apakah site supervisor tidak bisa login website partner?',
        solution: 'Kami akan bantu follow up ke tim IT untuk mereset aku SS, dimohon untuk mengecek secara berkala',
        lastUpdate: '2022-10-30',
        updatedBy: 'AD21-1'
    },
    {
        id: '5',
        categoryId: '5',
        problem: 'Final report belum diaccept?',
        solution: 'Coba terus follow up ke dosen kamu, jika sudah difollow up tapi belu dibalas kami sekarang sudah bantu follow up ke dosennya.',
        lastUpdate: '2022-10-30',
        updatedBy: 'AD21-1'
    }
]

function ManageCategory(props:any) {
    const [add, setAdd] = useState(false)
    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    function addHandler(){
        setAdd(true)
    }

    function searchHandler(value:string){
        setSearch(value)
    }

    useEffect(() => {
        setLoading(true)
        fetch(process.env.BASE_URL+'/category', {
            headers: {
                'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
            },
            method: 'GET',
        }).then(
            res => res.json()
        ).then(data => {
            setCategories(data)
            setLoading(false)
        })
    }, [])

    return (
        <>
            <div className='max-w-screen-xl w-full px-4 py-5 flex flex-col ml-auto mr-auto'>
                {/* PageTitle Start */}
                <div className='flex flex-col w-full mb-6 text-secblack'>
                    <div className='flex flex-wrap sm: w-full justify-between items-center'>
                        <div className='flex flex-col'>
                            <div className='text-normaltitle font-bold'>
                                Categories
                            </div>
                            <div className='h-0.5 bg-secblack my-2'></div>
                        </div>
                        <div className='flex justify-end' onClick={addHandler}>
                            <input type="submit" value='Add New Category' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                        </div>
                    </div>
                    <div className="max-w-sm mt-3">
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                className="block px-2.5 py-2 w-full text-smalltext text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                                placeholder=" "
                                onChange={(e) => searchHandler(e.target.value)}
                            />
                            <label
                                htmlFor="search"
                                className="absolute text-smalltext text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                            >
                                Search category
                            </label>
                        </div>
                    </div>
                </div>
                {/* PageTitle End */}
                {
                    loading ? <AlertLoading title='categories' /> : <CategoryList categories={categories} />
                }
                <CategoryAddPopup add={add} onClose={() => setAdd(false)} />
            </div>
        </>
    )
}


export default ManageCategory