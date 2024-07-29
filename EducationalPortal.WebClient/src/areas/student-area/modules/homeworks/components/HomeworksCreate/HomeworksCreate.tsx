import React, {ChangeEvent, FC, FormEvent, useState} from 'react';
import {useMutation} from '@apollo/client';
import {Avatar, Form, message, Space} from 'antd';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import Title from 'antd/es/typography/Title';
import {
    CREATE_HOMEWORK_MUTATION,
    CreateHomeworkData,
    CreateHomeworkVars,
} from '../../../../../../graphQL/modules/homeworks/homeworks.mutations';
import {FilesList} from "../../../../../../components/FilesList/FilesList";
import {UploadOutlined} from "@ant-design/icons";
import s from "./HomeworksCreate.module.css";
import TextArea from "antd/es/input/TextArea";

type Props = {
    subjectPostId: string,
    subjectPostTitle: string,
    afterCreate: () => void,
}

type FormValues = {
    text: string,
}

export const HomeworksCreate: FC<Props> = ({subjectPostId, subjectPostTitle, afterCreate}) => {
    const [createHomework, createHomeworkOption] = useMutation<CreateHomeworkData, CreateHomeworkVars>(CREATE_HOMEWORK_MUTATION, {
        context: {
            headers: {
                "Content-Type": "application/json; multipart-form-data"  // this header will reach the server
            }
        }
    });
    const [form] = Form.useForm();
    const [files, setFiles] = useState<File[]>([]);

    const filesChangeHandler = (e: FormEvent<HTMLLabelElement>) => {
        const fileEvent = e.nativeEvent as ChangeEvent<HTMLInputElement> & Event;
        if (fileEvent.target.files?.length) {
            const newFiles = Array.from(fileEvent.target.files)
            setFiles([...files, ...newFiles]);
        }
    };

    const onFinish = async ({text}: FormValues) => {
        console.log('upload', files);
        createHomework({
            variables: {
                createHomeworkInputType: {
                    text,
                    subjectPostId,
                    files: files,
                },
                withFiles: false,
            },
        })
            .then(response => {
                message.success(`ДЗ для ${subjectPostTitle} було відпралено`);
                afterCreate();
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const removeFileHandler = (removeFile: File) => {
        setFiles(files.filter(file => file !== removeFile));
    }

    return (
        <Form
            name="HomeworksCreateForm"
            onFinish={onFinish}
            form={form}
            {...sizeFormItem}
        >
            <Title level={2}>Відправити домашню роботу для {subjectPostTitle}</Title>
            <Form.Item
                name="text"
                label="Текст"
                rules={[{required: true, message: 'Введіть текст!'}]}
            >
                <TextArea placeholder="Назва"/>
            </Form.Item>
            <Form.Item
                name="files"
                label="Файли"
            >
                <Space direction={'vertical'}>
                    <label onChange={filesChangeHandler}>
                        <input type="file" multiple hidden/>
                        <div className={s.buttonUpload}>
                            <Avatar size={28} icon={<UploadOutlined/>}/>
                        </div>
                    </label>
                    <FilesList files={files} onRemove={removeFileHandler}/>
                </Space>
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonCreate loading={createHomeworkOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
