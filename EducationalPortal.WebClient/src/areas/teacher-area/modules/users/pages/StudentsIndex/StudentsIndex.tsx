import React, {useCallback, useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Col, message, Row, Space, Table, Tag} from 'antd';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {Link, useSearchParams} from 'react-router-dom';
import {
    GET_USERS_WITH_GRADE_QUERY,
    GetUsersWithGradeData,
    GetUsersWithGradeVars
} from '../../../../../../graphQL/modules/users/users.queries';
import {Role, User} from '../../../../../../graphQL/modules/users/users.types';
import {
    REMOVE_USER_MUTATION,
    RemoveUserData,
    RemoveUserVars
} from '../../../../../../graphQL/modules/users/users.mutations';
import Title from 'antd/es/typography/Title';
import debounce from 'lodash.debounce';
import Search from 'antd/es/input/Search';
import {isAdministrator} from "../../../../../../utils/permissions";

export const StudentsIndex = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [likeInput, setLikeInput] = useState('');
    const [roles, setRoles] = useState([Role.Student]);
    const [getStudents, getStudentsOptions] = useLazyQuery<GetUsersWithGradeData, GetUsersWithGradeVars>(GET_USERS_WITH_GRADE_QUERY,
        {fetchPolicy: 'network-only'},
    );
    const [removeStudentMutation, removeStudentMutationOptions] = useMutation<RemoveUserData, RemoveUserVars>(REMOVE_USER_MUTATION);

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '') || 1;
        const like = searchParams.get('like') || '';
        setLikeInput(like);
        getStudents({variables: {page, like, roles}});
    }, [searchParams]);

    const onRemove = (studentId: string) => {
        removeStudentMutation({variables: {id: studentId}})
            .then(async (response) => {
                const page = parseInt(searchParams.get('page') || '') || 1;
                const like = searchParams.get('like') || '';
                await getStudents({variables: {page, like, roles}});
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Учень',
            dataIndex: 'student',
            key: 'student',
            render: (text, student) => <>{student?.lastName} {student?.firstName}</>,
        },
        {
            title: 'Клас',
            dataIndex: 'grade',
            key: 'grade',
            render: (text, student) => student?.grade
                && <Tag>
                    <Link to={`../../grades/${student.gradeId}`}>{student.grade?.name}</Link>
                </Tag>,
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text, student) => (
                isAdministrator()
                    ? <ButtonsVUR viewUrl={`${student?.id}`} updateUrl={`update/${student?.id}`}
                                  onRemove={() => onRemove(student?.id)}/>
                    : <ButtonsVUR viewUrl={`${student?.id}`}/>

            ),
        },
    ];

    const debouncedSearchStudentsHandler = useCallback(debounce(like => setSearchParams({like}), 500), []);
    const searchStudentsHandler = (value: string) => {
        debouncedSearchStudentsHandler(value);
        setLikeInput(value);
    };

    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Учні</Title>

            <Row justify="space-between">
                <Col>
                    {isAdministrator() &&
                        <Link to={'create'}>
                            <ButtonCreate/>
                        </Link>
                    }
                </Col>
                <Col>
                    <Search
                        allowClear
                        value={likeInput}
                        onChange={e => searchStudentsHandler(e.target.value)}
                        placeholder="Пошук"
                        enterButton
                        loading={getStudentsOptions.loading}
                        className={'search'}
                    />
                </Col>
            </Row>
            <Table
                style={{width: '100%'}}
                rowKey={'id'}
                loading={getStudentsOptions.loading || removeStudentMutationOptions.loading}
                dataSource={getStudentsOptions.data?.getUsers.entities}
                columns={columns}
                pagination={{
                    current: parseInt(searchParams.get('page') || '') || 1,
                    defaultPageSize: getStudentsOptions.data?.getUsers.pageSize,
                    total: getStudentsOptions.data?.getUsers.total,
                    onChange: page => setSearchParams({page: page.toString()}),
                }}
            />
        </Space>
    );
};
