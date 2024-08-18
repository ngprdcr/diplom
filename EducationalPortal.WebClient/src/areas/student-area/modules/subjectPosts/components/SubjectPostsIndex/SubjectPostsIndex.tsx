import React, {FC, useState} from 'react';
import {Button, Card, Drawer, Pagination, Row, Space} from 'antd';
import {subjectPostTypeToTag} from '../../../../../../convertors/enumToTagConvertor';
import Title from 'antd/es/typography/Title';
import parse from 'html-react-parser';
import {stringToUkraineDatetime} from '../../../../../../convertors/stringToDatetimeConvertors';
import {Subject} from '../../../../../../graphQL/modules/subjects/subjects.types';
import '../../../../../../styles/text.css';
import {SubjectPost, SubjectPostType} from '../../../../../../graphQL/modules/subjectPosts/subjectPosts.types';
import {HomeworksCreate} from '../../../homeworks/components/HomeworksCreate/HomeworksCreate';

type Props = {
    subject: Subject,
    postsPage: number,
    setPostsPage: (page: number) => void
    hideSendHomeworkButton?: boolean;
};

export const SubjectPostsIndex: FC<Props> = ({subject, postsPage, setPostsPage, hideSendHomeworkButton}) => {
    const [createHomeworkForSubjectPost, setCreateHomeworkForSubjectPost] = useState<SubjectPost | null>(null);
    const [createHomeworkForSubjectPostFormVisible, setCreateHomeworkForSubjectPostFormVisible] = useState(false);

    const onCreateHomeworkFormClose = () => {
        setCreateHomeworkForSubjectPostFormVisible(false);
        setCreateHomeworkForSubjectPost(null);
    };

    return (
        <>
            <Space direction={'vertical'} style={{width: '100%'}} size={20}>
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
                            !hideSendHomeworkButton && post.type === SubjectPostType.Homework &&
                            <Button onClick={() => {
                                setCreateHomeworkForSubjectPostFormVisible(true);
                                setCreateHomeworkForSubjectPost(post);
                            }}>Відправити дз</Button>
                        }
                    >
                        <div>{parse(post.text)}</div>
                        <div className={'small'}>
                            <div>Створено: {stringToUkraineDatetime(post.createdAt)}, {post.teacher.lastName} {post.teacher.firstName}</div>
                            <div>Оновлено: {stringToUkraineDatetime(post.updatedAt)}</div>
                        </div>
                    </Card>
                ))}
                {subject?.posts?.total > 0 &&
                <Row justify={'end'}>
                    <Pagination defaultCurrent={postsPage} onChange={setPostsPage} total={subject?.posts.total}/>
                </Row>
                }
            </Space>
            <Drawer
                width={720}
                onClose={onCreateHomeworkFormClose}
                visible={createHomeworkForSubjectPostFormVisible}
            >
                {createHomeworkForSubjectPost &&
                <HomeworksCreate subjectPostId={createHomeworkForSubjectPost.id}
                                 subjectPostTitle={createHomeworkForSubjectPost.title}
                                 afterCreate={onCreateHomeworkFormClose}/>
                }
            </Drawer>
        </>
    );
};
