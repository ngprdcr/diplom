using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth.DTO;
using EducationalPortal.Server.Services;
using GraphQL;
using GraphQL.Types;
using Microsoft.Extensions.Caching.Memory;

namespace EducationalPortal.Server.GraphQL.Modules.Auth
{
    public class AuthQueries : ObjectGraphType, IQueryMarker
    {
        public AuthQueries(IUserRepository usersRepository, IHttpContextAccessor httpContextAccessor, AuthService authService, IMemoryCache memoryCache)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Me")
                .ResolveAsync(async context =>
                {
                    var userId = httpContextAccessor.HttpContext.GetUserId();
                    string key = $"users/{userId}";
                    UserModel currentUser;
                    if (!memoryCache.TryGetValue(key, out currentUser))
                    {
                        currentUser = await usersRepository.GetByIdAsync(userId);
                        memoryCache.Set(key, currentUser, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromDays(1)));
                    }
                    return new AuthResponse()
                    {
                        Token = authService.GenerateAccessToken(currentUser.Id, currentUser.Login, currentUser.Role),
                        User = currentUser,
                    };
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
