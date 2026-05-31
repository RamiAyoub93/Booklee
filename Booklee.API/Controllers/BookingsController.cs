using Booklee.API.DTOs.Booking;
using Booklee.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Booklee.API.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookings;

    public BookingsController(IBookingService bookings) => _bookings = bookings;

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Create(CreateBookingDto dto)
    {
        var customerId = GetUserId();
        var result = await _bookings.CreateAsync(customerId, dto);
        return CreatedAtAction(nameof(GetMyBookings), result);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> GetMyBookings()
    {
        var customerId = GetUserId();
        return Ok(await _bookings.GetCustomerBookingsAsync(customerId));
    }

    [HttpGet("company/{companyId}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetCompanyBookings(int companyId)
    {
        var ownerId = GetUserId();
        return Ok(await _bookings.GetCompanyBookingsAsync(companyId, ownerId));
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = GetUserId();
        return Ok(await _bookings.CancelAsync(id, userId));
    }

    [HttpPut("{id}/confirm")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> Confirm(int id)
    {
        var ownerId = GetUserId();
        return Ok(await _bookings.ConfirmAsync(id, ownerId));
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
