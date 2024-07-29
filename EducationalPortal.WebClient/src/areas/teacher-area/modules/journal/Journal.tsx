import s from './Journal.module.css';
import {useParams} from "react-router-dom";
import {JournalMark, Student} from "../../../../graphQL/modules/journal/sournal.types";
import {User} from "../../../../graphQL/modules/users/users.types";
import {Button} from "antd";
import React, {ChangeEventHandler, MouseEventHandler} from "react";
import {Mark} from "./Mark";

export const Journal = () => {
    const params = useParams();
    const subjectId = params.subjectId as string;

    const marks:JournalMark[] = [
        {
            id: '1',
            mark: 1,
            date: '2011-04-11T10:20:30Z',
            studentId: '1',
        },
        {
            id: '2',
            mark: 2,
            date: '2011-04-12T10:20:30Z',
            studentId: '1',
        },
    ]

    const dates = marks.map(m => m.date).filter((value, index, array) => array.indexOf(value) === index);
    dates.sort();

    const students:Student[] = [
        {
            id: '1',
            firstName: 'Vadim',
            lastName: 'Podlutskyi',
        },
        {
            id: '2',
            firstName: 'Vitalii',
            lastName: 'Vaskivskyi',
        },
    ]
    console.log(dates)

    return (
        <div>
           <table className={s.journalTable}>
               <tr>
                   <th></th>
                   {dates.map(date => (
                       <th key={date}>{date}</th>
                   ))}
                   <th>
                       <input type="date"/>
                   </th>
               </tr>
               {students.map(student => (
                  <tr key={student.id}>
                      <td>{student.firstName} {student.lastName}</td>
                      {dates.map(date => (
                          <td>
                              <Mark marks={marks} date={date} student={student} subjectId={subjectId}/>
                          </td>
                      ))}
                      <td></td>
                  </tr>
               ))}
           </table>
        </div>
    );
};