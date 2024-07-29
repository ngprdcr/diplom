import {gql} from '@apollo/client';

export const schema = gql`
    schema {
        query: Queries
        mutation: Mutations
    }

    type Queries {
        me: AuthResponseType!
        getEducationalYears(
            """
            Argument for get Educational years
            """
            page: Int! = 0

            """
            Argument for get Educational years
            """
            like: String!
        ): GetEducationalYearResponseType!
        getEducationalYear(
            """
            Argument for get Educational year
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): EducationalYearType!
        getSetting(
            """
            Argument for get Setting
            """
            name: String!
        ): SettingType!
        getSettings: [SettingType]!
        getGrades(
            """
            Argument for get Grades
            """
            page: Int! = 0

            """
            Argument for get Grades
            """
            like: String!
        ): GetGradeResponseType!
        getGrade(
            """
            Argument for get Grade
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): GradeType!
        getHomework(
            """
            Argument for get Homework
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): HomeworkType!
        getHomeworks(
            """
            Argument for get Homeworks
            """
            page: Int! = 0

            """
            Argument for get Homeworks
            """
            statuses: [HomeworkStatus]

            """
            Argument for get Homeworks
            """
            order: Order! = ASCEND
        ): GetHomeworkResponseType!
        getSubject(
            """
            Argument for get Subject
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): SubjectType!
        getSubjects(
            """
            Argument for get Subjects
            """
            page: Int! = 0

            """
            Argument for get My Subjects
            """
            like: String!
        ): GetSubjectResponseType!
        getMySubjects(
            """
            Argument for get My Subjects
            """
            page: Int! = 0

            """
            Argument for get My Subjects
            """
            like: String!
        ): GetSubjectResponseType!
        getUsers(
            """
            Argument for get Users
            """
            page: Int! = 0

            """
            Argument for get Users
            """
            like: String!

            """
            Argument for get Users
            """
            roles: [UserRoleEnum]
        ): GetUserResponseType!
        getUser(
            """
            Argument for get User
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): UserType!
    }

    type AuthResponseType {
        user: UserType!
        token: String!
    }

    type UserType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        firstName: String
        lastName: String
        middleName: String
        login: String!
        email: String
        phoneNumber: String
        dateOfBirth: DateTime
        role: UserRoleEnum!
        gradeId: ID
        grade: GradeType
        subjects(
            """
            Argument for get Subjects
            """
            page: Int! = 0
        ): GetSubjectResponseType
    }

    """
    The \`DateTime\` scalar type represents a date and time. \`DateTime\` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
    """
    scalar DateTime

    enum UserRoleEnum {
        STUDENT
        TEACHER
        ADMINISTRATOR
    }

    type GradeType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        students(
            """
            Argument for get Subjects Posts
            """
            page: Int! = 0
        ): GetUserResponseType!
    }

    type GetUserResponseType {
        entities: [UserType]!
        total: Int!
        pageSize: Int!
    }

    type GetSubjectResponseType {
        entities: [SubjectType]!
        total: Int!
        pageSize: Int!
    }

    type SubjectType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        link: String
        posts(
            """
            Argument for get Subjects Posts
            """
            page: Int! = 0
        ): GetSubjectPostResponseType
        gradesHaveAccessRead: [GradeType]
        teachersHaveAccessCreatePosts: [UserType]
        teacherId: ID!
        teacher: UserType!
        educationalYearId: ID!
        educationalYear: EducationalYearType!
    }

    type GetSubjectPostResponseType {
        entities: [SubjectPostType]!
        total: Int!
        pageSize: Int!
    }

    type SubjectPostType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        title: String!
        text: String
        type: PostType!
        teacherId: ID!
        teacher: UserType!
        subjectId: ID!
        subject: SubjectType!
    }

    enum PostType {
        INFO
        HOMEWORK
    }

    type EducationalYearType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        dateStart: DateTime!
        dateEnd: DateTime!
        isCurrent: Boolean!
        subjects(
            """
            Argument for get Subjects
            """
            page: Int! = 0
        ): GetSubjectResponseType
    }

    type GetEducationalYearResponseType {
        entities: [EducationalYearType]!
        total: Int!
        pageSize: Int!
    }

    type SettingType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        value: String
    }

    type GetGradeResponseType {
        entities: [GradeType]!
        total: Int!
        pageSize: Int!
    }

    type HomeworkType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        text: String
        mark: String
        reviewResult: String
        status: HomeworkStatus
        subjectPostId: ID
        subjectPost: SubjectPostType
        studentId: ID
        student: UserType
        files: [FileType!]
    }

    enum HomeworkStatus {
        NEW
        APPROVED
        UNAPPROVED
    }

    type FileType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        path: String!
        homeworkId: Guid
        homework: HomeworkType
    }

    scalar Guid

    type GetHomeworkResponseType {
        entities: [HomeworkType]!
        total: Int!
        pageSize: Int!
    }

    enum Order {
        ASCEND
        DESCEND
    }

    type Mutations {
        login(
            """
            Argument for login User
            """
            loginAuthInputType: LoginAuthInputType!
        ): AuthResponseType!
        register(
            """
            Argument for register User
            """
            loginAuthInputType: LoginAuthInputType!
        ): AuthResponseType!
        changePassword(
            """
            Argument for change User password
            """
            changePasswordInputType: ChangePasswordInputType!
        ): Boolean
        createEducationalYear(
            """
            Argument for create new Educational year
            """
            createEducationalYearInputType: CreateEducationalYearInputType!
        ): EducationalYearType!
        updateEducationalYear(
            """
            Argument for update Educational year
            """
            updateEducationalYearInputType: UpdateEducationalYearInputType!
        ): EducationalYearType!
        removeEducationalYear(
            """
            Argument for remove Educational year
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): Boolean!
        createOrUpdateSetting(
            """
            Argument for create or update Setting
            """
            createOrUpdateSettingInputType: CreateOrUpdateSettingInputType!
        ): SettingType!
        removeSetting(
            """
            Argument for remove Setting
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): Boolean!
        createGrade(
            """
            Argument for create new Grade
            """
            createGradeInputType: CreateGradeInputType!
        ): GradeType!
        updateGrade(
            """
            Argument for update Grade
            """
            updateGradeInputType: UpdateGradeInputType!
        ): GradeType!
        removeGrade(
            """
            Argument for remove Grade
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): Boolean!
        createHomework(
            """
            Argument for create new Homework
            """
            createHomeworkInputType: CreateHomeworkInputType!
        ): HomeworkType!
        updateHomework(
            """
            Argument for update Grade
            """
            updateHomeworkInputType: UpdateHomeworkInputType!
        ): HomeworkType!
        createSubjectPost(
            """
            Argument for create new Subject Post
            """
            createSubjectPostInputType: CreateSubjectPostInputType!
        ): SubjectPostType!
        updateSubjectPost(
            """
            Argument for update Subject Post
            """
            updateSubjectPostInputType: UpdateSubjectPostInputType!
        ): SubjectPostType!
        removeSubjectPost(
            """
            Argument for remove Subject Post
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): Boolean!
        createSubject(
            """
            Argument for create new Subject
            """
            createSubjectInputType: CreateSubjectInputType!
        ): SubjectType!
        updateSubject(
            """
            Argument for update Subject
            """
            updateSubjectInputType: UpdateSubjectInputType!
        ): SubjectType!
        removeSubject(
            """
            Argument for remove Subject
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): Boolean!
        createUser(
            """
            Argument for create new User
            """
            createUserInputType: CreateUserInputType!
        ): UserType!
        updateUser(
            """
            Argument for update User
            """
            updateUserInputType: UpdateUserInputType!
        ): UserType!
        removeUser(
            """
            Argument for remove User
            """
            id: ID! = "00000000-0000-0000-0000-000000000000"
        ): Boolean!
    }

    input LoginAuthInputType {
        login: String!
        password: String!
    }

    input ChangePasswordInputType {
        oldPassword: String!
        newPassword: String!
    }

    input CreateEducationalYearInputType {
        name: String!
        dateStart: DateTime!
        dateEnd: DateTime!
    }

    input UpdateEducationalYearInputType {
        name: String!
        dateStart: DateTime!
        dateEnd: DateTime!
        id: ID!
        isCurrent: Boolean!
    }

    input CreateOrUpdateSettingInputType {
        name: String!
        value: String
    }

    input CreateGradeInputType {
        name: String!
    }

    input UpdateGradeInputType {
        name: String!
        id: ID!
    }

    input CreateHomeworkInputType {
        text: String
        subjectPostId: ID!
        files: [Upload]
    }

    """
    A meta type that represents a file upload.
    """
    scalar Upload

    input UpdateHomeworkInputType {
        id: ID!
        mark: String
        reviewResult: String
        status: HomeworkStatus!
    }

    input CreateSubjectPostInputType {
        title: String!
        text: String
        type: PostType!
        subjectId: ID!
    }

    input UpdateSubjectPostInputType {
        id: ID!
        title: String!
        text: String
        type: PostType!
    }

    input CreateSubjectInputType {
        name: String!
        gradesHaveAccessReadIds: [ID]!
        teachersHaveAccessCreatePostsIds: [ID]!
    }

    input UpdateSubjectInputType {
        name: String!
        gradesHaveAccessReadIds: [ID]!
        teachersHaveAccessCreatePostsIds: [ID]!
        id: ID!
        link: String
    }

    input CreateUserInputType {
        firstName: String!
        lastName: String!
        middleName: String!
        login: String!
        password: String!
        email: String
        phoneNumber: String
        dateOfBirth: DateTime
        role: UserRoleEnum!
        gradeId: ID
    }

    input UpdateUserInputType {
        id: ID!
        firstName: String!
        lastName: String!
        middleName: String!
        login: String!
        email: String
        phoneNumber: String
        dateOfBirth: DateTime!
        role: UserRoleEnum!
        gradeId: ID
    }
`
