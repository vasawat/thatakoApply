import { useState, useContext } from "react";
import { Form, Input, Button, Select, DatePicker, Upload, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { StudentContext } from "../contexts/StudentContext";
import axios from "axios";
import env from "../assets/enviroments";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const { Option } = Select;

const gradeOptions = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const prefaceOptions = ["เด็กชาย", "เด็กหญิง", "นาย", "นางสาว"];
const majorOptions = ["สายวิทยาศาสตร์และคณิตศาสตร์", "สายศิลคำนวน"];

export default function Apply() {
  const { isMobile } = useContext(StudentContext);

  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadChange = ({ file }) => {
    const isImage = file.type.startsWith("image/");
    if (isImage) {
      setFile(file.originFileObj);
      setImageURL(URL.createObjectURL(file.originFileObj));
    }
  };

  const handleSubmit = async (values) => {
    const data = {
      ...values,
      birthDate: dayjs(values.birthDate).format("YYYY-MM-DD"),
    };

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }

    Swal.fire({
      title: "ยืนยันการสมัคร",
      text: "ตรวจเช็คข้อมูลให้ถูกต้องก่อนการสมัคร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "กลับ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const res = await axios.post(`${env.apiUrl}/user/register`, data);
          if (res.status === 200) {
            formData.append("id", res.data.id);
            await axios.post(`${env.apiUrl}/user/uploadImage`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            setLoading(false);
            Swal.fire("สำเร็จ", res.data.message, "success");
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
          Swal.fire("ข้อผิดพลาด", error.response.data.message, "error");
        }
      }
    });
  };

  return (
    <>
      {loading && (
        <div className="w-full h-screen absolute flex justify-center items-center bg-black opacity-50 z-50">
          <Spin size="large" />
        </div>
      )}

      <div className="w-full h-screen bg-gradient-to-br from-[#78c9f4] via-[#1b1b4f] to-[#131339] overflow-auto grid place-items-center py-10">
        <div className={isMobile ? "mb-5" : "absolute top-10 left-10"}>
          <Link to="/">
            <Button type="primary" size="large">
              กลับไปหน้าแรก
            </Button>
          </Link>
        </div>

        <div
          className={
            isMobile
              ? "w-[90%] py-4 px-3 rounded-xl bg-white"
              : "w-2/3 py-6 px-10 rounded-xl bg-white"
          }
        >
          <h2 className="text-center text-2xl font-bold pb-5">
            ลงทะเบียนนักเรียนออนไลน์ 2568
          </h2>

          <Form layout="vertical" onFinish={handleSubmit}>
            {/* ประเภทการสมัคร */}
            <Form.Item
              name="grade"
              label="ระดับชั้น"
              rules={[{ required: true, message: "กรุณาเลือกระดับชั้น" }]}
            >
              <Select placeholder="เลือกระดับชั้น">
                {gradeOptions.map((grade) => (
                  <Option key={grade} value={grade}>
                    {grade}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="major"
              label="แผนการเรียน"
              rules={[{ required: true, message: "กรุณาเลือกแผนการเรียน" }]}
            >
              <Select placeholder="เลือกแผนการเรียน">
                {majorOptions.map((major) => (
                  <Option key={major} value={major}>
                    {major}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* ข้อมูลนักเรียน */}
            <p className="text-2xl font-bold py-5 ">ข้อมูลนักเรียน</p>
            <Form.Item label="อัปโหลดรูปนักเรียน">
              <Upload
                accept="image/*"
                listType="picture-card"
                showUploadList={false}
                onChange={handleUploadChange}
              >
                {imageURL ? (
                  <img
                    src={imageURL}
                    alt="รูปนักเรียน"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <PlusOutlined />
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              name="thaiId"
              label="เลขประจำตัวประชาชน"
              rules={[
                { required: true, message: "กรุณากรอกเลขประจำตัวประชาชน" },
                { pattern: /^[0-9]*$/, message: "กรุณากรอกเฉพาะตัวเลข" },
              ]}
            >
              <Input maxLength={13} inputMode="numeric" />
            </Form.Item>

            <Form.Item
              name="preface"
              label="คำนำหน้า"
              rules={[{ required: true, message: "กรุณาเลือกคำนำหน้า" }]}
            >
              <Select placeholder="เลือกคำนำหน้า">
                {prefaceOptions.map((preface) => (
                  <Option key={preface} value={preface}>
                    {preface}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="firstName"
              label="ชื่อ"
              rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="นามสกุล"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="เบอร์โทรศัพท์"
              rules={[
                { required: true, message: "กรุณากรอกเบอร์โทรศัพท์" },
                { pattern: /^[0-9]*$/, message: "กรุณากรอกเฉพาะตัวเลข" },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              name="birthDate"
              label="วันเกิด"
              rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name={"nationality"}
              label="สัญชาติ"
              rules={[{ required: true, message: "กรุณากรอกสัญชาติ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={"religion"}
              label="ศาสนา"
              rules={[{ required: true, message: "กรุณากรอกศาสนา" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="ที่อยู่"
              rules={[{ required: true, message: "กรุณากรอกที่อยู่" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="subDistrict"
              label="ตำบล"
              rules={[{ required: true, message: "กรุณากรอกตำบล" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="district"
              label="อำเภอ"
              rules={[{ required: true, message: "กรุณากรอกอำเภอ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="province"
              label="จังหวัด"
              rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="postCode"
              label="รหัสไปรษณีย์"
              rules={[
                { required: true, message: "กรุณากรอกรหัสไปรษณีย์" },
                { pattern: /^[0-9]*$/, message: "กรุณากรอกเฉพาะตัวเลข" },
              ]}
            >
              <Input maxLength={5} />
            </Form.Item>

            {/* ข้อมูลผู้ปกครอง */}
            <p className="text-2xl font-bold pt-5 ">ข้อมูลผู้ปกครอง</p>
            <p className="text-md font-bold pt-2 pb-5 ">
              *หากนักเรียนไม่ได้อาศัยอยู่กับบิดามารดา
              ให้กรอกข้อมูลผู้ปกครองที่อาศัยอยู่ด้วยกัน 2 คนลงในช่องบิดาและมารดา
            </p>
            <Form.Item
              name="firstNameDad"
              label="ชื่อบิดา"
              rules={[{ required: true, message: "กรุณากรอกชื่อบิดา" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastNameDad"
              label="นามสกุลบิดา"
              rules={[{ required: true, message: "กรุณากรอกนามสกุลบิดา" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phoneDad"
              label="เบอร์โทรศัพท์บิดา"
              rules={[
                { required: true, message: "กรุณากรอกเบอร์โทรศัพท์บิดา" },
                { pattern: /^[0-9]*$/, message: "กรุณากรอกเฉพาะตัวเลข" },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              name="firstNameMom"
              label="ชื่อมารดา"
              rules={[{ required: true, message: "กรุณากรอกชื่อมารดา" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastNameMom"
              label="นามสกุลมารดา"
              rules={[{ required: true, message: "กรุณากรอกนามสกุลมารดา" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phoneMom"
              label="เบอร์โทรศัพท์มารดา"
              rules={[
                { required: true, message: "กรุณากรอกเบอร์โทรศัพท์มารดา" },
                { pattern: /^[0-9]*$/, message: "กรุณากรอกเฉพาะตัวเลข" },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item>
              <Button
                className="mt-5"
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                สมัครเรียน
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
