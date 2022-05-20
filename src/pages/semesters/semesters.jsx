/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Table, message, Space, Form } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SemestersAPI from "../../API/SemestersAPI";
import { getSemesters } from "../../features/semesters/semestersSlice";
import FSemester from "./formSemester";
const FormSemester = () => {
  const dispatch = useDispatch();
  const [hideForm, setHideForm] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [text, setText] = useState("Thêm kỳ");
  const [dataEdit, setDataEdit] = useState({});
  const [form] = Form.useForm();
  const { listSemesters } = useSelector((state) => state.semester);

  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const result = listSemesters.map((item) => ({
    id: item._id,
    name: capitalizeFirstLetter(item.name),
    start_time: moment(item.start_time).format("DD/MM/YYYY"),
    end_time: moment(item.end_time).format("DD/MM/YYYY"),
  }));

  const onFinish = async (values) => {
    const data = {
      id: values.id,
      name: values.name,
      start_time: values.time[0]._d,
      end_time: values.time[1]._d,
    };
    try {
      if (values.status === 1) {
        const res = await SemestersAPI.updateSemester(data);
        if (res) {
          message.success("Sửa kỳ học thành công");
        }
      } else {
        const res = await SemestersAPI.insertSemester(data);
        if (res) {
          message.success("Thêm kỳ học thành công");
        }
      }
    } catch (error) {
      const dataErr = error.response.data.message;
      message.error(dataErr);
    }
    setHideForm(false);
  };

  // sửa kỳ
  const getDataEdit = (value) => {
    setHideForm(true);
    form.setFieldsValue({
      id: value.id,
      name: value.name,
      time: [moment(value.start_time), moment(value.end_time)],
    });
    setHideButton(true);
    setText("Sửa kỳ");
  };

  // Huỷ form
  const editStatusButton = (value) => {
    setHideButton(value);
    setHideForm(false);
  };

  // Bật tắt button tạo kỳ
  const isHideForm = () => {
    form.resetFields();
    setHideForm(!hideForm);
    setText("Thêm kỳ");
    setDataEdit();
  };

  useEffect(() => {
    dispatch(getSemesters());
  }, [dispatch, hideForm]);

  const columns = [
    {
      dataIndex: "id",
      width: 20,
    },
    {
      title: "Tên kỳ",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      width: 100,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (text, record) => (
        <Space size="middle">
          <a style={{ color: "blue" }} onClick={() => getDataEdit(record)}>
            Sửa
          </a>
        </Space>
      ),
    },
  ].filter((item) => item.dataIndex !== "id");

  return (
    <>
      <div className="status">
        <div className="flex-header">
          <h4>Tạo kỳ cho năm học</h4>
          <div style={{ display: "flex" }}>
            {hideButton ? null : (
              <Button
                onClick={() => isHideForm()}
                variant="warning"
                style={{ marginRight: 10, height: 36 }}
              >
                Tạo kỳ học
              </Button>
            )}
          </div>
        </div>
        {hideForm ? (
          <div className="filter" style={{ marginTop: "20px" }}>
            <FSemester
              onFinish={onFinish}
              dataEdit={dataEdit}
              editStatusButton={editStatusButton}
              text={text}
              forms={form}
            />
          </div>
        ) : null}
        <Table dataSource={result} columns={columns} />
      </div>
    </>
  );
};

export default FormSemester;
