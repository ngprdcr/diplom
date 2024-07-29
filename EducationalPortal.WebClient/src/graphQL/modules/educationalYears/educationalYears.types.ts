import {getSubjectsType} from '../subjects/subjects.queries';

export type EducationalYear = {
    id: string,
    name: string,
    dateStart: string,
    dateEnd: string,
    isCurrent: boolean,
    createdAt: string,
    updatedAt: string,
    subjects: getSubjectsType,
}
