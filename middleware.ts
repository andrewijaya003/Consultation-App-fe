import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { NextRequest, NextResponse } from "next/server";
import { useState } from "react";
import nextSession from "next-session";

export async function middleware(request:NextRequest) {
    let token = request.cookies.get('ACCESS_TOKEN')
    let refreshToken = request.cookies.get('REFRESH_TOKEN')
    let { pathname } = request.nextUrl

    const data = await fetch(process.env.BASE_URL + '/auth/refresh-token', {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            refresh_token: refreshToken
        })
    }).then(data => data.json())
	token = data.access_token

    if(data.access_token != undefined){
		const response = NextResponse.next()
        response.cookies.set('ACCESS_TOKEN', data.access_token)
        
		if((pathname == '/' || pathname =='/LoginAD') && token != undefined) {
			request.nextUrl.pathname = '/home'
		} else if(request.cookies.get('ROLE') !== 'STAFF' && (pathname == '/chat' || pathname == '/rating' || pathname == '/manage-category-faq' || pathname == '/manage-meeting')) {
			request.nextUrl.pathname = '/404'
		} else if(request.cookies.get('ROLE') == 'STAFF' && (pathname == '/contact' || pathname == '/meeting')) {
			request.nextUrl.pathname = '/404'
		} else {
			return NextResponse.next()
		}
    } else {
        token = undefined
		if(!(pathname == '/' || pathname == '/LoginAD')) {
			request.nextUrl.pathname = '/'
		}
    }
	
	if(token == undefined && (pathname == '/' || pathname == '/LoginAD') && refreshToken == undefined) {
		return NextResponse.next()
	} 
	else if(token == undefined && refreshToken != undefined) {
		// request.nextUrl.pathname = request.nextUrl.pathname + '?clear=true'
		const response = NextResponse.next()
		response.cookies.set('CLEAR_SESSION_COOKIE', 'CLEAR')
		return response
	}

	const response = NextResponse.redirect(request.nextUrl)
	return response
}

export const config = {
	matcher: [
		'/((?!api|_next/static|favicon.ico).*)',
	],
}