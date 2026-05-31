using Booklee.API.Data;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Booklee.API.Repositories;

public class AvailabilityRepository : IAvailabilityRepository
{
    private readonly AppDbContext _db;

    public AvailabilityRepository(AppDbContext db) => _db = db;

    public async Task<List<Availability>> GetByCompanyIdAsync(int companyId) =>
        await _db.Availabilities.Where(a => a.CompanyId == companyId).ToListAsync();

    public async Task<Availability?> GetByCompanyAndDayAsync(int companyId, DayOfWeek day) =>
        await _db.Availabilities.FirstOrDefaultAsync(a => a.CompanyId == companyId && a.DayOfWeek == day);

    public async Task UpsertAsync(int companyId, List<Availability> availabilities)
    {
        var existing = await _db.Availabilities.Where(a => a.CompanyId == companyId).ToListAsync();
        _db.Availabilities.RemoveRange(existing);
        await _db.Availabilities.AddRangeAsync(availabilities);
        await _db.SaveChangesAsync();
    }
}
