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
            dateStart: string;
            dateEnd: string;
        };
        gradesHaveAccessRead: {
            id: string;
            name: string;
        }[];
    };
}

export type GetStudentJournalData = {
    getMyJournalMarkGroup: {
        children: Student[];
        journalMarks: JournalMark[]
    };
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
            dateStart: string;
            dateEnd: string;
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
    type
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
      dateStart
      dateEnd
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

export const getStudentJournal = gql`
query ($subjectId: Guid!) {
  getMyJournalMarkGroup(subjectId: $subjectId) {
    children {
      id
      firstName
      lastName
    }
    journalMarks {
      id
      mark
      type
      date
      studentId
    }
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
      dateStart
      dateEnd
    }
    gradesHaveAccessRead {
      id
      name
    }
  }
}
`;
