import React,{ useState, useEffect, useContext } from 'react'
import { useParams , Link } from "react-router-dom";
import axios from 'axios';
import env from '../assets/enviroments'
import { StudentContext } from "../contexts/StudentContext";
import Button from '@mui/material/Button';





export default function StudentDetail(params) {

    const { isMobile } = useContext(StudentContext);
    const { id } = useParams();

    const [data, setData] = useState([]);

    const getDetail = (id) => {
        axios
        .get(env.apiUrl +`/admin/getDetail/${id}`)
        .then((res) => {
            setData(res.data);
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getDetail(id);
        // eslint-disable-next-line
    }, [])

    return (
     <>
            <div className='absolute top-10 left-10'>
                <Link to={"/admin"}><Button variant="contained" size='large'>กลับ</Button></Link>
             </div>
            <div className='w-full h-screen bg-gray-200 grid place-items-center'>
                <div className='w-2/3'>
                    <div className='grid grid-cols-1 rounded-xl bg-white p-6 '>
                        <p className='col-span-1 text-3xl font-bold text-center'>ข้อมูลผู้สมัคร</p>
                        <div className='col-span-1'>
                            <img style={isMobile ? { width: '100%' } : { width: '50%' }} src={data.image} alt="" />
                        </div>

                        <p>ข้อมูลส่วนตัว</p>
                        <p>ชื่อ - นามสกุล : {data.preface} {data.firstName} {data.lastName}</p>
                        <p>แผนการเรียน : {data.major}</p>
                        <p>ระดับชั้น : {data.grade}</p>
                        <p>เลขประจําตัวประชาชน : {data.thaiId}</p>
                        <p>เบอร์โทรศัพท์ : {data.phone}</p>
                        <p>วันเกิด : {data.birthDate}</p>
                        <p>อีเมล : {data.email}</p>
                        <p>สัญชาติ : {data.nationality}</p>
                        <p>ศาสนา : {data.religion}</p>
                        <p>ที่อยู่ : {data.address} {data.subDistrict} {data.district} {data.province} {data.postCode}</p>

                        <hr className='col-span-1 my-4 ' />
                        <p>ข้อมูลผู้ปกครอง</p>
                        <p>ชื่อ - นามสกุล : {data.firstNameDad} {data.lastNameDad}</p>
                        <p>เบอร์โทรศัพท์ : {data.phoneDad}</p>
                        <p>ชื่อ - นามสกุล : {data.firstNameMom} {data.lastNameMom}</p>
                        <p>เบอร์โทรศัพท์ : {data.phoneMom}</p>
                    </div>
                </div>
                    
            </div>
        </>
    )
}
