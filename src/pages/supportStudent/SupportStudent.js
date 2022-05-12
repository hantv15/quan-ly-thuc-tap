import { Form, Input, Select, Button, message, Spin, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RegisterInternAPI from "../../API/RegisterInternAPI";
import { getListSpecialization } from "../../features/specializationSlice/specializationSlice";
import { getTimeForm } from "../../features/timeDateSlice/timeDateSlice";
import styles from "./SupportStudent.module.css";
import CountDownCustorm from "../../components/CountDownCustorm";
import Proactive from "./Proactive";
import Support from "./Support";
import { getStudentId } from "../../features/cumpusSlice/cumpusSlice";
import { optionsMajors } from "../../ultis/selectOption";
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
  const [value, setValue] = useState(1);
  const [spin, setSpin] = useState(false);
  const { time } = useSelector((state) => state.time.formTime);
  const [form] = Form.useForm();
  const { student } = useSelector((state) => state.cumpus);
  const { infoUser } = useSelector((state) => state.auth);

  function guardarArchivo(files, data) {
    const file = files; //the file

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
              message.success(res.data.message);
              setValue([]);
              form.resetFields();
              setSpin(false);
            })
            .catch(async (err) => {
              const dataErr = await err.response.data;
              if (!dataErr.status) {
                message.error(`${dataErr.message}`);
                setSpin(false);
              } else {
                message.error(`${dataErr.message}`);
                setSpin(false);
              }
            });
          setSpin(false);
        })
        .catch((e) => {
          message.success("Có lỗi xảy ra! Vui lòng đăng ký lại");
          form.resetFields();
          setSpin(false);
        }); // Or Error in console
    };
  }

  const normFile = (e) => {
    const valueFile = e.file.originFileObj;

    const isPDF = valueFile.type === "application/pdf";

    if (!isPDF) {
      message.error("Vui lòng nhập file đúng định dạng PDF");
    }
    setFile(e.file.originFileObj);
  };

  const onFinish = async (values) => {
    setSpin(true);

    try {
      const supportForm = values.support === 0 ? 0 : 1;

      const data = {
        ...values,
        support: value,
        majors: student?.majors,
        name: student?.name,
        user_code: infoUser?.student?.mssv,
        email: infoUser?.student?.email,
        typeNumber: supportForm,
        ///dispatch Redux
      };
      if (value === 0) {
        const resData = await RegisterInternAPI.upload(data);
        message.success(resData.data.message);
        form.resetFields();
        setValue([]);
        setSpin(false);
      } else {
        await guardarArchivo(file, data);
      }
    } catch (error) {
      const dataErr = await error.response.data.message;
      message.error(dataErr);
      setSpin(false);
    }
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    dispatch(getListSpecialization());
    dispatch(getTimeForm(value));
    dispatch(getStudentId(infoUser.student.mssv));
  }, [value, dispatch, infoUser]);

  const check = time.endTime > new Date().getTime();
  const isCheck = student.statusCheck === 10 || student.statusCheck === 1;
  return (
    <>
      {check && <CountDownCustorm time={time} />}
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
        {check ? (
          isCheck ? (
            <>
              <Spin spinning={spin}>
                {student.statusCheck === 1 ? null : (
                  <Form.Item name="support" label="Kiểu đăng ký">
                    <Radio.Group onChange={onChange} defaultValue={value}>
                      <Radio value={1}>Nhà trường hỗ trợ</Radio>
                      <Radio value={0}>Tự tìm nơi thực tập</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}
                <Form.Item
                  // name="user_code"
                  label="Mã sinh viên"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Vui lòng nhập mã sinh viên",
                  //   },
                  // ]}
                >
                  <Input
                    defaultValue={student.mssv.toUpperCase()}
                    disabled
                    placeholder="Mã sinh viên"
                  />
                </Form.Item>

                <Form.Item
                  // name="name"
                  label="Họ và Tên"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Vui lòng nhập tên",
                  //     whitespace: true,
                  //   },
                  // ]}
                >
                  <Input
                    defaultValue={student.name}
                    disabled
                    placeholder="Họ và tên"
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp("(84|0[3|5|7|8|9])+([0-9]{8})"),
                      message: "Vui lòng nhập đúng số điện thoại",
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
                <Form.Item label="Ngành học">
                  <Select
                    style={{
                      width: "50%",
                      marginLeft: "20px",
                    }}
                    defaultValue={student.majors}
                    disabled
                    placeholder="Chọn ngành học"
                  >
                    {optionsMajors.map((item, index) => (
                      <Option value={item.value} key={index}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="internshipPosition"
                  label={value === 1 ? "Vị trí mong mốn" : "Vị trí thực tập"}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ",
                    },
                  ]}
                >
                  <Input placeholder="VD: Web Back-end, Dựng phim, Thiết kế nội thất" />
                </Form.Item>
                {value === 1 ? (
                  <Support normFile={normFile} />
                ) : (
                  <Proactive student={student} />
                )}
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    Đăng ký
                  </Button>
                </Form.Item>
              </Spin>
            </>
          ) : (
            "Đăng ký thông tin thành công"
          )
        ) : (
          <p>Thời gian đăng ký đã hết</p>
        )}
      </Form>
    </>
  );
};

export default SupportStudent;
