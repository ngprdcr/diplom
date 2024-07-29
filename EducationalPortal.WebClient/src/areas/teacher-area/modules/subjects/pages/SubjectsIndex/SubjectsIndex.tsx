import React, {useCallback, useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Col, message, Row, Space, Table, Tag} from 'antd';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {Link, useLocation, useSearchParams} from 'react-router-dom';
import {
    GET_SUBJECTS_QUERY,
    GetSubjectsData,
    GetSubjectsVars
} from '../../../../../../graphQL/modules/subjects/subjects.queries';
import {Subject} from '../../../../../../graphQL/modules/subjects/subjects.types';
import {
    REMOVE_SUBJECT_MUTATION,
    RemoveSubjectData,
    RemoveSubjectVars
} from '../../../../../../graphQL/modules/subjects/subjects.mutations';
import Title from 'antd/es/typography/Title';
import {useAppSelector} from '../../../../../../store/store';
import Search from 'antd/es/input/Search';
import debounce from 'lodash.debounce';
import {Role} from "../../../../../../graphQL/modules/users/users.types";

export const SubjectsIndex = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [likeInput, setLikeInput] = useState('');
    const currentUser = useAppSelector(s => s.auth.me?.user);
    const [getSubjects, getSubjectsOptions] = useLazyQuery<GetSubjectsData, GetSubjectsVars>(GET_SUBJECTS_QUERY,
        {fetchPolicy: 'network-only'},
    );
    const [removeSubjectMutation, removeSubjectMutationOptions] = useMutation<RemoveSubjectData, RemoveSubjectVars>(REMOVE_SUBJECT_MUTATION);

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '') || 1;
        const like = searchParams.get('like') || '';
        setLikeInput(like);
        getSubjects({variables: {page, like}});
    }, [searchParams]);

    const onRemove = (subjectId: string) => {
        removeSubjectMutation({variables: {id: subjectId}})
            .then(async (response) => {
                const page = parseInt(searchParams.get('page') || '') || 1;
                const like = searchParams.get('like') || '';
                await getSubjects({variables: {page, like}});
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const columns: ColumnsType<Subject> = [
        {
            title: 'Назва',
            dataIndex: 'name',
            key: 'name',
            render: (text, subject) => (
                <Space>
                    <div>{subject.name}</div>
                    <div>
                        {subject.teacherId === currentUser?.id && <Tag color={'green'}>Мій</Tag>}
                        {subject.teachersHaveAccessCreatePosts?.some(t => t.id === currentUser?.id) &&
                            <Tag color={'cyan'}>Надано доступ</Tag>}
                    </div>
                </Space>
            ),
        },
        {
            title: 'Класи',
            dataIndex: 'grades',
            key: 'grades',
            render: (text, subject) => (
                subject.gradesHaveAccessRead?.map(grade => (
                    <Link to={`../../grades/${grade.id}`}>
                        <Tag>{grade.name}</Tag>
                    </Link>
                ))
            )
        },
        {
            title: 'Вчитель',
            dataIndex: 'teacher',
            key: 'teacher',
            render: (text, subject) => (
                <Link to={`../../teachers/${subject?.teacherId}`}>
                    {subject?.teacher?.lastName} {subject?.teacher?.firstName}
                </Link>
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text, subject: Subject) => (
                (currentUser?.id === subject.teacherId || currentUser?.role === Role.Administrator)
                    ? <ButtonsVUR viewUrl={`${subject?.id}`} updateUrl={`update/${subject?.id}`}
                                  onRemove={() => onRemove(subject?.id)}/>
                    : <ButtonsVUR viewUrl={`${subject?.id}`}/>

            ),
        },
    ];

    const debouncedSearchSubjectsHandler = useCallback(debounce(like => setSearchParams({like}), 500), []);
    const searchSubjectsHandler = (value: string) => {
        debouncedSearchSubjectsHandler(value);
        setLikeInput(value);
    };

    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Предмети</Title>
            <Row justify="space-between">
                <Col>
                    <Link to={'create'}>
                        <ButtonCreate/>
                    </Link>
                </Col>
                <Col>
                    <Search
                        allowClear
                        value={likeInput}
                        onChange={e => searchSubjectsHandler(e.target.value)}
                        placeholder="Пошук"
                        enterButton
                        loading={getSubjectsOptions.loading}
                        className={'search'}
                    />
                </Col>
            </Row>
            <Table
                rowKey={'id'}
                loading={getSubjectsOptions.loading || removeSubjectMutationOptions.loading}
                dataSource={getSubjectsOptions.data?.getSubjects.entities}
                columns={columns}
                pagination={{
                    current: parseInt(searchParams.get('page') || '') || 1,
                    defaultPageSize: getSubjectsOptions.data?.getSubjects.pageSize,
                    total: getSubjectsOptions.data?.getSubjects.total,
                    onChange: page => setSearchParams({page: page.toString()}),
                }}
            />
        </Space>
    );
};
