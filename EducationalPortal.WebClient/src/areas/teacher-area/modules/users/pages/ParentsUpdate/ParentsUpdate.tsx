import React from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {DatePicker, Form, Input, message, Select} from 'antd';
import {ButtonUpdate} from '../../../../../../components/ButtonUpdate/ButtonUpdate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import {
    UPDATE_USER_MUTATION,
    UpdateUserData,
    UpdateUserVars
} from '../../../../../../graphQL/modules/users/users.mutations';
import {GET_USER_QUERY, GetUserData, GetUserVars} from '../../../../../../graphQL/modules/users/users.queries';
import moment from 'moment';
import {Role} from '../../../../../../graphQL/modules/users/users.types';
import Title from 'antd/es/typography/Title';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import {ukDateFormat} from '../../../../../../utils/formats';
import 'moment/locale/uk';

// @ts-ignore
const cyrillicToTranslit = new CyrillicToTranslit({preset: 'uk'});

type FormValues = {
    id: string,
    firstName: string,
    lastName: string,
    middleName: string,
    login: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: any,
    role: Role,
}

export const ParentsUpdate = () => {
    const params = useParams();
    const id = params.id as string;
    const [updateStudent, updateStudentOptions] = useMutation<UpdateUserData, UpdateUserVars>(UPDATE_USER_MUTATION);
    const [form] = Form.useForm();
    const getTeacher = useQuery<GetUserData, GetUserVars>(GET_USER_QUERY,
        {variables: {id: id}},
    );
    const navigate = useNavigate();

    const onFinish = async (values: FormValues) => {
        updateStudent({
            variables: {
                updateUserInputType: {
                    id: values.id,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    middleName: values.middleName,
                    login: values.login,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    dateOfBirth: values.dateOfBirth && new Date(values.dateOfBirth._d.setHours(12)).toISOString(),
                    role: getTeacher.data!.getUser.role,
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

    if (!id)
        return <Navigate to={'/error'}/>;

    if (getTeacher.loading)
        return <Loading/>;

    const teacher = getTeacher.data?.getUser;
    return (
        <Form
            name="TeachersUpdateForm"
            onFinish={onFinish}
            form={form}
            initialValues={{
                id: teacher?.id,
                firstName: teacher?.firstName,
                middleName: teacher?.middleName,
                lastName: teacher?.lastName,
                login: teacher?.login,
                email: teacher?.email,
                phoneNumber: teacher?.phoneNumber,
                dateOfBirth: moment(teacher?.dateOfBirth.split('T')[0], 'YYYY-MM-DD'),
            }}
            {...sizeFormItem}
        >
            <Title level={2}>Оновити батьків</Title>
            <Form.Item name="id" style={{display: 'none'}}>
                <Input type={'hidden'}/>
            </Form.Item>
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
                <ButtonUpdate loading={updateStudentOptions.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
