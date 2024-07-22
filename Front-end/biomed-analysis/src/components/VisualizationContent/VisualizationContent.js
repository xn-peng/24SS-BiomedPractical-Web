import React from 'react';
import './Visualization.css'

import { InboxOutlined } from '@ant-design/icons';
import {Button, Divider, Flex, message, Table, Upload} from 'antd';
import { Image } from 'antd';

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


const VisualizationContent = (props) => {
    return (
        <div className={"visualization-content"}>

            <Flex gap="middle" vertical>
                <Dragger {...props} className={"upload-area"}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
                <Flex align={"center"} gap="middle">
                    <Button type="primary"
                        // onClick={start} disabled={!hasSelected} loading={loading}
                    >
                        Submit
                    </Button>
                </Flex>

            </Flex>
            <div className={"divider"}></div>
            <div className={"image-area"}>
                <Image
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <Image
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <Image
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
            </div>

        </div>
    );
};

export default VisualizationContent;