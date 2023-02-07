import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { NextRequest, NextResponse } from "next/server";
import { useState } from "react";

export async function middleware(request:NextRequest) {
    let token = request.cookies.get('ACCESS_TOKEN')
    let refreshToken = request.cookies.get('REFRESH_TOKEN')
    let { pathname } = request.nextUrl
    // const microsoftIsAuthenticated = useIsAuthenticated();
	// const { instance, accounts } = useMsal();
	// const [graphData, setGraphData] = useState(null);

    const data = await fetch(process.env.BASE_URL + '/auth/refresh-token', {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            refresh_token: refreshToken
        })
    }).then(data => data.json())

    if(data.access_token != undefined){
        console.log(data.access_token)
        const response = NextResponse.next()
        response.cookies.set('ACCESS_TOKEN', data.access_token)
        token = data.access_token
        return response
    } else {
        token = undefined
    }

    if(pathname.startsWith("/_next")) {
        const response = NextResponse.next()
        if (token == undefined) {
            response.cookies.set('ACCESS_TOKEN', '', {maxAge: 0})
            response.cookies.set('REFRESH_TOKEN', '', {maxAge: 0})    
            response.cookies.set('ROLE', '', {maxAge: 0})
        }

        return response;
    }

    if(pathname != '/' && pathname != '/LoginAD' && token == undefined) {
        request.nextUrl.pathname = '/'
    } else if((pathname == '/' || pathname == '/LoginAD') &&  token != undefined) {
        request.nextUrl.pathname = '/home'
    } else if(request.cookies.get('ROLE') !== 'STAFF' && (pathname == '/chat' || pathname == '/rating' || pathname == '/manage-category-faq' || pathname == '/manage-meeting')) {
        request.nextUrl.pathname = '/404'
    } 
    else {
        return NextResponse.next()
    }

    const response = NextResponse.redirect(request.nextUrl)
    if (token == undefined) {
        response.cookies.set('ACCESS_TOKEN', '', {maxAge: 0})
        response.cookies.set('REFRESH_TOKEN', '', {maxAge: 0})    
        response.cookies.set('ROLE', '', {maxAge: 0})
        response.cookies.delete('ACCESS_TOKEN')
        request.nextUrl.pathname = '/'
    }

    return response;
}