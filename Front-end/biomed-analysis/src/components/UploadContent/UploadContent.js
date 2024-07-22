import React, {useState} from 'react';
import { InboxOutlined } from '@ant-design/icons';
import {Checkbox, message, Radio, Upload} from 'antd';
import './UploadContent.css';
import { Button, Form, Input, Select, Space } from 'antd';


const { Dragger } = Upload;

const props = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

const onFinish = (values) => {
    message.success("Submit successfully");
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    message.error("Submit failed");
    console.log('Failed:', errorInfo);
};


const UploadContent = () => {
    return (
        <div className={"upload-container"}>
            <div className={"upload-card"}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
            </div>
            <div className={"upload-card"} style={{ paddingTop: "10vh" }}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        width: "20vw",
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Age"
                        name="age"
                        rules={[
                            {
                                required: true,
                                message: "Please input patient's age!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="TSI"
                        name="tsi"
                        rules={[
                            {
                                required: true,
                                message: 'Please input time since injured!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={"Gender"}
                        name="gender"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="male"> Male </Radio>
                            <Radio value="female"> Female </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Manufacturer"
                        name="manufacturer"
                        rules={[
                            {
                                required: true,
                                message: 'Please select',
                            },
                        ]}
                    >
                        <Select
                            // defaultValue="1"
                            style={{  }}
                            // onChange={handleChange}
                            options={[
                                { value: '1', label: 'Siemens' },
                                { value: '2', label: 'Philips' },
                                { value: '3', label: 'GE' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className={"upload-card"}>

            </div>

        </div>
    );
}

export default UploadContent;