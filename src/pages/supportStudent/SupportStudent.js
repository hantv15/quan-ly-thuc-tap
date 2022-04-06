import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Input, Select, Button, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RegisterInternAPI from "../../API/RegisterInternAPI";
import { getListSpecialization } from "../../features/specializationSlice/specializationSlice";
import { guardarArchivo } from "../../ultis/uploadFileToDriveCV";

import styles from "./SupportStudent.module.css";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const SupportStudent = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [fileConvert, setFilConvert] = useState();
  const [form] = Form.useForm();
  const { listSpecialization } = useSelector((state) => state.specialization);
  const { infoUser } = useSelector((state) => state.auth);

  function guardarArchivo(files, data) {
    console.log(process.env.GOOGLE_CLIENT_ID);
    var file = files; //the file
    console.log("file: ", files);
    var reader = new FileReader(); //this for convert to Base64
    reader.readAsDataURL(file); //start conversion...
    reader.onload = function (e) {
      //.. once finished..
      var rawLog = reader.result.split(",")[1]; //extract only thee file data part
      var dataSend = {
        dataReq: { data: rawLog, name: file.name, type: file.type },
        fname: "uploadFilesToGoogleDrive",
      }; //preapre info to send to API
      fetch(
        `https://script.google.com/macros/s/AKfycbzu7yBh9NkX-lnct-mKixNyqtC1c8Las9tGixv42i9o_sMYfCvbTqGhC5Ps8NowC12N/exec
        `, //your AppsScript URL
        { method: "POST", body: JSON.stringify(dataSend) }
      ) //send to Api
        .then((res) => res.json())
        .then((a) => {
          const newData = { ...data, CV: a.url };
          RegisterInternAPI.upload(newData)
            .then((res) => {
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((e) => console.log(e)); // Or Error in console
    };
  }

  const normFile = (e) => {
    //xử lí ảnh firebase or google drive
    setFile(e.file.originFileObj);
    console.log("data: ", e.file.originFileObj);
  };
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const data = {
      ...values,
      email: infoUser?.student?.email,
      ///dispatch Redux
    };
    console.log(data);
    await guardarArchivo(file, data);
  };

  useEffect(() => {
    dispatch(getListSpecialization());
  }, []);

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        className={styles.form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ["zhejiang", "hangzhou", "xihu"],
          prefix: "86",
        }}
        scrollToFirstError
      >
        <Form.Item
          name="user_code"
          label="Mã sinh viên"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã sinh viên",
            },
          ]}
        >
          <Input placeholder="Mã sinh viên" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Họ và Tên"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên",
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại",
            },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập địa chỉ",
            },
          ]}
        >
          <Input placeholder="Địa chỉ" />
        </Form.Item>
        <Form.Item
          name="majors"
          label="Ngành học"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ngành học",
            },
          ]}
        >
          <Select
            style={{
              width: "50%",
              marginLeft: "20px",
            }}
            placeholder="Chọn ngành học"
          >
            {listSpecialization.map((item, index) => (
              <Option value={item._id} key={index}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dream"
          label="Vị trí mong muốn"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập địa chỉ",
            },
          ]}
        >
          <Input placeholder="Vị trí mong muốn" />
        </Form.Item>
        <Form.Item
          name="upload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button
              style={{
                marginLeft: "20px",
              }}
              icon={<UploadOutlined />}
            >
              Click to upload
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SupportStudent;
