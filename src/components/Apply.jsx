import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form'

import env from '../assets/enviroments'
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2'
import { Link, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const grade = ['ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'];
const preface = ['เด็กชาย', 'เด็กหญิง', 'นาย', 'นางสาว'];
const major = ['สายวิทยาศาสตร์และคณิตศาสตร์', 'สายศิลคำนวน'];

export default function Apply(params) {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const {control, register, handleSubmit, formState: { errors } } = useForm();
    const [openBackDrop, setOpenBackDrop] = useState(false);
    const handleCloseBackDrop = () => {
        setOpenBackDrop(false);
    };
    const handleOpenBackDrop = () => {
        setOpenBackDrop(true);
    };

    const handleFileChange = (event) => {
        console.log(event.target.files[0]);
        const selectedFile = event.target.files[0];
        if (selectedFile) {
        setFile(selectedFile);
        setImageURL(URL.createObjectURL(selectedFile));
        }
    };
    const onSubmit = async data =>  {
        data.birthDate = dayjs(data.birthDate).format('YYYY-MM-DD');;
        console.log(data);
        const formData = new FormData();
        if (file) {
            formData.append('image', file);
        }
        Swal.fire({
            title: 'ยืนยันการสมัคร',
            text: "ตรวจเช็คข้อมูลให้ถูกต้องก่อนการสมัคร",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'กลับ'
        }).then(async(result) => {
            if (result.isConfirmed) {
                handleOpenBackDrop();
                await axios.post(env.apiUrl + "/user/register", data).then(async (res) => {
                    if (res.status === 200) {
                        formData.append('id', res.data.id);
                        await axios.post(env.apiUrl + "/user/uploadImage", formData, {headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
                            if (res.status === 200) {
                                handleCloseBackDrop();
                                Swal.fire({
                                    title: 'ส่งใบสมัครสําเร็จ',
                                    icon: 'success',
                                })
                            }
                        })
                    }
                })
            }
        }).catch((error) => {
            handleCloseBackDrop();
            console.log(error);
        })

    }

    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackDrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className='absolute top-10 left-10'>
                <Link to={"/"}><Button variant="contained" size='large'>กลับไปหน้าแรก</Button></Link>
            </div>

            
            <div className="w-full h-screen bg-blue-200 overflow-auto grid place-items-center py-10">
                
                <div className="w-2/3 py-6 px-10 rounded-xl bg-white">
                <p className='text-center text-2xl pb-5'>ลงทะเบียนนักเรียนออนไลน์ 2567</p>
                    <div className='grid grid-cols-2 gap-7'>

                        <p className='col-span-2 text-xl'>ประเภทการสมัคร</p>
                        <TextField
                            {...register("grade", { required: true })}
                            error={errors.grade}
                            id="outlined-select-grade"
                            select
                            label={
                                <span>
                                ระดับชั้น <span className='text-red-500'>*</span>
                                </span>
                            }
                            defaultValue="ม.1"
                            >
                            {grade.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            {...register("major", { required: true })}
                            error={errors.major}
                            id="outlined-select-major"
                            select
                            label={
                                <span>
                                แผนการเรียน <span className='text-red-500'>*</span>
                                </span>
                            }
                            defaultValue="sciMath"
                            >
                            {major.map((option) => (
                                <MenuItem key={option} value={option}>
                                {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <p className='col-span-2 text-xl'>ข้อมูลนักเรียน</p>
                        <div className='col-span-2'>
                            <div className='w-20 h-20'>
                                {imageURL && (
                                    <img src={imageURL} alt="รูปนักเรียน" className="w-full h-full object-cover" />
                                )}
                            </div>
                            
                        </div>
                        <div className='col-span-2 flex items-center gap-2'>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                >
                                อัปโหลดรูปนักเรียน
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*" 
                                />
                            </Button>
                            <p>{file && file.name}</p>
                        </div>
                        <TextField {...register("thaiId", { required: true })} error={errors.thaiId} id="outlined-basic" label="เลขประจําตัวประชาชน" variant="outlined"   
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }} fullWidth/>
                        <TextField
                            {...register("preface", { required: true })}
                            id="outlined-select-preface"
                            select
                            label="คำนำหน้า"
                            defaultValue="เด็กชาย"
                            >
                            {preface.map((option) => (
                                <MenuItem key={option} value={option}>
                                {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField {...register("firstName", { required: true })} id="outlined-basic" label="ชื่อ" variant="outlined" fullWidth/>
                        <TextField {...register("lastName", { required: true })} id="outlined-basic" label="นามสกุล" variant="outlined" fullWidth/>


                        

                        <TextField {...register("phone", { required: true })} id="outlined-basic" label="เบอร์โทรศัพท์" variant="outlined" onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }} fullWidth/>
                        <TextField {...register("email")} id="outlined-basic" label="อีเมล" variant="outlined" type='email' fullWidth/>
                        <TextField {...register("nationality", { required: true })} id="outlined-basic" label="สัญชาติ" variant="outlined" fullWidth/>
                        <TextField {...register("religion", { required: true })} id="outlined-basic" label="ศาสนา" variant="outlined" fullWidth/>
                        <div className='col-span-2'>
                            <TextField {...register("address", { required: true })} id="outlined-basic" label="ที่อยู่" variant="outlined" fullWidth/>
                        </div>
                        <TextField {...register("subDistrict", { required: true })} id="outlined-basic" label="ตำบล" variant="outlined" fullWidth/>
                        <TextField {...register("district", { required: true })} id="outlined-basic" label="อำเภอ" variant="outlined" fullWidth/>
                        <TextField {...register("province", { required: true })} id="outlined-basic" label="จังหวัด" variant="outlined" fullWidth/>
                        <TextField {...register("postCode", { required: true })} id="outlined-basic" label="รหัสไปรษณีย์" variant="outlined" onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }} fullWidth/>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value } }) => (
                                    <DatePicker
                                        label="วันเกิด"
                                        value={value}
                                        onChange={onChange}
                                        fullWidth
                                    />
                                    )}
                                    rules={{ required: true }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                        <p className='col-span-2 text-xl'>ข้อมูลผู้ปกครอง</p>
                        <TextField {...register("firstNameDad", { required: true })} id="outlined-basic" label="ชื่อบิดา" variant="outlined" fullWidth/>
                        <TextField {...register("lastNameDad", { required: true })} id="outlined-basic" label="นามสกุลบิดา" variant="outlined" fullWidth/>
                        <TextField {...register("phoneDad", { required: true })} id="outlined-basic" label="เบอร์โทรศัพท์บิดา" variant="outlined" onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }} fullWidth/>
                        <div className='col-start-1'>
                            <TextField {...register("firstNameMom", { required: true })} id="outlined-basic" label="ชื่อมารดา" variant="outlined" fullWidth/>
                        </div>
                        <TextField {...register("lastNameMom", { required: true })} id="outlined-basic" label="นามสกุลมารดา" variant="outlined" fullWidth/>
                        <TextField {...register("phoneMom", { required: true })} id="outlined-basic" label="เบอร์โทรศัพท์มารดา" variant="outlined" onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }} fullWidth/>

                    </div>
                    <div className='grid place-items-center mt-5'>
                        <Button onClick={handleSubmit(onSubmit)} color="success" variant="contained" fullWidth>สมัครเรียน</Button>
                    </div>
                    
                </div>
            </div>
        </>
    )
};
