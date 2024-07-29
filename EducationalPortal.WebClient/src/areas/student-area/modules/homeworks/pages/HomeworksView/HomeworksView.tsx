import React from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {Form, Input, message, Radio, Space} from 'antd';
import {ButtonUpdate} from '../../../../../../components/ButtonUpdate/ButtonUpdate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import Title from 'antd/es/typography/Title';
import {HomeworkStatus} from '../../../../../../graphQL/modules/homeworks/homework.types';
import {UPDATE_HOMEWORK_MUTATION, UpdateHomeworkData, UpdateHomeworkVars} from '../../../../../../graphQL/modules/homeworks/homeworks.mutations';
import {GET_HOMEWORK_QUERY, GetHomeworkData, GetHomeworkVars} from '../../../../../../graphQL/modules/homeworks/homeworks.queries';
import {homeworkStatusWithTranslateToString} from '../../../../../../convertors/enumWithTranslateToStringConvertor';
import {homeworkStatusToTag} from "../../../../../../convertors/enumToTagConvertor";

export const HomeworksView = () => {
    const params = useParams();
    const id = params.id as string;
    const getHomeworkQuery = useQuery<GetHomeworkData, GetHomeworkVars>(GET_HOMEWORK_QUERY,
        {variables: {id: id, withFiles: true}},
    );
    const navigate = useNavigate();

    if (!id)
        return <Navigate to={'/error'}/>;

    if (getHomeworkQuery.loading)
        return <Loading/>;


    const homework = getHomeworkQuery.data?.getHomework;
    return (
        <Form
            initialValues={{
                id: homework?.id,
                mark: homework?.mark,
                reviewResult: homework?.reviewResult,
                status: homework?.status,
            }}
            {...sizeFormItem}
        >
            <Title level={2}>Перегляд доманьої роботи для {homework?.subjectPost.title} ({homework?.subjectPost.subject.name})</Title>
            <Form.Item name="id" style={{display: 'none'}}>
                <Input type={'hidden'}/>
            </Form.Item>
            <Form.Item label="Виконав">
                <div>{homework?.student.lastName} {homework?.student.firstName}</div>
            </Form.Item>
            <Form.Item label="Текст">
                <div>{homework?.text}</div>
            </Form.Item>
            <Form.Item label="Файли">
                <Space size={10}>
                    {homework?.files.map(file => (
                        <a href={file.path}>{file.name}</a>
                    ))}
                </Space>
            </Form.Item>
            <Form.Item
                name="mark"
                label="Оцінка"
            >
                <div>{homework?.mark}</div>
            </Form.Item>
            <Form.Item
                name="reviewResult"
                label="Результат"
            >
                <div>{homework?.reviewResult}</div>
            </Form.Item>
            <Form.Item
                name="status"
                label="Статус"
            >
                <div>{homework && homeworkStatusToTag(homework.status)}</div>
            </Form.Item>
        </Form>
    );
};
