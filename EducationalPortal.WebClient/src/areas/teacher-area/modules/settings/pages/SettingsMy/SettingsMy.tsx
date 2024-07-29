import React, {FC} from 'react';
import {Tabs} from 'antd';
import {SettingsChangePassword} from '../../../../../../components/SettingsChangePassword/SettingsChangePassword';

export const SettingsMy: FC = () => {
    return (
        <Tabs tabPosition={'top'}>
            <Tabs.TabPane tab="Зміна паролю" key="1">
                <SettingsChangePassword/>
            </Tabs.TabPane>
        </Tabs>
    );
};
