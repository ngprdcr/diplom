import React from 'react';
import {useQuery} from '@apollo/client';
import {Navigate, useParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {Space} from 'antd';
import Title from 'antd/es/typography/Title';
import {GET_USER_QUERY, GetUserData, GetUserVars} from '../../../../../../graphQL/modules/users/users.queries';
import '../../../../../../styles/table.css';
import {stringToUkraineDate} from '../../../../../../convertors/stringToDatetimeConvertors';
import {roleToTag} from '../../../../../../convertors/enumToTagConvertor';

export const TeachersView = () => {
    const params = useParams();
    const id = params.id as string;
    const getTeacher = useQuery<GetUserData, GetUserVars>(GET_USER_QUERY,
        {variables: {id: id}},
    );

    if (!id)
        return <Navigate to={'/error'}/>;

    if (getTeacher.loading)
        return <Loading/>;

    const teacher = getTeacher.data?.getUser;
    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Перегляд вчителя</Title>
            <Title level={3}>{teacher?.lastName} {teacher?.firstName}</Title>
            <table className="infoTable">
                <tbody>
                <tr>
                    <td>Логін:</td>
                    <td>
                        <span>{teacher?.login}</span>
                    </td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>
                        <span>{teacher?.email}</span>
                    </td>
                </tr>
                <tr>
                    <td>Номер телефону:</td>
                    <td>
                        <span>{teacher?.phoneNumber}</span>
                    </td>
                </tr>
                <tr>
                    <td>Дата нарождення:</td>
                    <td>
                        <span>{teacher?.dateOfBirth && stringToUkraineDate(teacher.dateOfBirth)}</span>
                    </td>
                </tr>
                <tr>
                    <td>Роль:</td>
                    <td>{teacher?.role && roleToTag(teacher.role)}</td>
                </tr>
                </tbody>
            </table>
        </Space>
    );
};
