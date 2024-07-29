import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {AutoComplete, DatePicker, Form, Input, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import {CREATE_USER_MUTATION, CreateUserData, CreateUserVars} from '../../../../../../graphQL/modules/users/users.mutations';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import Search from 'antd/es/input/Search';
import debounce from 'lodash.debounce';
import {GET_GRADES_QUERY, GetGradesData, GetGradesVars} from '../../../../../../graphQL/modules/grades/grades.queries';
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
    gradeName: string | null,
}

export const StudentsCreate = () => {
    const [gradePage, setGradePage] = useState(1);
    const getGradeQuery = useQuery<GetGradesData, GetGradesVars>(GET_GRADES_QUERY, {
        variables: {
            page: gradePage,
            like: '',
        },
    });
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
                    role: Role.Student,
                    gradeId: getGradeQuery.data?.getGrades.entities.find(grade => grade.name === values.gradeName)?.id,
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

    const onSearchGradesHandler = async (value: string) => {
        const response = await getGradeQuery.refetch({
            page: 1,
            like: value,
        });
        if (!response.errors) {
            if (!response.data.getGrades.entities.length) {
                message.warning('Класів з даною назвою не знайдено');
            }
        } else {
            response.errors?.forEach(error => message.error(error.message));
        }
    };

    const debouncedSearchGradesHandler = useCallback(debounce(nextValue => onSearchGradesHandler(nextValue), 500), []);
    const searchGradesHandler = (value: string) => debouncedSearchGradesHandler(value);

    return (
        <Form
            name="StudentsCreateForm"
            onFinish={onFinish}
            form={form}
            initialValues={{
                password: (Math.random() + 1).toString(36).substring(6),
            }}
            {...sizeFormItem}
        >
            <Title level={2}>Створити учня</Title>
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
            <Form.Item
                name="gradeName"
                label="Клас"
            >
                <AutoComplete
                    options={getGradeQuery.data?.getGrades.entities.map(grade => ({value: grade.name}))}
                    onSearch={searchGradesHandler}
                >
                    <Search
                        placeholder="Клас"
                        enterButton
                        loading={getGradeQuery.loading}
                    />
                </AutoComplete>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonCreate loading={createStudentMutationOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
