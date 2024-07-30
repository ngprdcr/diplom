import {gql} from "@apollo/client";
import {JournalMark, Student} from "./sournal.types";

export type GetJournalData = {
    getStudents: Student[];
    getJournalMarks: JournalMark[];
    getSubject: {
        name: string;
        link: string | null;
        teacherId: string;
        teacher: {
            firstName: string;
            lastName: string;
        }
        teachersHaveAccessCreatePosts: {
            id: string;
            firstName: string;
            lastName: string;
        }[];
        educationalYearId: string;
        educationalYear: {
            name: string;
        };
        gradesHaveAccessRead: {
            id: string;
            name: string;
        }[];
    };
}

export const getJournal = gql`
query ($subjectId: Guid!) {
  getJournalMarks(subjectId: $subjectId) {
    id
    mark
    date
    studentId
  }
  getStudents(subjectId: $subjectId) {
    id
    firstName
    lastName
  }
  getSubject(id: $subjectId) {
    name
    link
    teacherId
    teacher {
      firstName
      lastName
    }
    teachersHaveAccessCreatePosts {
      id
      firstName
      lastName
    }
    educationalYearId
    educationalYear {
      name
    }
    gradesHaveAccessRead {
      id
      name
    }
  }
}
`;

export const setJournalMarkMutation = gql`
    mutation ($input: SetJournalMarkInputType!) {
        setJournalMark(input: $input)
    }
`;
