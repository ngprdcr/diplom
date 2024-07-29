import React, {useCallback, useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {AutoComplete, Form, Input, message, Space, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {sizeButtonItem, sizeFormItem} from '../../../../../../styles/form';
import {CREATE_SUBJECT_MUTATION, CreateSubjectData, CreateSubjectVars} from '../../../../../../graphQL/modules/subjects/subjects.mutations';
import Title from 'antd/es/typography/Title';
import {GET_GRADES_QUERY, GetGradesData, GetGradesVars} from '../../../../../../graphQL/modules/grades/grades.queries';
import debounce from 'lodash.debounce';
import Search from 'antd/es/input/Search';
import {Grade} from '../../../../../../graphQL/modules/grades/grades.types';
import {GET_USERS_QUERY, GetUsersData, GetUsersVars} from '../../../../../../graphQL/modules/users/users.queries';
import {Role, User} from '../../../../../../graphQL/modules/users/users.types';

type FormValues = {
    name: string,
}

export const SubjectsCreate = () => {
    const [createSubjectMutation, createSubjectMutationOption] = useMutation<CreateSubjectData, CreateSubjectVars>(CREATE_SUBJECT_MUTATION);
    const [gradePage, setGradePage] = useState(1);
    const [gradeLike, setGradeLike] = useState('');
    const getGradesQuery = useQuery<GetGradesData, GetGradesVars>(GET_GRADES_QUERY, {
        variables: {
            page: gradePage,
            like: gradeLike,
        },
    });
    const [grades, setGrades] = useState<Grade[]>([]);

    const [teacherPage, setTeacherPage] = useState(1);
    const [teacherLike, setTeacherLike] = useState('');
    const [teacherRoles, setTeacherRoles] = useState([Role.Teacher, Role.Administrator]);
    const getTeachersQuery = useQuery<GetUsersData, GetUsersVars>(GET_USERS_QUERY, {
        variables: {
            page: teacherPage,
            roles: teacherRoles,
            like: teacherLike,
        },
    });
    const [teachers, setTeachers] = useState<User[]>([]);

    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        getGradesQuery.refetch({
            page: gradePage,
            like: gradeLike,
        })
            .then(response => {
                if (!response.data.getGrades.entities.length) {
                    message.warning('Класів з даною назвою не знайдено');
                }
            })
            .catch(error => {
                message.error(error.message);
            });
    }, [gradePage, gradeLike]);

    useEffect(() => {
        getTeachersQuery.refetch({
            page: teacherPage,
            roles: teacherRoles,
            like: teacherLike,
        })
            .then(response => {
                if (!response.data.getUsers.entities.length) {
                    message.warning('Вчителів з даним ім\'ям не знайдено');
                }
            })
            .catch(error => {
                message.error(error.message);
            });
    }, [teacherPage, teacherLike, teacherRoles]);

    const createSubjectHandler = async ({name}: FormValues) => {
        createSubjectMutation({
            variables: {
                createSubjectInputType: {
                    name: name,
                    gradesHaveAccessReadIds: grades.map(grade => grade.id),
                    teachersHaveAccessCreatePostsIds: teachers.map(teacher => teacher.id),
                },
            },
        })
            .then(response => {
                navigate(-1);
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const debouncedSearchGradesHandler = useCallback(debounce(nextValue => setGradeLike(nextValue), 500), []);
    const searchGradesHandler = (value: string) => debouncedSearchGradesHandler(value);

    const selectGradeHandler = (value: string) => {
        const newGrade = getGradesQuery.data?.getGrades.entities.find(grade => grade.name === value) as Grade;
        setGrades([...grades, newGrade]);
    };

    const removeGradeHandler = (value: string) => {
        const newGrades = grades.filter(grade => grade.name !== value);
        setGrades(newGrades);
    };


    const debouncedSearchTeachersHandler = useCallback(debounce(nextValue => setTeacherLike(nextValue), 500), []);
    const searchTeachersHandler = (value: string) => debouncedSearchTeachersHandler(value);

    const selectTeacherHandler = (value: string, options: any) => {
        const newTeacher = getTeachersQuery.data?.getUsers.entities.find(teacher => teacher.id === options.teacher.id) as User;
        setTeachers([...teachers, newTeacher]);
    };

    const removeTeacherHandler = (id: string) => {
        const newTeachers = teachers.filter(teacher => teacher.id !== id);
        setTeachers(newTeachers);
    };

    return (
        <Form
            name="SubjectsCreateForm"
            onFinish={createSubjectHandler}
            form={form}
            {...sizeFormItem}
        >
            <Title level={2}>Створити предмет</Title>
            <Form.Item
                name="name"
                label="Назва"
                rules={[{required: true, message: 'Введіть назву!'}]}
            >
                <Input placeholder="Назва"/>
            </Form.Item>
            <Form.Item
                label="Класи"
            >
                <AutoComplete
                    options={getGradesQuery.data?.getGrades.entities.map(grade => ({value: grade.name}))}
                    onSearch={searchGradesHandler}
                    onSelect={selectGradeHandler}
                >
                    <Search
                        placeholder="Класи"
                        enterButton
                        loading={getGradesQuery.loading}
                    />
                </AutoComplete>
                {grades.map(grade => (
                    <Tag
                        closable
                        onClose={e => {
                            e.preventDefault();
                            removeGradeHandler(grade.name);
                        }}
                    >{grade.name}</Tag>
                ))}
            </Form.Item>
            <Form.Item
                label="Вчителі"
            >
                <AutoComplete
                    options={getTeachersQuery.data?.getUsers.entities.map(teacher => (
                        {
                            value: <Space>
                                <span>{teacher.lastName} {teacher.firstName}</span>
                                <span className={'small'}> ({teacher.login})</span>
                            </Space>,
                            teacher,
                        }
                    ))}
                    onSearch={searchTeachersHandler}
                    onSelect={selectTeacherHandler}
                >
                    <Search
                        placeholder="Вчителі"
                        enterButton
                        loading={getTeachersQuery.loading}
                    />
                </AutoComplete>
                {teachers.map(teacher => (
                    <Tag
                        closable
                        onClose={e => {
                            e.preventDefault();
                            removeTeacherHandler(teacher.id);
                        }}
                    >{teacher.lastName} {teacher.firstName}</Tag>
                ))}
            </Form.Item>
            <Form.Item {...sizeButtonItem}>
                <ButtonCreate loading={createSubjectMutationOption.loading} isSubmit={true}/>
            </Form.Item>
        </Form>
    );
};
