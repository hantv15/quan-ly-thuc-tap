import { EyeOutlined } from "@ant-design/icons";
import { Select } from "antd";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudent } from "../../features/todoSlide/studentModel";
import { filterBranch, filterStatus, status } from "../../ultis/selectOption";
import constConfig from "../../ultis/constConfig";
import StandardTable from "../../components/StandardTable";
const { Option } = Select;

export default function Status() {
  const { listStudent } = useSelector((state) => state.student);
  const [type, setType] = React.useState({});
  const showCV = (cv) => {
    window.open(cv);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStudent());
  }, [dispatch]);
  const columns = [
    {
      title: "Mã sinh viên",
      dataIndex: "mssv",
      fixed: "left",
      width: 120,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      fixed: "left",
      width: 160,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 250,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 140,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 250,
    },
    {
      title: "Ngành thực tập",
      dataIndex: "internship_industry",
      width: 200,
    },
    {
      title: "CV",
      dataIndex: "link_cv",
      width: 60,
      render: (val) => (
        <EyeOutlined className="icon-cv" onClick={() => showCV(val)} />
      ),
    },
    {
      title: "Review",
      dataIndex: "link_cv",
      width: 130,
      render: (val) => "LÊ trọng đạt",
    },
    {
      title: "Phân loại",
      dataIndex: "link_cv",
      width: 150,
      render: (val) => "LÊ trọng đạt",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (val) =>
        status.map((item) => {
          if (val === item.value) {
            return (
              <span className={item.className} style={item.style}>
                {item.title}
              </span>
            );
          }
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (val) =>
        status.map((item) => {
          if (val === item.value) {
            return (
              <span className={item.className} style={item.style}>
                {item.title}
              </span>
            );
          }
        }),
    },
  ];

  const filterMajors = useCallback((key, value) => {
    const newValue = { ...type, [key]: value };
    setType(newValue);
    const range = JSON.stringify([0, constConfig.PAGE_SIZE - 1]);
    //callAction
    // dispatch({
    //     type: 'dsd',
    //     payload:{range, filter: JSON.stringify(newValue)}
    // })
  });
  const renderForm = () => (
    <>
      <Select
        style={{ width: 200 }}
        onChange={(val) => filterMajors("filter_branch", val)}
        placeholder="Lọc theo ngành"
      >
        {filterBranch.map((item, index) => (
          <Option key={index} value={item.value}>
            {item.title}
          </Option>
        ))}
      </Select>

      <Select
        style={{ width: 200, marginLeft: "20px" }}
        onChange={(val) => filterMajors("filter_status", val)}
        placeholder="Lọc theo ngành"
      >
        {filterStatus.map((item, index) => (
          <Option key={index} value={index++}>
            {item.title}
          </Option>
        ))}
      </Select>

      <Select
        style={{ width: 200, marginLeft: "20px" }}
        onChange={(val) => filterMajors("filter_classify", val)}
        placeholder="Phân loại"
      >
        <Option value={0}>Tất cả</Option>
        <Option value={1}>Tự tìm</Option>
        <Option value={2}>Hỗ trợ</Option>
      </Select>
    </>
  );

  return (
    <>
      {renderForm()}
      <StandardTable
        scroll={{
          x: 1200,
        }}
        rowkey="id"
        columns={columns}
        dataSource={listStudent}
        typeRow="checkbox"
      />
    </>
  );
}
