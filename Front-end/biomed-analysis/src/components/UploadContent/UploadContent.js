import React, {useEffect, useState} from 'react';
import { InboxOutlined } from '@ant-design/icons';
import {Alert, Checkbox, message, Radio, Result, Spin, Upload, UploadProps} from 'antd';
import './UploadContent.css';
import { Button, Form, Input, Select, Space } from 'antd';


const { Dragger } = Upload;


const UploadContent = () => {


    const baseURL = process.env.REACT_APP_API_BASE_URL;

    const [fileList, setFileList] = useState([]);
    const [otherDataReady, setOtherDataReady] = useState(false);
    const [modelData, setModelData] = useState([]);
    const [scanData, setScanData] = useState([]);
    const [manufacturerSelect, setManufacturerSelect] = useState([]);
    const [modelSelect, setModelSelect] = useState([]);
    const [resultType, setResultType] = useState(-1);
    const [loading, setLoading] = React.useState(false);


    const fetchModelData = () => {
        fetch(`${baseURL}/models`)
            .then(response => response.json())
            .then(data => {
                    setModelData(data);
                    setModelSelect(data.map(item => ({
                        value: String(item.id),
                        label: item.name
                    })));
            }
            )
            .catch(error => {
                console.error("There was an error fetching the model data!", error);
            });
    };

    const fetchScanData = () => {
        fetch(`${baseURL}/manufacturers`)
            .then(response => response.json())
            .then(data => {
                setScanData(data);
                setManufacturerSelect(data.map(item => ({
                    value: String(item.id),
                    label: item.brand
                })));

            })
            .catch(error => {
                console.error("There was an error fetching the scan data!", error);
            });
    };

    const handleUpload = async (values) => {
        if (fileList.length === 0) {
            message.error('No file selected.');
            return;
        }

        const formData = new FormData();
        // fileList.forEach((file) => {
        //     formData.append('file', file);
        // });
        formData.append('file', fileList[0])
        formData.append('age', values.age);
        formData.append('tsi', values.tsi);
        formData.append('gender', values.gender);
        formData.append('manufacturer', values.manufacturer);
        formData.append('model', values.model);

        try {
            setLoading(true);
            const response = await fetch(baseURL + '/prediction', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                message.success('Files and data uploaded successfully.');
                setResultType(result.result)
                console.log(result);
                setFileList([]);
                setLoading(false);
            } else {
                message.error('Failed to upload files and data.');
                setLoading(false);
            }
            setFileList([]);
        } catch (error) {
            message.error('Failed to upload files and data.');
            setLoading(false);
        }
    };

    const props = {
        name: 'file',
        multiple: false,
        beforeUpload: file => {
            setFileList(prevList => [...prevList, file]);
            return false; // Prevent automatic upload
        },
        onRemove: file => {
            setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
        },
        fileList,
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const onFinish = (values) => {
        if (fileList.length === 0) {
            message.error("Please add the .nii file");
            return;
        }
        // message.success("Submit successfully");
        handleUpload(values);
        console.log('Success:', values);

    };
    const onFinishFailed = (errorInfo) => {
        message.error("Submit failed");
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        fetchModelData();
        fetchScanData();
    }, [baseURL]);


    return (
        <div>
            {/*<Alert message="Success Text" type="success" />*/}


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
                            options={manufacturerSelect}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Model"
                        name="model"
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
                            options={modelSelect}
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
            <div className={"upload-card"} style={{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                <Spin spinning={loading}>
                {resultType === -1 && <Result
                    title="Waiting for your input"

                />}

                {resultType === 0 && <Result
                    status="success"
                    // title="The prediction results showed that there was a high probability that the lesion would not be present in the MRI image"
                    subTitle="The prediction results showed that there was a high probability that the lesion would not be present in the MRI image"
                    extra={[

                    ]}
                />}
                {resultType === 1 && <Result
                    status="warning"
                    // title="The prediction results showed that there was a high probability that the lesion would not be present in the MRI image"
                    subTitle="The prediction results showed that there was a high probability that the lesion exists in the MRI image"
                    extra={[

                    ]}
                />}
                </Spin>
            </div>

        </div>
        </div>
    );
}

export default UploadContent;