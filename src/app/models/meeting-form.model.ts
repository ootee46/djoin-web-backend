export class MeetingFormModel {
  id: number;
  meetingRoomId: number;
  meetingNo: string;
  startDate: Date;
  endDate: Date;
  title: string;
  detail: string;
  venue: string;
  conferenceUrl: string;
  isMinuteConfirm: boolean;
  minuteConfirmDate: Date;
  isAutoEndDate: boolean;
  isConfirmed: boolean;
  active: boolean;
  meetingTypeId: number;
  reserveRejectType: number;
  isReserved: boolean;
}
