using Booklee.API.Models;

namespace Booklee.API.Repositories.Interfaces;

public interface ICompanyRepository
{
    Task<List<Company>> GetAllAsync();
    Task<Company?> GetByIdAsync(int id);
    Task<Company?> GetByOwnerIdAsync(int ownerId);
    Task<Company> CreateAsync(Company company);
    Task<Company> UpdateAsync(Company company);
}
