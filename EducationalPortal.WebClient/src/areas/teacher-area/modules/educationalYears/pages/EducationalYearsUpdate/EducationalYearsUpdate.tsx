import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {
    GET_EDUCATIONAL_YEAR_QUERY,
    GetEducationalYearData,
    GetEducationalYearVars,
} from '../../../../../../graphQL/modules/educationalYears/educationalYears.queries';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {DatePicker, Form, Input, message, Switch} from 'antd';
import {
    UPDATE_EDUCATIONAL_YEAR_MUTATION,
    UpdateEducationalYearData,
    UpdateEducationalYearVars,
} from '../../../../../../graphQL/modules/educationalYears/educationalYears.mutations';
import moment from 'moment';
import {ButtonUpdate} from '../../../../../../components/ButtonUpdate/ButtonUpdate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import Title from 'antd/es/typography/Title';
import 'moment/locale/uk';

const {RangePicker} = DatePicker;


type FormValues = {
    id: string,
    name: string,
}

export const EducationalYearsUpdate = () => {
    const params = useParams();
    const id = params.id as string;
    const [updateEducationalYearMutation, updateEducationalYearMutationOption] = useMutation<UpdateEducationalYearData, UpdateEducationalYearVars>(UPDATE_EDUCATIONAL_YEAR_MUTATION);
    const [form] = Form.useForm();
    const getEducationalYearQuery = useQuery<GetEducationalYearData, GetEducationalYearVars>(GET_EDUCATIONAL_YEAR_QUERY,
        {variables: {id: id}},
    );
    const [dateStartAndEnd, setDateStartAndEnd] = useState<any>([]);
    const [isCurrent, setIsCurrent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const educationalYear = getEducationalYearQuery.data?.getEducationalYear;
        setDateStartAndEnd([
            moment(educationalYear?.dateStart.split('T')[0], 'YYYY-MM-DD'),
            moment(educationalYear?.dateEnd.split('T')[0], 'YYYY-MM-DD'),
        ]);
        setIsCurrent(educationalYear?.isCurrent || false);
    }, [getEducationalYearQuery.data]);

    const onFinish = async ({id, name}: FormValues) => {
        const dateStart = new Date(dateStartAndEnd[0]._d.setHours(12)).toISOString();
        const dateEnd = new Date(dateStartAndEnd[1]._d.setHours(12)).toISOString();
        updateEducationalYearMutation({
            variables: {
                updateEducationalYearInputType: {
                    id,
                    name,
                    isCurrent,
                    dateStart,
                    dateEnd,
                },
            },
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

    if (getEducationalYearQuery.loading)
        return <Loading/>;


    const educationalYear = getEducationalYearQuery.data?.getEducationalYear;
    return (
        <Form
            name="EducationalYearsUpdateForm"
            onFinish={onFinish}
            form={form}
            initialValues={{
                id: educationalYear?.id,
                name: educationalYear?.name,
                dateStartAndEnd: [
                    moment(educationalYear?.dateStart.split('T')[0], 'YYYY-MM-DD'),
                    moment(educationalYear?.dateEnd.split('T')[0], 'YYYY-MM-DD'),
                ],
            }}
            {...sizeFormItem}
        >
            <Title level={2}>Оновити навчальний рік</Title>
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
            <Form.Item
                name="isCurrent"
                label="Поточний"
            >
                <Switch checked={isCurrent} onChange={setIsCurrent}/>
            </Form.Item>
            <Form.Item
                label="Дата"
                rules={[{required: true, message: 'Введіть дату початку та дату кінця!'}]}
            >
                <RangePicker value={dateStartAndEnd} onChange={setDateStartAndEnd}/>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonUpdate loading={updateEducationalYearMutationOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
