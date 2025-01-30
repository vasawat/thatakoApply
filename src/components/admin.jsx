import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StudentContext } from "../contexts/StudentContext";
import Swal from "sweetalert2";
import axios from "axios";
import env from "../assets/enviroments";
import { Button, Table, Select, DatePicker, Space, Image } from "antd";

const { Column } = Table;

export default function Admin() {
  const navigate = useNavigate();
  const { isMobile } = useContext(StudentContext);

  const [showData, setShowData] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const [grade, setGrade] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchGrade, setSearchGrade] = useState("");
  const [searchDate, setSearchDate] = useState(null);

  const getData = () => {
    axios.get(env.apiUrl + "/admin/getData").then((res) => {
      setShowData(res.data);
      const stdName = res.data.map((item) => item.firstName);
      setStudentName(stdName);
    });
  };

  const searchData = () => {
    let firstNameSearch = searchName;
    let gradeSearch = searchGrade;
    let dateSearch = searchDate;
    if (!firstNameSearch && !gradeSearch && !dateSearch) {
      Swal.fire("กรุณากรอกข้อมูลสำหรับการค้นหา", "", "warning");
      return;
    }
    axios
      .post(env.apiUrl + "/admin/searchUsers", {
        firstNameSearch,
        gradeSearch,
        dateSearch,
      })
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
    if (localStorage.getItem("token") === null) {
      navigate("/");
    }
    getData();
    setGrade(["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"]);
  }, [navigate]);

  return (
    <div className="w-full h-screen grid place-items-center bg-gradient-to-br from-[#78c9f4] via-[#1b1b4f] to-[#131339] overflow-auto">
      <div className={isMobile ? "my-5" : "absolute top-10 left-10"}>
        <Link to={"/"} onClick={() => localStorage.removeItem("token")}>
          <Button type="primary" size="large">
            ออกจากระบบ
          </Button>
        </Link>
      </div>
      {!isMobile && (
        <div className="w-[80%] my-10 bg-white rounded-xl">
          <div>
            <div className="w-full flex justify-between bg-white p-4">
              <div className="flex gap-4 items-center">
                <Select
                  showSearch
                  placeholder="ชื่อต้น"
                  options={studentName.map((name) => ({
                    value: name,
                    label: name,
                  }))}
                  onChange={(value) => setSearchName(value)}
                  style={{ width: isMobile ? "100%" : 200 }}
                  allowClear
                />
                <Select
                  showSearch
                  placeholder="ระดับชั้น"
                  options={grade.map((g) => ({ value: g, label: g }))}
                  onChange={(value) => setSearchGrade(value)}
                  style={{ width: isMobile ? "100%" : 200 }}
                  allowClear
                />
                <DatePicker
                  placeholder="วันที่"
                  style={{ width: isMobile ? "100%" : 200 }}
                  onChange={(date) =>
                    setSearchDate(date ? date.format("YYYY-MM-DD") : null)
                  }
                  allowClear
                />
                {!isMobile && <span>จำนวนข้อมูล: {showData.length}</span>}
              </div>

              <Space size="middle">
                <Button type="primary" onClick={searchData}>
                  ค้นหา
                </Button>
                <Button
                  onClick={() => {
                    setSearchName("");
                    setSearchGrade("");
                    setSearchDate(null);
                    getData();
                  }}
                >
                  รีเซต
                </Button>
                {isMobile && <span>จำนวนข้อมูล: {showData.length}</span>}
              </Space>
            </div>

            <Table
              dataSource={showData}
              rowKey="_id"
              pagination={{ pageSize: 7 }}
              style={{ width: "100%" }}
            >
              <Column
                title=""
                dataIndex="image"
                render={(image) => <Image src={image} width={40} height={40} />}
              />
              <Column
                title="ชื่อ - นามสกุล"
                render={(record) =>
                  `${record.preface} ${record.firstName} ${record.lastName}`
                }
              />
              <Column title="เบอร์โทรศัพท์" dataIndex="phone" />
              <Column title="ชั้นปี" dataIndex="grade" />
              <Column title="สาขา" dataIndex="major" />
              <Column
                title="วันเวลาที่สมัคร"
                dataIndex="createdAt"
                render={(date) =>
                  new Date(date).toLocaleString("th-TH", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: false,
                  })
                }
              />
              <Column
                title=""
                key="action"
                render={(record) => (
                  <Button
                    type="primary"
                    onClick={() => navigate(`/student/${record._id}`)}
                  >
                    ดูข้อมูล
                  </Button>
                )}
              />
            </Table>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="w-full">
          <div className="w-full flex flex-col gap-4 bg-white p-4">
            <Select
              showSearch
              placeholder="ชื่อต้น"
              options={studentName.map((name) => ({
                value: name,
                label: name,
              }))}
              onChange={(value) => setSearchName(value)}
              style={{ width: isMobile ? "100%" : "" }}
              allowClear
            />
            <Select
              showSearch
              placeholder="ระดับชั้น"
              options={grade.map((g) => ({ value: g, label: g }))}
              onChange={(value) => setSearchGrade(value)}
              style={{ width: isMobile ? "100%" : "" }}
              allowClear
            />
            <DatePicker
              placeholder="วันที่"
              style={{ width: isMobile ? "100%" : "" }}
              onChange={(date) =>
                setSearchDate(date ? date.format("YYYY-MM-DD") : null)
              }
              allowClear
            />
            {!isMobile && <span>จำนวนข้อมูล: {showData.length}</span>}
            <Space size="middle">
              <Button type="primary" onClick={searchData}>
                ค้นหา
              </Button>
              <Button
                onClick={() => {
                  setSearchName("");
                  setSearchGrade("");
                  setSearchDate(null);
                  getData();
                }}
              >
                รีเซต
              </Button>
              {isMobile && <span>จำนวนข้อมูล: {showData.length}</span>}
            </Space>
          </div>

          <Table
            dataSource={showData}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            style={{ width: "100%", borderRadius: "0" }}
            components={{
              header: {
                cell: (props) => (
                  <th {...props} style={{ borderRadius: "0px" }} />
                ),
              },
            }}
          >
            <Column
              title="ข้อมูลผู้สมัคร"
              style={{ borderRadius: "0" }}
              render={(record) => (
                <div>
                  <img className="w-10" src={record.image} alt="" />
                  <p>
                    ชื่อ: {record.preface} {record.firstName} {record.lastName}
                  </p>
                  <p>เบอร์โทรศัพท์: {record.phone}</p>
                  <p>ชั้นปี: {record.grade}</p>
                  <p>สาขา: {record.major}</p>
                  <p>
                    วันเวลาที่สมัคร:{" "}
                    {new Date(record.createdAt).toLocaleString("th-TH", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: false,
                    })}
                  </p>
                </div>
              )}
            />
            <Column
              title=""
              key="action"
              render={(record) => (
                <Button
                  type="primary"
                  onClick={() => navigate(`/student/${record._id}`)}
                >
                  ดูข้อมูล
                </Button>
              )}
            />
          </Table>
        </div>
      )}
    </div>
  );
}
