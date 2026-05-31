using Booklee.API.Models;

namespace Booklee.API.Repositories.Interfaces;

public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(int id);
    Task<List<Booking>> GetByCustomerIdAsync(int customerId);
    Task<List<Booking>> GetByCompanyIdAsync(int companyId);
    Task<List<Booking>> GetByCompanyAndDateRangeAsync(int companyId, DateTime start, DateTime end);
    Task<Booking> CreateAsync(Booking booking);
    Task<Booking> UpdateAsync(Booking booking);
}
