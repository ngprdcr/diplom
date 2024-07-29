import {gql} from '@apollo/client';
import {USER_FRAGMENT} from '../users/users.fragments';

export const EDUCATIONAL_YEAR_FRAGMENT = gql`
    fragment EducationalYearFragment on EducationalYearType {
        id
        name
        dateStart
        dateEnd
        isCurrent
        createdAt
        updatedAt
    }
`;

export const EDUCATIONAL_YEAR_WITH_SUBJECTS_FRAGMENT = gql`
    ${EDUCATIONAL_YEAR_FRAGMENT}
    ${USER_FRAGMENT}
    fragment EducationalYearWithSubjectsFragment on EducationalYearType {
        ...EducationalYearFragment
        subjects(page: $subjectsPage) {
            entities {
                id
                name
                link
                teacherId
                teacher {
                    ...UserFragment
                }
                teachersHaveAccessCreatePosts {
                    ...UserFragment
                }
                educationalYearId
                createdAt
                updatedAt
            }
            total
            pageSize
        }
    }
`;
