using Booklee.API.DTOs.Booking;

namespace Booklee.API.Services.Interfaces;

public interface IBookingService
{
    Task<BookingDto> CreateAsync(int customerId, CreateBookingDto dto);
    Task<List<BookingDto>> GetCustomerBookingsAsync(int customerId);
    Task<List<BookingDto>> GetCompanyBookingsAsync(int companyId, int ownerId);
    Task<BookingDto> CancelAsync(int bookingId, int userId);
    Task<BookingDto> ConfirmAsync(int bookingId, int ownerId);
}
