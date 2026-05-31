using Booklee.API.DTOs.Availability;
using Booklee.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Booklee.API.Controllers;

[ApiController]
[Route("api/companies/{companyId}/availability")]
public class AvailabilityController : ControllerBase
{
    private readonly IAvailabilityService _availability;

    public AvailabilityController(IAvailabilityService availability) => _availability = availability;

    [HttpGet]
    public async Task<IActionResult> Get(int companyId) =>
        Ok(await _availability.GetByCompanyIdAsync(companyId));

    [Authorize(Roles = "Owner")]
    [HttpPut]
    public async Task<IActionResult> Set(int companyId, List<SetAvailabilityDto> dtos)
    {
        var ownerId = GetUserId();
        return Ok(await _availability.SetAvailabilityAsync(companyId, ownerId, dtos));
    }

    [HttpGet("slots")]
    public async Task<IActionResult> GetSlots(int companyId, [FromQuery] int serviceId, [FromQuery] string date)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
            return BadRequest("Invalid date format. Use yyyy-MM-dd.");

        return Ok(await _availability.GetAvailableSlotsAsync(companyId, serviceId, parsedDate));
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
