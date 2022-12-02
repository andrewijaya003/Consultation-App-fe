import React, { useState, useEffect } from 'react'
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";
import { FaSignOutAlt } from "@react-icons/all-files/fa/FaSignOutAlt";
import axios, {AxiosResponse} from 'axios'
import { useRouter } from 'next/router';
import { deleteCookie, getCookie } from 'cookies-next';

function Navbar() {
    const router = useRouter()
    const [hamburger, setHamburger] = useState('hidden')
    const [user, setUser] = useState()

    function hamburgerHandler(){
        if(hamburger === 'hidden'){
            setHamburger('block')
        } else {
            setHamburger('hidden')
        }
    }

    async function logoutHandler(){
        if(getCookie("ACCESS_TOKEN") != undefined) {
            const response = await axios.get(process.env.BASE_URL+'/auth/logout?access_token='+getCookie("ACCESS_TOKEN"), {
                headers: {
                    "Authorization": "Bearer "+getCookie("ACCESS_TOKEN")
                }
            })
            .catch((err) => console.log(err.response))

            deleteCookie("ACCESS_TOKEN")
            deleteCookie("REFRESH_TOKEN")

            await router.push('/')
        }
    } 

    return (
        <div className='border-y flex lg:flex-row sm:flex-col items-center justify-center sticky top-0 z-20 bg-white'>
            <div id='hamburger' onClick={hamburgerHandler} className='p-4 text-smalltitle text-secblack font-bold hover:cursor-pointer hover:text-blue duration-150 lg:hidden border-b w-full sm:flex'>
                <GiHamburgerMenu />
            </div>
            <div className={`flex sm:w-full lg:max-w-screen-xl justify-between items-center sm:flex-col lg:flex-row sm:items-start`}>
                <div id='menu' className='flex sm:flex-col lg:flex-row sm:justify-start sm:items-start animate-drop-down'>
                    <a className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold hover:cursor-pointer hover:text-blue duration-150`} href={'/home'}>
                        Home
                    </a> 
                    <a className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold hover:cursor-pointer hover:text-blue duration-150`} href={'/chat'}>
                        Chat
                    </a> 
                    <a className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold hover:cursor-pointer hover:text-blue duration-150`} href={'/rating'}>
                        Rating
                    </a> 
                    <a className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold hover:cursor-pointer hover:text-blue duration-150`} href={'/manage-meeting'}>
                        Manage Meeting
                    </a>
                    <a className={`sub-menu p-4 text-normal sm:text-smalltext sm:${hamburger} lg:block sm:py-3.5 text-secblack font-bold hover:cursor-pointer hover:text-blue duration-150`} href={'/manage-category-faq'}>
                        Manage Category & FAQ
                    </a> 
                </div>
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