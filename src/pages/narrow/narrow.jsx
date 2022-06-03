/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Table, message, Space, Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NarrowAPI from "../../API/NarrowAPI";
import { getListNarrow } from "../../features/narrowSlice/narrowSlice";
import { getSemesters } from "../../features/semesters/semestersSlice";
import FormNarrow from "./formNarrow";
const Narrow = () => {
  const dispatch = useDispatch();
  const [spin, setSpin] = useState(false);
  const [hideForm, setHideForm] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [text, setText] = useState("Thêm kỳ");
  const [dataEdit, setDataEdit] = useState({});
  const [form] = Form.useForm();
  const { listNarrow } = useSelector((state) => state.narrow);
  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const result = listNarrow.map((item) => ({
    id: item._id,
    name: capitalizeFirstLetter(item.name),
    major: item.majors_id.name,
    major_id: item.majors_id._id,
  }));

  const onFinish = async (values) => {
    setSpin(true);
    try {
      if (values.status === 1) {
        let data = {
          id: values.id.id,
          name: values.name,
          major_id: values.major_id,
        };
        const res = await NarrowAPI.updateNarrow(data);
        if (res) {
          message.success("Sửa ngành hẹp thành công");
        }
      } else {
        const res = await NarrowAPI.insertNarrow(values);
        if (res) {
          message.success("Thêm ngành hẹp thành công");
        }
      }
    } catch (error) {
      const dataErr = error.response.data.message;
      message.error(dataErr);
    }
    setHideForm(false);
    setSpin(false);
  };

  // sửa kỳ
  const getDataEdit = (value) => {
    setHideForm(true);
    form.setFieldsValue({
      id: value,
      name: value.name,
      major: value.major,
      majors_id: value.major_id,
    });
    setHideButton(true);
    setText("Sửa ngành hẹp");
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
    dispatch(getListNarrow());
  }, [dispatch, hideForm]);

  const columns = [
    {
      dataIndex: "id",
      width: 20,
    },
    {
      title: "Tên chuyên ngành hẹp",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Thuộc chuyên ngành",
      dataIndex: "major",
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
      <Spin spinning={spin}>
        <div className="status">
          <div className="flex-header">
            <h4>Danh sách chuyên ngành hẹp</h4>
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
              <FormNarrow
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
      </Spin>
    </>
  );
};

export default Narrow;
