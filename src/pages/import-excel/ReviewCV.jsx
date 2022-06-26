import React, { useState, useEffect, useRef } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import styles from './review.module.css';
import { Select, Input, Table, Button, message, Row, Col } from 'antd';
import { useSelector, useDispatch, connect } from 'react-redux';
import {
  getListStudentAssReviewer,
  updateReviewerListStudent,
  updateStatusListStudent,
} from '../../features/reviewerStudent/reviewerSlice';
import TextArea from 'antd/lib/input/TextArea';
import { filterBranch, filterStatusCV } from '../../ultis/selectOption';
import { omit } from 'lodash';
import { statusConfigCV } from '../../ultis/constConfig';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import StudentDetail from '../../components/studentDetail/StudentDetail';
import { getLocal } from '../../ultis/storage';
const { Column } = Table;

const { Option } = Select;

const ReviewCV = ({ isMobile }) => {
  const dispatch = useDispatch();
  const [studentdetail, setStudentDetail] = useState('');
  const infoUser = getLocal();
  const {
    listStudentAssReviewer: { total, list },
    loading,
  } = useSelector((state) => state.reviewer);
  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent, setListIdStudent] = useState([]);
  const [listEmailStudent, setListEmailStudent] = useState([]);
  const [status, setStatus] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onShowModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.campus_id,
  });
  const [filter, setFiler] = useState({});
  useEffect(() => {
    const data = {
      ...page,
      ...filter,
    };
    setChooseIdStudent([]);
    dispatch(getListStudentAssReviewer(data));
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
      color: 'blue',
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
      width: 300,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      width: 160,
    },
    {
      title: 'Ngành',
      dataIndex: 'majors',
      width: 100,
    },
    {
      title: 'Số lần hỗ trợ',
      dataIndex: 'numberOfTime',
      width: 120,
    },
    {
      title: 'Phân loại',
      dataIndex: 'support',
      width: 90,
      render: (val) => {
        if (val === 1) {
          return 'Hỗ trợ';
        } else if (val === 0) {
          return 'Tự tìm';
        } else {
          return '';
        }
      },
    },
    {
      title: 'CV',
      dataIndex: 'CV',
      width: 50,
      render: (val) =>
        val ? <EyeOutlined className="icon-cv" onClick={() => window.open(val)} /> : '',
    },
    {
      title: 'Người review',
      dataIndex: 'reviewer',
      width: 230,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusCheck',
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
              Nhận CV
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
      value.length > 0 || (value < 11 && value !== '')
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
    dispatch(getListStudentAssReviewer(data));
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
  const [note, setNote] = useState();
  const selectStatus = (value) => {
    setNote(value);
    setStatus({
      listIdStudent: listIdStudent,
      listEmailStudent: listEmailStudent,
      email: infoUser?.manager?.email,
      status: value,
    });
  };

  const comfirm = () => {
    try {
      dispatch(
        updateStatusListStudent({
          ...status,
          textNote,
        }),
      );
      setChooseIdStudent([]);
      message.success('Thành công');
    } catch (error) {
      message.error('Thất bại');
    }
  };
  const typePingTimeoutRef = useRef(null);
  const [textNote, setTextNote] = useState('');
  const handleNote = ({ target: { value } }) => {
    if (typePingTimeoutRef.current) {
      clearTimeout(typePingTimeoutRef.current);
    }
    typePingTimeoutRef.current = setTimeout(() => {
      setTextNote(value);
    }, 300);
  };

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (list) => {
    const newData = [];

    list.filter((item) => {
      const newObject = {};
      newObject['MSSV'] = item['mssv'];
      newObject['Họ tên'] = item['name'];
      newObject['Email'] = item['email'];
      newObject['Ngành'] = item['majors'];
      newObject['Số điện thoại'] = item['phoneNumber'];
      newObject['Số lần hỗ trợ'] = item['numberOfTime'];
      newObject['CV'] = item['CV'];
      newObject['Trạng thái'] = item['statusCheck'];
      return newData.push(newObject);
    });
    // eslint-disable-next-line array-callback-return
    newData.filter((item) => {
      if (item['Trạng thái'] === 0) {
        item['Trạng thái'] = 0;
        item['Trạng thái'] = 'Chờ kiểm tra';
      } else if (item['Trạng thái'] === 1) {
        item['Trạng thái'] = 1;
        item['Trạng thái'] = 'Sửa lại CV';
      } else if (item['Trạng thái'] === 2) {
        item['Trạng thái'] = 2;
        item['Trạng thái'] = 'Đã nhận CV';
      } else {
      }
    });
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileExtension);
  };

  return (
    <div className={styles.status}>
      <div className={styles.header_flex}>
        <h1>Review CV</h1>
      </div>

      {isMobile ? (
        <>
          <div className={styles.status}>
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
                    style={{ width: '100%'}}
                    onChange={(val) => handleStandardTableChange('statusCheck', val)}
                    placeholder="Lọc theo trạng thái"
                  >
                    {filterStatusCV.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <div className="search">
              <Input
                style={{ width: '100%', marginTop: 20}}
                placeholder="Tìm kiếm theo mã sinh viên"
                onChange={(val) => handleStandardTableChange('mssv', val.target.value)}
              />
            </div>
            <Row
              style={{
                marginTop: 20,
              }}
            >
              <Col span={12}>
                <Button
                type='primary'
                  variant="warning"
                  style={{ width: "95%" }}
                  onClick={(e) => exportToCSV(list)}
                >
                  Export
                </Button>
              </Col>
              <Col span={12}>

              <div>
              <Button
                type='primary'
                style={{ width: "100%"}}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
          
            </div>
              </Col>
            </Row>
            {chooseIdStudent.length > 0 && (
                <div className="comfirm">
                  <Select
                    className="comfirm-click"
                    style={{ width: '100%', marginTop: '10px' }}
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
                      style={{ width: '100%', margin: '10px 0' }}
                      onChange={(e) => selectStatus(e)}
                      placeholder="Chọn trạng thái"
                    >
                      {statusConfigCV.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                  {note === 1 && (
                    <TextArea
                      // value={value}
                      onChange={handleNote}
                      placeholder="Ghi chú..."
                      style={{ marginRight: 10 }}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  )}
                  {Object.keys(status).length > 0 && (
                    <Button style={{ marginRight: 10 }} onClick={() => comfirm()}>
                      Xác nhận
                    </Button>
                  )}
                </div>
              )}
          </div>
        </>
      ) : (
        <>
          <Button
            variant="warning"
            style={{ marginRight: 10, height: 36 }}
            onClick={(e) => exportToCSV(list)}
          >
            Export
          </Button>
          <div className="filter" style={{ marginTop: '20px' }}>
        <Row>
          <Col xs={24} sm={4} md={12} lg={8} xl={8}>
            <div  style={{
                  display: "flex"
                }}  className="search">
              <span style={{ width: '70%', marginRight: '25px' }}>Ngành: </span>
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
                style={{ width: '100%', position: 'relative', right: '46px' }}
                onChange={(val) => handleStandardTableChange('statusCheck', val)}
                placeholder="Lọc theo trạng thái"
              >
                {filterStatusCV.map((item, index) => (
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
              <span style={{ width: '70%' }}>Tìm Kiếm: </span>
              <Input
                style={{ width: '100%', position: 'relative', right: '50px' }}
                placeholder="Tìm kiếm theo mã sinh viên"
                onChange={(val) => handleStandardTableChange('mssv', val.target.value)}
              />
            </div>
          </Col>
          <br />
          <br />
          <Col xs={24} sm={4} md={24} lg={24} xl={12} style={{ padding: '0 10px' }}>
            <div>
              <Button
                style={{ marginTop: '10px', color: '#fff', background: '#ee4d2d' }}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
              {chooseIdStudent.length > 0 && (
                <div className="comfirm">
                  <span>Lựa chọn </span>
                  <Select
                    className="comfirm-click"
                    style={{ width: '100%', marginTop: '10px' }}
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
                      style={{ width: '100%', margin: '10px 0' }}
                      onChange={(e) => selectStatus(e)}
                      placeholder="Chọn trạng thái"
                    >
                      {statusConfigCV.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                  {note === 1 && (
                    <TextArea
                      // value={value}
                      onChange={handleNote}
                      placeholder="Ghi chú..."
                      style={{ marginRight: 10 }}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  )}
                  {Object.keys(status).length > 0 && (
                    <Button style={{ marginRight: 10 }} onClick={() => comfirm()}>
                      Xác nhận
                    </Button>
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
          scroll={{ x: 'calc(1000px + 50%)' }}
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
          //     <div style={{ marginTop: '10px' }}>
          //       {window.innerWidth < 1023 && window.innerWidth > 739 ? (
          //         ''
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
          //         {record.support === 1 && 'Hỗ trợ'}
          //         {record.support === 0 && 'Tự tìm'}
          //         {record.support !== 1 && record.support !== 0 && ''}
          //       </p>
          //       <br />
          //       <p className="list-detail">
          //         CV:{' '}
          //         {record.CV ? (
          //           <EyeOutlined
          //             style={{ fontSize: '.9rem' }}
          //             onClick={() => window.open(record.CV)}
          //           />
          //         ) : (
          //           ''
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
export default connect(({ global }) => ({
  isMobile: global.isMobile,
}))(ReviewCV);
