import {HomeworkStatus} from '../graphQL/modules/homeworks/homework.types';
import {SubjectPostType} from "../graphQL/modules/subjectPosts/subjectPosts.types";

export const homeworkStatusWithTranslateToString = (homeworkStatus: HomeworkStatus) => {
    switch (homeworkStatus) {
        case HomeworkStatus.New:
            return 'Нове'
        case HomeworkStatus.Approved:
            return 'Підтверджене'
        case HomeworkStatus.Unapproved:
            return 'Не прийняте'
    }
}

export const subjectPostTypeWithTranslateToString = (subjectPostType: SubjectPostType) => {
    switch (subjectPostType) {
        case SubjectPostType.Info:
            return 'Інфо';
        case SubjectPostType.Homework:
            return 'Домашнє завдання';
    }
}
