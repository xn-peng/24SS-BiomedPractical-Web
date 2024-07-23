import React, {useState} from 'react';
import {UploadOutlined, UserOutlined, VideoCameraOutlined, HomeOutlined} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu, theme} from 'antd';
import './MainPage.css';
import { MENU_HOME, MENU_VISUALIZATION, MENU_MNGE, MENU_SEGMENTATION } from './../../constant';
import UploadContent from "../UploadContent/UploadContent";
import ManagementContent from "../ManagementContent/ManagementContent";
import VisualizationContent from "../VisualizationContent/VisualizationContent";

const {Header, Content, Footer, Sider} = Layout;
const items = [
    {
        key: MENU_HOME,
        label: 'Home  ',
        icon: <HomeOutlined/>,

    },
    {
        key: MENU_VISUALIZATION,
        label: 'Visualization  ',
        icon: <VideoCameraOutlined/>,
    },
    {
        key: MENU_MNGE,
        label: 'Management',
        icon: <UserOutlined/>,
    },
    {
        key: MENU_SEGMENTATION,
        label: 'Prediction',
        icon: <UploadOutlined/>,
    },
];

const IntroContent = () => {
   return (
       <div>
           <div className={"right"}>
               <div style={{display: 'flex', justifyContent: 'left', flexDirection: "column", alignItems: 'center'}}>
                   <h1>MRI lesion segmentation using T1-weighted MRI scans in traumatic brain injury</h1>
                   <p>Moderate to Severe Traumatic Brain Injury arises from severe impacts to the head, leading to
                       complex lesions
                       that pose diagnostic challenges with conventional imaging techniques. To address this, our team
                       participated
                       in the AIMS-TBI segmentation challenge, utilizing T1-weighted and corresponding labeled lesion
                       MRI data to
                       facilitate automated lesion detection. We implemented machine learning approaches, including 2D
                       and 3D models
                       such as U-net and V-net, to more effectively process and segment these intricate patterns. This
                       report
                       details our training approaches, discusses modifications to our models, and introduces a software
                       demo that
                       highlights potential enhancements in the diagnostic process for msTBI.</p>
                   <h2>About this website</h2>
                   <h3>Visualization</h3>
                   <p>Visualize nii file.</p>
                   <h3>Management</h3>
                   <p>Manage lists of models and manufacturers</p>
                   <h3>Prediction</h3>
                   <p>Perform prediction task with diag data and nii file.</p>
               </div>
           </div>
       </div>
   )
};

const MainPage = () => {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const [activeMenu, setActiveMenu] = useState(MENU_HOME);

    const handleMenuClick = (menu) => {
        setActiveMenu(menu.key);
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    // display: 'flex',
                    // alignItems: 'center',
                    // minHeight:"12vh",
                    // margin: 0,
                    // padding: 0,
                }}
            >
                {/*<div style={{width:"100%", height: '7vh', color:"white", margin:"0"}}>*/}
                {/*    <h1 style={{position:"absolute", left: "3vw"}}>AIMS-TBI</h1>*/}
                {/*</div>*/}
                <div className="demo-logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{flex: 1, Width: "5vh"}}
                    onClick={handleMenuClick}
                />
            </Header>
            <Content style={{padding: '0 48px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>AIMS-TBI</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {activeMenu === MENU_HOME && <IntroContent/>}
                    {activeMenu === MENU_VISUALIZATION && <VisualizationContent/>}
                    {activeMenu === MENU_MNGE && <ManagementContent/>}
                    {activeMenu === MENU_SEGMENTATION && <UploadContent/>}

                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                MRI Lesion Detection ©{new Date().getFullYear()} Created by Peng, Yu, Zeng.
            </Footer>
        </Layout>
    );
};

export default MainPage;


