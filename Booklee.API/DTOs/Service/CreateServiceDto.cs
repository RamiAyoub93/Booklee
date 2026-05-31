using System.ComponentModel.DataAnnotations;

namespace Booklee.API.DTOs.Service;

public class CreateServiceDto
{
    [Required] public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Range(0, 10000)] public decimal Price { get; set; }
    [Range(5, 480)] public int DurationMinutes { get; set; }
}
