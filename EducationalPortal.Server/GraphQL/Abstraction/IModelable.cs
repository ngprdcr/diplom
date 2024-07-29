namespace EducationalPortal.Server.GraphQL.Abstraction
{
    public interface IModelable<T>
    {
        T ToModel();
    }
}
