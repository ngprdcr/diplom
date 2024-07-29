import React, {FC} from 'react';
import {Button, Checkbox, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Link, Navigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../../../../store/store';
import {authActions} from '../../../../../store/auth.slice';
import {useMutation} from '@apollo/client';
import {LOGIN_MUTATION, LoginData, LoginVars} from '../../auth.mutations';
import s from './LoginPage.module.css';
import {AppName} from '../../../../../store/settings.slice';

type FormValues = {
    login: string,
    password: string,
    remember: boolean,
}

export const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(s => s.auth.isAuth);
    const [loginMutation, loginMutationOptions] = useMutation<LoginData, LoginVars>(LOGIN_MUTATION);
    const [form] = Form.useForm();
    const settings = useAppSelector(s => s.settings.settings);

    const onFinish = async ({login, password, remember}: FormValues) => {
        loginMutation({variables: {loginAuthInputType: {login, password}}})
            .then(response => {
                if (response.data) {
                    dispatch(authActions.login({me: response.data.login}));
                }
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    if (isAuth)
        return <Navigate to={'/'}/>;


    return (
        <div className={s.loginForm}>
            <Form
                name="loginForm"
                initialValues={{remember: true}}
                onFinish={onFinish}
                form={form}
            >
                <h2 className={s.title}>{settings?.find(setting => setting.name === AppName)?.value}</h2>
                <Form.Item
                    name="login"
                    rules={[{required: true, message: 'Введіть ваш Логін!'}]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Логін"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Введіть ваш Пароль!'}]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="Пароль"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle className={s.rememberMe}>
                        <Checkbox>
                            <span className={s.white}>Запам'ятати</span>
                        </Checkbox>
                    </Form.Item>

                    <Link className={s.forgotPass} to={''}>
                        Забули пароль?
                    </Link>
                </Form.Item>
                <Form.Item>
                    <Button loading={loginMutationOptions.loading} type="primary" htmlType="submit"
                            className={['login-form-button', s.submit].join(' ')}>
                        Увійти
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
