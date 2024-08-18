import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {AutoComplete, Form, Input, message} from 'antd';
import {ButtonUpdate} from '../../../../../../components/ButtonUpdate/ButtonUpdate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import {
    UPDATE_USER_MUTATION,
    UpdateUserData,
    UpdateUserVars
} from '../../../../../../graphQL/modules/users/users.mutations';
import {
    GET_USER_WITH_GRADE_QUERY,
    GET_USERS_QUERY,
    GetUsersData,
    GetUsersVars,
    GetUserWithGradeData,
    GetUserWithGradeVars,
} from '../../../../../../graphQL/modules/users/users.queries';
import moment from 'moment';
import {Role} from '../../../../../../graphQL/modules/users/users.types';
import Search from 'antd/es/input/Search';
import {GET_GRADES_QUERY, GetGradesData, GetGradesVars} from '../../../../../../graphQL/modules/grades/grades.queries';
import debounce from 'lodash.debounce';
import Title from 'antd/es/typography/Title';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
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
    gradeName: string,
    motherName: string,
    fatherName: string,
}

export const StudentsUpdate = () => {
    const params = useParams();
    const id = params.id as string;
    const [updateStudentMutation, updateStudentMutationOption] = useMutation<UpdateUserData, UpdateUserVars>(UPDATE_USER_MUTATION);
    const [form] = Form.useForm();
    const getStudentQuery = useQuery<GetUserWithGradeData, GetUserWithGradeVars>(GET_USER_WITH_GRADE_QUERY,
        {variables: {id: id}},
    );
    const [gradePage, setGradePage] = useState(1);
    const getGradeQuery = useQuery<GetGradesData, GetGradesVars>(GET_GRADES_QUERY, {
        variables: {
            page: gradePage,
            like: '',
        },
    });
    const getMotherQuery = useQuery<GetUsersData, GetUsersVars>(GET_USERS_QUERY, {
        variables: {
            page: 1,
            like: '',
            roles: [Role.Parent]
        },
    });
    const getFatherQuery = useQuery<GetUsersData, GetUsersVars>(GET_USERS_QUERY, {
        variables: {
            page: 1,
            like: '',
            roles: [Role.Parent]
        },
    });
    const navigate = useNavigate();



    const onFinish = async (values: FormValues) => {
        const gradeId = getStudentQuery.data?.getUser?.grade?.name === values.gradeName
            ? getStudentQuery.data?.getUser.gradeId
            : getGradeQuery.data?.getGrades.entities.find(grade => grade.name === values.gradeName)?.id;

        const motherId = getMotherQuery.data?.getUsers.entities.find(m => `${m.firstName} ${m.middleName} ${m.lastName}` === values.motherName)?.id;
        const fatherId = getFatherQuery.data?.getUsers.entities.find(f => `${f.firstName} ${f.middleName} ${f.lastName}` === values.fatherName)?.id;

        updateStudentMutation({
            variables: {
                updateUserInputType: {
                    id: values.id,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    middleName: values.middleName,
                    login: values.login,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    dateOfBirth: new Date(values.dateOfBirth._d.setHours(12)).toISOString(),
                    role: Role.Student,
                    gradeId: gradeId,
                    motherId,
                    fatherId,
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

    const onSearchMotherHandler = async (value: string) => {
        const response = await getMotherQuery.refetch({
            page: 1,
            like: value,
            roles: [Role.Parent]
        });
        if (!response.errors) {
            if (!response.data.getUsers.entities.length) {
                message.warning('Батьків з даною назвою не знайдено');
            }
        } else {
            response.errors?.forEach(error => message.error(error.message));
        }
    };

    const debouncedSearchMotherHandler = useCallback(debounce(nextValue => onSearchMotherHandler(nextValue), 500), []);
    const searchMotherHandler = (value: string) => debouncedSearchMotherHandler(value);

    const onSearchFatherHandler = async (value: string) => {
        const response = await getFatherQuery.refetch({
            page: 1,
            like: value,
            roles: [Role.Parent]
        });
        if (!response.errors) {
            if (!response.data.getUsers.entities.length) {
                message.warning('Батьків з даною назвою не знайдено');
            }
        } else {
            response.errors?.forEach(error => message.error(error.message));
        }
    };

    const debouncedSearchFatherHandler = useCallback(debounce(nextValue => onSearchFatherHandler(nextValue), 500), []);
    const searchFatherHandler = (value: string) => debouncedSearchFatherHandler(value);

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

    if (getStudentQuery.loading)
        return <Loading/>;

    const student = getStudentQuery.data?.getUser;
    return (
        <Form
            name="StudentsUpdateForm"
            onFinish={onFinish}
            form={form}
            initialValues={{
                id: student?.id,
                firstName: student?.firstName,
                middleName: student?.middleName,
                lastName: student?.lastName,
                login: student?.login,
                email: student?.email,
                phoneNumber: student?.phoneNumber,
                dateOfBirth: moment(student?.dateOfBirth.split('T')[0], 'YYYY-MM-DD'),
                gradeName: student?.grade?.name,
                motherName: student?.mother ? `${student.mother.firstName} ${student.mother.middleName} ${student.mother.lastName}` : '',
                fatherName: student?.father ? `${student.father.firstName} ${student.father.middleName} ${student.father.lastName}` : '',
            }}
            {...sizeFormItem}
        >
            <Title level={2}>Оновити учня</Title>
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
                {/*<DatePicker format={ukDateFormat} onChange={() => changeLogin()}/>*/}
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
            <Form.Item
                name="motherName"
                label="Мати"
            >
                <AutoComplete
                    options={getMotherQuery.data?.getUsers.entities.map(mother => ({value: `${mother.firstName} ${mother.middleName} ${mother.lastName}`}))}
                    onSearch={searchMotherHandler}
                >
                    <Search
                        placeholder="Мати"
                        enterButton
                        loading={getMotherQuery.loading}
                    />
                </AutoComplete>
            </Form.Item>
            <Form.Item
                name="fatherName"
                label="Батько"
            >
                <AutoComplete
                    options={getFatherQuery.data?.getUsers.entities.map(mother => ({value: `${mother.firstName} ${mother.middleName} ${mother.lastName}`}))}
                    onSearch={searchFatherHandler}
                >
                    <Search
                        placeholder="Батько"
                        enterButton
                        loading={getFatherQuery.loading}
                    />
                </AutoComplete>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonUpdate loading={updateStudentMutationOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
