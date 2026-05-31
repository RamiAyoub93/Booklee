using Booklee.API.Data;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Booklee.API.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _db;

    public BookingRepository(AppDbContext db) => _db = db;

    public async Task<Booking?> GetByIdAsync(int id) =>
        await _db.Bookings
            .Include(b => b.Customer)
            .Include(b => b.Service)
            .Include(b => b.Company)
            .FirstOrDefaultAsync(b => b.Id == id);

    public async Task<List<Booking>> GetByCustomerIdAsync(int customerId) =>
        await _db.Bookings
            .Include(b => b.Service)
            .Include(b => b.Company)
            .Where(b => b.CustomerId == customerId)
            .OrderByDescending(b => b.StartTime)
            .ToListAsync();

    public async Task<List<Booking>> GetByCompanyIdAsync(int companyId) =>
        await _db.Bookings
            .Include(b => b.Customer)
            .Include(b => b.Service)
            .Where(b => b.CompanyId == companyId)
            .OrderByDescending(b => b.StartTime)
            .ToListAsync();

    public async Task<List<Booking>> GetByCompanyAndDateRangeAsync(int companyId, DateTime start, DateTime end) =>
        await _db.Bookings
            .Where(b => b.CompanyId == companyId
                && b.Status != "Cancelled"
                && b.StartTime < end
                && b.EndTime > start)
            .ToListAsync();

    public async Task<Booking> CreateAsync(Booking booking)
    {
        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();
        return booking;
    }

    public async Task<Booking> UpdateAsync(Booking booking)
    {
        _db.Bookings.Update(booking);
        await _db.SaveChangesAsync();
        return booking;
    }
}
