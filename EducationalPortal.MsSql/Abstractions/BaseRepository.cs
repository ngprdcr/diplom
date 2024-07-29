using EducationalPortal.Business.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace EducationalPortal.MsSql.Abstractions
{
    public abstract class BaseRepository<T> : IBaseRepository<T> where T : BaseModel
    {
        private readonly AppDbContext _context;

        public BaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public virtual Task<T> GetByIdAsync(Guid? id, params Expression<Func<T, object>>[] includes)
        {
            Task<T?> entity = GetByIdOrDefaultAsync(id, includes);
            if (entity == null)
                throw new Exception($"Не знайдено {typeof(T).Name.Replace("Model", "")}");
            return entity;
        }
        
        public virtual Task<T?> GetByIdOrDefaultAsync(Guid? id, params Expression<Func<T, object>>[] includes)
        {
            return includes.Aggregate(_context.Set<T>().AsQueryable(), 
                (current, include) => current.Include(include))
                    .FirstOrDefaultAsync(e => e.Id == id);
        }

        public virtual Task<List<T>> GetAsync(params Expression<Func<T, object>>[] includes)
        {
            Task<List<T>> entities = GetOrDefaultAsync(includes);
            if (entities == null)
                throw new Exception($"Не знайдено {typeof(T).Name.Replace("Model", "")}");
            return entities;
        }
        
        public virtual Task<List<T>> GetOrDefaultAsync(params Expression<Func<T, object>>[] includes)
        {
            return includes.Aggregate(_context.Set<T>().AsQueryable(),
               (current, include) => current.Include(include))
                    .ToListAsync();
        }
        
        public virtual async Task<List<T>> GetAsync(Expression<Func<T, bool>> condition, params Expression<Func<T, object>>[] includes)
        {
            List<T> entities = await GetOrDefaultAsync(condition, includes);
            if (entities == null || entities.Count() == 0)
                throw new Exception($"Не знайдено {typeof(T).Name.Replace("Model", "")}");
            return entities;
        }
        
        public virtual Task<List<T>> GetOrDefaultAsync(Expression<Func<T, bool>> condition, params Expression<Func<T, object>>[] includes)
        {
            return includes.Aggregate(_context.Set<T>().AsQueryable(),
                (current, include) => current.Include(include))
                .Where(condition).ToListAsync();
        }

        public virtual async Task<GetEntitiesResponse<T>> WhereAsync(Expression<Func<T, object>> predicate, Order order, int page, Expression<Func<T, bool>>? condition = null, params Expression<Func<T, object>>[] includes)
        {
            GetEntitiesResponse<T> getEntitiesResponse = await WhereOrDefaultAsync(predicate, order, page, condition, includes);
            if (getEntitiesResponse == null || getEntitiesResponse.Total == 0)
                throw new Exception($"Не знайдено {typeof(T).Name.Replace("Model", "")}");
            return getEntitiesResponse;
        }
        
        public virtual async Task<GetEntitiesResponse<T>> WhereOrDefaultAsync(Expression<Func<T, object>> predicate, Order order, int page, Expression<Func<T, bool>>? condition = null, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> entities = includes.Aggregate(
                _context.Set<T>().AsQueryable(),
                (current, include) => current.Include(include));

            if (condition != null)
                entities = entities.Where(condition);

            entities = order == Order.Ascend
                ? entities.OrderBy(predicate)
                : entities.OrderByDescending(predicate);

            int total = entities.Count();

            int take = 20;
            int skip = (page - 1) * take;
            entities = entities.Skip(skip).Take(take);

            return new GetEntitiesResponse<T>
            {
                Entities = await entities.ToListAsync(),
                Total = total,
                PageSize = take,
            };
        }

        public virtual async Task<T> CreateAsync(T entity)
        {
            _context.Entry(entity).State = EntityState.Added;
            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task RemoveAsync(Guid id)
        {
            T entity = await GetByIdAsync(id);
            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
