import { NextRequest, NextResponse } from "next/server";

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
    if(data.access_token != undefined){
        token = data.access_token
    } else {
        token = undefined
    }

    if(pathname.startsWith("/_next")) {
        const response = NextResponse.next()
        if (token == undefined) {
            response.cookies.set('ACCESS_TOKEN', '', {maxAge: 0})
            response.cookies.set('REFRESH_TOKEN', '', {maxAge: 0})
        }

        return response;
    }

    if(pathname != '/' && token == undefined) {
        request.nextUrl.pathname = '/'
    } else if(pathname == '/' && token != undefined) {
        request.nextUrl.pathname = '/home'
    } else {
        return NextResponse.next()
    }

    const response = NextResponse.redirect(request.nextUrl)
    if (token == undefined) {
        response.cookies.delete('ACCESS_TOKEN')
    }

    return response;
}