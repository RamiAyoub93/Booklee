using Booklee.API.Models;

namespace Booklee.API.Repositories.Interfaces;

public interface IServiceRepository
{
    Task<List<Service>> GetByCompanyIdAsync(int companyId);
    Task<Service?> GetByIdAsync(int id);
    Task<Service> CreateAsync(Service service);
    Task<Service> UpdateAsync(Service service);
    Task DeleteAsync(Service service);
}
