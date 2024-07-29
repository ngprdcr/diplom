import React, {useCallback, useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {
    GET_EDUCATIONAL_YEARS_QUERY,
    GetEducationalYearsData,
    GetEducationalYearsVars,
} from '../../../../../../graphQL/modules/educationalYears/educationalYears.queries';
import {ColumnsType} from 'antd/es/table';
import {EducationalYear} from '../../../../../../graphQL/modules/educationalYears/educationalYears.types';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Col, message, Row, Space, Table, Tag} from 'antd';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {
    REMOVE_EDUCATIONAL_YEAR_MUTATION,
    RemoveEducationalYearData,
    RemoveEducationalYearVars,
} from '../../../../../../graphQL/modules/educationalYears/educationalYears.mutations';
import {stringToUkraineDate} from '../../../../../../convertors/stringToDatetimeConvertors';
import Title from 'antd/es/typography/Title';
import Search from 'antd/es/input/Search';
import debounce from 'lodash.debounce';
import '../../../../../../styles/controls.css';
import {isAdministrator} from "../../../../../../utils/permissions";

export const EducationalYearsIndex = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [likeInput, setLikeInput] = useState(searchParams.get('like') || '');
    const navigate = useNavigate();
    const [getEducationalYears, getEducationalYearsOpions] = useLazyQuery<GetEducationalYearsData, GetEducationalYearsVars>(GET_EDUCATIONAL_YEARS_QUERY,
        {fetchPolicy: 'network-only'},
    );
    const [removeEducationalYearsMutation, removeEducationalYearsMutationOptions] = useMutation<RemoveEducationalYearData, RemoveEducationalYearVars>(REMOVE_EDUCATIONAL_YEAR_MUTATION);

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '') || 1;
        const like = searchParams.get('like') || '';
        setLikeInput(like);
        getEducationalYears({variables: {page, like}});
    }, [searchParams]);

    const onRemove = (educationalYearId: string) => {
        removeEducationalYearsMutation({variables: {id: educationalYearId}})
            .then(async (response) => {
                const page = parseInt(searchParams.get('page') || '') || 1;
                const like = searchParams.get('like') || '';
                getEducationalYears({variables: {page, like}});
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const columns: ColumnsType<EducationalYear> = [
        {
            title: 'Назва',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Поточний',
            dataIndex: 'isCurrent',
            key: 'isCurrent',
            render: (text: string, educationalYear: EducationalYear) =>
                <>{educationalYear?.isCurrent
                    ? <Tag color="green">Так</Tag>
                    : <Tag color="red">Ні</Tag>
                }</>,
        },
        {
            title: 'Дата початку',
            dataIndex: 'dateStart',
            key: 'dateStart',
            render: (text: string, educationalYear: EducationalYear) => <>{stringToUkraineDate(educationalYear.dateStart)}</>,
        },
        {
            title: 'Дата кінця',
            dataIndex: 'dateEnd',
            key: 'dateEnd',
            render: (text: string, educationalYear: EducationalYear) => <>{stringToUkraineDate(educationalYear.dateEnd)}</>,
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text: string, educationalYear: EducationalYear) => (
                isAdministrator()
                    ? <ButtonsVUR viewUrl={`${educationalYear.id}`} updateUrl={`update/${educationalYear.id}`}
                                  onRemove={() => onRemove(educationalYear.id)}/>
                    : <ButtonsVUR viewUrl={`${educationalYear.id}`}/>
            ),
        },
    ];

    const debouncedSearchEduYearsHandler = useCallback(debounce(like => setSearchParams({like}), 500), []);
    const searchEduYearsHandler = (value: string) => {
        debouncedSearchEduYearsHandler(value);
        setLikeInput(value);
    };


    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Навчальні роки</Title>
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
                        onChange={e => searchEduYearsHandler(e.target.value)}
                        placeholder="Пошук"
                        enterButton
                        loading={getEducationalYearsOpions.loading}
                        className={'search'}
                    />
                </Col>
            </Row>
            <Table
                style={{width: '100%'}}
                rowKey={'id'}
                loading={getEducationalYearsOpions.loading || removeEducationalYearsMutationOptions.loading}
                dataSource={getEducationalYearsOpions.data?.getEducationalYears.entities}
                columns={columns}
                pagination={{
                    current: parseInt(searchParams.get('page') || '') || 1,
                    defaultPageSize: getEducationalYearsOpions.data?.getEducationalYears.pageSize,
                    total: getEducationalYearsOpions.data?.getEducationalYears.total,
                    onChange: page => setSearchParams({page: page.toString()}),
                }}
            />
        </Space>
    );
};
