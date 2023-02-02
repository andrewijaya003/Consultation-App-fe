import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import AlertLoading from '../components/AlertLoading'
import MeetingAddPopup from '../components/Meeting/MeetingAddPopup'
import MeetingList from '../components/Meeting/MeetingList'

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function ManageMeeting() {
    const [add, setAdd] = useState(false)
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [endpoint, setEndpoint] = useState(process.env.BASE_URL+'/meeting')
    const {data, mutate} = useSWR(endpoint, fetcher)

    const refetch = async () => {
        await mutate()
        setAdd(false)
    }

    const compareDates = (d1:any, d2:any) => {
        let date1 = new Date(d1).getTime()
        let date2 = new Date(d2).getTime()

        if (date1 < date2) {
            return 1
        } else if (date1 > date2) {
            return -1
        } else {
            return 0
        }
    }

    function addHandler(){
        setAdd(true)
    }

    function startHandler(value:any){
        setStart(value)
    }

    function endHandler(value:any){
        setEnd(value)
    }

    function resetHandler(){
        setStart('')
        setEnd('')
        if(start !== '' && end !== '') {
            if(getCookie('ROLE') === 'STAFF') {
                fetch(process.env.BASE_URL+'/meeting', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    },
                    method: 'GET',
                }).then(
                    res => res.json()
                ).then(data => {
                    mutate(data, false)
                })
            } else {
                fetch(process.env.BASE_URL+`/${getCookie('ROLE') === 'STAFF' ? 'staff' : 'user'}/me`, {
                    headers : { 
                        'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                        "Content-Type" : "application/json"
                    },
                    method: 'GET'
                }).then(
                    res => res.json()
                ).then((data) => {
                    // setUser(data)
                    fetch(process.env.BASE_URL+'/meeting/user', {
                        headers: {
                            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                            "Content-Type" : "application/json"
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            userId: data.id
                        })
                    }).then(
                        res => res.json()
                    ).then(data => {
                        mutate(data, false)
                    })
                }).catch(err => console.log(err))
            }
        }
    }

    useEffect(() => {
        if(start !== '' && end !== '') {
            if(compareDates(start, end) < 0) {
                setEnd(start)
            } else {
                fetch(process.env.BASE_URL+'/meeting/range', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        "Content-Type" : "application/json"
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        start: start,
                        end: end
                    })
                }).then(
                    res => res.json()
                ).then(data => {
                    mutate(data, false)
                })
            }
        }
    }, [start, end])

    useEffect(() => {
        if(getCookie('ROLE') === 'STAFF') {
            fetch(process.env.BASE_URL+'/meeting', {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                },
                method: 'GET',
            }).then(
                res => res.json()
            ).then(data => {
                mutate(data, false)
            })
        } else {
            fetch(process.env.BASE_URL+`/${getCookie('ROLE') === 'STAFF' ? 'staff' : 'user'}/me`, {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    "Content-Type" : "application/json"
                },
                method: 'GET'
            }).then(
                res => res.json()
            ).then((data) => {
                // setUser(data)
                fetch(process.env.BASE_URL+'/meeting/user', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        "Content-Type" : "application/json"
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        userId: data.id
                    })
                }).then(
                    res => res.json()
                ).then(data => {
                    mutate(data, false)
                })
            }).catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <div className='max-w-screen-xl w-full px-4 py-5 flex flex-col ml-auto mr-auto'>
            {/* PageTitle Start */}
            <div className='flex flex-col w-full mb-6 text-secblack'>
                <div className='flex flex-wrap w-full justify-between items-center'>
                    <div className='flex flex-col'>
                        <div className='text-normaltitle font-bold'>
                            Meetings
                        </div>
                        <div className='h-0.5 bg-secblack my-2'></div>
                    </div>
                    {
                        getCookie('ROLE') === 'STAFF' ? 
                        <div className='flex justify-end' onClick={addHandler}>
                            <input type="submit" value='Insert Meeting' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                        </div> : <></>
                    }
                </div>
                <div className='flex lg:flex-row flex-col lg:items-center w-full mt-5'>
                    <div className="max-w-sm w-full">
                        <div className="relative">
                            <input
                                type="date"
                                id="search"
                                className="block px-2.5 py-2 w-full text-smalltext text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                                placeholder=" "
                                value={start}
                                onChange={(e) => startHandler(e.target.value)}
                            />
                            <label
                                htmlFor="search"
                                className="absolute text-smalltext text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                            >
                                Start date
                            </label>
                        </div>
                    </div>
                    <div className="max-w-sm w-full lg:mx-5 lg:my-0 sm:my-6 sm:mx-0">
                        <div className="relative">
                            <input
                                type="date"
                                id="search"
                                className="block px-2.5 py-2 w-full text-smalltext text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                                placeholder=" "
                                value={end}
                                onChange={(e) => endHandler(e.target.value)}
                            />
                            <label
                                htmlFor="search"
                                className="absolute text-smalltext text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                            >
                                End date
                            </label>
                        </div>
                    </div>
                    <input type="submit" value='Reset' onClick={resetHandler} className='lg:w-fit sm:max-w-sm sm:w-full bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                </div>
            </div>
            {/* PageTitle End */}
            {
                !data ? <AlertLoading title='meetings' /> : <MeetingList meetings={data} endpoint={endpoint} />
            }
            {
                getCookie('ROLE') === 'STAFF' ? <MeetingAddPopup add={add} onClose={() => setAdd(false)} refetch={refetch} /> : <></>
            }
        </div>
    )
}


export default ManageMeeting