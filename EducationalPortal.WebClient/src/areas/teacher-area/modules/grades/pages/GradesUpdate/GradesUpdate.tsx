import React from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {Form, Input, message} from 'antd';
import {ButtonUpdate} from '../../../../../../components/ButtonUpdate/ButtonUpdate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import {UPDATE_GRADE_MUTATION, UpdateGradeData, UpdateGradeVars} from '../../../../../../graphQL/modules/grades/grades.mutations';
import {GET_GRADE_QUERY, GetGradeData, GetGradeVars} from '../../../../../../graphQL/modules/grades/grades.queries';
import Title from 'antd/es/typography/Title';

type FormValues = {
    id: string,
    name: string,
}

export const GradesUpdate = () => {
    const params = useParams();
    const id = params.id as string;
    const [updateGradeMutation, updateGradeMutationOption] = useMutation<UpdateGradeData, UpdateGradeVars>(UPDATE_GRADE_MUTATION);
    const [form] = Form.useForm();
    const getGradeQuery = useQuery<GetGradeData, GetGradeVars>(GET_GRADE_QUERY,
        {variables: {id: id}},
    );
    const navigate = useNavigate();


    const onFinish = async ({id, name}: FormValues) => {
        updateGradeMutation({
            variables: {updateGradeInputType: {id, name}},
        })
            .then(response => {
                navigate('../');
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    if (!id)
        return <Navigate to={'/error'}/>;

    if (getGradeQuery.loading)
        return <Loading/>;


    const grade = getGradeQuery.data?.getGrade;
    return (
        <Form
            name="GradesUpdateForm"
            onFinish={onFinish}
            form={form}
            initialValues={{
                id: grade?.id,
                name: grade?.name,
            }}
            {...sizeFormItem}
        >
            <Title level={2}>Редагування класу</Title>
            <Form.Item name="id" style={{display: 'none'}}>
                <Input type={'hidden'}/>
            </Form.Item>
            <Form.Item
                name="name"
                label="Назва"
                rules={[{required: true, message: 'Введіть назву!'}]}
            >
                <Input placeholder="Назва"/>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonUpdate loading={updateGradeMutationOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
