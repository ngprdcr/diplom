import React, {FC, useState} from 'react';
import {Dropdown, Menu, Row, Space} from 'antd';
import {BookOutlined, DownOutlined, SettingOutlined} from '@ant-design/icons';
import {Link, useLocation} from 'react-router-dom';
import {authActions} from '../../../../store/auth.slice';
import {useAppDispatch, useAppSelector} from '../../../../store/store';
import {client} from "../../../../graphQL/client";

export const StudentMenu: FC = () => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(s => s.auth.me?.user)
    const [startUrl, setStartUrl] = useState(useLocation().pathname.replace('/student/', ''));

    const getDefaultSelectedKey = (): string => {
        if (startUrl.match(/subjects\/my/))
            return 'subjects/my';
        else if (startUrl.match(/homeworks\/my/))
            return 'homeworks/my';
        else if (startUrl.match(/settings\/my/))
            return 'settings/my';
        else
            return '';
    }

    const logoutHandler = async () => {
        dispatch(authActions.logout());
        await client.resetStore();
    }

    return (
        <Row justify={'space-between'}>
            <Menu mode="horizontal" defaultSelectedKeys={[getDefaultSelectedKey()]} style={{width: '90%'}}>
                <Menu.Item key="subjects/my" icon={<BookOutlined/>}>
                    <Link to={'subjects/my'}>Мої предмети</Link>
                </Menu.Item>
                <Menu.Item key="homeworks/my" icon={<BookOutlined/>}>
                    <Link to={'homeworks/my'}>Мої домашні роботи</Link>
                </Menu.Item>
                <Menu.Item key="settings/my" icon={<SettingOutlined/>}>
                    <Link to={'settings/my'}>Налаштування</Link>
                </Menu.Item>
            </Menu>
            <Dropdown overlay={<Menu
                items={[
                    {
                        key: '1',
                        label: (
                            <div onClick={logoutHandler}>
                                Вийти
                            </div>
                        ),
                    },
                ]}
            />}>
                <Space>
                    <span>{currentUser?.firstName} {currentUser?.lastName}</span>
                    <DownOutlined/>
                </Space>
            </Dropdown>
            <div></div>
        </Row>
    );
};
