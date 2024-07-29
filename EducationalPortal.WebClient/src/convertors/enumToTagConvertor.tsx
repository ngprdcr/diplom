import {SubjectPostType} from '../graphQL/modules/subjectPosts/subjectPosts.types';
import {Tag, Tooltip} from 'antd';
import {BookOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {Role} from '../graphQL/modules/users/users.types';
import {HomeworkStatus} from '../graphQL/modules/homeworks/homework.types';
import {homeworkStatusWithTranslateToString} from './enumWithTranslateToStringConvertor';

export const subjectPostTypeToTag = (subjectPostType: SubjectPostType) => {
    switch (subjectPostType) {
        case SubjectPostType.Homework:
            return (
                <Tooltip title={'Домашнє завдання'}>
                    <Tag color="red"><BookOutlined/></Tag>
                </Tooltip>
            );
        case SubjectPostType.Info:
            return (
                <Tooltip title={'Інфо'}>
                    <Tag color="blue"><InfoCircleOutlined/></Tag>
                </Tooltip>
            );
    }
};

export const roleToTag = (role: Role) => {
    switch (role) {
        case Role.Student:
            return (<Tag color="red">Учень</Tag>);
        case Role.Teacher:
            return (<Tag color="blue">Вчитель</Tag>);
        case Role.Administrator:
            return (<Tag color="purple">Адміністратор</Tag>);
    }
};

export const homeworkStatusToTag = (status: HomeworkStatus) => {
    switch (status) {
        case HomeworkStatus.New:
            return (<Tag color="yellow">{homeworkStatusWithTranslateToString(status)}</Tag>);
        case HomeworkStatus.Approved:
            return (<Tag color="green">{homeworkStatusWithTranslateToString(status)}</Tag>);
        case HomeworkStatus.Unapproved:
            return (<Tag color="red">{homeworkStatusWithTranslateToString(status)}</Tag>);
    }
};
