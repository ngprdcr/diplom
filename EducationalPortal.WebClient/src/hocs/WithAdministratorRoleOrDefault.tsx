import React, {FC} from 'react';
import {useAppSelector} from '../store/store';
import {Role} from '../graphQL/modules/users/users.types';

type Props = {
    children?: React.ReactNode,
}

export const WithAdministratorRoleOrDefault: FC<Props> = ({children}) => {
    const me = useAppSelector(s => s.auth.me);
    if (me?.user.role !== Role.Administrator)
        return (<></>);
    return (<>{children}</>);
};
