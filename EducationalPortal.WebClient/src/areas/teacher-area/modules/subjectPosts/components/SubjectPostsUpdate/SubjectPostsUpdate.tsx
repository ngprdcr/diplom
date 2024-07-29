import React, {FC, useEffect, useState} from 'react';
import {Form, Input, message, Modal, Select} from 'antd';
import {sizeFormItem} from '../../../../../../styles/form';
import {useMutation, useQuery} from '@apollo/client';
import {
    UPDATE_SUBJECT_POST_MUTATION,
    UpdateSubjectPostData,
    UpdateSubjectPostVars,
} from '../../../../../../graphQL/modules/subjectPosts/subjectPosts.mutations';
import {SubjectPostType} from '../../../../../../graphQL/modules/subjectPosts/subjectPosts.types';
import {WysiwygEditor} from '../../../../components/WysiwygEditor/WysiwygEditor';
import {subjectPostTypeWithTranslateToString} from "../../../../../../convertors/enumWithTranslateToStringConvertor";
import {useNavigate, useParams} from "react-router-dom";
import {
    GET_SUBJECT_POST_QUERY,
    GetSubjectPostData,
    GetSubjectPostVars
} from "../../../../../../graphQL/modules/subjectPosts/subjectPosts.queries";

export const SubjectPostsUpdate: FC = () => {
    const params = useParams();
    const subjectPostId = params.subjectPostId as string;
    const getSubjectPost = useQuery<GetSubjectPostData, GetSubjectPostVars>(GET_SUBJECT_POST_QUERY, {
        variables: {id: subjectPostId, withStatistics: false, withHomeworks: false, withFiles: false}
    });
    const [updateSubjectPostMutation, updateSubjectPostMutationOptions] = useMutation<UpdateSubjectPostData, UpdateSubjectPostVars>(UPDATE_SUBJECT_POST_MUTATION);
    const [form] = Form.useForm();
    const [init, setInit] = useState(false);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [type, setType] = useState<SubjectPostType>(SubjectPostType.Info);
    const navigate = useNavigate();

    useEffect(() => {
        if (getSubjectPost.data?.getSubjectPost) {
            setId(getSubjectPost.data.getSubjectPost.id);
            setTitle(getSubjectPost.data.getSubjectPost.title);
            setText(getSubjectPost.data.getSubjectPost.text);
            setType(getSubjectPost.data.getSubjectPost.type);
            setInit(true)
        }

    }, [getSubjectPost.data]);

    const handleOk = async () => {
        try {
            await form.validateFields();
            updateSubjectPostMutation({
                variables: {
                    updateSubjectPostInputType: {
                        id,
                        title,
                        text,
                        type,
                    },
                    withHomeworks: false,
                    withFiles: false,
                    withStatistics: false,
                },
                onQueryUpdated(observableQuery) {
                    return observableQuery.refetch();
                }
            })
                .then(async response => {
                    handleCancel()
                })
                .catch(error => {
                    message.error(error.message);
                });
        } catch (e) {
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (!init)
        return null;

    return (
        <Modal
            confirmLoading={updateSubjectPostMutationOptions.loading}
            title="Оновити пост"
            visible={true}
            onOk={handleOk}
            okText={'Оновити'}
            onCancel={handleCancel}
            cancelText={'Відміна'}
            width={'70%'}
        >
            <Form
                name="SubjectsPostUpdateForm"
                form={form}
                initialValues={{
                    title: getSubjectPost.data?.getSubjectPost.title,
                    text: getSubjectPost.data?.getSubjectPost.text,
                    type: getSubjectPost.data?.getSubjectPost.type,
                }}
                {...sizeFormItem}
            >
                <Form.Item
                    name="title"
                    label="Заголовок"
                    rules={[{required: true, message: 'Введіть Заголовок!'}]}
                >
                    <Input placeholder="Заголовок" value={title} onChange={e => setTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item
                    name="text"
                    label="Текст"
                >
                    <WysiwygEditor text={text} setText={setText}/>
                </Form.Item>
                <Form.Item
                    name="type"
                    label="Тип"
                    rules={[{required: true, message: 'Введіть тип!'}]}
                >
                    <Select style={{width: '100%'}} value={type} onChange={setType}>
                        {(Object.values(SubjectPostType) as Array<SubjectPostType>).map((value) => (
                            <Select.Option key={value} value={value}>
                                {subjectPostTypeWithTranslateToString(value)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};
