import React, {ChangeEventHandler, useState} from "react";
import {JournalMark, Student} from "../../../../graphQL/modules/journal/sournal.types";
import {useMutation} from "@apollo/client";
import {
    CREATE_SUBJECT_MUTATION,
    CreateSubjectData,
    CreateSubjectVars
} from "../../../../graphQL/modules/subjects/subjects.mutations";
import {setJournalMarkMutation} from "../../../../graphQL/modules/journal/journal.queries";

type Props = {
    marks: JournalMark[];
    date: string;
    student: Student;
    subjectId: string;
}

export const Mark = ({marks, date, student, subjectId}: Props) => {
    const journalMark = marks.find(m => m.date === date && m.studentId === student.id);
    const [mark, setMark] = useState(journalMark?.mark)

    const [setJournalMark] = useMutation(setJournalMarkMutation);

    const setMarkHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newMark =+e.target.value;
        console.log(newMark)
        setMark(newMark);
        setJournalMark({
            variables: {
                input: {
                    id: journalMark?.id,
                    mark: newMark,
                    studentId: student.id,
                    subjectId,
                    date,
                }
            }
        });
    }

    return (
        <input
            value={mark}
            onChange={setMarkHandler}
            type="number"
        />
    )
}