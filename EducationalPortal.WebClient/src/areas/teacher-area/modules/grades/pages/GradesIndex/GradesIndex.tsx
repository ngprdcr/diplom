import React, {useCallback, useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Col, message, Row, Space, Table} from 'antd';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {GET_GRADES_QUERY, GetGradesData, GetGradesVars} from '../../../../../../graphQL/modules/grades/grades.queries';
import {Grade} from '../../../../../../graphQL/modules/grades/grades.types';
import {
    REMOVE_GRADE_MUTATION,
    RemoveGradeData,
    RemoveGradeVars
} from '../../../../../../graphQL/modules/grades/grades.mutations';
import Title from 'antd/es/typography/Title';
import debounce from 'lodash.debounce';
import Search from 'antd/es/input/Search';
import {isAdministrator} from "../../../../../../utils/permissions";

export const GradesIndex = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [likeInput, setLikeInput] = useState('');
    const [getGrades, getGradesOptions] = useLazyQuery<GetGradesData, GetGradesVars>(GET_GRADES_QUERY,
        {fetchPolicy: 'network-only'},
    );
    const [removeGradeMutation, removeGradeMutationOptions] = useMutation<RemoveGradeData, RemoveGradeVars>(REMOVE_GRADE_MUTATION);
    const navigate = useNavigate();

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '') || 1;
        const like = searchParams.get('like') || '';
        setLikeInput(like);
        getGrades({variables: {page, like}});
    }, [searchParams]);

    const onRemove = (gradeId: string) => {
        removeGradeMutation({variables: {id: gradeId}})
            .then(async (response) => {
                const page = parseInt(searchParams.get('page') || '') || 1;
                const like = searchParams.get('like') || '';
                await getGrades({variables: {page, like}});
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const columns: ColumnsType<Grade> = [
        {
            title: 'Назва',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text, grade) => (
                isAdministrator()
                    ? <ButtonsVUR viewUrl={`${grade?.id}`} updateUrl={`update/${grade?.id}`}
                                  onRemove={() => onRemove(grade?.id)}/>
                    : <ButtonsVUR viewUrl={`${grade?.id}`}/>

            ),
        },
    ];

    const debouncedSearchGradesHandler = useCallback(debounce(like => setSearchParams({like}), 500), []);
    const searchGradesHandler = (value: string) => {
        debouncedSearchGradesHandler(value);
        setLikeInput(value);
    };

    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Класи</Title>

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
                        value={likeInput}
                        onChange={e => searchGradesHandler(e.target.value)}
                        placeholder="Пошук"
                        enterButton
                        loading={getGradesOptions.loading}
                        className={'search'}
                    />
                </Col>
            </Row>
            <Table
                rowKey={'id'}
                loading={getGradesOptions.loading || removeGradeMutationOptions.loading}
                dataSource={getGradesOptions.data?.getGrades.entities}
                columns={columns}
                pagination={{
                    current: parseInt(searchParams.get('page') || '') || 1,
                    defaultPageSize: getGradesOptions.data?.getGrades.pageSize,
                    total: getGradesOptions.data?.getGrades.total,
                    onChange: page => setSearchParams({page: page.toString()}),
                }}
            />
        </Space>
    );
};
