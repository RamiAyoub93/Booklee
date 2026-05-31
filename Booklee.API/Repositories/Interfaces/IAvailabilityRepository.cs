using Booklee.API.Models;

namespace Booklee.API.Repositories.Interfaces;

public interface IAvailabilityRepository
{
    Task<List<Availability>> GetByCompanyIdAsync(int companyId);
    Task<Availability?> GetByCompanyAndDayAsync(int companyId, DayOfWeek day);
    Task UpsertAsync(int companyId, List<Availability> availabilities);
}
