import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import env from "../assets/enviroments";
import { StudentContext } from "../contexts/StudentContext";
import Button from "@mui/material/Button";

export default function StudentDetail(params) {
  const navigate = useNavigate();

  const { isMobile } = useContext(StudentContext);
  const { id } = useParams();

  const [data, setData] = useState([]);

  const getDetail = (id) => {
    axios.get(env.apiUrl + `/admin/getDetail/${id}`).then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (localStorage.getItem("token") === null) {
      navigate("/");
    }
    getDetail(id);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="w-full h-screen bg-gray-200 grid place-items-center overflow-auto">
        <div className={isMobile ? "my-5" : "absolute top-10 left-10"}>
          <Link to={"/admin"}>
            <Button variant="contained" size="large">
              กลับ
            </Button>
          </Link>
        </div>
        <div className={isMobile ? "w-full" : " "}>
          <div className="grid grid-cols-1 gap-1 rounded-xl bg-white p-6 text-sm">
            <div className="col-span-1 grid place-items-center my-5">
              <img
                style={isMobile ? { width: "50%" } : { width: "20rem" }}
                src={data.image}
                alt=""
              />
            </div>
            <p className="col-span-1 text-xl font-bold mb-2">ข้อมูลส่วนตัว</p>
            <p>
              ชื่อ - นามสกุล : {data.preface} {data.firstName} {data.lastName}
            </p>
            <p>แผนการเรียน : {data.major}</p>
            <p>ระดับชั้น : {data.grade}</p>
            <p>เลขประจําตัวประชาชน : {data.thaiId}</p>
            <p>เบอร์โทรศัพท์ : {data.phone}</p>
            <p>อีเมล : {data.email}</p>
            <p>วันเกิด : {data.birthDate}</p>
            <p>สัญชาติ : {data.nationality}</p>
            <p>เชื้อชาติ : {data.ethnicity}</p>
            <p>ศาสนา : {data.religion}</p>
            <p>หมู่โลหิต : {data.bloodType}</p>
            <p>
              ที่อยู่ : {data.address} {data.subDistrict} {data.district}{" "}
              {data.province} {data.postCode}
            </p>
            <hr className="col-span-1 my-4 " />
            <p className="col-span-1 text-xl font-bold mb-2">
              ชื่อโรงเรียนที่สำเร็จการศึกษาหรือกำลังศีกษา
            </p>
            <p>ชื่อโรงเรียน : {data.prevSchoolName}</p>
            <p>จังหวัด : {data.prevSchoolProvince}</p>
            <p>เกรดเฉลี่ย : {data.prevSchoolScore}</p>
            <hr className="col-span-1 my-4 " />
            <p className="col-span-1 text-xl font-bold mb-2">ข้อมูลผู้ปกครอง</p>
            <p>
              ชื่อ - สกุล บิดา : {data.firstNameDad} {data.lastNameDad}
            </p>
            <p>อาชีพบิดา : {data.jobDad}</p>
            <p>เบอร์โทรศัพท์บิดา : {data.phoneDad}</p>
            <p>
              ชื่อ - สกุล มารดา : {data.firstNameMom} {data.lastNameMom}
            </p>
            <p>อาชีพมารดา : {data.jobMom}</p>
            <p>เบอร์โทรศัพท์มารดา : {data.phoneMom}</p>
            <p>สถานภาพของบิดามารดา : {data.familyStatus}</p>
            <p>
              ชื่อ - สกุล ผู้ปกครอง : {data.firstNameParent}{" "}
              {data.lastNameParent}
            </p>
            <p>อาชีพผู้ปกครอง : {data.jobParent}</p>
            <p>เบอร์โทรศัพท์ผู้ปกครอง : {data.phoneParent}</p>
            <p>ความเกี่ยวข้องของผู้ปกครองกับนักเรียน : {data.parentRelation}</p>
          </div>
        </div>
      </div>
    </>
  );
}
