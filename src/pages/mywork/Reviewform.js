import React, { useState, useEffect, useRef } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import styles from './mywork.module.css';
import { Select, Input, Table, Button, message, Row, Col } from 'antd';
import { useDispatch, connect } from 'react-redux';
import {
  listStudentForm,
  updateReviewerListStudent,
  updateStatusListStudent,
} from '../../features/reviewerStudent/reviewerSlice';
import { filterBranch, filterStatusForm } from '../../ultis/selectOption';
import { omit } from 'lodash';
import { statusConfigForm } from '../../ultis/constConfig';
import TextArea from 'antd/lib/input/TextArea';
import { bool, object } from 'prop-types';
import StudentDetail from '../../components/studentDetail/StudentDetail';
const { Column } = Table;
const { Option } = Select;
const Reviewform = ({ infoUser, listStudentAssReviewer: { total, list }, loading, isMobile }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState({});
  const [note, setNote] = useState();
  const typePingTimeoutRef = useRef(null);
  const [textNote, setTextNote] = useState('');
  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent, setListIdStudent] = useState([]);
  const [listEmailStudent, setListEmailStudent] = useState([]);
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.campus_id,
  });
  const [studentdetail, setStudentDetail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onShowModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const [filter, setFiler] = useState({});
  useEffect(() => {
    const data = {
      ...page,
      ...filter,
    };
    dispatch(listStudentForm(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onShowDetail = (mssv, key) => {
    onShowModal();
    setStudentDetail(key._id);
  };

  const columns = [
    {
      title: 'MSSV',
      dataIndex: 'mssv',
      width: 100,
      fixed: 'left',
      render: (val, key) => {
        return (
          <p style={{ margin: 0, cursor: 'pointer' }} onClick={() => onShowDetail(val, key)}>
            <EyeOutlined className="icon-cv" style={{ marginRight: '5px', color: 'blue' }} />
            {val}
          </p>
        );
      },
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      width: 160,
    },
    {
      title: 'Tên công ty',
      width: 180,
      render: (val, record) => {
        if (record.support === 1) {
          return record.business?.name;
        } else {
          return record.nameCompany;
        }
      },
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxCode',
      width: 100,
    },
    {
      title: 'Biên bản',
      dataIndex: 'form',
      width: 100,
      render: (val) =>
        val ? (
          <Button
            type="text"
            icon={<EyeOutlined className="icon-cv" />}
            onClick={() => window.open(val)}
          />
        ) : (
          ''
        ),
    },
    {
      title: 'Người review',
      dataIndex: 'reviewer',
      render: (val) => val && val.slice(0, -11),
      width: 200,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: 200,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'internshipTime',
      width: 230,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusCheck',
      width: 150,
      render: (status) => {
        if (status === 0) {
          return (
            <span className="status-fail" style={{ color: 'orange' }}>
              Chờ kiểm tra
            </span>
          );
        } else if (status === 1) {
          return (
            <span className="status-up" style={{ color: 'grey' }}>
              Sửa lại CV
            </span>
          );
        } else if (status === 2) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Chờ nộp biên bản
            </span>
          );
        } else if (status === 3) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Trượt
            </span>
          );
        } else if (status === 4) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Đã nộp biên bản <br />
            </span>
          );
        } else if (status === 5) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Sửa biên bản <br />
            </span>
          );
        } else if (status === 6) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Đang thực tập <br />
            </span>
          );
        } else if (status === 7) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Đã nộp báo cáo <br />
            </span>
          );
        } else if (status === 8) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Sửa báo cáo <br />
            </span>
          );
        } else if (status === 9) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Hoàn thành <br />
            </span>
          );
        } else {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Chưa đăng ký
            </span>
          );
        }
      },
    },
  ];
  // xóa tìm kiếm
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListIdStudent(selectedRowKeys);
      setListEmailStudent(selectedRows);
      setChooseIdStudent(selectedRows);
    },
  };

  const handleStandardTableChange = (key, value) => {
    const newValue =
      value.length > 0 || (value > 0 && value !== '')
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
    dispatch(listStudentForm(data));
  };
  const actionOnchange = (value) => {
    switch (value) {
      case 'assgin':
        try {
          dispatch(
            updateReviewerListStudent({
              listIdStudent: listIdStudent,
              email: infoUser?.manager?.email,
            }),
          );
          setStatus([]);
          message.success('Thành công');
        } catch (error) {
          message.error('Thất bại');
        }
        break;
      case 'edit':
        setStatus({
          listIdStudent: listIdStudent,
          email: infoUser?.manager?.email,
        });
        break;

      default:
        break;
    }
  };
  const selectStatus = (value) => {
    setNote(value);
    if (value === 1) {
      let id = [];
      chooseIdStudent.filter((item) => item.support === 1).map((item) => id.push(item._id));
      setStatus({
        listIdStudent: id,
        email: infoUser?.manager?.email,
        status: value,
      });
    } else {
      setStatus({
        listIdStudent: listIdStudent,
        listEmailStudent: listEmailStudent,
        email: infoUser?.manager?.email,
        status: value,
      });
    }
  };
  const comfirm = () => {
    dispatch(
      updateStatusListStudent({
        ...status,
        textNote,
      }),
    );
    setChooseIdStudent([]);
  };

  const handleNote = ({ target: { value } }) => {
    if (typePingTimeoutRef.current) {
      clearTimeout(typePingTimeoutRef.current);
    }
    typePingTimeoutRef.current = setTimeout(() => {
      setTextNote(value);
    }, 300);
  };
  return (
    <div className={styles.status}>
      <div className={styles.header_flex}>
        <h1>Review biên Bản</h1>
      </div>

      {isMobile ? (
        <>
          <Row>
            <Col span={12}>
              <div className="search">
                <Select
                  style={{ width: '95%' }}
                  onChange={(val) => handleStandardTableChange('majors', val)}
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
            <Col span={12}>
              <div className="search">
                <Select
                  className="filter-status"
                  style={{ width: '100%' }}
                  onChange={(val) => handleStandardTableChange('statusCheck', val)}
                  placeholder="Lọc theo trạng thái"
                >
                  {filterStatusForm.map((item, index) => (
                    <Option value={item.id} key={index}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>

          <Row style={{
            marginTop:20
          }} >
            <Col span={12}>
            <div className="search">
              <Input
                style={{ width: '95%' }}
                placeholder="Tìm kiếm theo mã sinh viên"
                onChange={(val) => handleStandardTableChange('mssv', val.target.value)}
              />
            </div>
            </Col>
            <Col span={12}>
            <Button
                type='primary'
                onClick={handleSearch}
                style={{
                  width: "100%"
                }}
              >
                Tìm kiếm
              </Button>


            </Col>
          </Row>
        </>
      ) : (
        <>
        <div className="filter" style={{ marginTop: '20px' }}>
        <Row>
          <Col xs={24} sm={4} md={12} lg={8} xl={8}>
            <div style={{
              display: "flex"
            }} className="search">
              <span style={{ width: '70%', marginRight: '35px' }}>Ngành: </span>
              <Select
                style={{ width: '100%', position: 'relative', right: '70px' }}
                onChange={(val) => handleStandardTableChange('majors', val)}
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
          <Col xs={24} sm={4} md={12} lg={8} xl={8}>
            <div style={{
              display: "flex"
            }}  className="search">
              <span style={{ width: '65%' }}>Trạng thái:</span>
              <Select
                className="filter-status"
                style={{ width: '100%', position: 'relative', right: '44px' }}
                onChange={(val) => handleStandardTableChange('statusCheck', val)}
                placeholder="Lọc theo trạng thái"
              >
                {filterStatusForm.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <br />
          <br />
          <Col xs={24} sm={4} md={12} lg={8} xl={8}>
            <div style={{
              display: "flex"
            }}  className="search">
              <span style={{ width: '65%' }}>Tìm Kiếm: </span>
              <Input
                style={{ width: '100%', position: 'relative', right: '40px' }}
                placeholder="Tìm kiếm theo mã sinh viên"
                onChange={(val) => handleStandardTableChange('mssv', val.target.value)}
              />
            </div>
          </Col>
          <br />
          <br />
          <Col xs={24} sm={4} md={24} lg={24} xl={16} style={{ padding: '0 10px' }}>
            <div>
              <Button
                style={{
                  marginTop: '10px',
                  color: '#fff',
                  background: '#ee4d2d',
                }}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
              {chooseIdStudent.length > 0 && (
                <div className="comfirm">
                  <span style={{ width: '40%' }}>Lựa chọn </span>
                  <Select
                    className="comfirm-click"
                    style={{ width: '100%' }}
                    onChange={actionOnchange}
                    placeholder="Chọn"
                  >
                    <Option value="assgin" key="1">
                      Kéo việc
                    </Option>
                    <Option value="edit" key="2">
                      Cập nhật trạng thái
                    </Option>
                  </Select>

                  {Object.keys(status).length >= 1 && (
                    <Select
                      className="upload-status"
                      style={
                        window.innerWidth > 1024
                          ? { width: '100%', margin: '10px' }
                          : { width: '100%', margin: '10px 0' }
                      }
                      onChange={(e) => selectStatus(e)}
                      placeholder="Chọn trạng thái"
                    >
                      {statusConfigForm.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                  {note === 1 || note === 5 ? (
                    <TextArea
                      // value={value}
                      onChange={handleNote}
                      placeholder="Ghi chú..."
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  ) : null}
                  {Object.keys(status).length > 0 && (
                    <Button onClick={() => comfirm()}>Xác nhận</Button>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>

        </>
      )}
 
      {window.innerWidth > 1024 ? (
        <Table
          rowSelection={{
            type: 'checkbox',
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
          scroll={{ x: 'calc(700px + 50%)' }}
        />
      ) : (
        <Table
          rowSelection={{
            type: 'checkbox',
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
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <div style={{ marginTop: "10px" }}>
          //       {window.innerWidth < 1023 && window.innerWidth > 739 ? (
          //         ""
          //       ) : (
          //         <>
          //           <p className="list-detail">Email: {record.email}</p>
          //           <br />
          //         </>
          //       )}
          //       <p className="list-detail">Điện thoại: {record.phoneNumber}</p>
          //       <br />
          //       <p className="list-detail">Ngành: {record.majors}</p>
          //       <br />
          //       <p className="list-detail">
          //         Phân loại:
          //         {record.support === 1 && "Hỗ trợ"}
          //         {record.support === 0 && "Tự tìm"}
          //         {record.support !== 1 && record.support !== 0 && ""}
          //       </p>
          //       <br />
          //       <p className="list-detail">
          //         CV:{" "}
          //         {record.CV ? (
          //           <EyeOutlined
          //             style={{ fontSize: ".9rem" }}
          //             onClick={() => window.open(record.CV)}
          //           />
          //         ) : (
          //           ""
          //         )}
          //       </p>
          //       <br />
          //       <p className="list-detail">Người review: {record.reviewer}</p>
          //       <br />
          //     </div>
          //   ),
          // }}
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
                  <span className="status-fail" style={{ color: 'orange' }}>
                    Chờ kiểm tra
                  </span>
                );
              } else if (status === 1) {
                return (
                  <span className="status-up" style={{ color: 'grey' }}>
                    Sửa lại CV
                  </span>
                );
              } else if (status === 2) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Nhận CV
                  </span>
                );
              } else if (status === 3) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Trượt
                  </span>
                );
              } else if (status === 4) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Đã nộp biên bản <br />
                  </span>
                );
              } else if (status === 5) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Sửa biên bản <br />
                  </span>
                );
              } else if (status === 6) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Đang thực tập <br />
                  </span>
                );
              } else if (status === 7) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Đã nộp báo cáo <br />
                  </span>
                );
              } else if (status === 8) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Sửa báo cáo <br />
                  </span>
                );
              } else if (status === 9) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Hoàn thành <br />
                  </span>
                );
              } else {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Chưa đăng ký
                  </span>
                );
              }
            }}
          />
        </Table>
      )}
      {isModalVisible && <StudentDetail studentId={studentdetail} onShowModal={onShowModal} />}
    </div>
  );
};

Reviewform.propTypes = {
  infoUser: object,
  loading: bool,
  listStudentAssReviewer: object,
};

export default connect(
  ({ auth: { infoUser }, reviewer: { listStudentAssReviewer, loading }, global }) => ({
    listStudentAssReviewer,
    infoUser,
    loading,
    isMobile: global.isMobile,
  }),
)(Reviewform);
