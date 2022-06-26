/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Table, message, Space, Form, Drawer, DatePicker, Input } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getSemesters, insertSemester, updateSemester } from '../../features/semesters/semestersSlice';
const { RangePicker } = DatePicker;

const FormSemester = ({
  isMobile
}) => {
  const dispatch = useDispatch();
  const [hideForm, setHideForm] = useState(false);
  const [text, setText] = useState('Thêm kỳ');
  const[change,setChange] = React.useState({})
  const [form] = Form.useForm();
  const { listSemesters, loading } = useSelector((state) => state.semester);
  useEffect(() => {
    dispatch(getSemesters());
  }, [dispatch, hideForm]);

  const columns = [
    {
      dataIndex: 'id',
      width: 20,
    },
    {
      title: 'Tên kỳ',
      dataIndex: 'name',
      width: 100,
      render: val => val.charAt(0).toUpperCase() + val.slice(1)
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'start_time',
      width: 100,
      render: val => moment(val).format('DD/MM/YYYY')

    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'end_time',
      width: 100,
      render: val => moment(val).format('DD/MM/YYYY')
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <Space size="middle">
          <a style={{ color: 'blue' }} onClick={() => getDataEdit("update",record)}>
            Sửa
          </a>
        </Space>
      ),
    },
  ].filter((item) => item.dataIndex !== 'id');


  const onFinish = async (values) => {
    const data = {
      id: change._id,
      name: values.name,
      start_time: values.time[0]._d,
      end_time: values.time[1]._d,
    };
    try {
      if (text === "update") {
    
        dispatch(updateSemester(data))
        message.success("Thành công") 
      } else {
        dispatch(insertSemester(data))
        message.success("Thành công")
      }
    } catch (error) {
      const dataErr = error.response.data.message;
      message.error(dataErr);
    }
    setHideForm(false);
  };

  // sửa kỳ
  const getDataEdit = (key,value) => {
    setText(key)
    setHideForm(true);

    switch (key) {
      case "update":
        setChange(value)
        form.setFieldsValue({
          id: value.id,
          name: value.name,
          time: [moment(value.start_time), moment(value.end_time)],
        });
        break;
        case "add":
          form.resetFields();
          break;
      default:
        break;
    }
  };



 

  const onClose = () => {
    setChange({})
    form.resetFields()
    setHideForm(false)
    
  }

  return (
    <>
      <div className="status">
        <div className="flex-header">
          <h4>Tạo kỳ cho năm học</h4>
          <div style={{ display: 'flex' }}>

              <Button
                onClick={() => getDataEdit("add", null)}
                variant="warning"
                style={{ marginRight: 10, height: 36 }}
              >
                Tạo kỳ học
              </Button>
          </div>
        </div>
        <div className="filter" style={{ marginTop: '20px' }}>
          {/* <FSemester
              onFinish={onFinish}
              dataEdit={dataEdit}
              editStatusButton={editStatusButton}
              text={text}
              forms={form}
            /> */}

          <Drawer
            destroyOnClose
            title={'Tạo Kỳ học'}
            placement="left"
            onClose={onClose}
            visible={hideForm}
            width={ !isMobile && 600}
          >
            <Form form={form} onFinish={onFinish}
            
              style={{ padding: '0 10px' }} 
              >
              <Form.Item
                name="name"
                label="Tên kỳ"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên kỳ học!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="time"
                label="Thời gian bắt đầu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập thời gian của kỳ học!',
                  },
                ]}
              >
                {text.toLowerCase() === "update" ? (
                  <RangePicker />
                ) : (
                  <RangePicker
                    disabledDate={(current) => {
                      return (
                        current &&
                        new Date(current).getTime() <
                          new Date(listSemesters[listSemesters.length - 1]?.end_time).getTime()
                      );
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ marginLeft: '20px' }}>
                <Button type="primary" htmlType="submit">
                  Xác Nhận
                </Button>
             
              </Form.Item>
            </Form>
          </Drawer>
        </div>
        <Table loading={loading} dataSource={listSemesters} columns={columns} />
      </div>
    </>
  );
};
export default connect(({global})=> ({
  isMobile: global.isMobile
}))(FormSemester);
