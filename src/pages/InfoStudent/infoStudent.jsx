import React, { useEffect } from "react";
import { Row, Col, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/lib/input/TextArea";
import { getStudentId } from "../../features/cumpusSlice/cumpusSlice";
import { optionStatus } from "../../ultis/selectOption";
const columns = [
  {
    title: "Doanh nghiệp",
    dataIndex: "company",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
];
const data = [
  {
    key: "1",
    company: "Công ty A",
    quantity: 32,
    address: "Hà Nội",
  },
  {
    key: "2",
    company: "Công ty B",
    quantity: 42,
    address: "Hà Nội",
  },
  {
    key: "3",
    company: "Công ty C",
    quantity: 32,
    address: "Hà Nội",
  },
  {
    key: "4",
    company: "Công ty D",
    quantity: 0,
    address: "Hà Nội",
  },
]; // rowSelection object indicates the need for row selection
function InfoStudent() {
  const dispatch = useDispatch();
  const { student } = useSelector((state) => state.cumpus);
  const { infoUser } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getStudentId(infoUser.student.mssv));
  }, [infoUser]);
  const isRegister = student?.support;
  const statusForm = student?.statusCheck;
  return (
    <div>
      <Row>
        <Col span={10} className=" border-end p-2">
          <div>
            <h4>Thông tin đăng ký</h4>
          </div>
          <div className="border-top mt-3 pt-2">
            <p>Họ và tên : {student.name}</p>
            <p>Ngành : {student.majors}</p>
            <p>Khóa học : {student.course}</p>
            <p>Email : {student.email}</p>
            <p>
              Lựa chọn :{" "}
              {isRegister === 0
                ? "Tự tìm nơi thực tập"
                : "" || isRegister === 1
                ? "Nhận hỗ trợ từ nhà trường"
                : ""}
            </p>
            <p>
              Trạng thái SV :{" "}
              {optionStatus.map((index) => {
                if (index.value === statusForm) {
                  return index.title
                }
              })}{" "}
            </p>
          </div>
        </Col>
        <Col span={10} className="ms-5 p-2">
          <h4>Chọn công ty</h4>
          <div>
            <Table rowKey="title" columns={columns} dataSource={data} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24} className=" mt-2 border-top ms-2">
          <h4 className="mt-2">Ghi chú</h4>
          <TextArea
            disabled={true}
            rows={10}
            value={student.note}
            className="text-dark"
          ></TextArea>
        </Col>
      </Row>
    </div>
  );
}

export default InfoStudent;
