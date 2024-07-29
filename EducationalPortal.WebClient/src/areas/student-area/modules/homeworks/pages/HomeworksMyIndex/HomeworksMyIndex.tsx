import React, {useEffect} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {message, Space, Table} from 'antd';
import {Link, useSearchParams} from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import {
    GET_MY_HOMEWORKS_QUERY,
    GetMyHomeworksData,
    GetMyHomeworksVars
} from '../../../../../../graphQL/modules/homeworks/homeworks.queries';
import {Homework, HomeworkStatus} from '../../../../../../graphQL/modules/homeworks/homework.types';
import {stringToUkraineDatetime} from '../../../../../../convertors/stringToDatetimeConvertors';
import {Order} from '../../../../../../graphQL/enums/order';
import {homeworkStatusToTag} from '../../../../../../convertors/enumToTagConvertor';
import {homeworkStatusWithTranslateToString} from '../../../../../../convertors/enumWithTranslateToStringConvertor';
import {
    REMOVE_HOMEWORK_MUTATION,
    RemoveHomeworkData,
    RemoveHomeworkVars
} from "../../../../../../graphQL/modules/homeworks/homeworks.mutations";

export const HomeworksMyIndex = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [getMyHomeworks, getMyHomeworksOptions] = useLazyQuery<GetMyHomeworksData, GetMyHomeworksVars>(GET_MY_HOMEWORKS_QUERY,
        {fetchPolicy: 'network-only'},
    );
    const [removeHomework, removeHomeworkOptions] = useMutation<RemoveHomeworkData, RemoveHomeworkVars>(REMOVE_HOMEWORK_MUTATION);

    const refetchMyHomeworks = async () => {
        const page = parseInt(searchParams.get('page') || '') || 1;
        const statuses = searchParams.get('statuses')?.split('|').filter(s => Object.values(HomeworkStatus).includes(s as HomeworkStatus)) as HomeworkStatus[];
        const orderString = searchParams.get('order') || '';
        const order = Object.values(Order).includes(orderString?.toUpperCase() as Order)
            ? Order[orderString.charAt(0).toUpperCase() + orderString.toLowerCase().slice(1) as keyof typeof Order || Order.Descend]
            : Order.Descend;
        getMyHomeworks({
            variables: {
                page,
                statuses: statuses,
                order: order,
                withFiles: true,
            },
        });
    }

    useEffect(() => {
        refetchMyHomeworks()
    }, [searchParams]);

    const onRemove = (homeworkId: string) => {
        removeHomework({variables: {id: homeworkId}})
            .then(async (response) => {
                refetchMyHomeworks()
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const columns: ColumnsType<Homework> = [
        {
            title: 'Предмет',
            dataIndex: 'subject',
            key: 'subject',
            render: (text, homework) => <Link
                to={`../../subjects/${homework?.subjectPost?.subjectId}`}>{homework?.subjectPost?.subject.name}</Link>,
        },
        {
            title: 'Пост',
            dataIndex: 'subjectPost',
            key: 'subjectPost',
            render: (text, homework) => <>{homework?.subjectPost?.title}</>,
        },
        {
            title: 'Оцінка',
            dataIndex: 'mark',
            key: 'mark',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (text, homework) => homeworkStatusToTag(text),
            filters: (Object.values(HomeworkStatus) as Array<HomeworkStatus>).map((value) => ({
                value: value,
                text: homeworkStatusWithTranslateToString(value),
            })),
            defaultFilteredValue: searchParams.get('statuses')?.split('|'),
        },
        {
            title: 'Надіслано',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text, homework) => stringToUkraineDatetime(text),
            sorter: true,
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text, homework) => (
                <ButtonsVUR viewUrl={`../${homework.id}`} onRemove={() => onRemove(homework?.id)}/>
            ),
        },
    ];

    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Мої домашні роботи</Title>
            <Table
                rowKey={'id'}
                loading={getMyHomeworksOptions.loading /*|| removeSubjectMutationOptions.loading*/}
                dataSource={getMyHomeworksOptions.data?.getMyHomeworks.entities}
                columns={columns}
                pagination={{
                    current: parseInt(searchParams.get('page') || '') || 1,
                    defaultPageSize: getMyHomeworksOptions.data?.getMyHomeworks.pageSize,
                    total: getMyHomeworksOptions.data?.getMyHomeworks.total,
                    onChange: page => setSearchParams({page: page.toString()}),
                }}
                onChange={(pagination, filters, sorter: any) => {
                    console.log(pagination, filters, sorter);
                    setSearchParams({statuses: filters.status?.join('|') || '', order: sorter.order});
                }}
            />
        </Space>
    );
};
