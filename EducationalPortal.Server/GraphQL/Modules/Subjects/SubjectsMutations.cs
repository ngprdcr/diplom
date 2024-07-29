using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.GraphQL.Modules.Subjects.DTO;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Subjects
{
    public class SubjectsMutations : ObjectGraphType, IMutationMarker
    {
        public SubjectsMutations(ISubjectRepository subjectRepository, IHttpContextAccessor httpContextAccessor, IEducationalYearRepository educationalYearRepository)
        {
            Field<NonNullGraphType<SubjectType>, SubjectModel>()
                .Name("CreateSubject")
                .Argument<NonNullGraphType<CreateSubjectInputType>, SubjectModel>("CreateSubjectInputType", "Argument for create new Subject")
                .ResolveAsync(async (context) =>
                {
                    SubjectModel subject = context.GetArgument<SubjectModel>("CreateSubjectInputType");
                    Guid currentTeacherId = httpContextAccessor.HttpContext.GetUserId();
                    if(subject.TeachersHaveAccessCreatePostsIds.Any(tId => tId == currentTeacherId))
                        throw new Exception("Ви не можете надати собі права для створення постів");
                    subject.TeacherId = currentTeacherId;
                    return await subjectRepository.CreateAsync(subject);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<SubjectType>, SubjectModel>()
                .Name("UpdateSubject")
                .Argument<NonNullGraphType<UpdateSubjectInputType>, SubjectModel>("UpdateSubjectInputType", "Argument for update Subject")
                .ResolveAsync(async (context) =>
                {
                    SubjectModel newSubject = context.GetArgument<SubjectModel>("UpdateSubjectInputType");
                    Guid currentTeacherId = httpContextAccessor.HttpContext.GetUserId();
                    UserRoleEnum currentTeacherRole = httpContextAccessor.HttpContext.GetRole();
                    SubjectModel oldSubject = await subjectRepository.GetByIdAsync(newSubject.Id);
                    if (currentTeacherId != oldSubject.TeacherId && currentTeacherRole != UserRoleEnum.Administrator)
                        throw new Exception("Ви не маєте прав на редагування данного предмету");

                    if (newSubject.TeachersHaveAccessCreatePostsIds.Any(tId => tId == oldSubject.TeacherId))
                        throw new Exception("Ви не можете надати собі права для створення постів");

                    return await subjectRepository.UpdateAsync(newSubject);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("RemoveSubject")
               .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for remove Subject")
               .ResolveAsync(async (context) =>
               {
                   Guid id = context.GetArgument<Guid>("Id");
                   SubjectModel subject = await subjectRepository.GetByIdAsync(id);
                   Guid currentTeacherId = httpContextAccessor.HttpContext.GetUserId();
                   UserRoleEnum currentTeacherRole = httpContextAccessor.HttpContext.GetRole();
                   if (currentTeacherId != subject.TeacherId && currentTeacherRole != UserRoleEnum.Administrator)
                        throw new Exception("Ви не маєте прав на видалення данного предмету");
                   await subjectRepository.RemoveAsync(id);
                   return true;
               })
               .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
