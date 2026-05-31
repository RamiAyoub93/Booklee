namespace Booklee.API.Models;

public class Availability
{
    public int Id { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsOpen { get; set; } = true;

    public int CompanyId { get; set; }
    public Company Company { get; set; } = null!;
}
