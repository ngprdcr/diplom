import {gql} from '@apollo/client';
import {GRADE_FRAGMENT} from '../grades/grades.fragments';

export const USER_FRAGMENT = gql`
    fragment UserFragment on UserType {
        id
        firstName
        lastName
        middleName
        login
        email
        phoneNumber
        dateOfBirth
        role
        gradeId
        motherId
        mother{
            firstName
            lastName
            middleName
        }
        fatherId
        father{
            firstName
            lastName
            middleName
        }
        createdAt
        updatedAt
    }
`;

export const USER_WITH_GRADE_FRAGMENT = gql`
    ${USER_FRAGMENT}
    ${GRADE_FRAGMENT}
    fragment UserWithGradeFragment on UserType {
        ...UserFragment
        grade {
            ...GradeFragment
        }
    }
`;

export const GRADE_WITH_STUDENTS_FRAGMENT = gql`
    ${GRADE_FRAGMENT}
    ${USER_FRAGMENT}
    fragment GradeWithStudentsFragment on GradeType {
        ...GradeFragment
        students(page: $studentsPage) {
            entities {
                ...UserFragment
            }
            total
        }
    }
`;
