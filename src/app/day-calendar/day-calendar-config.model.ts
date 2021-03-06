import {ICalendar} from '../common/models/calendar.model';
import {WeekDays} from '../common/types/week-days.type';
import {Moment} from 'jalali-moment';
import {ECalendarSystem} from '../common/types/calendar-type-enum';

export interface IDayCalendarConfig extends ICalendar {
  isDayDisabledCallback?: (date: Moment) => boolean;
  isMonthDisabledCallback?: (date: Moment) => boolean;
  weekDayFormat?: string;
  showNearMonthDays?: boolean;
  showWeekNumbers?: boolean;
  firstDayOfWeek?: WeekDays;
  calendarSystem?: ECalendarSystem;
  format?: string;
  allowMultiSelect?: boolean;
  monthFormat?: string;
  monthFormatter?: (month: Moment) => string;
  enableMonthSelector?: boolean;
  yearFormat?: string;
  yearFormatter?: (year: Moment) => string;
  dayBtnFormat?: string;
  dayBtnFormatter?: (day: Moment) => string;
  monthBtnFormat?: string;
  monthBtnFormatter?: (day: Moment) => string;
  multipleYearsNavigateBy?: number;
  showMultipleYearsNavigation?: boolean;
}
