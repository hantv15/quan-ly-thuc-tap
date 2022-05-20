import { Button, Form, Input, message, Radio, Spin } from "antd";
import { object } from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import RegisterInternAPI from "../../API/RegisterInternAPI";
import CountDownCustorm from "../../components/CountDownCustorm";
import { getListSpecialization } from "../../features/specializationSlice/specializationSlice";
import { getStudentId } from "../../features/StudentSlice/StudentSlice";
import { getTimeForm } from "../../features/timeDateSlice/timeDateSlice";
import Proactive from "./Proactive";
import Support from "./Support";
import styles from "./SupportStudent.module.css";
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
const SupportStudent = ({ studentById, infoUser }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [value, setValue] = useState(1);
  const [spin, setSpin] = useState(false);
  const { time } = useSelector((state) => state.time.formTime);
  const [form] = Form.useForm();
  // const [listBusiness, setListBusiness] = useState([]);

  const getDefaultSmester = async () => {
    // const { data: data1 } = await BusinessAPI.get({
    //   campus_id: infoUser.student.campus_id,
    //   majors: infoUser.student.majors,
    //   smester_id: infoUser.student.smester_id._id,
    // });
    // setListBusiness(data1.list);
  };
  useEffect(() => {
    dispatch(getListSpecialization());
    dispatch(getTimeForm(value));
    dispatch(getStudentId(infoUser.student.mssv));
    getDefaultSmester();
  }, [value, dispatch, infoUser]);

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
              setSpin(false);
              form.resetFields();
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
        majors: studentById?.majors,
        name: studentById?.name,
        user_code: infoUser?.student?.mssv,
        email: infoUser?.student?.email,
        typeNumber: supportForm,
        ///dispatch Redux
      };
      if (value === 0) {
        const resData = await RegisterInternAPI.upload(data);
        message.success(resData.data.message);
        form.resetFields();
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
  const check = time.endTime > new Date().getTime();
  const isCheck =
    studentById?.statusCheck === 10 || studentById?.statusCheck === 1;
  return (
    <>
      {isCheck === true ? (
        <Spin spinning={spin}>
          {check === true ? (
            <CountDownCustorm time={time} />
          ) : (
            <p style={{ marginBottom: "16px" }}>
              Thời gian đăng ký form bạn chọn chưa mở, vui lòng quay lại sau!
            </p>
          )}
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
            {studentById.numberOfTime >= 1 ? null : (
              <Form.Item name="support" label="Kiểu đăng ký">
                <Radio.Group onChange={onChange} defaultValue={value}>
                  <Radio value={1}>Nhà trường hỗ trợ</Radio>
                  <Radio value={0}>Tự tìm nơi thực tập</Radio>
                </Radio.Group>
              </Form.Item>
            )}

            {check === true ? (
              <>
                <Form.Item
                  // name="user_code"
                  label="Mã sinh viên"
                >
                  <p className={styles.text_form_label}>
                    {studentById?.mssv?.toUpperCase()}
                  </p>
                </Form.Item>

                <Form.Item label="Họ và Tên">
                  <p className={styles.text_form_label}>{studentById.name}</p>
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

                <Form.Item
                  name="majors"
                  label="Ngành học"
                  initialValue={studentById.majors}
                >
                  <p className={styles.text_form_label}>
                    {studentById.majors ? studentById.majors : "Chưa có"}
                  </p>
                </Form.Item>
                {/* {value === 1 && (
                    <Form.Item
                      name="business"
                      label="Đơn vị thực tập"
                      rules={[{ required: true }]}
                    >
                      <Select
                        style={{
                          width: "50%",
                          marginLeft: "20px",
                        }}
                        placeholder="Chọn doanh nghiệp"
                        onChange={(val) => form.setFieldsValue(val)}
                      >
                        {listBusiness.length > 0 &&
                          listBusiness.map((item) => (
                            <Option key={item._id} value={item._id}>
                              {item.name +
                                "-" +
                                item.internshipPosition +
                                "-" +
                                item.majors}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  )} */}
                <Form.Item
                  name="dream"
                  label="Vị trí thực tập"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ",
                    },
                  ]}
                >
                  <Input placeholder="VD: Web Back-end, Dựng phim, Thiết kế nội thất" />
                </Form.Item>
                {value === 1 ? <Support normFile={normFile} /> : <Proactive />}
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    {studentById?.statusCheck === 1
                      ? "Sửa thông tin"
                      : "Đăng ký"}
                  </Button>
                </Form.Item>
              </>
            ) : null}
          </Form>
        </Spin>
      ) : (
        "Nộp thông tin đăng ký thực tập thành công."
      )}
    </>
  );
};
SupportStudent.propTypes = {
  studentById: object,
  infoUser: object,
  business: object,
};
export default connect(({ auth: { infoUser }, students: { studentById } }) => ({
  studentById,
  infoUser,
}))(SupportStudent);
