import React, { useState, useEffect } from 'react'
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";
import { FaSignOutAlt } from "@react-icons/all-files/fa/FaSignOutAlt";
import axios, {AxiosResponse} from 'axios'
import { useRouter } from 'next/router';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import { useMsal } from "@azure/msal-react";
import {io} from 'socket.io-client'

function Navbar() {
    const router = useRouter()
    const [hamburger, setHamburger] = useState('hidden')
    const [user, setUser] = useState()
    const [role, setRole] = useState('')
    const { instance } = useMsal();
    // const socket = io('http://localhost:8000')

    // socket.on('connect', () => {
    //     console.log(socket.id)
    // })

    useEffect(() => {
        if(getCookie('ROLE') == 'STAFF') {
            fetch(process.env.BASE_URL + '/staff/me', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                },
                method: 'GET'
            }).then((res) => res.json()).then(data => setUser(data))
        } else {
            fetch(process.env.BASE_URL + '/user/me', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                },
                method: 'GET'
            }).then((res) => res.json()).then(data => setUser(data))
        }
    }, [])

    useEffect(() => {
        // socket.emit('user-online', {id: user?.id})
    }, [user])

    function hamburgerHandler(){
        if(hamburger === 'hidden'){
            setHamburger('block')
        } else {
            setHamburger('hidden')
        }
    }

    async function logoutHandler(){
        if(getCookie("ACCESS_TOKEN") != undefined) {
            if(getCookie('ROLE') != 'SITE SUPERVISOR') {
                const response = await axios.get(process.env.BASE_URL+'/auth/logout?access_token='+getCookie("ACCESS_TOKEN"), {
                    headers: {
                        "Authorization": "Bearer "+getCookie("ACCESS_TOKEN")
                    }
                })
                .catch((err) => console.log(err.response))
    
                deleteCookie("ACCESS_TOKEN")
                deleteCookie("REFRESH_TOKEN")
                deleteCookie('ROLE')
                window.localStorage.removeItem('ROLE')
    
                await instance.logoutRedirect();
            } else {
                deleteCookie("ACCESS_TOKEN")
                deleteCookie("REFRESH_TOKEN")
                deleteCookie('ROLE')
                window.localStorage.removeItem('ROLE')
            }
            
            await router.push('/')
        }
    } 

    useEffect(() => {
        const cookie:any = getCookie('ROLE')
        setRole(cookie)
    }, [])

    return (
        <div className='border-y flex lg:flex-row sm:flex-col items-center justify-center sticky top-0 z-20 bg-white'>
            <div id='hamburger' onClick={hamburgerHandler} className='p-4 text-smalltitle text-secblack font-bold hover:cursor-pointer hover:text-blue duration-150 lg:hidden border-b w-full sm:flex'>
                <GiHamburgerMenu />
            </div>
            <div className={`flex sm:w-full lg:max-w-screen-xl justify-between items-center sm:flex-col lg:flex-row sm:items-start`}>
                {
                    role === 'STAFF' ?
                    <div id='menu' className='flex sm:flex-col lg:flex-row sm:justify-start sm:items-start animate-drop-down'>
                        <div className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold duration-150`}>
                            <a href={'/home'} className='hover:cursor-pointer hover:text-blue'>
                                Home
                            </a>
                        </div>
                        <div className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold duration-150`}>
                            <a href={'/chat'} className='hover:cursor-pointer hover:text-blue'>
                                Chat
                            </a>
                        </div>
                        <div className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold duration-150`}>
                            <a href={'/rating'} className='hover:cursor-pointer hover:text-blue'>
                                Rating
                            </a> 
                        </div>
                        <div className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold duration-150`}>
                            <a href={'/manage-meeting'} className='hover:cursor-pointer hover:text-blue'>
                                Manage Meeting
                            </a> 
                        </div>
                        <div className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold duration-150`}>
                            <a href={'/manage-category-faq'} className='hover:cursor-pointer hover:text-blue'>
                                Manage Category & FAQ
                            </a>
                        </div>
                    </div> :
                    <div id='menu' className='flex sm:flex-col lg:flex-row sm:justify-start sm:items-start animate-drop-down'>
                        <div className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold duration-150`}>
                            <a href={'/home'} className='hover:cursor-pointer hover:text-blue'>
                                Home
                            </a>
                        </div>
                        <div className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold duration-150`}>
                            <a href={'/contact'} className='hover:cursor-pointer hover:text-blue'>
                                Contact Us
                            </a>
                        </div>
                        <div className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold duration-150`}>
                            <a href={'/meeting'} className='hover:cursor-pointer hover:text-blue'>
                                Meeting
                            </a> 
                        </div>
                    </div>
                }
                <div className={`sm:${hamburger} lg:block `} onClick={logoutHandler}>
                    <div className='flex items-center sub-menu p-4 text-normal sm:text-smalltext sm:py-3.5 text-secblack font-bold hover:cursor-pointer hover:text-blue duration-150'>
                        <FaSignOutAlt className='text-smalltitle mr-1.5' /> 
                        <div>
                            Log Out
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar