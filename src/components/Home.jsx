import thatakoPNG from "../images/thatako2.png";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import axios from "axios";

export default function Home(params) {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        axios.post("http://localhost:5000/user/login", data).then((res) => {
            if (res.status === 200) {
                localStorage.setItem("token", res.data.accessToken);
                navigate("/admin");
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <>
        <div className="w-full h-screen bg-gray-400 grid place-items-center">
            <div className="w-2/5 grid grid-cols-3 rounded-xl overflow-hidden">

                <div className="col-span-1 bg-gray-200 p-6">
                    <img src="" alt="" />
                    <div className="text-xl">
                        <p>การเข้าใช้งานระบบ</p>
                        <div className="my-2">
                            <p >1) สำหรับเจ้าหน้าที่</p>
                            <p>• ระบุชื่อผู้ใช้งาน (Username) และรหัสผ่าน (Password) เพื่อเข้าใช้งานระบบ</p>
                        </div>
                        <div className="my-2">
                            <p>2) สำหรับผู้สมัคร </p>
                            <p>• คลิกที่ปุ่ม "สมัครเรียน"</p>
                        </div>
                        <div className="my-2">
                            <p>3) เบอร์ติดต่อผู้ดูแลระบบ</p>
                            <p>• นางปิยะธิดา ประภาชัยมงคล 0894598602</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 bg-white p-6 grid place-items-center">
                    <img className="w-1/3 mt-2 mb-4" src={thatakoPNG} alt="" />
                    <p>ระบบรับสมัครนักเรียนออนไลน์</p>
                    <p>สำหรับโรงเรียนท่าตะโกพิทยาคม</p>
                    <Link className="w-full flex justify-center" to={"/apply"}><Button variant="contained" sx={{mt: 4, mb: 2, py:3, fontSize:40, width:"66%"}}>สมัครเรียน</Button></Link>
                    <hr  className="h-px my-4 bg-gray-200 border-none w-5/6"/>
                    <p>เข้าใช้งานระบบสำหรับเจ้าหน้าที่</p>
                    <div className="px-5 py-3">
                        <TextField {...register("username", { required: true })} error={errors.username} id="outlined-basic" label="Username" variant="outlined" sx={{mb:2}} fullWidth/>
                        <TextField {...register("password", { required: true })} error={errors.password} id="outlined-basic" label="Password" variant="outlined" fullWidth/>
                    </div>
                    
                    <Button onClick={handleSubmit(onSubmit)} color="success" variant="contained">เข้าสู่ระบบ</Button>
                </div>

            </div>
        </div>
            
        </>
    )
};
