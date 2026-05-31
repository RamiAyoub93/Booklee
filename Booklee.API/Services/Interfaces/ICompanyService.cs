using Booklee.API.DTOs.Company;

namespace Booklee.API.Services.Interfaces;

public interface ICompanyService
{
    Task<List<CompanyDto>> GetAllAsync();
    Task<CompanyDto> GetByIdAsync(int id);
    Task<CompanyDto> GetByOwnerIdAsync(int ownerId);
    Task<CompanyDto> CreateAsync(int ownerId, CreateCompanyDto dto);
    Task<CompanyDto> UpdateAsync(int companyId, int ownerId, CreateCompanyDto dto);
}
