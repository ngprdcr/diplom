import React, {FC} from 'react';
import {Button} from 'antd';

type Props = {
    loading?: boolean | undefined
    isSubmit?: boolean | undefined
};

export const ButtonUpdate: FC<Props> = ({loading, isSubmit}) => {
    return (
        <Button loading={loading} type={'ghost'} htmlType={!!isSubmit ? 'submit' : 'button'}>Оновити</Button>
    );
};
