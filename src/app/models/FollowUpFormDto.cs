using System;
using System.Collections.Generic;

namespace Api.DTOs
{
  public class FollowUpFormDto
  {
    public int Id { get; set; }
    public int MeetingId { get; set; }
    public string Title { get; set; } = null!;
    public string Detail { get; set; } = null!;
    public string? Remark { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Sender { get; set; } = null!;
    public string? Cc { get; set; }
    public bool? IsVisabled { get; set; }
    public string Status { get; set; } = null!;
    public int[]? Attendees { get; set; }
    public List<AttachmentFormDto>? Attachments { get; set; }


  }
}

