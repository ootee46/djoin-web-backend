using System;
using System.Collections.Generic;

namespace Api.DTOs
{
  public class FollowUpListDto
  {
    public int Id { get; set; }
    public int MeetingId { get; set; }
    public string Title { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool? IsVisabled { get; set; }
    public string Status { get; set; } = null!;
    public DateTime? CreatedDate { get; set; }
    public string? CreatedIp { get; set; }
    public string? CreatedUser { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public string? UpdatedIp { get; set; }
    public string? UpdatedUser { get; set; }

    public List<FollowUpAttendeeDto> FollowUpAttendees { get; set; }

    public FollowUpListDto(){
      FollowUpAttendees = new List<FollowUpAttendeeDto>();
    }
  }
}

