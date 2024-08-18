import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {authActions} from './store/auth.slice';
import {Loading} from './components/Loading/Loading';
import {TeacherLayout} from './areas/teacher-area/TeacherLayout/TeacherLayout';
import {LoginPage} from './graphQL/modules/auth/pages/LoginPage/LoginPage';
import {useAppDispatch, useAppSelector} from './store/store';
import {WithTeacherRoleOrRender} from './hocs/WithTeacherRoleOrRender';
import {ME_QUERY, MeData, MeVars} from './graphQL/modules/auth/auth.queries';
import {GET_SETTINGS_QUERY, GetSettingsData, GetSettingsVars} from './graphQL/modules/settings/settings.queries';
import {client} from './graphQL/client';
import {AppName, settingsActions} from './store/settings.slice';
import {WithStudentRoleOrRender} from './hocs/WithStudentRoleOrRender';
import {StudentLayout} from './areas/student-area/StudentLayout/StudentLayout';
import {Error} from './components/Error/Error';
import {Role} from './graphQL/modules/users/users.types';
import 'antd/dist/antd.css';
import './App.css';

export const App = () => {
    const dispatch = useAppDispatch();
    const [isMeDone, setMeDone] = useState(false);
    const [isGetSettingsDone, setIsGetSettingsDone] = useState(false);
    const isAuth = useAppSelector(s => s.auth.isAuth);
    const me = useAppSelector(s => s.auth.me);

    useEffect(() => {
        client.query<MeData, MeVars>({query: ME_QUERY})
            .then(response => {
                dispatch(authActions.login({me: response.data.me}));
                setMeDone(true);
            })
            .catch(error => {
                setMeDone(true);
            });

        client.query<GetSettingsData, GetSettingsVars>({query: GET_SETTINGS_QUERY})
            .then(response => {
                document.title = response.data.getSettings?.find(s => s.name === AppName)?.value;
                dispatch(settingsActions.setSettings(response.data.getSettings));
                setIsGetSettingsDone(true);
            })
            .catch(error => {
                setIsGetSettingsDone(true);
            });
    }, []);

    if (!isMeDone || !isGetSettingsDone)
        return <Loading/>;

    return (
        <Routes>
            <Route path="login" element={<LoginPage/>}/>
            <Route path="teacher/*" element={
                <WithTeacherRoleOrRender render={isAuth ? <Error statusCode={403}/> : <Navigate to={'/login'}/>}>
                    <TeacherLayout/>
                </WithTeacherRoleOrRender>
            }/>
            <Route path="student/*" element={
                <WithStudentRoleOrRender render={isAuth ? <Error statusCode={403}/> : <Navigate to={'/login'}/>}>
                    <StudentLayout/>
                </WithStudentRoleOrRender>
            }/>
            <Route path="/*" element={isAuth
                ? me?.user.role === Role.Student || me?.user.role === Role.Parent
                    ? <StudentLayout/>
                    : <TeacherLayout/>
                : <Navigate to={'/login'}/>}/>
        </Routes>
    );
};
