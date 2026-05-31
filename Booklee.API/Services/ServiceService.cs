using Booklee.API.DTOs.Service;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Booklee.API.Services.Interfaces;

namespace Booklee.API.Services;

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _services;
    private readonly ICompanyRepository _companies;

    public ServiceService(IServiceRepository services, ICompanyRepository companies)
    {
        _services = services;
        _companies = companies;
    }

    public async Task<List<ServiceDto>> GetByCompanyIdAsync(int companyId)
    {
        var services = await _services.GetByCompanyIdAsync(companyId);
        return services.Select(MapToDto).ToList();
    }

    public async Task<ServiceDto> CreateAsync(int companyId, int ownerId, CreateServiceDto dto)
    {
        var company = await _companies.GetByIdAsync(companyId)
            ?? throw new KeyNotFoundException("Company not found.");

        if (company.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You don't own this company.");

        var service = new Service
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            DurationMinutes = dto.DurationMinutes,
            CompanyId = companyId
        };

        await _services.CreateAsync(service);
        return MapToDto(service);
    }

    public async Task<ServiceDto> UpdateAsync(int serviceId, int ownerId, CreateServiceDto dto)
    {
        var service = await _services.GetByIdAsync(serviceId)
            ?? throw new KeyNotFoundException("Service not found.");

        var company = await _companies.GetByIdAsync(service.CompanyId)
            ?? throw new KeyNotFoundException("Company not found.");

        if (company.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You don't own this company.");

        service.Name = dto.Name;
        service.Description = dto.Description;
        service.Price = dto.Price;
        service.DurationMinutes = dto.DurationMinutes;

        await _services.UpdateAsync(service);
        return MapToDto(service);
    }

    public async Task DeleteAsync(int serviceId, int ownerId)
    {
        var service = await _services.GetByIdAsync(serviceId)
            ?? throw new KeyNotFoundException("Service not found.");

        var company = await _companies.GetByIdAsync(service.CompanyId)
            ?? throw new KeyNotFoundException("Company not found.");

        if (company.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You don't own this company.");

        await _services.DeleteAsync(service);
    }

    private static ServiceDto MapToDto(Service s) => new()
    {
        Id = s.Id,
        Name = s.Name,
        Description = s.Description,
        Price = s.Price,
        DurationMinutes = s.DurationMinutes,
        IsActive = s.IsActive,
        CompanyId = s.CompanyId
    };
}
