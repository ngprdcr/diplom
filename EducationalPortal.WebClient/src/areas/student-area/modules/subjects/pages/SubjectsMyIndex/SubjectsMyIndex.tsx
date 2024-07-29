import React, {useCallback, useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/client';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Col, Row, Space, Table, Tag} from 'antd';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {Link, useSearchParams} from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import {useAppSelector} from '../../../../../../store/store';
import debounce from 'lodash.debounce';
import Search from 'antd/es/input/Search';
import {
    GET_MY_SUBJECTS_QUERY,
    GetMySubjectsData,
    GetMySubjectsVars,
} from '../../../../../../graphQL/modules/subjects/subjects.queries';
import {Subject} from '../../../../../../graphQL/modules/subjects/subjects.types';

export const SubjectsMyIndex = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [likeInput, setLikeInput] = useState('');
    const currentUser = useAppSelector(s => s.auth.me?.user);
    const [getSubjects, getSubjectsOptions] = useLazyQuery<GetMySubjectsData, GetMySubjectsVars>(GET_MY_SUBJECTS_QUERY,
        {fetchPolicy: 'network-only'},
    );

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '') || 1;
        const like = searchParams.get('like') || '';
        setLikeInput(like);
        getSubjects({variables: {page, like}});
    }, [searchParams]);

    const columns: ColumnsType<Subject> = [
        {
            title: 'Назва',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Класи',
            dataIndex: 'grades',
            key: 'grades',
            render: (text, subject) => (
                subject.gradesHaveAccessRead.map(grade => <Tag>{grade.name}</Tag>)
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text: string, subject: Subject) => (
                <ButtonsVUR viewUrl={`../${subject?.id}`}/>
            ),
        },
    ];

    const debouncedSearchMySubjectsHandler = useCallback(debounce(like => setSearchParams({like}), 500), []);
    const searchMySubjectsHandler = (value: string) => {
        debouncedSearchMySubjectsHandler(value);
        setLikeInput(value);
    };

    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Мої предмети</Title>
            <Row justify="space-between">
                <Col></Col>
                <Col>
                    <Search
                        allowClear
                        value={likeInput}
                        onChange={e => searchMySubjectsHandler(e.target.value)}
                        placeholder="Пошук"
                        enterButton
                        loading={getSubjectsOptions.loading}
                        className={'search'}
                    />
                </Col>
            </Row>
            <Table
                style={{width: '100%'}}
                rowKey={'id'}
                loading={getSubjectsOptions.loading}
                dataSource={getSubjectsOptions.data?.getMySubjects.entities}
                columns={columns}
                pagination={{
                    current: parseInt(searchParams.get('page') || '') || 1,
                    defaultPageSize: getSubjectsOptions.data?.getMySubjects.pageSize,
                    total: getSubjectsOptions.data?.getMySubjects.total,
                    onChange: page => setSearchParams({page: page.toString()}),
                }}
            />
        </Space>
    );
};
