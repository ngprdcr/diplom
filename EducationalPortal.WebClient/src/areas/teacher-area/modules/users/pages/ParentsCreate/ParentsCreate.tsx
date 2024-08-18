import React from 'react';
import {useMutation} from '@apollo/client';
import {DatePicker, Form, Input, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import {CREATE_USER_MUTATION, CreateUserData, CreateUserVars} from '../../../../../../graphQL/modules/users/users.mutations';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import {Role} from '../../../../../../graphQL/modules/users/users.types';
import Title from 'antd/es/typography/Title';
import {ukDateFormat} from '../../../../../../utils/formats';
import 'moment/locale/uk';

// @ts-ignore
const cyrillicToTranslit = new CyrillicToTranslit({preset: 'uk'});

type FormValues = {
    firstName: string,
    lastName: string,
    middleName: string,
    login: string,
    password: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: any,
}

export const ParentsCreate = () => {
    const [createStudentMutation, createStudentMutationOption] = useMutation<CreateUserData, CreateUserVars>(CREATE_USER_MUTATION);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values: FormValues) => {
        createStudentMutation({
            variables: {
                createUserInputType: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    middleName: values.middleName,
                    login: values.login,
                    password: values.password,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    dateOfBirth: values.dateOfBirth && new Date(values.dateOfBirth._d.setHours(12)).toISOString(),
                    role: Role.Parent,
                    gradeId: undefined,
                },
            },
        })
            .then(response => {
                navigate('../');
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const changeLogin = () => {
        const lastName: string = form.getFieldValue('lastName') || '';
        const lastName1Letter = lastName.length ? lastName[0] : '';
        const firstName: string = form.getFieldValue('firstName') || '';
        const firstName1Letter = firstName.length ? firstName[0] : '';
        const middleName: string = form.getFieldValue('middleName') || '';
        const middleName1Letter = middleName.length ? middleName[0] : '';
        const dateOfBorn: Date | null = form.getFieldValue('dateOfBirth')?._d;
        const yearOfBorn = dateOfBorn?.getFullYear() || '';
        form.setFieldsValue({
            login: cyrillicToTranslit.transform(`${yearOfBorn}_${lastName1Letter}${firstName1Letter}${middleName1Letter}`).toLowerCase(),
        });
    };

    return (
        <Form
            name="TeachersCreateForm"
            onFinish={onFinish}
            form={form}
            initialValues={{
                password: (Math.random() + 1).toString(36).substring(6),
            }}
            {...sizeFormItem}
        >
            <Title level={2}>Створити батьків</Title>
            <Form.Item
                name="lastName"
                label="Прізвище"
                rules={[{required: true, message: 'Введіть Прізвище!'}]}
            >
                <Input placeholder="Прізвище" onChange={() => changeLogin()}/>
            </Form.Item>
            <Form.Item
                name="firstName"
                label="Ім'я"
                rules={[{required: true, message: 'Введіть Ім\'я!'}]}
            >
                <Input placeholder="Ім'я" onChange={() => changeLogin()}/>
            </Form.Item>
            <Form.Item
                name="middleName"
                label="По-батькові"
                rules={[{required: true, message: 'Введіть По-батькові!'}]}
            >
                <Input placeholder="По-батькові" onChange={() => changeLogin()}/>
            </Form.Item>
            <Form.Item
                name="login"
                label="Логін"
                rules={[{required: true, message: 'Введіть Логін!'}]}
            >
                <Input placeholder="Логін"/>
            </Form.Item>
            <Form.Item
                name="password"
                label="Пароль"
                rules={[{required: true, message: 'Введіть Пароль!'}]}
            >
                <Input placeholder="Пароль"/>
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[{type: 'email', message: 'Невірно введено Email!'}]}
            >
                <Input placeholder="Email" type={'email'}/>
            </Form.Item>
            <Form.Item
                name="phoneNumber"
                label="Номер телефону"
            >
                <Input placeholder="Номер телефону"/>
            </Form.Item>
            <Form.Item
                name="dateOfBirth"
                label="Дата народження"
            >
                <DatePicker format={ukDateFormat} onChange={() => changeLogin()}/>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonCreate loading={createStudentMutationOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
