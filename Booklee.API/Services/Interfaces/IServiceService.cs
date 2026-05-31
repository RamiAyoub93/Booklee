using Booklee.API.DTOs.Service;

namespace Booklee.API.Services.Interfaces;

public interface IServiceService
{
    Task<List<ServiceDto>> GetByCompanyIdAsync(int companyId);
    Task<ServiceDto> CreateAsync(int companyId, int ownerId, CreateServiceDto dto);
    Task<ServiceDto> UpdateAsync(int serviceId, int ownerId, CreateServiceDto dto);
    Task DeleteAsync(int serviceId, int ownerId);
}
