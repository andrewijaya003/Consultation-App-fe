import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SkeletonTheme } from 'react-loading-skeleton'
import Header from '../components/Layout/Header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../components/Layout/Footer'
import Navbar from '../components/Layout/Navbar'

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()

    return (
        <div className='font-mont bg-white text-secblack'>
            <SkeletonTheme baseColor='#313131' highlightColor='#525252'>
                { router.pathname === '/' ? <></> : <Header /> }
                { router.pathname === '/' ? <></> : <Navbar /> }
                <Component {...pageProps} />
                { router.pathname === '/' ? <></> : <Footer /> }
            </SkeletonTheme>
        </div>
    )
}

export default MyApp
