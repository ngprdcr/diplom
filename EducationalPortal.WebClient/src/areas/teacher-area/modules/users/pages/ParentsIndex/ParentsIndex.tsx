import React, {useCallback, useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Col, message, Row, Space, Table} from 'antd';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {Link, useSearchParams} from 'react-router-dom';
import {GET_USERS_QUERY, GetUsersData, GetUsersVars} from '../../../../../../graphQL/modules/users/users.queries';
import {Role, User} from '../../../../../../graphQL/modules/users/users.types';
import {
    REMOVE_USER_MUTATION,
    RemoveUserData,
    RemoveUserVars
} from '../../../../../../graphQL/modules/users/users.mutations';
import Title from 'antd/es/typography/Title';
import {roleToTag} from '../../../../../../convertors/enumToTagConvertor';
import debounce from 'lodash.debounce';
import Search from 'antd/es/input/Search';
import {isAdministrator} from "../../../../../../utils/permissions";

export const ParentsIndex = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [likeInput, setLikeInput] = useState('');
    const [roles, setRoles] = useState([Role.Parent]);
    const [getParents, getParentsOptions] = useLazyQuery<GetUsersData, GetUsersVars>(GET_USERS_QUERY,
        {fetchPolicy: 'network-only'},
    );
    const [removeTeacherMutation, removeTeacherMutationOptions] = useMutation<RemoveUserData, RemoveUserVars>(REMOVE_USER_MUTATION);

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '') || 1;
        const like = searchParams.get('like') || '';
        setLikeInput(like);
        getParents({variables: {page, like, roles}});
    }, [searchParams]);

    const onRemove = (teacherId: string) => {
        removeTeacherMutation({variables: {id: teacherId}})
            .then(async (response) => {
                const page = parseInt(searchParams.get('page') || '') || 1;
                const like = searchParams.get('like') || '';
                await getParents({variables: {page, like, roles}});
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Батьки',
            dataIndex: 'parents',
            key: 'parents',
            render: (text, teacher) => <>{teacher?.lastName} {teacher?.firstName}</>,
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text, teacher) => (
                isAdministrator()
                    ? <ButtonsVUR viewUrl={`${teacher?.id}`} updateUrl={`update/${teacher?.id}`}
                                  onRemove={() => onRemove(teacher?.id)}/>
                    : <ButtonsVUR viewUrl={`${teacher?.id}`}/>

            ),
        },
    ];

    const debouncedSearchTeachersHandler = useCallback(debounce(like => setSearchParams({like}), 500), []);
    const searchTeachersHandler = (value: string) => {
        debouncedSearchTeachersHandler(value);
        setLikeInput(value);
    };

    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Батьки</Title>

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
                        onChange={e => searchTeachersHandler(e.target.value)}
                        placeholder="Пошук"
                        enterButton
                        loading={getParentsOptions.loading}
                        className={'search'}
                    />
                </Col>
            </Row>
            <Table
                rowKey={'id'}
                loading={getParentsOptions.loading || removeTeacherMutationOptions.loading}
                dataSource={getParentsOptions.data?.getUsers.entities}
                columns={columns}
                pagination={{
                    current: parseInt(searchParams.get('page') || '') || 1,
                    defaultPageSize: getParentsOptions.data?.getUsers.pageSize,
                    total: getParentsOptions.data?.getUsers.total,
                    onChange: page => setSearchParams({page: page.toString()}),
                }}
            />
        </Space>
    );
};
