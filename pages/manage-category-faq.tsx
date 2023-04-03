import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'
import AlertLoading from '../components/AlertLoading'
import CategoryAddPopup from '../components/Category/CategoryAddPopup'
import CategoryList from '../components/Category/CategoryList'
import { mutate } from 'swr'

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function ManageCategory(props:any) {
    const [add, setAdd] = useState(false)
    const [search, setSearch] = useState('')
    const [endpoint, setEndpoint] = useState(process.env.BASE_URL+'/category')
    // const {data, mutate} = useSWR(endpoint, fetcher)
    // const [data, setData] = useState()
    const [bounceSearch] = useDebounce(search, 1000)

    // async function fetchCategory() {
    //     await fetch(process.env.BASE_URL+'/category', {
    //         headers: {
    //             'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
    //         },
    //         method: 'GET'
    //     }).then(res => res.json()).then((d) => setData(d))
    // }

    // async function fetchCategorySearch() {
    //     await fetch(process.env.BASE_URL+'/category/search/'+bounceSearch, {
    //         headers: {
    //             'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
    //         },
    //         method: 'GET'
    //     }).then(res => res.json()).then((d) => setData(d))
    // }

    const refetch = async (categoryId:string) => {
        await mutate(process.env.BASE_URL+'/category')
        await mutate(process.env.BASE_URL+'/faq/faq-by-category/'+categoryId)
        setAdd(false)
    }

    function addHandler(){
        setAdd(true)
    }

    function searchHandler(value:string){
        setSearch(value)
    }

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
                            <input type="submit" value='Insert Category' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
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
                <CategoryList bounceSearch={bounceSearch} />
                <CategoryAddPopup add={add} onClose={() => setAdd(false)} refetch={refetch} />
            </div>
        </>
    )
}


export default ManageCategory