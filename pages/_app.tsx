import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SkeletonTheme } from 'react-loading-skeleton'
import Header from '../components/Layout/Header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../components/Layout/Footer'
import Navbar from '../components/Layout/Navbar'
import { SWRConfig } from 'swr'
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../config/msal";

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const [showChild, setShowChild] = useState(false)

    useEffect(() => {
        setShowChild(true)
    }, [])

    if (!showChild) {
        return null
    }

    return (
        // <SWRConfig value={{dedupingInterval: 1000}}>
        <MsalProvider instance={msalInstance}>
            <div className='font-mont bg-white text-secblack'>
                { router.pathname === '/' ? <></> : <Header /> }
                { router.pathname === '/' ? <></> : <Navbar /> }
                <Component {...pageProps} />
                { router.pathname === '/' ? <></> : <Footer /> }
            </div>
        </MsalProvider>
        // </SWRConfig>
    )
}

export default MyApp
