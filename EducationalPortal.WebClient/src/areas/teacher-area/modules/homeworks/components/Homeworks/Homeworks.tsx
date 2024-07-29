import React, {FC} from 'react';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Modal, Table} from 'antd';
import {Homework, HomeworkStatus} from '../../../../../../graphQL/modules/homeworks/homework.types';
import {stringToUkraineDatetime} from '../../../../../../convertors/stringToDatetimeConvertors';
import {homeworkStatusToTag} from '../../../../../../convertors/enumToTagConvertor';
import {homeworkStatusWithTranslateToString} from '../../../../../../convertors/enumWithTranslateToStringConvertor';
import {useSearchParams} from "react-router-dom";

type Props = {
    isModalHomeworksVisible: boolean,
    setModalHomeworksInvisible: () => void,
    homeworks: Homework[],
    page?: number,
    statuses?: string[],
    loading?: boolean,
    pageSize?: number,
    total?: number,
    path: string,
}

export const Homeworks: FC<Props> = ({
                                         homeworks,
                                         page,
                                         statuses,
                                         loading,
                                         pageSize,
                                         total,
                                         isModalHomeworksVisible,
                                         setModalHomeworksInvisible,
                                         path = ''
                                     }) => {
    // const [removeSubjectMutation, removeSubjectMutationOptions] = useMutation<RemoveSubjectData, RemoveSubjectVars>(REMOVE_SUBJECT_MUTATION);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleCancel = () => {
        setModalHomeworksInvisible();
    };

    const onRemove = (subjectId: string) => {
        // removeSubjectMutation({variables: {id: subjectId}})
        //     .then(async (response) => {
        //         const page = parseInt(searchParams.get('page') || '') || 1;
        //         const like = searchParams.get('like') || '';
        //         await getSubjects({variables: {page, like}});
        //     })
        //     .catch(error => {
        //         message.error(error.message);
        //     });
    };

    const columns: ColumnsType<Homework> = [
        {
            title: 'Пост',
            dataIndex: 'subjectPost',
            key: 'subjectPost',
            render: (text, homework) => <>{homework?.subjectPost?.title}</>,
        },
        {
            title: 'Виконав',
            dataIndex: 'student',
            key: 'student',
            render: (text, homework) => <>{homework?.student?.lastName} {homework?.student?.firstName}</>,
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
            defaultFilteredValue: statuses,
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
                // (currentUser?.id === subject.teacherId || currentUser?.role === Role.Administrator)
                //     ? <ButtonsVUR viewUrl={`${subject?.id}`} updateUrl={`update/${subject?.id}`}
                //                   onRemove={() => onRemove(subject?.id)}/>
                //     : <ButtonsVUR viewUrl={`${subject?.id}`}/>
                <ButtonsVUR updateUrl={`${path}/update/${homework?.id}`} onRemove={() => onRemove(homework?.id)}/>
            ),
        },
    ];

    return (
        <Modal
            title="Домашні роботи"
            visible={isModalHomeworksVisible}
            onCancel={handleCancel}
            footer={false}
            width={'70%'}
        >
            <Table
                rowKey={'id'}
                loading={loading /*|| removeSubjectMutationOptions.loading*/}
                dataSource={homeworks}
                columns={columns}
                pagination={{
                    current: page,
                    defaultPageSize: pageSize,
                    total: total,
                    onChange: page => setSearchParams({page: page.toString()}),
                }}
                onChange={(pagination, filters, sorter: any) => {
                    setSearchParams({
                        statuses: filters.status?.join('|') || '',
                        order: sorter.order
                    });
                }}
            />
        </Modal>

    );
};
