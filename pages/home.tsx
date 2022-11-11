import Link from 'next/link';
import { useEffect, useState } from 'react';
import AnnouncementAddPopup from '../components/Announcement/AnnouncementAddPopup';
import AnnouncementList from '../components/Announcement/AnnouncementList';
import PageTitle from '../components/PageTitle';

const DUMMY_ANNOUNCEMENTS = [
    {
        id: '1',
        title: 'Link Video Based Learning (VBL)',
        description: 
        `Dear All,

Here's the Link for the Video Based Learning (VBL):
https://bit.ly/vbl-slc-share

Please only share the Video Based Learning (VBL) link related to the subjects you taught in the class

If you have any problems/questions, please contact Subject Development Officer (RX/GU/JH)

Thank you 😄`,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Go_Logo_Blue.svg/215px-Go_Logo_Blue.svg.png',
        updatedBy: "AD21-1",
        lastUpdate: '2022-10-20'
    },
    {
        id: '2',
        title: 'Link for Post Training Recording',
        description: 
        `Dear All,

Here's the Link for the Post Training Recording:
https://binusianorg-my.sharepoint.com/personal/academic_slc_binus_edu/_layouts/15/guestaccess.aspx?guestaccesstoken=dpMAmnzJIBPHrGGU6qQ%2FeKrVLpWqWGe2ghAoGUxQoHc%3D&folderid=2_01ef320de695a47748979f315bc765aef&rev=1&e=rgl3wu

*Notes: For Assistant Only
If you have any questions, please contact LT / FS.

Thank you :D`,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Next.js_Logotype_Light_Background.svg/120px-Next.js_Logotype_Light_Background.svg.png',
        updatedBy: "AD21-1",
        lastUpdate: '2022-10-20'
    }
]

function Home(props:any) {
    const [add, setAdd] = useState(false)
    const [announcements, setAnnouncements] = useState(props.announcements)
    const [search, setSearch] = useState('')

    function addHandler(){
        setAdd(true)
    }

    function searchHandler(value:string){
        setSearch(value)
    }

    useEffect(() => {
        search !== '' ?
        setAnnouncements(announcements.filter((announcement:any) => (announcement.title.includes(search) || announcement.description.includes(search))))
        :
        setAnnouncements(props.announcements)
    }, [search])

    useEffect(() => {
        console.log(process.env.BASE_URL+'/category')
        fetch(process.env.BASE_URL+'/category', {
            headers: {
                "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsYWM0dDEwZjAwMDJpdjZnOWNreGQ1ZnciLCJyb2xlIjoiVXNlciIsImlhdCI6MTY2ODE0OTE2OSwiZXhwIjoxNjY4MTQ5MjI5fQ.g8VGlmkGexjkkeDqVR7X4oaC0rFXOQz-qq0LJ02CLQM'
            }
        }).then((res) => res.json())
        .then((res) => console.log(res))
        .catch((error) => console.log(error))
    }, [])
    

    return (
        <div className='max-w-screen-xl w-full px-4 py-5 flex flex-col ml-auto mr-auto'>
            {/* PageTitle Start */}
            {/* <img src="https://i.postimg.cc/0QZp4JNB/fotoch.jpg" alt="" /> */}
            <div className='flex flex-col w-full mb-6 text-secblack'>
                <div className='flex w-full justify-between items-center'>
                    <div className='flex flex-col'>
                        <div className='text-normaltitle font-bold'>
                            Announcements
                        </div>
                        <div className='h-0.5 bg-secblack my-2'></div>
                    </div>
                    <div className='flex justify-end' onClick={addHandler}>
                        <input type="submit" value='Add New Category' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                </div>
                <div className="w-96 mt-3">
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            className="block px-2.5 py-2 w-full text-smalltext text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                            placeholder=" "
                            onChange={(e) => searchHandler(e.target.value)}
                        />
                        <label
                            htmlFor="search"
                            className="absolute text-smalltext text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                        >
                            Search announcement
                        </label>
                    </div>
                </div>
            </div>
            {/* PageTitle End */}
            <AnnouncementList announcements={announcements} />
            <AnnouncementAddPopup add={add} onClose={() => setAdd(false)} />
        </div>
    )
}

export async function getServerSideProps(){
    return {
        props: {
            announcements: DUMMY_ANNOUNCEMENTS
        }
    }
}

export default Home