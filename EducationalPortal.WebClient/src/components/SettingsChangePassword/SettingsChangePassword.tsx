import React, {FC} from 'react';
import {Form, Input, message} from 'antd';
import {sizeButtonItem, sizeFormItem} from '../../styles/form';
import {ButtonUpdate} from '../ButtonUpdate/ButtonUpdate';
import {useMutation} from '@apollo/client';
import {
    CHANGE_PASSWORD_MUTATION,
    ChangePasswordData,
    ChangePasswordVars
} from "../../graphQL/modules/auth/auth.mutations";
import {useDispatch} from "react-redux";
import {authActions} from "../../store/auth.slice";
import {client} from "../../graphQL/client";

type FormValues = {
    oldPassword: string,
    newPassword: string,
}

export const SettingsChangePassword: FC = () => {
    const [form] = Form.useForm();
    const [changePassword, changePasswordOptions] = useMutation<ChangePasswordData, ChangePasswordVars>(CHANGE_PASSWORD_MUTATION);
    const dispatch = useDispatch();

    const onFinish = async ({newPassword, oldPassword}: FormValues) => {
        changePassword({
            variables: {
                changePasswordInputType: {
                    oldPassword,
                    newPassword,
                },
            },
        })
            .then(response => {
                dispatch(authActions.logout());
                client.resetStore();
                message.success('Пароль успішно змінено');
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    return (
        <Form
            name="TeachersUpdateForm"
            onFinish={onFinish}
            form={form}
            {...sizeFormItem}
        >
            <Form.Item
                name="oldPassword"
                label="Старий пароль"
                rules={[{required: true, message: 'Введіть Старий пароль!'}]}
            >
                <Input type={'password'} placeholder="Старий пароль"/>
            </Form.Item>
            <Form.Item
                name="newPassword"
                label="Новий пароль"
                rules={[{required: true, message: 'Введіть Новий пароль!'}]}
            >
                <Input type={'password'} placeholder="Новий пароль"/>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonUpdate loading={changePasswordOptions.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
