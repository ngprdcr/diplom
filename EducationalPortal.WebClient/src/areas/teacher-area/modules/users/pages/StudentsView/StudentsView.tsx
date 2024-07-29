import React from 'react';
import {useQuery} from '@apollo/client';
import {Link, Navigate, useParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {Space, Tag} from 'antd';
import Title from 'antd/es/typography/Title';
import {GET_USER_WITH_GRADE_QUERY, GetUserWithGradeData, GetUserWithGradeVars} from '../../../../../../graphQL/modules/users/users.queries';
import '../../../../../../styles/table.css';
import {stringToUkraineDate} from '../../../../../../convertors/stringToDatetimeConvertors';

export const StudentsView = () => {
    const params = useParams();
    const id = params.id as string;
    const getStudentQuery = useQuery<GetUserWithGradeData, GetUserWithGradeVars>(GET_USER_WITH_GRADE_QUERY,
        {variables: {id: id}},
    );

    if (!id)
        return <Navigate to={'/error'}/>;

    if (getStudentQuery.loading)
        return <Loading/>;

    const student = getStudentQuery.data?.getUser;
    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Перегляд учня</Title>
            <Title level={3}>{student?.lastName} {student?.firstName}</Title>
            <table className="infoTable">
                <tbody>
                <tr>
                    <td>Логін:</td>
                    <td>
                        <span>{student?.login}</span>
                    </td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>
                        <span>{student?.email}</span>
                    </td>
                </tr>
                <tr>
                    <td>Номер телефону:</td>
                    <td>
                        <span>{student?.phoneNumber}</span>
                    </td>
                </tr>
                <tr>
                    <td>Дата нарождення:</td>
                    <td>
                        <span>{student?.dateOfBirth && stringToUkraineDate(student.dateOfBirth)}</span>
                    </td>
                </tr>
                <tr>
                    <td>Клас:</td>
                    <td>
                        {student?.grade
                        && <Tag>
                            <Link to={`../../grades/${student.gradeId}`}>{student.grade?.name}</Link>
                        </Tag>
                        }
                    </td>
                </tr>
                </tbody>
            </table>
        </Space>
    );
};
