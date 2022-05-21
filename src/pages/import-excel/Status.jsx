import { EyeOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select, Table } from "antd";
import Column from "antd/lib/table/Column";
import * as FileSaver from "file-saver";
import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../common/styles/status.css";
import { updateReviewerListStudent } from "../../features/reviewerStudent/reviewerSlice";
import {
  getSmester,
  getStudent,
} from "../../features/StudentSlice/StudentSlice";
import { filterBranch, filterStatuss } from "../../ultis/selectOption";
import UpFile from "../../components/ExcelDocument/UpFile";
import StudentDetail from "../../components/studentDetail/StudentDetail";
import SemestersAPI from "../../API/SemestersAPI";
import { object } from "prop-types";
const { Option } = Select;

const Status = ({
  listStudent: {list, total},
  infoUser,
  loading,
  listSmester
}) => {
  const [studentdetail, setStudentDetail] = useState("");
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onShowModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent, setListIdStudent] = useState([]);
  const [defaultSmester, setDefaultSmester] = useState({});
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.campus_id,
  });

  const [filter, setFiler] = useState();
  const onShowDetail = (mssv, key) => {
    onShowModal();
    setStudentDetail(key._id);
  };

  useEffect(() => {
    SemestersAPI.getDefaultSemester().then((data) => {
      if (data) {
        setDefaultSmester(data.data);
        dispatch(
          getStudent({
            ...page,
            ...filter,
            smester_id: data.data._id,
          })
        );
      }
    });

    dispatch(getSmester());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, infoUser]);

  const columns = [
    {
      title: "MSSV",
      dataIndex: "mssv",
      width: 100,
      fixed: "left",
      render: (val, key) => {
        return (
          <p
            style={{ margin: 0, cursor: "pointer" }}
            onClick={() => onShowDetail(val, key)}
          >
            <EyeOutlined
              className="icon-cv"
              style={{ marginRight: "5px", color: "blue" }}
            />
            {val}
          </p>
        );
      },
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
      width: 150,
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      width: 160,
    },
    {
      title: "Ngành",
      dataIndex: "majors",
      width: 100,
    },
    {
      title: "Phân loại",
      dataIndex: "support",
      width: 90,
      render: (val) => {
        if (val === 1) {
          return "Hỗ trợ";
        } else if (val === 0) {
          return "Tự tìm";
        } else {
          return "";
        }
      },
    },
    {
      title: "CV",
      dataIndex: "CV",
      width: 50,
      render: (val) =>
        val ? (
          <EyeOutlined className="icon-cv" onClick={() => window.open(val)} />
        ) : (
          ""
        ),
    },
    {
      title: "Người review",
      dataIndex: "reviewer",
      width: 230,
    },
    {
      title: "Trạng thái",
      dataIndex: "statusCheck",
      render: (status) => {
        if (status === 0) {
          return (
            <span className="status-fail" style={{ color: "orange" }}>
              Chờ kiểm tra
            </span>
          );
        } else if (status === 1) {
          return (
            <span className="status-up" style={{ color: "grey" }}>
              Sửa lại CV
            </span>
          );
        } else if (status === 2) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Nhận CV
            </span>
          );
        } else if (status === 3) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Trượt
            </span>
          );
        } else if (status === 4) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Đã nộp biên bản <br />
            </span>
          );
        } else if (status === 5) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Sửa biên bản
              <br />
            </span>
          );
        } else if (status === 6) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Đang thực tập <br />
            </span>
          );
        } else if (status === 7) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Đã nộp báo cáo <br />
            </span>
          );
        } else if (status === 8) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Sửa báo cáo <br />
            </span>
          );
        } else if (status === 9) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Hoàn thành <br />
            </span>
          );
        } else {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Chưa đăng ký
            </span>
          );
        }
      },
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListIdStudent(selectedRowKeys);
      setChooseIdStudent(selectedRows);
    },
  };
  const handleStandardTableChange = (key, value) => {
    const newValue =
      value.length > 0 || (value < 11 && value !== "")
        ? {
            ...filter,
            [key]: value,
          }
        : omit(filter, [key]);
    setFiler(newValue);
  };
  const handleSearch = () => {
    const data = {
      ...page,
      ...filter,
    };
    dispatch(getStudent(data));
  };

  const comfirm = () => {
    dispatch(
      updateReviewerListStudent({
        listIdStudent: listIdStudent,
        email: infoUser?.manager?.email,
      })
    );
    alert("Thêm thành công ");
    navigate("/review-cv");
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (list) => {
    const newData = [];

    list.filter((item) => {
      const newObject = {};
      newObject["MSSV"] = item["mssv"];
      newObject["Họ tên"] = item["name"];
      newObject["Email"] = item["email"];
      newObject["Ngành"] = item["majors"];
      newObject["Số điện thoại"] = item["phoneNumber"];
      newObject["Tên công ty"] = item["nameCompany"];
      newObject["Địa chỉ công ty"] = item["addressCompany"];
      newObject["Mã số thuế"] = item["taxCode"];
      newObject["Vị trí thực tập"] = item["position"];
      newObject["Điểm thái độ"] = item["attitudePoint"];
      newObject["Điểm kết quả"] = item["resultScore"];
      newObject["Thời gian thực tập"] = item["internshipTime"];
      newObject["Hình thức"] = item["support"];
      return newData.push(newObject);
    });
    // eslint-disable-next-line array-callback-return
    newData.filter((item) => {
      if (item["Hình thức"] === 1) {
        item["Hình thức"] = 1;
        item["Hình thức"] = "Hỗ trợ";
      } else if (item["Hình thức"] === 0) {
        item["Hình thức"] = 0;
        item["Hình thức"] = "Tự tìm";
      } else {
      }
    });
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileExtension);
  };

  return (
    <div className="status">
      <div className="flex-header">
        {window.innerWidth < 739 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4 style={{ fontSize: ".9rem" }}>Sinh viên đăng ký thực tập</h4>
            <Button
              variant="warning"
              style={{ marginRight: 10, height: 36 }}
              onClick={(e) => exportToCSV(list)}
            >
              Export
            </Button>
          </div>
        ) : (
          <>
            <h4>Sinh viên đăng ký thực tập</h4>
            <div style={{ display: "flex" }}>
              <Button
                variant="warning"
                style={{ marginRight: 10, height: 36 }}
                onClick={(e) => exportToCSV(list)}
              >
                Export
              </Button>
              <UpFile keys="status" smester_id={filter?.smester_id} />
            </div>
          </>
        )}
      </div>
      <div className="filter" style={{ marginTop: "20px" }}>
        {window.innerWidth < 739 && <UpFile style={{ fontSize: ".9rem" }} />}
        <br />
        <Row>
          <Col span={6} style={{ padding: "0 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ width: "30%" }}>Ngành : </span>
              <Select
                style={{ width: "100%" }}
                onChange={(val) => handleStandardTableChange("majors", val)}
                placeholder="Lọc theo ngành"
              >
                {filterBranch.map((item, index) => (
                  <>
                    <Option value={item.value} key={index}>
                      {item.title}
                    </Option>
                  </>
                ))}
              </Select>
            </div>
          </Col>
          <br />
          <br />
          <Col span={6} style={{ padding: "0 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ width: "45%" }}>Trạng thái :</span>
              <Select
                className="filter-status"
                style={{ width: "100%" }}
                onChange={(val) =>
                  handleStandardTableChange("statusCheck", val)
                }
                placeholder="Lọc theo trạng thái"
              >
                {filterStatuss.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <br />
          <br />
          <Col span={5} style={{ padding: "0 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ width: "45%" }}>Học Kỳ : </span>
              <Select
                className="filter-status"
                style={{ width: "100%" }}
                onChange={(val) => handleStandardTableChange("smester_id", val)}
                defaultValue={defaultSmester._id}
                placeholder={defaultSmester.name}
              >
                {listSmester.map((item, index) => (
                  <Option value={item._id} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <br />
          <br />
          <Col span={7} style={{ padding: "0 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ width: "40%" }}>Tìm Kiếm: </span>
              <Input
                style={{ width: "100%" }}
                placeholder="Tìm kiếm theo mã sinh viên"
                onChange={(val) =>
                  handleStandardTableChange("mssv", val.target.value.trim())
                }
              />
            </div>
          </Col>
          <br />
          <br />
          <Col
            xs={24}
            sm={4}
            md={24}
            lg={24}
            xl={4}
            style={{ padding: "0 10px" }}
          >
            <Button
              style={{
                marginTop: "10px",
                color: "#fff",
                background: "#ee4d2d",
              }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>

            {chooseIdStudent.length > 0 && (
              <Button
                style={{
                  marginTop: "10px",
                  color: "#fff",
                  background: "#ee4d2d",
                }}
                onClick={() => comfirm()}
              >
                Xác nhận
              </Button>
            )}
          </Col>
        </Row>
      </div>

      {window.innerWidth > 1024 ? (
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          pagination={{
            pageSize: page.limit,
            total: total,
            onChange: (page, pageSize) => {
              setPage({
                page: page,
                limit: pageSize,
                campus_id: infoUser.manager.cumpus,
                ...filter,
              });
            },
          }}
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={list}
          scroll={{ x: "calc(700px + 50%)" }}
        />
      ) : (
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          pagination={{
            pageSize: page.limit,
            total: total,
            onChange: (page, pageSize) => {
              setPage({
                page: page,
                limit: pageSize,
                campus_id: infoUser.manager.cumpus,
                ...filter,
              });
            },
          }}
          rowKey="_id"
          loading={loading}
          dataSource={list}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ marginTop: "10px" }}>
                {window.innerWidth < 1023 && window.innerWidth > 739 ? (
                  ""
                ) : (
                  <>
                    <p className="list-detail">Email: {record.email}</p>
                    <br />
                  </>
                )}
                <p className="list-detail">Điện thoại: {record.phoneNumber}</p>
                <br />
                <p className="list-detail">Ngành: {record.majors}</p>
                <br />
                <p className="list-detail">
                  Phân loại:
                  {record.support === 1 && "Hỗ trợ"}
                  {record.support === 0 && "Tự tìm"}
                  {record.support !== 1 && record.support !== 0 && ""}
                </p>
                <br />
                <p className="list-detail">
                  CV:{" "}
                  {record.CV ? (
                    <EyeOutlined
                      style={{ fontSize: ".9rem" }}
                      onClick={() => window.open(record.CV)}
                    />
                  ) : (
                    ""
                  )}
                </p>
                <br />
                <p className="list-detail">Người review: {record.reviewer}</p>
                <br />
              </div>
            ),
          }}
        >
          <Column title="Mssv" dataIndex="mssv" key="_id" />
          <Column title="Họ và Tên" dataIndex="name" key="_id" />
          {window.innerWidth > 739 && window.innerWidth < 1023 && (
            <Column title="Email" dataIndex="email" key="_id" />
          )}
          <Column
            title="Trạng thái"
            dataIndex="statusCheck"
            key="_id"
            render={(status) => {
              if (status === 0) {
                return (
                  <span className="status-fail" style={{ color: "orange" }}>
                    Chờ kiểm tra
                  </span>
                );
              } else if (status === 1) {
                return (
                  <span className="status-up" style={{ color: "grey" }}>
                    Sửa lại CV
                  </span>
                );
              } else if (status === 2) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Nhận CV
                  </span>
                );
              } else if (status === 3) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Trượt
                  </span>
                );
              } else if (status === 4) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Đã nộp biên bản <br />
                  </span>
                );
              } else if (status === 5) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Sửa biên bản <br />
                  </span>
                );
              } else if (status === 6) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Đang thực tập <br />
                  </span>
                );
              } else if (status === 7) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Đã nộp báo cáo <br />
                  </span>
                );
              } else if (status === 8) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Sửa báo cáo <br />
                  </span>
                );
              } else if (status === 9) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Hoàn thành <br />
                  </span>
                );
              } else {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Chưa đăng ký
                  </span>
                );
              }
            }}
          />
        </Table>
      )}
      {isModalVisible && (
        <StudentDetail studentId={studentdetail} onShowModal={onShowModal} />
      )}
    </div>
  );
};

Status.propTypes ={
  listStudent: object,
  infoUser:object
}

export default connect(({
  students, auth
}) => ({
  listStudent: students.listStudent,
  infoUser: auth.infoUser,
  listSmester: students.listSmester,
  loading: students.loading
}))(Status);
