using Booklee.API.Data;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Booklee.API.Repositories;

public class ServiceRepository : IServiceRepository
{
    private readonly AppDbContext _db;

    public ServiceRepository(AppDbContext db) => _db = db;

    public async Task<List<Service>> GetByCompanyIdAsync(int companyId) =>
        await _db.Services.Where(s => s.CompanyId == companyId).ToListAsync();

    public async Task<Service?> GetByIdAsync(int id) =>
        await _db.Services.FindAsync(id);

    public async Task<Service> CreateAsync(Service service)
    {
        _db.Services.Add(service);
        await _db.SaveChangesAsync();
        return service;
    }

    public async Task<Service> UpdateAsync(Service service)
    {
        _db.Services.Update(service);
        await _db.SaveChangesAsync();
        return service;
    }

    public async Task DeleteAsync(Service service)
    {
        _db.Services.Remove(service);
        await _db.SaveChangesAsync();
    }
}
