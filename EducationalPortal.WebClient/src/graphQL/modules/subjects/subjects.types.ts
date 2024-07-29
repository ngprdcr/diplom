import {User} from '../users/users.types';
import {EducationalYear} from '../educationalYears/educationalYears.types';
import {SubjectPost} from '../subjectPosts/subjectPosts.types';
import {Grade} from '../grades/grades.types';

export type Subject = {
    id: string,
    name: string,
    link: string,
    teacherId: string,
    teacher: User,
    posts: {
        entities: SubjectPost[],
        total: number,
        pageSize: number,
    },
    educationalYearId: string,
    educationalYear: EducationalYear,
    gradesHaveAccessRead: Grade[],
    teachersHaveAccessCreatePosts: User[],
    createdAt: string,
    updatedAt: string,
}
