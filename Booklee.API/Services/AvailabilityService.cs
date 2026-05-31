using Booklee.API.DTOs.Availability;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Booklee.API.Services.Interfaces;

namespace Booklee.API.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly IAvailabilityRepository _availability;
    private readonly IBookingRepository _bookings;
    private readonly IServiceRepository _services;
    private readonly ICompanyRepository _companies;

    public AvailabilityService(
        IAvailabilityRepository availability,
        IBookingRepository bookings,
        IServiceRepository services,
        ICompanyRepository companies)
    {
        _availability = availability;
        _bookings = bookings;
        _services = services;
        _companies = companies;
    }

    public async Task<List<AvailabilityDto>> GetByCompanyIdAsync(int companyId)
    {
        var list = await _availability.GetByCompanyIdAsync(companyId);
        return list.Select(MapToDto).ToList();
    }

    public async Task<List<AvailabilityDto>> SetAvailabilityAsync(int companyId, int ownerId, List<SetAvailabilityDto> dtos)
    {
        var company = await _companies.GetByIdAsync(companyId)
            ?? throw new KeyNotFoundException("Company not found.");

        if (company.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You don't own this company.");

        var availabilities = dtos.Select(d => new Availability
        {
            CompanyId = companyId,
            DayOfWeek = d.DayOfWeek,
            StartTime = TimeOnly.Parse(d.StartTime),
            EndTime = TimeOnly.Parse(d.EndTime),
            IsOpen = d.IsOpen
        }).ToList();

        await _availability.UpsertAsync(companyId, availabilities);
        return availabilities.Select(MapToDto).ToList();
    }

    public async Task<List<TimeslotDto>> GetAvailableSlotsAsync(int companyId, int serviceId, DateOnly date)
    {
        var service = await _services.GetByIdAsync(serviceId)
            ?? throw new KeyNotFoundException("Service not found.");

        var dayAvailability = await _availability.GetByCompanyAndDayAsync(companyId, date.DayOfWeek);

        if (dayAvailability == null || !dayAvailability.IsOpen)
            return new List<TimeslotDto>();

        var dayStart = date.ToDateTime(dayAvailability.StartTime, DateTimeKind.Utc);
        var dayEnd = date.ToDateTime(dayAvailability.EndTime, DateTimeKind.Utc);

        var existingBookings = await _bookings.GetByCompanyAndDateRangeAsync(companyId, dayStart, dayEnd);

        var slots = new List<TimeslotDto>();
        var slotDuration = TimeSpan.FromMinutes(service.DurationMinutes);
        var current = dayStart;

        while (current.Add(slotDuration) <= dayEnd)
        {
            var slotEnd = current.Add(slotDuration);
            var isBooked = existingBookings.Any(b => b.StartTime < slotEnd && b.EndTime > current);

            slots.Add(new TimeslotDto
            {
                Start = current,
                End = slotEnd,
                IsAvailable = !isBooked && current > DateTime.UtcNow
            });

            current = current.Add(slotDuration);
        }

        return slots;
    }

    private static AvailabilityDto MapToDto(Availability a) => new()
    {
        Id = a.Id,
        DayOfWeek = a.DayOfWeek,
        StartTime = a.StartTime.ToString("HH:mm"),
        EndTime = a.EndTime.ToString("HH:mm"),
        IsOpen = a.IsOpen
    };
}
