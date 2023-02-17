import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SkeletonTheme } from 'react-loading-skeleton'
import Header from '../components/Layout/Header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../components/Layout/Footer'
import Navbar from '../components/Layout/Navbar'
import useSWR, { SWRConfig } from 'swr'
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../config/msal";
import { getCookie, setCookie } from 'cookies-next'
import { NextRequest, NextResponse } from 'next/server'

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const [showChild, setShowChild] = useState(false)
    const token = getCookie('ACCESS_TOKEN')
    // const {data, mutate} = useSWR('', () => fetch(process.env.BASE_URL + '/auth/refresh-token', {
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     method: 'POST',
    //     body: JSON.stringify({
    //         refresh_token: refreshToken
    //     })
    // }).then(data => data.json()))

    // useEffect(() => {
    //     if(data) {
    //         if(new Date() == data.at_expire) {
    //             console.log('32')
    //             mutate()
    //         }
    //     }
    // }, [new Date()])

    // useEffect(() => {
    //     if(data) {
    //         console.log('40')
    //         setCookie('ACCESS_TOKEN', data.access_token)
    //     }
    // }, [data])

    // useEffect(() => {
    //     console.log('123')
    //     if(refreshToken != undefined) {
    //         console.log('asd')
    //         const data = fetch(process.env.BASE_URL + '/auth/refresh-token', {
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 refresh_token: refreshToken
    //             })
    //         }).then(data => data.json())
            
    //         setCookie('ACCESS_TOKEN', data.access_token)
    //     }
    // })

    useEffect(() => {
        if(token == '' || token == undefined || token == null) {
            router.push('/')
        }
    }, [token])

    useEffect(() => {
        setShowChild(true)
    }, [])

    if (!showChild) {
        return null
    }

    function isValidPage() {
        return router.pathname !== '/' && router.pathname !== '/LoginAD' && router.pathname !== '/404'
    }

    return (
        // <SWRConfig value={{dedupingInterval: 1000}}>
        <MsalProvider instance={msalInstance}>
            <div className='font-mont bg-white text-secblack'>
                { isValidPage() && <Header /> }
                { isValidPage() && <Navbar /> }
                <Component {...pageProps} />
                { isValidPage() && <Footer /> }
            </div>
        </MsalProvider>
        // </SWRConfig>
    )
}

export default MyApp


