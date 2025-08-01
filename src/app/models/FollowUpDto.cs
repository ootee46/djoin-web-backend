using System;
using System.Collections.Generic;

namespace Api.DTOs
{
  public class FollowUpDto
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
    public DateTime? CreatedDate { get; set; }
    public string? CreatedIp { get; set; }
    public string? CreatedUser { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public string? UpdatedIp { get; set; }
    public string? UpdatedUser { get; set; }

    public List<FollowUpAttachmentDto> FollowUpAttachments { get; set; }
    public List<FollowUpAttendeeDto> FollowUpAttendees { get; set; }

    public FollowUpDto(){
      FollowUpAttachments = new List<FollowUpAttachmentDto>();
      FollowUpAttendees = new List<FollowUpAttendeeDto>();
    }
  }
}

public class FollowUpAttendeeDto
{
  public int Id { get; set; }
  public string? TitleName { get; set; }
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Email { get; set; }
}

public class FollowUpAttachmentDto
{
  public int Id { get; set; }
  public string? Title { get; set; }
  public string? FileName { get; set; }
  public string? FileType { get; set; }
  public double? FileSize { get; set; }
  public string? FileUrl { get; set; }
  public string? RealFileName { get; set; }
  public string? Salt { get; set; }
  public DateTime? CreatedDate { get; set; }
  public string? CreatedIp { get; set; }
  public string? CreatedUser { get; set; }
  public DateTime? UpdatedDate { get; set; }
  public string? UpdatedIp { get; set; }
  public string? UpdatedUser { get; set; }
}
