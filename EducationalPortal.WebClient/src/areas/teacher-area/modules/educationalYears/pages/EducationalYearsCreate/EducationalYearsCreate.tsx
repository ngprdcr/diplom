import React from 'react';
import {useMutation} from '@apollo/client';
import {
    CREATE_EDUCATIONAL_YEAR_MUTATION,
    CreateEducationalYearData,
    CreateEducationalYearVars,
} from '../../../../../../graphQL/modules/educationalYears/educationalYears.mutations';
import {DatePicker, Form, Input, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import Title from 'antd/es/typography/Title';
import {ukDateFormat} from '../../../../../../utils/formats';
import 'moment/locale/uk';

const {RangePicker} = DatePicker;

type FormValues = {
    name: string,
    dateStartAndEnd: any[],
}

export const EducationalYearsCreate = () => {
    const [createEducationalYearMutation, createEducationalYearMutationOption] = useMutation<CreateEducationalYearData, CreateEducationalYearVars>(CREATE_EDUCATIONAL_YEAR_MUTATION);
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const onFinish = async ({name, dateStartAndEnd}: FormValues) => {
        const dateStart = dateStartAndEnd[0]._d.toISOString();
        const dateEnd = dateStartAndEnd[1]._d.toISOString();
        createEducationalYearMutation({variables: {createEducationalYearInputType: {name, dateStart, dateEnd}}})
            .then(response => {
                navigate('../');
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    return (
        <Form
            name="EducationalYearsCreateForm"
            onFinish={onFinish}
            form={form}
            {...sizeFormItem}
        >
            <Title level={2}>Створити навчальний рік</Title>
            <Form.Item
                name="name"
                label="Назва"
                rules={[{required: true, message: 'Введіть назву!'}]}
            >
                <Input placeholder="Назва"/>
            </Form.Item>

            <Form.Item
                name="dateStartAndEnd"
                label="Дата"
                rules={[{required: true, message: 'Введіть дату початку та дату кінця!'}]}
            >
                <RangePicker format={ukDateFormat}/>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonCreate loading={createEducationalYearMutationOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
