import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Link, Navigate, Outlet, useLocation, useNavigate, useParams} from 'react-router-dom';
import {Loading} from '../../../../../../components/Loading/Loading';
import {
    GET_SUBJECT_WITH_POSTS_QUERY,
    GetSubjectWithPostsData,
    GetSubjectWithPostsVars
} from '../../../../../../graphQL/modules/subjects/subjects.queries';
import {SubjectPostsIndex} from '../../../subjectPosts/components/SubjectPostsIndex/SubjectPostsIndex';
import {Button, message, Space, Tag} from 'antd';
import Title from 'antd/es/typography/Title';
import '../../../../../../styles/table.css';
import {ButtonsVUR} from "../../../../../../components/ButtonsVUD/ButtonsVUR";
import {
    REMOVE_SUBJECT_MUTATION,
    RemoveSubjectData,
    RemoveSubjectVars
} from "../../../../../../graphQL/modules/subjects/subjects.mutations";
import {Subject} from "../../../../../../graphQL/modules/subjects/subjects.types";
import {useAppSelector} from "../../../../../../store/store";
import {ButtonCreate} from "../../../../../../components/ButtonCreate/ButtonCreate";

export const SubjectsView = () => {
    const params = useParams();
    const subjectId = params.subjectId as string;
    const navigate = useNavigate();
    const [postsPage, setPostsPage] = useState(1);
    const currentUser = useAppSelector(s => s.auth.me?.user);
    const getSubjectQuery = useQuery<GetSubjectWithPostsData, GetSubjectWithPostsVars>(GET_SUBJECT_WITH_POSTS_QUERY,
        {variables: {id: subjectId, postsPage: postsPage, withHomeworks: true, withFiles: true, withStatistics: true}},
    );
    const [removeSubjectMutation, removeSubjectMutationOptions] = useMutation<RemoveSubjectData, RemoveSubjectVars>(REMOVE_SUBJECT_MUTATION);
    const location = useLocation();

    // useEffect(() => {
    //     getSubjectQuery.refetch();
    // }, [location])

    useEffect(() => {
        getSubjectQuery.error && message.error(getSubjectQuery.error.message)
    }, [getSubjectQuery.error])

    const refetchSubjectAsync = async () => {
        await getSubjectQuery.refetch({id: subjectId, postsPage: postsPage});
    };

    const onRemove = (subjectId: string) => {
        removeSubjectMutation({variables: {id: subjectId}})
            .then(async (response) => {
                navigate('-1');
            })
            .catch(error => {
                message.error(error.message);
            });
    }

    if (!subjectId)
        return <Navigate to={'/error'}/>;

    if (getSubjectQuery.loading)
        return <Loading/>;

    const subject = getSubjectQuery.data?.getSubject as Subject;
    return (
        <Space direction={'vertical'} size={20} style={{width: '100%'}}>
            <Outlet/>
            <Title level={2}>Перегляд предмету</Title>
            <Space align={'center'}>
                <Title level={3}>{subject?.name}</Title>
                {subject.teacherId === currentUser?.id && (
                    <>
                        <ButtonsVUR updateUrl={`../update/${subject?.id}`} onRemove={() => onRemove(subject?.id)}/>
                        <Link to="journal">
                            <Button type={'primary'} htmlType={'button'}>Журнал</Button>
                        </Link>
                    </>
                )}
            </Space>
            <table className="infoTable">
                <tbody>
                <tr>
                    <td>Вчитель предмету:</td>
                    <td>
                        <span>
                            <Link
                                to={`../../teachers/${subject?.teacherId}`}>{subject?.teacher.lastName} {subject?.teacher.firstName}</Link>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Вчителі:</td>
                    <td>
                        {subject?.teachersHaveAccessCreatePosts?.map(teacher => (
                            <Tag key={teacher.id}>
                                <Link to={`../../teachers/${teacher.id}`}>{teacher?.lastName} {teacher.firstName}</Link>
                            </Tag>
                        ))}
                    </td>
                </tr>
                <tr>
                    <td>Навчальний рік:</td>
                    <td>
                        <span>
                            <Link
                                to={`../../educational-years/${subject?.educationalYearId}`}>{subject?.educationalYear.name}</Link>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Посилання:</td>
                    <td>
                        <span>{subject?.link}</span>
                    </td>
                </tr>
                <tr>
                    <td>Класи:</td>
                    <td>
                        {subject?.gradesHaveAccessRead.map(grade => (
                            <Tag key={grade.id}>
                                <Link to={`../../grades/${grade.id}`}>{grade?.name}</Link>
                            </Tag>
                        ))}
                    </td>
                </tr>
                </tbody>
            </table>
            {subject &&
                <SubjectPostsIndex
                    subject={subject}
                    refetchSubjectAsync={refetchSubjectAsync}
                    postsPage={postsPage}
                    setPostsPage={setPostsPage}
                />}
        </Space>
    );
};
