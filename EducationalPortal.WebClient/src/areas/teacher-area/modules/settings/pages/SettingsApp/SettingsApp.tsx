import React, {FC} from 'react';
import {Form, Input, message, Space} from 'antd';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import Title from 'antd/es/typography/Title';
import {ButtonUpdate} from '../../../../../../components/ButtonUpdate/ButtonUpdate';
import {useAppDispatch, useAppSelector} from '../../../../../../store/store';
import {AppName, settingsActions} from '../../../../../../store/settings.slice';
import {useMutation} from '@apollo/client';
import {
    CREATE_OR_UPDATE_SETTING_MUTATION,
    CreateOrUpdateSettingData,
    CreateOrUpdateSettingVars,
} from '../../../../../../graphQL/modules/settings/settings.mutations';

type AppNameFormType = {
    name: string,
}

export const SettingsApp: FC = () => {
    const settings = useAppSelector(s => s.settings.settings);
    const [createOrUpdateSetting, createOrUpdateSettingOptions] = useMutation<CreateOrUpdateSettingData, CreateOrUpdateSettingVars>(CREATE_OR_UPDATE_SETTING_MUTATION);
    const dispatch = useAppDispatch();

    const createOrUpdateName = (values: AppNameFormType) => {
        createOrUpdateSetting({variables: {createOrUpdateSettingInputType: {name: AppName, value: values.name}}})
            .then(response => {
                response.data && dispatch(settingsActions.setSetting(response.data.createOrUpdateSetting));
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    return (
        <Space direction={'vertical'} style={{width: '100%'}}>
            <Form
                name="AppNameForm"
                onFinish={createOrUpdateName}
                initialValues={{
                    name: settings?.find(s => s.name === AppName)?.value,
                }}
                {...sizeFormItem}
            >
                <Form.Item
                    name="name"
                    label="Назва"
                    rules={[{required: true, message: 'Введіть назву!'}]}
                >
                    <Input placeholder="Назва"/>
                </Form.Item>
                <Form.Item {...sizeButtonItem}>
                    <ButtonUpdate loading={createOrUpdateSettingOptions.loading} isSubmit={true}/>
                </Form.Item>
            </Form>
        </Space>
    );
};
