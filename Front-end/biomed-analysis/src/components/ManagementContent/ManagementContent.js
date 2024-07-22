import React from 'react';
import {Button, Flex, message, Tabs} from 'antd';
import TabPane from "antd/es/tabs/TabPane";
import { Space, Table, Tag } from 'antd';

const onDeleteModelItem = (record) => {
    message.success("Delete Successfully");
    console.log(record.key)
}

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

const modelData = [
    {
        key: '1',
        name: 'V-Net Model',
        time: "2024-07-20",
    },
    {
        key: '2',
        name: 'U-Net Model',
        time: "2024-07-20",
    },
    {
        key: '3',
        name: '2D Model',
        time: "2024-07-20",
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
                <a onClick={() => onDeleteModelItem(record)}>Delete</a>
            </Space>
        ),
    },
];

const scanData = [
    {
        key: '1',
        brand: 'Siemens',
        model: "N/A",
        id: 1
    },
    {
        key: '2',
        brand: 'Philips',
        model: "N/A",
        id: 2
    },
    {
        key: '3',
        brand: 'GE',
        model: "N/A",
        id: 3
    },

];

const onChange = (key) => {
    console.log(key);
};

const ManagementContent = () => {
    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                tabPosition={'left'}
                onChange={onChange}
                style={{minHeight: '50vh'}}
            >
                <TabPane tab={"Model Management"} key={'1'}>
                    <Flex gap="middle" vertical>
                        <Flex align={"center"} gap="middle">
                            <h2>Model List</h2>
                            <Button type="primary"
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
                            <Button type="primary"
                                // onClick={start} disabled={!hasSelected} loading={loading}
                            >
                                Add New scan device
                            </Button>
                        </Flex>
                        <Table columns={scanColumns} dataSource={scanData}/>
                    </Flex>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ManagementContent;