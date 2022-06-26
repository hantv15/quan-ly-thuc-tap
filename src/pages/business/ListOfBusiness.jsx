import { Col, Row, Select, Table } from "antd";
import { array, bool, object } from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import UpFile from "../../components/ExcelDocument/UpFile";
import { getBusiness } from "../../features/businessSlice/businessSlice";
import { getListMajor } from "../../features/majorSlice/majorSlice";
import { getSemesters } from "../../features/semesters/semestersSlice";
import styles from "./bussiness.module.css";
const { Option } = Select;
const { Column } = Table;
const ListOfBusiness = ({
  infoUser,
  listSemesters,
  defaultSemester,
  listMajors,
  listBusiness,
  loading,
  isMobile,
}) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.campus_id,
    smester_id:
      defaultSemester && defaultSemester._id ? defaultSemester._id : "",
  });
  const [major, setMajor] = React.useState("");
  useEffect(() => {
    dispatch(getSemesters());
    dispatch(getListMajor());
    dispatch(getBusiness(page));
  }, [page, dispatch]);
  const columns = [
    {
      title: "Mã",
      dataIndex: "code_request",
      width: 50,
      fixed: "left",
    },
    {
      title: "Tên doanh nghiệp",
      dataIndex: "name",
      width: 150,
      fixed: "left",
    },
    {
      title: "Vị trí thực tập",
      dataIndex: "internshipPosition",
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
    },

    {
      title: "Địa chỉ thực tập",
      dataIndex: "address",
    },
    {
      title: "Ngành",
      dataIndex: "majors",
      render: (val) => val.name,
    },
    {
      title: "Yêu cầu",
      dataIndex: "request",
      width: 400,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      width: 400,
    },
  ];

  // const handleStandardTableChange = (key, value) => {
  //   const newValue =
  //     value.length > 0 || (value < 11 && value !== '')
  //       ? {
  //           ...filter,
  //           [key]: value,
  //         }
  //       : omit(filter, [key]);
  //   setFiler(newValue);
  // };

  return (
    <div className={styles.status}>
      <Row>
        {isMobile ? (
          <>
            <div className={styles.header_flex}>
              <h1>Doanh nghiệp đăng ký</h1>
            </div>

            <div className={styles.status}>
              <Row>
                <Col span={12}>
                  <Select
                    className="filter-status"
                    onChange={(val) => setMajor(val)}
                    style={{
                      width: "95%",
                    }}
                    placeholder="Chọn ngành"
                  >
                    {listMajors && listMajors?.map((item, index) => (
                      <Option value={item._id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={12}>
                  <Select
                    className="filter-status"
                    placeholder="Chọn kỳ"
                    onChange={(val) =>
                      setPage({
                        ...page,
                        smester_id: val,
                      })
                    }
                    style={{
                      width: "100%",
                    }}
                  >
                    {listSemesters && listSemesters?.map((item, index) => (
                      <Option value={item._id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </div>
          </>
        ) : (
          <>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <h4>Doanh nghiệp đăng ký</h4>
            </Col>
            <Col xs={20} sm={16} md={12} lg={8} xl={4}>
              <Select
                className="filter-status"
                onChange={(val) => setMajor(val)}
                placeholder="Chọn ngành"
              >
                {listMajors && listMajors?.map((item, index) => (
                  <Option value={item._id} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <div
                style={{ display: "grid", gridTemplateColumns: "auto auto" }}
              >
                <div>
                  <Select
                    className="filter-status"
                    placeholder="Chọn kỳ"
                    onChange={(val) =>
                      setPage({
                        ...page,
                        smester_id: val,
                      })
                    }
                  >
                    {listSemesters && listSemesters?.map((item, index) => (
                      <Option value={item._id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div
                  style={{
                    marginLeft: "20px",
                  }}
                >
                  <UpFile
                    keys="business"
                    parentMethods={{
                      ...page,
                      major,
                    }}
                  />
                </div>
              </div>
            </Col>
          </>
        )}
      </Row>
      <div className="filter" style={{ marginTop: "20px" }}>
        {window.innerWidth < 739 && (
          <UpFile
            keys="business"
            parentMethods={{
              ...page,
              major,
            }}
            style={{ fontSize: ".9rem" }}
          />
        )}
        <br />
      </div>
      {!isMobile ? (
        <Table
          pagination={{
            pageSize: page.limit,
            total: listBusiness?.total,
            onChange: (pages, pageSize) => {
              setPage({
                ...page,
                page: pages,
                limit: pageSize,
              });
            },
          }}
          scroll={{ x: "calc(900px + 50%)" }}
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={listBusiness?.list}
        />
      ) : (
        <Table
          pagination={{
            pageSize: page.limit,
            total: listBusiness?.total,
            onChange: (pages, pageSize) => {
              setPage({
                ...page,
                page: pages,
                limit: pageSize,
              });
            },
          }}
          rowKey="_id"
          loading={loading}
          dataSource={listBusiness?.list}
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
              </div>
            ),
          }}
        >
          <Column title="Mssv" dataIndex="mssv" key="_id" />
          <Column title="Họ và Tên" dataIndex="name" key="_id" />
          {window.innerWidth > 739 && window.innerWidth < 1023 && (
            <Column title="Email" dataIndex="email" key="_id" />
          )}
        </Table>
      )}
    </div>
  );
};

ListOfBusiness.propTypes = {
  infoUser: object,
  listSmester: array,
  loading: bool,
  listMajors: array,
};

export default connect(
  ({ auth: { infoUser }, semester, major, business, global }) => ({
    infoUser,
    listSemesters: semester.listSemesters,
    defaultSemester: semester.defaultSemester,
    listMajors: major.listMajor,
    listBusiness: business.listBusiness,
    loading: business.loading,
    isMobile: global.isMobile,
  })
)(ListOfBusiness);
