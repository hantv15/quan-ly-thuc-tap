import React from "react";
import { Form, Input } from "antd";
import styles from "./Proactive.module.css";
const Proactive = () => {
  return (
    <>
      <Form.Item
        name="unit"
        className={styles.form.input}
        label="Đơn vị thực tập"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập đơn vị thực tập",
          },
        ]}
      >
        <Input placeholder="Đơn vị thực tập/Tên doanh nghiệp" />
      </Form.Item>
      <Form.Item
        name="unitAddress"
        label="Địa chỉ thực tập"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập địa chỉ thực tập",
          },
        ]}
      >
        <Input placeholder="Địa chỉ đơn vị thực tập" />
      </Form.Item>
      <Form.Item
        name="taxCode"
        label="Mã số thuế"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Mã số thuế",
          },
        ]}
      >
        <Input placeholder="Mã số thuế" />
      </Form.Item>

      <Form.Item
        name="position"
        label="Chức vụ người tiếp nhận"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập chức vụ người tiếp nhận sinh viên",
          },
        ]}
      >
        <Input placeholder="Chức vụ người tiếp nhận" />
      </Form.Item>

      <Form.Item
        name="numberEnterprise"
        label="Số điện thoại doanh nghiệp"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Số điện thoại doanh nghiệp",
          },
        ]}
      >
        <Input placeholder="Số điện thoại doanh nghiệp(VD:Giám đốc, Leader, Hr)" />
      </Form.Item>

      <Form.Item
        name="emailEnterprise"
        label="Email người tiếp nhận"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Email người tiếp nhận",
          },
        ]}
      >
        <Input placeholder="Email người tiếp nhận" />
      </Form.Item>
    </>
  );
};

export default Proactive;
