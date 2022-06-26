import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Form, Button, Upload } from "antd";

const Support = ({ normFile }) => {
  const getFile = (e) => {
    normFile(e);
  };
  return (
    <>
      <Form.Item
        name="upload"
        label="Upload CV (PDF)"
        valuePropName="fileList"
        getValueFromEvent={getFile}
      >
        <Upload name="logo" action="/upload.do" listType="picture">
          <Button
            style={{
              marginLeft: "20px",
            }}
            icon={<UploadOutlined />}
          >
            Click to upload
          </Button>
        </Upload>
      </Form.Item>
    </>
  );
};

export default Support;
