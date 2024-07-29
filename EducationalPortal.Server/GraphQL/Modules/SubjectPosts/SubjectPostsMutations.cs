using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.GraphQL.Modules.SubjectPosts.DTO;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.SubjectPosts
{
    public class SubjectPostsMutations : ObjectGraphType, IMutationMarker
    {
        public SubjectPostsMutations(ISubjectRepository subjectRepository, ISubjectPostRepository subjectPostRepository, IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<SubjectPostType>, SubjectPostModel>()
                .Name("CreateSubjectPost")
                .Argument<NonNullGraphType<CreateSubjectPostInputType>, SubjectPostModel>("CreateSubjectPostInputType", "Argument for create new Subject Post")
                .ResolveAsync(async (context) =>
                {
                    SubjectPostModel subjectPost = context.GetArgument<SubjectPostModel>("CreateSubjectPostInputType");
                    Guid currentTeacherId = httpContextAccessor.HttpContext.GetUserId();
                    UserRoleEnum currentTeacherRole = httpContextAccessor.HttpContext.GetRole();
                    SubjectModel subject = await subjectRepository.GetByIdAsync(subjectPost.SubjectId, s => s.TeachersHaveAccessCreatePosts);
                    if (subject.TeacherId != currentTeacherId && !subject.TeachersHaveAccessCreatePosts.Any(t => t.Id == currentTeacherId) && currentTeacherRole != UserRoleEnum.Administrator)
                        throw new Exception($"Ви не маєте прав на додавання посту для даного предмета");
                    subjectPost.TeacherId = currentTeacherId;
                    return await subjectPostRepository.CreateAsync(subjectPost);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<SubjectPostType>, SubjectPostModel>()
                .Name("UpdateSubjectPost")
                .Argument<NonNullGraphType<UpdateSubjectPostInputType>, SubjectPostModel>("UpdateSubjectPostInputType", "Argument for update Subject Post")
                .ResolveAsync(async (context) =>
                {
                    SubjectPostModel newSubjectPost = context.GetArgument<SubjectPostModel>("UpdateSubjectPostInputType");
                    Guid currentTeacherId = httpContextAccessor.HttpContext.GetUserId();
                    UserRoleEnum currentTeacherRole = httpContextAccessor.HttpContext.GetRole();
                    SubjectPostModel oldSubjectPost = await subjectPostRepository.GetByIdAsync(newSubjectPost.Id);
                    SubjectModel subject = await subjectRepository.GetByIdAsync(oldSubjectPost.SubjectId, s => s.TeachersHaveAccessCreatePosts);
                    if (subject.TeacherId != currentTeacherId && !subject.TeachersHaveAccessCreatePosts.Any(t => t.Id == currentTeacherId) && currentTeacherRole != UserRoleEnum.Administrator)
                        throw new Exception($"Ви не маєте прав на редагування посту для даного предмета");
                    return await subjectPostRepository.UpdateAsync(newSubjectPost);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("RemoveSubjectPost")
               .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for remove Subject Post")
               .ResolveAsync(async (context) =>
               {
                   Guid id = context.GetArgument<Guid>("Id");
                   SubjectPostModel subjectPost = await subjectPostRepository.GetByIdAsync(id);
                   Guid currentTeacherId = httpContextAccessor.HttpContext.GetUserId();
                   UserRoleEnum currentTeacherRole = httpContextAccessor.HttpContext.GetRole();
                   SubjectModel subject = await subjectRepository.GetByIdAsync(subjectPost.SubjectId, s => s.TeachersHaveAccessCreatePosts);
                   if (subject.TeacherId != currentTeacherId && !subject.TeachersHaveAccessCreatePosts.Any(t => t.Id == currentTeacherId) && currentTeacherRole != UserRoleEnum.Administrator)
                        throw new Exception($"Ви не маєте прав на видалення даного посту");
                   await subjectPostRepository.RemoveAsync(id);
                   return true;
               })
               .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
