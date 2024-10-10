import React,{ useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { StudentContext } from "../contexts/StudentContext";
import Swal from 'sweetalert2';
import axios from 'axios';
import env from '../assets/enviroments'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function Admin(params) {

  const navigate = useNavigate();
  const { isMobile } = useContext(StudentContext);

  // const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const [grade, setGrade] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchGrade, setSearchGrade] = useState('');
  const [searchDate, setSearchDate] = useState(null);


  const getData = () => {
    axios.get(env.apiUrl + '/admin/getData').then((res) => {
      // setData(res.data);
      setShowData(res.data);
      const stdName = res.data.map((item) => item.firstName);
      setStudentName(stdName);
    })
  }

  const searchData = () => {
      let firstNameSearch = searchName;
      let gradeSearch = searchGrade;
      let dateSearch = searchDate;
      if (!firstNameSearch && !gradeSearch && !dateSearch) {
          Swal.fire("กรุณากรอกข้อมูลสำหรับการค้นหา", "", "warning");
          return;
      } 
      axios
      .post(env.apiUrl +"/admin/searchUsers", { firstNameSearch, gradeSearch, dateSearch })
      .then((res) => {
          if (res.status === 204) {
          Swal.fire("ไม่พบข้อมูล", "", "error");
          } else {
          setShowData(res.data);
          }
      })
      .catch((err) => {
          Swal.fire("เกิดข้อผิดพลาด", err.message, "error");
      });
  };

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/');
    }
    getData();
    setGrade(['ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6']);
    // eslint-disable-next-line
  }, []);

  return (
    <>


      <div className='w-full h-screen grid place-items-center bg-gray-400 overflow-auto'>

        <div className={isMobile ? "my-5":"absolute top-10 left-10"}>
          <Link to={"/"}><Button variant="contained" size='large'>กลับไปหน้าแรก</Button></Link>
        </div>

        <div className={isMobile ? "w-full":"w-2/3 h-[40rem]"}>
        
            <div className={isMobile ? ('w-full bg-white p-4 text-sm'):('w-full flex bg-white p-4 align-middle justify-between')}>
                <div className={isMobile ? ('grid grid-cols-2 gap-2 mb-2'):('flex items-center gap-2')} >
                    <Autocomplete
                        disablePortal
                        options={studentName}
                        sx={isMobile ? { width: '100%' } : { width: 200 }}
                        onChange={(event, newValue) => {
                            setSearchName(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="ชื่อต้น" />}
                        />
                    <Autocomplete
                        disablePortal
                        options={grade}
                        sx={isMobile ? { width: '100%' } : { width: 200 }}
                        onChange={(event, newValue) => {
                            setSearchGrade(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="ระดับชั้น" />}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              sx={{ width: 260 }}
                              label="วันที่"
                              slotProps={{
                                field: { clearable: true },
                              }}
                              onChange={(event) => {
                                const selectedDate = dayjs(event);
                                const formattedDate = selectedDate.format('YYYY-MM-DD');
                                setSearchDate(formattedDate);
                              }}
                            />
                        </LocalizationProvider>
                        
                        {!isMobile && <p className='flex '>จำนวนข้อมูล: {showData.length}</p>}
                        
                </div>

                <div className='flex items-center gap-2'>
                    <Button variant="contained" onClick={searchData}>ค้นหา</Button>
                    <Button variant="contained" onClick={() => getData()}>รีเซต</Button>
                    {isMobile && <p className='flex '>จำนวนข้อมูล: {showData.length}</p>}
                </div>
            </div>

          <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden'  }}>
            <TableContainer sx={{ flexGrow: 1 }}>
              {isMobile ? (
                <Table stickyHeader aria-label="sticky table">
                  <TableBody>
                    {showData.map((eachData) => {
                        return (
                          <TableRow key={eachData._id}>
                              <TableCell>
                                <img src={eachData.image} className='w-10 h-10' alt=""/>
                                ชื่อ: {eachData.preface} {eachData.firstName} {eachData.lastName} <br />
                                เบอร์โทรศัพท์: {eachData.phone} <br />
                                ระดับชั้น: {eachData.grade} <br />
                                แผนการเรียน: {eachData.major} <br />
                                วันที่สมัคร: {new Date(eachData.createdAt).toLocaleString('th-TH', {
                                  year: 'numeric',
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  second: 'numeric',
                                  hour12: false
                                })}
                              </TableCell>
                              <TableCell align="center" sx={{ p: 2 }}>
                                <Button sx={{ fontSize: 12, p: 1 }} variant="contained" color="primary" onClick={() => { navigate('/student/' + eachData._id) }}>ดูข้อมูล</Button>
                              </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              ) : (
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>ชื่อ - นามสกุล</TableCell>
                        <TableCell>เบอร์โทรศัพท์</TableCell>
                        <TableCell>ชั้นปี</TableCell>
                        <TableCell>สาขา</TableCell>
                        <TableCell>วันเวลาที่สมัคร</TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showData.map((eachData) => {
                        return (
                          <TableRow key={eachData._id}>
                              <TableCell><img src={eachData.image} className='w-10 h-10' alt=""/></TableCell>
                              <TableCell>{eachData.preface} {eachData.firstName} {eachData.lastName}</TableCell>
                              <TableCell>{eachData.phone}</TableCell>
                              <TableCell>{eachData.grade}</TableCell>
                              <TableCell>{eachData.major}</TableCell>
                              <TableCell>  
                                {new Date(eachData.createdAt).toLocaleString('th-TH', {
                                  year: 'numeric',
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  second: 'numeric',
                                  hour12: false
                                })}
                              </TableCell>
                              <TableCell align="center" sx={{ cursor: "pointer" }}>
                                <Button sx={{ mr: 1 }} variant="contained" color="primary" onClick={() => { navigate('/student/' + eachData._id) }}>ดูข้อมูล</Button>
                              </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              )}
              
            </TableContainer>
          </Paper>
        </div>
      </div>
    </>
    
  ); 
};
