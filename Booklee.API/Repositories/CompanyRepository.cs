using Booklee.API.Data;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Booklee.API.Repositories;

public class CompanyRepository : ICompanyRepository
{
    private readonly AppDbContext _db;

    public CompanyRepository(AppDbContext db) => _db = db;

    public async Task<List<Company>> GetAllAsync() =>
        await _db.Companies
            .Include(c => c.Owner)
            .Include(c => c.Services.Where(s => s.IsActive))
            .ToListAsync();

    public async Task<Company?> GetByIdAsync(int id) =>
        await _db.Companies
            .Include(c => c.Owner)
            .Include(c => c.Services.Where(s => s.IsActive))
            .Include(c => c.Availabilities)
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<Company?> GetByOwnerIdAsync(int ownerId) =>
        await _db.Companies
            .Include(c => c.Services)
            .Include(c => c.Availabilities)
            .FirstOrDefaultAsync(c => c.OwnerId == ownerId);

    public async Task<Company> CreateAsync(Company company)
    {
        _db.Companies.Add(company);
        await _db.SaveChangesAsync();
        return company;
    }

    public async Task<Company> UpdateAsync(Company company)
    {
        _db.Companies.Update(company);
        await _db.SaveChangesAsync();
        return company;
    }
}
