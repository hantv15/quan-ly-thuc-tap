import { Col, DatePicker, Form, Input, Row, Button } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSemesters } from "../../features/semesters/semestersSlice";
import moment from "moment";
const { RangePicker } = DatePicker;
const FSemester = ({ onFinish, editStatusButton, text, forms }) => {
  const dispatch = useDispatch();
  const onFinishForm = (values) => {
    if (text.toLowerCase() === "sửa kỳ") {
      onFinish({ ...values, status: 1 });
    } else {
      onFinish(values);
    }
  };

  const { listSemesters } = useSelector((state) => state.semester);

  useEffect(() => {
    dispatch(getSemesters());
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
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4} md={12} lg={8} xl={8}>
            <Form.Item
              name="time"
              label="Thời gian bắt đầu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời gian của kỳ học!",
                },
              ]}
            >
              <RangePicker
                disabledDate={(current) => {
                  return (
                    current &&
                    new Date(current).getTime() <
                      new Date(
                        listSemesters[listSemesters.length - 1]?.end_time
                      ).getTime()
                  );
                }}
              />
            </Form.Item>
          </Col>
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

export default FSemester;
