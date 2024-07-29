import React, {FC, useState} from 'react';
import {Card, message, Pagination, Row, Space} from 'antd';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Subject} from '../../../../../../graphQL/modules/subjects/subjects.types';
import {useMutation} from '@apollo/client';
import {
    REMOVE_SUBJECT_POST_MUTATION,
    RemoveSubjectPostData,
    RemoveSubjectPostVars
} from '../../../../../../graphQL/modules/subjectPosts/subjectPosts.mutations';
import {SubjectPost, SubjectPostType} from '../../../../../../graphQL/modules/subjectPosts/subjectPosts.types';
import {subjectPostTypeToTag} from '../../../../../../convertors/enumToTagConvertor';
import Title from 'antd/es/typography/Title';
import parse from 'html-react-parser';
import {stringToUkraineDatetime} from '../../../../../../convertors/stringToDatetimeConvertors';
import '../../../../../../styles/text.css';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {HomeOutlined} from "@ant-design/icons";
import {Homeworks} from "../../../homeworks/components/Homeworks/Homeworks";
import {Doughnut} from "react-chartjs-2";
import {Chart, registerables} from 'chart.js'
import s from './SubjectPostsIndex.module.css';
import {useAppSelector} from "../../../../../../store/store";
import {Role} from "../../../../../../graphQL/modules/users/users.types";
import {Link, useLocation} from "react-router-dom";

Chart.register(...registerables);

type Props = {
    subject: Subject,
    refetchSubjectAsync: () => void,
    postsPage: number,
    setPostsPage: (page: number) => void,
};

export const SubjectPostsIndex: FC<Props> = ({subject, refetchSubjectAsync, postsPage, setPostsPage}) => {
    const location = useLocation();
    const currentUser = useAppSelector(s => s.auth.me?.user)
    const [inViewHomeworksPost, setInViewHomeworksPost] = useState<SubjectPost | null>(null);

    const [removeSubjectPostMutation, removeSubjectPostMutationOptions] = useMutation<RemoveSubjectPostData, RemoveSubjectPostVars>(REMOVE_SUBJECT_POST_MUTATION);

    const onPostRemove = (postId: string) => {
        removeSubjectPostMutation({
            variables: {
                id: postId,
            },
        })
            .then(async (response) => {
                await refetchSubjectAsync();
            })
            .catch(e => {
                message.error(e.message);
            });
    };

    console.log(subject.posts)

    return (
        <>
            <Space direction={'vertical'} style={{width: '100%'}} size={20}>
                {(currentUser?.id === subject.teacherId
                        || subject.teachersHaveAccessCreatePosts?.some(t => t.id === currentUser?.id)
                        || currentUser?.role === Role.Administrator)
                    &&
                    <ButtonCreate>
                        <Link to="subject-posts/create" state={{background: location}}>
                            Створити пост
                        </Link>
                    </ButtonCreate>

                }
                {subject?.posts?.entities.map(post => (
                    <Card
                        key={post.id}
                        type={'inner'}
                        title={
                            <Space size={1}>
                                {subjectPostTypeToTag(post.type)}
                                <Title level={4}>{post.title}</Title>
                            </Space>
                        }
                        extra={
                            (currentUser?.id === subject.teacherId
                                || subject.teachersHaveAccessCreatePosts?.some(t => t.id === currentUser?.id)
                                || currentUser?.role === Role.Administrator)
                            && <Space size={10}>
                                {post.type === SubjectPostType.Homework &&
                                    <HomeOutlined onClick={() => setInViewHomeworksPost(post)}/>
                                }
                                <ButtonsVUR
                                    updateUrl={`subject-posts/update/${post.id}`}
                                    updateState={{background: location}}
                                    onRemove={() => onPostRemove(post.id)}
                                />
                            </Space>
                        }
                    >
                        <div>{parse(post.text)}</div>
                        {post.type === SubjectPostType.Homework &&
                            <Space size={1}>
                                <Doughnut
                                    data={{
                                        labels: post.statistics.map(s => s.key),
                                        datasets: [{
                                            data: post.statistics.map(s => s.value),
                                            backgroundColor: post.statistics.map(s => s.hashColor),
                                            hoverBackgroundColor: post.statistics.map(s => s.hashColor)
                                        }]
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'right',
                                                labels: {
                                                    boxWidth: 10,
                                                    boxHeight: 10,
                                                },
                                                maxWidth: 100
                                            }
                                        },
                                    }} className={s.doughnut}/>
                            </Space>
                        }
                        <div className={'small'}>
                            <div>Створено: {stringToUkraineDatetime(post.createdAt)}, {post.teacher.lastName} {post.teacher.firstName}</div>
                            <div>Оновлено: {stringToUkraineDatetime(post.updatedAt)}</div>
                        </div>
                    </Card>
                ))}
                {subject?.posts?.total > 0 &&
                    <Row justify={'end'}>
                        <Pagination pageSize={subject.posts.pageSize} defaultCurrent={postsPage} onChange={setPostsPage} total={subject?.posts.total}/>
                    </Row>
                }
            </Space>
            {inViewHomeworksPost && <Homeworks
                homeworks={inViewHomeworksPost.homeworks}
                isModalHomeworksVisible={!!inViewHomeworksPost}
                setModalHomeworksInvisible={() => setInViewHomeworksPost(null)}
                path={'../../homeworks'}
            />}
        </>
    );
};
