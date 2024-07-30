import s from './Journal.module.css';
import React, {ChangeEventHandler, useState} from "react";
import {JournalMark, Student} from "../../../../graphQL/modules/journal/sournal.types";
import {useMutation} from "@apollo/client";
import {setJournalMarkMutation} from "../../../../graphQL/modules/journal/journal.queries";

type Props = {
    marks: JournalMark[] | undefined;
    date: string;
    student: Student;
    subjectId: string;
}

export const Mark = ({marks, date, student, subjectId}: Props) => {
    const journalMark = marks?.find(m => m.date === date && m.studentId === student.id);
    const [mark, setMark] = useState(journalMark?.mark)

    const [setJournalMark] = useMutation(setJournalMarkMutation);

    const setMarkHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newMark = e.target.value ? +e.target.value : null;

        setMark(newMark);
        setJournalMark({
            variables: {
                input: {
                    id: journalMark?.id ?? null,
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
            className={s.markInput}
            value={mark ?? undefined}
            onChange={setMarkHandler}
            type="number"
            min="0"
        />
    )
}