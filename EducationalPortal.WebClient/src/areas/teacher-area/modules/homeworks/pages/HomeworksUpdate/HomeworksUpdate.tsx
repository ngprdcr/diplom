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

type FormValues = {
    id: string,
    mark: string,
    reviewResult: string,
    status: HomeworkStatus,
}

export const HomeworksUpdate = () => {
    const params = useParams();
    const id = params.id as string;
    const getHomeworkQuery = useQuery<GetHomeworkData, GetHomeworkVars>(GET_HOMEWORK_QUERY,
        {variables: {id: id, withFiles: true}},
    );
    const [updateHomework, updateHomeworkOptions] = useMutation<UpdateHomeworkData, UpdateHomeworkVars>(UPDATE_HOMEWORK_MUTATION);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async ({id, mark, reviewResult, status}: FormValues) => {
        updateHomework({
            variables: {
                updateHomeworkInputType: {
                    id,
                    mark: mark ? +mark : null,
                    reviewResult,
                    status,
                },
                withFiles: false
            },
        })
            .then(response => {
                navigate(-1);
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    if (!id)
        return <Navigate to={'/error'}/>;

    if (getHomeworkQuery.loading)
        return <Loading/>;


    const homework = getHomeworkQuery.data?.getHomework;
    return (
        <Form
            name="HomeworkUpdateForm"
            onFinish={onFinish}
            form={form}
            initialValues={{
                id: homework?.id,
                mark: homework?.mark,
                reviewResult: homework?.reviewResult,
                status: homework?.status,
            }}
            {...sizeFormItem}
        >
            <Title level={2}>Редагування домашньої роботи для {homework?.subjectPost.title} ({homework?.subjectPost.subject.name})</Title>
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
                <Input type="number" placeholder="Оцінка"/>
            </Form.Item>
            <Form.Item
                name="reviewResult"
                label="Результат"
            >
                <Input placeholder="Результат"/>
            </Form.Item>
            <Form.Item
                name="status"
                label="Статус"
            >
                <Radio.Group
                    options={(Object.values(HomeworkStatus) as Array<HomeworkStatus>).map((value) => ({
                        label: homeworkStatusWithTranslateToString(value),
                        value: value,
                    }))}
                    optionType="button"
                />
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonUpdate loading={updateHomeworkOptions.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
