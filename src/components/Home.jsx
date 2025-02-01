import React, { useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import env from "../assets/enviroments";
import { StudentContext } from "../contexts/StudentContext";

export default function Home(params) {
  const navigate = useNavigate();

  const { isMobile } = useContext(StudentContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    axios
      .post(env.apiUrl + "/user/login", data)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.accessToken);
          navigate("/admin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {/* <div className={isMobile ? "w-full grid rounded-xl overflow-hidden border-[#424242] border-2 shadow-2xl" : "w-[40rem] grid rounded-xl overflow-hidden border-[#424242] border-2 shadow-2xl"}>*/}
      {isMobile && (
        <div className="w-full h-screen flex">
          <div className="w-full grid place-items-center bg-gray-100">
            <div className="col-span-3 bg-gray-100 p-6 grid place-items-center ">
              <img className="w-2/3" src="/thatako.png" alt="" />
              <p className="text-xl font-bold text-[#1b1b4f] ">
                ระบบรับสมัครนักเรียนออนไลน์
              </p>
              <p className="text-xl font-bold text-[#1b1b4f] ">
                โรงเรียนท่าตะโกพิทยาคม
              </p>

              <Button
                variant="contained"
                sx={
                  isMobile
                    ? { mt: 4, mb: 2, py: 2, fontSize: 20, width: "66%" }
                    : { mt: 4, mb: 2, py: 3, fontSize: 40, width: "66%" }
                }
              >
                <Link className="w-full flex justify-center" to={"/apply"}>
                  สมัครเรียน
                </Link>
              </Button>

              <hr className="h-px my-4 bg-gray-200 border-none w-5/6" />
              <p className="text-sm font-bold text-[#1b1b4f] ">
                เข้าใช้งานระบบสำหรับเจ้าหน้าที่
              </p>
              <div className="px-5 py-3">
                <TextField
                  {...register("username", { required: true })}
                  error={errors.username}
                  id="outlined-basic"
                  label="Username"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                />
                <TextField
                  {...register("password", { required: true })}
                  error={errors.password}
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  fullWidth
                />
              </div>

              <Button
                onClick={handleSubmit(onSubmit)}
                color="success"
                variant="contained"
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="w-full h-screen flex">
          <div className="w-1/2 h-screen grid place-items-center bg-gradient-to-br from-[#78c9f4] via-[#1b1b4f] to-[#131339]">
            <img
              className="rounded-full"
              style={{ clipPath: "inset(6px round 50%)" }}
              src="/thatako2.png"
              alt=""
            />
          </div>

          <div className="w-1/2 h-screen grid place-items-center bg-gray-100">
            <div className="col-span-3 bg-gray-100 p-6 grid place-items-center ">
              <p className="text-3xl font-bold text-[#1b1b4f] ">
                ระบบรับสมัครนักเรียนออนไลน์
              </p>
              <p className="text-3xl font-bold text-[#1b1b4f] ">
                โรงเรียนท่าตะโกพิทยาคม
              </p>

              <Button
                variant="contained"
                sx={
                  isMobile
                    ? { mt: 4, mb: 2, py: 2, fontSize: 20, width: "66%" }
                    : { mt: 4, mb: 2, py: 3, fontSize: 40, width: "66%" }
                }
              >
                <Link className="w-full flex justify-center" to={"/apply"}>
                  สมัครเรียน
                </Link>
              </Button>

              <hr className="h-px my-4 bg-gray-200 border-none w-5/6" />
              <p className="text-xl font-bold text-[#1b1b4f] ">
                เข้าใช้งานระบบสำหรับเจ้าหน้าที่
              </p>
              <div className="px-5 py-3">
                <TextField
                  {...register("username", { required: true })}
                  error={errors.username}
                  id="outlined-basic"
                  label="Username"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                />
                <TextField
                  {...register("password", { required: true })}
                  error={errors.password}
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                />
              </div>

              <Button
                onClick={handleSubmit(onSubmit)}
                color="success"
                variant="contained"
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
