using Booklee.API.DTOs.Company;
using Booklee.API.DTOs.Service;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Booklee.API.Services.Interfaces;

namespace Booklee.API.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _companies;

    public CompanyService(ICompanyRepository companies) => _companies = companies;

    public async Task<List<CompanyDto>> GetAllAsync()
    {
        var companies = await _companies.GetAllAsync();
        return companies.Select(MapToDto).ToList();
    }

    public async Task<CompanyDto> GetByIdAsync(int id)
    {
        var company = await _companies.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Company not found.");
        return MapToDto(company);
    }

    public async Task<CompanyDto> GetByOwnerIdAsync(int ownerId)
    {
        var company = await _companies.GetByOwnerIdAsync(ownerId)
            ?? throw new KeyNotFoundException("No company found for this owner.");
        return MapToDto(company);
    }

    public async Task<CompanyDto> CreateAsync(int ownerId, CreateCompanyDto dto)
    {
        var existing = await _companies.GetByOwnerIdAsync(ownerId);
        if (existing != null)
            throw new InvalidOperationException("Owner already has a company.");

        var company = new Company
        {
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            Phone = dto.Phone,
            Address = dto.Address,
            OwnerId = ownerId
        };

        await _companies.CreateAsync(company);
        return MapToDto(company);
    }

    public async Task<CompanyDto> UpdateAsync(int companyId, int ownerId, CreateCompanyDto dto)
    {
        var company = await _companies.GetByIdAsync(companyId)
            ?? throw new KeyNotFoundException("Company not found.");

        if (company.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You don't own this company.");

        company.Name = dto.Name;
        company.Description = dto.Description;
        company.Category = dto.Category;
        company.Phone = dto.Phone;
        company.Address = dto.Address;

        await _companies.UpdateAsync(company);
        return MapToDto(company);
    }

    private static CompanyDto MapToDto(Company c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Description = c.Description,
        Category = c.Category,
        Phone = c.Phone,
        Address = c.Address,
        OwnerId = c.OwnerId,
        OwnerName = c.Owner?.Name ?? string.Empty,
        Services = c.Services.Select(s => new ServiceDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            Price = s.Price,
            DurationMinutes = s.DurationMinutes,
            IsActive = s.IsActive,
            CompanyId = s.CompanyId
        }).ToList()
    };
}
