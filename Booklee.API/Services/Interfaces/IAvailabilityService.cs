using Booklee.API.DTOs.Availability;

namespace Booklee.API.Services.Interfaces;

public interface IAvailabilityService
{
    Task<List<AvailabilityDto>> GetByCompanyIdAsync(int companyId);
    Task<List<AvailabilityDto>> SetAvailabilityAsync(int companyId, int ownerId, List<SetAvailabilityDto> dtos);
    Task<List<TimeslotDto>> GetAvailableSlotsAsync(int companyId, int serviceId, DateOnly date);
}
