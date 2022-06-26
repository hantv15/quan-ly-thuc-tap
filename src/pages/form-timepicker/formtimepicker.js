import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, message, Row, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getListTime,
  upTimeDate,
} from "../../features/timeDateSlice/timeDateSlice";
import moment from "moment";
import styles from "./formTimePicker.module.css";

const Formtimepicker = () => {
  const { RangePicker } = DatePicker;
  const {
    formTime: { times },
    loading,
  } = useSelector((state) => state.time);
  console.log(times);
  const [date, setDate] = useState(new Date().getTime());
  const dispatch = useDispatch();
  const onSetDatePicker = (date) => {
    setDate(date);
  };

  useEffect(() => {
    dispatch(getListTime());
  }, [dispatch]);

  const onSaveTime = async (typeNumber) => {
    console.log(typeNumber);
    const startTime = date[0]._d.getTime();
    const endTime = date[1]._d.getTime();
    const timeObject = {
      typeNumber: Number(typeNumber),
      startTime: startTime,
      endTime: endTime,
    };
    try {
      await dispatch(upTimeDate(timeObject));
      message.success("Thành công");
      dispatch(getListTime());
    } catch (error) {
      message.error("Thất bại");
    }
  };
  return (
    <div>
      <h3 style={{ marginBottom: 40, color: "#3c3c3c" ,textAlign:'center' }}>
      Quản lý thời gian các tính năng cho sinh viên
      </h3>
      <Spin spinning={loading} />
      <Row gutter={[16, 20]}>
        <Col lg={13} sm={24}>
          {times?.length > 0 &&
            times.map((item, index) => {
              return (
                <Row
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 30,
                  }}
                >
                  <Col lg={7} sm={7} xs={7}>
                    <span className={styles.typeName}>{item?.typeName}:</span>
                  </Col>
                  <Col lg={11} sm={11} xs={11}>
                    <RangePicker
                      className={styles.RangePicker}
                      onChange={onSetDatePicker}
                      renderExtraFooter={() => "extra footer"}
                      showTime
                    />
                  </Col>
                  <Col lg={6} sm={6} xs={6}>
                    <Button
                      className={styles.button}
                      onClick={() => onSaveTime(item?.typeNumber)}
                      type="primary"
                    >
                      Đặt thời gian
                    </Button>
                  
                  </Col>
                </Row>
              );
            })}
        </Col>

        <Col lg={11} sm={24} style={{ paddingTop: 10 }}>
          <table>
            <thead>
              <tr>
                <th>Loại hình đặt thời gian</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian gian kết thúc</th>
              </tr>
            </thead>
            <tbody>
              {times?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className={styles.typeName}>{item?.typeName}</td>
                    <td>
                      {moment(item?.startTime).format("hh:mm:ss | DD-MM-YYYY")}
                    </td>
                    <td>
                      {moment(item?.endTime).format("hh:mm:ss | DD-MM-YYYY")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Col>
      </Row>
    </div>
  );
};

Formtimepicker.propTypes = {};

export default Formtimepicker;
