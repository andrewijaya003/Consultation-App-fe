import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation';

function Header() {
    const [date, setDate] = useState<Date>()
    const moment = require('moment')
    const [user, setUser] = useState({})
    const refreshToken = getCookie('REFRESH_TOKEN')
    const [check, setCheck] = useState(0)
    const router = useRouter()

    useEffect(() => {
        setDate(moment(new Date()))
0
        const interval = setInterval(() => {
            setDate(moment(new Date()))
        }, 3600000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const id = setInterval(() => {
            if(refreshToken != undefined) {
                const data = fetch(process.env.BASE_URL + '/auth/refresh-token', {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        refresh_token: refreshToken
                    })
                }).then(res => res.json()).then((d) => {
                    if(d.statusCode >= 400) {
                        deleteCookie('ACCESS_TOKEN')
                        deleteCookie('REFRESH_TOKEN')
                        deleteCookie('ROLE')
                        router.push('/')
                    } else {
                        setCookie('ACCESS_TOKEN', d.access_token)
                    }
                })
            }
            setCheck(check + 1)
        }, 3000);
        return () => clearInterval(id);
    }, [check])

    useEffect(() => {
        fetch(process.env.BASE_URL+`/${getCookie('ROLE') === 'STAFF' ? 'staff' : 'user'}/me`, {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                "Content-Type" : "application/json"
            },
            method: 'GET'
        }).then(
            res => res.json()
        ).then((data) => {
            setUser(data)
        })
    }, [])

    return (
        <div className='max-w-screen-xl w-full flex justify-between items-center px-4 pb-5 ml-auto mr-auto'>
            <div className='flex lg:items-center sm:items-start'>
                <img
                    src="https://enrichment.apps.binus.ac.id/lib/css/themes/university/images/login/ribbon.png"
                    alt=""
                />
                <img
                    className="md:ml-5 md:w-full sm:w-20 sm:ml-3 mt-1"
                    src="https://enrichment.apps.binus.ac.id/images/logo.png?v=l1ZdBpJPPzprQVWBvPBwaSmiI7wYiBCjgdBuHozyxuI"
                    alt=""
                />
            </div>
            <div className='flex flex-col items-end'>
                <div className='flex-col flex'>
                    <div className='text-end text-smalltext font-bold text-secblack'>
                        <TypeAnimation
                            sequence={[
                                'Welcome',
                                2000,
                                'Selamat Datang',
                                2000,
                                'いらっしゃいませ',
                                2000,
                                'Herzlich willkommen',
                                2000,
                                '어서 오십시오',
                                2000,
                                'Bienvenue',
                                2000,
                                '欢迎',
                                2000,
                                'Welkom',
                                2000,
                                'Sugeng rawuh',
                                2000,
                                'Benarrivata',
                                2000,
                            ]}
                            wrapper="div"
                            speed={20}
                            cursor={true}
                            repeat={Infinity}
                        />
                    </div>
                    <div className='text-end sm:text-normal lg:text-smalltitle font-bold text-blue ml-1.5'>
                        { user.name }
                    </div>
                </div>
                <div className='flex justify-end'>
                    <div className='text-end sm:text-smalltext lg:text-normal text-secblack drop-shadow-sm border border-gray-300 rounded-md px-3 py-1 mt-2.5 cursor-default'>
                        { date?.format('MMMM Do YYYY, h:mm:ss A') }
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(){
    return {
        props: {
            date: new Date()
        }
    }
}

export default Header