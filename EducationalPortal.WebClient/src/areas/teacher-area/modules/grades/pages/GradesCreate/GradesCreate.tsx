import React from 'react';
import {useMutation} from '@apollo/client';
import {Form, Input, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import {CREATE_GRADE_MUTATION, CreateGradeData, CreateGradeVars} from '../../../../../../graphQL/modules/grades/grades.mutations';
import Title from 'antd/es/typography/Title';

type FormValues = {
    name: string,
}

export const GradesCreate = () => {
    const [createGradeMutation, createGradeMutationOption] = useMutation<CreateGradeData, CreateGradeVars>(CREATE_GRADE_MUTATION);
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const onFinish = async ({name}: FormValues) => {
        createGradeMutation({variables: {createGradeInputType: {name}}})
            .then(response => {
                navigate('../');
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    return (
        <Form
            name="GradesCreateForm"
            onFinish={onFinish}
            form={form}
            {...sizeFormItem}
        >
            <Title level={2}>Створити клас</Title>
            <Form.Item
                name="name"
                label="Назва"
                rules={[{required: true, message: 'Введіть назву!'}]}
            >
                <Input placeholder="Назва"/>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonCreate loading={createGradeMutationOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
