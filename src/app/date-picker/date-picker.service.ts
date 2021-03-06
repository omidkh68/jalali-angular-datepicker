import {EventEmitter, Injectable} from '@angular/core';
import {IDatePickerConfig} from './date-picker-config.model';
import {Moment} from 'jalali-moment';
import * as moment from 'jalali-moment';
import {UtilsService} from '../common/services/utils/utils.service';
import {IDayCalendarConfig} from '../day-calendar/day-calendar-config.model';
import {ECalendarSystem} from '../common/types/calendar-type-enum';
import {TimeSelectService} from '../time-select/time-select.service';
import {DayTimeCalendarService} from '../day-time-calendar/day-time-calendar.service';
import {ITimeSelectConfig} from '../time-select/time-select-config.model';
import {CalendarMode} from '../common/types/calendar-mode';

@Injectable()
export class DatePickerService {
  readonly onPickerClosed: EventEmitter<null> = new EventEmitter();
  private gregorianDefaultConfig: IDatePickerConfig = {
    closeOnSelect: true,
    closeOnSelectDelay: 100,
    format: 'DD-MM-YYYY',
    onOpenDelay: 0,
    disableKeypress: false,
    showNearMonthDays: true,
    drops: 'down',
    opens: 'right',
    showWeekNumbers: false,
    enableMonthSelector: true,
    showGoToCurrent: true,
    locale: 'en'
  };
  private jalaliExtensionConfig: IDatePickerConfig = {
    format: 'jYYYY-jMM-jD',
    locale: 'fa'
  };
  private defaultConfig: IDatePickerConfig = {...this.gregorianDefaultConfig, ...this.jalaliExtensionConfig};
  constructor(private utilsService: UtilsService,
              private timeSelectService: TimeSelectService,
              private daytimeCalendarService: DayTimeCalendarService) {
  }

  // todo:: add unit tests
  getConfig(config: IDatePickerConfig, mode: CalendarMode = 'daytime'): IDatePickerConfig {

    if (!config || (config.calendarSystem !== ECalendarSystem.gregorian)) {
      this.defaultConfig = {...this.gregorianDefaultConfig, ...this.jalaliExtensionConfig};
    } else {
      this.defaultConfig = {...this.gregorianDefaultConfig};
    }

    const _config: IDatePickerConfig = {
      ...this.defaultConfig,
      format: this.getDefaultFormatByMode(mode, config),
      ...this.utilsService.clearUndefined(config)
    };
    const {min, max, format} = _config;
    if (min) {
      _config.min = this.utilsService.convertToMoment(min, format);
    }

    if (max) {
      _config.max = this.utilsService.convertToMoment(max, format);
    }

    if (config && config.allowMultiSelect && config.closeOnSelect === undefined) {
      _config.closeOnSelect = false;
    }

    moment.locale(_config.locale);

    return _config;
  }

  getDayConfigService(pickerConfig: IDatePickerConfig): IDayCalendarConfig {
    return {
      min: pickerConfig.min,
      max: pickerConfig.max,
      isDayDisabledCallback: pickerConfig.isDayDisabledCallback,
      weekDayFormat: pickerConfig.weekDayFormat,
      showNearMonthDays: pickerConfig.showNearMonthDays,
      showWeekNumbers: pickerConfig.showWeekNumbers,
      firstDayOfWeek: pickerConfig.firstDayOfWeek,
      format: pickerConfig.format,
      calendarSystem: pickerConfig.calendarSystem,
      allowMultiSelect: pickerConfig.allowMultiSelect,
      monthFormat: pickerConfig.monthFormat,
      monthFormatter: pickerConfig.monthFormatter,
      enableMonthSelector: pickerConfig.enableMonthSelector,
      yearFormat: pickerConfig.yearFormat,
      yearFormatter: pickerConfig.yearFormatter,
      dayBtnFormat: pickerConfig.dayBtnFormat,
      dayBtnFormatter: pickerConfig.dayBtnFormatter,
      monthBtnFormat: pickerConfig.monthBtnFormat,
      monthBtnFormatter: pickerConfig.monthBtnFormatter,
      multipleYearsNavigateBy: pickerConfig.multipleYearsNavigateBy,
      showMultipleYearsNavigation: pickerConfig.showMultipleYearsNavigation,
      locale: pickerConfig.locale
    };
  }

  getDayTimeConfigService(pickerConfig: IDatePickerConfig): ITimeSelectConfig {
    return this.daytimeCalendarService.getConfig(pickerConfig);
  }

  getTimeConfigService(pickerConfig: IDatePickerConfig): ITimeSelectConfig {
    return this.timeSelectService.getConfig(pickerConfig);
  }

  pickerClosed() {
    this.onPickerClosed.emit();
  }

  // todo:: add unit tests
  isValidInputDateValue(value: string, config: IDatePickerConfig): boolean {
    value = value ? value : '';
    let datesStrArr: string[];

    if (config.allowMultiSelect) {
      datesStrArr = value.split(',');
    } else {
      datesStrArr = [value];
    }

    return datesStrArr.every(date => this.utilsService.isDateValid(date, config.format));
  }

  // todo:: add unit tests
  convertInputValueToMomentArray(value: string, config: IDatePickerConfig): Moment[] {
    value = value ? value : '';
    let datesStrArr: string[];

    if (config.allowMultiSelect) {
      datesStrArr = value.split(',');
    } else {
      datesStrArr = [value];
    }

    return this.utilsService.convertToMomentArray(datesStrArr, config.format, config.allowMultiSelect);
  }

  private getDefaultFormatByMode(mode: CalendarMode, config: IDatePickerConfig): string {
    let dateFormat = 'DD-MM-YYYY';
    let monthFormat = 'MMM, YYYY';
    const timeFormat = 'HH:mm:ss';
    if (!config || (config.calendarSystem !== ECalendarSystem.gregorian)) {
      dateFormat = 'jYYYY-jMM-jDD';
      monthFormat = 'jMMMM jYY';
    }
    switch (mode) {
      case 'day':
        return dateFormat;
      case 'daytime':
        return dateFormat + ' ' + timeFormat;
      case 'time':
        return timeFormat;
      case 'month':
        return monthFormat;
    }
  }
}
