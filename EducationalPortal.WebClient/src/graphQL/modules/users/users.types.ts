import {Grade} from '../grades/grades.types';
import {getSubjectsType} from '../subjects/subjects.queries';

export enum Role {
    Student = 'STUDENT',
    Teacher = 'TEACHER',
    Administrator = 'ADMINISTRATOR',
    Parent = 'PARENT',
}

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    middleName: string,
    login: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: string,
    role: Role,
    gradeId: string,
    motherId: string | null,
    mother: {
        firstName: string;
        lastName: string;
        middleName: string;
    } | null,
    fatherId: string | null,
    father: {
        firstName: string;
        lastName: string;
        middleName: string;
    } | null,
    grade: Grade,
    subjects: getSubjectsType[],
    createdAt: string,
    updatedAt: string,
}
