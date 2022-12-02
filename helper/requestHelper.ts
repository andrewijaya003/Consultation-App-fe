import axios, {AxiosResponse} from 'axios'

type ErrorData = {
    statusCode: number;
    message: string
};

export async function requestHelper(req: () => Promise<AxiosResponse>): Promise<any>{
    const res = await req();

    if(res.status === 401){
        const errorData = res.data as ErrorData;
        if(errorData.message === "Token is expired"){
            //ambil token baru pakai refresh token

            const newTokenRes = await axios.post(process.env.BASE_URL + '/auth/refresh-token', JSON.stringify({
                refresh_token: window.localStorage.getItem("REFRESH_TOKEN")
            }));
            if(newTokenRes.status === 401){
                //refresh token expire, log out

            }else{
                //update access token
                window.localStorage.setItem("ACCESS_TOKEN", newTokenRes.data.access_token);
            }
        }
    }else{
        //kalau aman
        return res.data;
    }
}