namespace Booklee.API.DTOs.Booking;

public class BookingDto
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;

    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public decimal ServicePrice { get; set; }
    public int ServiceDuration { get; set; }

    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}

public class CreateBookingDto
{
    public int ServiceId { get; set; }
    public int CompanyId { get; set; }
    public DateTime StartTime { get; set; }
    public string? Notes { get; set; }
}
