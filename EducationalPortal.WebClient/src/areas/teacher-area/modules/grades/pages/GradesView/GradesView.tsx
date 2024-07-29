import React, {useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/client';
import {createSearchParams, Navigate, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {
    GET_GRADE_WITH_STUDENTS_QUERY,
    GetGradeWithStudentsData,
    GetGradeWithStudentsVars
} from '../../../../../../graphQL/modules/grades/grades.queries';
import {Space, Table} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {User} from '../../../../../../graphQL/modules/users/users.types';
import Title from 'antd/es/typography/Title';
import '../../../../../../styles/table.css';
import {isAdministrator} from "../../../../../../utils/permissions";

const studentsPageDefaultValue = 1;

export const GradesView = () => {
    const params = useParams();
    const id = params.id as string;
    const [searchParams] = useSearchParams();
    const [studentsPage, setStudentsPage] = useState(parseInt(searchParams.get('studentsPage') || '') || studentsPageDefaultValue);
    const [getGrade, getGradeOptions] = useLazyQuery<GetGradeWithStudentsData, GetGradeWithStudentsVars>(GET_GRADE_WITH_STUDENTS_QUERY,
        {variables: {id: id, studentsPage: studentsPage}},
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (!(studentsPage === studentsPageDefaultValue))
            navigate({
                pathname: './',
                search: `?${createSearchParams({studentsPage: studentsPage.toString()})}`,
            });
        getGrade({variables: {id, studentsPage}});
    }, [id, studentsPage]);

    const columns: ColumnsType<User> = [
        {
            title: 'Учень',
            dataIndex: 'student',
            key: 'student',
            render: (text, user) => <>{user.lastName} {user.firstName}</>,
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text, user) => (
                isAdministrator()
                    ? <ButtonsVUR viewUrl={`../../students/${user.id}`} updateUrl={`../../students/update/${user.id}`}/>
                    : <ButtonsVUR viewUrl={`../../students/${user.id}`}/>
            ),
        },
    ];

    if (!id)
        return <Navigate to={'/error'}/>;

    if (getGradeOptions.loading)
        return <Loading/>;

    const grade = getGradeOptions.data?.getGrade;
    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Перегляд класу</Title>
            <Title level={3}>{grade?.name}</Title>
            <table className="infoTable">
                <tbody>
                <tr>
                    <td>Класний керівник:</td>
                    <td>
                        <span>...</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <Table
                rowKey={'id'}
                dataSource={grade?.students.entities}
                columns={columns}
                pagination={{
                    current: parseInt(searchParams.get('page') || '') || 1,
                    defaultPageSize: grade?.students.pageSize,
                    total: grade?.students.total,
                    onChange: setStudentsPage,
                }}
            />
        </Space>
    );
};
