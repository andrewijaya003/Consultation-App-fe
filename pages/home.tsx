import axios from 'axios';
import { useEffect, useState } from 'react';
import AnnouncementAddPopup from '../components/Announcement/AnnouncementAddPopup';
import AnnouncementList from '../components/Announcement/AnnouncementList';
import { getCookie } from 'cookies-next';
import * as cookie from 'cookie';
import { useRouter } from 'next/router';
import AlertLoading from '../components/AlertLoading';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

const fetcherAll = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function Home() {
    const [add, setAdd] = useState(false)
    const [search, setSearch] = useState('')
    const [endpointAnnouncementAll, setEndpointAnnouncementAll] = useState(process.env.BASE_URL+'/announcement')
    const {data:announcementAll, mutate:announcementAllMutate} = useSWR(endpointAnnouncementAll, fetcherAll)
    const [bounceSearch] = useDebounce(search, 1000)

    // useEffect(() => {
    //     console.log(announcementAll)
    // }, [announcementAll])

    const refetch = async () => {
        await announcementAllMutate()
        setAdd(false)
    }

    useEffect(() => {
        if(bounceSearch != '') {
            setEndpointAnnouncementAll(process.env.BASE_URL+'/announcement/search/'+bounceSearch)
            announcementAllMutate()
        } else {
            setEndpointAnnouncementAll(process.env.BASE_URL+'/announcement')
            announcementAllMutate()
        }
    }, [bounceSearch])

    return (
        <div className='max-w-screen-xl w-full px-4 py-5 flex flex-col ml-auto mr-auto'>
            {/* PageTitle Start */}
            <div className='flex flex-col w-full mb-6 text-secblack'>
                <div className='flex flex-wrap w-full justify-between items-center'>
                    <div className='flex flex-col'>
                        <div className='text-normaltitle font-bold'>
                            Announcements
                        </div>
                        <div className='h-0.5 bg-secblack my-2'></div>
                    </div>
                    {
                        getCookie('ROLE') === 'STAFF' ? 
                        <div className='flex justify-end' onClick={() => setAdd(true)}>
                            <input type="submit" value='Add New Announcement' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                        </div> : <></>
                    }
                </div>
                <div className="max-w-sm mt-3">
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            className="block px-2.5 py-2 w-full text-smalltext text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                            placeholder=" "
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <label
                            htmlFor="search"
                            className="absolute text-smalltext text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                        >
                            Search announcement
                        </label>
                    </div>
                </div>
            </div>
            {/* PageTitle End */}
            {
                !announcementAll ? 
                <AlertLoading title='announcements' /> 
                : 
                <AnnouncementList announcements={announcementAll} endpoint={endpointAnnouncementAll} />
            }
            {
                getCookie('ROLE') === 'STAFF' ? <AnnouncementAddPopup add={add} onClose={() => setAdd(false)} refetch={refetch} /> : <></>
            }
        </div>
    )
}

export default Home