import { Col, Form, Input, Row, Button, Select } from "antd";
import { Option } from "antd/lib/mentions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListMajor } from "../../features/majorSlice/majorSlice";
const FormNarrow = ({ onFinish, editStatusButton, text, forms }) => {
  const dispatch = useDispatch();
  const onFinishForm = (values) => {
    if (text.toLowerCase() === "sửa kỳ") {
      onFinish({ ...values, status: 1 });
    } else {
      onFinish(values);
    }
  };

  const { listMajor } = useSelector((state) => state.major);
  useEffect(() => {
    dispatch(getListMajor());
  }, [dispatch]);

  const sethButton = (values) => {
    editStatusButton(values);
  };
  return (
    <>
      <Form form={forms} onFinish={onFinishForm}>
        <Row>
          <Col
            xs={24}
            sm={4}
            md={12}
            lg={8}
            xl={8}
            style={{ padding: "0 10px" }}
          >
            <Form.Item
              name="name"
              label="Tên kỳ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên kỳ học!",
                },
              ]}
            >
              <Input placeholder="Nhập tên chuyên ngành hẹp" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4} md={12} lg={8} xl={8}>
            <Form.Item
              name="majors_id"
              label="Chuyên ngành"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn chuyên ngành!",
                },
              ]}
            >
              <Select placeholder="Chọn chuyên ngành" allowClear>
                {listMajor.map((item) => (
                  <Option value={item._id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Form.Item name="id" style={{ display: "none" }}>
            <Input placeholder="Nhập tên chuyên ngành hẹp" />
          </Form.Item>
          <Col>
            <Form.Item style={{ marginLeft: "20px" }}>
              <Button type="primary" htmlType="submit">
                {text}
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                type="danger"
                onClick={() => sethButton(false)}
              >
                Huỷ
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FormNarrow;
