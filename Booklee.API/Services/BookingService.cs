using Booklee.API.DTOs.Booking;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Booklee.API.Services.Interfaces;

namespace Booklee.API.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookings;
    private readonly IServiceRepository _services;
    private readonly ICompanyRepository _companies;

    public BookingService(
        IBookingRepository bookings,
        IServiceRepository services,
        ICompanyRepository companies)
    {
        _bookings = bookings;
        _services = services;
        _companies = companies;
    }

    public async Task<BookingDto> CreateAsync(int customerId, CreateBookingDto dto)
    {
        var service = await _services.GetByIdAsync(dto.ServiceId)
            ?? throw new KeyNotFoundException("Service not found.");

        if (service.CompanyId != dto.CompanyId)
            throw new ArgumentException("Service does not belong to this company.");

        if (dto.StartTime <= DateTime.UtcNow)
            throw new ArgumentException("Booking must be in the future.");

        var endTime = dto.StartTime.AddMinutes(service.DurationMinutes);

        var conflicts = await _bookings.GetByCompanyAndDateRangeAsync(dto.CompanyId, dto.StartTime, endTime);
        if (conflicts.Any())
            throw new InvalidOperationException("This time slot is already booked.");

        var booking = new Booking
        {
            CustomerId = customerId,
            ServiceId = dto.ServiceId,
            CompanyId = dto.CompanyId,
            StartTime = dto.StartTime,
            EndTime = endTime,
            Notes = dto.Notes,
            Status = "Pending"
        };

        await _bookings.CreateAsync(booking);

        var created = await _bookings.GetByIdAsync(booking.Id);
        return MapToDto(created!);
    }

    public async Task<List<BookingDto>> GetCustomerBookingsAsync(int customerId)
    {
        var bookings = await _bookings.GetByCustomerIdAsync(customerId);
        return bookings.Select(MapToDto).ToList();
    }

    public async Task<List<BookingDto>> GetCompanyBookingsAsync(int companyId, int ownerId)
    {
        var company = await _companies.GetByIdAsync(companyId)
            ?? throw new KeyNotFoundException("Company not found.");

        if (company.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You don't own this company.");

        var bookings = await _bookings.GetByCompanyIdAsync(companyId);
        return bookings.Select(MapToDto).ToList();
    }

    public async Task<BookingDto> CancelAsync(int bookingId, int userId)
    {
        var booking = await _bookings.GetByIdAsync(bookingId)
            ?? throw new KeyNotFoundException("Booking not found.");

        var isCustomer = booking.CustomerId == userId;
        var isOwner = booking.Company.OwnerId == userId;

        if (!isCustomer && !isOwner)
            throw new UnauthorizedAccessException("Not authorized to cancel this booking.");

        if (booking.Status == "Cancelled")
            throw new InvalidOperationException("Booking is already cancelled.");

        booking.Status = "Cancelled";
        await _bookings.UpdateAsync(booking);
        return MapToDto(booking);
    }

    public async Task<BookingDto> ConfirmAsync(int bookingId, int ownerId)
    {
        var booking = await _bookings.GetByIdAsync(bookingId)
            ?? throw new KeyNotFoundException("Booking not found.");

        if (booking.Company.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You don't own this company.");

        if (booking.Status != "Pending")
            throw new InvalidOperationException("Only pending bookings can be confirmed.");

        booking.Status = "Confirmed";
        await _bookings.UpdateAsync(booking);
        return MapToDto(booking);
    }

    private static BookingDto MapToDto(Booking b) => new()
    {
        Id = b.Id,
        StartTime = b.StartTime,
        EndTime = b.EndTime,
        Status = b.Status,
        Notes = b.Notes,
        CreatedAt = b.CreatedAt,
        CustomerId = b.CustomerId,
        CustomerName = b.Customer?.Name ?? string.Empty,
        CustomerEmail = b.Customer?.Email ?? string.Empty,
        ServiceId = b.ServiceId,
        ServiceName = b.Service?.Name ?? string.Empty,
        ServicePrice = b.Service?.Price ?? 0,
        ServiceDuration = b.Service?.DurationMinutes ?? 0,
        CompanyId = b.CompanyId,
        CompanyName = b.Company?.Name ?? string.Empty
    };
}
