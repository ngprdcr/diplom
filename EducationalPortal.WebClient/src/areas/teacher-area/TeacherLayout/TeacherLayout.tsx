import React, {FC} from 'react';
import {Layout, Modal} from 'antd';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {TeacherMenu} from '../components/TeacherMenu/TeacherMenu';
import {AppBreadcrumb} from '../components/AppBreadcrumb/AppBreadcrumb';
import {Error} from '../../../components/Error/Error';
import {HomeworksIndex} from '../modules/homeworks/pages/HomeworksIndex/HomeworksIndex';
import {HomeworksUpdate} from '../modules/homeworks/pages/HomeworksUpdate/HomeworksUpdate';
import {EducationalYearsIndex} from '../modules/educationalYears/pages/EducationalYearsIndex/EducationalYearsIndex';
import {EducationalYearsView} from '../modules/educationalYears/pages/EducationalYearsView/EducationalYearsView';
import {EducationalYearsCreate} from '../modules/educationalYears/pages/EducationalYearsCreate/EducationalYearsCreate';
import {EducationalYearsUpdate} from '../modules/educationalYears/pages/EducationalYearsUpdate/EducationalYearsUpdate';
import {GradesIndex} from '../modules/grades/pages/GradesIndex/GradesIndex';
import {GradesView} from '../modules/grades/pages/GradesView/GradesView';
import {GradesCreate} from '../modules/grades/pages/GradesCreate/GradesCreate';
import {GradesUpdate} from '../modules/grades/pages/GradesUpdate/GradesUpdate';
import {SettingsMy} from '../modules/settings/pages/SettingsMy/SettingsMy';
import {SettingsApp} from '../modules/settings/pages/SettingsApp/SettingsApp';
import {SubjectsIndex} from '../modules/subjects/pages/SubjectsIndex/SubjectsIndex';
import {SubjectsMyIndex} from '../modules/subjects/pages/SubjectsMyIndex/SubjectsMyIndex';
import {SubjectsView} from '../modules/subjects/pages/SubjectsView/SubjectsView';
import {SubjectsCreate} from '../modules/subjects/pages/SubjectsCreate/SubjectsCreate';
import {SubjectsUpdate} from '../modules/subjects/pages/SubjectsUpdate/SubjectsUpdate';
import {StudentsIndex} from '../modules/users/pages/StudentsIndex/StudentsIndex';
import {StudentsView} from '../modules/users/pages/StudentsView/StudentsView';
import {StudentsCreate} from '../modules/users/pages/StudentsCreate/StudentsCreate';
import {StudentsUpdate} from '../modules/users/pages/StudentsUpdate/StudentsUpdate';
import {TeachersIndex} from '../modules/users/pages/TeachersIndex/TeachersIndex';
import {TeachersView} from '../modules/users/pages/TeachersView/TeachersView';
import {TeachersCreate} from '../modules/users/pages/TeachersCreate/TeachersCreate';
import {TeachersUpdate} from '../modules/users/pages/TeachersUpdate/TeachersUpdate';
import {WithAdministratorRoleOrRender} from '../../../hocs/WithAdministratorRoleOrRender';
import s from './TeacherLayout.module.css';
import {BackupsIndex} from "../modules/backups/pages/BackupsIndex/BackupsIndex";
import {HomeworksMyIndex} from "../modules/homeworks/pages/HomeworksMyIndex/HomeworksMyIndex";
import {SubjectPostsCreate} from "../modules/subjectPosts/components/SubjectPostsCreate/SubjectPostsCreate";
import {SubjectPostsUpdate} from "../modules/subjectPosts/components/SubjectPostsUpdate/SubjectPostsUpdate";
import {Journal} from "../modules/journal/Journal";

const {Content} = Layout;


const MyModal = () => {
    const navigate = useNavigate();
    return (
        <Modal title="Basic Modal" visible={true} onCancel={() => navigate(-1)}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    )
}

export const TeacherLayout: FC = () => {
    const location = useLocation();
    // @ts-ignore
    const background = location.state && location.state.background;
    return (
        <Layout className={s.layout}>
            <TeacherMenu/>
            <Layout className="site-layout">
                <Content className={s.content}>
                    <AppBreadcrumb/>
                    <div className={s.siteLayoutBackground}>
                        <Routes location={background || location}>
                            <Route path={'educational-years/*'}>
                                <Route index element={<EducationalYearsIndex/>}/>
                                <Route path={':id'} element={<EducationalYearsView/>}/>
                                <Route path={'create'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <EducationalYearsCreate/>
                                    </WithAdministratorRoleOrRender>}/>
                                <Route path={'update/:id'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <EducationalYearsUpdate/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'*'} element={<Error/>}/>
                            </Route>

                            <Route path={'grades/*'}>
                                <Route index element={<GradesIndex/>}/>
                                <Route path={':id'} element={<GradesView/>}/>
                                <Route path={'create'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <GradesCreate/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'update/:id'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <GradesUpdate/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'*'} element={<Error/>}/>
                            </Route>

                            <Route path={'homeworks/*'}>
                                <Route index element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <HomeworksIndex/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'my'} element={<HomeworksMyIndex/>}/>
                                <Route path={'update/:id'} element={<HomeworksUpdate/>}/>
                            </Route>

                            <Route path={'settings/*'}>
                                <Route path={'my'} element={<SettingsMy/>}/>
                                <Route path={'site'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <SettingsApp/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'*'} element={<Error/>}/>
                            </Route>

                            <Route path={'subjects/*'}>
                                <Route index element={<SubjectsIndex/>}/>
                                <Route path={'my'} element={<SubjectsMyIndex/>}/>
                                <Route path={':subjectId'} element={<SubjectsView/>}/>
                                <Route path={':subjectId/subject-posts/create'} element={<SubjectPostsCreate/>}/>
                                <Route path={':subjectId/subject-posts/update/:subjectPostId'} element={<SubjectPostsUpdate/>}/>
                                <Route path={'create'} element={<SubjectsCreate/>}/>
                                <Route path={'update/:subjectId'} element={<SubjectsUpdate/>}/>
                                <Route path={':subjectId/journal'} element={<Journal/>}/>
                                <Route path={'*'} element={<Error/>}/>
                            </Route>

                            <Route path={'students/*'}>
                                <Route index element={<StudentsIndex/>}/>
                                <Route path={':id'} element={<StudentsView/>}/>
                                <Route path={'create'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <StudentsCreate/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'update/:id'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <StudentsUpdate/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'*'} element={<Error/>}/>
                            </Route>

                            <Route path={'teachers/*'}>
                                <Route index element={<TeachersIndex/>}/>
                                <Route path={':id'} element={<TeachersView/>}/>
                                <Route path={'create'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <TeachersCreate/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'update/:id'} element={
                                    <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                        <TeachersUpdate/>
                                    </WithAdministratorRoleOrRender>
                                }/>
                                <Route path={'*'} element={<Error/>}/>
                            </Route>

                            <Route path={'backups'} element={
                                <WithAdministratorRoleOrRender render={<Error statusCode={403}/>}>
                                    <BackupsIndex/>
                                </WithAdministratorRoleOrRender>
                            }/>
                            <Route index element={<Navigate to={'subjects/my'}/>}/>
                            <Route path={'*'} element={<Error/>}/>
                        </Routes>
                        {background && (
                            <Routes>
                                <Route path="subjects/:subjectId/subject-posts/create" element={<SubjectPostsCreate/>}/>
                                <Route path="subjects/:subjectId/subject-posts/update/:subjectPostId" element={<SubjectPostsUpdate/>}/>
                            </Routes>
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
