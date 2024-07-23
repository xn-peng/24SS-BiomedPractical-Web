import React, {useEffect, useState} from 'react';
import {Button, message, Tabs, Space, Table, Drawer, Upload, Form, Input, UploadProps, FormProps} from 'antd';
import TabPane from "antd/es/tabs/TabPane";
import {InboxOutlined} from '@ant-design/icons';

const {Dragger} = Upload;

const {Flex} = require('antd');

const ManagementContent = () => {
    const [currentTab, setCurrentTab] = useState("1");
    const [modelData, setModelData] = useState([]);
    const [scanData, setScanData] = useState([]);
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const [openDrawer, setOpenDrawer] = useState(false);


    const modelColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => onDeleteModelItem(record)}>Delete</a>
                </Space>
            ),
        },
    ];

    const scanColumns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => onDeleteManufacturerItem(record)}>Delete</a>
                </Space>
            ),
        },
    ];

    const onDeleteModelItem = (record) => {
        console.log(record.id);
        deleteModel(record.id)
    }

    const onDeleteManufacturerItem = (record) => {
        console.log(record.id);
        deleteManufacturer(record.id)
    }


    const showDrawer = () => {
        setOpenDrawer(true);
    };

    const onCloseDrawer = () => {
        setOpenDrawer(false);
        fetchModelData();
        fetchScanData();
    };

    const onTabChange = (key) => {
        console.log(key);
        setCurrentTab(key);
    };

    const onFormFinish = (values) => {
        console.log('Success:', values);
        onCloseDrawer();
        postScanData(values.brand, values.model);

    };

    const onFormFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'http://127.0.0.1:5000/models',
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                onCloseDrawer();
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const fetchModelData = () => {
        fetch(`${baseURL}/models`)
            .then(response => response.json())
            .then(data => setModelData(data))
            .catch(error => {
                console.error("There was an error fetching the model data!", error);
            });
    };

    const fetchScanData = () => {
        fetch(`${baseURL}/manufacturers`)
            .then(response => response.json())
            .then(data => setScanData(data))
            .catch(error => {
                console.error("There was an error fetching the scan data!", error);
            });
    };

    const postScanData = (brand, model) => {
        fetch(`${baseURL}/manufacturers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({brand, model}),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                message.success("Data posted successfully!");
                console.log('Success:', data);
                // Optionally, you can refresh the list after posting new data
                fetchScanData();
            })
            .catch(error => {
                console.error('There was an error posting the scan data!', error);
            });
    };

    const deleteManufacturer = (id) => {
        fetch(`${baseURL}/manufacturers/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                message.success("Delete Successfully");
                console.log(`manufacturers with id ${id} deleted`);
                // Refresh the list after deletion
                fetchScanData();
            })
            .catch(error => {
                console.error('There was an error deleting the manufacturers!', error);
            });
    }


    const deleteModel = (id) => {
        fetch(`${baseURL}/models/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                message.success("Delete Successfully");
                console.log(`Model with id ${id} deleted`);
                // Refresh the list after deletion
                fetchModelData();
            })
            .catch(error => {
                console.error('There was an error deleting the model!', error);
            });
    }


    useEffect(() => {
        fetchModelData();
        fetchScanData();
    }, [baseURL]);

    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                tabPosition={'left'}
                onChange={onTabChange}
                style={{minHeight: '50vh'}}
            >
                <TabPane tab={"Model Management"} key={'1'}>
                    <Flex gap="middle" vertical>
                        <Flex align={"center"} gap="middle">
                            <h2>Model List</h2>
                            <Button type="primary" onClick={showDrawer}
                                // onClick={start} disabled={!hasSelected} loading={loading}
                            >
                                Add New Model
                            </Button>
                        </Flex>
                        <Table columns={modelColumns} dataSource={modelData}/>
                    </Flex>
                </TabPane>
                <TabPane tab={"Scan Manufacturer"} key={'2'}>
                    <Flex gap="middle" vertical>
                        <Flex align={"center"} gap="middle">
                            <h2>Scan Manufacturer List</h2>
                            <Button type="primary" onClick={showDrawer}
                                // onClick={start} disabled={!hasSelected} loading={loading}
                            >
                                Add New scan device
                            </Button>
                        </Flex>
                        <Table columns={scanColumns} dataSource={scanData}/>
                    </Flex>
                </TabPane>
            </Tabs>


            <Drawer
                title={currentTab === '1' ? "Add new model" : "Add new manufacturer"}
                onClose={onCloseDrawer}
                open={openDrawer}
                width={"50vw"}
            >

                {currentTab === "1" &&
                    <div>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or
                                other
                                banned files.
                            </p>
                        </Dragger>
                    </div>
                }
                {currentTab === "2" &&
                    <div>
                        <Form
                            name="basic"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                            style={{maxWidth: 600}}
                            initialValues={{remember: true}}
                            onFinish={onFormFinish}
                            onFinishFailed={onFormFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Brand"
                                name="brand"
                                rules={[{required: true, message: 'Please input brand!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Model"
                                name="model"
                                rules={[{required: true, message: 'Please input model!'}]}
                                // initialValue={"NA"}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                }

            </Drawer>
        </div>
    );
};

export default ManagementContent;
