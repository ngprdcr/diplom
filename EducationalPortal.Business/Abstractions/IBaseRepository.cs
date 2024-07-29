using System.Linq.Expressions;

namespace EducationalPortal.Business.Abstractions
{
    public interface IBaseRepository<T> where T : BaseModel
    {
        Task<T> GetByIdAsync(Guid? id, params Expression<Func<T, object>>[] includes);
        Task<T?> GetByIdOrDefaultAsync(Guid? id, params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetAsync(params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetOrDefaultAsync(params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetAsync(Expression<Func<T, bool>> condition, params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetOrDefaultAsync(Expression<Func<T, bool>> condition, params Expression<Func<T, object>>[] includes);
        Task<GetEntitiesResponse<T>> WhereAsync(Expression<Func<T, object>> predicate, Order order, int page, Expression<Func<T, bool>>? condition, params Expression<Func<T, object>>[] includes);
        Task<GetEntitiesResponse<T>> WhereOrDefaultAsync(Expression<Func<T, object>> predicate, Order order, int page, Expression<Func<T, bool>>? condition, params Expression<Func<T, object>>[] includes);
        Task<T> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task RemoveAsync(Guid id);
    }
}
