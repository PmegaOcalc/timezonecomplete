(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tc = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Copyright(c) 2016 ABB Switzerland Ltd.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
exports.default = assert;

},{}],2:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Olsen Timezone Database container
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
var javascript_1 = require("./javascript");
var math = require("./math");
var strings = require("./strings");
/**
 * Day-of-week. Note the enum values correspond to JavaScript day-of-week:
 * Sunday = 0, Monday = 1 etc
 */
var WeekDay;
(function (WeekDay) {
    WeekDay[WeekDay["Sunday"] = 0] = "Sunday";
    WeekDay[WeekDay["Monday"] = 1] = "Monday";
    WeekDay[WeekDay["Tuesday"] = 2] = "Tuesday";
    WeekDay[WeekDay["Wednesday"] = 3] = "Wednesday";
    WeekDay[WeekDay["Thursday"] = 4] = "Thursday";
    WeekDay[WeekDay["Friday"] = 5] = "Friday";
    WeekDay[WeekDay["Saturday"] = 6] = "Saturday";
})(WeekDay = exports.WeekDay || (exports.WeekDay = {}));
/**
 * Time units
 */
var TimeUnit;
(function (TimeUnit) {
    TimeUnit[TimeUnit["Millisecond"] = 0] = "Millisecond";
    TimeUnit[TimeUnit["Second"] = 1] = "Second";
    TimeUnit[TimeUnit["Minute"] = 2] = "Minute";
    TimeUnit[TimeUnit["Hour"] = 3] = "Hour";
    TimeUnit[TimeUnit["Day"] = 4] = "Day";
    TimeUnit[TimeUnit["Week"] = 5] = "Week";
    TimeUnit[TimeUnit["Month"] = 6] = "Month";
    TimeUnit[TimeUnit["Year"] = 7] = "Year";
    /**
     * End-of-enum marker, do not use
     */
    TimeUnit[TimeUnit["MAX"] = 8] = "MAX";
})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {}));
/**
 * Approximate number of milliseconds for a time unit.
 * A day is assumed to have 24 hours, a month is assumed to equal 30 days
 * and a year is set to 360 days (because 12 months of 30 days).
 *
 * @param unit	Time unit e.g. TimeUnit.Month
 * @returns	The number of milliseconds.
 */
function timeUnitToMilliseconds(unit) {
    switch (unit) {
        case TimeUnit.Millisecond: return 1;
        case TimeUnit.Second: return 1000;
        case TimeUnit.Minute: return 60 * 1000;
        case TimeUnit.Hour: return 60 * 60 * 1000;
        case TimeUnit.Day: return 86400000;
        case TimeUnit.Week: return 7 * 86400000;
        case TimeUnit.Month: return 30 * 86400000;
        case TimeUnit.Year: return 12 * 30 * 86400000;
        /* istanbul ignore next */
        default:
            /* istanbul ignore if */
            /* istanbul ignore next */
            if (true) {
                throw new Error("Unknown time unit");
            }
    }
}
exports.timeUnitToMilliseconds = timeUnitToMilliseconds;
/**
 * Time unit to lowercase string. If amount is specified, then the string is put in plural form
 * if necessary.
 * @param unit The unit
 * @param amount If this is unequal to -1 and 1, then the result is pluralized
 */
function timeUnitToString(unit, amount) {
    if (amount === void 0) { amount = 1; }
    var result = TimeUnit[unit].toLowerCase();
    if (amount === 1 || amount === -1) {
        return result;
    }
    else {
        return result + "s";
    }
}
exports.timeUnitToString = timeUnitToString;
function stringToTimeUnit(s) {
    var trimmed = s.trim().toLowerCase();
    for (var i = 0; i < TimeUnit.MAX; ++i) {
        var other = timeUnitToString(i, 1);
        if (other === trimmed || (other + "s") === trimmed) {
            return i;
        }
    }
    throw new Error("Unknown time unit string '" + s + "'");
}
exports.stringToTimeUnit = stringToTimeUnit;
/**
 * @return True iff the given year is a leap year.
 */
function isLeapYear(year) {
    // from Wikipedia:
    // if year is not divisible by 4 then common year
    // else if year is not divisible by 100 then leap year
    // else if year is not divisible by 400 then common year
    // else leap year
    if (year % 4 !== 0) {
        return false;
    }
    else if (year % 100 !== 0) {
        return true;
    }
    else if (year % 400 !== 0) {
        return false;
    }
    else {
        return true;
    }
}
exports.isLeapYear = isLeapYear;
/**
 * The days in a given year
 */
function daysInYear(year) {
    return (isLeapYear(year) ? 366 : 365);
}
exports.daysInYear = daysInYear;
/**
 * @param year	The full year
 * @param month	The month 1-12
 * @return The number of days in the given month
 */
function daysInMonth(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 2:
            return (isLeapYear(year) ? 29 : 28);
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        default:
            throw new Error("Invalid month: " + month);
    }
}
exports.daysInMonth = daysInMonth;
/**
 * Returns the day of the year of the given date [0..365]. January first is 0.
 *
 * @param year	The year e.g. 1986
 * @param month Month 1-12
 * @param day Day of month 1-31
 */
function dayOfYear(year, month, day) {
    assert_1.default(month >= 1 && month <= 12, "Month out of range");
    assert_1.default(day >= 1 && day <= daysInMonth(year, month), "day out of range");
    var yearDay = 0;
    for (var i = 1; i < month; i++) {
        yearDay += daysInMonth(year, i);
    }
    yearDay += (day - 1);
    return yearDay;
}
exports.dayOfYear = dayOfYear;
/**
 * Returns the last instance of the given weekday in the given month
 *
 * @param year	The year
 * @param month	the month 1-12
 * @param weekDay	the desired week day
 *
 * @return the last occurrence of the week day in the month
 */
function lastWeekDayOfMonth(year, month, weekDay) {
    var endOfMonth = new TimeStruct({ year: year, month: month, day: daysInMonth(year, month) });
    var endOfMonthWeekDay = weekDayNoLeapSecs(endOfMonth.unixMillis);
    var diff = weekDay - endOfMonthWeekDay;
    if (diff > 0) {
        diff -= 7;
    }
    return endOfMonth.components.day + diff;
}
exports.lastWeekDayOfMonth = lastWeekDayOfMonth;
/**
 * Returns the first instance of the given weekday in the given month
 *
 * @param year	The year
 * @param month	the month 1-12
 * @param weekDay	the desired week day
 *
 * @return the first occurrence of the week day in the month
 */
function firstWeekDayOfMonth(year, month, weekDay) {
    var beginOfMonth = new TimeStruct({ year: year, month: month, day: 1 });
    var beginOfMonthWeekDay = weekDayNoLeapSecs(beginOfMonth.unixMillis);
    var diff = weekDay - beginOfMonthWeekDay;
    if (diff < 0) {
        diff += 7;
    }
    return beginOfMonth.components.day + diff;
}
exports.firstWeekDayOfMonth = firstWeekDayOfMonth;
/**
 * Returns the day-of-month that is on the given weekday and which is >= the given day.
 * Throws if the month has no such day.
 */
function weekDayOnOrAfter(year, month, day, weekDay) {
    var start = new TimeStruct({ year: year, month: month, day: day });
    var startWeekDay = weekDayNoLeapSecs(start.unixMillis);
    var diff = weekDay - startWeekDay;
    if (diff < 0) {
        diff += 7;
    }
    assert_1.default(start.components.day + diff <= daysInMonth(year, month), "The given month has no such weekday");
    return start.components.day + diff;
}
exports.weekDayOnOrAfter = weekDayOnOrAfter;
/**
 * Returns the day-of-month that is on the given weekday and which is <= the given day.
 * Throws if the month has no such day.
 */
function weekDayOnOrBefore(year, month, day, weekDay) {
    var start = new TimeStruct({ year: year, month: month, day: day });
    var startWeekDay = weekDayNoLeapSecs(start.unixMillis);
    var diff = weekDay - startWeekDay;
    if (diff > 0) {
        diff -= 7;
    }
    assert_1.default(start.components.day + diff >= 1, "The given month has no such weekday");
    return start.components.day + diff;
}
exports.weekDayOnOrBefore = weekDayOnOrBefore;
/**
 * The week of this month. There is no official standard for this,
 * but we assume the same rules for the weekNumber (i.e.
 * week 1 is the week that has the 4th day of the month in it)
 *
 * @param year The year
 * @param month The month [1-12]
 * @param day The day [1-31]
 * @return Week number [1-5]
 */
function weekOfMonth(year, month, day) {
    var firstThursday = firstWeekDayOfMonth(year, month, WeekDay.Thursday);
    var firstMonday = firstWeekDayOfMonth(year, month, WeekDay.Monday);
    // Corner case: check if we are in week 1 or last week of previous month
    if (day < firstMonday) {
        if (firstThursday < firstMonday) {
            // Week 1
            return 1;
        }
        else {
            // Last week of previous month
            if (month > 1) {
                // Default case
                return weekOfMonth(year, month - 1, 31);
            }
            else {
                // January
                return weekOfMonth(year - 1, 12, 31);
            }
        }
    }
    var lastMonday = lastWeekDayOfMonth(year, month, WeekDay.Monday);
    var lastThursday = lastWeekDayOfMonth(year, month, WeekDay.Thursday);
    // Corner case: check if we are in last week or week 1 of previous month
    if (day >= lastMonday) {
        if (lastMonday > lastThursday) {
            // Week 1 of next month
            return 1;
        }
    }
    // Normal case
    var result = Math.floor((day - firstMonday) / 7) + 1;
    if (firstThursday < 4) {
        result += 1;
    }
    return result;
}
exports.weekOfMonth = weekOfMonth;
/**
 * Returns the day-of-year of the Monday of week 1 in the given year.
 * Note that the result may lie in the previous year, in which case it
 * will be (much) greater than 4
 */
function getWeekOneDayOfYear(year) {
    // first monday of January, minus one because we want day-of-year
    var result = weekDayOnOrAfter(year, 1, 1, WeekDay.Monday) - 1;
    if (result > 3) { // greater than jan 4th
        result -= 7;
        if (result < 0) {
            result += exports.daysInYear(year - 1);
        }
    }
    return result;
}
/**
 * The ISO 8601 week number for the given date. Week 1 is the week
 * that has January 4th in it, and it starts on Monday.
 * See https://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param year	Year e.g. 1988
 * @param month	Month 1-12
 * @param day	Day of month 1-31
 *
 * @return Week number 1-53
 */
function weekNumber(year, month, day) {
    var doy = dayOfYear(year, month, day);
    // check end-of-year corner case: may be week 1 of next year
    if (doy >= dayOfYear(year, 12, 29)) {
        var nextYearWeekOne = getWeekOneDayOfYear(year + 1);
        if (nextYearWeekOne > 4 && nextYearWeekOne <= doy) {
            return 1;
        }
    }
    // check beginning-of-year corner case
    var thisYearWeekOne = getWeekOneDayOfYear(year);
    if (thisYearWeekOne > 4) {
        // week 1 is at end of last year
        var weekTwo = thisYearWeekOne + 7 - daysInYear(year - 1);
        if (doy < weekTwo) {
            return 1;
        }
        else {
            return Math.floor((doy - weekTwo) / 7) + 2;
        }
    }
    // Week 1 is entirely inside this year.
    if (doy < thisYearWeekOne) {
        // The date is part of the last week of prev year.
        return weekNumber(year - 1, 12, 31);
    }
    // normal cases; note that week numbers start from 1 so +1
    return Math.floor((doy - thisYearWeekOne) / 7) + 1;
}
exports.weekNumber = weekNumber;
function assertUnixTimestamp(unixMillis) {
    assert_1.default(typeof (unixMillis) === "number", "number input expected");
    assert_1.default(!isNaN(unixMillis), "NaN not expected as input");
    assert_1.default(math.isInt(unixMillis), "Expect integer number for unix UTC timestamp");
}
/**
 * Convert a unix milli timestamp into a TimeT structure.
 * This does NOT take leap seconds into account.
 */
function unixToTimeNoLeapSecs(unixMillis) {
    assertUnixTimestamp(unixMillis);
    var temp = unixMillis;
    var result = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0, milli: 0 };
    var year;
    var month;
    if (unixMillis >= 0) {
        result.milli = temp % 1000;
        temp = Math.floor(temp / 1000);
        result.second = temp % 60;
        temp = Math.floor(temp / 60);
        result.minute = temp % 60;
        temp = Math.floor(temp / 60);
        result.hour = temp % 24;
        temp = Math.floor(temp / 24);
        year = 1970;
        while (temp >= daysInYear(year)) {
            temp -= daysInYear(year);
            year++;
        }
        result.year = year;
        month = 1;
        while (temp >= daysInMonth(year, month)) {
            temp -= daysInMonth(year, month);
            month++;
        }
        result.month = month;
        result.day = temp + 1;
    }
    else {
        // Note that a negative number modulo something yields a negative number.
        // We make it positive by adding the modulo.
        result.milli = math.positiveModulo(temp, 1000);
        temp = Math.floor(temp / 1000);
        result.second = math.positiveModulo(temp, 60);
        temp = Math.floor(temp / 60);
        result.minute = math.positiveModulo(temp, 60);
        temp = Math.floor(temp / 60);
        result.hour = math.positiveModulo(temp, 24);
        temp = Math.floor(temp / 24);
        year = 1969;
        while (temp < -daysInYear(year)) {
            temp += daysInYear(year);
            year--;
        }
        result.year = year;
        month = 12;
        while (temp < -daysInMonth(year, month)) {
            temp += daysInMonth(year, month);
            month--;
        }
        result.month = month;
        result.day = temp + 1 + daysInMonth(year, month);
    }
    return result;
}
exports.unixToTimeNoLeapSecs = unixToTimeNoLeapSecs;
/**
 * Fill you any missing time component parts, defaults are 1970-01-01T00:00:00.000
 */
function normalizeTimeComponents(components) {
    var input = {
        year: typeof components.year === "number" ? components.year : 1970,
        month: typeof components.month === "number" ? components.month : 1,
        day: typeof components.day === "number" ? components.day : 1,
        hour: typeof components.hour === "number" ? components.hour : 0,
        minute: typeof components.minute === "number" ? components.minute : 0,
        second: typeof components.second === "number" ? components.second : 0,
        milli: typeof components.milli === "number" ? components.milli : 0,
    };
    return input;
}
function timeToUnixNoLeapSecs(a, month, day, hour, minute, second, milli) {
    var components = (typeof a === "number" ? { year: a, month: month, day: day, hour: hour, minute: minute, second: second, milli: milli } : a);
    var input = normalizeTimeComponents(components);
    return input.milli + 1000 * (input.second + input.minute * 60 + input.hour * 3600 + dayOfYear(input.year, input.month, input.day) * 86400 +
        (input.year - 1970) * 31536000 + Math.floor((input.year - 1969) / 4) * 86400 -
        Math.floor((input.year - 1901) / 100) * 86400 + Math.floor((input.year - 1900 + 299) / 400) * 86400);
}
exports.timeToUnixNoLeapSecs = timeToUnixNoLeapSecs;
/**
 * Return the day-of-week.
 * This does NOT take leap seconds into account.
 */
function weekDayNoLeapSecs(unixMillis) {
    assertUnixTimestamp(unixMillis);
    var epochDay = WeekDay.Thursday;
    var days = Math.floor(unixMillis / 1000 / 86400);
    return (epochDay + days) % 7;
}
exports.weekDayNoLeapSecs = weekDayNoLeapSecs;
/**
 * N-th second in the day, counting from 0
 */
function secondOfDay(hour, minute, second) {
    return (((hour * 60) + minute) * 60) + second;
}
exports.secondOfDay = secondOfDay;
/**
 * Basic representation of a date and time
 */
var TimeStruct = /** @class */ (function () {
    /**
     * Constructor implementation
     */
    function TimeStruct(a) {
        if (typeof a === "number") {
            this._unixMillis = a;
        }
        else {
            this._components = normalizeTimeComponents(a);
        }
    }
    /**
     * Returns a TimeStruct from the given year, month, day etc
     *
     * @param year	Year e.g. 1970
     * @param month	Month 1-12
     * @param day	Day 1-31
     * @param hour	Hour 0-23
     * @param minute	Minute 0-59
     * @param second	Second 0-59 (no leap seconds)
     * @param milli	Millisecond 0-999
     */
    TimeStruct.fromComponents = function (year, month, day, hour, minute, second, milli) {
        return new TimeStruct({ year: year, month: month, day: day, hour: hour, minute: minute, second: second, milli: milli });
    };
    /**
     * Create a TimeStruct from a number of unix milliseconds
     * (backward compatibility)
     */
    TimeStruct.fromUnix = function (unixMillis) {
        return new TimeStruct(unixMillis);
    };
    /**
     * Create a TimeStruct from a JavaScript date
     *
     * @param d	The date
     * @param df	Which functions to take (getX() or getUTCX())
     */
    TimeStruct.fromDate = function (d, df) {
        if (df === javascript_1.DateFunctions.Get) {
            return new TimeStruct({
                year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
                hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds(), milli: d.getMilliseconds()
            });
        }
        else {
            return new TimeStruct({
                year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
                hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds(), milli: d.getUTCMilliseconds()
            });
        }
    };
    /**
     * Returns a TimeStruct from an ISO 8601 string WITHOUT time zone
     */
    TimeStruct.fromString = function (s) {
        try {
            var year = 1970;
            var month = 1;
            var day = 1;
            var hour = 0;
            var minute = 0;
            var second = 0;
            var fractionMillis = 0;
            var lastUnit = TimeUnit.Year;
            // separate any fractional part
            var split = s.trim().split(".");
            assert_1.default(split.length >= 1 && split.length <= 2, "Empty string or multiple dots.");
            // parse main part
            var isBasicFormat = (s.indexOf("-") === -1);
            if (isBasicFormat) {
                assert_1.default(split[0].match(/^((\d)+)|(\d\d\d\d\d\d\d\dT(\d)+)$/), "ISO string in basic notation may only contain numbers before the fractional part");
                // remove any "T" separator
                split[0] = split[0].replace("T", "");
                assert_1.default([4, 8, 10, 12, 14].indexOf(split[0].length) !== -1, "Padding or required components are missing. Note that YYYYMM is not valid per ISO 8601");
                if (split[0].length >= 4) {
                    year = parseInt(split[0].substr(0, 4), 10);
                    lastUnit = TimeUnit.Year;
                }
                if (split[0].length >= 8) {
                    month = parseInt(split[0].substr(4, 2), 10);
                    day = parseInt(split[0].substr(6, 2), 10); // note that YYYYMM format is disallowed so if month is present, day is too
                    lastUnit = TimeUnit.Day;
                }
                if (split[0].length >= 10) {
                    hour = parseInt(split[0].substr(8, 2), 10);
                    lastUnit = TimeUnit.Hour;
                }
                if (split[0].length >= 12) {
                    minute = parseInt(split[0].substr(10, 2), 10);
                    lastUnit = TimeUnit.Minute;
                }
                if (split[0].length >= 14) {
                    second = parseInt(split[0].substr(12, 2), 10);
                    lastUnit = TimeUnit.Second;
                }
            }
            else {
                assert_1.default(split[0].match(/^\d\d\d\d(-\d\d-\d\d((T)?\d\d(\:\d\d(:\d\d)?)?)?)?$/), "Invalid ISO string");
                var dateAndTime = [];
                if (s.indexOf("T") !== -1) {
                    dateAndTime = split[0].split("T");
                }
                else if (s.length > 10) {
                    dateAndTime = [split[0].substr(0, 10), split[0].substr(10)];
                }
                else {
                    dateAndTime = [split[0], ""];
                }
                assert_1.default([4, 10].indexOf(dateAndTime[0].length) !== -1, "Padding or required components are missing. Note that YYYYMM is not valid per ISO 8601");
                if (dateAndTime[0].length >= 4) {
                    year = parseInt(dateAndTime[0].substr(0, 4), 10);
                    lastUnit = TimeUnit.Year;
                }
                if (dateAndTime[0].length >= 10) {
                    month = parseInt(dateAndTime[0].substr(5, 2), 10);
                    day = parseInt(dateAndTime[0].substr(8, 2), 10); // note that YYYYMM format is disallowed so if month is present, day is too
                    lastUnit = TimeUnit.Day;
                }
                if (dateAndTime[1].length >= 2) {
                    hour = parseInt(dateAndTime[1].substr(0, 2), 10);
                    lastUnit = TimeUnit.Hour;
                }
                if (dateAndTime[1].length >= 5) {
                    minute = parseInt(dateAndTime[1].substr(3, 2), 10);
                    lastUnit = TimeUnit.Minute;
                }
                if (dateAndTime[1].length >= 8) {
                    second = parseInt(dateAndTime[1].substr(6, 2), 10);
                    lastUnit = TimeUnit.Second;
                }
            }
            // parse fractional part
            if (split.length > 1 && split[1].length > 0) {
                var fraction = parseFloat("0." + split[1]);
                switch (lastUnit) {
                    case TimeUnit.Year:
                        fractionMillis = daysInYear(year) * 86400000 * fraction;
                        break;
                    case TimeUnit.Day:
                        fractionMillis = 86400000 * fraction;
                        break;
                    case TimeUnit.Hour:
                        fractionMillis = 3600000 * fraction;
                        break;
                    case TimeUnit.Minute:
                        fractionMillis = 60000 * fraction;
                        break;
                    case TimeUnit.Second:
                        fractionMillis = 1000 * fraction;
                        break;
                }
            }
            // combine main and fractional part
            year = math.roundSym(year);
            month = math.roundSym(month);
            day = math.roundSym(day);
            hour = math.roundSym(hour);
            minute = math.roundSym(minute);
            second = math.roundSym(second);
            var unixMillis = timeToUnixNoLeapSecs({ year: year, month: month, day: day, hour: hour, minute: minute, second: second });
            unixMillis = math.roundSym(unixMillis + fractionMillis);
            return new TimeStruct(unixMillis);
        }
        catch (e) {
            throw new Error("Invalid ISO 8601 string: \"" + s + "\": " + e.message);
        }
    };
    Object.defineProperty(TimeStruct.prototype, "unixMillis", {
        get: function () {
            if (this._unixMillis === undefined) {
                this._unixMillis = timeToUnixNoLeapSecs(this._components);
            }
            return this._unixMillis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeStruct.prototype, "components", {
        get: function () {
            if (!this._components) {
                this._components = unixToTimeNoLeapSecs(this._unixMillis);
            }
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeStruct.prototype, "year", {
        get: function () {
            return this.components.year;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeStruct.prototype, "month", {
        get: function () {
            return this.components.month;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeStruct.prototype, "day", {
        get: function () {
            return this.components.day;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeStruct.prototype, "hour", {
        get: function () {
            return this.components.hour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeStruct.prototype, "minute", {
        get: function () {
            return this.components.minute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeStruct.prototype, "second", {
        get: function () {
            return this.components.second;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeStruct.prototype, "milli", {
        get: function () {
            return this.components.milli;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The day-of-year 0-365
     */
    TimeStruct.prototype.yearDay = function () {
        return dayOfYear(this.components.year, this.components.month, this.components.day);
    };
    TimeStruct.prototype.equals = function (other) {
        return this.valueOf() === other.valueOf();
    };
    TimeStruct.prototype.valueOf = function () {
        return this.unixMillis;
    };
    TimeStruct.prototype.clone = function () {
        if (this._components) {
            return new TimeStruct(this._components);
        }
        else {
            return new TimeStruct(this._unixMillis);
        }
    };
    /**
     * Validate a timestamp. Filters out non-existing values for all time components
     * @returns true iff the timestamp is valid
     */
    TimeStruct.prototype.validate = function () {
        if (this._components) {
            return this.components.month >= 1 && this.components.month <= 12
                && this.components.day >= 1 && this.components.day <= daysInMonth(this.components.year, this.components.month)
                && this.components.hour >= 0 && this.components.hour <= 23
                && this.components.minute >= 0 && this.components.minute <= 59
                && this.components.second >= 0 && this.components.second <= 59
                && this.components.milli >= 0 && this.components.milli <= 999;
        }
        else {
            return true;
        }
    };
    /**
     * ISO 8601 string YYYY-MM-DDThh:mm:ss.nnn
     */
    TimeStruct.prototype.toString = function () {
        return strings.padLeft(this.components.year.toString(10), 4, "0")
            + "-" + strings.padLeft(this.components.month.toString(10), 2, "0")
            + "-" + strings.padLeft(this.components.day.toString(10), 2, "0")
            + "T" + strings.padLeft(this.components.hour.toString(10), 2, "0")
            + ":" + strings.padLeft(this.components.minute.toString(10), 2, "0")
            + ":" + strings.padLeft(this.components.second.toString(10), 2, "0")
            + "." + strings.padLeft(this.components.milli.toString(10), 3, "0");
    };
    return TimeStruct;
}());
exports.TimeStruct = TimeStruct;
/**
 * Binary search
 * @param array Array to search
 * @param compare Function that should return < 0 if given element is less than searched element etc
 * @return {Number} The insertion index of the element to look for
 */
function binaryInsertionIndex(arr, compare) {
    var minIndex = 0;
    var maxIndex = arr.length - 1;
    var currentIndex;
    var currentElement;
    // no array / empty array
    if (!arr) {
        return 0;
    }
    if (arr.length === 0) {
        return 0;
    }
    // out of bounds
    if (compare(arr[0]) > 0) {
        return 0;
    }
    if (compare(arr[maxIndex]) < 0) {
        return maxIndex + 1;
    }
    // element in range
    while (minIndex <= maxIndex) {
        currentIndex = Math.floor((minIndex + maxIndex) / 2);
        currentElement = arr[currentIndex];
        if (compare(currentElement) < 0) {
            minIndex = currentIndex + 1;
        }
        else if (compare(currentElement) > 0) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }
    return maxIndex;
}
exports.binaryInsertionIndex = binaryInsertionIndex;

},{"./assert":1,"./javascript":7,"./math":9,"./strings":12}],3:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Date+time+timezone representation
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
var basics = require("./basics");
var basics_1 = require("./basics");
var duration_1 = require("./duration");
var format = require("./format");
var javascript_1 = require("./javascript");
var math = require("./math");
var parseFuncs = require("./parse");
var timesource_1 = require("./timesource");
var timezone_1 = require("./timezone");
var tz_database_1 = require("./tz-database");
/**
 * Current date+time in local time
 */
function nowLocal() {
    return DateTime.nowLocal();
}
exports.nowLocal = nowLocal;
/**
 * Current date+time in UTC time
 */
function nowUtc() {
    return DateTime.nowUtc();
}
exports.nowUtc = nowUtc;
/**
 * Current date+time in the given time zone
 * @param timeZone	The desired time zone (optional, defaults to UTC).
 */
function now(timeZone) {
    if (timeZone === void 0) { timeZone = timezone_1.TimeZone.utc(); }
    return DateTime.now(timeZone);
}
exports.now = now;
function convertToUtc(localTime, fromZone) {
    if (fromZone) {
        var offset = fromZone.offsetForZone(localTime);
        return new basics_1.TimeStruct(localTime.unixMillis - offset * 60000);
    }
    else {
        return localTime.clone();
    }
}
function convertFromUtc(utcTime, toZone) {
    /* istanbul ignore else */
    if (toZone) {
        var offset = toZone.offsetForUtc(utcTime);
        return toZone.normalizeZoneTime(new basics_1.TimeStruct(utcTime.unixMillis + offset * 60000));
    }
    else {
        return utcTime.clone();
    }
}
/**
 * DateTime class which is time zone-aware
 * and which can be mocked for testing purposes.
 */
var DateTime = /** @class */ (function () {
    /**
     * Constructor implementation, do not call
     */
    function DateTime(a1, a2, a3, h, m, s, ms, timeZone) {
        /**
         * Allow not using instanceof
         */
        this.kind = "DateTime";
        switch (typeof (a1)) {
            case "number":
                {
                    if (typeof a2 !== "number") {
                        assert_1.default(a3 === undefined && h === undefined && m === undefined
                            && s === undefined && ms === undefined && timeZone === undefined, "for unix timestamp datetime constructor, third through 8th argument must be undefined");
                        assert_1.default(a2 === undefined || a2 === null || isTimeZone(a2), "DateTime.DateTime(): second arg should be a TimeZone object.");
                        // unix timestamp constructor
                        this._zone = (typeof (a2) === "object" && isTimeZone(a2) ? a2 : undefined);
                        if (this._zone) {
                            this._zoneDate = this._zone.normalizeZoneTime(new basics_1.TimeStruct(math.roundSym(a1)));
                        }
                        else {
                            this._zoneDate = new basics_1.TimeStruct(math.roundSym(a1));
                        }
                    }
                    else {
                        // year month day constructor
                        assert_1.default(typeof (a2) === "number", "DateTime.DateTime(): Expect month to be a number.");
                        assert_1.default(typeof (a3) === "number", "DateTime.DateTime(): Expect day to be a number.");
                        assert_1.default(timeZone === undefined || timeZone === null || isTimeZone(timeZone), "DateTime.DateTime(): eighth arg should be a TimeZone object.");
                        var year = a1;
                        var month = a2;
                        var day = a3;
                        var hour = (typeof (h) === "number" ? h : 0);
                        var minute = (typeof (m) === "number" ? m : 0);
                        var second = (typeof (s) === "number" ? s : 0);
                        var milli = (typeof (ms) === "number" ? ms : 0);
                        year = math.roundSym(year);
                        month = math.roundSym(month);
                        day = math.roundSym(day);
                        hour = math.roundSym(hour);
                        minute = math.roundSym(minute);
                        second = math.roundSym(second);
                        milli = math.roundSym(milli);
                        var tm = new basics_1.TimeStruct({ year: year, month: month, day: day, hour: hour, minute: minute, second: second, milli: milli });
                        assert_1.default(tm.validate(), "invalid date: " + tm.toString());
                        this._zone = (typeof (timeZone) === "object" && isTimeZone(timeZone) ? timeZone : undefined);
                        // normalize local time (remove non-existing local time)
                        if (this._zone) {
                            this._zoneDate = this._zone.normalizeZoneTime(tm);
                        }
                        else {
                            this._zoneDate = tm;
                        }
                    }
                }
                break;
            case "string":
                {
                    if (typeof a2 === "string") {
                        assert_1.default(h === undefined && m === undefined
                            && s === undefined && ms === undefined && timeZone === undefined, "first two arguments are a string, therefore the fourth through 8th argument must be undefined");
                        assert_1.default(a3 === undefined || a3 === null || isTimeZone(a3), "DateTime.DateTime(): third arg should be a TimeZone object.");
                        // format string given
                        var dateString = a1;
                        var formatString = a2;
                        var zone = void 0;
                        if (typeof a3 === "object" && isTimeZone(a3)) {
                            zone = (a3);
                        }
                        var parsed = parseFuncs.parse(dateString, formatString, zone);
                        this._zoneDate = parsed.time;
                        this._zone = parsed.zone;
                    }
                    else {
                        assert_1.default(a3 === undefined && h === undefined && m === undefined
                            && s === undefined && ms === undefined && timeZone === undefined, "first arguments is a string and the second is not, therefore the third through 8th argument must be undefined");
                        assert_1.default(a2 === undefined || a2 === null || isTimeZone(a2), "DateTime.DateTime(): second arg should be a TimeZone object.");
                        var givenString = a1.trim();
                        var ss = DateTime._splitDateFromTimeZone(givenString);
                        assert_1.default(ss.length === 2, "Invalid date string given: \"" + a1 + "\"");
                        if (isTimeZone(a2)) {
                            this._zone = (a2);
                        }
                        else {
                            this._zone = (ss[1].trim() ? timezone_1.TimeZone.zone(ss[1]) : undefined);
                        }
                        // use our own ISO parsing because that it platform independent
                        // (free of Date quirks)
                        this._zoneDate = basics_1.TimeStruct.fromString(ss[0]);
                        if (this._zone) {
                            this._zoneDate = this._zone.normalizeZoneTime(this._zoneDate);
                        }
                    }
                }
                break;
            case "object":
                {
                    if (a1 instanceof Date) {
                        assert_1.default(h === undefined && m === undefined
                            && s === undefined && ms === undefined && timeZone === undefined, "first argument is a Date, therefore the fourth through 8th argument must be undefined");
                        assert_1.default(typeof (a2) === "number" && (a2 === javascript_1.DateFunctions.Get || a2 === javascript_1.DateFunctions.GetUTC), "DateTime.DateTime(): for a Date object a DateFunctions must be passed as second argument");
                        assert_1.default(a3 === undefined || a3 === null || isTimeZone(a3), "DateTime.DateTime(): third arg should be a TimeZone object.");
                        var d = (a1);
                        var dk = (a2);
                        this._zone = (a3 ? a3 : undefined);
                        this._zoneDate = basics_1.TimeStruct.fromDate(d, dk);
                        if (this._zone) {
                            this._zoneDate = this._zone.normalizeZoneTime(this._zoneDate);
                        }
                    }
                    else { // a1 instanceof TimeStruct
                        assert_1.default(a3 === undefined && h === undefined && m === undefined
                            && s === undefined && ms === undefined && timeZone === undefined, "first argument is a TimeStruct, therefore the third through 8th argument must be undefined");
                        assert_1.default(a2 === undefined || a2 === null || isTimeZone(a2), "expect a TimeZone as second argument");
                        this._zoneDate = a1.clone();
                        this._zone = (a2 ? a2 : undefined);
                    }
                }
                break;
            case "undefined":
                {
                    assert_1.default(a2 === undefined && a3 === undefined && h === undefined && m === undefined
                        && s === undefined && ms === undefined && timeZone === undefined, "first argument is undefined, therefore the rest must also be undefined");
                    // nothing given, make local datetime
                    this._zone = timezone_1.TimeZone.local();
                    this._utcDate = basics_1.TimeStruct.fromDate(DateTime.timeSource.now(), javascript_1.DateFunctions.GetUTC);
                }
                break;
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("DateTime.DateTime(): unexpected first argument type.");
                }
        }
    }
    Object.defineProperty(DateTime.prototype, "utcDate", {
        get: function () {
            if (!this._utcDate) {
                this._utcDate = convertToUtc(this._zoneDate, this._zone);
            }
            return this._utcDate;
        },
        set: function (value) {
            this._utcDate = value;
            this._zoneDate = undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "zoneDate", {
        get: function () {
            if (!this._zoneDate) {
                this._zoneDate = convertFromUtc(this._utcDate, this._zone);
            }
            return this._zoneDate;
        },
        set: function (value) {
            this._zoneDate = value;
            this._utcDate = undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Current date+time in local time
     */
    DateTime.nowLocal = function () {
        var n = DateTime.timeSource.now();
        return new DateTime(n, javascript_1.DateFunctions.Get, timezone_1.TimeZone.local());
    };
    /**
     * Current date+time in UTC time
     */
    DateTime.nowUtc = function () {
        return new DateTime(DateTime.timeSource.now(), javascript_1.DateFunctions.GetUTC, timezone_1.TimeZone.utc());
    };
    /**
     * Current date+time in the given time zone
     * @param timeZone	The desired time zone (optional, defaults to UTC).
     */
    DateTime.now = function (timeZone) {
        if (timeZone === void 0) { timeZone = timezone_1.TimeZone.utc(); }
        return new DateTime(DateTime.timeSource.now(), javascript_1.DateFunctions.GetUTC, timezone_1.TimeZone.utc()).toZone(timeZone);
    };
    /**
     * Create a DateTime from a Lotus 123 / Microsoft Excel date-time value
     * i.e. a double representing days since 1-1-1900 where 1900 is incorrectly seen as leap year
     * Does not work for dates < 1900
     * @param n excel date/time number
     * @param timeZone Time zone to assume that the excel value is in
     * @returns a DateTime
     */
    DateTime.fromExcel = function (n, timeZone) {
        assert_1.default(typeof n === "number", "fromExcel(): first parameter must be a number");
        assert_1.default(!isNaN(n), "fromExcel(): first parameter must not be NaN");
        assert_1.default(isFinite(n), "fromExcel(): first parameter must not be NaN");
        var unixTimestamp = Math.round((n - 25569) * 24 * 60 * 60 * 1000);
        return new DateTime(unixTimestamp, timeZone);
    };
    /**
     * Check whether a given date exists in the given time zone.
     * E.g. 2015-02-29 returns false (not a leap year)
     * and 2015-03-29T02:30:00 returns false (daylight saving time missing hour)
     * and 2015-04-31 returns false (April has 30 days).
     * By default, pre-1970 dates also return false since the time zone database does not contain accurate info
     * before that. You can change that with the allowPre1970 flag.
     *
     * @param allowPre1970 (optional, default false): return true for pre-1970 dates
     */
    DateTime.exists = function (year, month, day, hour, minute, second, millisecond, zone, allowPre1970) {
        if (month === void 0) { month = 1; }
        if (day === void 0) { day = 1; }
        if (hour === void 0) { hour = 0; }
        if (minute === void 0) { minute = 0; }
        if (second === void 0) { second = 0; }
        if (millisecond === void 0) { millisecond = 0; }
        if (allowPre1970 === void 0) { allowPre1970 = false; }
        if (!isFinite(year) || !isFinite(month) || !isFinite(day) || !isFinite(hour) || !isFinite(minute) || !isFinite(second)
            || !isFinite(millisecond)) {
            return false;
        }
        if (!allowPre1970 && year < 1970) {
            return false;
        }
        try {
            var dt = new DateTime(year, month, day, hour, minute, second, millisecond, zone);
            return (year === dt.year() && month === dt.month() && day === dt.day()
                && hour === dt.hour() && minute === dt.minute() && second === dt.second() && millisecond === dt.millisecond());
        }
        catch (e) {
            return false;
        }
    };
    /**
     * @return a copy of this object
     */
    DateTime.prototype.clone = function () {
        return new DateTime(this.zoneDate, this._zone);
    };
    /**
     * @return The time zone that the date is in. May be undefined for unaware dates.
     */
    DateTime.prototype.zone = function () {
        return this._zone;
    };
    /**
     * Zone name abbreviation at this time
     * @param dstDependent (default true) set to false for a DST-agnostic abbreviation
     * @return The abbreviation
     */
    DateTime.prototype.zoneAbbreviation = function (dstDependent) {
        if (dstDependent === void 0) { dstDependent = true; }
        if (this._zone) {
            return this._zone.abbreviationForUtc(this.utcDate, dstDependent);
        }
        else {
            return "";
        }
    };
    /**
     * @return the offset including DST w.r.t. UTC in minutes. Returns 0 for unaware dates and for UTC dates.
     */
    DateTime.prototype.offset = function () {
        return Math.round((this.zoneDate.unixMillis - this.utcDate.unixMillis) / 60000);
    };
    /**
     * @return the offset including DST w.r.t. UTC as a Duration.
     */
    DateTime.prototype.offsetDuration = function () {
        return duration_1.Duration.milliseconds(Math.round(this.zoneDate.unixMillis - this.utcDate.unixMillis));
    };
    /**
     * @return the standard offset WITHOUT DST w.r.t. UTC as a Duration.
     */
    DateTime.prototype.standardOffsetDuration = function () {
        if (this._zone) {
            return duration_1.Duration.minutes(this._zone.standardOffsetForUtc(this.utcDate));
        }
        return duration_1.Duration.minutes(0);
    };
    /**
     * @return The full year e.g. 2014
     */
    DateTime.prototype.year = function () {
        return this.zoneDate.components.year;
    };
    /**
     * @return The month 1-12 (note this deviates from JavaScript Date)
     */
    DateTime.prototype.month = function () {
        return this.zoneDate.components.month;
    };
    /**
     * @return The day of the month 1-31
     */
    DateTime.prototype.day = function () {
        return this.zoneDate.components.day;
    };
    /**
     * @return The hour 0-23
     */
    DateTime.prototype.hour = function () {
        return this.zoneDate.components.hour;
    };
    /**
     * @return the minutes 0-59
     */
    DateTime.prototype.minute = function () {
        return this.zoneDate.components.minute;
    };
    /**
     * @return the seconds 0-59
     */
    DateTime.prototype.second = function () {
        return this.zoneDate.components.second;
    };
    /**
     * @return the milliseconds 0-999
     */
    DateTime.prototype.millisecond = function () {
        return this.zoneDate.components.milli;
    };
    /**
     * @return the day-of-week (the enum values correspond to JavaScript
     * week day numbers)
     */
    DateTime.prototype.weekDay = function () {
        return basics.weekDayNoLeapSecs(this.zoneDate.unixMillis);
    };
    /**
     * Returns the day number within the year: Jan 1st has number 0,
     * Jan 2nd has number 1 etc.
     *
     * @return the day-of-year [0-366]
     */
    DateTime.prototype.dayOfYear = function () {
        return this.zoneDate.yearDay();
    };
    /**
     * The ISO 8601 week number. Week 1 is the week
     * that has January 4th in it, and it starts on Monday.
     * See https://en.wikipedia.org/wiki/ISO_week_date
     *
     * @return Week number [1-53]
     */
    DateTime.prototype.weekNumber = function () {
        return basics.weekNumber(this.year(), this.month(), this.day());
    };
    /**
     * The week of this month. There is no official standard for this,
     * but we assume the same rules for the weekNumber (i.e.
     * week 1 is the week that has the 4th day of the month in it)
     *
     * @return Week number [1-5]
     */
    DateTime.prototype.weekOfMonth = function () {
        return basics.weekOfMonth(this.year(), this.month(), this.day());
    };
    /**
     * Returns the number of seconds that have passed on the current day
     * Does not consider leap seconds
     *
     * @return seconds [0-86399]
     */
    DateTime.prototype.secondOfDay = function () {
        return basics.secondOfDay(this.hour(), this.minute(), this.second());
    };
    /**
     * @return Milliseconds since 1970-01-01T00:00:00.000Z
     */
    DateTime.prototype.unixUtcMillis = function () {
        return this.utcDate.unixMillis;
    };
    /**
     * @return The full year e.g. 2014
     */
    DateTime.prototype.utcYear = function () {
        return this.utcDate.components.year;
    };
    /**
     * @return The UTC month 1-12 (note this deviates from JavaScript Date)
     */
    DateTime.prototype.utcMonth = function () {
        return this.utcDate.components.month;
    };
    /**
     * @return The UTC day of the month 1-31
     */
    DateTime.prototype.utcDay = function () {
        return this.utcDate.components.day;
    };
    /**
     * @return The UTC hour 0-23
     */
    DateTime.prototype.utcHour = function () {
        return this.utcDate.components.hour;
    };
    /**
     * @return The UTC minutes 0-59
     */
    DateTime.prototype.utcMinute = function () {
        return this.utcDate.components.minute;
    };
    /**
     * @return The UTC seconds 0-59
     */
    DateTime.prototype.utcSecond = function () {
        return this.utcDate.components.second;
    };
    /**
     * Returns the UTC day number within the year: Jan 1st has number 0,
     * Jan 2nd has number 1 etc.
     *
     * @return the day-of-year [0-366]
     */
    DateTime.prototype.utcDayOfYear = function () {
        return basics.dayOfYear(this.utcYear(), this.utcMonth(), this.utcDay());
    };
    /**
     * @return The UTC milliseconds 0-999
     */
    DateTime.prototype.utcMillisecond = function () {
        return this.utcDate.components.milli;
    };
    /**
     * @return the UTC day-of-week (the enum values correspond to JavaScript
     * week day numbers)
     */
    DateTime.prototype.utcWeekDay = function () {
        return basics.weekDayNoLeapSecs(this.utcDate.unixMillis);
    };
    /**
     * The ISO 8601 UTC week number. Week 1 is the week
     * that has January 4th in it, and it starts on Monday.
     * See https://en.wikipedia.org/wiki/ISO_week_date
     *
     * @return Week number [1-53]
     */
    DateTime.prototype.utcWeekNumber = function () {
        return basics.weekNumber(this.utcYear(), this.utcMonth(), this.utcDay());
    };
    /**
     * The week of this month. There is no official standard for this,
     * but we assume the same rules for the weekNumber (i.e.
     * week 1 is the week that has the 4th day of the month in it)
     *
     * @return Week number [1-5]
     */
    DateTime.prototype.utcWeekOfMonth = function () {
        return basics.weekOfMonth(this.utcYear(), this.utcMonth(), this.utcDay());
    };
    /**
     * Returns the number of seconds that have passed on the current day
     * Does not consider leap seconds
     *
     * @return seconds [0-86399]
     */
    DateTime.prototype.utcSecondOfDay = function () {
        return basics.secondOfDay(this.utcHour(), this.utcMinute(), this.utcSecond());
    };
    /**
     * Returns a new DateTime which is the date+time reinterpreted as
     * in the new zone. So e.g. 08:00 America/Chicago can be set to 08:00 Europe/Brussels.
     * No conversion is done, the value is just assumed to be in a different zone.
     * Works for naive and aware dates. The new zone may be null.
     *
     * @param zone The new time zone
     * @return A new DateTime with the original timestamp and the new zone.
     */
    DateTime.prototype.withZone = function (zone) {
        return new DateTime(this.year(), this.month(), this.day(), this.hour(), this.minute(), this.second(), this.millisecond(), zone);
    };
    /**
     * Convert this date to the given time zone (in-place).
     * Throws if this date does not have a time zone.
     * @return this (for chaining)
     */
    DateTime.prototype.convert = function (zone) {
        if (zone) {
            if (!this._zone) { // if-statement satisfies the compiler
                assert_1.default(this._zone, "DateTime.toZone(): Cannot convert unaware date to an aware date");
            }
            else if (this._zone.equals(zone)) {
                this._zone = zone; // still assign, because zones may be equal but not identical (UTC/GMT/+00)
            }
            else {
                if (!this._utcDate) {
                    this._utcDate = convertToUtc(this._zoneDate, this._zone); // cause zone -> utc conversion
                }
                this._zone = zone;
                this._zoneDate = undefined;
            }
        }
        else {
            if (!this._zone) {
                return this;
            }
            if (!this._zoneDate) {
                this._zoneDate = convertFromUtc(this._utcDate, this._zone);
            }
            this._zone = undefined;
            this._utcDate = undefined; // cause later zone -> utc conversion
        }
        return this;
    };
    /**
     * Returns this date converted to the given time zone.
     * Unaware dates can only be converted to unaware dates (clone)
     * Converting an unaware date to an aware date throws an exception. Use the constructor
     * if you really need to do that.
     *
     * @param zone	The new time zone. This may be null or undefined to create unaware date.
     * @return The converted date
     */
    DateTime.prototype.toZone = function (zone) {
        if (zone) {
            assert_1.default(this._zone, "DateTime.toZone(): Cannot convert unaware date to an aware date");
            var result = new DateTime();
            result.utcDate = this.utcDate;
            result._zone = zone;
            return result;
        }
        else {
            return new DateTime(this.zoneDate, undefined);
        }
    };
    /**
     * Convert to JavaScript date with the zone time in the getX() methods.
     * Unless the timezone is local, the Date.getUTCX() methods will NOT be correct.
     * This is because Date calculates getUTCX() from getX() applying local time zone.
     */
    DateTime.prototype.toDate = function () {
        return new Date(this.year(), this.month() - 1, this.day(), this.hour(), this.minute(), this.second(), this.millisecond());
    };
    /**
     * Create an Excel timestamp for this datetime converted to the given zone.
     * Does not work for dates < 1900
     * @param timeZone Optional. Zone to convert to, default the zone the datetime is already in.
     * @return an Excel date/time number i.e. days since 1-1-1900 where 1900 is incorrectly seen as leap year
     */
    DateTime.prototype.toExcel = function (timeZone) {
        var dt = this;
        if (timeZone && (!this._zone || !timeZone.equals(this._zone))) {
            dt = this.toZone(timeZone);
        }
        var offsetMillis = dt.offset() * 60 * 1000;
        var unixTimestamp = dt.unixUtcMillis();
        return this._unixTimeStampToExcel(unixTimestamp + offsetMillis);
    };
    /**
     * Create an Excel timestamp for this datetime converted to UTC
     * Does not work for dates < 1900
     * @return an Excel date/time number i.e. days since 1-1-1900 where 1900 is incorrectly seen as leap year
     */
    DateTime.prototype.toUtcExcel = function () {
        var unixTimestamp = this.unixUtcMillis();
        return this._unixTimeStampToExcel(unixTimestamp);
    };
    DateTime.prototype._unixTimeStampToExcel = function (n) {
        var result = ((n) / (24 * 60 * 60 * 1000)) + 25569;
        // round to nearest millisecond
        var msecs = result / (1 / 86400000);
        return Math.round(msecs) * (1 / 86400000);
    };
    /**
     * Implementation.
     */
    DateTime.prototype.add = function (a1, unit) {
        var amount;
        var u;
        if (typeof (a1) === "object") {
            var duration = (a1);
            amount = duration.amount();
            u = duration.unit();
        }
        else {
            assert_1.default(typeof (a1) === "number", "expect number as first argument");
            assert_1.default(typeof (unit) === "number", "expect number as second argument");
            amount = (a1);
            u = unit;
        }
        var utcTm = this._addToTimeStruct(this.utcDate, amount, u);
        return new DateTime(utcTm, timezone_1.TimeZone.utc()).toZone(this._zone);
    };
    DateTime.prototype.addLocal = function (a1, unit) {
        var amount;
        var u;
        if (typeof (a1) === "object") {
            var duration = (a1);
            amount = duration.amount();
            u = duration.unit();
        }
        else {
            assert_1.default(typeof (a1) === "number", "expect number as first argument");
            assert_1.default(typeof (unit) === "number", "expect number as second argument");
            amount = (a1);
            u = unit;
        }
        var localTm = this._addToTimeStruct(this.zoneDate, amount, u);
        if (this._zone) {
            var direction = (amount >= 0 ? tz_database_1.NormalizeOption.Up : tz_database_1.NormalizeOption.Down);
            var normalized = this._zone.normalizeZoneTime(localTm, direction);
            return new DateTime(normalized, this._zone);
        }
        else {
            return new DateTime(localTm, undefined);
        }
    };
    /**
     * Add an amount of time to the given time struct. Note: does not normalize.
     * Keeps lower unit fields the same where possible, clamps day to end-of-month if
     * necessary.
     */
    DateTime.prototype._addToTimeStruct = function (tm, amount, unit) {
        var year;
        var month;
        var day;
        var hour;
        var minute;
        var second;
        var milli;
        switch (unit) {
            case basics_1.TimeUnit.Millisecond:
                return new basics_1.TimeStruct(math.roundSym(tm.unixMillis + amount));
            case basics_1.TimeUnit.Second:
                return new basics_1.TimeStruct(math.roundSym(tm.unixMillis + amount * 1000));
            case basics_1.TimeUnit.Minute:
                // todo more intelligent approach needed when implementing leap seconds
                return new basics_1.TimeStruct(math.roundSym(tm.unixMillis + amount * 60000));
            case basics_1.TimeUnit.Hour:
                // todo more intelligent approach needed when implementing leap seconds
                return new basics_1.TimeStruct(math.roundSym(tm.unixMillis + amount * 3600000));
            case basics_1.TimeUnit.Day:
                // todo more intelligent approach needed when implementing leap seconds
                return new basics_1.TimeStruct(math.roundSym(tm.unixMillis + amount * 86400000));
            case basics_1.TimeUnit.Week:
                // todo more intelligent approach needed when implementing leap seconds
                return new basics_1.TimeStruct(math.roundSym(tm.unixMillis + amount * 7 * 86400000));
            case basics_1.TimeUnit.Month: {
                assert_1.default(math.isInt(amount), "Cannot add/sub a non-integer amount of months");
                // keep the day-of-month the same (clamp to end-of-month)
                if (amount >= 0) {
                    year = tm.components.year + Math.ceil((amount - (12 - tm.components.month)) / 12);
                    month = 1 + math.positiveModulo((tm.components.month - 1 + Math.floor(amount)), 12);
                }
                else {
                    year = tm.components.year + Math.floor((amount + (tm.components.month - 1)) / 12);
                    month = 1 + math.positiveModulo((tm.components.month - 1 + Math.ceil(amount)), 12);
                }
                day = Math.min(tm.components.day, basics.daysInMonth(year, month));
                hour = tm.components.hour;
                minute = tm.components.minute;
                second = tm.components.second;
                milli = tm.components.milli;
                return new basics_1.TimeStruct({ year: year, month: month, day: day, hour: hour, minute: minute, second: second, milli: milli });
            }
            case basics_1.TimeUnit.Year: {
                assert_1.default(math.isInt(amount), "Cannot add/sub a non-integer amount of years");
                year = tm.components.year + amount;
                month = tm.components.month;
                day = Math.min(tm.components.day, basics.daysInMonth(year, month));
                hour = tm.components.hour;
                minute = tm.components.minute;
                second = tm.components.second;
                milli = tm.components.milli;
                return new basics_1.TimeStruct({ year: year, month: month, day: day, hour: hour, minute: minute, second: second, milli: milli });
            }
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("Unknown period unit.");
                }
        }
    };
    DateTime.prototype.sub = function (a1, unit) {
        if (typeof a1 === "number") {
            assert_1.default(typeof unit === "number", "expect number as second argument");
            var amount = a1;
            return this.add(-1 * amount, unit);
        }
        else {
            var duration = a1;
            return this.add(duration.multiply(-1));
        }
    };
    DateTime.prototype.subLocal = function (a1, unit) {
        if (typeof a1 === "object") {
            return this.addLocal(a1.multiply(-1));
        }
        else {
            return this.addLocal(-1 * a1, unit);
        }
    };
    /**
     * Time difference between two DateTimes
     * @return this - other
     */
    DateTime.prototype.diff = function (other) {
        return new duration_1.Duration(this.utcDate.unixMillis - other.utcDate.unixMillis);
    };
    /**
     * Chops off the time part, yields the same date at 00:00:00.000
     * @return a new DateTime
     */
    DateTime.prototype.startOfDay = function () {
        return new DateTime(this.year(), this.month(), this.day(), 0, 0, 0, 0, this.zone());
    };
    /**
     * Returns the first day of the month at 00:00:00
     * @return a new DateTime
     */
    DateTime.prototype.startOfMonth = function () {
        return new DateTime(this.year(), this.month(), 1, 0, 0, 0, 0, this.zone());
    };
    /**
     * Returns the first day of the year at 00:00:00
     * @return a new DateTime
     */
    DateTime.prototype.startOfYear = function () {
        return new DateTime(this.year(), 1, 1, 0, 0, 0, 0, this.zone());
    };
    /**
     * @return True iff (this < other)
     */
    DateTime.prototype.lessThan = function (other) {
        return this.utcDate.unixMillis < other.utcDate.unixMillis;
    };
    /**
     * @return True iff (this <= other)
     */
    DateTime.prototype.lessEqual = function (other) {
        return this.utcDate.unixMillis <= other.utcDate.unixMillis;
    };
    /**
     * @return True iff this and other represent the same moment in time in UTC
     */
    DateTime.prototype.equals = function (other) {
        return this.utcDate.equals(other.utcDate);
    };
    /**
     * @return True iff this and other represent the same time and the same zone
     */
    DateTime.prototype.identical = function (other) {
        return !!(this.zoneDate.equals(other.zoneDate)
            && (!this._zone) === (!other._zone)
            && ((!this._zone && !other._zone) || (this._zone && other._zone && this._zone.identical(other._zone))));
    };
    /**
     * @return True iff this > other
     */
    DateTime.prototype.greaterThan = function (other) {
        return this.utcDate.unixMillis > other.utcDate.unixMillis;
    };
    /**
     * @return True iff this >= other
     */
    DateTime.prototype.greaterEqual = function (other) {
        return this.utcDate.unixMillis >= other.utcDate.unixMillis;
    };
    /**
     * @return The minimum of this and other
     */
    DateTime.prototype.min = function (other) {
        if (this.lessThan(other)) {
            return this.clone();
        }
        return other.clone();
    };
    /**
     * @return The maximum of this and other
     */
    DateTime.prototype.max = function (other) {
        if (this.greaterThan(other)) {
            return this.clone();
        }
        return other.clone();
    };
    /**
     * Proper ISO 8601 format string with any IANA zone converted to ISO offset
     * E.g. "2014-01-01T23:15:33+01:00" for Europe/Amsterdam
     * Unaware dates have no zone information at the end.
     */
    DateTime.prototype.toIsoString = function () {
        var s = this.zoneDate.toString();
        if (this._zone) {
            return s + timezone_1.TimeZone.offsetToString(this.offset()); // convert IANA name to offset
        }
        else {
            return s; // no zone present
        }
    };
    /**
     * Convert to UTC and then return ISO string ending in 'Z'. This is equivalent to Date#toISOString()
     * e.g. "2014-01-01T23:15:33 Europe/Amsterdam" becomes "2014-01-01T22:15:33Z".
     * Unaware dates are assumed to be in UTC
     */
    DateTime.prototype.toUtcIsoString = function () {
        if (this._zone) {
            return this.toZone(timezone_1.TimeZone.utc()).format("yyyy-MM-ddTHH:mm:ss.SSSZZZZZ");
        }
        else {
            return this.withZone(timezone_1.TimeZone.utc()).format("yyyy-MM-ddTHH:mm:ss.SSSZZZZZ");
        }
    };
    /**
     * Return a string representation of the DateTime according to the
     * specified format. See LDML.md for supported formats.
     *
     * @param formatString The format specification (e.g. "dd/MM/yyyy HH:mm:ss")
     * @param locale Optional, non-english format month names etc.
     * @return The string representation of this DateTime
     */
    DateTime.prototype.format = function (formatString, locale) {
        return format.format(this.zoneDate, this.utcDate, this._zone, formatString, locale);
    };
    /**
     * Parse a date in a given format
     * @param s the string to parse
     * @param format the format the string is in. See LDML.md for supported formats.
     * @param zone Optional, the zone to add (if no zone is given in the string)
     * @param locale Optional, different settings for constants like 'AM' etc
     * @param allowTrailing Allow trailing characters in the source string
     */
    DateTime.parse = function (s, format, zone, locale, allowTrailing) {
        var parsed = parseFuncs.parse(s, format, zone, allowTrailing || false, locale);
        return new DateTime(parsed.time, parsed.zone);
    };
    /**
     * Modified ISO 8601 format string with IANA name if applicable.
     * E.g. "2014-01-01T23:15:33.000 Europe/Amsterdam"
     */
    DateTime.prototype.toString = function () {
        var s = this.zoneDate.toString();
        if (this._zone) {
            if (this._zone.kind() !== timezone_1.TimeZoneKind.Offset) {
                return s + " " + this._zone.toString(); // separate IANA name or "localtime" with a space
            }
            else {
                return s + this._zone.toString(); // do not separate ISO zone
            }
        }
        else {
            return s; // no zone present
        }
    };
    /**
     * The valueOf() method returns the primitive value of the specified object.
     */
    DateTime.prototype.valueOf = function () {
        return this.unixUtcMillis();
    };
    /**
     * Modified ISO 8601 format string in UTC without time zone info
     */
    DateTime.prototype.toUtcString = function () {
        return this.utcDate.toString();
    };
    /**
     * Split a combined ISO datetime and timezone into datetime and timezone
     */
    DateTime._splitDateFromTimeZone = function (s) {
        var trimmed = s.trim();
        var result = ["", ""];
        var index = trimmed.lastIndexOf("without DST");
        if (index > -1) {
            var result_1 = DateTime._splitDateFromTimeZone(s.slice(0, index - 1));
            result_1[1] += " without DST";
            return result_1;
        }
        index = trimmed.lastIndexOf(" ");
        if (index > -1) {
            result[0] = trimmed.substr(0, index);
            result[1] = trimmed.substr(index + 1);
            return result;
        }
        index = trimmed.lastIndexOf("Z");
        if (index > -1) {
            result[0] = trimmed.substr(0, index);
            result[1] = trimmed.substr(index, 1);
            return result;
        }
        index = trimmed.lastIndexOf("+");
        if (index > -1) {
            result[0] = trimmed.substr(0, index);
            result[1] = trimmed.substr(index);
            return result;
        }
        index = trimmed.lastIndexOf("-");
        if (index < 8) {
            index = -1; // any "-" we found was a date separator
        }
        if (index > -1) {
            result[0] = trimmed.substr(0, index);
            result[1] = trimmed.substr(index);
            return result;
        }
        result[0] = trimmed;
        return result;
    };
    /**
     * Actual time source in use. Setting this property allows to
     * fake time in tests. DateTime.nowLocal() and DateTime.nowUtc()
     * use this property for obtaining the current time.
     */
    DateTime.timeSource = new timesource_1.RealTimeSource();
    return DateTime;
}());
exports.DateTime = DateTime;
/**
 * Checks whether `a` is similar to a TimeZone without using the instanceof operator.
 * It checks for the availability of the functions used in the DateTime implementation
 * @param a the object to check
 * @returns a is TimeZone-like
 */
function isTimeZone(a) {
    if (a && typeof a === "object") {
        if (typeof a.normalizeZoneTime === "function"
            && typeof a.abbreviationForUtc === "function"
            && typeof a.standardOffsetForUtc === "function"
            && typeof a.identical === "function"
            && typeof a.equals === "function"
            && typeof a.kind === "function"
            && typeof a.clone === "function") {
            return true;
        }
    }
    return false;
}
/**
 * Checks if a given object is of type DateTime. Note that it does not work for sub classes. However, use this to be robust
 * against different versions of the library in one process instead of instanceof
 * @param value Value to check
 * @throws nothing
 */
function isDateTime(value) {
    return typeof value === "object" && value !== null && value.kind === "DateTime";
}
exports.isDateTime = isDateTime;

},{"./assert":1,"./basics":2,"./duration":4,"./format":5,"./javascript":7,"./math":9,"./parse":10,"./timesource":13,"./timezone":14,"./tz-database":16}],4:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Time duration
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
var basics_1 = require("./basics");
var basics = require("./basics");
var strings = require("./strings");
/**
 * Construct a time duration
 * @param n	Number of years (may be fractional or negative)
 * @return A duration of n years
 */
function years(n) {
    return Duration.years(n);
}
exports.years = years;
/**
 * Construct a time duration
 * @param n	Number of months (may be fractional or negative)
 * @return A duration of n months
 */
function months(n) {
    return Duration.months(n);
}
exports.months = months;
/**
 * Construct a time duration
 * @param n	Number of days (may be fractional or negative)
 * @return A duration of n days
 */
function days(n) {
    return Duration.days(n);
}
exports.days = days;
/**
 * Construct a time duration
 * @param n	Number of hours (may be fractional or negative)
 * @return A duration of n hours
 */
function hours(n) {
    return Duration.hours(n);
}
exports.hours = hours;
/**
 * Construct a time duration
 * @param n	Number of minutes (may be fractional or negative)
 * @return A duration of n minutes
 */
function minutes(n) {
    return Duration.minutes(n);
}
exports.minutes = minutes;
/**
 * Construct a time duration
 * @param n	Number of seconds (may be fractional or negative)
 * @return A duration of n seconds
 */
function seconds(n) {
    return Duration.seconds(n);
}
exports.seconds = seconds;
/**
 * Construct a time duration
 * @param n	Number of milliseconds (may be fractional or negative)
 * @return A duration of n milliseconds
 */
function milliseconds(n) {
    return Duration.milliseconds(n);
}
exports.milliseconds = milliseconds;
/**
 * Time duration which is represented as an amount and a unit e.g.
 * '1 Month' or '166 Seconds'. The unit is preserved through calculations.
 *
 * It has two sets of getter functions:
 * - second(), minute(), hour() etc, singular form: these can be used to create string representations.
 *   These return a part of your string representation. E.g. for 2500 milliseconds, the millisecond() part would be 500
 * - seconds(), minutes(), hours() etc, plural form: these return the total amount represented in the corresponding unit.
 */
var Duration = /** @class */ (function () {
    /**
     * Constructor implementation
     */
    function Duration(i1, unit) {
        /**
         * Allow not using instanceof
         */
        this.kind = "Duration";
        if (typeof (i1) === "number") {
            // amount+unit constructor
            var amount = i1;
            this._amount = amount;
            this._unit = (typeof unit === "number" ? unit : basics_1.TimeUnit.Millisecond);
        }
        else if (typeof (i1) === "string") {
            // string constructor
            this._fromString(i1);
        }
        else {
            // default constructor
            this._amount = 0;
            this._unit = basics_1.TimeUnit.Millisecond;
        }
    }
    /**
     * Construct a time duration
     * @param n	Number of years (may be fractional or negative)
     * @return A duration of n years
     */
    Duration.years = function (n) {
        return new Duration(n, basics_1.TimeUnit.Year);
    };
    /**
     * Construct a time duration
     * @param n	Number of months (may be fractional or negative)
     * @return A duration of n months
     */
    Duration.months = function (n) {
        return new Duration(n, basics_1.TimeUnit.Month);
    };
    /**
     * Construct a time duration
     * @param n	Number of days (may be fractional or negative)
     * @return A duration of n days
     */
    Duration.days = function (n) {
        return new Duration(n, basics_1.TimeUnit.Day);
    };
    /**
     * Construct a time duration
     * @param n	Number of hours (may be fractional or negative)
     * @return A duration of n hours
     */
    Duration.hours = function (n) {
        return new Duration(n, basics_1.TimeUnit.Hour);
    };
    /**
     * Construct a time duration
     * @param n	Number of minutes (may be fractional or negative)
     * @return A duration of n minutes
     */
    Duration.minutes = function (n) {
        return new Duration(n, basics_1.TimeUnit.Minute);
    };
    /**
     * Construct a time duration
     * @param n	Number of seconds (may be fractional or negative)
     * @return A duration of n seconds
     */
    Duration.seconds = function (n) {
        return new Duration(n, basics_1.TimeUnit.Second);
    };
    /**
     * Construct a time duration
     * @param n	Number of milliseconds (may be fractional or negative)
     * @return A duration of n milliseconds
     */
    Duration.milliseconds = function (n) {
        return new Duration(n, basics_1.TimeUnit.Millisecond);
    };
    /**
     * @return another instance of Duration with the same value.
     */
    Duration.prototype.clone = function () {
        return new Duration(this._amount, this._unit);
    };
    /**
     * Returns this duration expressed in different unit (positive or negative, fractional).
     * This is precise for Year <-> Month and for time-to-time conversion (i.e. Hour-or-less to Hour-or-less).
     * It is approximate for any other conversion
     */
    Duration.prototype.as = function (unit) {
        if (this._unit === unit) {
            return this._amount;
        }
        else if (this._unit >= basics_1.TimeUnit.Month && unit >= basics_1.TimeUnit.Month) {
            var thisMonths = (this._unit === basics_1.TimeUnit.Year ? 12 : 1);
            var reqMonths = (unit === basics_1.TimeUnit.Year ? 12 : 1);
            return this._amount * thisMonths / reqMonths;
        }
        else {
            var thisMsec = basics.timeUnitToMilliseconds(this._unit);
            var reqMsec = basics.timeUnitToMilliseconds(unit);
            return this._amount * thisMsec / reqMsec;
        }
    };
    /**
     * Convert this duration to a Duration in another unit. You always get a clone even if you specify
     * the same unit.
     * This is precise for Year <-> Month and for time-to-time conversion (i.e. Hour-or-less to Hour-or-less).
     * It is approximate for any other conversion
     */
    Duration.prototype.convert = function (unit) {
        return new Duration(this.as(unit), unit);
    };
    /**
     * The entire duration in milliseconds (negative or positive)
     * For Day/Month/Year durations, this is approximate!
     */
    Duration.prototype.milliseconds = function () {
        return this.as(basics_1.TimeUnit.Millisecond);
    };
    /**
     * The millisecond part of the duration (always positive)
     * For Day/Month/Year durations, this is approximate!
     * @return e.g. 400 for a -01:02:03.400 duration
     */
    Duration.prototype.millisecond = function () {
        return this._part(basics_1.TimeUnit.Millisecond);
    };
    /**
     * The entire duration in seconds (negative or positive, fractional)
     * For Day/Month/Year durations, this is approximate!
     * @return e.g. 1.5 for a 1500 milliseconds duration
     */
    Duration.prototype.seconds = function () {
        return this.as(basics_1.TimeUnit.Second);
    };
    /**
     * The second part of the duration (always positive)
     * For Day/Month/Year durations, this is approximate!
     * @return e.g. 3 for a -01:02:03.400 duration
     */
    Duration.prototype.second = function () {
        return this._part(basics_1.TimeUnit.Second);
    };
    /**
     * The entire duration in minutes (negative or positive, fractional)
     * For Day/Month/Year durations, this is approximate!
     * @return e.g. 1.5 for a 90000 milliseconds duration
     */
    Duration.prototype.minutes = function () {
        return this.as(basics_1.TimeUnit.Minute);
    };
    /**
     * The minute part of the duration (always positive)
     * For Day/Month/Year durations, this is approximate!
     * @return e.g. 2 for a -01:02:03.400 duration
     */
    Duration.prototype.minute = function () {
        return this._part(basics_1.TimeUnit.Minute);
    };
    /**
     * The entire duration in hours (negative or positive, fractional)
     * For Day/Month/Year durations, this is approximate!
     * @return e.g. 1.5 for a 5400000 milliseconds duration
     */
    Duration.prototype.hours = function () {
        return this.as(basics_1.TimeUnit.Hour);
    };
    /**
     * The hour part of a duration. This assumes that a day has 24 hours (which is not the case
     * during DST changes).
     */
    Duration.prototype.hour = function () {
        return this._part(basics_1.TimeUnit.Hour);
    };
    /**
     * The hour part of the duration (always positive).
     * Note that this part can exceed 23 hours, because for
     * now, we do not have a days() function
     * For Day/Month/Year durations, this is approximate!
     * @return e.g. 25 for a -25:02:03.400 duration
     */
    Duration.prototype.wholeHours = function () {
        return Math.floor(basics.timeUnitToMilliseconds(this._unit) * Math.abs(this._amount) / 3600000);
    };
    /**
     * The entire duration in days (negative or positive, fractional)
     * This is approximate if this duration is not in days!
     */
    Duration.prototype.days = function () {
        return this.as(basics_1.TimeUnit.Day);
    };
    /**
     * The day part of a duration. This assumes that a month has 30 days.
     */
    Duration.prototype.day = function () {
        return this._part(basics_1.TimeUnit.Day);
    };
    /**
     * The entire duration in days (negative or positive, fractional)
     * This is approximate if this duration is not in Months or Years!
     */
    Duration.prototype.months = function () {
        return this.as(basics_1.TimeUnit.Month);
    };
    /**
     * The month part of a duration.
     */
    Duration.prototype.month = function () {
        return this._part(basics_1.TimeUnit.Month);
    };
    /**
     * The entire duration in years (negative or positive, fractional)
     * This is approximate if this duration is not in Months or Years!
     */
    Duration.prototype.years = function () {
        return this.as(basics_1.TimeUnit.Year);
    };
    /**
     * Non-fractional positive years
     */
    Duration.prototype.wholeYears = function () {
        if (this._unit === basics_1.TimeUnit.Year) {
            return Math.floor(Math.abs(this._amount));
        }
        else if (this._unit === basics_1.TimeUnit.Month) {
            return Math.floor(Math.abs(this._amount) / 12);
        }
        else {
            return Math.floor(basics.timeUnitToMilliseconds(this._unit) * Math.abs(this._amount) /
                basics.timeUnitToMilliseconds(basics_1.TimeUnit.Year));
        }
    };
    /**
     * Amount of units (positive or negative, fractional)
     */
    Duration.prototype.amount = function () {
        return this._amount;
    };
    /**
     * The unit this duration was created with
     */
    Duration.prototype.unit = function () {
        return this._unit;
    };
    /**
     * Sign
     * @return "-" if the duration is negative
     */
    Duration.prototype.sign = function () {
        return (this._amount < 0 ? "-" : "");
    };
    /**
     * Approximate if the durations have units that cannot be converted
     * @return True iff (this < other)
     */
    Duration.prototype.lessThan = function (other) {
        return this.milliseconds() < other.milliseconds();
    };
    /**
     * Approximate if the durations have units that cannot be converted
     * @return True iff (this <= other)
     */
    Duration.prototype.lessEqual = function (other) {
        return this.milliseconds() <= other.milliseconds();
    };
    /**
     * Similar but not identical
     * Approximate if the durations have units that cannot be converted
     * @return True iff this and other represent the same time duration
     */
    Duration.prototype.equals = function (other) {
        var converted = other.convert(this._unit);
        return this._amount === converted.amount() && this._unit === converted.unit();
    };
    /**
     * Similar but not identical
     * Returns false if we cannot determine whether they are equal in all time zones
     * so e.g. 60 minutes equals 1 hour, but 24 hours do NOT equal 1 day
     *
     * @return True iff this and other represent the same time duration
     */
    Duration.prototype.equalsExact = function (other) {
        if (this._unit === other._unit) {
            return (this._amount === other._amount);
        }
        else if (this._unit >= basics_1.TimeUnit.Month && other.unit() >= basics_1.TimeUnit.Month) {
            return this.equals(other); // can compare months and years
        }
        else if (this._unit < basics_1.TimeUnit.Day && other.unit() < basics_1.TimeUnit.Day) {
            return this.equals(other); // can compare milliseconds through hours
        }
        else {
            return false; // cannot compare days to anything else
        }
    };
    /**
     * Same unit and same amount
     */
    Duration.prototype.identical = function (other) {
        return this._amount === other.amount() && this._unit === other.unit();
    };
    /**
     * Approximate if the durations have units that cannot be converted
     * @return True iff this > other
     */
    Duration.prototype.greaterThan = function (other) {
        return this.milliseconds() > other.milliseconds();
    };
    /**
     * Approximate if the durations have units that cannot be converted
     * @return True iff this >= other
     */
    Duration.prototype.greaterEqual = function (other) {
        return this.milliseconds() >= other.milliseconds();
    };
    /**
     * Approximate if the durations have units that cannot be converted
     * @return The minimum (most negative) of this and other
     */
    Duration.prototype.min = function (other) {
        if (this.lessThan(other)) {
            return this.clone();
        }
        return other.clone();
    };
    /**
     * Approximate if the durations have units that cannot be converted
     * @return The maximum (most positive) of this and other
     */
    Duration.prototype.max = function (other) {
        if (this.greaterThan(other)) {
            return this.clone();
        }
        return other.clone();
    };
    /**
     * Multiply with a fixed number.
     * Approximate if the durations have units that cannot be converted
     * @return a new Duration of (this * value)
     */
    Duration.prototype.multiply = function (value) {
        return new Duration(this._amount * value, this._unit);
    };
    Duration.prototype.divide = function (value) {
        if (typeof value === "number") {
            if (value === 0) {
                throw new Error("Duration.divide(): Divide by zero");
            }
            return new Duration(this._amount / value, this._unit);
        }
        else {
            if (value._amount === 0) {
                throw new Error("Duration.divide(): Divide by zero duration");
            }
            return this.milliseconds() / value.milliseconds();
        }
    };
    /**
     * Add a duration.
     * @return a new Duration of (this + value) with the unit of this duration
     */
    Duration.prototype.add = function (value) {
        return new Duration(this._amount + value.as(this._unit), this._unit);
    };
    /**
     * Subtract a duration.
     * @return a new Duration of (this - value) with the unit of this duration
     */
    Duration.prototype.sub = function (value) {
        return new Duration(this._amount - value.as(this._unit), this._unit);
    };
    /**
     * Return the absolute value of the duration i.e. remove the sign.
     */
    Duration.prototype.abs = function () {
        if (this._amount >= 0) {
            return this.clone();
        }
        else {
            return this.multiply(-1);
        }
    };
    /**
     * String in [-]hhhh:mm:ss.nnn notation. All fields are
     * always present except the sign.
     */
    Duration.prototype.toFullString = function () {
        return this.toHmsString(true);
    };
    /**
     * String in [-]hhhh:mm[:ss[.nnn]] notation.
     * @param full If true, then all fields are always present except the sign. Otherwise, seconds and milliseconds
     *             are chopped off if zero
     */
    Duration.prototype.toHmsString = function (full) {
        if (full === void 0) { full = false; }
        var result = "";
        if (full || this.millisecond() > 0) {
            result = "." + strings.padLeft(this.millisecond().toString(10), 3, "0");
        }
        if (full || result.length > 0 || this.second() > 0) {
            result = ":" + strings.padLeft(this.second().toString(10), 2, "0") + result;
        }
        if (full || result.length > 0 || this.minute() > 0) {
            result = ":" + strings.padLeft(this.minute().toString(10), 2, "0") + result;
        }
        return this.sign() + strings.padLeft(this.wholeHours().toString(10), 2, "0") + result;
    };
    /**
     * String in ISO 8601 notation e.g. 'P1M' for one month or 'PT1M' for one minute
     */
    Duration.prototype.toIsoString = function () {
        switch (this._unit) {
            case basics_1.TimeUnit.Millisecond: {
                return "P" + (this._amount / 1000).toFixed(3) + "S";
            }
            case basics_1.TimeUnit.Second: {
                return "P" + this._amount.toString(10) + "S";
            }
            case basics_1.TimeUnit.Minute: {
                return "PT" + this._amount.toString(10) + "M"; // note the "T" to disambiguate the "M"
            }
            case basics_1.TimeUnit.Hour: {
                return "P" + this._amount.toString(10) + "H";
            }
            case basics_1.TimeUnit.Day: {
                return "P" + this._amount.toString(10) + "D";
            }
            case basics_1.TimeUnit.Week: {
                return "P" + this._amount.toString(10) + "W";
            }
            case basics_1.TimeUnit.Month: {
                return "P" + this._amount.toString(10) + "M";
            }
            case basics_1.TimeUnit.Year: {
                return "P" + this._amount.toString(10) + "Y";
            }
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("Unknown period unit.");
                }
        }
    };
    /**
     * String representation with amount and unit e.g. '1.5 years' or '-1 day'
     */
    Duration.prototype.toString = function () {
        return this._amount.toString(10) + " " + basics.timeUnitToString(this._unit, this._amount);
    };
    /**
     * The valueOf() method returns the primitive value of the specified object.
     */
    Duration.prototype.valueOf = function () {
        return this.milliseconds();
    };
    /**
     * Return this % unit, always positive
     */
    Duration.prototype._part = function (unit) {
        var nextUnit;
        // note not all units are used here: Weeks and Years are ruled out
        switch (unit) {
            case basics_1.TimeUnit.Millisecond:
                nextUnit = basics_1.TimeUnit.Second;
                break;
            case basics_1.TimeUnit.Second:
                nextUnit = basics_1.TimeUnit.Minute;
                break;
            case basics_1.TimeUnit.Minute:
                nextUnit = basics_1.TimeUnit.Hour;
                break;
            case basics_1.TimeUnit.Hour:
                nextUnit = basics_1.TimeUnit.Day;
                break;
            case basics_1.TimeUnit.Day:
                nextUnit = basics_1.TimeUnit.Month;
                break;
            case basics_1.TimeUnit.Month:
                nextUnit = basics_1.TimeUnit.Year;
                break;
            default:
                return Math.floor(Math.abs(this.as(basics_1.TimeUnit.Year)));
        }
        var msecs = (basics.timeUnitToMilliseconds(this._unit) * Math.abs(this._amount)) % basics.timeUnitToMilliseconds(nextUnit);
        return Math.floor(msecs / basics.timeUnitToMilliseconds(unit));
    };
    Duration.prototype._fromString = function (s) {
        var trimmed = s.trim();
        if (trimmed.match(/^-?\d\d?(:\d\d?(:\d\d?(.\d\d?\d?)?)?)?$/)) {
            var sign = 1;
            var hours_1 = 0;
            var minutes_1 = 0;
            var seconds_1 = 0;
            var milliseconds_1 = 0;
            var parts = trimmed.split(":");
            assert_1.default(parts.length > 0 && parts.length < 4, "Not a proper time duration string: \"" + trimmed + "\"");
            if (trimmed.charAt(0) === "-") {
                sign = -1;
                parts[0] = parts[0].substr(1);
            }
            if (parts.length > 0) {
                hours_1 = +parts[0];
            }
            if (parts.length > 1) {
                minutes_1 = +parts[1];
            }
            if (parts.length > 2) {
                var secondParts = parts[2].split(".");
                seconds_1 = +secondParts[0];
                if (secondParts.length > 1) {
                    milliseconds_1 = +strings.padRight(secondParts[1], 3, "0");
                }
            }
            var amountMsec = sign * Math.round(milliseconds_1 + 1000 * seconds_1 + 60000 * minutes_1 + 3600000 * hours_1);
            // find lowest non-zero number and take that as unit
            if (milliseconds_1 !== 0) {
                this._unit = basics_1.TimeUnit.Millisecond;
            }
            else if (seconds_1 !== 0) {
                this._unit = basics_1.TimeUnit.Second;
            }
            else if (minutes_1 !== 0) {
                this._unit = basics_1.TimeUnit.Minute;
            }
            else if (hours_1 !== 0) {
                this._unit = basics_1.TimeUnit.Hour;
            }
            else {
                this._unit = basics_1.TimeUnit.Millisecond;
            }
            this._amount = amountMsec / basics.timeUnitToMilliseconds(this._unit);
        }
        else {
            var split = trimmed.toLowerCase().split(" ");
            if (split.length !== 2) {
                throw new Error("Invalid time string '" + s + "'");
            }
            var amount = parseFloat(split[0]);
            assert_1.default(!isNaN(amount), "Invalid time string '" + s + "', cannot parse amount");
            assert_1.default(isFinite(amount), "Invalid time string '" + s + "', amount is infinite");
            this._amount = amount;
            this._unit = basics.stringToTimeUnit(split[1]);
        }
    };
    return Duration;
}());
exports.Duration = Duration;
/**
 * Checks if a given object is of type Duration. Note that it does not work for sub classes. However, use this to be robust
 * against different versions of the library in one process instead of instanceof
 * @param value Value to check
 * @throws nothing
 */
function isDuration(value) {
    return typeof value === "object" && value !== null && value.kind === "Duration";
}
exports.isDuration = isDuration;

},{"./assert":1,"./basics":2,"./strings":12}],5:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Functionality to parse a DateTime object to a string
 */
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var basics = require("./basics");
var locale_1 = require("./locale");
var strings = require("./strings");
var token_1 = require("./token");
/**
 * Format the supplied dateTime with the formatting string.
 *
 * @param dateTime The current time to format
 * @param utcTime The time in UTC
 * @param localZone The zone that currentTime is in
 * @param formatString The LDML format pattern (see LDML.md)
 * @param locale Other format options such as month names
 * @return string
 */
function format(dateTime, utcTime, localZone, formatString, locale) {
    if (locale === void 0) { locale = {}; }
    var mergedLocale = __assign({}, locale_1.DEFAULT_LOCALE, locale);
    var tokens = token_1.tokenize(formatString);
    var result = "";
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        var tokenResult = void 0;
        switch (token.type) {
            case token_1.TokenType.ERA:
                tokenResult = _formatEra(dateTime, token, mergedLocale);
                break;
            case token_1.TokenType.YEAR:
                tokenResult = _formatYear(dateTime, token);
                break;
            case token_1.TokenType.QUARTER:
                tokenResult = _formatQuarter(dateTime, token, mergedLocale);
                break;
            case token_1.TokenType.MONTH:
                tokenResult = _formatMonth(dateTime, token, mergedLocale);
                break;
            case token_1.TokenType.DAY:
                tokenResult = _formatDay(dateTime, token);
                break;
            case token_1.TokenType.WEEKDAY:
                tokenResult = _formatWeekday(dateTime, token, mergedLocale);
                break;
            case token_1.TokenType.DAYPERIOD:
                tokenResult = _formatDayPeriod(dateTime, token, mergedLocale);
                break;
            case token_1.TokenType.HOUR:
                tokenResult = _formatHour(dateTime, token);
                break;
            case token_1.TokenType.MINUTE:
                tokenResult = _formatMinute(dateTime, token);
                break;
            case token_1.TokenType.SECOND:
                tokenResult = _formatSecond(dateTime, token);
                break;
            case token_1.TokenType.ZONE:
                tokenResult = _formatZone(dateTime, utcTime, localZone ? localZone : undefined, token);
                break;
            case token_1.TokenType.WEEK:
                tokenResult = _formatWeek(dateTime, token);
                break;
            case token_1.TokenType.IDENTITY: // intentional fallthrough
            /* istanbul ignore next */
            default:
                tokenResult = token.raw;
                break;
        }
        result += tokenResult;
    }
    return result.trim();
}
exports.format = format;
/**
 * Format the era (BC or AD)
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatEra(dateTime, token, locale) {
    var AD = dateTime.year > 0;
    switch (token.length) {
        case 1:
        case 2:
        case 3:
            return (AD ? locale.eraAbbreviated[0] : locale.eraAbbreviated[1]);
        case 4:
            return (AD ? locale.eraWide[0] : locale.eraWide[1]);
        case 5:
            return (AD ? locale.eraNarrow[0] : locale.eraNarrow[1]);
        /* istanbul ignore next */
        default:
            // tokenizer should prevent this
            /* istanbul ignore next */
            return token.raw;
    }
}
/**
 * Format the year
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatYear(dateTime, token) {
    switch (token.symbol) {
        case "y":
        case "Y":
        case "r":
            var yearValue = strings.padLeft(dateTime.year.toString(), token.length, "0");
            if (token.length === 2) { // Special case: exactly two characters are expected
                yearValue = yearValue.slice(-2);
            }
            return yearValue;
        /* istanbul ignore next */
        default:
            // tokenizer should prevent this
            /* istanbul ignore next */
            return token.raw;
    }
}
/**
 * Format the quarter
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatQuarter(dateTime, token, locale) {
    var quarter = Math.ceil(dateTime.month / 3);
    switch (token.symbol) {
        case "Q":
            switch (token.length) {
                case 1:
                case 2:
                    return strings.padLeft(quarter.toString(), 2, "0");
                case 3:
                    return locale.quarterLetter + quarter;
                case 4:
                    return locale.quarterAbbreviations[quarter - 1] + " " + locale.quarterWord;
                case 5:
                    return quarter.toString();
                /* istanbul ignore next */
                default:
                    // tokenizer should prevent this
                    /* istanbul ignore next */
                    return token.raw;
            }
        case "q":
            switch (token.length) {
                case 1:
                case 2:
                    return strings.padLeft(quarter.toString(), 2, "0");
                case 3:
                    return locale.standAloneQuarterLetter + quarter;
                case 4:
                    return locale.standAloneQuarterAbbreviations[quarter - 1] + " " + locale.standAloneQuarterWord;
                case 5:
                    return quarter.toString();
                /* istanbul ignore next */
                default:
                    // tokenizer should prevent this
                    /* istanbul ignore next */
                    return token.raw;
            }
        /* istanbul ignore next */
        default:
            /* istanbul ignore next */
            throw new Error("invalid quarter pattern");
    }
}
/**
 * Format the month
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatMonth(dateTime, token, locale) {
    switch (token.symbol) {
        case "M":
            switch (token.length) {
                case 1:
                case 2:
                    return strings.padLeft(dateTime.month.toString(), token.length, "0");
                case 3:
                    return locale.shortMonthNames[dateTime.month - 1];
                case 4:
                    return locale.longMonthNames[dateTime.month - 1];
                case 5:
                    return locale.monthLetters[dateTime.month - 1];
                /* istanbul ignore next */
                default:
                    // tokenizer should prevent this
                    /* istanbul ignore next */
                    return token.raw;
            }
        case "L":
            switch (token.length) {
                case 1:
                case 2:
                    return strings.padLeft(dateTime.month.toString(), token.length, "0");
                case 3:
                    return locale.standAloneShortMonthNames[dateTime.month - 1];
                case 4:
                    return locale.standAloneLongMonthNames[dateTime.month - 1];
                case 5:
                    return locale.standAloneMonthLetters[dateTime.month - 1];
                /* istanbul ignore next */
                default:
                    // tokenizer should prevent this
                    /* istanbul ignore next */
                    return token.raw;
            }
        /* istanbul ignore next */
        default:
            /* istanbul ignore next */
            throw new Error("invalid month pattern");
    }
}
/**
 * Format the week number
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatWeek(dateTime, token) {
    if (token.symbol === "w") {
        return strings.padLeft(basics.weekNumber(dateTime.year, dateTime.month, dateTime.day).toString(), token.length, "0");
    }
    else {
        return strings.padLeft(basics.weekOfMonth(dateTime.year, dateTime.month, dateTime.day).toString(), token.length, "0");
    }
}
/**
 * Format the day of the month (or year)
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatDay(dateTime, token) {
    switch (token.symbol) {
        case "d":
            return strings.padLeft(dateTime.day.toString(), token.length, "0");
        case "D":
            var dayOfYear = basics.dayOfYear(dateTime.year, dateTime.month, dateTime.day) + 1;
            return strings.padLeft(dayOfYear.toString(), token.length, "0");
        /* istanbul ignore next */
        default:
            // tokenizer should prevent this
            /* istanbul ignore next */
            return token.raw;
    }
}
/**
 * Format the day of the week
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatWeekday(dateTime, token, locale) {
    var weekDayNumber = basics.weekDayNoLeapSecs(dateTime.unixMillis);
    switch (token.length) {
        case 1:
        case 2:
            if (token.symbol === "e") {
                return strings.padLeft(basics.weekDayNoLeapSecs(dateTime.unixMillis).toString(), token.length, "0");
            }
            else {
                return locale.shortWeekdayNames[weekDayNumber];
            }
        case 3:
            return locale.shortWeekdayNames[weekDayNumber];
        case 4:
            return locale.longWeekdayNames[weekDayNumber];
        case 5:
            return locale.weekdayLetters[weekDayNumber];
        case 6:
            return locale.weekdayTwoLetters[weekDayNumber];
        /* istanbul ignore next */
        default:
            // tokenizer should prevent this
            /* istanbul ignore next */
            return token.raw;
    }
}
/**
 * Format the Day Period (AM or PM)
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatDayPeriod(dateTime, token, locale) {
    switch (token.symbol) {
        case "a": {
            if (token.length <= 3) {
                if (dateTime.hour < 12) {
                    return locale.dayPeriodAbbreviated.am;
                }
                else {
                    return locale.dayPeriodAbbreviated.pm;
                }
            }
            else if (token.length === 4) {
                if (dateTime.hour < 12) {
                    return locale.dayPeriodWide.am;
                }
                else {
                    return locale.dayPeriodWide.pm;
                }
            }
            else {
                if (dateTime.hour < 12) {
                    return locale.dayPeriodNarrow.am;
                }
                else {
                    return locale.dayPeriodNarrow.pm;
                }
            }
        }
        case "b":
        case "B": {
            if (token.length <= 3) {
                if (dateTime.hour === 0 && dateTime.minute === 0 && dateTime.second === 0 && dateTime.milli === 0) {
                    return locale.dayPeriodAbbreviated.midnight;
                }
                else if (dateTime.hour === 12 && dateTime.minute === 0 && dateTime.second === 0 && dateTime.milli === 0) {
                    return locale.dayPeriodAbbreviated.noon;
                }
                else if (dateTime.hour < 12) {
                    return locale.dayPeriodAbbreviated.am;
                }
                else {
                    return locale.dayPeriodAbbreviated.pm;
                }
            }
            else if (token.length === 4) {
                if (dateTime.hour === 0 && dateTime.minute === 0 && dateTime.second === 0 && dateTime.milli === 0) {
                    return locale.dayPeriodWide.midnight;
                }
                else if (dateTime.hour === 12 && dateTime.minute === 0 && dateTime.second === 0 && dateTime.milli === 0) {
                    return locale.dayPeriodWide.noon;
                }
                else if (dateTime.hour < 12) {
                    return locale.dayPeriodWide.am;
                }
                else {
                    return locale.dayPeriodWide.pm;
                }
            }
            else {
                if (dateTime.hour === 0 && dateTime.minute === 0 && dateTime.second === 0 && dateTime.milli === 0) {
                    return locale.dayPeriodNarrow.midnight;
                }
                else if (dateTime.hour === 12 && dateTime.minute === 0 && dateTime.second === 0 && dateTime.milli === 0) {
                    return locale.dayPeriodNarrow.noon;
                }
                else if (dateTime.hour < 12) {
                    return locale.dayPeriodNarrow.am;
                }
                else {
                    return locale.dayPeriodNarrow.pm;
                }
            }
        }
        /* istanbul ignore next */
        default:
            // tokenizer should prevent this
            /* istanbul ignore next */
            return token.raw;
    }
}
/**
 * Format the Hour
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatHour(dateTime, token) {
    var hour = dateTime.hour;
    switch (token.symbol) {
        case "h":
            hour = hour % 12;
            if (hour === 0) {
                hour = 12;
            }
            return strings.padLeft(hour.toString(), token.length, "0");
        case "H":
            return strings.padLeft(hour.toString(), token.length, "0");
        case "K":
            hour = hour % 12;
            return strings.padLeft(hour.toString(), token.length, "0");
        case "k":
            if (hour === 0) {
                hour = 24;
            }
            return strings.padLeft(hour.toString(), token.length, "0");
        /* istanbul ignore next */
        default:
            // tokenizer should prevent this
            /* istanbul ignore next */
            return token.raw;
    }
}
/**
 * Format the minute
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatMinute(dateTime, token) {
    return strings.padLeft(dateTime.minute.toString(), token.length, "0");
}
/**
 * Format the seconds (or fraction of a second)
 *
 * @param dateTime The current time to format
 * @param token The token passed
 * @return string
 */
function _formatSecond(dateTime, token) {
    switch (token.symbol) {
        case "s":
            return strings.padLeft(dateTime.second.toString(), token.length, "0");
        case "S":
            var fraction = dateTime.milli;
            var fractionString = strings.padLeft(fraction.toString(), 3, "0");
            fractionString = strings.padRight(fractionString, token.length, "0");
            return fractionString.slice(0, token.length);
        case "A":
            return strings.padLeft(basics.secondOfDay(dateTime.hour, dateTime.minute, dateTime.second).toString(), token.length, "0");
        /* istanbul ignore next */
        default:
            // tokenizer should prevent this
            /* istanbul ignore next */
            return token.raw;
    }
}
/**
 * Format the time zone. For this, we need the current time, the time in UTC and the time zone
 * @param currentTime The time to format
 * @param utcTime The time in UTC
 * @param zone The timezone currentTime is in
 * @param token The token passed
 * @return string
 */
function _formatZone(currentTime, utcTime, zone, token) {
    if (!zone) {
        return "";
    }
    var offset = Math.round((currentTime.unixMillis - utcTime.unixMillis) / 60000);
    var offsetHours = Math.floor(Math.abs(offset) / 60);
    var offsetHoursString = strings.padLeft(offsetHours.toString(), 2, "0");
    offsetHoursString = (offset >= 0 ? "+" + offsetHoursString : "-" + offsetHoursString);
    var offsetMinutes = Math.abs(offset % 60);
    var offsetMinutesString = strings.padLeft(offsetMinutes.toString(), 2, "0");
    var result;
    switch (token.symbol) {
        case "O":
            result = "GMT";
            if (offset >= 0) {
                result += "+";
            }
            else {
                result += "-";
            }
            result += offsetHours.toString();
            if (token.length >= 4 || offsetMinutes !== 0) {
                result += ":" + offsetMinutesString;
            }
            if (token.length > 4) {
                result += token.raw.slice(4);
            }
            return result;
        case "Z":
            switch (token.length) {
                case 1:
                case 2:
                case 3:
                    return offsetHoursString + offsetMinutesString;
                case 4:
                    var newToken = {
                        length: 4,
                        raw: "OOOO",
                        symbol: "O",
                        type: token_1.TokenType.ZONE
                    };
                    return _formatZone(currentTime, utcTime, zone, newToken);
                case 5:
                    if (offset === 0) {
                        return "Z";
                    }
                    return offsetHoursString + ":" + offsetMinutesString;
                /* istanbul ignore next */
                default:
                    // tokenizer should prevent this
                    /* istanbul ignore next */
                    return token.raw;
            }
        case "z":
            switch (token.length) {
                case 1:
                case 2:
                case 3:
                    return zone.abbreviationForUtc(currentTime, true);
                case 4:
                    return zone.toString();
                /* istanbul ignore next */
                default:
                    // tokenizer should prevent this
                    /* istanbul ignore next */
                    return token.raw;
            }
        case "v":
            if (token.length === 1) {
                return zone.abbreviationForUtc(currentTime, false);
            }
            else {
                return zone.toString();
            }
        case "V":
            switch (token.length) {
                case 1:
                    // Not implemented
                    return "unk";
                case 2:
                    return zone.name();
                case 3:
                case 4:
                    return "Unknown";
                /* istanbul ignore next */
                default:
                    // tokenizer should prevent this
                    /* istanbul ignore next */
                    return token.raw;
            }
        case "X":
        case "x":
            if (token.symbol === "X" && offset === 0) {
                return "Z";
            }
            switch (token.length) {
                case 1:
                    result = offsetHoursString;
                    if (offsetMinutes !== 0) {
                        result += offsetMinutesString;
                    }
                    return result;
                case 2:
                case 4: // No seconds in our implementation, so this is the same
                    return offsetHoursString + offsetMinutesString;
                case 3:
                case 5: // No seconds in our implementation, so this is the same
                    return offsetHoursString + ":" + offsetMinutesString;
                /* istanbul ignore next */
                default:
                    // tokenizer should prevent this
                    /* istanbul ignore next */
                    return token.raw;
            }
        /* istanbul ignore next */
        default:
            // tokenizer should prevent this
            /* istanbul ignore next */
            return token.raw;
    }
}

},{"./basics":2,"./locale":8,"./strings":12,"./token":15}],6:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Global functions depending on DateTime/Duration etc
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
/**
 * Returns the minimum of two DateTimes or Durations
 */
function min(d1, d2) {
    assert_1.default(d1, "first argument is falsy");
    assert_1.default(d2, "second argument is falsy");
    /* istanbul ignore next */
    assert_1.default(d1.kind === d2.kind, "expected either two datetimes or two durations");
    return d1.min(d2);
}
exports.min = min;
/**
 * Returns the maximum of two DateTimes or Durations
 */
function max(d1, d2) {
    assert_1.default(d1, "first argument is falsy");
    assert_1.default(d2, "second argument is falsy");
    /* istanbul ignore next */
    assert_1.default(d1.kind === d2.kind, "expected either two datetimes or two durations");
    return d1.max(d2);
}
exports.max = max;
/**
 * Returns the absolute value of a Duration
 */
function abs(d) {
    assert_1.default(d, "first argument is falsy");
    return d.abs();
}
exports.abs = abs;

},{"./assert":1}],7:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Indicates how a Date object should be interpreted.
 * Either we can take getYear(), getMonth() etc for our field
 * values, or we can take getUTCYear(), getUtcMonth() etc to do that.
 */
var DateFunctions;
(function (DateFunctions) {
    /**
     * Use the Date.getFullYear(), Date.getMonth(), ... functions.
     */
    DateFunctions[DateFunctions["Get"] = 0] = "Get";
    /**
     * Use the Date.getUTCFullYear(), Date.getUTCMonth(), ... functions.
     */
    DateFunctions[DateFunctions["GetUTC"] = 1] = "GetUTC";
})(DateFunctions = exports.DateFunctions || (exports.DateFunctions = {}));

},{}],8:[function(require,module,exports){
"use strict";
/**
 * Copyright(c) 2017 ABB Switzerland Ltd.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERA_NAMES_NARROW = ["A", "B"];
exports.ERA_NAMES_WIDE = ["Anno Domini", "Before Christ"];
exports.ERA_NAMES_ABBREVIATED = ["AD", "BC"];
exports.QUARTER_LETTER = "Q";
exports.QUARTER_WORD = "quarter";
exports.QUARTER_ABBREVIATIONS = ["1st", "2nd", "3rd", "4th"];
/**
 * In some languages, different words are necessary for stand-alone quarter names
 */
exports.STAND_ALONE_QUARTER_LETTER = exports.QUARTER_LETTER;
exports.STAND_ALONE_QUARTER_WORD = exports.QUARTER_WORD;
exports.STAND_ALONE_QUARTER_ABBREVIATIONS = exports.QUARTER_ABBREVIATIONS.slice();
exports.LONG_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
exports.SHORT_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
exports.MONTH_LETTERS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
exports.STAND_ALONE_LONG_MONTH_NAMES = exports.LONG_MONTH_NAMES.slice();
exports.STAND_ALONE_SHORT_MONTH_NAMES = exports.SHORT_MONTH_NAMES.slice();
exports.STAND_ALONE_MONTH_LETTERS = exports.MONTH_LETTERS.slice();
exports.LONG_WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
exports.SHORT_WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
exports.WEEKDAY_TWO_LETTERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
exports.WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
exports.DAY_PERIODS_ABBREVIATED = { am: "AM", pm: "PM", noon: "noon", midnight: "mid." };
exports.DAY_PERIODS_WIDE = { am: "AM", pm: "PM", noon: "noon", midnight: "midnight" };
exports.DAY_PERIODS_NARROW = { am: "A", pm: "P", noon: "noon", midnight: "md" };
exports.DEFAULT_LOCALE = {
    eraNarrow: exports.ERA_NAMES_NARROW,
    eraWide: exports.ERA_NAMES_WIDE,
    eraAbbreviated: exports.ERA_NAMES_ABBREVIATED,
    quarterLetter: exports.QUARTER_LETTER,
    quarterWord: exports.QUARTER_WORD,
    quarterAbbreviations: exports.QUARTER_ABBREVIATIONS,
    standAloneQuarterLetter: exports.STAND_ALONE_QUARTER_LETTER,
    standAloneQuarterWord: exports.STAND_ALONE_QUARTER_WORD,
    standAloneQuarterAbbreviations: exports.STAND_ALONE_QUARTER_ABBREVIATIONS,
    longMonthNames: exports.LONG_MONTH_NAMES,
    shortMonthNames: exports.SHORT_MONTH_NAMES,
    monthLetters: exports.MONTH_LETTERS,
    standAloneLongMonthNames: exports.STAND_ALONE_LONG_MONTH_NAMES,
    standAloneShortMonthNames: exports.STAND_ALONE_SHORT_MONTH_NAMES,
    standAloneMonthLetters: exports.STAND_ALONE_MONTH_LETTERS,
    longWeekdayNames: exports.LONG_WEEKDAY_NAMES,
    shortWeekdayNames: exports.SHORT_WEEKDAY_NAMES,
    weekdayTwoLetters: exports.WEEKDAY_TWO_LETTERS,
    weekdayLetters: exports.WEEKDAY_LETTERS,
    dayPeriodAbbreviated: exports.DAY_PERIODS_ABBREVIATED,
    dayPeriodWide: exports.DAY_PERIODS_WIDE,
    dayPeriodNarrow: exports.DAY_PERIODS_NARROW
};

},{}],9:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Math utility functions
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
/**
 * @return true iff given argument is an integer number
 */
function isInt(n) {
    if (n === null || !isFinite(n)) {
        return false;
    }
    return (Math.floor(n) === n);
}
exports.isInt = isInt;
/**
 * Rounds -1.5 to -2 instead of -1
 * Rounds +1.5 to +2
 */
function roundSym(n) {
    if (n < 0) {
        return -1 * Math.round(-1 * n);
    }
    else {
        return Math.round(n);
    }
}
exports.roundSym = roundSym;
/**
 * Stricter variant of parseFloat().
 * @param value	Input string
 * @return the float if the string is a valid float, NaN otherwise
 */
function filterFloat(value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
        return Number(value);
    }
    return NaN;
}
exports.filterFloat = filterFloat;
function positiveModulo(value, modulo) {
    assert_1.default(modulo >= 1, "modulo should be >= 1");
    if (value < 0) {
        return ((value % modulo) + modulo) % modulo;
    }
    else {
        return value % modulo;
    }
}
exports.positiveModulo = positiveModulo;

},{"./assert":1}],10:[function(require,module,exports){
"use strict";
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Functionality to parse a DateTime object to a string
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var basics_1 = require("./basics");
var locale_1 = require("./locale");
var timezone_1 = require("./timezone");
var token_1 = require("./token");
/**
 * Checks if a given datetime string is according to the given format
 * @param dateTimeString The string to test
 * @param formatString LDML format string (see LDML.md)
 * @param allowTrailing Allow trailing string after the date+time
 * @param locale Locale-specific constants such as month names
 * @returns true iff the string is valid
 */
function parseable(dateTimeString, formatString, allowTrailing, locale) {
    if (allowTrailing === void 0) { allowTrailing = true; }
    if (locale === void 0) { locale = {}; }
    try {
        parse(dateTimeString, formatString, undefined, allowTrailing, locale);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.parseable = parseable;
/**
 * Parse the supplied dateTime assuming the given format.
 *
 * @param dateTimeString The string to parse
 * @param formatString The formatting string to be applied
 * @param overrideZone Use this zone in the result
 * @param allowTrailing Allow trailing characters in the source string
 * @param locale Locale-specific constants such as month names
 * @return string
 */
function parse(dateTimeString, formatString, overrideZone, allowTrailing, locale) {
    if (allowTrailing === void 0) { allowTrailing = true; }
    if (locale === void 0) { locale = {}; }
    var _a;
    if (!dateTimeString) {
        throw new Error("no date given");
    }
    if (!formatString) {
        throw new Error("no format given");
    }
    var mergedLocale = __assign({}, locale_1.DEFAULT_LOCALE, locale);
    var yearCutoff = (new Date().getFullYear() + 50) % 100;
    try {
        var tokens = token_1.tokenize(formatString);
        var time = { year: undefined };
        var zone = void 0;
        var pnr = void 0;
        var pzr = void 0;
        var dpr = void 0;
        var era = 1;
        var quarter = void 0;
        var remaining = dateTimeString;
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            switch (token.type) {
                case token_1.TokenType.ERA:
                    _a = stripEra(token, remaining, mergedLocale), era = _a[0], remaining = _a[1];
                    break;
                case token_1.TokenType.QUARTER:
                    {
                        var r = stripQuarter(token, remaining, mergedLocale);
                        quarter = r.n;
                        remaining = r.remaining;
                    }
                    break;
                /* istanbul ignore next */
                case token_1.TokenType.WEEKDAY:
                /* istanbul ignore next */
                case token_1.TokenType.WEEK:
                    /* istanbul ignore next */
                    break; // nothing to learn from this
                case token_1.TokenType.DAYPERIOD:
                    dpr = stripDayPeriod(token, remaining, mergedLocale);
                    remaining = dpr.remaining;
                    break;
                case token_1.TokenType.YEAR:
                    pnr = stripNumber(remaining, Infinity);
                    remaining = pnr.remaining;
                    if (token.length === 2) {
                        if (pnr.n > yearCutoff) {
                            time.year = 1900 + pnr.n;
                        }
                        else {
                            time.year = 2000 + pnr.n;
                        }
                    }
                    else {
                        time.year = pnr.n;
                    }
                    break;
                case token_1.TokenType.MONTH:
                    pnr = stripMonth(token, remaining, mergedLocale);
                    remaining = pnr.remaining;
                    time.month = pnr.n;
                    break;
                case token_1.TokenType.DAY:
                    pnr = stripNumber(remaining, 2);
                    remaining = pnr.remaining;
                    time.day = pnr.n;
                    break;
                case token_1.TokenType.HOUR:
                    pnr = stripHour(token, remaining);
                    remaining = pnr.remaining;
                    time.hour = pnr.n;
                    break;
                case token_1.TokenType.MINUTE:
                    pnr = stripNumber(remaining, 2);
                    remaining = pnr.remaining;
                    time.minute = pnr.n;
                    break;
                case token_1.TokenType.SECOND:
                    {
                        pnr = stripSecond(token, remaining);
                        remaining = pnr.remaining;
                        switch (token.symbol) {
                            case "s":
                                time.second = pnr.n;
                                break;
                            case "S":
                                time.milli = 1000 * parseFloat("0." + Math.floor(pnr.n).toString(10).slice(0, 3));
                                break;
                            case "A":
                                time.hour = Math.floor((pnr.n / 3600E3));
                                time.minute = Math.floor((pnr.n / 60E3) % 60);
                                time.second = Math.floor((pnr.n / 1000) % 60);
                                time.milli = pnr.n % 1000;
                                break;
                            /* istanbul ignore next */
                            default:
                                /* istanbul ignore next */
                                throw new Error("unsupported second format '" + token.raw + "'");
                        }
                    }
                    break;
                case token_1.TokenType.ZONE:
                    pzr = stripZone(token, remaining);
                    remaining = pzr.remaining;
                    zone = pzr.zone;
                    break;
                /* istanbul ignore next */
                default:
                case token_1.TokenType.IDENTITY:
                    remaining = stripRaw(remaining, token.raw);
                    break;
            }
        }
        if (dpr) {
            switch (dpr.type) {
                case "am":
                    if (time.hour !== undefined && time.hour >= 12) {
                        time.hour -= 12;
                    }
                    break;
                case "pm":
                    if (time.hour !== undefined && time.hour < 12) {
                        time.hour += 12;
                    }
                    break;
                case "noon":
                    if (time.hour === undefined || time.hour === 0) {
                        time.hour = 12;
                    }
                    if (time.minute === undefined) {
                        time.minute = 0;
                    }
                    if (time.second === undefined) {
                        time.second = 0;
                    }
                    if (time.milli === undefined) {
                        time.milli = 0;
                    }
                    if (time.hour !== 12 || time.minute !== 0 || time.second !== 0 || time.milli !== 0) {
                        throw new Error("invalid time, contains 'noon' specifier but time differs from noon");
                    }
                    break;
                case "midnight":
                    if (time.hour === undefined || time.hour === 12) {
                        time.hour = 0;
                    }
                    if (time.hour === 12) {
                        time.hour = 0;
                    }
                    if (time.minute === undefined) {
                        time.minute = 0;
                    }
                    if (time.second === undefined) {
                        time.second = 0;
                    }
                    if (time.milli === undefined) {
                        time.milli = 0;
                    }
                    if (time.hour !== 0 || time.minute !== 0 || time.second !== 0 || time.milli !== 0) {
                        throw new Error("invalid time, contains 'midnight' specifier but time differs from midnight");
                    }
                    break;
            }
        }
        if (time.year !== undefined) {
            time.year *= era;
        }
        if (quarter !== undefined) {
            if (time.month === undefined) {
                switch (quarter) {
                    case 1:
                        time.month = 1;
                        break;
                    case 2:
                        time.month = 4;
                        break;
                    case 3:
                        time.month = 7;
                        break;
                    case 4:
                        time.month = 10;
                        break;
                }
            }
            else {
                var error = false;
                switch (quarter) {
                    case 1:
                        error = !(time.month >= 1 && time.month <= 3);
                        break;
                    case 2:
                        error = !(time.month >= 4 && time.month <= 6);
                        break;
                    case 3:
                        error = !(time.month >= 7 && time.month <= 9);
                        break;
                    case 4:
                        error = !(time.month >= 10 && time.month <= 12);
                        break;
                }
                if (error) {
                    throw new Error("the quarter does not match the month");
                }
            }
        }
        if (time.year === undefined) {
            time.year = 1970;
        }
        var result = { time: new basics_1.TimeStruct(time), zone: zone };
        if (!result.time.validate()) {
            throw new Error("invalid resulting date");
        }
        // always overwrite zone with given zone
        if (overrideZone) {
            result.zone = overrideZone;
        }
        if (remaining && !allowTrailing) {
            throw new Error("invalid date '" + dateTimeString + "' not according to format '" + formatString + "': trailing characters: '" + remaining + "'");
        }
        return result;
    }
    catch (e) {
        throw new Error("invalid date '" + dateTimeString + "' not according to format '" + formatString + "': " + e.message);
    }
}
exports.parse = parse;
var WHITESPACE = [" ", "\t", "\r", "\v", "\n"];
function stripZone(token, s) {
    var unsupported = (token.symbol === "z")
        || (token.symbol === "Z" && token.length === 5)
        || (token.symbol === "v")
        || (token.symbol === "V" && token.length !== 2)
        || (token.symbol === "x" && token.length >= 4)
        || (token.symbol === "X" && token.length >= 4);
    if (unsupported) {
        throw new Error("time zone pattern '" + token.raw + "' is not implemented");
    }
    var result = {
        remaining: s
    };
    // chop off "GMT" prefix if needed
    var hadGMT = false;
    if ((token.symbol === "Z" && token.length === 4) || token.symbol === "O") {
        if (result.remaining.toUpperCase().startsWith("GMT")) {
            result.remaining = result.remaining.slice(3);
            hadGMT = true;
        }
    }
    // parse any zone, regardless of specified format
    var zoneString = "";
    while (result.remaining.length > 0 && WHITESPACE.indexOf(result.remaining.charAt(0)) === -1) {
        zoneString += result.remaining.charAt(0);
        result.remaining = result.remaining.substr(1);
    }
    zoneString = zoneString.trim();
    if (zoneString) {
        // ensure chopping off GMT does not hide time zone errors (bit of a sloppy regex but OK)
        if (hadGMT && !zoneString.match(/[\+\-]?[\d\:]+/i)) {
            throw new Error("invalid time zone 'GMT" + zoneString + "'");
        }
        result.zone = timezone_1.TimeZone.zone(zoneString);
    }
    else {
        throw new Error("no time zone given");
    }
    return result;
}
function stripRaw(s, expected) {
    var remaining = s;
    var eremaining = expected;
    while (remaining.length > 0 && eremaining.length > 0 && remaining.charAt(0) === eremaining.charAt(0)) {
        remaining = remaining.substr(1);
        eremaining = eremaining.substr(1);
    }
    if (eremaining.length > 0) {
        throw new Error("expected '" + expected + "'");
    }
    return remaining;
}
function stripDayPeriod(token, remaining, locale) {
    var _a, _b, _c, _d, _e, _f;
    var offsets;
    switch (token.symbol) {
        case "a":
            switch (token.length) {
                case 4:
                    offsets = (_a = {},
                        _a[locale.dayPeriodWide.am] = "am",
                        _a[locale.dayPeriodWide.pm] = "pm",
                        _a);
                    break;
                case 5:
                    offsets = (_b = {},
                        _b[locale.dayPeriodNarrow.am] = "am",
                        _b[locale.dayPeriodNarrow.pm] = "pm",
                        _b);
                    break;
                default:
                    offsets = (_c = {},
                        _c[locale.dayPeriodAbbreviated.am] = "am",
                        _c[locale.dayPeriodAbbreviated.pm] = "pm",
                        _c);
                    break;
            }
            break;
        default:
            switch (token.length) {
                case 4:
                    offsets = (_d = {},
                        _d[locale.dayPeriodWide.am] = "am",
                        _d[locale.dayPeriodWide.midnight] = "midnight",
                        _d[locale.dayPeriodWide.pm] = "pm",
                        _d[locale.dayPeriodWide.noon] = "noon",
                        _d);
                    break;
                case 5:
                    offsets = (_e = {},
                        _e[locale.dayPeriodNarrow.am] = "am",
                        _e[locale.dayPeriodNarrow.midnight] = "midnight",
                        _e[locale.dayPeriodNarrow.pm] = "pm",
                        _e[locale.dayPeriodNarrow.noon] = "noon",
                        _e);
                    break;
                default:
                    offsets = (_f = {},
                        _f[locale.dayPeriodAbbreviated.am] = "am",
                        _f[locale.dayPeriodAbbreviated.midnight] = "midnight",
                        _f[locale.dayPeriodAbbreviated.pm] = "pm",
                        _f[locale.dayPeriodAbbreviated.noon] = "noon",
                        _f);
                    break;
            }
            break;
    }
    // match longest possible day period string; sort keys by length descending
    var sortedKeys = Object.keys(offsets)
        .sort(function (a, b) { return (a.length < b.length ? 1 : a.length > b.length ? -1 : 0); });
    var upper = remaining.toUpperCase();
    for (var _i = 0, sortedKeys_1 = sortedKeys; _i < sortedKeys_1.length; _i++) {
        var key = sortedKeys_1[_i];
        if (upper.startsWith(key.toUpperCase())) {
            return {
                type: offsets[key],
                remaining: remaining.slice(key.length)
            };
        }
    }
    throw new Error("missing day period i.e. " + Object.keys(offsets).join(", "));
}
/**
 * Returns factor -1 or 1 depending on BC or AD
 * @param token
 * @param remaining
 * @param locale
 * @returns [factor, remaining]
 */
function stripEra(token, remaining, locale) {
    var allowed;
    switch (token.length) {
        case 4:
            allowed = locale.eraWide;
            break;
        case 5:
            allowed = locale.eraNarrow;
            break;
        default:
            allowed = locale.eraAbbreviated;
            break;
    }
    var result = stripStrings(token, remaining, allowed);
    return [allowed.indexOf(result.chosen) === 0 ? 1 : -1, result.remaining];
}
function stripQuarter(token, remaining, locale) {
    var quarterLetter;
    var quarterWord;
    var quarterAbbreviations;
    switch (token.symbol) {
        case "Q":
            quarterLetter = locale.quarterLetter;
            quarterWord = locale.quarterWord;
            quarterAbbreviations = locale.quarterAbbreviations;
            break;
        case "q": {
            quarterLetter = locale.standAloneQuarterLetter;
            quarterWord = locale.standAloneQuarterWord;
            quarterAbbreviations = locale.standAloneQuarterAbbreviations;
            break;
        }
        /* istanbul ignore next */
        default:
            /* istanbul ignore next */
            throw new Error("invalid quarter pattern");
    }
    var allowed;
    switch (token.length) {
        case 1:
        case 5:
            return stripNumber(remaining, 1);
        case 2:
            return stripNumber(remaining, 2);
        case 3:
            allowed = [1, 2, 3, 4].map(function (n) { return quarterLetter + n.toString(10); });
            break;
        case 4:
            allowed = quarterAbbreviations.map(function (a) { return a + " " + quarterWord; });
            break;
        /* istanbul ignore next */
        default:
            /* istanbul ignore next */
            throw new Error("invalid quarter pattern");
    }
    var r = stripStrings(token, remaining, allowed);
    return { n: allowed.indexOf(r.chosen) + 1, remaining: r.remaining };
}
function stripMonth(token, remaining, locale) {
    var shortMonthNames;
    var longMonthNames;
    var monthLetters;
    switch (token.symbol) {
        case "M":
            shortMonthNames = locale.shortMonthNames;
            longMonthNames = locale.longMonthNames;
            monthLetters = locale.monthLetters;
            break;
        case "L":
            shortMonthNames = locale.standAloneShortMonthNames;
            longMonthNames = locale.standAloneLongMonthNames;
            monthLetters = locale.standAloneMonthLetters;
            break;
        /* istanbul ignore next */
        default:
            /* istanbul ignore next */
            throw new Error("invalid month pattern");
    }
    var allowed;
    switch (token.length) {
        case 1:
        case 2:
            return stripNumber(remaining, 2);
        case 3:
            allowed = shortMonthNames;
            break;
        case 4:
            allowed = longMonthNames;
            break;
        case 5:
            allowed = monthLetters;
            break;
        /* istanbul ignore next */
        default:
            /* istanbul ignore next */
            throw new Error("invalid month pattern");
    }
    var r = stripStrings(token, remaining, allowed);
    return { n: allowed.indexOf(r.chosen) + 1, remaining: r.remaining };
}
function stripHour(token, remaining) {
    var result = stripNumber(remaining, 2);
    switch (token.symbol) {
        case "h":
            if (result.n === 12) {
                result.n = 0;
            }
            break;
        case "H":
            // nothing, in range 0-23
            break;
        case "K":
            // nothing, in range 0-11
            break;
        case "k":
            result.n -= 1;
            break;
    }
    return result;
}
function stripSecond(token, remaining) {
    switch (token.symbol) {
        case "s":
            return stripNumber(remaining, 2);
        case "S":
            return stripNumber(remaining, token.length);
        case "A":
            return stripNumber(remaining, 8);
        /* istanbul ignore next */
        default:
            /* istanbul ignore next */
            throw new Error("invalid seconds pattern");
    }
}
function stripNumber(s, maxLength) {
    var result = {
        n: NaN,
        remaining: s
    };
    var numberString = "";
    while (numberString.length < maxLength && result.remaining.length > 0 && result.remaining.charAt(0).match(/\d/)) {
        numberString += result.remaining.charAt(0);
        result.remaining = result.remaining.substr(1);
    }
    // remove leading zeroes
    while (numberString.charAt(0) === "0" && numberString.length > 1) {
        numberString = numberString.substr(1);
    }
    result.n = parseInt(numberString, 10);
    if (numberString === "" || !Number.isFinite(result.n)) {
        throw new Error("expected a number but got '" + numberString + "'");
    }
    return result;
}
function stripStrings(token, remaining, allowed) {
    // match longest possible string; sort keys by length descending
    var sortedKeys = allowed.slice()
        .sort(function (a, b) { return (a.length < b.length ? 1 : a.length > b.length ? -1 : 0); });
    var upper = remaining.toUpperCase();
    for (var _i = 0, sortedKeys_2 = sortedKeys; _i < sortedKeys_2.length; _i++) {
        var key = sortedKeys_2[_i];
        if (upper.startsWith(key.toUpperCase())) {
            return {
                chosen: key,
                remaining: remaining.slice(key.length)
            };
        }
    }
    throw new Error("invalid " + token_1.TokenType[token.type].toLowerCase() + ", expected one of " + allowed.join(", "));
}

},{"./basics":2,"./locale":8,"./timezone":14,"./token":15}],11:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Periodic interval functions
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
var basics_1 = require("./basics");
var basics = require("./basics");
var datetime_1 = require("./datetime");
var duration_1 = require("./duration");
var timezone_1 = require("./timezone");
/**
 * Specifies how the period should repeat across the day
 * during DST changes.
 */
var PeriodDst;
(function (PeriodDst) {
    /**
     * Keep repeating in similar intervals measured in UTC,
     * unaffected by Daylight Saving Time.
     * E.g. a repetition of one hour will take one real hour
     * every time, even in a time zone with DST.
     * Leap seconds, leap days and month length
     * differences will still make the intervals different.
     */
    PeriodDst[PeriodDst["RegularIntervals"] = 0] = "RegularIntervals";
    /**
     * Ensure that the time at which the intervals occur stay
     * at the same place in the day, local time. So e.g.
     * a period of one day, referenceing at 8:05AM Europe/Amsterdam time
     * will always reference at 8:05 Europe/Amsterdam. This means that
     * in UTC time, some intervals will be 25 hours and some
     * 23 hours during DST changes.
     * Another example: an hourly interval will be hourly in local time,
     * skipping an hour in UTC for a DST backward change.
     */
    PeriodDst[PeriodDst["RegularLocalTime"] = 1] = "RegularLocalTime";
    /**
     * End-of-enum marker
     */
    PeriodDst[PeriodDst["MAX"] = 2] = "MAX";
})(PeriodDst = exports.PeriodDst || (exports.PeriodDst = {}));
/**
 * Convert a PeriodDst to a string: "regular intervals" or "regular local time"
 */
function periodDstToString(p) {
    switch (p) {
        case PeriodDst.RegularIntervals: return "regular intervals";
        case PeriodDst.RegularLocalTime: return "regular local time";
        /* istanbul ignore next */
        default:
            /* istanbul ignore if */
            /* istanbul ignore next */
            if (true) {
                throw new Error("Unknown PeriodDst");
            }
    }
}
exports.periodDstToString = periodDstToString;
/**
 * Repeating time period: consists of a reference date and
 * a time length. This class accounts for leap seconds and leap days.
 */
var Period = /** @class */ (function () {
    /**
     * Constructor implementation. See other constructors for explanation.
     */
    function Period(a, amountOrInterval, unitOrDst, givenDst) {
        /**
         * Allow not using instanceof
         */
        this.kind = "Period";
        var reference;
        var interval;
        var dst = PeriodDst.RegularLocalTime;
        if (datetime_1.isDateTime(a)) {
            reference = a;
            if (typeof (amountOrInterval) === "object") {
                interval = amountOrInterval;
                dst = unitOrDst;
            }
            else {
                assert_1.default(typeof unitOrDst === "number" && unitOrDst >= 0 && unitOrDst < basics_1.TimeUnit.MAX, "Invalid unit");
                interval = new duration_1.Duration(amountOrInterval, unitOrDst);
                dst = givenDst;
            }
            if (typeof dst !== "number") {
                dst = PeriodDst.RegularLocalTime;
            }
        }
        else {
            reference = new datetime_1.DateTime(a.reference);
            interval = new duration_1.Duration(a.duration);
            dst = a.periodDst === "regular" ? PeriodDst.RegularIntervals : PeriodDst.RegularLocalTime;
        }
        assert_1.default(dst >= 0 && dst < PeriodDst.MAX, "Invalid PeriodDst setting");
        assert_1.default(!!reference, "Reference time not given");
        assert_1.default(interval.amount() > 0, "Amount must be positive non-zero.");
        assert_1.default(Math.floor(interval.amount()) === interval.amount(), "Amount must be a whole number");
        this._reference = reference;
        this._interval = interval;
        this._dst = dst;
        this._calcInternalValues();
        // regular local time keeping is only supported if we can reset each day
        // Note we use internal amounts to decide this because actually it is supported if
        // the input is a multiple of one day.
        if (this._dstRelevant() && dst === PeriodDst.RegularLocalTime) {
            switch (this._intInterval.unit()) {
                case basics_1.TimeUnit.Millisecond:
                    assert_1.default(this._intInterval.amount() < 86400000, "When using Hour, Minute or (Milli)Second units, with Regular Local Times, " +
                        "then the amount must be either less than a day or a multiple of the next unit.");
                    break;
                case basics_1.TimeUnit.Second:
                    assert_1.default(this._intInterval.amount() < 86400, "When using Hour, Minute or (Milli)Second units, with Regular Local Times, " +
                        "then the amount must be either less than a day or a multiple of the next unit.");
                    break;
                case basics_1.TimeUnit.Minute:
                    assert_1.default(this._intInterval.amount() < 1440, "When using Hour, Minute or (Milli)Second units, with Regular Local Times, " +
                        "then the amount must be either less than a day or a multiple of the next unit.");
                    break;
                case basics_1.TimeUnit.Hour:
                    assert_1.default(this._intInterval.amount() < 24, "When using Hour, Minute or (Milli)Second units, with Regular Local Times, " +
                        "then the amount must be either less than a day or a multiple of the next unit.");
                    break;
            }
        }
    }
    /**
     * Return a fresh copy of the period
     */
    Period.prototype.clone = function () {
        return new Period(this._reference, this._interval, this._dst);
    };
    /**
     * The reference date
     */
    Period.prototype.reference = function () {
        return this._reference;
    };
    /**
     * DEPRECATED: old name for the reference date
     */
    Period.prototype.start = function () {
        return this._reference;
    };
    /**
     * The interval
     */
    Period.prototype.interval = function () {
        return this._interval.clone();
    };
    /**
     * The amount of units of the interval
     */
    Period.prototype.amount = function () {
        return this._interval.amount();
    };
    /**
     * The unit of the interval
     */
    Period.prototype.unit = function () {
        return this._interval.unit();
    };
    /**
     * The dst handling mode
     */
    Period.prototype.dst = function () {
        return this._dst;
    };
    /**
     * The first occurrence of the period greater than
     * the given date. The given date need not be at a period boundary.
     * Pre: the fromdate and reference date must either both have timezones or not
     * @param fromDate: the date after which to return the next date
     * @return the first date matching the period after fromDate, given in the same zone as the fromDate.
     */
    Period.prototype.findFirst = function (fromDate) {
        assert_1.default(!!this._intReference.zone() === !!fromDate.zone(), "The fromDate and reference date must both be aware or unaware");
        var approx;
        var approx2;
        var approxMin;
        var periods;
        var diff;
        var newYear;
        var remainder;
        var imax;
        var imin;
        var imid;
        var normalFrom = this._normalizeDay(fromDate.toZone(this._intReference.zone()));
        if (this._intInterval.amount() === 1) {
            // simple cases: amount equals 1 (eliminates need for searching for referenceing point)
            if (this._intDst === PeriodDst.RegularIntervals) {
                // apply to UTC time
                switch (this._intInterval.unit()) {
                    case basics_1.TimeUnit.Millisecond:
                        approx = new datetime_1.DateTime(normalFrom.utcYear(), normalFrom.utcMonth(), normalFrom.utcDay(), normalFrom.utcHour(), normalFrom.utcMinute(), normalFrom.utcSecond(), normalFrom.utcMillisecond(), timezone_1.TimeZone.utc());
                        break;
                    case basics_1.TimeUnit.Second:
                        approx = new datetime_1.DateTime(normalFrom.utcYear(), normalFrom.utcMonth(), normalFrom.utcDay(), normalFrom.utcHour(), normalFrom.utcMinute(), normalFrom.utcSecond(), this._intReference.utcMillisecond(), timezone_1.TimeZone.utc());
                        break;
                    case basics_1.TimeUnit.Minute:
                        approx = new datetime_1.DateTime(normalFrom.utcYear(), normalFrom.utcMonth(), normalFrom.utcDay(), normalFrom.utcHour(), normalFrom.utcMinute(), this._intReference.utcSecond(), this._intReference.utcMillisecond(), timezone_1.TimeZone.utc());
                        break;
                    case basics_1.TimeUnit.Hour:
                        approx = new datetime_1.DateTime(normalFrom.utcYear(), normalFrom.utcMonth(), normalFrom.utcDay(), normalFrom.utcHour(), this._intReference.utcMinute(), this._intReference.utcSecond(), this._intReference.utcMillisecond(), timezone_1.TimeZone.utc());
                        break;
                    case basics_1.TimeUnit.Day:
                        approx = new datetime_1.DateTime(normalFrom.utcYear(), normalFrom.utcMonth(), normalFrom.utcDay(), this._intReference.utcHour(), this._intReference.utcMinute(), this._intReference.utcSecond(), this._intReference.utcMillisecond(), timezone_1.TimeZone.utc());
                        break;
                    case basics_1.TimeUnit.Month:
                        approx = new datetime_1.DateTime(normalFrom.utcYear(), normalFrom.utcMonth(), this._intReference.utcDay(), this._intReference.utcHour(), this._intReference.utcMinute(), this._intReference.utcSecond(), this._intReference.utcMillisecond(), timezone_1.TimeZone.utc());
                        break;
                    case basics_1.TimeUnit.Year:
                        approx = new datetime_1.DateTime(normalFrom.utcYear(), this._intReference.utcMonth(), this._intReference.utcDay(), this._intReference.utcHour(), this._intReference.utcMinute(), this._intReference.utcSecond(), this._intReference.utcMillisecond(), timezone_1.TimeZone.utc());
                        break;
                    /* istanbul ignore next */
                    default:
                        /* istanbul ignore if */
                        /* istanbul ignore next */
                        if (true) {
                            throw new Error("Unknown TimeUnit");
                        }
                }
                while (!approx.greaterThan(fromDate)) {
                    approx = approx.add(this._intInterval.amount(), this._intInterval.unit());
                }
            }
            else {
                // Try to keep regular local intervals
                switch (this._intInterval.unit()) {
                    case basics_1.TimeUnit.Millisecond:
                        approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), normalFrom.hour(), normalFrom.minute(), normalFrom.second(), normalFrom.millisecond(), this._intReference.zone());
                        break;
                    case basics_1.TimeUnit.Second:
                        approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), normalFrom.hour(), normalFrom.minute(), normalFrom.second(), this._intReference.millisecond(), this._intReference.zone());
                        break;
                    case basics_1.TimeUnit.Minute:
                        approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), normalFrom.hour(), normalFrom.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                        break;
                    case basics_1.TimeUnit.Hour:
                        approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), normalFrom.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                        break;
                    case basics_1.TimeUnit.Day:
                        approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), this._intReference.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                        break;
                    case basics_1.TimeUnit.Month:
                        approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), this._intReference.day(), this._intReference.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                        break;
                    case basics_1.TimeUnit.Year:
                        approx = new datetime_1.DateTime(normalFrom.year(), this._intReference.month(), this._intReference.day(), this._intReference.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                        break;
                    /* istanbul ignore next */
                    default:
                        /* istanbul ignore if */
                        /* istanbul ignore next */
                        if (true) {
                            throw new Error("Unknown TimeUnit");
                        }
                }
                while (!approx.greaterThan(normalFrom)) {
                    approx = approx.addLocal(this._intInterval.amount(), this._intInterval.unit());
                }
            }
        }
        else {
            // Amount is not 1,
            if (this._intDst === PeriodDst.RegularIntervals) {
                // apply to UTC time
                switch (this._intInterval.unit()) {
                    case basics_1.TimeUnit.Millisecond:
                        diff = normalFrom.diff(this._intReference).milliseconds();
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.add(periods * this._intInterval.amount(), this._intInterval.unit());
                        break;
                    case basics_1.TimeUnit.Second:
                        diff = normalFrom.diff(this._intReference).seconds();
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.add(periods * this._intInterval.amount(), this._intInterval.unit());
                        break;
                    case basics_1.TimeUnit.Minute:
                        // only 25 leap seconds have ever been added so this should still be OK.
                        diff = normalFrom.diff(this._intReference).minutes();
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.add(periods * this._intInterval.amount(), this._intInterval.unit());
                        break;
                    case basics_1.TimeUnit.Hour:
                        diff = normalFrom.diff(this._intReference).hours();
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.add(periods * this._intInterval.amount(), this._intInterval.unit());
                        break;
                    case basics_1.TimeUnit.Day:
                        diff = normalFrom.diff(this._intReference).hours() / 24;
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.add(periods * this._intInterval.amount(), this._intInterval.unit());
                        break;
                    case basics_1.TimeUnit.Month:
                        diff = (normalFrom.utcYear() - this._intReference.utcYear()) * 12 +
                            (normalFrom.utcMonth() - this._intReference.utcMonth()) - 1;
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.add(periods * this._intInterval.amount(), this._intInterval.unit());
                        break;
                    case basics_1.TimeUnit.Year:
                        // The -1 below is because the day-of-month of reference date may be after the day of the fromDate
                        diff = normalFrom.year() - this._intReference.year() - 1;
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.add(periods * this._intInterval.amount(), basics_1.TimeUnit.Year);
                        break;
                    /* istanbul ignore next */
                    default:
                        /* istanbul ignore if */
                        /* istanbul ignore next */
                        if (true) {
                            throw new Error("Unknown TimeUnit");
                        }
                }
                while (!approx.greaterThan(fromDate)) {
                    approx = approx.add(this._intInterval.amount(), this._intInterval.unit());
                }
            }
            else {
                // Try to keep regular local times. If the unit is less than a day, we reference each day anew
                switch (this._intInterval.unit()) {
                    case basics_1.TimeUnit.Millisecond:
                        if (this._intInterval.amount() < 1000 && (1000 % this._intInterval.amount()) === 0) {
                            // optimization: same millisecond each second, so just take the fromDate
                            // minus one second with the this._intReference milliseconds
                            approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), normalFrom.hour(), normalFrom.minute(), normalFrom.second(), this._intReference.millisecond(), this._intReference.zone())
                                .subLocal(1, basics_1.TimeUnit.Second);
                        }
                        else {
                            // per constructor assert, the seconds are less than a day, so just go the fromDate reference-of-day
                            approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), this._intReference.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                            // since we start counting from this._intReference each day, we have to
                            // take care of the shorter interval at the boundary
                            remainder = Math.floor((86400000) % this._intInterval.amount());
                            if (approx.greaterThan(normalFrom)) {
                                // todo
                                /* istanbul ignore if */
                                if (approx.subLocal(remainder, basics_1.TimeUnit.Millisecond).greaterThan(normalFrom)) {
                                    // normalFrom lies outside the boundary period before the reference date
                                    approx = approx.subLocal(1, basics_1.TimeUnit.Day);
                                }
                            }
                            else {
                                if (approx.addLocal(1, basics_1.TimeUnit.Day).subLocal(remainder, basics_1.TimeUnit.Millisecond).lessEqual(normalFrom)) {
                                    // normalFrom lies in the boundary period, move to the next day
                                    approx = approx.addLocal(1, basics_1.TimeUnit.Day);
                                }
                            }
                            // optimization: binary search
                            imax = Math.floor((86400000) / this._intInterval.amount());
                            imin = 0;
                            while (imax >= imin) {
                                // calculate the midpoint for roughly equal partition
                                imid = Math.floor((imin + imax) / 2);
                                approx2 = approx.addLocal(imid * this._intInterval.amount(), basics_1.TimeUnit.Millisecond);
                                approxMin = approx2.subLocal(this._intInterval.amount(), basics_1.TimeUnit.Millisecond);
                                if (approx2.greaterThan(normalFrom) && approxMin.lessEqual(normalFrom)) {
                                    approx = approx2;
                                    break;
                                }
                                else if (approx2.lessEqual(normalFrom)) {
                                    // change min index to search upper subarray
                                    imin = imid + 1;
                                }
                                else {
                                    // change max index to search lower subarray
                                    imax = imid - 1;
                                }
                            }
                        }
                        break;
                    case basics_1.TimeUnit.Second:
                        if (this._intInterval.amount() < 60 && (60 % this._intInterval.amount()) === 0) {
                            // optimization: same second each minute, so just take the fromDate
                            // minus one minute with the this._intReference seconds
                            approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), normalFrom.hour(), normalFrom.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone())
                                .subLocal(1, basics_1.TimeUnit.Minute);
                        }
                        else {
                            // per constructor assert, the seconds are less than a day, so just go the fromDate reference-of-day
                            approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), this._intReference.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                            // since we start counting from this._intReference each day, we have to take
                            // are of the shorter interval at the boundary
                            remainder = Math.floor((86400) % this._intInterval.amount());
                            if (approx.greaterThan(normalFrom)) {
                                if (approx.subLocal(remainder, basics_1.TimeUnit.Second).greaterThan(normalFrom)) {
                                    // normalFrom lies outside the boundary period before the reference date
                                    approx = approx.subLocal(1, basics_1.TimeUnit.Day);
                                }
                            }
                            else {
                                if (approx.addLocal(1, basics_1.TimeUnit.Day).subLocal(remainder, basics_1.TimeUnit.Second).lessEqual(normalFrom)) {
                                    // normalFrom lies in the boundary period, move to the next day
                                    approx = approx.addLocal(1, basics_1.TimeUnit.Day);
                                }
                            }
                            // optimization: binary search
                            imax = Math.floor((86400) / this._intInterval.amount());
                            imin = 0;
                            while (imax >= imin) {
                                // calculate the midpoint for roughly equal partition
                                imid = Math.floor((imin + imax) / 2);
                                approx2 = approx.addLocal(imid * this._intInterval.amount(), basics_1.TimeUnit.Second);
                                approxMin = approx2.subLocal(this._intInterval.amount(), basics_1.TimeUnit.Second);
                                if (approx2.greaterThan(normalFrom) && approxMin.lessEqual(normalFrom)) {
                                    approx = approx2;
                                    break;
                                }
                                else if (approx2.lessEqual(normalFrom)) {
                                    // change min index to search upper subarray
                                    imin = imid + 1;
                                }
                                else {
                                    // change max index to search lower subarray
                                    imax = imid - 1;
                                }
                            }
                        }
                        break;
                    case basics_1.TimeUnit.Minute:
                        if (this._intInterval.amount() < 60 && (60 % this._intInterval.amount()) === 0) {
                            // optimization: same hour this._intReferenceary each time, so just take the fromDate minus one hour
                            // with the this._intReference minutes, seconds
                            approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), normalFrom.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone())
                                .subLocal(1, basics_1.TimeUnit.Hour);
                        }
                        else {
                            // per constructor assert, the seconds fit in a day, so just go the fromDate previous day
                            approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), this._intReference.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                            // since we start counting from this._intReference each day,
                            // we have to take care of the shorter interval at the boundary
                            remainder = Math.floor((24 * 60) % this._intInterval.amount());
                            if (approx.greaterThan(normalFrom)) {
                                if (approx.subLocal(remainder, basics_1.TimeUnit.Minute).greaterThan(normalFrom)) {
                                    // normalFrom lies outside the boundary period before the reference date
                                    approx = approx.subLocal(1, basics_1.TimeUnit.Day);
                                }
                            }
                            else {
                                if (approx.addLocal(1, basics_1.TimeUnit.Day).subLocal(remainder, basics_1.TimeUnit.Minute).lessEqual(normalFrom)) {
                                    // normalFrom lies in the boundary period, move to the next day
                                    approx = approx.addLocal(1, basics_1.TimeUnit.Day);
                                }
                            }
                        }
                        break;
                    case basics_1.TimeUnit.Hour:
                        approx = new datetime_1.DateTime(normalFrom.year(), normalFrom.month(), normalFrom.day(), this._intReference.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                        // since we start counting from this._intReference each day,
                        // we have to take care of the shorter interval at the boundary
                        remainder = Math.floor(24 % this._intInterval.amount());
                        if (approx.greaterThan(normalFrom)) {
                            if (approx.subLocal(remainder, basics_1.TimeUnit.Hour).greaterThan(normalFrom)) {
                                // normalFrom lies outside the boundary period before the reference date
                                approx = approx.subLocal(1, basics_1.TimeUnit.Day);
                            }
                        }
                        else {
                            if (approx.addLocal(1, basics_1.TimeUnit.Day).subLocal(remainder, basics_1.TimeUnit.Hour).lessEqual(normalFrom)) {
                                // normalFrom lies in the boundary period, move to the next day
                                approx = approx.addLocal(1, basics_1.TimeUnit.Day);
                            }
                        }
                        break;
                    case basics_1.TimeUnit.Day:
                        // we don't have leap days, so we can approximate by calculating with UTC timestamps
                        diff = normalFrom.diff(this._intReference).hours() / 24;
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.addLocal(periods * this._intInterval.amount(), this._intInterval.unit());
                        break;
                    case basics_1.TimeUnit.Month:
                        diff = (normalFrom.year() - this._intReference.year()) * 12 +
                            (normalFrom.month() - this._intReference.month());
                        periods = Math.floor(diff / this._intInterval.amount());
                        approx = this._intReference.addLocal(this._interval.multiply(periods));
                        break;
                    case basics_1.TimeUnit.Year:
                        // The -1 below is because the day-of-month of reference date may be after the day of the fromDate
                        diff = normalFrom.year() - this._intReference.year() - 1;
                        periods = Math.floor(diff / this._intInterval.amount());
                        newYear = this._intReference.year() + periods * this._intInterval.amount();
                        approx = new datetime_1.DateTime(newYear, this._intReference.month(), this._intReference.day(), this._intReference.hour(), this._intReference.minute(), this._intReference.second(), this._intReference.millisecond(), this._intReference.zone());
                        break;
                    /* istanbul ignore next */
                    default:
                        /* istanbul ignore if */
                        /* istanbul ignore next */
                        if (true) {
                            throw new Error("Unknown TimeUnit");
                        }
                }
                while (!approx.greaterThan(normalFrom)) {
                    approx = approx.addLocal(this._intInterval.amount(), this._intInterval.unit());
                }
            }
        }
        return this._correctDay(approx).convert(fromDate.zone());
    };
    /**
     * Returns the next timestamp in the period. The given timestamp must
     * be at a period boundary, otherwise the answer is incorrect.
     * This function has MUCH better performance than findFirst.
     * Returns the datetime "count" times away from the given datetime.
     * @param prev	Boundary date. Must have a time zone (any time zone) iff the period reference date has one.
     * @param count	Number of periods to add. Optional. Must be an integer number, may be negative.
     * @return (prev + count * period), in the same timezone as prev.
     */
    Period.prototype.findNext = function (prev, count) {
        if (count === void 0) { count = 1; }
        assert_1.default(!!prev, "Prev must be given");
        assert_1.default(!!this._intReference.zone() === !!prev.zone(), "The fromDate and referenceDate must both be aware or unaware");
        assert_1.default(typeof (count) === "number", "Count must be a number");
        assert_1.default(Math.floor(count) === count, "Count must be an integer");
        var normalizedPrev = this._normalizeDay(prev.toZone(this._reference.zone()));
        if (this._intDst === PeriodDst.RegularIntervals) {
            return this._correctDay(normalizedPrev.add(this._intInterval.amount() * count, this._intInterval.unit())).convert(prev.zone());
        }
        else {
            return this._correctDay(normalizedPrev.addLocal(this._intInterval.amount() * count, this._intInterval.unit())).convert(prev.zone());
        }
    };
    /**
     * The last occurrence of the period less than
     * the given date. The given date need not be at a period boundary.
     * Pre: the fromdate and the period reference date must either both have timezones or not
     * @param fromDate: the date before which to return the next date
     * @return the last date matching the period before fromDate, given
     *         in the same zone as the fromDate.
     */
    Period.prototype.findLast = function (from) {
        var result = this.findPrev(this.findFirst(from));
        if (result.equals(from)) {
            result = this.findPrev(result);
        }
        return result;
    };
    /**
     * Returns the previous timestamp in the period. The given timestamp must
     * be at a period boundary, otherwise the answer is incorrect.
     * @param prev	Boundary date. Must have a time zone (any time zone) iff the period reference date has one.
     * @param count	Number of periods to subtract. Optional. Must be an integer number, may be negative.
     * @return (next - count * period), in the same timezone as next.
     */
    Period.prototype.findPrev = function (next, count) {
        if (count === void 0) { count = 1; }
        return this.findNext(next, -1 * count);
    };
    /**
     * Checks whether the given date is on a period boundary
     * (expensive!)
     */
    Period.prototype.isBoundary = function (occurrence) {
        if (!occurrence) {
            return false;
        }
        assert_1.default(!!this._intReference.zone() === !!occurrence.zone(), "The occurrence and referenceDate must both be aware or unaware");
        return (this.findFirst(occurrence.sub(duration_1.Duration.milliseconds(1))).equals(occurrence));
    };
    /**
     * Returns true iff this period has the same effect as the given one.
     * i.e. a period of 24 hours is equal to one of 1 day if they have the same UTC reference moment
     * and same dst.
     */
    Period.prototype.equals = function (other) {
        // note we take the non-normalized _reference because this has an influence on the outcome
        if (!this.isBoundary(other._reference) || !this._intInterval.equals(other._intInterval)) {
            return false;
        }
        var refZone = this._reference.zone();
        var otherZone = other._reference.zone();
        var thisIsRegular = (this._intDst === PeriodDst.RegularIntervals || !refZone || refZone.isUtc());
        var otherIsRegular = (other._intDst === PeriodDst.RegularIntervals || !otherZone || otherZone.isUtc());
        if (thisIsRegular && otherIsRegular) {
            return true;
        }
        if (this._intDst === other._intDst && refZone && otherZone && refZone.equals(otherZone)) {
            return true;
        }
        return false;
    };
    /**
     * Returns true iff this period was constructed with identical arguments to the other one.
     */
    Period.prototype.identical = function (other) {
        return (this._reference.identical(other._reference)
            && this._interval.identical(other._interval)
            && this._dst === other._dst);
    };
    /**
     * Returns an ISO duration string e.g.
     * 2014-01-01T12:00:00.000+01:00/P1H
     * 2014-01-01T12:00:00.000+01:00/PT1M   (one minute)
     * 2014-01-01T12:00:00.000+01:00/P1M   (one month)
     */
    Period.prototype.toIsoString = function () {
        return this._reference.toIsoString() + "/" + this._interval.toIsoString();
    };
    /**
     * A string representation e.g.
     * "10 years, referenceing at 2014-03-01T12:00:00 Europe/Amsterdam, keeping regular intervals".
     */
    Period.prototype.toString = function () {
        var result = this._interval.toString() + ", referenceing at " + this._reference.toString();
        // only add the DST handling if it is relevant
        if (this._dstRelevant()) {
            result += ", keeping " + periodDstToString(this._dst);
        }
        return result;
    };
    /**
     * Returns a JSON-compatible representation of this period
     */
    Period.prototype.toJson = function () {
        return {
            reference: this.reference().toString(),
            duration: this.interval().toString(),
            periodDst: this.dst() === PeriodDst.RegularIntervals ? "regular" : "local"
        };
    };
    /**
     * Corrects the difference between _reference and _intReference.
     */
    Period.prototype._correctDay = function (d) {
        if (this._reference !== this._intReference) {
            return new datetime_1.DateTime(d.year(), d.month(), Math.min(basics.daysInMonth(d.year(), d.month()), this._reference.day()), d.hour(), d.minute(), d.second(), d.millisecond(), d.zone());
        }
        else {
            return d;
        }
    };
    /**
     * If this._internalUnit in [Month, Year], normalizes the day-of-month
     * to <= 28.
     * @return a new date if different, otherwise the exact same object (no clone!)
     */
    Period.prototype._normalizeDay = function (d, anymonth) {
        if (anymonth === void 0) { anymonth = true; }
        if ((this._intInterval.unit() === basics_1.TimeUnit.Month && d.day() > 28)
            || (this._intInterval.unit() === basics_1.TimeUnit.Year && (d.month() === 2 || anymonth) && d.day() > 28)) {
            return new datetime_1.DateTime(d.year(), d.month(), 28, d.hour(), d.minute(), d.second(), d.millisecond(), d.zone());
        }
        else {
            return d; // save on time by not returning a clone
        }
    };
    /**
     * Returns true if DST handling is relevant for us.
     * (i.e. if the reference time zone has DST)
     */
    Period.prototype._dstRelevant = function () {
        var zone = this._reference.zone();
        return !!(zone
            && zone.kind() === timezone_1.TimeZoneKind.Proper
            && zone.hasDst());
    };
    /**
     * Normalize the values where possible - not all values
     * are convertible into one another. Weeks are converted to days.
     * E.g. more than 60 minutes is transferred to hours,
     * but seconds cannot be transferred to minutes due to leap seconds.
     * Weeks are converted back to days.
     */
    Period.prototype._calcInternalValues = function () {
        // normalize any above-unit values
        var intAmount = this._interval.amount();
        var intUnit = this._interval.unit();
        if (intUnit === basics_1.TimeUnit.Millisecond && intAmount >= 1000 && intAmount % 1000 === 0) {
            // note this won't work if we account for leap seconds
            intAmount = intAmount / 1000;
            intUnit = basics_1.TimeUnit.Second;
        }
        if (intUnit === basics_1.TimeUnit.Second && intAmount >= 60 && intAmount % 60 === 0) {
            // note this won't work if we account for leap seconds
            intAmount = intAmount / 60;
            intUnit = basics_1.TimeUnit.Minute;
        }
        if (intUnit === basics_1.TimeUnit.Minute && intAmount >= 60 && intAmount % 60 === 0) {
            intAmount = intAmount / 60;
            intUnit = basics_1.TimeUnit.Hour;
        }
        if (intUnit === basics_1.TimeUnit.Hour && intAmount >= 24 && intAmount % 24 === 0) {
            intAmount = intAmount / 24;
            intUnit = basics_1.TimeUnit.Day;
        }
        // now remove weeks so we have one less case to worry about
        if (intUnit === basics_1.TimeUnit.Week) {
            intAmount = intAmount * 7;
            intUnit = basics_1.TimeUnit.Day;
        }
        if (intUnit === basics_1.TimeUnit.Month && intAmount >= 12 && intAmount % 12 === 0) {
            intAmount = intAmount / 12;
            intUnit = basics_1.TimeUnit.Year;
        }
        this._intInterval = new duration_1.Duration(intAmount, intUnit);
        // normalize dst handling
        if (this._dstRelevant()) {
            this._intDst = this._dst;
        }
        else {
            this._intDst = PeriodDst.RegularIntervals;
        }
        // normalize reference day
        this._intReference = this._normalizeDay(this._reference, false);
    };
    return Period;
}());
exports.Period = Period;
/**
 * Returns true iff the given json value represents a valid period JSON
 * @param json
 * @throws nothing
 */
function isValidPeriodJson(json) {
    if (typeof json !== "object") {
        return false;
    }
    if (json === null) {
        return false;
    }
    if (typeof json.duration !== "string") {
        return false;
    }
    if (typeof json.periodDst !== "string") {
        return false;
    }
    if (typeof json.reference !== "string") {
        return false;
    }
    if (!["regular", "local"].includes(json.periodDst)) {
        return false;
    }
    try {
        // tslint:disable-next-line: no-unused-expression
        new Period(json);
    }
    catch (_a) {
        return false;
    }
    return true;
}
exports.isValidPeriodJson = isValidPeriodJson;
/**
 * Checks if a given object is of type Period. Note that it does not work for sub classes. However, use this to be robust
 * against different versions of the library in one process instead of instanceof
 * @param value Value to check
 * @throws nothing
 */
function isPeriod(value) {
    return typeof value === "object" && value !== null && value.kind === "Period";
}
exports.isPeriod = isPeriod;

},{"./assert":1,"./basics":2,"./datetime":3,"./duration":4,"./timezone":14}],12:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * String utility functions
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pad a string by adding characters to the beginning.
 * @param s	the string to pad
 * @param width	the desired minimum string width
 * @param char	the single character to pad with
 * @return	the padded string
 */
function padLeft(s, width, char) {
    var padding = "";
    for (var i = 0; i < (width - s.length); i++) {
        padding += char;
    }
    return padding + s;
}
exports.padLeft = padLeft;
/**
 * Pad a string by adding characters to the end.
 * @param s	the string to pad
 * @param width	the desired minimum string width
 * @param char	the single character to pad with
 * @return	the padded string
 */
function padRight(s, width, char) {
    var padding = "";
    for (var i = 0; i < (width - s.length); i++) {
        padding += char;
    }
    return s + padding;
}
exports.padRight = padRight;

},{}],13:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default time source, returns actual time
 */
var RealTimeSource = /** @class */ (function () {
    function RealTimeSource() {
    }
    RealTimeSource.prototype.now = function () {
        /* istanbul ignore if */
        /* istanbul ignore next */
        if (true) {
            return new Date();
        }
    };
    return RealTimeSource;
}());
exports.RealTimeSource = RealTimeSource;

},{}],14:[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Time zone representation and offset calculation
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
var basics_1 = require("./basics");
var strings = require("./strings");
var tz_database_1 = require("./tz-database");
/**
 * The local time zone for a given date as per OS settings. Note that time zones are cached
 * so you don't necessarily get a new object each time.
 */
function local() {
    return TimeZone.local();
}
exports.local = local;
/**
 * Coordinated Universal Time zone. Note that time zones are cached
 * so you don't necessarily get a new object each time.
 */
function utc() {
    return TimeZone.utc();
}
exports.utc = utc;
/**
 * See the descriptions for the other zone() method signatures.
 */
function zone(a, dst) {
    return TimeZone.zone(a, dst);
}
exports.zone = zone;
/**
 * The type of time zone
 */
var TimeZoneKind;
(function (TimeZoneKind) {
    /**
     * Local time offset as determined by JavaScript Date class.
     */
    TimeZoneKind[TimeZoneKind["Local"] = 0] = "Local";
    /**
     * Fixed offset from UTC, without DST.
     */
    TimeZoneKind[TimeZoneKind["Offset"] = 1] = "Offset";
    /**
     * IANA timezone managed through Olsen TZ database. Includes
     * DST if applicable.
     */
    TimeZoneKind[TimeZoneKind["Proper"] = 2] = "Proper";
})(TimeZoneKind = exports.TimeZoneKind || (exports.TimeZoneKind = {}));
/**
 * Time zone. The object is immutable because it is cached:
 * requesting a time zone twice yields the very same object.
 * Note that we use time zone offsets inverted w.r.t. JavaScript Date.getTimezoneOffset(),
 * i.e. offset 90 means +01:30.
 *
 * Time zones come in three flavors: the local time zone, as calculated by JavaScript Date,
 * a fixed offset ("+01:30") without DST, or a IANA timezone ("Europe/Amsterdam") with DST
 * applied depending on the time zone rules.
 */
var TimeZone = /** @class */ (function () {
    /**
     * Do not use this constructor, use the static
     * TimeZone.zone() method instead.
     * @param name NORMALIZED name, assumed to be correct
     * @param dst	Adhere to Daylight Saving Time if applicable, ignored for local time and fixed offsets
     */
    function TimeZone(name, dst) {
        if (dst === void 0) { dst = true; }
        /**
         * Allow not using instanceof
         */
        this.classKind = "TimeZone";
        this._name = name;
        this._dst = dst;
        if (name === "localtime") {
            this._kind = TimeZoneKind.Local;
        }
        else if (name.charAt(0) === "+" || name.charAt(0) === "-" || name.charAt(0).match(/\d/) || name === "Z") {
            this._kind = TimeZoneKind.Offset;
            this._offset = TimeZone.stringToOffset(name);
        }
        else {
            this._kind = TimeZoneKind.Proper;
            assert_1.default(tz_database_1.TzDatabase.instance().exists(name), "non-existing time zone name '" + name + "'");
        }
    }
    /**
     * The local time zone for a given date. Note that
     * the time zone varies with the date: amsterdam time for
     * 2014-01-01 is +01:00 and amsterdam time for 2014-07-01 is +02:00
     */
    TimeZone.local = function () {
        return TimeZone._findOrCreate("localtime", true);
    };
    /**
     * The UTC time zone.
     */
    TimeZone.utc = function () {
        return TimeZone._findOrCreate("UTC", true); // use 'true' for DST because we want it to display as "UTC", not "UTC without DST"
    };
    /**
     * Zone implementations
     */
    TimeZone.zone = function (a, dst) {
        if (dst === void 0) { dst = true; }
        var name = "";
        switch (typeof (a)) {
            case "string":
                {
                    var s = a;
                    if (s.indexOf("without DST") >= 0) {
                        dst = false;
                        s = s.slice(0, s.indexOf("without DST") - 1);
                    }
                    name = TimeZone._normalizeString(s);
                }
                break;
            case "number":
                {
                    var offset = a;
                    assert_1.default(offset > -24 * 60 && offset < 24 * 60, "TimeZone.zone(): offset out of range");
                    name = TimeZone.offsetToString(offset);
                }
                break;
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("TimeZone.zone(): Unexpected argument type \"" + typeof (a) + "\"");
                }
        }
        return TimeZone._findOrCreate(name, dst);
    };
    /**
     * Makes this class appear clonable. NOTE as time zone objects are cached you will NOT
     * actually get a clone but the same object.
     */
    TimeZone.prototype.clone = function () {
        return this;
    };
    /**
     * The time zone identifier. Can be an offset "-01:30" or an
     * IANA time zone name "Europe/Amsterdam", or "localtime" for
     * the local time zone.
     */
    TimeZone.prototype.name = function () {
        return this._name;
    };
    TimeZone.prototype.dst = function () {
        return this._dst;
    };
    /**
     * The kind of time zone (Local/Offset/Proper)
     */
    TimeZone.prototype.kind = function () {
        return this._kind;
    };
    /**
     * Equality operator. Maps zero offsets and different names for UTC onto
     * each other. Other time zones are not mapped onto each other.
     */
    TimeZone.prototype.equals = function (other) {
        if (this.isUtc() && other.isUtc()) {
            return true;
        }
        switch (this._kind) {
            case TimeZoneKind.Local: return (other.kind() === TimeZoneKind.Local);
            case TimeZoneKind.Offset: return (other.kind() === TimeZoneKind.Offset && this._offset === other._offset);
            case TimeZoneKind.Proper: return (other.kind() === TimeZoneKind.Proper
                && this._name === other._name
                && (this._dst === other._dst || !this.hasDst()));
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("Unknown time zone kind.");
                }
        }
    };
    /**
     * Returns true iff the constructor arguments were identical, so UTC !== GMT
     */
    TimeZone.prototype.identical = function (other) {
        switch (this._kind) {
            case TimeZoneKind.Local: return (other.kind() === TimeZoneKind.Local);
            case TimeZoneKind.Offset: return (other.kind() === TimeZoneKind.Offset && this._offset === other._offset);
            case TimeZoneKind.Proper: return (other.kind() === TimeZoneKind.Proper && this._name === other._name && this._dst === other._dst);
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("Unknown time zone kind.");
                }
        }
    };
    /**
     * Is this zone equivalent to UTC?
     */
    TimeZone.prototype.isUtc = function () {
        switch (this._kind) {
            case TimeZoneKind.Local: return false;
            case TimeZoneKind.Offset: return (this._offset === 0);
            case TimeZoneKind.Proper: return (tz_database_1.TzDatabase.instance().zoneIsUtc(this._name));
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    return false;
                }
        }
    };
    /**
     * Does this zone have Daylight Saving Time at all?
     */
    TimeZone.prototype.hasDst = function () {
        switch (this._kind) {
            case TimeZoneKind.Local: return false;
            case TimeZoneKind.Offset: return false;
            case TimeZoneKind.Proper: return (tz_database_1.TzDatabase.instance().hasDst(this._name));
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    return false;
                }
        }
    };
    TimeZone.prototype.offsetForUtc = function (a, month, day, hour, minute, second, milli) {
        var utcTime = (typeof a === "number" ? new basics_1.TimeStruct({ year: a, month: month, day: day, hour: hour, minute: minute, second: second, milli: milli }) :
            typeof a === "undefined" ? new basics_1.TimeStruct({}) :
                a);
        switch (this._kind) {
            case TimeZoneKind.Local: {
                var date = new Date(Date.UTC(utcTime.components.year, utcTime.components.month - 1, utcTime.components.day, utcTime.components.hour, utcTime.components.minute, utcTime.components.second, utcTime.components.milli));
                return -1 * date.getTimezoneOffset();
            }
            case TimeZoneKind.Offset: {
                return this._offset;
            }
            case TimeZoneKind.Proper: {
                if (this._dst) {
                    return tz_database_1.TzDatabase.instance().totalOffset(this._name, utcTime).minutes();
                }
                else {
                    return tz_database_1.TzDatabase.instance().standardOffset(this._name, utcTime).minutes();
                }
            }
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("unknown TimeZoneKind '" + this._kind + "'");
                }
        }
    };
    TimeZone.prototype.standardOffsetForUtc = function (a, month, day, hour, minute, second, milli) {
        var utcTime = (typeof a === "number" ? new basics_1.TimeStruct({ year: a, month: month, day: day, hour: hour, minute: minute, second: second, milli: milli }) :
            typeof a === "undefined" ? new basics_1.TimeStruct({}) :
                a);
        switch (this._kind) {
            case TimeZoneKind.Local: {
                var date = new Date(Date.UTC(utcTime.components.year, 0, 1, 0));
                return -1 * date.getTimezoneOffset();
            }
            case TimeZoneKind.Offset: {
                return this._offset;
            }
            case TimeZoneKind.Proper: {
                return tz_database_1.TzDatabase.instance().standardOffset(this._name, utcTime).minutes();
            }
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("unknown TimeZoneKind '" + this._kind + "'");
                }
        }
    };
    TimeZone.prototype.offsetForZone = function (a, month, day, hour, minute, second, milli) {
        var localTime = (typeof a === "number" ? new basics_1.TimeStruct({ year: a, month: month, day: day, hour: hour, minute: minute, second: second, milli: milli }) :
            typeof a === "undefined" ? new basics_1.TimeStruct({}) :
                a);
        switch (this._kind) {
            case TimeZoneKind.Local: {
                var date = new Date(localTime.components.year, localTime.components.month - 1, localTime.components.day, localTime.components.hour, localTime.components.minute, localTime.components.second, localTime.components.milli);
                return -1 * date.getTimezoneOffset();
            }
            case TimeZoneKind.Offset: {
                return this._offset;
            }
            case TimeZoneKind.Proper: {
                // note that TzDatabase normalizes the given date so we don't have to do it
                if (this._dst) {
                    return tz_database_1.TzDatabase.instance().totalOffsetLocal(this._name, localTime).minutes();
                }
                else {
                    return tz_database_1.TzDatabase.instance().standardOffset(this._name, localTime).minutes();
                }
            }
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("unknown TimeZoneKind '" + this._kind + "'");
                }
        }
    };
    /**
     * Note: will be removed in version 2.0.0
     *
     * Convenience function, takes values from a Javascript Date
     * Calls offsetForUtc() with the contents of the date
     *
     * @param date: the date
     * @param funcs: the set of functions to use: get() or getUTC()
     */
    TimeZone.prototype.offsetForUtcDate = function (date, funcs) {
        return this.offsetForUtc(basics_1.TimeStruct.fromDate(date, funcs));
    };
    /**
     * Note: will be removed in version 2.0.0
     *
     * Convenience function, takes values from a Javascript Date
     * Calls offsetForUtc() with the contents of the date
     *
     * @param date: the date
     * @param funcs: the set of functions to use: get() or getUTC()
     */
    TimeZone.prototype.offsetForZoneDate = function (date, funcs) {
        return this.offsetForZone(basics_1.TimeStruct.fromDate(date, funcs));
    };
    TimeZone.prototype.abbreviationForUtc = function (a, b, day, hour, minute, second, milli, c) {
        var utcTime;
        var dstDependent = true;
        if (typeof a !== "number" && !!a) {
            utcTime = a;
            dstDependent = (b === false ? false : true);
        }
        else {
            utcTime = new basics_1.TimeStruct({ year: a, month: b, day: day, hour: hour, minute: minute, second: second, milli: milli });
            dstDependent = (c === false ? false : true);
        }
        switch (this._kind) {
            case TimeZoneKind.Local: {
                return "local";
            }
            case TimeZoneKind.Offset: {
                return this.toString();
            }
            case TimeZoneKind.Proper: {
                return tz_database_1.TzDatabase.instance().abbreviation(this._name, utcTime, dstDependent);
            }
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("unknown TimeZoneKind '" + this._kind + "'");
                }
        }
    };
    TimeZone.prototype.normalizeZoneTime = function (localTime, opt) {
        if (opt === void 0) { opt = tz_database_1.NormalizeOption.Up; }
        var tzopt = (opt === tz_database_1.NormalizeOption.Down ? tz_database_1.NormalizeOption.Down : tz_database_1.NormalizeOption.Up);
        if (this.kind() === TimeZoneKind.Proper) {
            if (typeof localTime === "number") {
                return tz_database_1.TzDatabase.instance().normalizeLocal(this._name, new basics_1.TimeStruct(localTime), tzopt).unixMillis;
            }
            else {
                return tz_database_1.TzDatabase.instance().normalizeLocal(this._name, localTime, tzopt);
            }
        }
        else {
            return localTime;
        }
    };
    /**
     * The time zone identifier (normalized).
     * Either "localtime", IANA name, or "+hh:mm" offset.
     */
    TimeZone.prototype.toString = function () {
        var result = this.name();
        if (this.kind() === TimeZoneKind.Proper) {
            if (this.hasDst() && !this.dst()) {
                result += " without DST";
            }
        }
        return result;
    };
    /**
     * Convert an offset number into an offset string
     * @param offset The offset in minutes from UTC e.g. 90 minutes
     * @return the offset in ISO notation "+01:30" for +90 minutes
     */
    TimeZone.offsetToString = function (offset) {
        var sign = (offset < 0 ? "-" : "+");
        var hours = Math.floor(Math.abs(offset) / 60);
        var minutes = Math.floor(Math.abs(offset) % 60);
        return sign + strings.padLeft(hours.toString(10), 2, "0") + ":" + strings.padLeft(minutes.toString(10), 2, "0");
    };
    /**
     * String to offset conversion.
     * @param s	Formats: "-01:00", "-0100", "-01", "Z"
     * @return offset w.r.t. UTC in minutes
     */
    TimeZone.stringToOffset = function (s) {
        var t = s.trim();
        // easy case
        if (t === "Z") {
            return 0;
        }
        // check that the remainder conforms to ISO time zone spec
        assert_1.default(t.match(/^[+-]\d$/) || t.match(/^[+-]\d\d$/) || t.match(/^[+-]\d\d(:?)\d\d$/), "Wrong time zone format: \"" + t + "\"");
        var sign = (t.charAt(0) === "+" ? 1 : -1);
        var hours = 0;
        var minutes = 0;
        switch (t.length) {
            case 2:
                hours = parseInt(t.slice(1, 2), 10);
                break;
            case 3:
                hours = parseInt(t.slice(1, 3), 10);
                break;
            case 5:
                hours = parseInt(t.slice(1, 3), 10);
                minutes = parseInt(t.slice(3, 5), 10);
                break;
            case 6:
                hours = parseInt(t.slice(1, 3), 10);
                minutes = parseInt(t.slice(4, 6), 10);
                break;
        }
        assert_1.default(hours >= 0 && hours < 24, "Invalid time zone (hours out of range): '" + t + "'");
        assert_1.default(minutes >= 0 && minutes < 60, "Invalid time zone (minutes out of range): '" + t + "'");
        return sign * (hours * 60 + minutes);
    };
    /**
     * Find in cache or create zone
     * @param name	Time zone name
     * @param dst	Adhere to Daylight Saving Time?
     */
    TimeZone._findOrCreate = function (name, dst) {
        var key = name + (dst ? "_DST" : "_NO-DST");
        if (key in TimeZone._cache) {
            return TimeZone._cache[key];
        }
        else {
            var t = new TimeZone(name, dst);
            TimeZone._cache[key] = t;
            return t;
        }
    };
    /**
     * Normalize a string so it can be used as a key for a
     * cache lookup
     */
    TimeZone._normalizeString = function (s) {
        var t = s.trim();
        assert_1.default(t.length > 0, "Empty time zone string given");
        if (t === "localtime") {
            return t;
        }
        else if (t === "Z") {
            return "+00:00";
        }
        else if (TimeZone._isOffsetString(t)) {
            // offset string
            // normalize by converting back and forth
            return TimeZone.offsetToString(TimeZone.stringToOffset(t));
        }
        else {
            // Olsen TZ database name
            return t;
        }
    };
    TimeZone._isOffsetString = function (s) {
        var t = s.trim();
        return (t.charAt(0) === "+" || t.charAt(0) === "-" || t === "Z");
    };
    /**
     * Time zone cache.
     */
    TimeZone._cache = {};
    return TimeZone;
}());
exports.TimeZone = TimeZone;
/**
 * Checks if a given object is of type TimeZone. Note that it does not work for sub classes. However, use this to be robust
 * against different versions of the library in one process instead of instanceof
 * @param value Value to check
 * @throws nothing
 */
function isTimeZone(value) {
    return typeof value === "object" && value !== null && value.classKind === "TimeZone";
}
exports.isTimeZone = isTimeZone;

},{"./assert":1,"./basics":2,"./strings":12,"./tz-database":16}],15:[function(require,module,exports){
/**
 * Functionality to parse a DateTime object to a string
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Different types of tokens, each for a DateTime "period type" (like year, month, hour etc.)
 */
var TokenType;
(function (TokenType) {
    /**
     * Raw text
     */
    TokenType[TokenType["IDENTITY"] = 0] = "IDENTITY";
    TokenType[TokenType["ERA"] = 1] = "ERA";
    TokenType[TokenType["YEAR"] = 2] = "YEAR";
    TokenType[TokenType["QUARTER"] = 3] = "QUARTER";
    TokenType[TokenType["MONTH"] = 4] = "MONTH";
    TokenType[TokenType["WEEK"] = 5] = "WEEK";
    TokenType[TokenType["DAY"] = 6] = "DAY";
    TokenType[TokenType["WEEKDAY"] = 7] = "WEEKDAY";
    TokenType[TokenType["DAYPERIOD"] = 8] = "DAYPERIOD";
    TokenType[TokenType["HOUR"] = 9] = "HOUR";
    TokenType[TokenType["MINUTE"] = 10] = "MINUTE";
    TokenType[TokenType["SECOND"] = 11] = "SECOND";
    TokenType[TokenType["ZONE"] = 12] = "ZONE";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
/**
 * Tokenize an LDML date/time format string
 * @param formatString the string to tokenize
 */
function tokenize(formatString) {
    if (!formatString) {
        return [];
    }
    var result = [];
    var appendToken = function (tokenString, raw) {
        // The tokenString may be longer than supported for a tokentype, e.g. "hhhh" which would be TWO hour specs.
        // We greedily consume LDML specs while possible
        while (tokenString !== "") {
            if (raw || !SYMBOL_MAPPING.hasOwnProperty(tokenString[0])) {
                var token = {
                    length: tokenString.length,
                    raw: tokenString,
                    symbol: tokenString[0],
                    type: TokenType.IDENTITY
                };
                result.push(token);
                tokenString = "";
            }
            else {
                // depending on the type of token, different lengths may be supported
                var info = SYMBOL_MAPPING[tokenString[0]];
                var length_1 = void 0;
                if (info.maxLength === undefined && (!Array.isArray(info.lengths) || info.lengths.length === 0)) {
                    // everything is allowed
                    length_1 = tokenString.length;
                }
                else if (info.maxLength !== undefined) {
                    // greedily gobble up
                    length_1 = Math.min(tokenString.length, info.maxLength);
                }
                else /* istanbul ignore else */ if (Array.isArray(info.lengths) && info.lengths.length > 0) {
                    // find maximum allowed length
                    for (var _i = 0, _a = info.lengths; _i < _a.length; _i++) {
                        var l = _a[_i];
                        if (l <= tokenString.length && (length_1 === undefined || length_1 < l)) {
                            length_1 = l;
                        }
                    }
                }
                /* istanbul ignore if */
                if (length_1 === undefined) {
                    // no allowed length found (not possible with current symbol mapping since length 1 is always allowed)
                    var token = {
                        length: tokenString.length,
                        raw: tokenString,
                        symbol: tokenString[0],
                        type: TokenType.IDENTITY
                    };
                    result.push(token);
                    tokenString = "";
                }
                else {
                    // prefix found
                    var token = {
                        length: length_1,
                        raw: tokenString.slice(0, length_1),
                        symbol: tokenString[0],
                        type: info.type
                    };
                    result.push(token);
                    tokenString = tokenString.slice(length_1);
                }
            }
        }
    };
    var currentToken = "";
    var previousChar = "";
    var quoting = false;
    var possibleEscaping = false;
    for (var _i = 0, formatString_1 = formatString; _i < formatString_1.length; _i++) {
        var currentChar = formatString_1[_i];
        // Hanlde escaping and quoting
        if (currentChar === "'") {
            if (!quoting) {
                if (possibleEscaping) {
                    // Escaped a single ' character without quoting
                    if (currentChar !== previousChar) {
                        appendToken(currentToken);
                        currentToken = "";
                    }
                    currentToken += "'";
                    possibleEscaping = false;
                }
                else {
                    possibleEscaping = true;
                }
            }
            else {
                // Two possibilities: Were are done quoting, or we are escaping a ' character
                if (possibleEscaping) {
                    // Escaping, add ' to the token
                    currentToken += currentChar;
                    possibleEscaping = false;
                }
                else {
                    // Maybe escaping, wait for next token if we are escaping
                    possibleEscaping = true;
                }
            }
            if (!possibleEscaping) {
                // Current character is relevant, so save it for inspecting next round
                previousChar = currentChar;
            }
            continue;
        }
        else if (possibleEscaping) {
            quoting = !quoting;
            possibleEscaping = false;
            // Flush current token
            appendToken(currentToken, !quoting);
            currentToken = "";
        }
        if (quoting) {
            // Quoting mode, add character to token.
            currentToken += currentChar;
            previousChar = currentChar;
            continue;
        }
        if (currentChar !== previousChar) {
            // We stumbled upon a new token!
            appendToken(currentToken);
            currentToken = currentChar;
        }
        else {
            // We are repeating the token with more characters
            currentToken += currentChar;
        }
        previousChar = currentChar;
    }
    // Don't forget to add the last token to the result!
    appendToken(currentToken, quoting);
    return result;
}
exports.tokenize = tokenize;
var SYMBOL_MAPPING = {
    G: { type: TokenType.ERA, maxLength: 5 },
    y: { type: TokenType.YEAR },
    Y: { type: TokenType.YEAR },
    u: { type: TokenType.YEAR },
    U: { type: TokenType.YEAR, maxLength: 5 },
    r: { type: TokenType.YEAR },
    Q: { type: TokenType.QUARTER, maxLength: 5 },
    q: { type: TokenType.QUARTER, maxLength: 5 },
    M: { type: TokenType.MONTH, maxLength: 5 },
    L: { type: TokenType.MONTH, maxLength: 5 },
    l: { type: TokenType.MONTH, maxLength: 1 },
    w: { type: TokenType.WEEK, maxLength: 2 },
    W: { type: TokenType.WEEK, maxLength: 1 },
    d: { type: TokenType.DAY, maxLength: 2 },
    D: { type: TokenType.DAY, maxLength: 3 },
    F: { type: TokenType.DAY, maxLength: 1 },
    g: { type: TokenType.DAY },
    E: { type: TokenType.WEEKDAY, maxLength: 6 },
    e: { type: TokenType.WEEKDAY, maxLength: 6 },
    c: { type: TokenType.WEEKDAY, maxLength: 6 },
    a: { type: TokenType.DAYPERIOD, maxLength: 5 },
    b: { type: TokenType.DAYPERIOD, maxLength: 5 },
    B: { type: TokenType.DAYPERIOD, maxLength: 5 },
    h: { type: TokenType.HOUR, maxLength: 2 },
    H: { type: TokenType.HOUR, maxLength: 2 },
    k: { type: TokenType.HOUR, maxLength: 2 },
    K: { type: TokenType.HOUR, maxLength: 2 },
    j: { type: TokenType.HOUR, maxLength: 6 },
    J: { type: TokenType.HOUR, maxLength: 2 },
    m: { type: TokenType.MINUTE, maxLength: 2 },
    s: { type: TokenType.SECOND, maxLength: 2 },
    S: { type: TokenType.SECOND },
    A: { type: TokenType.SECOND },
    z: { type: TokenType.ZONE, maxLength: 4 },
    Z: { type: TokenType.ZONE, maxLength: 5 },
    O: { type: TokenType.ZONE, lengths: [1, 4] },
    v: { type: TokenType.ZONE, lengths: [1, 4] },
    V: { type: TokenType.ZONE, maxLength: 4 },
    X: { type: TokenType.ZONE, maxLength: 5 },
    x: { type: TokenType.ZONE, maxLength: 5 },
};

},{}],16:[function(require,module,exports){
(function (global){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Olsen Timezone Database container
 *
 * DO NOT USE THIS CLASS DIRECTLY, USE TimeZone
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
var basics_1 = require("./basics");
var basics = require("./basics");
var duration_1 = require("./duration");
var math = require("./math");
/**
 * Type of rule TO column value
 */
var ToType;
(function (ToType) {
    /**
     * Either a year number or "only"
     */
    ToType[ToType["Year"] = 0] = "Year";
    /**
     * "max"
     */
    ToType[ToType["Max"] = 1] = "Max";
})(ToType = exports.ToType || (exports.ToType = {}));
/**
 * Type of rule ON column value
 */
var OnType;
(function (OnType) {
    /**
     * Day-of-month number
     */
    OnType[OnType["DayNum"] = 0] = "DayNum";
    /**
     * "lastSun" or "lastWed" etc
     */
    OnType[OnType["LastX"] = 1] = "LastX";
    /**
     * e.g. "Sun>=8"
     */
    OnType[OnType["GreqX"] = 2] = "GreqX";
    /**
     * e.g. "Sun<=8"
     */
    OnType[OnType["LeqX"] = 3] = "LeqX";
})(OnType = exports.OnType || (exports.OnType = {}));
var AtType;
(function (AtType) {
    /**
     * Local time (no DST)
     */
    AtType[AtType["Standard"] = 0] = "Standard";
    /**
     * Wall clock time (local time with DST)
     */
    AtType[AtType["Wall"] = 1] = "Wall";
    /**
     * Utc time
     */
    AtType[AtType["Utc"] = 2] = "Utc";
})(AtType = exports.AtType || (exports.AtType = {}));
/**
 * DO NOT USE THIS CLASS DIRECTLY, USE TimeZone
 *
 * See http://www.cstdbill.com/tzdb/tz-how-to.html
 */
var RuleInfo = /** @class */ (function () {
    function RuleInfo(
    /**
     * FROM column year number.
     * Note, can be -10000 for NaN value (e.g. for "SystemV" rules)
     */
    from, 
    /**
     * TO column type: Year for year numbers and "only" values, Max for "max" value.
     */
    toType, 
    /**
     * If TO column is a year, the year number. If TO column is "only", the FROM year.
     */
    toYear, 
    /**
     * TYPE column, not used so far
     */
    type, 
    /**
     * IN column month number 1-12
     */
    inMonth, 
    /**
     * ON column type
     */
    onType, 
    /**
     * If onType is DayNum, the day number
     */
    onDay, 
    /**
     * If onType is not DayNum, the weekday
     */
    onWeekDay, 
    /**
     * AT column hour
     */
    atHour, 
    /**
     * AT column minute
     */
    atMinute, 
    /**
     * AT column second
     */
    atSecond, 
    /**
     * AT column type
     */
    atType, 
    /**
     * DST offset from local standard time (NOT from UTC!)
     */
    save, 
    /**
     * Character to insert in %s for time zone abbreviation
     * Note if TZ database indicates "-" this is the empty string
     */
    letter) {
        this.from = from;
        this.toType = toType;
        this.toYear = toYear;
        this.type = type;
        this.inMonth = inMonth;
        this.onType = onType;
        this.onDay = onDay;
        this.onWeekDay = onWeekDay;
        this.atHour = atHour;
        this.atMinute = atMinute;
        this.atSecond = atSecond;
        this.atType = atType;
        this.save = save;
        this.letter = letter;
        if (this.save) {
            this.save = this.save.convert(basics_1.TimeUnit.Hour);
        }
    }
    /**
     * Returns true iff this rule is applicable in the year
     */
    RuleInfo.prototype.applicable = function (year) {
        if (year < this.from) {
            return false;
        }
        switch (this.toType) {
            case ToType.Max: return true;
            case ToType.Year: return (year <= this.toYear);
        }
    };
    /**
     * Sort comparison
     * @return (first effective date is less than other's first effective date)
     */
    RuleInfo.prototype.effectiveLess = function (other) {
        if (this.from < other.from) {
            return true;
        }
        if (this.from > other.from) {
            return false;
        }
        if (this.inMonth < other.inMonth) {
            return true;
        }
        if (this.inMonth > other.inMonth) {
            return false;
        }
        if (this.effectiveDate(this.from) < other.effectiveDate(this.from)) {
            return true;
        }
        return false;
    };
    /**
     * Sort comparison
     * @return (first effective date is equal to other's first effective date)
     */
    RuleInfo.prototype.effectiveEqual = function (other) {
        if (this.from !== other.from) {
            return false;
        }
        if (this.inMonth !== other.inMonth) {
            return false;
        }
        if (!this.effectiveDate(this.from).equals(other.effectiveDate(this.from))) {
            return false;
        }
        return true;
    };
    /**
     * Returns the date that the rule takes effect. Note that the time
     * is NOT adjusted for wall clock time or standard time, i.e. this.atType is
     * not taken into account
     */
    RuleInfo.prototype.effectiveDate = function (year) {
        assert_1.default(this.applicable(year), "Rule is not applicable in " + year.toString(10));
        // year and month are given
        var tm = { year: year, month: this.inMonth };
        // calculate day
        switch (this.onType) {
            case OnType.DayNum:
                {
                    tm.day = this.onDay;
                }
                break;
            case OnType.GreqX:
                {
                    tm.day = basics.weekDayOnOrAfter(year, this.inMonth, this.onDay, this.onWeekDay);
                }
                break;
            case OnType.LeqX:
                {
                    tm.day = basics.weekDayOnOrBefore(year, this.inMonth, this.onDay, this.onWeekDay);
                }
                break;
            case OnType.LastX:
                {
                    tm.day = basics.lastWeekDayOfMonth(year, this.inMonth, this.onWeekDay);
                }
                break;
        }
        // calculate time
        tm.hour = this.atHour;
        tm.minute = this.atMinute;
        tm.second = this.atSecond;
        return new basics_1.TimeStruct(tm);
    };
    /**
     * Returns the transition moment in UTC in the given year
     *
     * @param year	The year for which to return the transition
     * @param standardOffset	The standard offset for the timezone without DST
     * @param prevRule	The previous rule
     */
    RuleInfo.prototype.transitionTimeUtc = function (year, standardOffset, prevRule) {
        assert_1.default(this.applicable(year), "Rule not applicable in given year");
        var unixMillis = this.effectiveDate(year).unixMillis;
        // adjust for given offset
        var offset;
        switch (this.atType) {
            case AtType.Utc:
                offset = duration_1.Duration.hours(0);
                break;
            case AtType.Standard:
                offset = standardOffset;
                break;
            case AtType.Wall:
                if (prevRule) {
                    offset = standardOffset.add(prevRule.save);
                }
                else {
                    offset = standardOffset;
                }
                break;
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    throw new Error("unknown AtType");
                }
        }
        return unixMillis - offset.milliseconds();
    };
    return RuleInfo;
}());
exports.RuleInfo = RuleInfo;
/**
 * Type of reference from zone to rule
 */
var RuleType;
(function (RuleType) {
    /**
     * No rule applies
     */
    RuleType[RuleType["None"] = 0] = "None";
    /**
     * Fixed given offset
     */
    RuleType[RuleType["Offset"] = 1] = "Offset";
    /**
     * Reference to a named set of rules
     */
    RuleType[RuleType["RuleName"] = 2] = "RuleName";
})(RuleType = exports.RuleType || (exports.RuleType = {}));
/**
 * DO NOT USE THIS CLASS DIRECTLY, USE TimeZone
 *
 * See http://www.cstdbill.com/tzdb/tz-how-to.html
 * First, and somewhat trivially, whereas Rules are considered to contain one or more records, a Zone is considered to
 * be a single record with zero or more continuation lines. Thus, the keyword, “Zone,” and the zone name are not repeated.
 * The last line is the one without anything in the [UNTIL] column.
 * Second, and more fundamentally, each line of a Zone represents a steady state, not a transition between states.
 * The state exists from the date and time in the previous line’s [UNTIL] column up to the date and time in the current line’s
 * [UNTIL] column. In other words, the date and time in the [UNTIL] column is the instant that separates this state from the next.
 * Where that would be ambiguous because we’re setting our clocks back, the [UNTIL] column specifies the first occurrence of the instant.
 * The state specified by the last line, the one without anything in the [UNTIL] column, continues to the present.
 * The first line typically specifies the mean solar time observed before the introduction of standard time. Since there’s no line before
 * that, it has no beginning. 8-) For some places near the International Date Line, the first two lines will show solar times differing by
 * 24 hours; this corresponds to a movement of the Date Line. For example:
 * # Zone	NAME		GMTOFF	RULES	FORMAT	[UNTIL]
 * Zone America/Juneau	 15:02:19 -	LMT	1867 Oct 18
 * 			 -8:57:41 -	LMT	...
 * When Alaska was purchased from Russia in 1867, the Date Line moved from the Alaska/Canada border to the Bering Strait; and the time in
 * Alaska was then 24 hours earlier than it had been. <aside>(6 October in the Julian calendar, which Russia was still using then for
 * religious reasons, was followed by a second instance of the same day with a different name, 18 October in the Gregorian calendar.
 * Isn’t civil time wonderful? 8-))</aside>
 * The abbreviation, “LMT,” stands for “local mean time,” which is an invention of the tz database and was probably never actually
 * used during the period. Furthermore, the value is almost certainly wrong except in the archetypal place after which the zone is named.
 * (The tz database usually doesn’t provide a separate Zone record for places where nothing significant happened after 1970.)
 */
var ZoneInfo = /** @class */ (function () {
    function ZoneInfo(
    /**
     * GMT offset in fractional minutes, POSITIVE to UTC (note JavaScript.Date gives offsets
     * contrary to what you might expect).  E.g. Europe/Amsterdam has +60 minutes in this field because
     * it is one hour ahead of UTC
     */
    gmtoff, 
    /**
     * The RULES column tells us whether daylight saving time is being observed:
     * A hyphen, a kind of null value, means that we have not set our clocks ahead of standard time.
     * An amount of time (usually but not necessarily “1:00” meaning one hour) means that we have set our clocks ahead by that amount.
     * Some alphabetic string means that we might have set our clocks ahead; and we need to check the rule
     * the name of which is the given alphabetic string.
     */
    ruleType, 
    /**
     * If the rule column is an offset, this is the offset
     */
    ruleOffset, 
    /**
     * If the rule column is a rule name, this is the rule name
     */
    ruleName, 
    /**
     * The FORMAT column specifies the usual abbreviation of the time zone name. It can have one of four forms:
     * the string, “zzz,” which is a kind of null value (don’t ask)
     * a single alphabetic string other than “zzz,” in which case that’s the abbreviation
     * a pair of strings separated by a slash (‘/’), in which case the first string is the abbreviation
     * for the standard time name and the second string is the abbreviation for the daylight saving time name
     * a string containing “%s,” in which case the “%s” will be replaced by the text in the appropriate Rule’s LETTER column
     */
    format, 
    /**
     * Until timestamp in unix utc millis. The zone info is valid up to
     * and excluding this timestamp.
     * Note this value can be undefined (for the first rule)
     */
    until) {
        this.gmtoff = gmtoff;
        this.ruleType = ruleType;
        this.ruleOffset = ruleOffset;
        this.ruleName = ruleName;
        this.format = format;
        this.until = until;
        if (this.ruleOffset) {
            this.ruleOffset = this.ruleOffset.convert(basics.TimeUnit.Hour);
        }
    }
    return ZoneInfo;
}());
exports.ZoneInfo = ZoneInfo;
var TzMonthNames;
(function (TzMonthNames) {
    TzMonthNames[TzMonthNames["Jan"] = 1] = "Jan";
    TzMonthNames[TzMonthNames["Feb"] = 2] = "Feb";
    TzMonthNames[TzMonthNames["Mar"] = 3] = "Mar";
    TzMonthNames[TzMonthNames["Apr"] = 4] = "Apr";
    TzMonthNames[TzMonthNames["May"] = 5] = "May";
    TzMonthNames[TzMonthNames["Jun"] = 6] = "Jun";
    TzMonthNames[TzMonthNames["Jul"] = 7] = "Jul";
    TzMonthNames[TzMonthNames["Aug"] = 8] = "Aug";
    TzMonthNames[TzMonthNames["Sep"] = 9] = "Sep";
    TzMonthNames[TzMonthNames["Oct"] = 10] = "Oct";
    TzMonthNames[TzMonthNames["Nov"] = 11] = "Nov";
    TzMonthNames[TzMonthNames["Dec"] = 12] = "Dec";
})(TzMonthNames || (TzMonthNames = {}));
function monthNameToString(name) {
    for (var i = 1; i <= 12; ++i) {
        if (TzMonthNames[i] === name) {
            return i;
        }
    }
    /* istanbul ignore if */
    /* istanbul ignore next */
    if (true) {
        throw new Error("Invalid month name \"" + name + "\"");
    }
}
var TzDayNames;
(function (TzDayNames) {
    TzDayNames[TzDayNames["Sun"] = 0] = "Sun";
    TzDayNames[TzDayNames["Mon"] = 1] = "Mon";
    TzDayNames[TzDayNames["Tue"] = 2] = "Tue";
    TzDayNames[TzDayNames["Wed"] = 3] = "Wed";
    TzDayNames[TzDayNames["Thu"] = 4] = "Thu";
    TzDayNames[TzDayNames["Fri"] = 5] = "Fri";
    TzDayNames[TzDayNames["Sat"] = 6] = "Sat";
})(TzDayNames || (TzDayNames = {}));
/**
 * Returns true if the given string is a valid offset string i.e.
 * 1, -1, +1, 01, 1:00, 1:23:25.143
 */
function isValidOffsetString(s) {
    return /^(\-|\+)?([0-9]+((\:[0-9]+)?(\:[0-9]+(\.[0-9]+)?)?))$/.test(s);
}
exports.isValidOffsetString = isValidOffsetString;
/**
 * Defines a moment at which the given rule becomes valid
 */
var Transition = /** @class */ (function () {
    function Transition(
    /**
     * Transition time in UTC millis
     */
    at, 
    /**
     * New offset (type of offset depends on the function)
     */
    offset, 
    /**
     * New timzone abbreviation letter
     */
    letter) {
        this.at = at;
        this.offset = offset;
        this.letter = letter;
        if (this.offset) {
            this.offset = this.offset.convert(basics.TimeUnit.Hour);
        }
    }
    return Transition;
}());
exports.Transition = Transition;
/**
 * Option for TzDatabase#normalizeLocal()
 */
var NormalizeOption;
(function (NormalizeOption) {
    /**
     * Normalize non-existing times by ADDING the DST offset
     */
    NormalizeOption[NormalizeOption["Up"] = 0] = "Up";
    /**
     * Normalize non-existing times by SUBTRACTING the DST offset
     */
    NormalizeOption[NormalizeOption["Down"] = 1] = "Down";
})(NormalizeOption = exports.NormalizeOption || (exports.NormalizeOption = {}));
/**
 * This class is a wrapper around time zone data JSON object from the tzdata NPM module.
 * You usually do not need to use this directly, use TimeZone and DateTime instead.
 */
var TzDatabase = /** @class */ (function () {
    /**
     * Constructor - do not use, this is a singleton class. Use TzDatabase.instance() instead
     */
    function TzDatabase(data) {
        var _this = this;
        /**
         * Performance improvement: zone info cache
         */
        this._zoneInfoCache = {};
        /**
         * Performance improvement: rule info cache
         */
        this._ruleInfoCache = {};
        assert_1.default(!TzDatabase._instance, "You should not create an instance of the TzDatabase class yourself. Use TzDatabase.instance()");
        assert_1.default(data.length > 0, "Timezonecomplete needs time zone data. You need to install one of the tzdata NPM modules before using timezonecomplete.");
        if (data.length === 1) {
            this._data = data[0];
        }
        else {
            this._data = { zones: {}, rules: {} };
            data.forEach(function (d) {
                if (d && d.rules && d.zones) {
                    for (var _i = 0, _a = Object.keys(d.rules); _i < _a.length; _i++) {
                        var key = _a[_i];
                        _this._data.rules[key] = d.rules[key];
                    }
                    for (var _b = 0, _c = Object.keys(d.zones); _b < _c.length; _b++) {
                        var key = _c[_b];
                        _this._data.zones[key] = d.zones[key];
                    }
                }
            });
        }
        this._minmax = validateData(this._data);
    }
    /**
     * (re-) initialize timezonecomplete with time zone data
     *
     * @param data TZ data as JSON object (from one of the tzdata NPM modules).
     *             If not given, Timezonecomplete will search for installed modules.
     */
    TzDatabase.init = function (data) {
        if (data) {
            TzDatabase._instance = undefined; // needed for assert in constructor
            TzDatabase._instance = new TzDatabase(Array.isArray(data) ? data : [data]);
        }
        else {
            var data_1 = [];
            // try to find TZ data in global variables
            var g = void 0;
            if (typeof window !== "undefined") {
                g = window;
            }
            else if (typeof global !== "undefined") {
                g = global;
            }
            else if (typeof self !== "undefined") {
                g = self;
            }
            else {
                g = {};
            }
            if (g) {
                for (var _i = 0, _a = Object.keys(g); _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (key.startsWith("tzdata")) {
                        if (typeof g[key] === "object" && g[key].rules && g[key].zones) {
                            data_1.push(g[key]);
                        }
                    }
                }
            }
            // try to find TZ data as installed NPM modules
            var findNodeModules = function (require) {
                try {
                    // first try tzdata which contains all data
                    var tzDataName = "tzdata";
                    var d = require(tzDataName); // use variable to avoid browserify acting up
                    data_1.push(d);
                }
                catch (e) {
                    // then try subsets
                    var moduleNames = [
                        "tzdata-africa",
                        "tzdata-antarctica",
                        "tzdata-asia",
                        "tzdata-australasia",
                        "tzdata-backward",
                        "tzdata-backward-utc",
                        "tzdata-etcetera",
                        "tzdata-europe",
                        "tzdata-northamerica",
                        "tzdata-pacificnew",
                        "tzdata-southamerica",
                        "tzdata-systemv"
                    ];
                    moduleNames.forEach(function (moduleName) {
                        try {
                            var d = require(moduleName);
                            data_1.push(d);
                        }
                        catch (e) {
                            // nothing
                        }
                    });
                }
            };
            if (data_1.length === 0) {
                if (typeof module === "object" && typeof module.exports === "object") {
                    findNodeModules(require); // need to put require into a function to make webpack happy
                }
            }
            TzDatabase._instance = new TzDatabase(data_1);
        }
    };
    /**
     * Single instance of this database
     */
    TzDatabase.instance = function () {
        if (!TzDatabase._instance) {
            TzDatabase.init();
        }
        return TzDatabase._instance;
    };
    /**
     * Returns a sorted list of all zone names
     */
    TzDatabase.prototype.zoneNames = function () {
        if (!this._zoneNames) {
            this._zoneNames = Object.keys(this._data.zones);
            this._zoneNames.sort();
        }
        return this._zoneNames;
    };
    TzDatabase.prototype.exists = function (zoneName) {
        return this._data.zones.hasOwnProperty(zoneName);
    };
    /**
     * Minimum non-zero DST offset (which excludes standard offset) of all rules in the database.
     * Note that DST offsets need not be whole hours.
     *
     * Does return zero if a zoneName is given and there is no DST at all for the zone.
     *
     * @param zoneName	(optional) if given, the result for the given zone is returned
     */
    TzDatabase.prototype.minDstSave = function (zoneName) {
        if (zoneName) {
            var zoneInfos = this.getZoneInfos(zoneName);
            var result = void 0;
            var ruleNames = [];
            for (var _i = 0, zoneInfos_1 = zoneInfos; _i < zoneInfos_1.length; _i++) {
                var zoneInfo = zoneInfos_1[_i];
                if (zoneInfo.ruleType === RuleType.Offset) {
                    if (!result || result.greaterThan(zoneInfo.ruleOffset)) {
                        if (zoneInfo.ruleOffset.milliseconds() !== 0) {
                            result = zoneInfo.ruleOffset;
                        }
                    }
                }
                if (zoneInfo.ruleType === RuleType.RuleName
                    && ruleNames.indexOf(zoneInfo.ruleName) === -1) {
                    ruleNames.push(zoneInfo.ruleName);
                    var temp = this.getRuleInfos(zoneInfo.ruleName);
                    for (var _a = 0, temp_1 = temp; _a < temp_1.length; _a++) {
                        var ruleInfo = temp_1[_a];
                        if (!result || result.greaterThan(ruleInfo.save)) {
                            if (ruleInfo.save.milliseconds() !== 0) {
                                result = ruleInfo.save;
                            }
                        }
                    }
                }
            }
            if (!result) {
                result = duration_1.Duration.hours(0);
            }
            return result.clone();
        }
        else {
            return duration_1.Duration.minutes(this._minmax.minDstSave);
        }
    };
    /**
     * Maximum DST offset (which excludes standard offset) of all rules in the database.
     * Note that DST offsets need not be whole hours.
     *
     * Returns 0 if zoneName given and no DST observed.
     *
     * @param zoneName	(optional) if given, the result for the given zone is returned
     */
    TzDatabase.prototype.maxDstSave = function (zoneName) {
        if (zoneName) {
            var zoneInfos = this.getZoneInfos(zoneName);
            var result = void 0;
            var ruleNames = [];
            for (var _i = 0, zoneInfos_2 = zoneInfos; _i < zoneInfos_2.length; _i++) {
                var zoneInfo = zoneInfos_2[_i];
                if (zoneInfo.ruleType === RuleType.Offset) {
                    if (!result || result.lessThan(zoneInfo.ruleOffset)) {
                        result = zoneInfo.ruleOffset;
                    }
                }
                if (zoneInfo.ruleType === RuleType.RuleName
                    && ruleNames.indexOf(zoneInfo.ruleName) === -1) {
                    ruleNames.push(zoneInfo.ruleName);
                    var temp = this.getRuleInfos(zoneInfo.ruleName);
                    for (var _a = 0, temp_2 = temp; _a < temp_2.length; _a++) {
                        var ruleInfo = temp_2[_a];
                        if (!result || result.lessThan(ruleInfo.save)) {
                            result = ruleInfo.save;
                        }
                    }
                }
            }
            if (!result) {
                result = duration_1.Duration.hours(0);
            }
            return result.clone();
        }
        else {
            return duration_1.Duration.minutes(this._minmax.maxDstSave);
        }
    };
    /**
     * Checks whether the zone has DST at all
     */
    TzDatabase.prototype.hasDst = function (zoneName) {
        return (this.maxDstSave(zoneName).milliseconds() !== 0);
    };
    TzDatabase.prototype.nextDstChange = function (zoneName, a) {
        var utcTime = (typeof a === "number" ? new basics_1.TimeStruct(a) : a);
        // get all zone infos for [date, date+1year)
        var allZoneInfos = this.getZoneInfos(zoneName);
        var relevantZoneInfos = [];
        var rangeStart = utcTime.unixMillis;
        var rangeEnd = rangeStart + 365 * 86400E3;
        var prevEnd;
        for (var _i = 0, allZoneInfos_1 = allZoneInfos; _i < allZoneInfos_1.length; _i++) {
            var zoneInfo = allZoneInfos_1[_i];
            if ((prevEnd === undefined || prevEnd < rangeEnd) && (zoneInfo.until === undefined || zoneInfo.until > rangeStart)) {
                relevantZoneInfos.push(zoneInfo);
            }
            prevEnd = zoneInfo.until;
        }
        // collect all transitions in the zones for the year
        var transitions = [];
        for (var _a = 0, relevantZoneInfos_1 = relevantZoneInfos; _a < relevantZoneInfos_1.length; _a++) {
            var zoneInfo = relevantZoneInfos_1[_a];
            // find applicable transition moments
            transitions = transitions.concat(this.getTransitionsDstOffsets(zoneInfo.ruleName, utcTime.components.year - 1, utcTime.components.year + 1, zoneInfo.gmtoff));
        }
        transitions.sort(function (a, b) {
            return a.at - b.at;
        });
        // find the first after the given date that has a different offset
        var prevSave;
        for (var _b = 0, transitions_1 = transitions; _b < transitions_1.length; _b++) {
            var transition = transitions_1[_b];
            if (!prevSave || !prevSave.equals(transition.offset)) {
                if (transition.at > utcTime.unixMillis) {
                    return transition.at;
                }
            }
            prevSave = transition.offset;
        }
        return undefined;
    };
    /**
     * Returns true iff the given zone name eventually links to
     * "Etc/UTC", "Etc/GMT" or "Etc/UCT" in the TZ database. This is true e.g. for
     * "UTC", "GMT", "Etc/GMT" etc.
     *
     * @param zoneName	IANA time zone name.
     */
    TzDatabase.prototype.zoneIsUtc = function (zoneName) {
        var actualZoneName = zoneName;
        var zoneEntries = this._data.zones[zoneName];
        // follow links
        while (typeof (zoneEntries) === "string") {
            /* istanbul ignore if */
            if (!this._data.zones.hasOwnProperty(zoneEntries)) {
                throw new Error("Zone \"" + zoneEntries + "\" not found (referred to in link from \""
                    + zoneName + "\" via \"" + actualZoneName + "\"");
            }
            actualZoneName = zoneEntries;
            zoneEntries = this._data.zones[actualZoneName];
        }
        return (actualZoneName === "Etc/UTC" || actualZoneName === "Etc/GMT" || actualZoneName === "Etc/UCT");
    };
    TzDatabase.prototype.normalizeLocal = function (zoneName, a, opt) {
        if (opt === void 0) { opt = NormalizeOption.Up; }
        if (this.hasDst(zoneName)) {
            var localTime = (typeof a === "number" ? new basics_1.TimeStruct(a) : a);
            // local times behave like this during DST changes:
            // forward change (1h):   0 1 3 4 5
            // forward change (2h):   0 1 4 5 6
            // backward change (1h):  1 2 2 3 4
            // backward change (2h):  1 2 1 2 3
            // Therefore, binary searching is not possible.
            // Instead, we should check the DST forward transitions within a window around the local time
            // get all transitions (note this includes fake transition rules for zone offset changes)
            var transitions = this.getTransitionsTotalOffsets(zoneName, localTime.components.year - 1, localTime.components.year + 1);
            // find the DST forward transitions
            var prev = duration_1.Duration.hours(0);
            for (var _i = 0, transitions_2 = transitions; _i < transitions_2.length; _i++) {
                var transition = transitions_2[_i];
                // forward transition?
                if (transition.offset.greaterThan(prev)) {
                    var localBefore = transition.at + prev.milliseconds();
                    var localAfter = transition.at + transition.offset.milliseconds();
                    if (localTime.unixMillis >= localBefore && localTime.unixMillis < localAfter) {
                        var forwardChange = transition.offset.sub(prev);
                        // non-existing time
                        var factor = (opt === NormalizeOption.Up ? 1 : -1);
                        var resultMillis = localTime.unixMillis + factor * forwardChange.milliseconds();
                        return (typeof a === "number" ? resultMillis : new basics_1.TimeStruct(resultMillis));
                    }
                }
                prev = transition.offset;
            }
            // no non-existing time
        }
        return (typeof a === "number" ? a : a.clone());
    };
    /**
     * Returns the standard time zone offset from UTC, without DST.
     * Throws if info not found.
     * @param zoneName	IANA time zone name
     * @param utcTime	Timestamp in UTC, either as TimeStruct or as Unix millisecond value
     */
    TzDatabase.prototype.standardOffset = function (zoneName, utcTime) {
        var zoneInfo = this.getZoneInfo(zoneName, utcTime);
        return zoneInfo.gmtoff.clone();
    };
    /**
     * Returns the total time zone offset from UTC, including DST, at
     * the given UTC timestamp.
     * Throws if zone info not found.
     *
     * @param zoneName	IANA time zone name
     * @param utcTime	Timestamp in UTC, either as TimeStruct or as Unix millisecond value
     */
    TzDatabase.prototype.totalOffset = function (zoneName, utcTime) {
        var zoneInfo = this.getZoneInfo(zoneName, utcTime);
        var dstOffset;
        switch (zoneInfo.ruleType) {
            case RuleType.None:
                {
                    dstOffset = duration_1.Duration.minutes(0);
                }
                break;
            case RuleType.Offset:
                {
                    dstOffset = zoneInfo.ruleOffset;
                }
                break;
            case RuleType.RuleName:
                {
                    dstOffset = this.dstOffsetForRule(zoneInfo.ruleName, utcTime, zoneInfo.gmtoff);
                }
                break;
            default: // cannot happen, but the compiler doesnt realize it
                dstOffset = duration_1.Duration.minutes(0);
                break;
        }
        return dstOffset.add(zoneInfo.gmtoff);
    };
    /**
     * The time zone rule abbreviation, e.g. CEST for Central European Summer Time.
     * Note this is dependent on the time, because with time different rules are in effect
     * and therefore different abbreviations. They also change with DST: e.g. CEST or CET.
     *
     * @param zoneName	IANA zone name
     * @param utcTime	Timestamp in UTC unix milliseconds
     * @param dstDependent (default true) set to false for a DST-agnostic abbreviation
     * @return	The abbreviation of the rule that is in effect
     */
    TzDatabase.prototype.abbreviation = function (zoneName, utcTime, dstDependent) {
        if (dstDependent === void 0) { dstDependent = true; }
        var zoneInfo = this.getZoneInfo(zoneName, utcTime);
        var format = zoneInfo.format;
        // is format dependent on DST?
        if (format.indexOf("%s") !== -1
            && zoneInfo.ruleType === RuleType.RuleName) {
            var letter = void 0;
            // place in format string
            if (dstDependent) {
                letter = this.letterForRule(zoneInfo.ruleName, utcTime, zoneInfo.gmtoff);
            }
            else {
                letter = "";
            }
            return format.replace("%s", letter);
        }
        return format;
    };
    /**
     * Returns the standard time zone offset from UTC, excluding DST, at
     * the given LOCAL timestamp, again excluding DST.
     *
     * If the local timestamp exists twice (as can occur very rarely due to zone changes)
     * then the first occurrence is returned.
     *
     * Throws if zone info not found.
     *
     * @param zoneName	IANA time zone name
     * @param localTime	Timestamp in time zone time
     */
    TzDatabase.prototype.standardOffsetLocal = function (zoneName, localTime) {
        var unixMillis = (typeof localTime === "number" ? localTime : localTime.unixMillis);
        var zoneInfos = this.getZoneInfos(zoneName);
        for (var _i = 0, zoneInfos_3 = zoneInfos; _i < zoneInfos_3.length; _i++) {
            var zoneInfo = zoneInfos_3[_i];
            if (zoneInfo.until === undefined || zoneInfo.until + zoneInfo.gmtoff.milliseconds() > unixMillis) {
                return zoneInfo.gmtoff.clone();
            }
        }
        /* istanbul ignore if */
        /* istanbul ignore next */
        if (true) {
            throw new Error("No zone info found");
        }
    };
    /**
     * Returns the total time zone offset from UTC, including DST, at
     * the given LOCAL timestamp. Non-existing local time is normalized out.
     * There can be multiple UTC times and therefore multiple offsets for a local time
     * namely during a backward DST change. This returns the FIRST such offset.
     * Throws if zone info not found.
     *
     * @param zoneName	IANA time zone name
     * @param localTime	Timestamp in time zone time
     */
    TzDatabase.prototype.totalOffsetLocal = function (zoneName, localTime) {
        var ts = (typeof localTime === "number" ? new basics_1.TimeStruct(localTime) : localTime);
        var normalizedTm = this.normalizeLocal(zoneName, ts);
        /// Note: during offset changes, local time can behave like:
        // forward change (1h):   0 1 3 4 5
        // forward change (2h):   0 1 4 5 6
        // backward change (1h):  1 2 2 3 4
        // backward change (2h):  1 2 1 2 3  <-- note time going BACKWARD
        // Therefore binary search does not apply. Linear search through transitions
        // and return the first offset that matches
        var transitions = this.getTransitionsTotalOffsets(zoneName, normalizedTm.components.year - 1, normalizedTm.components.year + 1);
        var prev;
        var prevPrev;
        for (var _i = 0, transitions_3 = transitions; _i < transitions_3.length; _i++) {
            var transition = transitions_3[_i];
            if (transition.at + transition.offset.milliseconds() > normalizedTm.unixMillis) {
                // found offset: prev.offset applies
                break;
            }
            prevPrev = prev;
            prev = transition;
        }
        /* istanbul ignore else */
        if (prev) {
            // special care during backward change: take first occurrence of local time
            if (prevPrev && prevPrev.offset.greaterThan(prev.offset)) {
                // backward change
                var diff = prevPrev.offset.sub(prev.offset);
                if (normalizedTm.unixMillis >= prev.at + prev.offset.milliseconds()
                    && normalizedTm.unixMillis < prev.at + prev.offset.milliseconds() + diff.milliseconds()) {
                    // within duplicate range
                    return prevPrev.offset.clone();
                }
                else {
                    return prev.offset.clone();
                }
            }
            else {
                return prev.offset.clone();
            }
        }
        else {
            // this cannot happen as the transitions array is guaranteed to contain a transition at the
            // beginning of the requested fromYear
            return duration_1.Duration.hours(0);
        }
    };
    /**
     * Returns the DST offset (WITHOUT the standard zone offset) for the given
     * ruleset and the given UTC timestamp
     *
     * @param ruleName	name of ruleset
     * @param utcTime	UTC timestamp
     * @param standardOffset	Standard offset without DST for the time zone
     */
    TzDatabase.prototype.dstOffsetForRule = function (ruleName, utcTime, standardOffset) {
        var ts = (typeof utcTime === "number" ? new basics_1.TimeStruct(utcTime) : utcTime);
        // find applicable transition moments
        var transitions = this.getTransitionsDstOffsets(ruleName, ts.components.year - 1, ts.components.year, standardOffset);
        // find the last prior to given date
        var offset;
        for (var i = transitions.length - 1; i >= 0; i--) {
            var transition = transitions[i];
            if (transition.at <= ts.unixMillis) {
                offset = transition.offset.clone();
                break;
            }
        }
        /* istanbul ignore if */
        if (!offset) {
            // apparently no longer DST, as e.g. for Asia/Tokyo
            offset = duration_1.Duration.minutes(0);
        }
        return offset;
    };
    /**
     * Returns the time zone letter for the given
     * ruleset and the given UTC timestamp
     *
     * @param ruleName	name of ruleset
     * @param utcTime	UTC timestamp as TimeStruct or unix millis
     * @param standardOffset	Standard offset without DST for the time zone
     */
    TzDatabase.prototype.letterForRule = function (ruleName, utcTime, standardOffset) {
        var ts = (typeof utcTime === "number" ? new basics_1.TimeStruct(utcTime) : utcTime);
        // find applicable transition moments
        var transitions = this.getTransitionsDstOffsets(ruleName, ts.components.year - 1, ts.components.year, standardOffset);
        // find the last prior to given date
        var letter;
        for (var i = transitions.length - 1; i >= 0; i--) {
            var transition = transitions[i];
            if (transition.at <= ts.unixMillis) {
                letter = transition.letter;
                break;
            }
        }
        /* istanbul ignore if */
        if (!letter) {
            // apparently no longer DST, as e.g. for Asia/Tokyo
            letter = "";
        }
        return letter;
    };
    /**
     * Return a list of all transitions in [fromYear..toYear] sorted by effective date
     *
     * @param ruleName	Name of the rule set
     * @param fromYear	first year to return transitions for
     * @param toYear	Last year to return transitions for
     * @param standardOffset	Standard offset without DST for the time zone
     *
     * @return Transitions, with DST offsets (no standard offset included)
     */
    TzDatabase.prototype.getTransitionsDstOffsets = function (ruleName, fromYear, toYear, standardOffset) {
        assert_1.default(fromYear <= toYear, "fromYear must be <= toYear");
        var ruleInfos = this.getRuleInfos(ruleName);
        var result = [];
        for (var y = fromYear; y <= toYear; y++) {
            var prevInfo = void 0;
            for (var _i = 0, ruleInfos_1 = ruleInfos; _i < ruleInfos_1.length; _i++) {
                var ruleInfo = ruleInfos_1[_i];
                if (ruleInfo.applicable(y)) {
                    result.push(new Transition(ruleInfo.transitionTimeUtc(y, standardOffset, prevInfo), ruleInfo.save, ruleInfo.letter));
                }
                prevInfo = ruleInfo;
            }
        }
        result.sort(function (a, b) {
            return a.at - b.at;
        });
        return result;
    };
    /**
     * Return both zone and rule changes as total (std + dst) offsets.
     * Adds an initial transition if there is no zone change within the range.
     *
     * @param zoneName	IANA zone name
     * @param fromYear	First year to include
     * @param toYear	Last year to include
     */
    TzDatabase.prototype.getTransitionsTotalOffsets = function (zoneName, fromYear, toYear) {
        assert_1.default(fromYear <= toYear, "fromYear must be <= toYear");
        var startMillis = basics.timeToUnixNoLeapSecs({ year: fromYear });
        var endMillis = basics.timeToUnixNoLeapSecs({ year: toYear + 1 });
        var zoneInfos = this.getZoneInfos(zoneName);
        assert_1.default(zoneInfos.length > 0, "Empty zoneInfos array returned from getZoneInfos()");
        var result = [];
        var prevZone;
        var prevUntilYear;
        var prevStdOffset = duration_1.Duration.hours(0);
        var prevDstOffset = duration_1.Duration.hours(0);
        var prevLetter = "";
        for (var _i = 0, zoneInfos_4 = zoneInfos; _i < zoneInfos_4.length; _i++) {
            var zoneInfo = zoneInfos_4[_i];
            var untilYear = zoneInfo.until !== undefined ? new basics_1.TimeStruct(zoneInfo.until).components.year : toYear + 1;
            var stdOffset = prevStdOffset;
            var dstOffset = prevDstOffset;
            var letter = prevLetter;
            // zone applicable?
            if ((!prevZone || prevZone.until < endMillis - 1) && (zoneInfo.until === undefined || zoneInfo.until >= startMillis)) {
                stdOffset = zoneInfo.gmtoff;
                switch (zoneInfo.ruleType) {
                    case RuleType.None:
                        dstOffset = duration_1.Duration.hours(0);
                        letter = "";
                        break;
                    case RuleType.Offset:
                        dstOffset = zoneInfo.ruleOffset;
                        letter = "";
                        break;
                    case RuleType.RuleName:
                        // check whether the first rule takes effect immediately on the zone transition
                        // (e.g. Lybia)
                        if (prevZone) {
                            var ruleInfos = this.getRuleInfos(zoneInfo.ruleName);
                            for (var _a = 0, ruleInfos_2 = ruleInfos; _a < ruleInfos_2.length; _a++) {
                                var ruleInfo = ruleInfos_2[_a];
                                if (typeof prevUntilYear === "number" && ruleInfo.applicable(prevUntilYear)) {
                                    if (ruleInfo.transitionTimeUtc(prevUntilYear, stdOffset, undefined) === prevZone.until) {
                                        dstOffset = ruleInfo.save;
                                        letter = ruleInfo.letter;
                                    }
                                }
                            }
                        }
                        break;
                }
                // add a transition for the zone transition
                var at = (prevZone && prevZone.until !== undefined ? prevZone.until : startMillis);
                result.push(new Transition(at, stdOffset.add(dstOffset), letter));
                // add transitions for the zone rules in the range
                if (zoneInfo.ruleType === RuleType.RuleName) {
                    var dstTransitions = this.getTransitionsDstOffsets(zoneInfo.ruleName, prevUntilYear !== undefined ? Math.max(prevUntilYear, fromYear) : fromYear, Math.min(untilYear, toYear), stdOffset);
                    for (var _b = 0, dstTransitions_1 = dstTransitions; _b < dstTransitions_1.length; _b++) {
                        var transition = dstTransitions_1[_b];
                        letter = transition.letter;
                        dstOffset = transition.offset;
                        result.push(new Transition(transition.at, transition.offset.add(stdOffset), transition.letter));
                    }
                }
            }
            prevZone = zoneInfo;
            prevUntilYear = untilYear;
            prevStdOffset = stdOffset;
            prevDstOffset = dstOffset;
            prevLetter = letter;
        }
        result.sort(function (a, b) {
            return a.at - b.at;
        });
        return result;
    };
    /**
     * Get the zone info for the given UTC timestamp. Throws if not found.
     * @param zoneName	IANA time zone name
     * @param utcTime	UTC time stamp as unix milliseconds or as a TimeStruct
     * @returns	ZoneInfo object. Do not change, we cache this object.
     */
    TzDatabase.prototype.getZoneInfo = function (zoneName, utcTime) {
        var unixMillis = (typeof utcTime === "number" ? utcTime : utcTime.unixMillis);
        var zoneInfos = this.getZoneInfos(zoneName);
        for (var _i = 0, zoneInfos_5 = zoneInfos; _i < zoneInfos_5.length; _i++) {
            var zoneInfo = zoneInfos_5[_i];
            if (zoneInfo.until === undefined || zoneInfo.until > unixMillis) {
                return zoneInfo;
            }
        }
        /* istanbul ignore if */
        /* istanbul ignore next */
        if (true) {
            throw new Error("No zone info found");
        }
    };
    /**
     * Return the zone records for a given zone name, after
     * following any links.
     *
     * @param zoneName	IANA zone name like "Pacific/Efate"
     * @return Array of zone infos. Do not change, this is a cached value.
     */
    TzDatabase.prototype.getZoneInfos = function (zoneName) {
        // FIRST validate zone name before searching cache
        /* istanbul ignore if */
        if (!this._data.zones.hasOwnProperty(zoneName)) {
            /* istanbul ignore if */
            /* istanbul ignore next */
            if (true) {
                throw new Error("Zone \"" + zoneName + "\" not found.");
            }
        }
        // Take from cache
        if (this._zoneInfoCache.hasOwnProperty(zoneName)) {
            return this._zoneInfoCache[zoneName];
        }
        var result = [];
        var actualZoneName = zoneName;
        var zoneEntries = this._data.zones[zoneName];
        // follow links
        while (typeof (zoneEntries) === "string") {
            /* istanbul ignore if */
            if (!this._data.zones.hasOwnProperty(zoneEntries)) {
                throw new Error("Zone \"" + zoneEntries + "\" not found (referred to in link from \""
                    + zoneName + "\" via \"" + actualZoneName + "\"");
            }
            actualZoneName = zoneEntries;
            zoneEntries = this._data.zones[actualZoneName];
        }
        // final zone info found
        for (var _i = 0, zoneEntries_1 = zoneEntries; _i < zoneEntries_1.length; _i++) {
            var zoneEntry = zoneEntries_1[_i];
            var ruleType = this.parseRuleType(zoneEntry[1]);
            var until = math.filterFloat(zoneEntry[3]);
            if (isNaN(until)) {
                until = undefined;
            }
            result.push(new ZoneInfo(duration_1.Duration.minutes(-1 * math.filterFloat(zoneEntry[0])), ruleType, ruleType === RuleType.Offset ? new duration_1.Duration(zoneEntry[1]) : new duration_1.Duration(), ruleType === RuleType.RuleName ? zoneEntry[1] : "", zoneEntry[2], until));
        }
        result.sort(function (a, b) {
            // sort undefined last
            /* istanbul ignore if */
            if (a.until === undefined && b.until === undefined) {
                return 0;
            }
            if (a.until !== undefined && b.until === undefined) {
                return -1;
            }
            if (a.until === undefined && b.until !== undefined) {
                return 1;
            }
            return (a.until - b.until);
        });
        this._zoneInfoCache[zoneName] = result;
        return result;
    };
    /**
     * Returns the rule set with the given rule name,
     * sorted by first effective date (uncompensated for "w" or "s" AtTime)
     *
     * @param ruleName	Name of rule set
     * @return RuleInfo array. Do not change, this is a cached value.
     */
    TzDatabase.prototype.getRuleInfos = function (ruleName) {
        // validate name BEFORE searching cache
        if (!this._data.rules.hasOwnProperty(ruleName)) {
            throw new Error("Rule set \"" + ruleName + "\" not found.");
        }
        // return from cache
        if (this._ruleInfoCache.hasOwnProperty(ruleName)) {
            return this._ruleInfoCache[ruleName];
        }
        var result = [];
        var ruleSet = this._data.rules[ruleName];
        for (var _i = 0, ruleSet_1 = ruleSet; _i < ruleSet_1.length; _i++) {
            var rule = ruleSet_1[_i];
            var fromYear = (rule[0] === "NaN" ? -10000 : parseInt(rule[0], 10));
            var toType = this.parseToType(rule[1]);
            var toYear = (toType === ToType.Max ? 0 : (rule[1] === "only" ? fromYear : parseInt(rule[1], 10)));
            var onType = this.parseOnType(rule[4]);
            var onDay = this.parseOnDay(rule[4], onType);
            var onWeekDay = this.parseOnWeekDay(rule[4]);
            var monthName = rule[3];
            var monthNumber = monthNameToString(monthName);
            result.push(new RuleInfo(fromYear, toType, toYear, rule[2], monthNumber, onType, onDay, onWeekDay, math.positiveModulo(parseInt(rule[5][0], 10), 24), // note the database sometimes contains "24" as hour value
            math.positiveModulo(parseInt(rule[5][1], 10), 60), math.positiveModulo(parseInt(rule[5][2], 10), 60), this.parseAtType(rule[5][3]), duration_1.Duration.minutes(parseInt(rule[6], 10)), rule[7] === "-" ? "" : rule[7]));
        }
        result.sort(function (a, b) {
            /* istanbul ignore if */
            if (a.effectiveEqual(b)) {
                return 0;
            }
            else if (a.effectiveLess(b)) {
                return -1;
            }
            else {
                return 1;
            }
        });
        this._ruleInfoCache[ruleName] = result;
        return result;
    };
    /**
     * Parse the RULES column of a zone info entry
     * and see what kind of entry it is.
     */
    TzDatabase.prototype.parseRuleType = function (rule) {
        if (rule === "-") {
            return RuleType.None;
        }
        else if (isValidOffsetString(rule)) {
            return RuleType.Offset;
        }
        else {
            return RuleType.RuleName;
        }
    };
    /**
     * Parse the TO column of a rule info entry
     * and see what kind of entry it is.
     */
    TzDatabase.prototype.parseToType = function (to) {
        if (to === "max") {
            return ToType.Max;
        }
        else if (to === "only") {
            return ToType.Year; // yes we return Year for only
        }
        else if (!isNaN(parseInt(to, 10))) {
            return ToType.Year;
        }
        else {
            /* istanbul ignore if */
            /* istanbul ignore next */
            if (true) {
                throw new Error("TO column incorrect: " + to);
            }
        }
    };
    /**
     * Parse the ON column of a rule info entry
     * and see what kind of entry it is.
     */
    TzDatabase.prototype.parseOnType = function (on) {
        if (on.length > 4 && on.substr(0, 4) === "last") {
            return OnType.LastX;
        }
        if (on.indexOf("<=") !== -1) {
            return OnType.LeqX;
        }
        if (on.indexOf(">=") !== -1) {
            return OnType.GreqX;
        }
        return OnType.DayNum;
    };
    /**
     * Get the day number from an ON column string, 0 if no day.
     */
    TzDatabase.prototype.parseOnDay = function (on, onType) {
        switch (onType) {
            case OnType.DayNum: return parseInt(on, 10);
            case OnType.LeqX: return parseInt(on.substr(on.indexOf("<=") + 2), 10);
            case OnType.GreqX: return parseInt(on.substr(on.indexOf(">=") + 2), 10);
            /* istanbul ignore next */
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    return 0;
                }
        }
    };
    /**
     * Get the day-of-week from an ON column string, Sunday if not present.
     */
    TzDatabase.prototype.parseOnWeekDay = function (on) {
        for (var i = 0; i < 7; i++) {
            if (on.indexOf(TzDayNames[i]) !== -1) {
                return i;
            }
        }
        /* istanbul ignore if */
        /* istanbul ignore next */
        if (true) {
            return basics_1.WeekDay.Sunday;
        }
    };
    /**
     * Parse the AT column of a rule info entry
     * and see what kind of entry it is.
     */
    TzDatabase.prototype.parseAtType = function (at) {
        switch (at) {
            case "s": return AtType.Standard;
            case "u": return AtType.Utc;
            case "g": return AtType.Utc;
            case "z": return AtType.Utc;
            case "w": return AtType.Wall;
            case "": return AtType.Wall;
            case null: return AtType.Wall;
            default:
                /* istanbul ignore if */
                /* istanbul ignore next */
                if (true) {
                    return AtType.Wall;
                }
        }
    };
    return TzDatabase;
}());
exports.TzDatabase = TzDatabase;
/**
 * Sanity check on data. Returns min/max values.
 */
function validateData(data) {
    var result = {};
    /* istanbul ignore if */
    if (typeof (data) !== "object") {
        throw new Error("data is not an object");
    }
    /* istanbul ignore if */
    if (!data.hasOwnProperty("rules")) {
        throw new Error("data has no rules property");
    }
    /* istanbul ignore if */
    if (!data.hasOwnProperty("zones")) {
        throw new Error("data has no zones property");
    }
    // validate zones
    for (var zoneName in data.zones) {
        if (data.zones.hasOwnProperty(zoneName)) {
            var zoneArr = data.zones[zoneName];
            if (typeof (zoneArr) === "string") {
                // ok, is link to other zone, check link
                /* istanbul ignore if */
                if (!data.zones.hasOwnProperty(zoneArr)) {
                    throw new Error("Entry for zone \"" + zoneName + "\" links to \"" + zoneArr + "\" but that doesn\'t exist");
                }
            }
            else {
                /* istanbul ignore if */
                if (!Array.isArray(zoneArr)) {
                    throw new Error("Entry for zone \"" + zoneName + "\" is neither a string nor an array");
                }
                for (var i = 0; i < zoneArr.length; i++) {
                    var entry = zoneArr[i];
                    /* istanbul ignore if */
                    if (!Array.isArray(entry)) {
                        throw new Error("Entry " + i.toString(10) + " for zone \"" + zoneName + "\" is not an array");
                    }
                    /* istanbul ignore if */
                    if (entry.length !== 4) {
                        throw new Error("Entry " + i.toString(10) + " for zone \"" + zoneName + "\" has length != 4");
                    }
                    /* istanbul ignore if */
                    if (typeof entry[0] !== "string") {
                        throw new Error("Entry " + i.toString(10) + " for zone \"" + zoneName + "\" first column is not a string");
                    }
                    var gmtoff = math.filterFloat(entry[0]);
                    /* istanbul ignore if */
                    if (isNaN(gmtoff)) {
                        throw new Error("Entry " + i.toString(10) + " for zone \"" + zoneName + "\" first column does not contain a number");
                    }
                    /* istanbul ignore if */
                    if (typeof entry[1] !== "string") {
                        throw new Error("Entry " + i.toString(10) + " for zone \"" + zoneName + "\" second column is not a string");
                    }
                    /* istanbul ignore if */
                    if (typeof entry[2] !== "string") {
                        throw new Error("Entry " + i.toString(10) + " for zone \"" + zoneName + "\" third column is not a string");
                    }
                    /* istanbul ignore if */
                    if (typeof entry[3] !== "string" && entry[3] !== null) {
                        throw new Error("Entry " + i.toString(10) + " for zone \"" + zoneName + "\" fourth column is not a string nor null");
                    }
                    /* istanbul ignore if */
                    if (typeof entry[3] === "string" && isNaN(math.filterFloat(entry[3]))) {
                        throw new Error("Entry " + i.toString(10) + " for zone \"" + zoneName + "\" fourth column does not contain a number");
                    }
                    if (result.maxGmtOff === undefined || gmtoff > result.maxGmtOff) {
                        result.maxGmtOff = gmtoff;
                    }
                    if (result.minGmtOff === undefined || gmtoff < result.minGmtOff) {
                        result.minGmtOff = gmtoff;
                    }
                }
            }
        }
    }
    // validate rules
    for (var ruleName in data.rules) {
        if (data.rules.hasOwnProperty(ruleName)) {
            var ruleArr = data.rules[ruleName];
            /* istanbul ignore if */
            if (!Array.isArray(ruleArr)) {
                throw new Error("Entry for rule \"" + ruleName + "\" is not an array");
            }
            for (var i = 0; i < ruleArr.length; i++) {
                var rule = ruleArr[i];
                /* istanbul ignore if */
                if (!Array.isArray(rule)) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "] is not an array");
                }
                /* istanbul ignore if */
                if (rule.length < 8) { // note some rules > 8 exists but that seems to be a bug in tz file parsing
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "] is not of length 8");
                }
                for (var j = 0; j < rule.length; j++) {
                    /* istanbul ignore if */
                    if (j !== 5 && typeof rule[j] !== "string") {
                        throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][" + j.toString(10) + "] is not a string");
                    }
                }
                /* istanbul ignore if */
                if (rule[0] !== "NaN" && isNaN(parseInt(rule[0], 10))) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][0] is not a number");
                }
                /* istanbul ignore if */
                if (rule[1] !== "only" && rule[1] !== "max" && isNaN(parseInt(rule[1], 10))) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][1] is not a number, only or max");
                }
                /* istanbul ignore if */
                if (!TzMonthNames.hasOwnProperty(rule[3])) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][3] is not a month name");
                }
                /* istanbul ignore if */
                if (rule[4].substr(0, 4) !== "last" && rule[4].indexOf(">=") === -1
                    && rule[4].indexOf("<=") === -1 && isNaN(parseInt(rule[4], 10))) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][4] is not a known type of expression");
                }
                /* istanbul ignore if */
                if (!Array.isArray(rule[5])) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][5] is not an array");
                }
                /* istanbul ignore if */
                if (rule[5].length !== 4) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][5] is not of length 4");
                }
                /* istanbul ignore if */
                if (isNaN(parseInt(rule[5][0], 10))) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][5][0] is not a number");
                }
                /* istanbul ignore if */
                if (isNaN(parseInt(rule[5][1], 10))) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][5][1] is not a number");
                }
                /* istanbul ignore if */
                if (isNaN(parseInt(rule[5][2], 10))) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][5][2] is not a number");
                }
                /* istanbul ignore if */
                if (rule[5][3] !== "" && rule[5][3] !== "s" && rule[5][3] !== "w"
                    && rule[5][3] !== "g" && rule[5][3] !== "u" && rule[5][3] !== "z" && rule[5][3] !== null) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][5][3] is not empty, g, z, s, w, u or null");
                }
                var save = parseInt(rule[6], 10);
                /* istanbul ignore if */
                if (isNaN(save)) {
                    throw new Error("Rule " + ruleName + "[" + i.toString(10) + "][6] does not contain a valid number");
                }
                if (save !== 0) {
                    if (result.maxDstSave === undefined || save > result.maxDstSave) {
                        result.maxDstSave = save;
                    }
                    if (result.minDstSave === undefined || save < result.minDstSave) {
                        result.minDstSave = save;
                    }
                }
            }
        }
    }
    return result;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./assert":1,"./basics":2,"./duration":4,"./math":9}],"timezonecomplete":[function(require,module,exports){
/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 *
 * Date and Time utility functions - main index
 */
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./basics"));
__export(require("./datetime"));
__export(require("./duration"));
__export(require("./format"));
__export(require("./globals"));
__export(require("./javascript"));
__export(require("./locale"));
__export(require("./parse"));
__export(require("./period"));
__export(require("./basics"));
__export(require("./timesource"));
__export(require("./timezone"));
__export(require("./tz-database"));

},{"./basics":2,"./datetime":3,"./duration":4,"./format":5,"./globals":6,"./javascript":7,"./locale":8,"./parse":10,"./period":11,"./timesource":13,"./timezone":14,"./tz-database":16}]},{},[])("timezonecomplete")
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL2Fzc2VydC50cyIsInNyYy9saWIvYmFzaWNzLnRzIiwic3JjL2xpYi9kYXRldGltZS50cyIsInNyYy9saWIvZHVyYXRpb24udHMiLCJzcmMvbGliL2Zvcm1hdC50cyIsInNyYy9saWIvZ2xvYmFscy50cyIsInNyYy9saWIvamF2YXNjcmlwdC50cyIsInNyYy9saWIvbG9jYWxlLnRzIiwic3JjL2xpYi9tYXRoLnRzIiwic3JjL2xpYi9wYXJzZS50cyIsInNyYy9saWIvcGVyaW9kLnRzIiwic3JjL2xpYi9zdHJpbmdzLnRzIiwic3JjL2xpYi90aW1lc291cmNlLnRzIiwic3JjL2xpYi90aW1lem9uZS50cyIsInNyYy9saWIvdG9rZW4udHMiLCJkaXN0L2xpYi9zcmMvbGliL3R6LWRhdGFiYXNlLnRzIiwic3JjL2xpYi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztHQUVHO0FBRUgsWUFBWSxDQUFDOztBQUViLFNBQVMsTUFBTSxDQUFDLFNBQWMsRUFBRSxPQUFlO0lBQzlDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3pCO0FBQ0YsQ0FBQztBQUVELGtCQUFlLE1BQU0sQ0FBQzs7O0FDWnRCOzs7O0dBSUc7QUFFSCxZQUFZLENBQUM7O0FBRWIsbUNBQThCO0FBQzlCLDJDQUE2QztBQUM3Qyw2QkFBK0I7QUFDL0IsbUNBQXFDO0FBc0VyQzs7O0dBR0c7QUFDSCxJQUFZLE9BUVg7QUFSRCxXQUFZLE9BQU87SUFDbEIseUNBQU0sQ0FBQTtJQUNOLHlDQUFNLENBQUE7SUFDTiwyQ0FBTyxDQUFBO0lBQ1AsK0NBQVMsQ0FBQTtJQUNULDZDQUFRLENBQUE7SUFDUix5Q0FBTSxDQUFBO0lBQ04sNkNBQVEsQ0FBQTtBQUNULENBQUMsRUFSVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVB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QUksRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7SUFDMUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtJQUN6QyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0lBQ3pDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7SUFDeEMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtJQUN4QyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0lBQ3hDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFO0lBQzFCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7SUFDNUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtJQUM1QyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0lBQzVDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7SUFDOUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtJQUM5QyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0lBQzlDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7SUFDekMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtJQUN6QyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0lBQ3pDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7SUFDekMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtJQUN6QyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0lBQ3pDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7SUFDM0MsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtJQUMzQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUM3QixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUM3QixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0lBQ3pDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7SUFDekMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQzVDLENBQUMsRUFBRSxF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QUEwQjtBQUMxQixrQ0FBNkI7QUFDN0IsOEJBQXlCO0FBQ3pCLDZCQUF3QjtBQUN4Qiw4QkFBeUI7QUFDekIsOEJBQXlCO0FBQ3pCLGtDQUE2QjtBQUM3QixnQ0FBMkI7QUFDM0IsbUNBQThCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgMjAxNiBBQkIgU3dpdHplcmxhbmQgTHRkLlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uOiBhbnksIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuXHRpZiAoIWNvbmRpdGlvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NlcnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSAyMDE0IEFCQiBTd2l0emVybGFuZCBMdGQuXG4gKlxuICogT2xzZW4gVGltZXpvbmUgRGF0YWJhc2UgY29udGFpbmVyXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBhc3NlcnQgZnJvbSBcIi4vYXNzZXJ0XCI7XG5pbXBvcnQgeyBEYXRlRnVuY3Rpb25zIH0gZnJvbSBcIi4vamF2YXNjcmlwdFwiO1xuaW1wb3J0ICogYXMgbWF0aCBmcm9tIFwiLi9tYXRoXCI7XG5pbXBvcnQgKiBhcyBzdHJpbmdzIGZyb20gXCIuL3N0cmluZ3NcIjtcblxuLyoqXG4gKiBVc2VkIGZvciBtZXRob2RzIHRoYXQgdGFrZSBhIHRpbWVzdGFtcCBhcyBzZXBhcmF0ZSB5ZWFyL21vbnRoLy4uLiBjb21wb25lbnRzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUNvbXBvbmVudE9wdHMge1xuXHQvKipcblx0ICogWWVhciwgZGVmYXVsdCAxOTcwXG5cdCAqL1xuXHR5ZWFyPzogbnVtYmVyO1xuXHQvKipcblx0ICogTW9udGggMS0xMiwgZGVmYXVsdCAxXG5cdCAqL1xuXHRtb250aD86IG51bWJlcjtcblx0LyoqXG5cdCAqIERheSBvZiBtb250aCAxLTMxLCBkZWZhdWx0IDFcblx0ICovXG5cdGRheT86IG51bWJlcjtcblx0LyoqXG5cdCAqIEhvdXIgb2YgZGF5IDAtMjMsIGRlZmF1bHQgMFxuXHQgKi9cblx0aG91cj86IG51bWJlcjtcblx0LyoqXG5cdCAqIE1pbnV0ZSAwLTU5LCBkZWZhdWx0IDBcblx0ICovXG5cdG1pbnV0ZT86IG51bWJlcjtcblx0LyoqXG5cdCAqIFNlY29uZCAwLTU5LCBkZWZhdWx0IDBcblx0ICovXG5cdHNlY29uZD86IG51bWJlcjtcblx0LyoqXG5cdCAqIE1pbGxpc2Vjb25kIDAtOTk5LCBkZWZhdWx0IDBcblx0ICovXG5cdG1pbGxpPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRpbWVzdGFtcCByZXByZXNlbnRlZCBhcyBzZXBhcmF0ZSB5ZWFyL21vbnRoLy4uLiBjb21wb25lbnRzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUNvbXBvbmVudHMge1xuXHQvKipcblx0ICogWWVhclxuXHQgKi9cblx0eWVhcjogbnVtYmVyO1xuXHQvKipcblx0ICogTW9udGggMS0xMlxuXHQgKi9cblx0bW9udGg6IG51bWJlcjtcblx0LyoqXG5cdCAqIERheSBvZiBtb250aCAxLTMxXG5cdCAqL1xuXHRkYXk6IG51bWJlcjtcblx0LyoqXG5cdCAqIEhvdXIgMC0yM1xuXHQgKi9cblx0aG91cjogbnVtYmVyO1xuXHQvKipcblx0ICogTWludXRlXG5cdCAqL1xuXHRtaW51dGU6IG51bWJlcjtcblx0LyoqXG5cdCAqIFNlY29uZFxuXHQgKi9cblx0c2Vjb25kOiBudW1iZXI7XG5cdC8qKlxuXHQgKiBNaWxsaXNlY29uZCAwLTk5OVxuXHQgKi9cblx0bWlsbGk6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBEYXktb2Ytd2Vlay4gTm90ZSB0aGUgZW51bSB2YWx1ZXMgY29ycmVzcG9uZCB0byBKYXZhU2NyaXB0IGRheS1vZi13ZWVrOlxuICogU3VuZGF5ID0gMCwgTW9uZGF5ID0gMSBldGNcbiAqL1xuZXhwb3J0IGVudW0gV2Vla0RheSB7XG5cdFN1bmRheSxcblx0TW9uZGF5LFxuXHRUdWVzZGF5LFxuXHRXZWRuZXNkYXksXG5cdFRodXJzZGF5LFxuXHRGcmlkYXksXG5cdFNhdHVyZGF5XG59XG5cbi8qKlxuICogVGltZSB1bml0c1xuICovXG5leHBvcnQgZW51bSBUaW1lVW5pdCB7XG5cdE1pbGxpc2Vjb25kLFxuXHRTZWNvbmQsXG5cdE1pbnV0ZSxcblx0SG91cixcblx0RGF5LFxuXHRXZWVrLFxuXHRNb250aCxcblx0WWVhcixcblx0LyoqXG5cdCAqIEVuZC1vZi1lbnVtIG1hcmtlciwgZG8gbm90IHVzZVxuXHQgKi9cblx0TUFYXG59XG5cbi8qKlxuICogQXBwcm94aW1hdGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBmb3IgYSB0aW1lIHVuaXQuXG4gKiBBIGRheSBpcyBhc3N1bWVkIHRvIGhhdmUgMjQgaG91cnMsIGEgbW9udGggaXMgYXNzdW1lZCB0byBlcXVhbCAzMCBkYXlzXG4gKiBhbmQgYSB5ZWFyIGlzIHNldCB0byAzNjAgZGF5cyAoYmVjYXVzZSAxMiBtb250aHMgb2YgMzAgZGF5cykuXG4gKlxuICogQHBhcmFtIHVuaXRcdFRpbWUgdW5pdCBlLmcuIFRpbWVVbml0Lk1vbnRoXG4gKiBAcmV0dXJuc1x0VGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lVW5pdFRvTWlsbGlzZWNvbmRzKHVuaXQ6IFRpbWVVbml0KTogbnVtYmVyIHtcblx0c3dpdGNoICh1bml0KSB7XG5cdFx0Y2FzZSBUaW1lVW5pdC5NaWxsaXNlY29uZDogcmV0dXJuIDE7XG5cdFx0Y2FzZSBUaW1lVW5pdC5TZWNvbmQ6IHJldHVybiAxMDAwO1xuXHRcdGNhc2UgVGltZVVuaXQuTWludXRlOiByZXR1cm4gNjAgKiAxMDAwO1xuXHRcdGNhc2UgVGltZVVuaXQuSG91cjogcmV0dXJuIDYwICogNjAgKiAxMDAwO1xuXHRcdGNhc2UgVGltZVVuaXQuRGF5OiByZXR1cm4gODY0MDAwMDA7XG5cdFx0Y2FzZSBUaW1lVW5pdC5XZWVrOiByZXR1cm4gNyAqIDg2NDAwMDAwO1xuXHRcdGNhc2UgVGltZVVuaXQuTW9udGg6IHJldHVybiAzMCAqIDg2NDAwMDAwO1xuXHRcdGNhc2UgVGltZVVuaXQuWWVhcjogcmV0dXJuIDEyICogMzAgKiA4NjQwMDAwMDtcblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHRpbWUgdW5pdFwiKTtcblx0XHRcdH1cblx0fVxufVxuXG4vKipcbiAqIFRpbWUgdW5pdCB0byBsb3dlcmNhc2Ugc3RyaW5nLiBJZiBhbW91bnQgaXMgc3BlY2lmaWVkLCB0aGVuIHRoZSBzdHJpbmcgaXMgcHV0IGluIHBsdXJhbCBmb3JtXG4gKiBpZiBuZWNlc3NhcnkuXG4gKiBAcGFyYW0gdW5pdCBUaGUgdW5pdFxuICogQHBhcmFtIGFtb3VudCBJZiB0aGlzIGlzIHVuZXF1YWwgdG8gLTEgYW5kIDEsIHRoZW4gdGhlIHJlc3VsdCBpcyBwbHVyYWxpemVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lVW5pdFRvU3RyaW5nKHVuaXQ6IFRpbWVVbml0LCBhbW91bnQ6IG51bWJlciA9IDEpOiBzdHJpbmcge1xuXHRjb25zdCByZXN1bHQgPSBUaW1lVW5pdFt1bml0XS50b0xvd2VyQ2FzZSgpO1xuXHRpZiAoYW1vdW50ID09PSAxIHx8IGFtb3VudCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiByZXN1bHQgKyBcInNcIjtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nVG9UaW1lVW5pdChzOiBzdHJpbmcpOiBUaW1lVW5pdCB7XG5cdGNvbnN0IHRyaW1tZWQgPSBzLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IFRpbWVVbml0Lk1BWDsgKytpKSB7XG5cdFx0Y29uc3Qgb3RoZXIgPSB0aW1lVW5pdFRvU3RyaW5nKGksIDEpO1xuXHRcdGlmIChvdGhlciA9PT0gdHJpbW1lZCB8fCAob3RoZXIgKyBcInNcIikgPT09IHRyaW1tZWQpIHtcblx0XHRcdHJldHVybiBpO1xuXHRcdH1cblx0fVxuXHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHRpbWUgdW5pdCBzdHJpbmcgJ1wiICsgcyArIFwiJ1wiKTtcbn1cblxuLyoqXG4gKiBAcmV0dXJuIFRydWUgaWZmIHRoZSBnaXZlbiB5ZWFyIGlzIGEgbGVhcCB5ZWFyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcblx0Ly8gZnJvbSBXaWtpcGVkaWE6XG5cdC8vIGlmIHllYXIgaXMgbm90IGRpdmlzaWJsZSBieSA0IHRoZW4gY29tbW9uIHllYXJcblx0Ly8gZWxzZSBpZiB5ZWFyIGlzIG5vdCBkaXZpc2libGUgYnkgMTAwIHRoZW4gbGVhcCB5ZWFyXG5cdC8vIGVsc2UgaWYgeWVhciBpcyBub3QgZGl2aXNpYmxlIGJ5IDQwMCB0aGVuIGNvbW1vbiB5ZWFyXG5cdC8vIGVsc2UgbGVhcCB5ZWFyXG5cdGlmICh5ZWFyICUgNCAhPT0gMCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fSBlbHNlIGlmICh5ZWFyICUgMTAwICE9PSAwKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZWxzZSBpZiAoeWVhciAlIDQwMCAhPT0gMCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufVxuXG4vKipcbiAqIFRoZSBkYXlzIGluIGEgZ2l2ZW4geWVhclxuICovXG5leHBvcnQgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyOiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gKGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjUpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB5ZWFyXHRUaGUgZnVsbCB5ZWFyXG4gKiBAcGFyYW0gbW9udGhcdFRoZSBtb250aCAxLTEyXG4gKiBAcmV0dXJuIFRoZSBudW1iZXIgb2YgZGF5cyBpbiB0aGUgZ2l2ZW4gbW9udGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlcik6IG51bWJlciB7XG5cdHN3aXRjaCAobW9udGgpIHtcblx0XHRjYXNlIDE6XG5cdFx0Y2FzZSAzOlxuXHRcdGNhc2UgNTpcblx0XHRjYXNlIDc6XG5cdFx0Y2FzZSA4OlxuXHRcdGNhc2UgMTA6XG5cdFx0Y2FzZSAxMjpcblx0XHRcdHJldHVybiAzMTtcblx0XHRjYXNlIDI6XG5cdFx0XHRyZXR1cm4gKGlzTGVhcFllYXIoeWVhcikgPyAyOSA6IDI4KTtcblx0XHRjYXNlIDQ6XG5cdFx0Y2FzZSA2OlxuXHRcdGNhc2UgOTpcblx0XHRjYXNlIDExOlxuXHRcdFx0cmV0dXJuIDMwO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG1vbnRoOiBcIiArIG1vbnRoKTtcblx0fVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRheSBvZiB0aGUgeWVhciBvZiB0aGUgZ2l2ZW4gZGF0ZSBbMC4uMzY1XS4gSmFudWFyeSBmaXJzdCBpcyAwLlxuICpcbiAqIEBwYXJhbSB5ZWFyXHRUaGUgeWVhciBlLmcuIDE5ODZcbiAqIEBwYXJhbSBtb250aCBNb250aCAxLTEyXG4gKiBAcGFyYW0gZGF5IERheSBvZiBtb250aCAxLTMxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXlPZlllYXIoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk6IG51bWJlcik6IG51bWJlciB7XG5cdGFzc2VydChtb250aCA+PSAxICYmIG1vbnRoIDw9IDEyLCBcIk1vbnRoIG91dCBvZiByYW5nZVwiKTtcblx0YXNzZXJ0KGRheSA+PSAxICYmIGRheSA8PSBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCksIFwiZGF5IG91dCBvZiByYW5nZVwiKTtcblx0bGV0IHllYXJEYXk6IG51bWJlciA9IDA7XG5cdGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPCBtb250aDsgaSsrKSB7XG5cdFx0eWVhckRheSArPSBkYXlzSW5Nb250aCh5ZWFyLCBpKTtcblx0fVxuXHR5ZWFyRGF5ICs9IChkYXkgLSAxKTtcblx0cmV0dXJuIHllYXJEYXk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbGFzdCBpbnN0YW5jZSBvZiB0aGUgZ2l2ZW4gd2Vla2RheSBpbiB0aGUgZ2l2ZW4gbW9udGhcbiAqXG4gKiBAcGFyYW0geWVhclx0VGhlIHllYXJcbiAqIEBwYXJhbSBtb250aFx0dGhlIG1vbnRoIDEtMTJcbiAqIEBwYXJhbSB3ZWVrRGF5XHR0aGUgZGVzaXJlZCB3ZWVrIGRheVxuICpcbiAqIEByZXR1cm4gdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiB0aGUgd2VlayBkYXkgaW4gdGhlIG1vbnRoXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXN0V2Vla0RheU9mTW9udGgoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCB3ZWVrRGF5OiBXZWVrRGF5KTogbnVtYmVyIHtcblx0Y29uc3QgZW5kT2ZNb250aDogVGltZVN0cnVjdCA9IG5ldyBUaW1lU3RydWN0KHsgeWVhciwgbW9udGgsIGRheTogZGF5c0luTW9udGgoeWVhciwgbW9udGgpIH0pO1xuXHRjb25zdCBlbmRPZk1vbnRoV2Vla0RheSA9IHdlZWtEYXlOb0xlYXBTZWNzKGVuZE9mTW9udGgudW5peE1pbGxpcyk7XG5cdGxldCBkaWZmOiBudW1iZXIgPSB3ZWVrRGF5IC0gZW5kT2ZNb250aFdlZWtEYXk7XG5cdGlmIChkaWZmID4gMCkge1xuXHRcdGRpZmYgLT0gNztcblx0fVxuXHRyZXR1cm4gZW5kT2ZNb250aC5jb21wb25lbnRzLmRheSArIGRpZmY7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgdGhlIGdpdmVuIHdlZWtkYXkgaW4gdGhlIGdpdmVuIG1vbnRoXG4gKlxuICogQHBhcmFtIHllYXJcdFRoZSB5ZWFyXG4gKiBAcGFyYW0gbW9udGhcdHRoZSBtb250aCAxLTEyXG4gKiBAcGFyYW0gd2Vla0RheVx0dGhlIGRlc2lyZWQgd2VlayBkYXlcbiAqXG4gKiBAcmV0dXJuIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIHRoZSB3ZWVrIGRheSBpbiB0aGUgbW9udGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpcnN0V2Vla0RheU9mTW9udGgoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCB3ZWVrRGF5OiBXZWVrRGF5KTogbnVtYmVyIHtcblx0Y29uc3QgYmVnaW5PZk1vbnRoOiBUaW1lU3RydWN0ID0gbmV3IFRpbWVTdHJ1Y3QoeyB5ZWFyLCBtb250aCwgZGF5OiAxfSk7XG5cdGNvbnN0IGJlZ2luT2ZNb250aFdlZWtEYXkgPSB3ZWVrRGF5Tm9MZWFwU2VjcyhiZWdpbk9mTW9udGgudW5peE1pbGxpcyk7XG5cdGxldCBkaWZmOiBudW1iZXIgPSB3ZWVrRGF5IC0gYmVnaW5PZk1vbnRoV2Vla0RheTtcblx0aWYgKGRpZmYgPCAwKSB7XG5cdFx0ZGlmZiArPSA3O1xuXHR9XG5cdHJldHVybiBiZWdpbk9mTW9udGguY29tcG9uZW50cy5kYXkgKyBkaWZmO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRheS1vZi1tb250aCB0aGF0IGlzIG9uIHRoZSBnaXZlbiB3ZWVrZGF5IGFuZCB3aGljaCBpcyA+PSB0aGUgZ2l2ZW4gZGF5LlxuICogVGhyb3dzIGlmIHRoZSBtb250aCBoYXMgbm8gc3VjaCBkYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3ZWVrRGF5T25PckFmdGVyKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF5OiBudW1iZXIsIHdlZWtEYXk6IFdlZWtEYXkpOiBudW1iZXIge1xuXHRjb25zdCBzdGFydDogVGltZVN0cnVjdCA9IG5ldyBUaW1lU3RydWN0KHsgeWVhciwgbW9udGgsIGRheSB9KTtcblx0Y29uc3Qgc3RhcnRXZWVrRGF5OiBXZWVrRGF5ID0gd2Vla0RheU5vTGVhcFNlY3Moc3RhcnQudW5peE1pbGxpcyk7XG5cdGxldCBkaWZmOiBudW1iZXIgPSB3ZWVrRGF5IC0gc3RhcnRXZWVrRGF5O1xuXHRpZiAoZGlmZiA8IDApIHtcblx0XHRkaWZmICs9IDc7XG5cdH1cblx0YXNzZXJ0KHN0YXJ0LmNvbXBvbmVudHMuZGF5ICsgZGlmZiA8PSBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCksIFwiVGhlIGdpdmVuIG1vbnRoIGhhcyBubyBzdWNoIHdlZWtkYXlcIik7XG5cdHJldHVybiBzdGFydC5jb21wb25lbnRzLmRheSArIGRpZmY7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGF5LW9mLW1vbnRoIHRoYXQgaXMgb24gdGhlIGdpdmVuIHdlZWtkYXkgYW5kIHdoaWNoIGlzIDw9IHRoZSBnaXZlbiBkYXkuXG4gKiBUaHJvd3MgaWYgdGhlIG1vbnRoIGhhcyBubyBzdWNoIGRheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdlZWtEYXlPbk9yQmVmb3JlKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF5OiBudW1iZXIsIHdlZWtEYXk6IFdlZWtEYXkpOiBudW1iZXIge1xuXHRjb25zdCBzdGFydDogVGltZVN0cnVjdCA9IG5ldyBUaW1lU3RydWN0KHt5ZWFyLCBtb250aCwgZGF5fSk7XG5cdGNvbnN0IHN0YXJ0V2Vla0RheTogV2Vla0RheSA9IHdlZWtEYXlOb0xlYXBTZWNzKHN0YXJ0LnVuaXhNaWxsaXMpO1xuXHRsZXQgZGlmZjogbnVtYmVyID0gd2Vla0RheSAtIHN0YXJ0V2Vla0RheTtcblx0aWYgKGRpZmYgPiAwKSB7XG5cdFx0ZGlmZiAtPSA3O1xuXHR9XG5cdGFzc2VydChzdGFydC5jb21wb25lbnRzLmRheSArIGRpZmYgPj0gMSwgXCJUaGUgZ2l2ZW4gbW9udGggaGFzIG5vIHN1Y2ggd2Vla2RheVwiKTtcblx0cmV0dXJuIHN0YXJ0LmNvbXBvbmVudHMuZGF5ICsgZGlmZjtcbn1cblxuLyoqXG4gKiBUaGUgd2VlayBvZiB0aGlzIG1vbnRoLiBUaGVyZSBpcyBubyBvZmZpY2lhbCBzdGFuZGFyZCBmb3IgdGhpcyxcbiAqIGJ1dCB3ZSBhc3N1bWUgdGhlIHNhbWUgcnVsZXMgZm9yIHRoZSB3ZWVrTnVtYmVyIChpLmUuXG4gKiB3ZWVrIDEgaXMgdGhlIHdlZWsgdGhhdCBoYXMgdGhlIDR0aCBkYXkgb2YgdGhlIG1vbnRoIGluIGl0KVxuICpcbiAqIEBwYXJhbSB5ZWFyIFRoZSB5ZWFyXG4gKiBAcGFyYW0gbW9udGggVGhlIG1vbnRoIFsxLTEyXVxuICogQHBhcmFtIGRheSBUaGUgZGF5IFsxLTMxXVxuICogQHJldHVybiBXZWVrIG51bWJlciBbMS01XVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2Vla09mTW9udGgoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk6IG51bWJlcik6IG51bWJlciB7XG5cdGNvbnN0IGZpcnN0VGh1cnNkYXkgPSBmaXJzdFdlZWtEYXlPZk1vbnRoKHllYXIsIG1vbnRoLCBXZWVrRGF5LlRodXJzZGF5KTtcblx0Y29uc3QgZmlyc3RNb25kYXkgPSBmaXJzdFdlZWtEYXlPZk1vbnRoKHllYXIsIG1vbnRoLCBXZWVrRGF5Lk1vbmRheSk7XG5cdC8vIENvcm5lciBjYXNlOiBjaGVjayBpZiB3ZSBhcmUgaW4gd2VlayAxIG9yIGxhc3Qgd2VlayBvZiBwcmV2aW91cyBtb250aFxuXHRpZiAoZGF5IDwgZmlyc3RNb25kYXkpIHtcblx0XHRpZiAoZmlyc3RUaHVyc2RheSA8IGZpcnN0TW9uZGF5KSB7XG5cdFx0XHQvLyBXZWVrIDFcblx0XHRcdHJldHVybiAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBMYXN0IHdlZWsgb2YgcHJldmlvdXMgbW9udGhcblx0XHRcdGlmIChtb250aCA+IDEpIHtcblx0XHRcdFx0Ly8gRGVmYXVsdCBjYXNlXG5cdFx0XHRcdHJldHVybiB3ZWVrT2ZNb250aCh5ZWFyLCBtb250aCAtIDEsIDMxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEphbnVhcnlcblx0XHRcdFx0cmV0dXJuIHdlZWtPZk1vbnRoKHllYXIgLSAxLCAxMiwgMzEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGxhc3RNb25kYXkgPSBsYXN0V2Vla0RheU9mTW9udGgoeWVhciwgbW9udGgsIFdlZWtEYXkuTW9uZGF5KTtcblx0Y29uc3QgbGFzdFRodXJzZGF5ID0gbGFzdFdlZWtEYXlPZk1vbnRoKHllYXIsIG1vbnRoLCBXZWVrRGF5LlRodXJzZGF5KTtcblx0Ly8gQ29ybmVyIGNhc2U6IGNoZWNrIGlmIHdlIGFyZSBpbiBsYXN0IHdlZWsgb3Igd2VlayAxIG9mIHByZXZpb3VzIG1vbnRoXG5cdGlmIChkYXkgPj0gbGFzdE1vbmRheSkge1xuXHRcdGlmIChsYXN0TW9uZGF5ID4gbGFzdFRodXJzZGF5KSB7XG5cdFx0XHQvLyBXZWVrIDEgb2YgbmV4dCBtb250aFxuXHRcdFx0cmV0dXJuIDE7XG5cdFx0fVxuXHR9XG5cblx0Ly8gTm9ybWFsIGNhc2Vcblx0bGV0IHJlc3VsdCA9IE1hdGguZmxvb3IoKGRheSAtIGZpcnN0TW9uZGF5KSAvIDcpICsgMTtcblx0aWYgKGZpcnN0VGh1cnNkYXkgPCA0KSB7XG5cdFx0cmVzdWx0ICs9IDE7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRheS1vZi15ZWFyIG9mIHRoZSBNb25kYXkgb2Ygd2VlayAxIGluIHRoZSBnaXZlbiB5ZWFyLlxuICogTm90ZSB0aGF0IHRoZSByZXN1bHQgbWF5IGxpZSBpbiB0aGUgcHJldmlvdXMgeWVhciwgaW4gd2hpY2ggY2FzZSBpdFxuICogd2lsbCBiZSAobXVjaCkgZ3JlYXRlciB0aGFuIDRcbiAqL1xuZnVuY3Rpb24gZ2V0V2Vla09uZURheU9mWWVhcih5ZWFyOiBudW1iZXIpOiBudW1iZXIge1xuXHQvLyBmaXJzdCBtb25kYXkgb2YgSmFudWFyeSwgbWludXMgb25lIGJlY2F1c2Ugd2Ugd2FudCBkYXktb2YteWVhclxuXHRsZXQgcmVzdWx0OiBudW1iZXIgPSB3ZWVrRGF5T25PckFmdGVyKHllYXIsIDEsIDEsIFdlZWtEYXkuTW9uZGF5KSAtIDE7XG5cdGlmIChyZXN1bHQgPiAzKSB7IC8vIGdyZWF0ZXIgdGhhbiBqYW4gNHRoXG5cdFx0cmVzdWx0IC09IDc7XG5cdFx0aWYgKHJlc3VsdCA8IDApIHtcblx0XHRcdHJlc3VsdCArPSBleHBvcnRzLmRheXNJblllYXIoeWVhciAtIDEpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBJU08gODYwMSB3ZWVrIG51bWJlciBmb3IgdGhlIGdpdmVuIGRhdGUuIFdlZWsgMSBpcyB0aGUgd2Vla1xuICogdGhhdCBoYXMgSmFudWFyeSA0dGggaW4gaXQsIGFuZCBpdCBzdGFydHMgb24gTW9uZGF5LlxuICogU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGVcbiAqXG4gKiBAcGFyYW0geWVhclx0WWVhciBlLmcuIDE5ODhcbiAqIEBwYXJhbSBtb250aFx0TW9udGggMS0xMlxuICogQHBhcmFtIGRheVx0RGF5IG9mIG1vbnRoIDEtMzFcbiAqXG4gKiBAcmV0dXJuIFdlZWsgbnVtYmVyIDEtNTNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdlZWtOdW1iZXIoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk6IG51bWJlcik6IG51bWJlciB7XG5cdGNvbnN0IGRveSA9IGRheU9mWWVhcih5ZWFyLCBtb250aCwgZGF5KTtcblxuXHQvLyBjaGVjayBlbmQtb2YteWVhciBjb3JuZXIgY2FzZTogbWF5IGJlIHdlZWsgMSBvZiBuZXh0IHllYXJcblx0aWYgKGRveSA+PSBkYXlPZlllYXIoeWVhciwgMTIsIDI5KSkge1xuXHRcdGNvbnN0IG5leHRZZWFyV2Vla09uZSA9IGdldFdlZWtPbmVEYXlPZlllYXIoeWVhciArIDEpO1xuXHRcdGlmIChuZXh0WWVhcldlZWtPbmUgPiA0ICYmIG5leHRZZWFyV2Vla09uZSA8PSBkb3kpIHtcblx0XHRcdHJldHVybiAxO1xuXHRcdH1cblx0fVxuXG5cdC8vIGNoZWNrIGJlZ2lubmluZy1vZi15ZWFyIGNvcm5lciBjYXNlXG5cdGNvbnN0IHRoaXNZZWFyV2Vla09uZSA9IGdldFdlZWtPbmVEYXlPZlllYXIoeWVhcik7XG5cdGlmICh0aGlzWWVhcldlZWtPbmUgPiA0KSB7XG5cdFx0Ly8gd2VlayAxIGlzIGF0IGVuZCBvZiBsYXN0IHllYXJcblx0XHRjb25zdCB3ZWVrVHdvID0gdGhpc1llYXJXZWVrT25lICsgNyAtIGRheXNJblllYXIoeWVhciAtIDEpO1xuXHRcdGlmIChkb3kgPCB3ZWVrVHdvKSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoKGRveSAtIHdlZWtUd28pIC8gNykgKyAyO1xuXHRcdH1cblx0fVxuXG5cdC8vIFdlZWsgMSBpcyBlbnRpcmVseSBpbnNpZGUgdGhpcyB5ZWFyLlxuXHRpZiAoZG95IDwgdGhpc1llYXJXZWVrT25lKSB7XG5cdFx0Ly8gVGhlIGRhdGUgaXMgcGFydCBvZiB0aGUgbGFzdCB3ZWVrIG9mIHByZXYgeWVhci5cblx0XHRyZXR1cm4gd2Vla051bWJlcih5ZWFyIC0gMSwgMTIsIDMxKTtcblx0fVxuXG5cdC8vIG5vcm1hbCBjYXNlczsgbm90ZSB0aGF0IHdlZWsgbnVtYmVycyBzdGFydCBmcm9tIDEgc28gKzFcblx0cmV0dXJuIE1hdGguZmxvb3IoKGRveSAtIHRoaXNZZWFyV2Vla09uZSkgLyA3KSArIDE7XG59XG5cbmZ1bmN0aW9uIGFzc2VydFVuaXhUaW1lc3RhbXAodW5peE1pbGxpczogbnVtYmVyKTogdm9pZCB7XG5cdGFzc2VydCh0eXBlb2YgKHVuaXhNaWxsaXMpID09PSBcIm51bWJlclwiLCBcIm51bWJlciBpbnB1dCBleHBlY3RlZFwiKTtcblx0YXNzZXJ0KCFpc05hTih1bml4TWlsbGlzKSwgXCJOYU4gbm90IGV4cGVjdGVkIGFzIGlucHV0XCIpO1xuXHRhc3NlcnQobWF0aC5pc0ludCh1bml4TWlsbGlzKSwgXCJFeHBlY3QgaW50ZWdlciBudW1iZXIgZm9yIHVuaXggVVRDIHRpbWVzdGFtcFwiKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgdW5peCBtaWxsaSB0aW1lc3RhbXAgaW50byBhIFRpbWVUIHN0cnVjdHVyZS5cbiAqIFRoaXMgZG9lcyBOT1QgdGFrZSBsZWFwIHNlY29uZHMgaW50byBhY2NvdW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5peFRvVGltZU5vTGVhcFNlY3ModW5peE1pbGxpczogbnVtYmVyKTogVGltZUNvbXBvbmVudHMge1xuXHRhc3NlcnRVbml4VGltZXN0YW1wKHVuaXhNaWxsaXMpO1xuXG5cdGxldCB0ZW1wOiBudW1iZXIgPSB1bml4TWlsbGlzO1xuXHRjb25zdCByZXN1bHQ6IFRpbWVDb21wb25lbnRzID0geyB5ZWFyOiAwLCBtb250aDogMCwgZGF5OiAwLCBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGk6IDB9O1xuXHRsZXQgeWVhcjogbnVtYmVyO1xuXHRsZXQgbW9udGg6IG51bWJlcjtcblxuXHRpZiAodW5peE1pbGxpcyA+PSAwKSB7XG5cdFx0cmVzdWx0Lm1pbGxpID0gdGVtcCAlIDEwMDA7XG5cdFx0dGVtcCA9IE1hdGguZmxvb3IodGVtcCAvIDEwMDApO1xuXHRcdHJlc3VsdC5zZWNvbmQgPSB0ZW1wICUgNjA7XG5cdFx0dGVtcCA9IE1hdGguZmxvb3IodGVtcCAvIDYwKTtcblx0XHRyZXN1bHQubWludXRlID0gdGVtcCAlIDYwO1xuXHRcdHRlbXAgPSBNYXRoLmZsb29yKHRlbXAgLyA2MCk7XG5cdFx0cmVzdWx0LmhvdXIgPSB0ZW1wICUgMjQ7XG5cdFx0dGVtcCA9IE1hdGguZmxvb3IodGVtcCAvIDI0KTtcblxuXHRcdHllYXIgPSAxOTcwO1xuXHRcdHdoaWxlICh0ZW1wID49IGRheXNJblllYXIoeWVhcikpIHtcblx0XHRcdHRlbXAgLT0gZGF5c0luWWVhcih5ZWFyKTtcblx0XHRcdHllYXIrKztcblx0XHR9XG5cdFx0cmVzdWx0LnllYXIgPSB5ZWFyO1xuXG5cdFx0bW9udGggPSAxO1xuXHRcdHdoaWxlICh0ZW1wID49IGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSkge1xuXHRcdFx0dGVtcCAtPSBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCk7XG5cdFx0XHRtb250aCsrO1xuXHRcdH1cblx0XHRyZXN1bHQubW9udGggPSBtb250aDtcblx0XHRyZXN1bHQuZGF5ID0gdGVtcCArIDE7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gTm90ZSB0aGF0IGEgbmVnYXRpdmUgbnVtYmVyIG1vZHVsbyBzb21ldGhpbmcgeWllbGRzIGEgbmVnYXRpdmUgbnVtYmVyLlxuXHRcdC8vIFdlIG1ha2UgaXQgcG9zaXRpdmUgYnkgYWRkaW5nIHRoZSBtb2R1bG8uXG5cdFx0cmVzdWx0Lm1pbGxpID0gbWF0aC5wb3NpdGl2ZU1vZHVsbyh0ZW1wLCAxMDAwKTtcblx0XHR0ZW1wID0gTWF0aC5mbG9vcih0ZW1wIC8gMTAwMCk7XG5cdFx0cmVzdWx0LnNlY29uZCA9IG1hdGgucG9zaXRpdmVNb2R1bG8odGVtcCwgNjApO1xuXHRcdHRlbXAgPSBNYXRoLmZsb29yKHRlbXAgLyA2MCk7XG5cdFx0cmVzdWx0Lm1pbnV0ZSA9IG1hdGgucG9zaXRpdmVNb2R1bG8odGVtcCwgNjApO1xuXHRcdHRlbXAgPSBNYXRoLmZsb29yKHRlbXAgLyA2MCk7XG5cdFx0cmVzdWx0LmhvdXIgPSBtYXRoLnBvc2l0aXZlTW9kdWxvKHRlbXAsIDI0KTtcblx0XHR0ZW1wID0gTWF0aC5mbG9vcih0ZW1wIC8gMjQpO1xuXG5cdFx0eWVhciA9IDE5Njk7XG5cdFx0d2hpbGUgKHRlbXAgPCAtZGF5c0luWWVhcih5ZWFyKSkge1xuXHRcdFx0dGVtcCArPSBkYXlzSW5ZZWFyKHllYXIpO1xuXHRcdFx0eWVhci0tO1xuXHRcdH1cblx0XHRyZXN1bHQueWVhciA9IHllYXI7XG5cblx0XHRtb250aCA9IDEyO1xuXHRcdHdoaWxlICh0ZW1wIDwgLWRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSkge1xuXHRcdFx0dGVtcCArPSBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCk7XG5cdFx0XHRtb250aC0tO1xuXHRcdH1cblx0XHRyZXN1bHQubW9udGggPSBtb250aDtcblx0XHRyZXN1bHQuZGF5ID0gdGVtcCArIDEgKyBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCk7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZpbGwgeW91IGFueSBtaXNzaW5nIHRpbWUgY29tcG9uZW50IHBhcnRzLCBkZWZhdWx0cyBhcmUgMTk3MC0wMS0wMVQwMDowMDowMC4wMDBcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplVGltZUNvbXBvbmVudHMoY29tcG9uZW50czogVGltZUNvbXBvbmVudE9wdHMpOiBUaW1lQ29tcG9uZW50cyB7XG5cdGNvbnN0IGlucHV0ID0ge1xuXHRcdHllYXI6IHR5cGVvZiBjb21wb25lbnRzLnllYXIgPT09IFwibnVtYmVyXCIgPyBjb21wb25lbnRzLnllYXIgOiAxOTcwLFxuXHRcdG1vbnRoOiB0eXBlb2YgY29tcG9uZW50cy5tb250aCA9PT0gXCJudW1iZXJcIiA/IGNvbXBvbmVudHMubW9udGggOiAxLFxuXHRcdGRheTogdHlwZW9mIGNvbXBvbmVudHMuZGF5ID09PSBcIm51bWJlclwiID8gY29tcG9uZW50cy5kYXkgOiAxLFxuXHRcdGhvdXI6IHR5cGVvZiBjb21wb25lbnRzLmhvdXIgPT09IFwibnVtYmVyXCIgPyBjb21wb25lbnRzLmhvdXIgOiAwLFxuXHRcdG1pbnV0ZTogdHlwZW9mIGNvbXBvbmVudHMubWludXRlID09PSBcIm51bWJlclwiID8gY29tcG9uZW50cy5taW51dGUgOiAwLFxuXHRcdHNlY29uZDogdHlwZW9mIGNvbXBvbmVudHMuc2Vjb25kID09PSBcIm51bWJlclwiID8gY29tcG9uZW50cy5zZWNvbmQgOiAwLFxuXHRcdG1pbGxpOiB0eXBlb2YgY29tcG9uZW50cy5taWxsaSA9PT0gXCJudW1iZXJcIiA/IGNvbXBvbmVudHMubWlsbGkgOiAwLFxuXHR9O1xuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbi8qKlxuICogQ29udmVydCBhIHllYXIsIG1vbnRoLCBkYXkgZXRjIGludG8gYSB1bml4IG1pbGxpIHRpbWVzdGFtcC5cbiAqIFRoaXMgZG9lcyBOT1QgdGFrZSBsZWFwIHNlY29uZHMgaW50byBhY2NvdW50LlxuICpcbiAqIEBwYXJhbSB5ZWFyXHRZZWFyIGUuZy4gMTk3MFxuICogQHBhcmFtIG1vbnRoXHRNb250aCAxLTEyXG4gKiBAcGFyYW0gZGF5XHREYXkgMS0zMVxuICogQHBhcmFtIGhvdXJcdEhvdXIgMC0yM1xuICogQHBhcmFtIG1pbnV0ZVx0TWludXRlIDAtNTlcbiAqIEBwYXJhbSBzZWNvbmRcdFNlY29uZCAwLTU5IChubyBsZWFwIHNlY29uZHMpXG4gKiBAcGFyYW0gbWlsbGlcdE1pbGxpc2Vjb25kIDAtOTk5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lVG9Vbml4Tm9MZWFwU2Vjcyhcblx0eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk6IG51bWJlciwgaG91cjogbnVtYmVyLCBtaW51dGU6IG51bWJlciwgc2Vjb25kOiBudW1iZXIsIG1pbGxpOiBudW1iZXJcbik6IG51bWJlcjtcbmV4cG9ydCBmdW5jdGlvbiB0aW1lVG9Vbml4Tm9MZWFwU2Vjcyhjb21wb25lbnRzOiBUaW1lQ29tcG9uZW50T3B0cyk6IG51bWJlcjtcbmV4cG9ydCBmdW5jdGlvbiB0aW1lVG9Vbml4Tm9MZWFwU2Vjcyhcblx0YTogVGltZUNvbXBvbmVudE9wdHMgfCBudW1iZXIsIG1vbnRoPzogbnVtYmVyLCBkYXk/OiBudW1iZXIsIGhvdXI/OiBudW1iZXIsIG1pbnV0ZT86IG51bWJlciwgc2Vjb25kPzogbnVtYmVyLCBtaWxsaT86IG51bWJlclxuKTogbnVtYmVyIHtcblx0Y29uc3QgY29tcG9uZW50czogVGltZUNvbXBvbmVudE9wdHMgPSAodHlwZW9mIGEgPT09IFwibnVtYmVyXCIgPyB7IHllYXI6IGEsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaSB9IDogYSk7XG5cdGNvbnN0IGlucHV0OiBUaW1lQ29tcG9uZW50cyA9IG5vcm1hbGl6ZVRpbWVDb21wb25lbnRzKGNvbXBvbmVudHMpO1xuXHRyZXR1cm4gaW5wdXQubWlsbGkgKyAxMDAwICogKFxuXHRcdGlucHV0LnNlY29uZCArIGlucHV0Lm1pbnV0ZSAqIDYwICsgaW5wdXQuaG91ciAqIDM2MDAgKyBkYXlPZlllYXIoaW5wdXQueWVhciwgaW5wdXQubW9udGgsIGlucHV0LmRheSkgKiA4NjQwMCArXG5cdFx0KGlucHV0LnllYXIgLSAxOTcwKSAqIDMxNTM2MDAwICsgTWF0aC5mbG9vcigoaW5wdXQueWVhciAtIDE5NjkpIC8gNCkgKiA4NjQwMCAtXG5cdFx0TWF0aC5mbG9vcigoaW5wdXQueWVhciAtIDE5MDEpIC8gMTAwKSAqIDg2NDAwICsgTWF0aC5mbG9vcigoaW5wdXQueWVhciAtIDE5MDAgKyAyOTkpIC8gNDAwKSAqIDg2NDAwKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGRheS1vZi13ZWVrLlxuICogVGhpcyBkb2VzIE5PVCB0YWtlIGxlYXAgc2Vjb25kcyBpbnRvIGFjY291bnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3ZWVrRGF5Tm9MZWFwU2Vjcyh1bml4TWlsbGlzOiBudW1iZXIpOiBXZWVrRGF5IHtcblx0YXNzZXJ0VW5peFRpbWVzdGFtcCh1bml4TWlsbGlzKTtcblxuXHRjb25zdCBlcG9jaERheTogV2Vla0RheSA9IFdlZWtEYXkuVGh1cnNkYXk7XG5cdGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKHVuaXhNaWxsaXMgLyAxMDAwIC8gODY0MDApO1xuXHRyZXR1cm4gKGVwb2NoRGF5ICsgZGF5cykgJSA3O1xufVxuXG4vKipcbiAqIE4tdGggc2Vjb25kIGluIHRoZSBkYXksIGNvdW50aW5nIGZyb20gMFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2Vjb25kT2ZEYXkoaG91cjogbnVtYmVyLCBtaW51dGU6IG51bWJlciwgc2Vjb25kOiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gKCgoaG91ciAqIDYwKSArIG1pbnV0ZSkgKiA2MCkgKyBzZWNvbmQ7XG59XG5cbi8qKlxuICogQmFzaWMgcmVwcmVzZW50YXRpb24gb2YgYSBkYXRlIGFuZCB0aW1lXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW1lU3RydWN0IHtcblxuXHQvKipcblx0ICogUmV0dXJucyBhIFRpbWVTdHJ1Y3QgZnJvbSB0aGUgZ2l2ZW4geWVhciwgbW9udGgsIGRheSBldGNcblx0ICpcblx0ICogQHBhcmFtIHllYXJcdFllYXIgZS5nLiAxOTcwXG5cdCAqIEBwYXJhbSBtb250aFx0TW9udGggMS0xMlxuXHQgKiBAcGFyYW0gZGF5XHREYXkgMS0zMVxuXHQgKiBAcGFyYW0gaG91clx0SG91ciAwLTIzXG5cdCAqIEBwYXJhbSBtaW51dGVcdE1pbnV0ZSAwLTU5XG5cdCAqIEBwYXJhbSBzZWNvbmRcdFNlY29uZCAwLTU5IChubyBsZWFwIHNlY29uZHMpXG5cdCAqIEBwYXJhbSBtaWxsaVx0TWlsbGlzZWNvbmQgMC05OTlcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgZnJvbUNvbXBvbmVudHMoXG5cdFx0eWVhcj86IG51bWJlciwgbW9udGg/OiBudW1iZXIsIGRheT86IG51bWJlcixcblx0XHRob3VyPzogbnVtYmVyLCBtaW51dGU/OiBudW1iZXIsIHNlY29uZD86IG51bWJlciwgbWlsbGk/OiBudW1iZXJcblx0KTogVGltZVN0cnVjdCB7XG5cdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KHsgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIFRpbWVTdHJ1Y3QgZnJvbSBhIG51bWJlciBvZiB1bml4IG1pbGxpc2Vjb25kc1xuXHQgKiAoYmFja3dhcmQgY29tcGF0aWJpbGl0eSlcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgZnJvbVVuaXgodW5peE1pbGxpczogbnVtYmVyKTogVGltZVN0cnVjdCB7XG5cdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KHVuaXhNaWxsaXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIFRpbWVTdHJ1Y3QgZnJvbSBhIEphdmFTY3JpcHQgZGF0ZVxuXHQgKlxuXHQgKiBAcGFyYW0gZFx0VGhlIGRhdGVcblx0ICogQHBhcmFtIGRmXHRXaGljaCBmdW5jdGlvbnMgdG8gdGFrZSAoZ2V0WCgpIG9yIGdldFVUQ1goKSlcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgZnJvbURhdGUoZDogRGF0ZSwgZGY6IERhdGVGdW5jdGlvbnMpOiBUaW1lU3RydWN0IHtcblx0XHRpZiAoZGYgPT09IERhdGVGdW5jdGlvbnMuR2V0KSB7XG5cdFx0XHRyZXR1cm4gbmV3IFRpbWVTdHJ1Y3Qoe1xuXHRcdFx0XHR5ZWFyOiBkLmdldEZ1bGxZZWFyKCksIG1vbnRoOiBkLmdldE1vbnRoKCkgKyAxLCBkYXk6IGQuZ2V0RGF0ZSgpLFxuXHRcdFx0XHRob3VyOiBkLmdldEhvdXJzKCksIG1pbnV0ZTogZC5nZXRNaW51dGVzKCksIHNlY29uZDogZC5nZXRTZWNvbmRzKCksIG1pbGxpOiBkLmdldE1pbGxpc2Vjb25kcygpXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KHtcblx0XHRcdFx0eWVhcjogZC5nZXRVVENGdWxsWWVhcigpLCBtb250aDogZC5nZXRVVENNb250aCgpICsgMSwgZGF5OiBkLmdldFVUQ0RhdGUoKSxcblx0XHRcdFx0aG91cjogZC5nZXRVVENIb3VycygpLCBtaW51dGU6IGQuZ2V0VVRDTWludXRlcygpLCBzZWNvbmQ6IGQuZ2V0VVRDU2Vjb25kcygpLCBtaWxsaTogZC5nZXRVVENNaWxsaXNlY29uZHMoKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSBUaW1lU3RydWN0IGZyb20gYW4gSVNPIDg2MDEgc3RyaW5nIFdJVEhPVVQgdGltZSB6b25lXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGZyb21TdHJpbmcoczogc3RyaW5nKTogVGltZVN0cnVjdCB7XG5cdFx0dHJ5IHtcblx0XHRcdGxldCB5ZWFyOiBudW1iZXIgPSAxOTcwO1xuXHRcdFx0bGV0IG1vbnRoOiBudW1iZXIgPSAxO1xuXHRcdFx0bGV0IGRheTogbnVtYmVyID0gMTtcblx0XHRcdGxldCBob3VyOiBudW1iZXIgPSAwO1xuXHRcdFx0bGV0IG1pbnV0ZTogbnVtYmVyID0gMDtcblx0XHRcdGxldCBzZWNvbmQ6IG51bWJlciA9IDA7XG5cdFx0XHRsZXQgZnJhY3Rpb25NaWxsaXM6IG51bWJlciA9IDA7XG5cdFx0XHRsZXQgbGFzdFVuaXQ6IFRpbWVVbml0ID0gVGltZVVuaXQuWWVhcjtcblxuXHRcdFx0Ly8gc2VwYXJhdGUgYW55IGZyYWN0aW9uYWwgcGFydFxuXHRcdFx0Y29uc3Qgc3BsaXQ6IHN0cmluZ1tdID0gcy50cmltKCkuc3BsaXQoXCIuXCIpO1xuXHRcdFx0YXNzZXJ0KHNwbGl0Lmxlbmd0aCA+PSAxICYmIHNwbGl0Lmxlbmd0aCA8PSAyLCBcIkVtcHR5IHN0cmluZyBvciBtdWx0aXBsZSBkb3RzLlwiKTtcblxuXHRcdFx0Ly8gcGFyc2UgbWFpbiBwYXJ0XG5cdFx0XHRjb25zdCBpc0Jhc2ljRm9ybWF0ID0gKHMuaW5kZXhPZihcIi1cIikgPT09IC0xKTtcblx0XHRcdGlmIChpc0Jhc2ljRm9ybWF0KSB7XG5cdFx0XHRcdGFzc2VydChzcGxpdFswXS5tYXRjaCgvXigoXFxkKSspfChcXGRcXGRcXGRcXGRcXGRcXGRcXGRcXGRUKFxcZCkrKSQvKSxcblx0XHRcdFx0XHRcIklTTyBzdHJpbmcgaW4gYmFzaWMgbm90YXRpb24gbWF5IG9ubHkgY29udGFpbiBudW1iZXJzIGJlZm9yZSB0aGUgZnJhY3Rpb25hbCBwYXJ0XCIpO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSBhbnkgXCJUXCIgc2VwYXJhdG9yXG5cdFx0XHRcdHNwbGl0WzBdID0gc3BsaXRbMF0ucmVwbGFjZShcIlRcIiwgXCJcIik7XG5cblx0XHRcdFx0YXNzZXJ0KFs0LCA4LCAxMCwgMTIsIDE0XS5pbmRleE9mKHNwbGl0WzBdLmxlbmd0aCkgIT09IC0xLFxuXHRcdFx0XHRcdFwiUGFkZGluZyBvciByZXF1aXJlZCBjb21wb25lbnRzIGFyZSBtaXNzaW5nLiBOb3RlIHRoYXQgWVlZWU1NIGlzIG5vdCB2YWxpZCBwZXIgSVNPIDg2MDFcIik7XG5cblx0XHRcdFx0aWYgKHNwbGl0WzBdLmxlbmd0aCA+PSA0KSB7XG5cdFx0XHRcdFx0eWVhciA9IHBhcnNlSW50KHNwbGl0WzBdLnN1YnN0cigwLCA0KSwgMTApO1xuXHRcdFx0XHRcdGxhc3RVbml0ID0gVGltZVVuaXQuWWVhcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3BsaXRbMF0ubGVuZ3RoID49IDgpIHtcblx0XHRcdFx0XHRtb250aCA9IHBhcnNlSW50KHNwbGl0WzBdLnN1YnN0cig0LCAyKSwgMTApO1xuXHRcdFx0XHRcdGRheSA9IHBhcnNlSW50KHNwbGl0WzBdLnN1YnN0cig2LCAyKSwgMTApOyAvLyBub3RlIHRoYXQgWVlZWU1NIGZvcm1hdCBpcyBkaXNhbGxvd2VkIHNvIGlmIG1vbnRoIGlzIHByZXNlbnQsIGRheSBpcyB0b29cblx0XHRcdFx0XHRsYXN0VW5pdCA9IFRpbWVVbml0LkRheTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3BsaXRbMF0ubGVuZ3RoID49IDEwKSB7XG5cdFx0XHRcdFx0aG91ciA9IHBhcnNlSW50KHNwbGl0WzBdLnN1YnN0cig4LCAyKSwgMTApO1xuXHRcdFx0XHRcdGxhc3RVbml0ID0gVGltZVVuaXQuSG91cjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3BsaXRbMF0ubGVuZ3RoID49IDEyKSB7XG5cdFx0XHRcdFx0bWludXRlID0gcGFyc2VJbnQoc3BsaXRbMF0uc3Vic3RyKDEwLCAyKSwgMTApO1xuXHRcdFx0XHRcdGxhc3RVbml0ID0gVGltZVVuaXQuTWludXRlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzcGxpdFswXS5sZW5ndGggPj0gMTQpIHtcblx0XHRcdFx0XHRzZWNvbmQgPSBwYXJzZUludChzcGxpdFswXS5zdWJzdHIoMTIsIDIpLCAxMCk7XG5cdFx0XHRcdFx0bGFzdFVuaXQgPSBUaW1lVW5pdC5TZWNvbmQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFzc2VydChzcGxpdFswXS5tYXRjaCgvXlxcZFxcZFxcZFxcZCgtXFxkXFxkLVxcZFxcZCgoVCk/XFxkXFxkKFxcOlxcZFxcZCg6XFxkXFxkKT8pPyk/KT8kLyksIFwiSW52YWxpZCBJU08gc3RyaW5nXCIpO1xuXHRcdFx0XHRsZXQgZGF0ZUFuZFRpbWU6IHN0cmluZ1tdID0gW107XG5cdFx0XHRcdGlmIChzLmluZGV4T2YoXCJUXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdGRhdGVBbmRUaW1lID0gc3BsaXRbMF0uc3BsaXQoXCJUXCIpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHMubGVuZ3RoID4gMTApIHtcblx0XHRcdFx0XHRkYXRlQW5kVGltZSA9IFtzcGxpdFswXS5zdWJzdHIoMCwgMTApLCBzcGxpdFswXS5zdWJzdHIoMTApXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkYXRlQW5kVGltZSA9IFtzcGxpdFswXSwgXCJcIl07XG5cdFx0XHRcdH1cblx0XHRcdFx0YXNzZXJ0KFs0LCAxMF0uaW5kZXhPZihkYXRlQW5kVGltZVswXS5sZW5ndGgpICE9PSAtMSxcblx0XHRcdFx0XHRcIlBhZGRpbmcgb3IgcmVxdWlyZWQgY29tcG9uZW50cyBhcmUgbWlzc2luZy4gTm90ZSB0aGF0IFlZWVlNTSBpcyBub3QgdmFsaWQgcGVyIElTTyA4NjAxXCIpO1xuXG5cdFx0XHRcdGlmIChkYXRlQW5kVGltZVswXS5sZW5ndGggPj0gNCkge1xuXHRcdFx0XHRcdHllYXIgPSBwYXJzZUludChkYXRlQW5kVGltZVswXS5zdWJzdHIoMCwgNCksIDEwKTtcblx0XHRcdFx0XHRsYXN0VW5pdCA9IFRpbWVVbml0LlllYXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGVBbmRUaW1lWzBdLmxlbmd0aCA+PSAxMCkge1xuXHRcdFx0XHRcdG1vbnRoID0gcGFyc2VJbnQoZGF0ZUFuZFRpbWVbMF0uc3Vic3RyKDUsIDIpLCAxMCk7XG5cdFx0XHRcdFx0ZGF5ID0gcGFyc2VJbnQoZGF0ZUFuZFRpbWVbMF0uc3Vic3RyKDgsIDIpLCAxMCk7IC8vIG5vdGUgdGhhdCBZWVlZTU0gZm9ybWF0IGlzIGRpc2FsbG93ZWQgc28gaWYgbW9udGggaXMgcHJlc2VudCwgZGF5IGlzIHRvb1xuXHRcdFx0XHRcdGxhc3RVbml0ID0gVGltZVVuaXQuRGF5O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkYXRlQW5kVGltZVsxXS5sZW5ndGggPj0gMikge1xuXHRcdFx0XHRcdGhvdXIgPSBwYXJzZUludChkYXRlQW5kVGltZVsxXS5zdWJzdHIoMCwgMiksIDEwKTtcblx0XHRcdFx0XHRsYXN0VW5pdCA9IFRpbWVVbml0LkhvdXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGVBbmRUaW1lWzFdLmxlbmd0aCA+PSA1KSB7XG5cdFx0XHRcdFx0bWludXRlID0gcGFyc2VJbnQoZGF0ZUFuZFRpbWVbMV0uc3Vic3RyKDMsIDIpLCAxMCk7XG5cdFx0XHRcdFx0bGFzdFVuaXQgPSBUaW1lVW5pdC5NaW51dGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGVBbmRUaW1lWzFdLmxlbmd0aCA+PSA4KSB7XG5cdFx0XHRcdFx0c2Vjb25kID0gcGFyc2VJbnQoZGF0ZUFuZFRpbWVbMV0uc3Vic3RyKDYsIDIpLCAxMCk7XG5cdFx0XHRcdFx0bGFzdFVuaXQgPSBUaW1lVW5pdC5TZWNvbmQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcGFyc2UgZnJhY3Rpb25hbCBwYXJ0XG5cdFx0XHRpZiAoc3BsaXQubGVuZ3RoID4gMSAmJiBzcGxpdFsxXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnN0IGZyYWN0aW9uOiBudW1iZXIgPSBwYXJzZUZsb2F0KFwiMC5cIiArIHNwbGl0WzFdKTtcblx0XHRcdFx0c3dpdGNoIChsYXN0VW5pdCkge1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuWWVhcjpcblx0XHRcdFx0XHRcdGZyYWN0aW9uTWlsbGlzID0gZGF5c0luWWVhcih5ZWFyKSAqIDg2NDAwMDAwICogZnJhY3Rpb247XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0LkRheTpcblx0XHRcdFx0XHRcdGZyYWN0aW9uTWlsbGlzID0gODY0MDAwMDAgKiBmcmFjdGlvbjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuSG91cjpcblx0XHRcdFx0XHRcdGZyYWN0aW9uTWlsbGlzID0gMzYwMDAwMCAqIGZyYWN0aW9uO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5NaW51dGU6XG5cdFx0XHRcdFx0XHRmcmFjdGlvbk1pbGxpcyA9IDYwMDAwICogZnJhY3Rpb247XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0LlNlY29uZDpcblx0XHRcdFx0XHRcdGZyYWN0aW9uTWlsbGlzID0gMTAwMCAqIGZyYWN0aW9uO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY29tYmluZSBtYWluIGFuZCBmcmFjdGlvbmFsIHBhcnRcblx0XHRcdHllYXIgPSBtYXRoLnJvdW5kU3ltKHllYXIpO1xuXHRcdFx0bW9udGggPSBtYXRoLnJvdW5kU3ltKG1vbnRoKTtcblx0XHRcdGRheSA9IG1hdGgucm91bmRTeW0oZGF5KTtcblx0XHRcdGhvdXIgPSBtYXRoLnJvdW5kU3ltKGhvdXIpO1xuXHRcdFx0bWludXRlID0gbWF0aC5yb3VuZFN5bShtaW51dGUpO1xuXHRcdFx0c2Vjb25kID0gbWF0aC5yb3VuZFN5bShzZWNvbmQpO1xuXHRcdFx0bGV0IHVuaXhNaWxsaXM6IG51bWJlciA9IHRpbWVUb1VuaXhOb0xlYXBTZWNzKHsgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQgfSk7XG5cdFx0XHR1bml4TWlsbGlzID0gbWF0aC5yb3VuZFN5bSh1bml4TWlsbGlzICsgZnJhY3Rpb25NaWxsaXMpO1xuXHRcdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KHVuaXhNaWxsaXMpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgSVNPIDg2MDEgc3RyaW5nOiBcXFwiXCIgKyBzICsgXCJcXFwiOiBcIiArIGUubWVzc2FnZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0aW1lIHZhbHVlIGluIHVuaXggbWlsbGlzZWNvbmRzXG5cdCAqL1xuXHRwcml2YXRlIF91bml4TWlsbGlzOiBudW1iZXI7XG5cdHB1YmxpYyBnZXQgdW5peE1pbGxpcygpOiBudW1iZXIge1xuXHRcdGlmICh0aGlzLl91bml4TWlsbGlzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX3VuaXhNaWxsaXMgPSB0aW1lVG9Vbml4Tm9MZWFwU2Vjcyh0aGlzLl9jb21wb25lbnRzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3VuaXhNaWxsaXM7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRpbWUgdmFsdWUgaW4gc2VwYXJhdGUgeWVhci9tb250aC8uLi4gY29tcG9uZW50c1xuXHQgKi9cblx0cHJpdmF0ZSBfY29tcG9uZW50czogVGltZUNvbXBvbmVudHM7XG5cdHB1YmxpYyBnZXQgY29tcG9uZW50cygpOiBUaW1lQ29tcG9uZW50cyB7XG5cdFx0aWYgKCF0aGlzLl9jb21wb25lbnRzKSB7XG5cdFx0XHR0aGlzLl9jb21wb25lbnRzID0gdW5peFRvVGltZU5vTGVhcFNlY3ModGhpcy5fdW5peE1pbGxpcyk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9jb21wb25lbnRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSB1bml4TWlsbGlzIG1pbGxpc2Vjb25kcyBzaW5jZSAxLTEtMTk3MFxuXHQgKi9cblx0Y29uc3RydWN0b3IodW5peE1pbGxpczogbnVtYmVyKTtcblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBjb21wb25lbnRzIFNlcGFyYXRlIHRpbWVzdGFtcCBjb21wb25lbnRzICh5ZWFyLCBtb250aCwgLi4uKVxuXHQgKi9cblx0Y29uc3RydWN0b3IoY29tcG9uZW50czogVGltZUNvbXBvbmVudE9wdHMpO1xuXHQvKipcblx0ICogQ29uc3RydWN0b3IgaW1wbGVtZW50YXRpb25cblx0ICovXG5cdGNvbnN0cnVjdG9yKGE6IG51bWJlciB8IFRpbWVDb21wb25lbnRPcHRzKSB7XG5cdFx0aWYgKHR5cGVvZiBhID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHR0aGlzLl91bml4TWlsbGlzID0gYTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fY29tcG9uZW50cyA9IG5vcm1hbGl6ZVRpbWVDb21wb25lbnRzKGEpO1xuXHRcdH1cblx0fVxuXG5cdGdldCB5ZWFyKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuY29tcG9uZW50cy55ZWFyO1xuXHR9XG5cblx0Z2V0IG1vbnRoKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuY29tcG9uZW50cy5tb250aDtcblx0fVxuXG5cdGdldCBkYXkoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5jb21wb25lbnRzLmRheTtcblx0fVxuXG5cdGdldCBob3VyKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuY29tcG9uZW50cy5ob3VyO1xuXHR9XG5cblx0Z2V0IG1pbnV0ZSgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmNvbXBvbmVudHMubWludXRlO1xuXHR9XG5cblx0Z2V0IHNlY29uZCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmNvbXBvbmVudHMuc2Vjb25kO1xuXHR9XG5cblx0Z2V0IG1pbGxpKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuY29tcG9uZW50cy5taWxsaTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZGF5LW9mLXllYXIgMC0zNjVcblx0ICovXG5cdHB1YmxpYyB5ZWFyRGF5KCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIGRheU9mWWVhcih0aGlzLmNvbXBvbmVudHMueWVhciwgdGhpcy5jb21wb25lbnRzLm1vbnRoLCB0aGlzLmNvbXBvbmVudHMuZGF5KTtcblx0fVxuXG5cdHB1YmxpYyBlcXVhbHMob3RoZXI6IFRpbWVTdHJ1Y3QpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy52YWx1ZU9mKCkgPT09IG90aGVyLnZhbHVlT2YoKTtcblx0fVxuXG5cdHB1YmxpYyB2YWx1ZU9mKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMudW5peE1pbGxpcztcblx0fVxuXG5cdHB1YmxpYyBjbG9uZSgpOiBUaW1lU3RydWN0IHtcblx0XHRpZiAodGhpcy5fY29tcG9uZW50cykge1xuXHRcdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KHRoaXMuX2NvbXBvbmVudHMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbmV3IFRpbWVTdHJ1Y3QodGhpcy5fdW5peE1pbGxpcyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFZhbGlkYXRlIGEgdGltZXN0YW1wLiBGaWx0ZXJzIG91dCBub24tZXhpc3RpbmcgdmFsdWVzIGZvciBhbGwgdGltZSBjb21wb25lbnRzXG5cdCAqIEByZXR1cm5zIHRydWUgaWZmIHRoZSB0aW1lc3RhbXAgaXMgdmFsaWRcblx0ICovXG5cdHB1YmxpYyB2YWxpZGF0ZSgpOiBib29sZWFuIHtcblx0XHRpZiAodGhpcy5fY29tcG9uZW50cykge1xuXHRcdFx0cmV0dXJuIHRoaXMuY29tcG9uZW50cy5tb250aCA+PSAxICYmIHRoaXMuY29tcG9uZW50cy5tb250aCA8PSAxMlxuXHRcdFx0XHQmJiB0aGlzLmNvbXBvbmVudHMuZGF5ID49IDEgJiYgdGhpcy5jb21wb25lbnRzLmRheSA8PSBkYXlzSW5Nb250aCh0aGlzLmNvbXBvbmVudHMueWVhciwgdGhpcy5jb21wb25lbnRzLm1vbnRoKVxuXHRcdFx0XHQmJiB0aGlzLmNvbXBvbmVudHMuaG91ciA+PSAwICYmIHRoaXMuY29tcG9uZW50cy5ob3VyIDw9IDIzXG5cdFx0XHRcdCYmIHRoaXMuY29tcG9uZW50cy5taW51dGUgPj0gMCAmJiB0aGlzLmNvbXBvbmVudHMubWludXRlIDw9IDU5XG5cdFx0XHRcdCYmIHRoaXMuY29tcG9uZW50cy5zZWNvbmQgPj0gMCAmJiB0aGlzLmNvbXBvbmVudHMuc2Vjb25kIDw9IDU5XG5cdFx0XHRcdCYmIHRoaXMuY29tcG9uZW50cy5taWxsaSA+PSAwICYmIHRoaXMuY29tcG9uZW50cy5taWxsaSA8PSA5OTk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBJU08gODYwMSBzdHJpbmcgWVlZWS1NTS1ERFRoaDptbTpzcy5ubm5cblx0ICovXG5cdHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuXHRcdHJldHVybiBzdHJpbmdzLnBhZExlZnQodGhpcy5jb21wb25lbnRzLnllYXIudG9TdHJpbmcoMTApLCA0LCBcIjBcIilcblx0XHRcdCsgXCItXCIgKyBzdHJpbmdzLnBhZExlZnQodGhpcy5jb21wb25lbnRzLm1vbnRoLnRvU3RyaW5nKDEwKSwgMiwgXCIwXCIpXG5cdFx0XHQrIFwiLVwiICsgc3RyaW5ncy5wYWRMZWZ0KHRoaXMuY29tcG9uZW50cy5kYXkudG9TdHJpbmcoMTApLCAyLCBcIjBcIilcblx0XHRcdCsgXCJUXCIgKyBzdHJpbmdzLnBhZExlZnQodGhpcy5jb21wb25lbnRzLmhvdXIudG9TdHJpbmcoMTApLCAyLCBcIjBcIilcblx0XHRcdCsgXCI6XCIgKyBzdHJpbmdzLnBhZExlZnQodGhpcy5jb21wb25lbnRzLm1pbnV0ZS50b1N0cmluZygxMCksIDIsIFwiMFwiKVxuXHRcdFx0KyBcIjpcIiArIHN0cmluZ3MucGFkTGVmdCh0aGlzLmNvbXBvbmVudHMuc2Vjb25kLnRvU3RyaW5nKDEwKSwgMiwgXCIwXCIpXG5cdFx0XHQrIFwiLlwiICsgc3RyaW5ncy5wYWRMZWZ0KHRoaXMuY29tcG9uZW50cy5taWxsaS50b1N0cmluZygxMCksIDMsIFwiMFwiKTtcblx0fVxufVxuXG5cbi8qKlxuICogQmluYXJ5IHNlYXJjaFxuICogQHBhcmFtIGFycmF5IEFycmF5IHRvIHNlYXJjaFxuICogQHBhcmFtIGNvbXBhcmUgRnVuY3Rpb24gdGhhdCBzaG91bGQgcmV0dXJuIDwgMCBpZiBnaXZlbiBlbGVtZW50IGlzIGxlc3MgdGhhbiBzZWFyY2hlZCBlbGVtZW50IGV0Y1xuICogQHJldHVybiB7TnVtYmVyfSBUaGUgaW5zZXJ0aW9uIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIGxvb2sgZm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5hcnlJbnNlcnRpb25JbmRleDxUPihhcnI6IFRbXSwgY29tcGFyZTogKGE6IFQpID0+IG51bWJlcik6IG51bWJlciB7XG5cdGxldCBtaW5JbmRleCA9IDA7XG5cdGxldCBtYXhJbmRleCA9IGFyci5sZW5ndGggLSAxO1xuXHRsZXQgY3VycmVudEluZGV4OiBudW1iZXI7XG5cdGxldCBjdXJyZW50RWxlbWVudDogVDtcblx0Ly8gbm8gYXJyYXkgLyBlbXB0eSBhcnJheVxuXHRpZiAoIWFycikge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cdGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0Ly8gb3V0IG9mIGJvdW5kc1xuXHRpZiAoY29tcGFyZShhcnJbMF0pID4gMCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cdGlmIChjb21wYXJlKGFyclttYXhJbmRleF0pIDwgMCkge1xuXHRcdHJldHVybiBtYXhJbmRleCArIDE7XG5cdH1cblx0Ly8gZWxlbWVudCBpbiByYW5nZVxuXHR3aGlsZSAobWluSW5kZXggPD0gbWF4SW5kZXgpIHtcblx0XHRjdXJyZW50SW5kZXggPSBNYXRoLmZsb29yKChtaW5JbmRleCArIG1heEluZGV4KSAvIDIpO1xuXHRcdGN1cnJlbnRFbGVtZW50ID0gYXJyW2N1cnJlbnRJbmRleF07XG5cblx0XHRpZiAoY29tcGFyZShjdXJyZW50RWxlbWVudCkgPCAwKSB7XG5cdFx0XHRtaW5JbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG5cdFx0fSBlbHNlIGlmIChjb21wYXJlKGN1cnJlbnRFbGVtZW50KSA+IDApIHtcblx0XHRcdG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRJbmRleDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbWF4SW5kZXg7XG59XG5cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIDIwMTQgQUJCIFN3aXR6ZXJsYW5kIEx0ZC5cbiAqXG4gKiBEYXRlK3RpbWUrdGltZXpvbmUgcmVwcmVzZW50YXRpb25cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IGFzc2VydCBmcm9tIFwiLi9hc3NlcnRcIjtcbmltcG9ydCAqIGFzIGJhc2ljcyBmcm9tIFwiLi9iYXNpY3NcIjtcbmltcG9ydCB7IFRpbWVTdHJ1Y3QsIFRpbWVVbml0LCBXZWVrRGF5IH0gZnJvbSBcIi4vYmFzaWNzXCI7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gXCIuL2R1cmF0aW9uXCI7XG5pbXBvcnQgKiBhcyBmb3JtYXQgZnJvbSBcIi4vZm9ybWF0XCI7XG5pbXBvcnQgeyBEYXRlRnVuY3Rpb25zIH0gZnJvbSBcIi4vamF2YXNjcmlwdFwiO1xuaW1wb3J0IHsgUGFydGlhbExvY2FsZSB9IGZyb20gXCIuL2xvY2FsZVwiO1xuaW1wb3J0ICogYXMgbWF0aCBmcm9tIFwiLi9tYXRoXCI7XG5pbXBvcnQgKiBhcyBwYXJzZUZ1bmNzIGZyb20gXCIuL3BhcnNlXCI7XG5pbXBvcnQgeyBSZWFsVGltZVNvdXJjZSwgVGltZVNvdXJjZSB9IGZyb20gXCIuL3RpbWVzb3VyY2VcIjtcbmltcG9ydCB7IFRpbWVab25lLCBUaW1lWm9uZUtpbmQgfSBmcm9tIFwiLi90aW1lem9uZVwiO1xuaW1wb3J0IHsgTm9ybWFsaXplT3B0aW9uIH0gZnJvbSBcIi4vdHotZGF0YWJhc2VcIjtcblxuLyoqXG4gKiBDdXJyZW50IGRhdGUrdGltZSBpbiBsb2NhbCB0aW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3dMb2NhbCgpOiBEYXRlVGltZSB7XG5cdHJldHVybiBEYXRlVGltZS5ub3dMb2NhbCgpO1xufVxuXG4vKipcbiAqIEN1cnJlbnQgZGF0ZSt0aW1lIGluIFVUQyB0aW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3dVdGMoKTogRGF0ZVRpbWUge1xuXHRyZXR1cm4gRGF0ZVRpbWUubm93VXRjKCk7XG59XG5cbi8qKlxuICogQ3VycmVudCBkYXRlK3RpbWUgaW4gdGhlIGdpdmVuIHRpbWUgem9uZVxuICogQHBhcmFtIHRpbWVab25lXHRUaGUgZGVzaXJlZCB0aW1lIHpvbmUgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byBVVEMpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm93KHRpbWVab25lOiBUaW1lWm9uZSB8IHVuZGVmaW5lZCB8IG51bGwgPSBUaW1lWm9uZS51dGMoKSk6IERhdGVUaW1lIHtcblx0cmV0dXJuIERhdGVUaW1lLm5vdyh0aW1lWm9uZSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUb1V0Yyhsb2NhbFRpbWU6IFRpbWVTdHJ1Y3QsIGZyb21ab25lPzogVGltZVpvbmUpOiBUaW1lU3RydWN0IHtcblx0aWYgKGZyb21ab25lKSB7XG5cdFx0Y29uc3Qgb2Zmc2V0OiBudW1iZXIgPSBmcm9tWm9uZS5vZmZzZXRGb3Jab25lKGxvY2FsVGltZSk7XG5cdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KGxvY2FsVGltZS51bml4TWlsbGlzIC0gb2Zmc2V0ICogNjAwMDApO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBsb2NhbFRpbWUuY2xvbmUoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0RnJvbVV0Yyh1dGNUaW1lOiBUaW1lU3RydWN0LCB0b1pvbmU/OiBUaW1lWm9uZSk6IFRpbWVTdHJ1Y3Qge1xuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRpZiAodG9ab25lKSB7XG5cdFx0Y29uc3Qgb2Zmc2V0OiBudW1iZXIgPSB0b1pvbmUub2Zmc2V0Rm9yVXRjKHV0Y1RpbWUpO1xuXHRcdHJldHVybiB0b1pvbmUubm9ybWFsaXplWm9uZVRpbWUobmV3IFRpbWVTdHJ1Y3QodXRjVGltZS51bml4TWlsbGlzICsgb2Zmc2V0ICogNjAwMDApKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdXRjVGltZS5jbG9uZSgpO1xuXHR9XG59XG5cbi8qKlxuICogRGF0ZVRpbWUgY2xhc3Mgd2hpY2ggaXMgdGltZSB6b25lLWF3YXJlXG4gKiBhbmQgd2hpY2ggY2FuIGJlIG1vY2tlZCBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIERhdGVUaW1lIHtcblxuXHQvKipcblx0ICogQWxsb3cgbm90IHVzaW5nIGluc3RhbmNlb2Zcblx0ICovXG5cdHB1YmxpYyBraW5kID0gXCJEYXRlVGltZVwiO1xuXG5cdC8qKlxuXHQgKiBVVEMgdGltZXN0YW1wIChsYXppbHkgY2FsY3VsYXRlZClcblx0ICovXG5cdHByaXZhdGUgX3V0Y0RhdGU/OiBUaW1lU3RydWN0O1xuXHRwcml2YXRlIGdldCB1dGNEYXRlKCk6IFRpbWVTdHJ1Y3Qge1xuXHRcdGlmICghdGhpcy5fdXRjRGF0ZSkge1xuXHRcdFx0dGhpcy5fdXRjRGF0ZSA9IGNvbnZlcnRUb1V0Yyh0aGlzLl96b25lRGF0ZSBhcyBUaW1lU3RydWN0LCB0aGlzLl96b25lKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3V0Y0RhdGU7XG5cdH1cblx0cHJpdmF0ZSBzZXQgdXRjRGF0ZSh2YWx1ZTogVGltZVN0cnVjdCkge1xuXHRcdHRoaXMuX3V0Y0RhdGUgPSB2YWx1ZTtcblx0XHR0aGlzLl96b25lRGF0ZSA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2NhbCB0aW1lc3RhbXAgKGxhemlseSBjYWxjdWxhdGVkKVxuXHQgKi9cblx0cHJpdmF0ZSBfem9uZURhdGU/OiBUaW1lU3RydWN0O1xuXHRwcml2YXRlIGdldCB6b25lRGF0ZSgpOiBUaW1lU3RydWN0IHtcblx0XHRpZiAoIXRoaXMuX3pvbmVEYXRlKSB7XG5cdFx0XHR0aGlzLl96b25lRGF0ZSA9IGNvbnZlcnRGcm9tVXRjKHRoaXMuX3V0Y0RhdGUgYXMgVGltZVN0cnVjdCwgdGhpcy5fem9uZSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl96b25lRGF0ZTtcblx0fVxuXHRwcml2YXRlIHNldCB6b25lRGF0ZSh2YWx1ZTogVGltZVN0cnVjdCkge1xuXHRcdHRoaXMuX3pvbmVEYXRlID0gdmFsdWU7XG5cdFx0dGhpcy5fdXRjRGF0ZSA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBPcmlnaW5hbCB0aW1lIHpvbmUgdGhpcyBpbnN0YW5jZSB3YXMgY3JlYXRlZCBmb3IuXG5cdCAqIENhbiBiZSB1bmRlZmluZWQgZm9yIHVuYXdhcmUgdGltZXN0YW1wc1xuXHQgKi9cblx0cHJpdmF0ZSBfem9uZT86IFRpbWVab25lO1xuXG5cdC8qKlxuXHQgKiBBY3R1YWwgdGltZSBzb3VyY2UgaW4gdXNlLiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgYWxsb3dzIHRvXG5cdCAqIGZha2UgdGltZSBpbiB0ZXN0cy4gRGF0ZVRpbWUubm93TG9jYWwoKSBhbmQgRGF0ZVRpbWUubm93VXRjKClcblx0ICogdXNlIHRoaXMgcHJvcGVydHkgZm9yIG9idGFpbmluZyB0aGUgY3VycmVudCB0aW1lLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0aW1lU291cmNlOiBUaW1lU291cmNlID0gbmV3IFJlYWxUaW1lU291cmNlKCk7XG5cblx0LyoqXG5cdCAqIEN1cnJlbnQgZGF0ZSt0aW1lIGluIGxvY2FsIHRpbWVcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgbm93TG9jYWwoKTogRGF0ZVRpbWUge1xuXHRcdGNvbnN0IG4gPSBEYXRlVGltZS50aW1lU291cmNlLm5vdygpO1xuXHRcdHJldHVybiBuZXcgRGF0ZVRpbWUobiwgRGF0ZUZ1bmN0aW9ucy5HZXQsIFRpbWVab25lLmxvY2FsKCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEN1cnJlbnQgZGF0ZSt0aW1lIGluIFVUQyB0aW1lXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIG5vd1V0YygpOiBEYXRlVGltZSB7XG5cdFx0cmV0dXJuIG5ldyBEYXRlVGltZShEYXRlVGltZS50aW1lU291cmNlLm5vdygpLCBEYXRlRnVuY3Rpb25zLkdldFVUQywgVGltZVpvbmUudXRjKCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEN1cnJlbnQgZGF0ZSt0aW1lIGluIHRoZSBnaXZlbiB0aW1lIHpvbmVcblx0ICogQHBhcmFtIHRpbWVab25lXHRUaGUgZGVzaXJlZCB0aW1lIHpvbmUgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byBVVEMpLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBub3codGltZVpvbmU6IFRpbWVab25lIHwgbnVsbCB8IHVuZGVmaW5lZCA9IFRpbWVab25lLnV0YygpKTogRGF0ZVRpbWUge1xuXHRcdHJldHVybiBuZXcgRGF0ZVRpbWUoRGF0ZVRpbWUudGltZVNvdXJjZS5ub3coKSwgRGF0ZUZ1bmN0aW9ucy5HZXRVVEMsIFRpbWVab25lLnV0YygpKS50b1pvbmUodGltZVpvbmUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIERhdGVUaW1lIGZyb20gYSBMb3R1cyAxMjMgLyBNaWNyb3NvZnQgRXhjZWwgZGF0ZS10aW1lIHZhbHVlXG5cdCAqIGkuZS4gYSBkb3VibGUgcmVwcmVzZW50aW5nIGRheXMgc2luY2UgMS0xLTE5MDAgd2hlcmUgMTkwMCBpcyBpbmNvcnJlY3RseSBzZWVuIGFzIGxlYXAgeWVhclxuXHQgKiBEb2VzIG5vdCB3b3JrIGZvciBkYXRlcyA8IDE5MDBcblx0ICogQHBhcmFtIG4gZXhjZWwgZGF0ZS90aW1lIG51bWJlclxuXHQgKiBAcGFyYW0gdGltZVpvbmUgVGltZSB6b25lIHRvIGFzc3VtZSB0aGF0IHRoZSBleGNlbCB2YWx1ZSBpcyBpblxuXHQgKiBAcmV0dXJucyBhIERhdGVUaW1lXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGZyb21FeGNlbChuOiBudW1iZXIsIHRpbWVab25lPzogVGltZVpvbmUgfCBudWxsIHwgdW5kZWZpbmVkKTogRGF0ZVRpbWUge1xuXHRcdGFzc2VydCh0eXBlb2YgbiA9PT0gXCJudW1iZXJcIiwgXCJmcm9tRXhjZWwoKTogZmlyc3QgcGFyYW1ldGVyIG11c3QgYmUgYSBudW1iZXJcIik7XG5cdFx0YXNzZXJ0KCFpc05hTihuKSwgXCJmcm9tRXhjZWwoKTogZmlyc3QgcGFyYW1ldGVyIG11c3Qgbm90IGJlIE5hTlwiKTtcblx0XHRhc3NlcnQoaXNGaW5pdGUobiksIFwiZnJvbUV4Y2VsKCk6IGZpcnN0IHBhcmFtZXRlciBtdXN0IG5vdCBiZSBOYU5cIik7XG5cdFx0Y29uc3QgdW5peFRpbWVzdGFtcCA9IE1hdGgucm91bmQoKG4gLSAyNTU2OSkgKiAyNCAqIDYwICogNjAgKiAxMDAwKTtcblx0XHRyZXR1cm4gbmV3IERhdGVUaW1lKHVuaXhUaW1lc3RhbXAsIHRpbWVab25lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayB3aGV0aGVyIGEgZ2l2ZW4gZGF0ZSBleGlzdHMgaW4gdGhlIGdpdmVuIHRpbWUgem9uZS5cblx0ICogRS5nLiAyMDE1LTAyLTI5IHJldHVybnMgZmFsc2UgKG5vdCBhIGxlYXAgeWVhcilcblx0ICogYW5kIDIwMTUtMDMtMjlUMDI6MzA6MDAgcmV0dXJucyBmYWxzZSAoZGF5bGlnaHQgc2F2aW5nIHRpbWUgbWlzc2luZyBob3VyKVxuXHQgKiBhbmQgMjAxNS0wNC0zMSByZXR1cm5zIGZhbHNlIChBcHJpbCBoYXMgMzAgZGF5cykuXG5cdCAqIEJ5IGRlZmF1bHQsIHByZS0xOTcwIGRhdGVzIGFsc28gcmV0dXJuIGZhbHNlIHNpbmNlIHRoZSB0aW1lIHpvbmUgZGF0YWJhc2UgZG9lcyBub3QgY29udGFpbiBhY2N1cmF0ZSBpbmZvXG5cdCAqIGJlZm9yZSB0aGF0LiBZb3UgY2FuIGNoYW5nZSB0aGF0IHdpdGggdGhlIGFsbG93UHJlMTk3MCBmbGFnLlxuXHQgKlxuXHQgKiBAcGFyYW0gYWxsb3dQcmUxOTcwIChvcHRpb25hbCwgZGVmYXVsdCBmYWxzZSk6IHJldHVybiB0cnVlIGZvciBwcmUtMTk3MCBkYXRlc1xuXHQgKi9cblx0cHVibGljIHN0YXRpYyBleGlzdHMoXG5cdFx0eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyID0gMSwgZGF5OiBudW1iZXIgPSAxLFxuXHRcdGhvdXI6IG51bWJlciA9IDAsIG1pbnV0ZTogbnVtYmVyID0gMCwgc2Vjb25kOiBudW1iZXIgPSAwLCBtaWxsaXNlY29uZDogbnVtYmVyID0gMCxcblx0XHR6b25lPzogVGltZVpvbmUgfCBudWxsIHwgdW5kZWZpbmVkLCBhbGxvd1ByZTE5NzA6IGJvb2xlYW4gPSBmYWxzZVxuXHQpOiBib29sZWFuIHtcblx0XHRpZiAoXG5cdFx0XHQhaXNGaW5pdGUoeWVhcikgfHwgIWlzRmluaXRlKG1vbnRoKSB8fCAhaXNGaW5pdGUoZGF5KSB8fCAhaXNGaW5pdGUoaG91cikgfHwgIWlzRmluaXRlKG1pbnV0ZSkgfHwgIWlzRmluaXRlKHNlY29uZClcblx0XHRcdHx8ICFpc0Zpbml0ZShtaWxsaXNlY29uZClcblx0XHQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKCFhbGxvd1ByZTE5NzAgJiYgeWVhciA8IDE5NzApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGR0ID0gbmV3IERhdGVUaW1lKHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZCwgem9uZSk7XG5cdFx0XHRyZXR1cm4gKHllYXIgPT09IGR0LnllYXIoKSAmJiBtb250aCA9PT0gZHQubW9udGgoKSAmJiBkYXkgPT09IGR0LmRheSgpXG5cdFx0XHRcdCYmIGhvdXIgPT09IGR0LmhvdXIoKSAmJiBtaW51dGUgPT09IGR0Lm1pbnV0ZSgpICYmIHNlY29uZCA9PT0gZHQuc2Vjb25kKCkgJiYgbWlsbGlzZWNvbmQgPT09IGR0Lm1pbGxpc2Vjb25kKCkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ29uc3RydWN0b3IuIENyZWF0ZXMgY3VycmVudCB0aW1lIGluIGxvY2FsIHRpbWV6b25lLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKTtcblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yLiBQYXJzZXMgSVNPIHRpbWVzdGFtcCBzdHJpbmcuXG5cdCAqIE5vbi1leGlzdGluZyBsb2NhbCB0aW1lcyBhcmUgbm9ybWFsaXplZCBieSByb3VuZGluZyB1cCB0byB0aGUgbmV4dCBEU1Qgb2Zmc2V0LlxuXHQgKlxuXHQgKiBAcGFyYW0gaXNvU3RyaW5nXHRTdHJpbmcgaW4gSVNPIDg2MDEgZm9ybWF0LiBJbnN0ZWFkIG9mIElTTyB0aW1lIHpvbmUsXG5cdCAqICAgICAgICBpdCBtYXkgaW5jbHVkZSBhIHNwYWNlIGFuZCB0aGVuIGFuZCBJQU5BIHRpbWUgem9uZS5cblx0ICogICAgICAgIGUuZy4gXCIyMDA3LTA0LTA1VDEyOjMwOjQwLjUwMFwiXHRcdFx0XHRcdChubyB0aW1lIHpvbmUsIG5haXZlIGRhdGUpXG5cdCAqICAgICAgICBlLmcuIFwiMjAwNy0wNC0wNVQxMjozMDo0MC41MDArMDE6MDBcIlx0XHRcdFx0KFVUQyBvZmZzZXQgd2l0aG91dCBkYXlsaWdodCBzYXZpbmcgdGltZSlcblx0ICogICAgICAgIG9yICAgXCIyMDA3LTA0LTA1VDEyOjMwOjQwLjUwMFpcIlx0XHRcdFx0XHQoVVRDKVxuXHQgKiAgICAgICAgb3IgICBcIjIwMDctMDQtMDVUMTI6MzA6NDAuNTAwIEV1cm9wZS9BbXN0ZXJkYW1cIlx0KElBTkEgdGltZSB6b25lLCB3aXRoIGRheWxpZ2h0IHNhdmluZyB0aW1lIGlmIGFwcGxpY2FibGUpXG5cdCAqIEBwYXJhbSB0aW1lWm9uZVx0aWYgZ2l2ZW4sIHRoZSBkYXRlIGluIHRoZSBzdHJpbmcgaXMgYXNzdW1lZCB0byBiZSBpbiB0aGlzIHRpbWUgem9uZS5cblx0ICogICAgICAgIE5vdGUgdGhhdCBpdCBpcyBOT1QgQ09OVkVSVEVEIHRvIHRoZSB0aW1lIHpvbmUuIFVzZWZ1bFxuXHQgKiAgICAgICAgZm9yIHN0cmluZ3Mgd2l0aG91dCBhIHRpbWUgem9uZVxuXHQgKi9cblx0Y29uc3RydWN0b3IoaXNvU3RyaW5nOiBzdHJpbmcsIHRpbWVab25lPzogVGltZVpvbmUgfCBudWxsIHwgdW5kZWZpbmVkKTtcblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yLiBQYXJzZXMgc3RyaW5nIGluIGdpdmVuIExETUwgZm9ybWF0LlxuXHQgKiBOT1RFOiBkb2VzIG5vdCBoYW5kbGUgZXJhcy9xdWFydGVycy93ZWVrcy93ZWVrZGF5cy5cblx0ICogTm9uLWV4aXN0aW5nIGxvY2FsIHRpbWVzIGFyZSBub3JtYWxpemVkIGJ5IHJvdW5kaW5nIHVwIHRvIHRoZSBuZXh0IERTVCBvZmZzZXQuXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRlU3RyaW5nXHREYXRlK1RpbWUgc3RyaW5nLlxuXHQgKiBAcGFyYW0gZm9ybWF0IFRoZSBMRE1MIGZvcm1hdCB0aGF0IHRoZSBzdHJpbmcgaXMgYXNzdW1lZCB0byBiZSBpblxuXHQgKiBAcGFyYW0gdGltZVpvbmVcdGlmIGdpdmVuLCB0aGUgZGF0ZSBpbiB0aGUgc3RyaW5nIGlzIGFzc3VtZWQgdG8gYmUgaW4gdGhpcyB0aW1lIHpvbmUuXG5cdCAqICAgICAgICBOb3RlIHRoYXQgaXQgaXMgTk9UIENPTlZFUlRFRCB0byB0aGUgdGltZSB6b25lLiBVc2VmdWxcblx0ICogICAgICAgIGZvciBzdHJpbmdzIHdpdGhvdXQgYSB0aW1lIHpvbmVcblx0ICovXG5cdGNvbnN0cnVjdG9yKGRhdGVTdHJpbmc6IHN0cmluZywgZm9ybWF0OiBzdHJpbmcsIHRpbWVab25lPzogVGltZVpvbmUgfCBudWxsIHwgdW5kZWZpbmVkKTtcblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yLiBZb3UgcHJvdmlkZSBhIGRhdGUsIHRoZW4geW91IHNheSB3aGV0aGVyIHRvIHRha2UgdGhlXG5cdCAqIGRhdGUuZ2V0WWVhcigpL2dldFh4eCBtZXRob2RzIG9yIHRoZSBkYXRlLmdldFVUQ1llYXIoKS9kYXRlLmdldFVUQ1h4eCBtZXRob2RzLFxuXHQgKiBhbmQgdGhlbiB5b3Ugc3RhdGUgd2hpY2ggdGltZSB6b25lIHRoYXQgZGF0ZSBpcyBpbi5cblx0ICogTm9uLWV4aXN0aW5nIGxvY2FsIHRpbWVzIGFyZSBub3JtYWxpemVkIGJ5IHJvdW5kaW5nIHVwIHRvIHRoZSBuZXh0IERTVCBvZmZzZXQuXG5cdCAqIE5vdGUgdGhhdCB0aGUgRGF0ZSBjbGFzcyBoYXMgYnVncyBhbmQgaW5jb25zaXN0ZW5jaWVzIHdoZW4gY29uc3RydWN0aW5nIHRoZW0gd2l0aCB0aW1lcyBhcm91bmRcblx0ICogRFNUIGNoYW5nZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRlXHRBIGRhdGUgb2JqZWN0LlxuXHQgKiBAcGFyYW0gZ2V0dGVycyBTcGVjaWZpZXMgd2hpY2ggc2V0IG9mIERhdGUgZ2V0dGVycyBjb250YWlucyB0aGUgZGF0ZSBpbiB0aGUgZ2l2ZW4gdGltZSB6b25lOiB0aGVcblx0ICogICAgICAgIERhdGUuZ2V0WHh4KCkgbWV0aG9kcyBvciB0aGUgRGF0ZS5nZXRVVENYeHgoKSBtZXRob2RzLlxuXHQgKiBAcGFyYW0gdGltZVpvbmUgVGhlIHRpbWUgem9uZSB0aGF0IHRoZSBnaXZlbiBkYXRlIGlzIGFzc3VtZWQgdG8gYmUgaW4gKG1heSBiZSB1bmRlZmluZWQgb3IgbnVsbCBmb3IgdW5hd2FyZSBkYXRlcylcblx0ICovXG5cdGNvbnN0cnVjdG9yKGRhdGU6IERhdGUsIGdldEZ1bmNzOiBEYXRlRnVuY3Rpb25zLCB0aW1lWm9uZT86IFRpbWVab25lIHwgbnVsbCB8IHVuZGVmaW5lZCk7XG5cdC8qKlxuXHQgKiBHZXQgYSBkYXRlIGZyb20gYSBUaW1lU3RydWN0XG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0bTogVGltZVN0cnVjdCwgdGltZVpvbmU/OiBUaW1lWm9uZSB8IG51bGwgfCB1bmRlZmluZWQpO1xuXHQvKipcblx0ICogQ29uc3RydWN0b3IuIE5vdGUgdGhhdCB1bmxpa2UgSmF2YVNjcmlwdCBkYXRlcyB3ZSByZXF1aXJlIGZpZWxkcyB0byBiZSBpbiBub3JtYWwgcmFuZ2VzLlxuXHQgKiBVc2UgdGhlIGFkZChkdXJhdGlvbikgb3Igc3ViKGR1cmF0aW9uKSBmb3IgYXJpdGhtZXRpYy5cblx0ICogQHBhcmFtIHllYXJcdFRoZSBmdWxsIHllYXIgKGUuZy4gMjAxNClcblx0ICogQHBhcmFtIG1vbnRoXHRUaGUgbW9udGggWzEtMTJdIChub3RlIHRoaXMgZGV2aWF0ZXMgZnJvbSBKYXZhU2NyaXB0IERhdGUpXG5cdCAqIEBwYXJhbSBkYXlcdFRoZSBkYXkgb2YgdGhlIG1vbnRoIFsxLTMxXVxuXHQgKiBAcGFyYW0gaG91clx0VGhlIGhvdXIgb2YgdGhlIGRheSBbMC0yNClcblx0ICogQHBhcmFtIG1pbnV0ZVx0VGhlIG1pbnV0ZSBvZiB0aGUgaG91ciBbMC01OV1cblx0ICogQHBhcmFtIHNlY29uZFx0VGhlIHNlY29uZCBvZiB0aGUgbWludXRlIFswLTU5XVxuXHQgKiBAcGFyYW0gbWlsbGlzZWNvbmRcdFRoZSBtaWxsaXNlY29uZCBvZiB0aGUgc2Vjb25kIFswLTk5OV1cblx0ICogQHBhcmFtIHRpbWVab25lXHRUaGUgdGltZSB6b25lLCBvciBudWxsL3VuZGVmaW5lZCAoZm9yIHVuYXdhcmUgZGF0ZXMpXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihcblx0XHR5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIGRheTogbnVtYmVyLFxuXHRcdGhvdXI/OiBudW1iZXIsIG1pbnV0ZT86IG51bWJlciwgc2Vjb25kPzogbnVtYmVyLCBtaWxsaXNlY29uZD86IG51bWJlcixcblx0XHR0aW1lWm9uZT86IFRpbWVab25lIHwgbnVsbCB8IHVuZGVmaW5lZFxuXHQpO1xuXHQvKipcblx0ICogQ29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHVuaXhUaW1lc3RhbXBcdG1pbGxpc2Vjb25kcyBzaW5jZSAxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFxuXHQgKiBAcGFyYW0gdGltZVpvbmVcdHRoZSB0aW1lIHpvbmUgdGhhdCB0aGUgdGltZXN0YW1wIGlzIGFzc3VtZWQgdG8gYmUgaW4gKHVzdWFsbHkgVVRDKS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHVuaXhUaW1lc3RhbXA6IG51bWJlciwgdGltZVpvbmU/OiBUaW1lWm9uZSB8IG51bGwgfCB1bmRlZmluZWQpO1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RvciBpbXBsZW1lbnRhdGlvbiwgZG8gbm90IGNhbGxcblx0ICovXG5cdGNvbnN0cnVjdG9yKFxuXHRcdGExPzogYW55LCBhMj86IGFueSwgYTM/OiBhbnksXG5cdFx0aD86IG51bWJlciwgbT86IG51bWJlciwgcz86IG51bWJlciwgbXM/OiBudW1iZXIsXG5cdFx0dGltZVpvbmU/OiBUaW1lWm9uZSB8IG51bGxcblx0KSB7XG5cdFx0c3dpdGNoICh0eXBlb2YgKGExKSkge1xuXHRcdFx0Y2FzZSBcIm51bWJlclwiOiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgYTIgIT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRhc3NlcnQoXG5cdFx0XHRcdFx0XHRhMyA9PT0gdW5kZWZpbmVkICYmIGggPT09IHVuZGVmaW5lZCAmJiBtID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdCYmIHMgPT09IHVuZGVmaW5lZCAmJiBtcyA9PT0gdW5kZWZpbmVkICYmIHRpbWVab25lID09PSB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRcImZvciB1bml4IHRpbWVzdGFtcCBkYXRldGltZSBjb25zdHJ1Y3RvciwgdGhpcmQgdGhyb3VnaCA4dGggYXJndW1lbnQgbXVzdCBiZSB1bmRlZmluZWRcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YXNzZXJ0KGEyID09PSB1bmRlZmluZWQgfHwgYTIgPT09IG51bGwgfHwgaXNUaW1lWm9uZShhMiksIFwiRGF0ZVRpbWUuRGF0ZVRpbWUoKTogc2Vjb25kIGFyZyBzaG91bGQgYmUgYSBUaW1lWm9uZSBvYmplY3QuXCIpO1xuXHRcdFx0XHRcdC8vIHVuaXggdGltZXN0YW1wIGNvbnN0cnVjdG9yXG5cdFx0XHRcdFx0dGhpcy5fem9uZSA9ICh0eXBlb2YgKGEyKSA9PT0gXCJvYmplY3RcIiAmJiBpc1RpbWVab25lKGEyKSA/IGEyIGFzIFRpbWVab25lIDogdW5kZWZpbmVkKTtcblx0XHRcdFx0XHRpZiAodGhpcy5fem9uZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fem9uZURhdGUgPSB0aGlzLl96b25lLm5vcm1hbGl6ZVpvbmVUaW1lKG5ldyBUaW1lU3RydWN0KG1hdGgucm91bmRTeW0oYTEgYXMgbnVtYmVyKSkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLl96b25lRGF0ZSA9IG5ldyBUaW1lU3RydWN0KG1hdGgucm91bmRTeW0oYTEgYXMgbnVtYmVyKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIHllYXIgbW9udGggZGF5IGNvbnN0cnVjdG9yXG5cdFx0XHRcdFx0YXNzZXJ0KHR5cGVvZiAoYTIpID09PSBcIm51bWJlclwiLCBcIkRhdGVUaW1lLkRhdGVUaW1lKCk6IEV4cGVjdCBtb250aCB0byBiZSBhIG51bWJlci5cIik7XG5cdFx0XHRcdFx0YXNzZXJ0KHR5cGVvZiAoYTMpID09PSBcIm51bWJlclwiLCBcIkRhdGVUaW1lLkRhdGVUaW1lKCk6IEV4cGVjdCBkYXkgdG8gYmUgYSBudW1iZXIuXCIpO1xuXHRcdFx0XHRcdGFzc2VydChcblx0XHRcdFx0XHRcdHRpbWVab25lID09PSB1bmRlZmluZWQgfHwgdGltZVpvbmUgPT09IG51bGwgfHwgaXNUaW1lWm9uZSh0aW1lWm9uZSksXG5cdFx0XHRcdFx0XHRcIkRhdGVUaW1lLkRhdGVUaW1lKCk6IGVpZ2h0aCBhcmcgc2hvdWxkIGJlIGEgVGltZVpvbmUgb2JqZWN0LlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRsZXQgeWVhcjogbnVtYmVyID0gYTEgYXMgbnVtYmVyO1xuXHRcdFx0XHRcdGxldCBtb250aDogbnVtYmVyID0gYTIgYXMgbnVtYmVyO1xuXHRcdFx0XHRcdGxldCBkYXk6IG51bWJlciA9IGEzIGFzIG51bWJlcjtcblx0XHRcdFx0XHRsZXQgaG91cjogbnVtYmVyID0gKHR5cGVvZiAoaCkgPT09IFwibnVtYmVyXCIgPyBoIDogMCk7XG5cdFx0XHRcdFx0bGV0IG1pbnV0ZTogbnVtYmVyID0gKHR5cGVvZiAobSkgPT09IFwibnVtYmVyXCIgPyBtIDogMCk7XG5cdFx0XHRcdFx0bGV0IHNlY29uZDogbnVtYmVyID0gKHR5cGVvZiAocykgPT09IFwibnVtYmVyXCIgPyBzIDogMCk7XG5cdFx0XHRcdFx0bGV0IG1pbGxpOiBudW1iZXIgPSAodHlwZW9mIChtcykgPT09IFwibnVtYmVyXCIgPyBtcyA6IDApO1xuXHRcdFx0XHRcdHllYXIgPSBtYXRoLnJvdW5kU3ltKHllYXIpO1xuXHRcdFx0XHRcdG1vbnRoID0gbWF0aC5yb3VuZFN5bShtb250aCk7XG5cdFx0XHRcdFx0ZGF5ID0gbWF0aC5yb3VuZFN5bShkYXkpO1xuXHRcdFx0XHRcdGhvdXIgPSBtYXRoLnJvdW5kU3ltKGhvdXIpO1xuXHRcdFx0XHRcdG1pbnV0ZSA9IG1hdGgucm91bmRTeW0obWludXRlKTtcblx0XHRcdFx0XHRzZWNvbmQgPSBtYXRoLnJvdW5kU3ltKHNlY29uZCk7XG5cdFx0XHRcdFx0bWlsbGkgPSBtYXRoLnJvdW5kU3ltKG1pbGxpKTtcblx0XHRcdFx0XHRjb25zdCB0bSA9IG5ldyBUaW1lU3RydWN0KHsgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpIH0pO1xuXHRcdFx0XHRcdGFzc2VydCh0bS52YWxpZGF0ZSgpLCBgaW52YWxpZCBkYXRlOiAke3RtLnRvU3RyaW5nKCl9YCk7XG5cblx0XHRcdFx0XHR0aGlzLl96b25lID0gKHR5cGVvZiAodGltZVpvbmUpID09PSBcIm9iamVjdFwiICYmIGlzVGltZVpvbmUodGltZVpvbmUpID8gdGltZVpvbmUgOiB1bmRlZmluZWQpO1xuXG5cdFx0XHRcdFx0Ly8gbm9ybWFsaXplIGxvY2FsIHRpbWUgKHJlbW92ZSBub24tZXhpc3RpbmcgbG9jYWwgdGltZSlcblx0XHRcdFx0XHRpZiAodGhpcy5fem9uZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fem9uZURhdGUgPSB0aGlzLl96b25lLm5vcm1hbGl6ZVpvbmVUaW1lKHRtKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5fem9uZURhdGUgPSB0bTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInN0cmluZ1wiOiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgYTIgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRhc3NlcnQoXG5cdFx0XHRcdFx0XHRoID09PSB1bmRlZmluZWQgJiYgbSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHQmJiBzID09PSB1bmRlZmluZWQgJiYgbXMgPT09IHVuZGVmaW5lZCAmJiB0aW1lWm9uZSA9PT0gdW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0XCJmaXJzdCB0d28gYXJndW1lbnRzIGFyZSBhIHN0cmluZywgdGhlcmVmb3JlIHRoZSBmb3VydGggdGhyb3VnaCA4dGggYXJndW1lbnQgbXVzdCBiZSB1bmRlZmluZWRcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YXNzZXJ0KGEzID09PSB1bmRlZmluZWQgfHwgYTMgPT09IG51bGwgfHwgaXNUaW1lWm9uZShhMyksIFwiRGF0ZVRpbWUuRGF0ZVRpbWUoKTogdGhpcmQgYXJnIHNob3VsZCBiZSBhIFRpbWVab25lIG9iamVjdC5cIik7XG5cdFx0XHRcdFx0Ly8gZm9ybWF0IHN0cmluZyBnaXZlblxuXHRcdFx0XHRcdGNvbnN0IGRhdGVTdHJpbmc6IHN0cmluZyA9IGExIGFzIHN0cmluZztcblx0XHRcdFx0XHRjb25zdCBmb3JtYXRTdHJpbmc6IHN0cmluZyA9IGEyIGFzIHN0cmluZztcblx0XHRcdFx0XHRsZXQgem9uZTogVGltZVpvbmUgfCB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBhMyA9PT0gXCJvYmplY3RcIiAmJiBpc1RpbWVab25lKGEzKSkge1xuXHRcdFx0XHRcdFx0em9uZSA9IChhMykgYXMgVGltZVpvbmU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnN0IHBhcnNlZCA9IHBhcnNlRnVuY3MucGFyc2UoZGF0ZVN0cmluZywgZm9ybWF0U3RyaW5nLCB6b25lKTtcblx0XHRcdFx0XHR0aGlzLl96b25lRGF0ZSA9IHBhcnNlZC50aW1lO1xuXHRcdFx0XHRcdHRoaXMuX3pvbmUgPSBwYXJzZWQuem9uZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhc3NlcnQoXG5cdFx0XHRcdFx0XHRhMyA9PT0gdW5kZWZpbmVkICYmIGggPT09IHVuZGVmaW5lZCAmJiBtID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdCYmIHMgPT09IHVuZGVmaW5lZCAmJiBtcyA9PT0gdW5kZWZpbmVkICYmIHRpbWVab25lID09PSB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRcImZpcnN0IGFyZ3VtZW50cyBpcyBhIHN0cmluZyBhbmQgdGhlIHNlY29uZCBpcyBub3QsIHRoZXJlZm9yZSB0aGUgdGhpcmQgdGhyb3VnaCA4dGggYXJndW1lbnQgbXVzdCBiZSB1bmRlZmluZWRcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YXNzZXJ0KGEyID09PSB1bmRlZmluZWQgfHwgYTIgPT09IG51bGwgfHwgaXNUaW1lWm9uZShhMiksIFwiRGF0ZVRpbWUuRGF0ZVRpbWUoKTogc2Vjb25kIGFyZyBzaG91bGQgYmUgYSBUaW1lWm9uZSBvYmplY3QuXCIpO1xuXHRcdFx0XHRcdGNvbnN0IGdpdmVuU3RyaW5nID0gKGExIGFzIHN0cmluZykudHJpbSgpO1xuXHRcdFx0XHRcdGNvbnN0IHNzOiBzdHJpbmdbXSA9IERhdGVUaW1lLl9zcGxpdERhdGVGcm9tVGltZVpvbmUoZ2l2ZW5TdHJpbmcpO1xuXHRcdFx0XHRcdGFzc2VydChzcy5sZW5ndGggPT09IDIsIFwiSW52YWxpZCBkYXRlIHN0cmluZyBnaXZlbjogXFxcIlwiICsgYTEgYXMgc3RyaW5nICsgXCJcXFwiXCIpO1xuXHRcdFx0XHRcdGlmIChpc1RpbWVab25lKGEyKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fem9uZSA9IChhMikgYXMgVGltZVpvbmU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuX3pvbmUgPSAoc3NbMV0udHJpbSgpID8gVGltZVpvbmUuem9uZShzc1sxXSkgOiB1bmRlZmluZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyB1c2Ugb3VyIG93biBJU08gcGFyc2luZyBiZWNhdXNlIHRoYXQgaXQgcGxhdGZvcm0gaW5kZXBlbmRlbnRcblx0XHRcdFx0XHQvLyAoZnJlZSBvZiBEYXRlIHF1aXJrcylcblx0XHRcdFx0XHR0aGlzLl96b25lRGF0ZSA9IFRpbWVTdHJ1Y3QuZnJvbVN0cmluZyhzc1swXSk7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3pvbmUpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3pvbmVEYXRlID0gdGhpcy5fem9uZS5ub3JtYWxpemVab25lVGltZSh0aGlzLl96b25lRGF0ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJvYmplY3RcIjoge1xuXHRcdFx0XHRpZiAoYTEgaW5zdGFuY2VvZiBEYXRlKSB7XG5cdFx0XHRcdFx0YXNzZXJ0KFxuXHRcdFx0XHRcdFx0aCA9PT0gdW5kZWZpbmVkICYmIG0gPT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0JiYgcyA9PT0gdW5kZWZpbmVkICYmIG1zID09PSB1bmRlZmluZWQgJiYgdGltZVpvbmUgPT09IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdFwiZmlyc3QgYXJndW1lbnQgaXMgYSBEYXRlLCB0aGVyZWZvcmUgdGhlIGZvdXJ0aCB0aHJvdWdoIDh0aCBhcmd1bWVudCBtdXN0IGJlIHVuZGVmaW5lZFwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRhc3NlcnQoXG5cdFx0XHRcdFx0XHR0eXBlb2YgKGEyKSA9PT0gXCJudW1iZXJcIiAmJiAoYTIgPT09IERhdGVGdW5jdGlvbnMuR2V0IHx8IGEyID09PSBEYXRlRnVuY3Rpb25zLkdldFVUQyksXG5cdFx0XHRcdFx0XHRcIkRhdGVUaW1lLkRhdGVUaW1lKCk6IGZvciBhIERhdGUgb2JqZWN0IGEgRGF0ZUZ1bmN0aW9ucyBtdXN0IGJlIHBhc3NlZCBhcyBzZWNvbmQgYXJndW1lbnRcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YXNzZXJ0KGEzID09PSB1bmRlZmluZWQgfHwgYTMgPT09IG51bGwgfHwgaXNUaW1lWm9uZShhMyksIFwiRGF0ZVRpbWUuRGF0ZVRpbWUoKTogdGhpcmQgYXJnIHNob3VsZCBiZSBhIFRpbWVab25lIG9iamVjdC5cIik7XG5cdFx0XHRcdFx0Y29uc3QgZDogRGF0ZSA9IChhMSkgYXMgRGF0ZTtcblx0XHRcdFx0XHRjb25zdCBkazogRGF0ZUZ1bmN0aW9ucyA9IChhMikgYXMgRGF0ZUZ1bmN0aW9ucztcblx0XHRcdFx0XHR0aGlzLl96b25lID0gKGEzID8gYTMgOiB1bmRlZmluZWQpO1xuXHRcdFx0XHRcdHRoaXMuX3pvbmVEYXRlID0gVGltZVN0cnVjdC5mcm9tRGF0ZShkLCBkayk7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3pvbmUpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3pvbmVEYXRlID0gdGhpcy5fem9uZS5ub3JtYWxpemVab25lVGltZSh0aGlzLl96b25lRGF0ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgeyAvLyBhMSBpbnN0YW5jZW9mIFRpbWVTdHJ1Y3Rcblx0XHRcdFx0XHRhc3NlcnQoXG5cdFx0XHRcdFx0XHRhMyA9PT0gdW5kZWZpbmVkICYmIGggPT09IHVuZGVmaW5lZCAmJiBtID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdCYmIHMgPT09IHVuZGVmaW5lZCAmJiBtcyA9PT0gdW5kZWZpbmVkICYmIHRpbWVab25lID09PSB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRcImZpcnN0IGFyZ3VtZW50IGlzIGEgVGltZVN0cnVjdCwgdGhlcmVmb3JlIHRoZSB0aGlyZCB0aHJvdWdoIDh0aCBhcmd1bWVudCBtdXN0IGJlIHVuZGVmaW5lZFwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRhc3NlcnQoYTIgPT09IHVuZGVmaW5lZCB8fCBhMiA9PT0gbnVsbCB8fCBpc1RpbWVab25lKGEyKSwgXCJleHBlY3QgYSBUaW1lWm9uZSBhcyBzZWNvbmQgYXJndW1lbnRcIik7XG5cdFx0XHRcdFx0dGhpcy5fem9uZURhdGUgPSBhMS5jbG9uZSgpO1xuXHRcdFx0XHRcdHRoaXMuX3pvbmUgPSAoYTIgPyBhMiA6IHVuZGVmaW5lZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gYnJlYWs7XG5cdFx0XHRjYXNlIFwidW5kZWZpbmVkXCI6IHtcblx0XHRcdFx0YXNzZXJ0KFxuXHRcdFx0XHRcdGEyID09PSB1bmRlZmluZWQgJiYgYTMgPT09IHVuZGVmaW5lZCAmJiBoID09PSB1bmRlZmluZWQgJiYgbSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0JiYgcyA9PT0gdW5kZWZpbmVkICYmIG1zID09PSB1bmRlZmluZWQgJiYgdGltZVpvbmUgPT09IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcImZpcnN0IGFyZ3VtZW50IGlzIHVuZGVmaW5lZCwgdGhlcmVmb3JlIHRoZSByZXN0IG11c3QgYWxzbyBiZSB1bmRlZmluZWRcIlxuXHRcdFx0XHQpO1xuXHRcdFx0XHQvLyBub3RoaW5nIGdpdmVuLCBtYWtlIGxvY2FsIGRhdGV0aW1lXG5cdFx0XHRcdHRoaXMuX3pvbmUgPSBUaW1lWm9uZS5sb2NhbCgpO1xuXHRcdFx0XHR0aGlzLl91dGNEYXRlID0gVGltZVN0cnVjdC5mcm9tRGF0ZShEYXRlVGltZS50aW1lU291cmNlLm5vdygpLCBEYXRlRnVuY3Rpb25zLkdldFVUQyk7XG5cdFx0XHR9ICAgICAgICAgICAgICAgICBicmVhaztcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0aWYgKHRydWUpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJEYXRlVGltZS5EYXRlVGltZSgpOiB1bmV4cGVjdGVkIGZpcnN0IGFyZ3VtZW50IHR5cGUuXCIpO1xuXHRcdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gYSBjb3B5IG9mIHRoaXMgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgY2xvbmUoKTogRGF0ZVRpbWUge1xuXHRcdHJldHVybiBuZXcgRGF0ZVRpbWUodGhpcy56b25lRGF0ZSwgdGhpcy5fem9uZSk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiBUaGUgdGltZSB6b25lIHRoYXQgdGhlIGRhdGUgaXMgaW4uIE1heSBiZSB1bmRlZmluZWQgZm9yIHVuYXdhcmUgZGF0ZXMuXG5cdCAqL1xuXHRwdWJsaWMgem9uZSgpOiBUaW1lWm9uZSB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMuX3pvbmU7XG5cdH1cblxuXHQvKipcblx0ICogWm9uZSBuYW1lIGFiYnJldmlhdGlvbiBhdCB0aGlzIHRpbWVcblx0ICogQHBhcmFtIGRzdERlcGVuZGVudCAoZGVmYXVsdCB0cnVlKSBzZXQgdG8gZmFsc2UgZm9yIGEgRFNULWFnbm9zdGljIGFiYnJldmlhdGlvblxuXHQgKiBAcmV0dXJuIFRoZSBhYmJyZXZpYXRpb25cblx0ICovXG5cdHB1YmxpYyB6b25lQWJicmV2aWF0aW9uKGRzdERlcGVuZGVudDogYm9vbGVhbiA9IHRydWUpOiBzdHJpbmcge1xuXHRcdGlmICh0aGlzLl96b25lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fem9uZS5hYmJyZXZpYXRpb25Gb3JVdGModGhpcy51dGNEYXRlLCBkc3REZXBlbmRlbnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiB0aGUgb2Zmc2V0IGluY2x1ZGluZyBEU1Qgdy5yLnQuIFVUQyBpbiBtaW51dGVzLiBSZXR1cm5zIDAgZm9yIHVuYXdhcmUgZGF0ZXMgYW5kIGZvciBVVEMgZGF0ZXMuXG5cdCAqL1xuXHRwdWJsaWMgb2Zmc2V0KCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIE1hdGgucm91bmQoKHRoaXMuem9uZURhdGUudW5peE1pbGxpcyAtIHRoaXMudXRjRGF0ZS51bml4TWlsbGlzKSAvIDYwMDAwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHRoZSBvZmZzZXQgaW5jbHVkaW5nIERTVCB3LnIudC4gVVRDIGFzIGEgRHVyYXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgb2Zmc2V0RHVyYXRpb24oKTogRHVyYXRpb24ge1xuXHRcdHJldHVybiBEdXJhdGlvbi5taWxsaXNlY29uZHMoTWF0aC5yb3VuZCh0aGlzLnpvbmVEYXRlLnVuaXhNaWxsaXMgLSB0aGlzLnV0Y0RhdGUudW5peE1pbGxpcykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gdGhlIHN0YW5kYXJkIG9mZnNldCBXSVRIT1VUIERTVCB3LnIudC4gVVRDIGFzIGEgRHVyYXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgc3RhbmRhcmRPZmZzZXREdXJhdGlvbigpOiBEdXJhdGlvbiB7XG5cdFx0aWYgKHRoaXMuX3pvbmUpIHtcblx0XHRcdHJldHVybiBEdXJhdGlvbi5taW51dGVzKHRoaXMuX3pvbmUuc3RhbmRhcmRPZmZzZXRGb3JVdGModGhpcy51dGNEYXRlKSk7XG5cdFx0fVxuXHRcdHJldHVybiBEdXJhdGlvbi5taW51dGVzKDApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gVGhlIGZ1bGwgeWVhciBlLmcuIDIwMTRcblx0ICovXG5cdHB1YmxpYyB5ZWFyKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuem9uZURhdGUuY29tcG9uZW50cy55ZWFyO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gVGhlIG1vbnRoIDEtMTIgKG5vdGUgdGhpcyBkZXZpYXRlcyBmcm9tIEphdmFTY3JpcHQgRGF0ZSlcblx0ICovXG5cdHB1YmxpYyBtb250aCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLnpvbmVEYXRlLmNvbXBvbmVudHMubW9udGg7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiBUaGUgZGF5IG9mIHRoZSBtb250aCAxLTMxXG5cdCAqL1xuXHRwdWJsaWMgZGF5KCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuem9uZURhdGUuY29tcG9uZW50cy5kYXk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiBUaGUgaG91ciAwLTIzXG5cdCAqL1xuXHRwdWJsaWMgaG91cigpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLnpvbmVEYXRlLmNvbXBvbmVudHMuaG91cjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHRoZSBtaW51dGVzIDAtNTlcblx0ICovXG5cdHB1YmxpYyBtaW51dGUoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy56b25lRGF0ZS5jb21wb25lbnRzLm1pbnV0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHRoZSBzZWNvbmRzIDAtNTlcblx0ICovXG5cdHB1YmxpYyBzZWNvbmQoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy56b25lRGF0ZS5jb21wb25lbnRzLnNlY29uZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHRoZSBtaWxsaXNlY29uZHMgMC05OTlcblx0ICovXG5cdHB1YmxpYyBtaWxsaXNlY29uZCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLnpvbmVEYXRlLmNvbXBvbmVudHMubWlsbGk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiB0aGUgZGF5LW9mLXdlZWsgKHRoZSBlbnVtIHZhbHVlcyBjb3JyZXNwb25kIHRvIEphdmFTY3JpcHRcblx0ICogd2VlayBkYXkgbnVtYmVycylcblx0ICovXG5cdHB1YmxpYyB3ZWVrRGF5KCk6IFdlZWtEYXkge1xuXHRcdHJldHVybiBiYXNpY3Mud2Vla0RheU5vTGVhcFNlY3ModGhpcy56b25lRGF0ZS51bml4TWlsbGlzKSBhcyBXZWVrRGF5O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGRheSBudW1iZXIgd2l0aGluIHRoZSB5ZWFyOiBKYW4gMXN0IGhhcyBudW1iZXIgMCxcblx0ICogSmFuIDJuZCBoYXMgbnVtYmVyIDEgZXRjLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHRoZSBkYXktb2YteWVhciBbMC0zNjZdXG5cdCAqL1xuXHRwdWJsaWMgZGF5T2ZZZWFyKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuem9uZURhdGUueWVhckRheSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBJU08gODYwMSB3ZWVrIG51bWJlci4gV2VlayAxIGlzIHRoZSB3ZWVrXG5cdCAqIHRoYXQgaGFzIEphbnVhcnkgNHRoIGluIGl0LCBhbmQgaXQgc3RhcnRzIG9uIE1vbmRheS5cblx0ICogU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGVcblx0ICpcblx0ICogQHJldHVybiBXZWVrIG51bWJlciBbMS01M11cblx0ICovXG5cdHB1YmxpYyB3ZWVrTnVtYmVyKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIGJhc2ljcy53ZWVrTnVtYmVyKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCksIHRoaXMuZGF5KCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB3ZWVrIG9mIHRoaXMgbW9udGguIFRoZXJlIGlzIG5vIG9mZmljaWFsIHN0YW5kYXJkIGZvciB0aGlzLFxuXHQgKiBidXQgd2UgYXNzdW1lIHRoZSBzYW1lIHJ1bGVzIGZvciB0aGUgd2Vla051bWJlciAoaS5lLlxuXHQgKiB3ZWVrIDEgaXMgdGhlIHdlZWsgdGhhdCBoYXMgdGhlIDR0aCBkYXkgb2YgdGhlIG1vbnRoIGluIGl0KVxuXHQgKlxuXHQgKiBAcmV0dXJuIFdlZWsgbnVtYmVyIFsxLTVdXG5cdCAqL1xuXHRwdWJsaWMgd2Vla09mTW9udGgoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gYmFzaWNzLndlZWtPZk1vbnRoKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCksIHRoaXMuZGF5KCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzZWNvbmRzIHRoYXQgaGF2ZSBwYXNzZWQgb24gdGhlIGN1cnJlbnQgZGF5XG5cdCAqIERvZXMgbm90IGNvbnNpZGVyIGxlYXAgc2Vjb25kc1xuXHQgKlxuXHQgKiBAcmV0dXJuIHNlY29uZHMgWzAtODYzOTldXG5cdCAqL1xuXHRwdWJsaWMgc2Vjb25kT2ZEYXkoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gYmFzaWNzLnNlY29uZE9mRGF5KHRoaXMuaG91cigpLCB0aGlzLm1pbnV0ZSgpLCB0aGlzLnNlY29uZCgpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIE1pbGxpc2Vjb25kcyBzaW5jZSAxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFpcblx0ICovXG5cdHB1YmxpYyB1bml4VXRjTWlsbGlzKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMudXRjRGF0ZS51bml4TWlsbGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gVGhlIGZ1bGwgeWVhciBlLmcuIDIwMTRcblx0ICovXG5cdHB1YmxpYyB1dGNZZWFyKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMudXRjRGF0ZS5jb21wb25lbnRzLnllYXI7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiBUaGUgVVRDIG1vbnRoIDEtMTIgKG5vdGUgdGhpcyBkZXZpYXRlcyBmcm9tIEphdmFTY3JpcHQgRGF0ZSlcblx0ICovXG5cdHB1YmxpYyB1dGNNb250aCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLnV0Y0RhdGUuY29tcG9uZW50cy5tb250aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIFRoZSBVVEMgZGF5IG9mIHRoZSBtb250aCAxLTMxXG5cdCAqL1xuXHRwdWJsaWMgdXRjRGF5KCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMudXRjRGF0ZS5jb21wb25lbnRzLmRheTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIFRoZSBVVEMgaG91ciAwLTIzXG5cdCAqL1xuXHRwdWJsaWMgdXRjSG91cigpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLnV0Y0RhdGUuY29tcG9uZW50cy5ob3VyO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gVGhlIFVUQyBtaW51dGVzIDAtNTlcblx0ICovXG5cdHB1YmxpYyB1dGNNaW51dGUoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy51dGNEYXRlLmNvbXBvbmVudHMubWludXRlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gVGhlIFVUQyBzZWNvbmRzIDAtNTlcblx0ICovXG5cdHB1YmxpYyB1dGNTZWNvbmQoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy51dGNEYXRlLmNvbXBvbmVudHMuc2Vjb25kO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIFVUQyBkYXkgbnVtYmVyIHdpdGhpbiB0aGUgeWVhcjogSmFuIDFzdCBoYXMgbnVtYmVyIDAsXG5cdCAqIEphbiAybmQgaGFzIG51bWJlciAxIGV0Yy5cblx0ICpcblx0ICogQHJldHVybiB0aGUgZGF5LW9mLXllYXIgWzAtMzY2XVxuXHQgKi9cblx0cHVibGljIHV0Y0RheU9mWWVhcigpOiBudW1iZXIge1xuXHRcdHJldHVybiBiYXNpY3MuZGF5T2ZZZWFyKHRoaXMudXRjWWVhcigpLCB0aGlzLnV0Y01vbnRoKCksIHRoaXMudXRjRGF5KCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gVGhlIFVUQyBtaWxsaXNlY29uZHMgMC05OTlcblx0ICovXG5cdHB1YmxpYyB1dGNNaWxsaXNlY29uZCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLnV0Y0RhdGUuY29tcG9uZW50cy5taWxsaTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHRoZSBVVEMgZGF5LW9mLXdlZWsgKHRoZSBlbnVtIHZhbHVlcyBjb3JyZXNwb25kIHRvIEphdmFTY3JpcHRcblx0ICogd2VlayBkYXkgbnVtYmVycylcblx0ICovXG5cdHB1YmxpYyB1dGNXZWVrRGF5KCk6IFdlZWtEYXkge1xuXHRcdHJldHVybiBiYXNpY3Mud2Vla0RheU5vTGVhcFNlY3ModGhpcy51dGNEYXRlLnVuaXhNaWxsaXMpIGFzIFdlZWtEYXk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIElTTyA4NjAxIFVUQyB3ZWVrIG51bWJlci4gV2VlayAxIGlzIHRoZSB3ZWVrXG5cdCAqIHRoYXQgaGFzIEphbnVhcnkgNHRoIGluIGl0LCBhbmQgaXQgc3RhcnRzIG9uIE1vbmRheS5cblx0ICogU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGVcblx0ICpcblx0ICogQHJldHVybiBXZWVrIG51bWJlciBbMS01M11cblx0ICovXG5cdHB1YmxpYyB1dGNXZWVrTnVtYmVyKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIGJhc2ljcy53ZWVrTnVtYmVyKHRoaXMudXRjWWVhcigpLCB0aGlzLnV0Y01vbnRoKCksIHRoaXMudXRjRGF5KCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB3ZWVrIG9mIHRoaXMgbW9udGguIFRoZXJlIGlzIG5vIG9mZmljaWFsIHN0YW5kYXJkIGZvciB0aGlzLFxuXHQgKiBidXQgd2UgYXNzdW1lIHRoZSBzYW1lIHJ1bGVzIGZvciB0aGUgd2Vla051bWJlciAoaS5lLlxuXHQgKiB3ZWVrIDEgaXMgdGhlIHdlZWsgdGhhdCBoYXMgdGhlIDR0aCBkYXkgb2YgdGhlIG1vbnRoIGluIGl0KVxuXHQgKlxuXHQgKiBAcmV0dXJuIFdlZWsgbnVtYmVyIFsxLTVdXG5cdCAqL1xuXHRwdWJsaWMgdXRjV2Vla09mTW9udGgoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gYmFzaWNzLndlZWtPZk1vbnRoKHRoaXMudXRjWWVhcigpLCB0aGlzLnV0Y01vbnRoKCksIHRoaXMudXRjRGF5KCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzZWNvbmRzIHRoYXQgaGF2ZSBwYXNzZWQgb24gdGhlIGN1cnJlbnQgZGF5XG5cdCAqIERvZXMgbm90IGNvbnNpZGVyIGxlYXAgc2Vjb25kc1xuXHQgKlxuXHQgKiBAcmV0dXJuIHNlY29uZHMgWzAtODYzOTldXG5cdCAqL1xuXHRwdWJsaWMgdXRjU2Vjb25kT2ZEYXkoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gYmFzaWNzLnNlY29uZE9mRGF5KHRoaXMudXRjSG91cigpLCB0aGlzLnV0Y01pbnV0ZSgpLCB0aGlzLnV0Y1NlY29uZCgpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgbmV3IERhdGVUaW1lIHdoaWNoIGlzIHRoZSBkYXRlK3RpbWUgcmVpbnRlcnByZXRlZCBhc1xuXHQgKiBpbiB0aGUgbmV3IHpvbmUuIFNvIGUuZy4gMDg6MDAgQW1lcmljYS9DaGljYWdvIGNhbiBiZSBzZXQgdG8gMDg6MDAgRXVyb3BlL0JydXNzZWxzLlxuXHQgKiBObyBjb252ZXJzaW9uIGlzIGRvbmUsIHRoZSB2YWx1ZSBpcyBqdXN0IGFzc3VtZWQgdG8gYmUgaW4gYSBkaWZmZXJlbnQgem9uZS5cblx0ICogV29ya3MgZm9yIG5haXZlIGFuZCBhd2FyZSBkYXRlcy4gVGhlIG5ldyB6b25lIG1heSBiZSBudWxsLlxuXHQgKlxuXHQgKiBAcGFyYW0gem9uZSBUaGUgbmV3IHRpbWUgem9uZVxuXHQgKiBAcmV0dXJuIEEgbmV3IERhdGVUaW1lIHdpdGggdGhlIG9yaWdpbmFsIHRpbWVzdGFtcCBhbmQgdGhlIG5ldyB6b25lLlxuXHQgKi9cblx0cHVibGljIHdpdGhab25lKHpvbmU/OiBUaW1lWm9uZSB8IG51bGwgfCB1bmRlZmluZWQpOiBEYXRlVGltZSB7XG5cdFx0cmV0dXJuIG5ldyBEYXRlVGltZShcblx0XHRcdHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCksIHRoaXMuZGF5KCksXG5cdFx0XHR0aGlzLmhvdXIoKSwgdGhpcy5taW51dGUoKSwgdGhpcy5zZWNvbmQoKSwgdGhpcy5taWxsaXNlY29uZCgpLFxuXHRcdFx0em9uZVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydCB0aGlzIGRhdGUgdG8gdGhlIGdpdmVuIHRpbWUgem9uZSAoaW4tcGxhY2UpLlxuXHQgKiBUaHJvd3MgaWYgdGhpcyBkYXRlIGRvZXMgbm90IGhhdmUgYSB0aW1lIHpvbmUuXG5cdCAqIEByZXR1cm4gdGhpcyAoZm9yIGNoYWluaW5nKVxuXHQgKi9cblx0cHVibGljIGNvbnZlcnQoem9uZT86IFRpbWVab25lIHwgbnVsbCB8IHVuZGVmaW5lZCk6IERhdGVUaW1lIHtcblx0XHRpZiAoem9uZSkge1xuXHRcdFx0aWYgKCF0aGlzLl96b25lKSB7IC8vIGlmLXN0YXRlbWVudCBzYXRpc2ZpZXMgdGhlIGNvbXBpbGVyXG5cdFx0XHRcdGFzc2VydCh0aGlzLl96b25lLCBcIkRhdGVUaW1lLnRvWm9uZSgpOiBDYW5ub3QgY29udmVydCB1bmF3YXJlIGRhdGUgdG8gYW4gYXdhcmUgZGF0ZVwiKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fem9uZS5lcXVhbHMoem9uZSkpIHtcblx0XHRcdFx0dGhpcy5fem9uZSA9IHpvbmU7IC8vIHN0aWxsIGFzc2lnbiwgYmVjYXVzZSB6b25lcyBtYXkgYmUgZXF1YWwgYnV0IG5vdCBpZGVudGljYWwgKFVUQy9HTVQvKzAwKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCF0aGlzLl91dGNEYXRlKSB7XG5cdFx0XHRcdFx0dGhpcy5fdXRjRGF0ZSA9IGNvbnZlcnRUb1V0Yyh0aGlzLl96b25lRGF0ZSBhcyBUaW1lU3RydWN0LCB0aGlzLl96b25lKTsgLy8gY2F1c2Ugem9uZSAtPiB1dGMgY29udmVyc2lvblxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3pvbmUgPSB6b25lO1xuXHRcdFx0XHR0aGlzLl96b25lRGF0ZSA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCF0aGlzLl96b25lKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0aGlzLl96b25lRGF0ZSkge1xuXHRcdFx0XHR0aGlzLl96b25lRGF0ZSA9IGNvbnZlcnRGcm9tVXRjKHRoaXMuX3V0Y0RhdGUgYXMgVGltZVN0cnVjdCwgdGhpcy5fem9uZSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl96b25lID0gdW5kZWZpbmVkO1xuXHRcdFx0dGhpcy5fdXRjRGF0ZSA9IHVuZGVmaW5lZDsgLy8gY2F1c2UgbGF0ZXIgem9uZSAtPiB1dGMgY29udmVyc2lvblxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoaXMgZGF0ZSBjb252ZXJ0ZWQgdG8gdGhlIGdpdmVuIHRpbWUgem9uZS5cblx0ICogVW5hd2FyZSBkYXRlcyBjYW4gb25seSBiZSBjb252ZXJ0ZWQgdG8gdW5hd2FyZSBkYXRlcyAoY2xvbmUpXG5cdCAqIENvbnZlcnRpbmcgYW4gdW5hd2FyZSBkYXRlIHRvIGFuIGF3YXJlIGRhdGUgdGhyb3dzIGFuIGV4Y2VwdGlvbi4gVXNlIHRoZSBjb25zdHJ1Y3RvclxuXHQgKiBpZiB5b3UgcmVhbGx5IG5lZWQgdG8gZG8gdGhhdC5cblx0ICpcblx0ICogQHBhcmFtIHpvbmVcdFRoZSBuZXcgdGltZSB6b25lLiBUaGlzIG1heSBiZSBudWxsIG9yIHVuZGVmaW5lZCB0byBjcmVhdGUgdW5hd2FyZSBkYXRlLlxuXHQgKiBAcmV0dXJuIFRoZSBjb252ZXJ0ZWQgZGF0ZVxuXHQgKi9cblx0cHVibGljIHRvWm9uZSh6b25lPzogVGltZVpvbmUgfCBudWxsIHwgdW5kZWZpbmVkKTogRGF0ZVRpbWUge1xuXHRcdGlmICh6b25lKSB7XG5cdFx0XHRhc3NlcnQodGhpcy5fem9uZSwgXCJEYXRlVGltZS50b1pvbmUoKTogQ2Fubm90IGNvbnZlcnQgdW5hd2FyZSBkYXRlIHRvIGFuIGF3YXJlIGRhdGVcIik7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBuZXcgRGF0ZVRpbWUoKTtcblx0XHRcdHJlc3VsdC51dGNEYXRlID0gdGhpcy51dGNEYXRlO1xuXHRcdFx0cmVzdWx0Ll96b25lID0gem9uZTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBuZXcgRGF0ZVRpbWUodGhpcy56b25lRGF0ZSwgdW5kZWZpbmVkKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydCB0byBKYXZhU2NyaXB0IGRhdGUgd2l0aCB0aGUgem9uZSB0aW1lIGluIHRoZSBnZXRYKCkgbWV0aG9kcy5cblx0ICogVW5sZXNzIHRoZSB0aW1lem9uZSBpcyBsb2NhbCwgdGhlIERhdGUuZ2V0VVRDWCgpIG1ldGhvZHMgd2lsbCBOT1QgYmUgY29ycmVjdC5cblx0ICogVGhpcyBpcyBiZWNhdXNlIERhdGUgY2FsY3VsYXRlcyBnZXRVVENYKCkgZnJvbSBnZXRYKCkgYXBwbHlpbmcgbG9jYWwgdGltZSB6b25lLlxuXHQgKi9cblx0cHVibGljIHRvRGF0ZSgpOiBEYXRlIHtcblx0XHRyZXR1cm4gbmV3IERhdGUoXG5cdFx0XHR0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpIC0gMSwgdGhpcy5kYXkoKSxcblx0XHRcdHRoaXMuaG91cigpLCB0aGlzLm1pbnV0ZSgpLCB0aGlzLnNlY29uZCgpLCB0aGlzLm1pbGxpc2Vjb25kKClcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBFeGNlbCB0aW1lc3RhbXAgZm9yIHRoaXMgZGF0ZXRpbWUgY29udmVydGVkIHRvIHRoZSBnaXZlbiB6b25lLlxuXHQgKiBEb2VzIG5vdCB3b3JrIGZvciBkYXRlcyA8IDE5MDBcblx0ICogQHBhcmFtIHRpbWVab25lIE9wdGlvbmFsLiBab25lIHRvIGNvbnZlcnQgdG8sIGRlZmF1bHQgdGhlIHpvbmUgdGhlIGRhdGV0aW1lIGlzIGFscmVhZHkgaW4uXG5cdCAqIEByZXR1cm4gYW4gRXhjZWwgZGF0ZS90aW1lIG51bWJlciBpLmUuIGRheXMgc2luY2UgMS0xLTE5MDAgd2hlcmUgMTkwMCBpcyBpbmNvcnJlY3RseSBzZWVuIGFzIGxlYXAgeWVhclxuXHQgKi9cblx0cHVibGljIHRvRXhjZWwodGltZVpvbmU/OiBUaW1lWm9uZSB8IG51bGwgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuXHRcdGxldCBkdDogRGF0ZVRpbWUgPSB0aGlzO1xuXHRcdGlmICh0aW1lWm9uZSAmJiAoIXRoaXMuX3pvbmUgfHwgIXRpbWVab25lLmVxdWFscyh0aGlzLl96b25lKSkpIHtcblx0XHRcdGR0ID0gdGhpcy50b1pvbmUodGltZVpvbmUpO1xuXHRcdH1cblx0XHRjb25zdCBvZmZzZXRNaWxsaXMgPSBkdC5vZmZzZXQoKSAqIDYwICogMTAwMDtcblx0XHRjb25zdCB1bml4VGltZXN0YW1wID0gZHQudW5peFV0Y01pbGxpcygpO1xuXHRcdHJldHVybiB0aGlzLl91bml4VGltZVN0YW1wVG9FeGNlbCh1bml4VGltZXN0YW1wICsgb2Zmc2V0TWlsbGlzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gRXhjZWwgdGltZXN0YW1wIGZvciB0aGlzIGRhdGV0aW1lIGNvbnZlcnRlZCB0byBVVENcblx0ICogRG9lcyBub3Qgd29yayBmb3IgZGF0ZXMgPCAxOTAwXG5cdCAqIEByZXR1cm4gYW4gRXhjZWwgZGF0ZS90aW1lIG51bWJlciBpLmUuIGRheXMgc2luY2UgMS0xLTE5MDAgd2hlcmUgMTkwMCBpcyBpbmNvcnJlY3RseSBzZWVuIGFzIGxlYXAgeWVhclxuXHQgKi9cblx0cHVibGljIHRvVXRjRXhjZWwoKTogbnVtYmVyIHtcblx0XHRjb25zdCB1bml4VGltZXN0YW1wID0gdGhpcy51bml4VXRjTWlsbGlzKCk7XG5cdFx0cmV0dXJuIHRoaXMuX3VuaXhUaW1lU3RhbXBUb0V4Y2VsKHVuaXhUaW1lc3RhbXApO1xuXHR9XG5cblx0cHJpdmF0ZSBfdW5peFRpbWVTdGFtcFRvRXhjZWwobjogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRjb25zdCByZXN1bHQgPSAoKG4pIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApKSArIDI1NTY5O1xuXHRcdC8vIHJvdW5kIHRvIG5lYXJlc3QgbWlsbGlzZWNvbmRcblx0XHRjb25zdCBtc2VjcyA9IHJlc3VsdCAvICgxIC8gODY0MDAwMDApO1xuXHRcdHJldHVybiBNYXRoLnJvdW5kKG1zZWNzKSAqICgxIC8gODY0MDAwMDApO1xuXHR9XG5cblxuXHQvKipcblx0ICogQWRkIGEgdGltZSBkdXJhdGlvbiByZWxhdGl2ZSB0byBVVEMuIFJldHVybnMgYSBuZXcgRGF0ZVRpbWVcblx0ICogQHJldHVybiB0aGlzICsgZHVyYXRpb25cblx0ICovXG5cdHB1YmxpYyBhZGQoZHVyYXRpb246IER1cmF0aW9uKTogRGF0ZVRpbWU7XG5cdC8qKlxuXHQgKiBBZGQgYW4gYW1vdW50IG9mIHRpbWUgcmVsYXRpdmUgdG8gVVRDLCBhcyByZWd1bGFybHkgYXMgcG9zc2libGUuIFJldHVybnMgYSBuZXcgRGF0ZVRpbWVcblx0ICpcblx0ICogQWRkaW5nIGUuZy4gMSBob3VyIHdpbGwgaW5jcmVtZW50IHRoZSB1dGNIb3VyKCkgZmllbGQsIGFkZGluZyAxIG1vbnRoXG5cdCAqIGluY3JlbWVudHMgdGhlIHV0Y01vbnRoKCkgZmllbGQuXG5cdCAqIEFkZGluZyBhbiBhbW91bnQgb2YgdW5pdHMgbGVhdmVzIGxvd2VyIHVuaXRzIGludGFjdC4gRS5nLlxuXHQgKiBhZGRpbmcgYSBtb250aCB3aWxsIGxlYXZlIHRoZSBkYXkoKSBmaWVsZCB1bnRvdWNoZWQgaWYgcG9zc2libGUuXG5cdCAqXG5cdCAqIE5vdGUgYWRkaW5nIE1vbnRocyBvciBZZWFycyB3aWxsIGNsYW1wIHRoZSBkYXRlIHRvIHRoZSBlbmQtb2YtbW9udGggaWZcblx0ICogdGhlIHN0YXJ0IGRhdGUgd2FzIGF0IHRoZSBlbmQgb2YgYSBtb250aCwgaS5lLiBjb250cmFyeSB0byBKYXZhU2NyaXB0XG5cdCAqIERhdGUjc2V0VVRDTW9udGgoKSBpdCB3aWxsIG5vdCBvdmVyZmxvdyBpbnRvIHRoZSBuZXh0IG1vbnRoXG5cdCAqXG5cdCAqIEluIGNhc2Ugb2YgRFNUIGNoYW5nZXMsIHRoZSB1dGMgdGltZSBmaWVsZHMgYXJlIHN0aWxsIHVudG91Y2hlZCBidXQgbG9jYWxcblx0ICogdGltZSBmaWVsZHMgbWF5IHNoaWZ0LlxuXHQgKi9cblx0cHVibGljIGFkZChhbW91bnQ6IG51bWJlciwgdW5pdDogVGltZVVuaXQpOiBEYXRlVGltZTtcblx0LyoqXG5cdCAqIEltcGxlbWVudGF0aW9uLlxuXHQgKi9cblx0cHVibGljIGFkZChhMTogYW55LCB1bml0PzogVGltZVVuaXQpOiBEYXRlVGltZSB7XG5cdFx0bGV0IGFtb3VudDogbnVtYmVyO1xuXHRcdGxldCB1OiBUaW1lVW5pdDtcblx0XHRpZiAodHlwZW9mIChhMSkgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdGNvbnN0IGR1cmF0aW9uOiBEdXJhdGlvbiA9IChhMSkgYXMgRHVyYXRpb247XG5cdFx0XHRhbW91bnQgPSBkdXJhdGlvbi5hbW91bnQoKTtcblx0XHRcdHUgPSBkdXJhdGlvbi51bml0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFzc2VydCh0eXBlb2YgKGExKSA9PT0gXCJudW1iZXJcIiwgXCJleHBlY3QgbnVtYmVyIGFzIGZpcnN0IGFyZ3VtZW50XCIpO1xuXHRcdFx0YXNzZXJ0KHR5cGVvZiAodW5pdCkgPT09IFwibnVtYmVyXCIsIFwiZXhwZWN0IG51bWJlciBhcyBzZWNvbmQgYXJndW1lbnRcIik7XG5cdFx0XHRhbW91bnQgPSAoYTEpIGFzIG51bWJlcjtcblx0XHRcdHUgPSB1bml0IGFzIFRpbWVVbml0O1xuXHRcdH1cblx0XHRjb25zdCB1dGNUbSA9IHRoaXMuX2FkZFRvVGltZVN0cnVjdCh0aGlzLnV0Y0RhdGUsIGFtb3VudCwgdSk7XG5cdFx0cmV0dXJuIG5ldyBEYXRlVGltZSh1dGNUbSwgVGltZVpvbmUudXRjKCkpLnRvWm9uZSh0aGlzLl96b25lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYW4gYW1vdW50IG9mIHRpbWUgdG8gdGhlIHpvbmUgdGltZSwgYXMgcmVndWxhcmx5IGFzIHBvc3NpYmxlLiBSZXR1cm5zIGEgbmV3IERhdGVUaW1lXG5cdCAqXG5cdCAqIEFkZGluZyBlLmcuIDEgaG91ciB3aWxsIGluY3JlbWVudCB0aGUgaG91cigpIGZpZWxkIG9mIHRoZSB6b25lXG5cdCAqIGRhdGUgYnkgb25lLiBJbiBjYXNlIG9mIERTVCBjaGFuZ2VzLCB0aGUgdGltZSBmaWVsZHMgbWF5IGFkZGl0aW9uYWxseVxuXHQgKiBpbmNyZWFzZSBieSB0aGUgRFNUIG9mZnNldCwgaWYgYSBub24tZXhpc3RpbmcgbG9jYWwgdGltZSB3b3VsZFxuXHQgKiBiZSByZWFjaGVkIG90aGVyd2lzZS5cblx0ICpcblx0ICogQWRkaW5nIGEgdW5pdCBvZiB0aW1lIHdpbGwgbGVhdmUgbG93ZXItdW5pdCBmaWVsZHMgaW50YWN0LCB1bmxlc3MgdGhlIHJlc3VsdFxuXHQgKiB3b3VsZCBiZSBhIG5vbi1leGlzdGluZyB0aW1lLiBUaGVuIGFuIGV4dHJhIERTVCBvZmZzZXQgaXMgYWRkZWQuXG5cdCAqXG5cdCAqIE5vdGUgYWRkaW5nIE1vbnRocyBvciBZZWFycyB3aWxsIGNsYW1wIHRoZSBkYXRlIHRvIHRoZSBlbmQtb2YtbW9udGggaWZcblx0ICogdGhlIHN0YXJ0IGRhdGUgd2FzIGF0IHRoZSBlbmQgb2YgYSBtb250aCwgaS5lLiBjb250cmFyeSB0byBKYXZhU2NyaXB0XG5cdCAqIERhdGUjc2V0VVRDTW9udGgoKSBpdCB3aWxsIG5vdCBvdmVyZmxvdyBpbnRvIHRoZSBuZXh0IG1vbnRoXG5cdCAqL1xuXHRwdWJsaWMgYWRkTG9jYWwoZHVyYXRpb246IER1cmF0aW9uKTogRGF0ZVRpbWU7XG5cdHB1YmxpYyBhZGRMb2NhbChhbW91bnQ6IG51bWJlciwgdW5pdDogVGltZVVuaXQpOiBEYXRlVGltZTtcblx0cHVibGljIGFkZExvY2FsKGExOiBhbnksIHVuaXQ/OiBUaW1lVW5pdCk6IERhdGVUaW1lIHtcblx0XHRsZXQgYW1vdW50OiBudW1iZXI7XG5cdFx0bGV0IHU6IFRpbWVVbml0O1xuXHRcdGlmICh0eXBlb2YgKGExKSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0Y29uc3QgZHVyYXRpb246IER1cmF0aW9uID0gKGExKSBhcyBEdXJhdGlvbjtcblx0XHRcdGFtb3VudCA9IGR1cmF0aW9uLmFtb3VudCgpO1xuXHRcdFx0dSA9IGR1cmF0aW9uLnVuaXQoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXNzZXJ0KHR5cGVvZiAoYTEpID09PSBcIm51bWJlclwiLCBcImV4cGVjdCBudW1iZXIgYXMgZmlyc3QgYXJndW1lbnRcIik7XG5cdFx0XHRhc3NlcnQodHlwZW9mICh1bml0KSA9PT0gXCJudW1iZXJcIiwgXCJleHBlY3QgbnVtYmVyIGFzIHNlY29uZCBhcmd1bWVudFwiKTtcblx0XHRcdGFtb3VudCA9IChhMSkgYXMgbnVtYmVyO1xuXHRcdFx0dSA9IHVuaXQgYXMgVGltZVVuaXQ7XG5cdFx0fVxuXHRcdGNvbnN0IGxvY2FsVG0gPSB0aGlzLl9hZGRUb1RpbWVTdHJ1Y3QodGhpcy56b25lRGF0ZSwgYW1vdW50LCB1KTtcblx0XHRpZiAodGhpcy5fem9uZSkge1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9uOiBOb3JtYWxpemVPcHRpb24gPSAoYW1vdW50ID49IDAgPyBOb3JtYWxpemVPcHRpb24uVXAgOiBOb3JtYWxpemVPcHRpb24uRG93bik7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkID0gdGhpcy5fem9uZS5ub3JtYWxpemVab25lVGltZShsb2NhbFRtLCBkaXJlY3Rpb24pO1xuXHRcdFx0cmV0dXJuIG5ldyBEYXRlVGltZShub3JtYWxpemVkLCB0aGlzLl96b25lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG5ldyBEYXRlVGltZShsb2NhbFRtLCB1bmRlZmluZWQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYW4gYW1vdW50IG9mIHRpbWUgdG8gdGhlIGdpdmVuIHRpbWUgc3RydWN0LiBOb3RlOiBkb2VzIG5vdCBub3JtYWxpemUuXG5cdCAqIEtlZXBzIGxvd2VyIHVuaXQgZmllbGRzIHRoZSBzYW1lIHdoZXJlIHBvc3NpYmxlLCBjbGFtcHMgZGF5IHRvIGVuZC1vZi1tb250aCBpZlxuXHQgKiBuZWNlc3NhcnkuXG5cdCAqL1xuXHRwcml2YXRlIF9hZGRUb1RpbWVTdHJ1Y3QodG06IFRpbWVTdHJ1Y3QsIGFtb3VudDogbnVtYmVyLCB1bml0OiBUaW1lVW5pdCk6IFRpbWVTdHJ1Y3Qge1xuXHRcdGxldCB5ZWFyOiBudW1iZXI7XG5cdFx0bGV0IG1vbnRoOiBudW1iZXI7XG5cdFx0bGV0IGRheTogbnVtYmVyO1xuXHRcdGxldCBob3VyOiBudW1iZXI7XG5cdFx0bGV0IG1pbnV0ZTogbnVtYmVyO1xuXHRcdGxldCBzZWNvbmQ6IG51bWJlcjtcblx0XHRsZXQgbWlsbGk6IG51bWJlcjtcblxuXHRcdHN3aXRjaCAodW5pdCkge1xuXHRcdFx0Y2FzZSBUaW1lVW5pdC5NaWxsaXNlY29uZDpcblx0XHRcdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KG1hdGgucm91bmRTeW0odG0udW5peE1pbGxpcyArIGFtb3VudCkpO1xuXHRcdFx0Y2FzZSBUaW1lVW5pdC5TZWNvbmQ6XG5cdFx0XHRcdHJldHVybiBuZXcgVGltZVN0cnVjdChtYXRoLnJvdW5kU3ltKHRtLnVuaXhNaWxsaXMgKyBhbW91bnQgKiAxMDAwKSk7XG5cdFx0XHRjYXNlIFRpbWVVbml0Lk1pbnV0ZTpcblx0XHRcdFx0Ly8gdG9kbyBtb3JlIGludGVsbGlnZW50IGFwcHJvYWNoIG5lZWRlZCB3aGVuIGltcGxlbWVudGluZyBsZWFwIHNlY29uZHNcblx0XHRcdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KG1hdGgucm91bmRTeW0odG0udW5peE1pbGxpcyArIGFtb3VudCAqIDYwMDAwKSk7XG5cdFx0XHRjYXNlIFRpbWVVbml0LkhvdXI6XG5cdFx0XHRcdC8vIHRvZG8gbW9yZSBpbnRlbGxpZ2VudCBhcHByb2FjaCBuZWVkZWQgd2hlbiBpbXBsZW1lbnRpbmcgbGVhcCBzZWNvbmRzXG5cdFx0XHRcdHJldHVybiBuZXcgVGltZVN0cnVjdChtYXRoLnJvdW5kU3ltKHRtLnVuaXhNaWxsaXMgKyBhbW91bnQgKiAzNjAwMDAwKSk7XG5cdFx0XHRjYXNlIFRpbWVVbml0LkRheTpcblx0XHRcdFx0Ly8gdG9kbyBtb3JlIGludGVsbGlnZW50IGFwcHJvYWNoIG5lZWRlZCB3aGVuIGltcGxlbWVudGluZyBsZWFwIHNlY29uZHNcblx0XHRcdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KG1hdGgucm91bmRTeW0odG0udW5peE1pbGxpcyArIGFtb3VudCAqIDg2NDAwMDAwKSk7XG5cdFx0XHRjYXNlIFRpbWVVbml0LldlZWs6XG5cdFx0XHRcdC8vIHRvZG8gbW9yZSBpbnRlbGxpZ2VudCBhcHByb2FjaCBuZWVkZWQgd2hlbiBpbXBsZW1lbnRpbmcgbGVhcCBzZWNvbmRzXG5cdFx0XHRcdHJldHVybiBuZXcgVGltZVN0cnVjdChtYXRoLnJvdW5kU3ltKHRtLnVuaXhNaWxsaXMgKyBhbW91bnQgKiA3ICogODY0MDAwMDApKTtcblx0XHRcdGNhc2UgVGltZVVuaXQuTW9udGg6IHtcblx0XHRcdFx0YXNzZXJ0KG1hdGguaXNJbnQoYW1vdW50KSwgXCJDYW5ub3QgYWRkL3N1YiBhIG5vbi1pbnRlZ2VyIGFtb3VudCBvZiBtb250aHNcIik7XG5cdFx0XHRcdC8vIGtlZXAgdGhlIGRheS1vZi1tb250aCB0aGUgc2FtZSAoY2xhbXAgdG8gZW5kLW9mLW1vbnRoKVxuXHRcdFx0XHRpZiAoYW1vdW50ID49IDApIHtcblx0XHRcdFx0XHR5ZWFyID0gdG0uY29tcG9uZW50cy55ZWFyICsgTWF0aC5jZWlsKChhbW91bnQgLSAoMTIgLSB0bS5jb21wb25lbnRzLm1vbnRoKSkgLyAxMik7XG5cdFx0XHRcdFx0bW9udGggPSAxICsgbWF0aC5wb3NpdGl2ZU1vZHVsbygodG0uY29tcG9uZW50cy5tb250aCAtIDEgKyBNYXRoLmZsb29yKGFtb3VudCkpLCAxMik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0eWVhciA9IHRtLmNvbXBvbmVudHMueWVhciArIE1hdGguZmxvb3IoKGFtb3VudCArICh0bS5jb21wb25lbnRzLm1vbnRoIC0gMSkpIC8gMTIpO1xuXHRcdFx0XHRcdG1vbnRoID0gMSArIG1hdGgucG9zaXRpdmVNb2R1bG8oKHRtLmNvbXBvbmVudHMubW9udGggLSAxICsgTWF0aC5jZWlsKGFtb3VudCkpLCAxMik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGF5ID0gTWF0aC5taW4odG0uY29tcG9uZW50cy5kYXksIGJhc2ljcy5kYXlzSW5Nb250aCh5ZWFyLCBtb250aCkpO1xuXHRcdFx0XHRob3VyID0gdG0uY29tcG9uZW50cy5ob3VyO1xuXHRcdFx0XHRtaW51dGUgPSB0bS5jb21wb25lbnRzLm1pbnV0ZTtcblx0XHRcdFx0c2Vjb25kID0gdG0uY29tcG9uZW50cy5zZWNvbmQ7XG5cdFx0XHRcdG1pbGxpID0gdG0uY29tcG9uZW50cy5taWxsaTtcblx0XHRcdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KHsgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpIH0pO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBUaW1lVW5pdC5ZZWFyOiB7XG5cdFx0XHRcdGFzc2VydChtYXRoLmlzSW50KGFtb3VudCksIFwiQ2Fubm90IGFkZC9zdWIgYSBub24taW50ZWdlciBhbW91bnQgb2YgeWVhcnNcIik7XG5cdFx0XHRcdHllYXIgPSB0bS5jb21wb25lbnRzLnllYXIgKyBhbW91bnQ7XG5cdFx0XHRcdG1vbnRoID0gdG0uY29tcG9uZW50cy5tb250aDtcblx0XHRcdFx0ZGF5ID0gTWF0aC5taW4odG0uY29tcG9uZW50cy5kYXksIGJhc2ljcy5kYXlzSW5Nb250aCh5ZWFyLCBtb250aCkpO1xuXHRcdFx0XHRob3VyID0gdG0uY29tcG9uZW50cy5ob3VyO1xuXHRcdFx0XHRtaW51dGUgPSB0bS5jb21wb25lbnRzLm1pbnV0ZTtcblx0XHRcdFx0c2Vjb25kID0gdG0uY29tcG9uZW50cy5zZWNvbmQ7XG5cdFx0XHRcdG1pbGxpID0gdG0uY29tcG9uZW50cy5taWxsaTtcblx0XHRcdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KHsgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpIH0pO1xuXHRcdFx0fVxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gcGVyaW9kIHVuaXQuXCIpO1xuXHRcdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNhbWUgYXMgYWRkKC0xKmR1cmF0aW9uKTsgUmV0dXJucyBhIG5ldyBEYXRlVGltZVxuXHQgKi9cblx0cHVibGljIHN1YihkdXJhdGlvbjogRHVyYXRpb24pOiBEYXRlVGltZTtcblx0LyoqXG5cdCAqIFNhbWUgYXMgYWRkKC0xKmFtb3VudCwgdW5pdCk7IFJldHVybnMgYSBuZXcgRGF0ZVRpbWVcblx0ICovXG5cdHB1YmxpYyBzdWIoYW1vdW50OiBudW1iZXIsIHVuaXQ6IFRpbWVVbml0KTogRGF0ZVRpbWU7XG5cdHB1YmxpYyBzdWIoYTE6IG51bWJlciB8IER1cmF0aW9uLCB1bml0PzogVGltZVVuaXQpOiBEYXRlVGltZSB7XG5cdFx0aWYgKHR5cGVvZiBhMSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0YXNzZXJ0KHR5cGVvZiB1bml0ID09PSBcIm51bWJlclwiLCBcImV4cGVjdCBudW1iZXIgYXMgc2Vjb25kIGFyZ3VtZW50XCIpO1xuXHRcdFx0Y29uc3QgYW1vdW50OiBudW1iZXIgPSBhMSBhcyBudW1iZXI7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQoLTEgKiBhbW91bnQsIHVuaXQgYXMgVGltZVVuaXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBkdXJhdGlvbjogRHVyYXRpb24gPSBhMSBhcyBEdXJhdGlvbjtcblx0XHRcdHJldHVybiB0aGlzLmFkZChkdXJhdGlvbi5tdWx0aXBseSgtMSkpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTYW1lIGFzIGFkZExvY2FsKC0xKmFtb3VudCwgdW5pdCk7IFJldHVybnMgYSBuZXcgRGF0ZVRpbWVcblx0ICovXG5cdHB1YmxpYyBzdWJMb2NhbChkdXJhdGlvbjogRHVyYXRpb24pOiBEYXRlVGltZTtcblx0cHVibGljIHN1YkxvY2FsKGFtb3VudDogbnVtYmVyLCB1bml0OiBUaW1lVW5pdCk6IERhdGVUaW1lO1xuXHRwdWJsaWMgc3ViTG9jYWwoYTE6IGFueSwgdW5pdD86IFRpbWVVbml0KTogRGF0ZVRpbWUge1xuXHRcdGlmICh0eXBlb2YgYTEgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZExvY2FsKChhMSBhcyBEdXJhdGlvbikubXVsdGlwbHkoLTEpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuYWRkTG9jYWwoLTEgKiBhMSBhcyBudW1iZXIsIHVuaXQgYXMgVGltZVVuaXQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaW1lIGRpZmZlcmVuY2UgYmV0d2VlbiB0d28gRGF0ZVRpbWVzXG5cdCAqIEByZXR1cm4gdGhpcyAtIG90aGVyXG5cdCAqL1xuXHRwdWJsaWMgZGlmZihvdGhlcjogRGF0ZVRpbWUpOiBEdXJhdGlvbiB7XG5cdFx0cmV0dXJuIG5ldyBEdXJhdGlvbih0aGlzLnV0Y0RhdGUudW5peE1pbGxpcyAtIG90aGVyLnV0Y0RhdGUudW5peE1pbGxpcyk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hvcHMgb2ZmIHRoZSB0aW1lIHBhcnQsIHlpZWxkcyB0aGUgc2FtZSBkYXRlIGF0IDAwOjAwOjAwLjAwMFxuXHQgKiBAcmV0dXJuIGEgbmV3IERhdGVUaW1lXG5cdCAqL1xuXHRwdWJsaWMgc3RhcnRPZkRheSgpOiBEYXRlVGltZSB7XG5cdFx0cmV0dXJuIG5ldyBEYXRlVGltZSh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpLCB0aGlzLmRheSgpLCAwLCAwLCAwLCAwLCB0aGlzLnpvbmUoKSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgZmlyc3QgZGF5IG9mIHRoZSBtb250aCBhdCAwMDowMDowMFxuXHQgKiBAcmV0dXJuIGEgbmV3IERhdGVUaW1lXG5cdCAqL1xuXHRwdWJsaWMgc3RhcnRPZk1vbnRoKCk6IERhdGVUaW1lIHtcblx0XHRyZXR1cm4gbmV3IERhdGVUaW1lKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCksIDEsIDAsIDAsIDAsIDAsIHRoaXMuem9uZSgpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHllYXIgYXQgMDA6MDA6MDBcblx0ICogQHJldHVybiBhIG5ldyBEYXRlVGltZVxuXHQgKi9cblx0cHVibGljIHN0YXJ0T2ZZZWFyKCk6IERhdGVUaW1lIHtcblx0XHRyZXR1cm4gbmV3IERhdGVUaW1lKHRoaXMueWVhcigpLCAxLCAxLCAwLCAwLCAwLCAwLCB0aGlzLnpvbmUoKSk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiBUcnVlIGlmZiAodGhpcyA8IG90aGVyKVxuXHQgKi9cblx0cHVibGljIGxlc3NUaGFuKG90aGVyOiBEYXRlVGltZSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLnV0Y0RhdGUudW5peE1pbGxpcyA8IG90aGVyLnV0Y0RhdGUudW5peE1pbGxpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIFRydWUgaWZmICh0aGlzIDw9IG90aGVyKVxuXHQgKi9cblx0cHVibGljIGxlc3NFcXVhbChvdGhlcjogRGF0ZVRpbWUpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy51dGNEYXRlLnVuaXhNaWxsaXMgPD0gb3RoZXIudXRjRGF0ZS51bml4TWlsbGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gVHJ1ZSBpZmYgdGhpcyBhbmQgb3RoZXIgcmVwcmVzZW50IHRoZSBzYW1lIG1vbWVudCBpbiB0aW1lIGluIFVUQ1xuXHQgKi9cblx0cHVibGljIGVxdWFscyhvdGhlcjogRGF0ZVRpbWUpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy51dGNEYXRlLmVxdWFscyhvdGhlci51dGNEYXRlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIFRydWUgaWZmIHRoaXMgYW5kIG90aGVyIHJlcHJlc2VudCB0aGUgc2FtZSB0aW1lIGFuZCB0aGUgc2FtZSB6b25lXG5cdCAqL1xuXHRwdWJsaWMgaWRlbnRpY2FsKG90aGVyOiBEYXRlVGltZSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAhISh0aGlzLnpvbmVEYXRlLmVxdWFscyhvdGhlci56b25lRGF0ZSlcblx0XHRcdCYmICghdGhpcy5fem9uZSkgPT09ICghb3RoZXIuX3pvbmUpXG5cdFx0XHQmJiAoKCF0aGlzLl96b25lICYmICFvdGhlci5fem9uZSkgfHwgKHRoaXMuX3pvbmUgJiYgb3RoZXIuX3pvbmUgJiYgdGhpcy5fem9uZS5pZGVudGljYWwob3RoZXIuX3pvbmUpKSlcblx0XHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiBUcnVlIGlmZiB0aGlzID4gb3RoZXJcblx0ICovXG5cdHB1YmxpYyBncmVhdGVyVGhhbihvdGhlcjogRGF0ZVRpbWUpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy51dGNEYXRlLnVuaXhNaWxsaXMgPiBvdGhlci51dGNEYXRlLnVuaXhNaWxsaXM7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiBUcnVlIGlmZiB0aGlzID49IG90aGVyXG5cdCAqL1xuXHRwdWJsaWMgZ3JlYXRlckVxdWFsKG90aGVyOiBEYXRlVGltZSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLnV0Y0RhdGUudW5peE1pbGxpcyA+PSBvdGhlci51dGNEYXRlLnVuaXhNaWxsaXM7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiBUaGUgbWluaW11bSBvZiB0aGlzIGFuZCBvdGhlclxuXHQgKi9cblx0cHVibGljIG1pbihvdGhlcjogRGF0ZVRpbWUpOiBEYXRlVGltZSB7XG5cdFx0aWYgKHRoaXMubGVzc1RoYW4ob3RoZXIpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jbG9uZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gb3RoZXIuY2xvbmUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIFRoZSBtYXhpbXVtIG9mIHRoaXMgYW5kIG90aGVyXG5cdCAqL1xuXHRwdWJsaWMgbWF4KG90aGVyOiBEYXRlVGltZSk6IERhdGVUaW1lIHtcblx0XHRpZiAodGhpcy5ncmVhdGVyVGhhbihvdGhlcikpIHtcblx0XHRcdHJldHVybiB0aGlzLmNsb25lKCk7XG5cdFx0fVxuXHRcdHJldHVybiBvdGhlci5jbG9uZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFByb3BlciBJU08gODYwMSBmb3JtYXQgc3RyaW5nIHdpdGggYW55IElBTkEgem9uZSBjb252ZXJ0ZWQgdG8gSVNPIG9mZnNldFxuXHQgKiBFLmcuIFwiMjAxNC0wMS0wMVQyMzoxNTozMyswMTowMFwiIGZvciBFdXJvcGUvQW1zdGVyZGFtXG5cdCAqIFVuYXdhcmUgZGF0ZXMgaGF2ZSBubyB6b25lIGluZm9ybWF0aW9uIGF0IHRoZSBlbmQuXG5cdCAqL1xuXHRwdWJsaWMgdG9Jc29TdHJpbmcoKTogc3RyaW5nIHtcblx0XHRjb25zdCBzOiBzdHJpbmcgPSB0aGlzLnpvbmVEYXRlLnRvU3RyaW5nKCk7XG5cdFx0aWYgKHRoaXMuX3pvbmUpIHtcblx0XHRcdHJldHVybiBzICsgVGltZVpvbmUub2Zmc2V0VG9TdHJpbmcodGhpcy5vZmZzZXQoKSk7IC8vIGNvbnZlcnQgSUFOQSBuYW1lIHRvIG9mZnNldFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gczsgLy8gbm8gem9uZSBwcmVzZW50XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgdG8gVVRDIGFuZCB0aGVuIHJldHVybiBJU08gc3RyaW5nIGVuZGluZyBpbiAnWicuIFRoaXMgaXMgZXF1aXZhbGVudCB0byBEYXRlI3RvSVNPU3RyaW5nKClcblx0ICogZS5nLiBcIjIwMTQtMDEtMDFUMjM6MTU6MzMgRXVyb3BlL0Ftc3RlcmRhbVwiIGJlY29tZXMgXCIyMDE0LTAxLTAxVDIyOjE1OjMzWlwiLlxuXHQgKiBVbmF3YXJlIGRhdGVzIGFyZSBhc3N1bWVkIHRvIGJlIGluIFVUQ1xuXHQgKi9cblx0cHVibGljIHRvVXRjSXNvU3RyaW5nKCk6IHN0cmluZyB7XG5cdFx0aWYgKHRoaXMuX3pvbmUpIHtcblx0XHRcdHJldHVybiB0aGlzLnRvWm9uZShUaW1lWm9uZS51dGMoKSkuZm9ybWF0KFwieXl5eS1NTS1kZFRISDptbTpzcy5TU1NaWlpaWlwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMud2l0aFpvbmUoVGltZVpvbmUudXRjKCkpLmZvcm1hdChcInl5eXktTU0tZGRUSEg6bW06c3MuU1NTWlpaWlpcIik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgRGF0ZVRpbWUgYWNjb3JkaW5nIHRvIHRoZVxuXHQgKiBzcGVjaWZpZWQgZm9ybWF0LiBTZWUgTERNTC5tZCBmb3Igc3VwcG9ydGVkIGZvcm1hdHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBmb3JtYXRTdHJpbmcgVGhlIGZvcm1hdCBzcGVjaWZpY2F0aW9uIChlLmcuIFwiZGQvTU0veXl5eSBISDptbTpzc1wiKVxuXHQgKiBAcGFyYW0gbG9jYWxlIE9wdGlvbmFsLCBub24tZW5nbGlzaCBmb3JtYXQgbW9udGggbmFtZXMgZXRjLlxuXHQgKiBAcmV0dXJuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBEYXRlVGltZVxuXHQgKi9cblx0cHVibGljIGZvcm1hdChmb3JtYXRTdHJpbmc6IHN0cmluZywgbG9jYWxlPzogUGFydGlhbExvY2FsZSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIGZvcm1hdC5mb3JtYXQodGhpcy56b25lRGF0ZSwgdGhpcy51dGNEYXRlLCB0aGlzLl96b25lLCBmb3JtYXRTdHJpbmcsIGxvY2FsZSk7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2UgYSBkYXRlIGluIGEgZ2l2ZW4gZm9ybWF0XG5cdCAqIEBwYXJhbSBzIHRoZSBzdHJpbmcgdG8gcGFyc2Vcblx0ICogQHBhcmFtIGZvcm1hdCB0aGUgZm9ybWF0IHRoZSBzdHJpbmcgaXMgaW4uIFNlZSBMRE1MLm1kIGZvciBzdXBwb3J0ZWQgZm9ybWF0cy5cblx0ICogQHBhcmFtIHpvbmUgT3B0aW9uYWwsIHRoZSB6b25lIHRvIGFkZCAoaWYgbm8gem9uZSBpcyBnaXZlbiBpbiB0aGUgc3RyaW5nKVxuXHQgKiBAcGFyYW0gbG9jYWxlIE9wdGlvbmFsLCBkaWZmZXJlbnQgc2V0dGluZ3MgZm9yIGNvbnN0YW50cyBsaWtlICdBTScgZXRjXG5cdCAqIEBwYXJhbSBhbGxvd1RyYWlsaW5nIEFsbG93IHRyYWlsaW5nIGNoYXJhY3RlcnMgaW4gdGhlIHNvdXJjZSBzdHJpbmdcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgcGFyc2Uoczogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZywgem9uZT86IFRpbWVab25lLCBsb2NhbGU/OiBQYXJ0aWFsTG9jYWxlLCBhbGxvd1RyYWlsaW5nPzogYm9vbGVhbik6IERhdGVUaW1lIHtcblx0XHRjb25zdCBwYXJzZWQgPSBwYXJzZUZ1bmNzLnBhcnNlKHMsIGZvcm1hdCwgem9uZSwgYWxsb3dUcmFpbGluZyB8fCBmYWxzZSwgbG9jYWxlKTtcblx0XHRyZXR1cm4gbmV3IERhdGVUaW1lKHBhcnNlZC50aW1lLCBwYXJzZWQuem9uZSk7XG5cdH1cblxuXHQvKipcblx0ICogTW9kaWZpZWQgSVNPIDg2MDEgZm9ybWF0IHN0cmluZyB3aXRoIElBTkEgbmFtZSBpZiBhcHBsaWNhYmxlLlxuXHQgKiBFLmcuIFwiMjAxNC0wMS0wMVQyMzoxNTozMy4wMDAgRXVyb3BlL0Ftc3RlcmRhbVwiXG5cdCAqL1xuXHRwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcblx0XHRjb25zdCBzOiBzdHJpbmcgPSB0aGlzLnpvbmVEYXRlLnRvU3RyaW5nKCk7XG5cdFx0aWYgKHRoaXMuX3pvbmUpIHtcblx0XHRcdGlmICh0aGlzLl96b25lLmtpbmQoKSAhPT0gVGltZVpvbmVLaW5kLk9mZnNldCkge1xuXHRcdFx0XHRyZXR1cm4gcyArIFwiIFwiICsgdGhpcy5fem9uZS50b1N0cmluZygpOyAvLyBzZXBhcmF0ZSBJQU5BIG5hbWUgb3IgXCJsb2NhbHRpbWVcIiB3aXRoIGEgc3BhY2Vcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBzICsgdGhpcy5fem9uZS50b1N0cmluZygpOyAvLyBkbyBub3Qgc2VwYXJhdGUgSVNPIHpvbmVcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHM7IC8vIG5vIHpvbmUgcHJlc2VudFxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdmFsdWVPZigpIG1ldGhvZCByZXR1cm5zIHRoZSBwcmltaXRpdmUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgdmFsdWVPZigpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLnVuaXhVdGNNaWxsaXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNb2RpZmllZCBJU08gODYwMSBmb3JtYXQgc3RyaW5nIGluIFVUQyB3aXRob3V0IHRpbWUgem9uZSBpbmZvXG5cdCAqL1xuXHRwdWJsaWMgdG9VdGNTdHJpbmcoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy51dGNEYXRlLnRvU3RyaW5nKCk7XG5cdH1cblxuXHQvKipcblx0ICogU3BsaXQgYSBjb21iaW5lZCBJU08gZGF0ZXRpbWUgYW5kIHRpbWV6b25lIGludG8gZGF0ZXRpbWUgYW5kIHRpbWV6b25lXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfc3BsaXREYXRlRnJvbVRpbWVab25lKHM6IHN0cmluZyk6IHN0cmluZ1tdIHtcblx0XHRjb25zdCB0cmltbWVkID0gcy50cmltKCk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gW1wiXCIsIFwiXCJdO1xuXHRcdGxldCBpbmRleCA9IHRyaW1tZWQubGFzdEluZGV4T2YoXCJ3aXRob3V0IERTVFwiKTtcblx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gRGF0ZVRpbWUuX3NwbGl0RGF0ZUZyb21UaW1lWm9uZShzLnNsaWNlKDAsIGluZGV4IC0gMSkpO1xuXHRcdFx0cmVzdWx0WzFdICs9IFwiIHdpdGhvdXQgRFNUXCI7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRpbmRleCA9IHRyaW1tZWQubGFzdEluZGV4T2YoXCIgXCIpO1xuXHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRyZXN1bHRbMF0gPSB0cmltbWVkLnN1YnN0cigwLCBpbmRleCk7XG5cdFx0XHRyZXN1bHRbMV0gPSB0cmltbWVkLnN1YnN0cihpbmRleCArIDEpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0aW5kZXggPSB0cmltbWVkLmxhc3RJbmRleE9mKFwiWlwiKTtcblx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0cmVzdWx0WzBdID0gdHJpbW1lZC5zdWJzdHIoMCwgaW5kZXgpO1xuXHRcdFx0cmVzdWx0WzFdID0gdHJpbW1lZC5zdWJzdHIoaW5kZXgsIDEpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0aW5kZXggPSB0cmltbWVkLmxhc3RJbmRleE9mKFwiK1wiKTtcblx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0cmVzdWx0WzBdID0gdHJpbW1lZC5zdWJzdHIoMCwgaW5kZXgpO1xuXHRcdFx0cmVzdWx0WzFdID0gdHJpbW1lZC5zdWJzdHIoaW5kZXgpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0aW5kZXggPSB0cmltbWVkLmxhc3RJbmRleE9mKFwiLVwiKTtcblx0XHRpZiAoaW5kZXggPCA4KSB7XG5cdFx0XHRpbmRleCA9IC0xOyAvLyBhbnkgXCItXCIgd2UgZm91bmQgd2FzIGEgZGF0ZSBzZXBhcmF0b3Jcblx0XHR9XG5cdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdHJlc3VsdFswXSA9IHRyaW1tZWQuc3Vic3RyKDAsIGluZGV4KTtcblx0XHRcdHJlc3VsdFsxXSA9IHRyaW1tZWQuc3Vic3RyKGluZGV4KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdHJlc3VsdFswXSA9IHRyaW1tZWQ7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGBhYCBpcyBzaW1pbGFyIHRvIGEgVGltZVpvbmUgd2l0aG91dCB1c2luZyB0aGUgaW5zdGFuY2VvZiBvcGVyYXRvci5cbiAqIEl0IGNoZWNrcyBmb3IgdGhlIGF2YWlsYWJpbGl0eSBvZiB0aGUgZnVuY3Rpb25zIHVzZWQgaW4gdGhlIERhdGVUaW1lIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gYSB0aGUgb2JqZWN0IHRvIGNoZWNrXG4gKiBAcmV0dXJucyBhIGlzIFRpbWVab25lLWxpa2VcbiAqL1xuZnVuY3Rpb24gaXNUaW1lWm9uZShhOiBhbnkpOiBhIGlzIFRpbWVab25lIHtcblx0aWYgKGEgJiYgdHlwZW9mIGEgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZiAoXG5cdFx0XHR0eXBlb2YgYS5ub3JtYWxpemVab25lVGltZSA9PT0gXCJmdW5jdGlvblwiXG5cdFx0XHQmJiB0eXBlb2YgYS5hYmJyZXZpYXRpb25Gb3JVdGMgPT09IFwiZnVuY3Rpb25cIlxuXHRcdFx0JiYgdHlwZW9mIGEuc3RhbmRhcmRPZmZzZXRGb3JVdGMgPT09IFwiZnVuY3Rpb25cIlxuXHRcdFx0JiYgdHlwZW9mIGEuaWRlbnRpY2FsID09PSBcImZ1bmN0aW9uXCJcblx0XHRcdCYmIHR5cGVvZiBhLmVxdWFscyA9PT0gXCJmdW5jdGlvblwiXG5cdFx0XHQmJiB0eXBlb2YgYS5raW5kID09PSBcImZ1bmN0aW9uXCJcblx0XHRcdCYmIHR5cGVvZiBhLmNsb25lID09PSBcImZ1bmN0aW9uXCJcblx0XHQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgZ2l2ZW4gb2JqZWN0IGlzIG9mIHR5cGUgRGF0ZVRpbWUuIE5vdGUgdGhhdCBpdCBkb2VzIG5vdCB3b3JrIGZvciBzdWIgY2xhc3Nlcy4gSG93ZXZlciwgdXNlIHRoaXMgdG8gYmUgcm9idXN0XG4gKiBhZ2FpbnN0IGRpZmZlcmVudCB2ZXJzaW9ucyBvZiB0aGUgbGlicmFyeSBpbiBvbmUgcHJvY2VzcyBpbnN0ZWFkIG9mIGluc3RhbmNlb2ZcbiAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBjaGVja1xuICogQHRocm93cyBub3RoaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGVUaW1lKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBEYXRlVGltZSB7XG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUua2luZCA9PT0gXCJEYXRlVGltZVwiO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBBQkIgU3dpdHplcmxhbmQgTHRkLlxuICpcbiAqIFRpbWUgZHVyYXRpb25cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IGFzc2VydCBmcm9tIFwiLi9hc3NlcnRcIjtcbmltcG9ydCB7IFRpbWVVbml0IH0gZnJvbSBcIi4vYmFzaWNzXCI7XG5pbXBvcnQgKiBhcyBiYXNpY3MgZnJvbSBcIi4vYmFzaWNzXCI7XG5pbXBvcnQgKiBhcyBzdHJpbmdzIGZyb20gXCIuL3N0cmluZ3NcIjtcblxuXG4vKipcbiAqIENvbnN0cnVjdCBhIHRpbWUgZHVyYXRpb25cbiAqIEBwYXJhbSBuXHROdW1iZXIgb2YgeWVhcnMgKG1heSBiZSBmcmFjdGlvbmFsIG9yIG5lZ2F0aXZlKVxuICogQHJldHVybiBBIGR1cmF0aW9uIG9mIG4geWVhcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHllYXJzKG46IG51bWJlcik6IER1cmF0aW9uIHtcblx0cmV0dXJuIER1cmF0aW9uLnllYXJzKG4pO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhIHRpbWUgZHVyYXRpb25cbiAqIEBwYXJhbSBuXHROdW1iZXIgb2YgbW9udGhzIChtYXkgYmUgZnJhY3Rpb25hbCBvciBuZWdhdGl2ZSlcbiAqIEByZXR1cm4gQSBkdXJhdGlvbiBvZiBuIG1vbnRoc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbW9udGhzKG46IG51bWJlcik6IER1cmF0aW9uIHtcblx0cmV0dXJuIER1cmF0aW9uLm1vbnRocyhuKTtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3QgYSB0aW1lIGR1cmF0aW9uXG4gKiBAcGFyYW0gblx0TnVtYmVyIG9mIGRheXMgKG1heSBiZSBmcmFjdGlvbmFsIG9yIG5lZ2F0aXZlKVxuICogQHJldHVybiBBIGR1cmF0aW9uIG9mIG4gZGF5c1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGF5cyhuOiBudW1iZXIpOiBEdXJhdGlvbiB7XG5cdHJldHVybiBEdXJhdGlvbi5kYXlzKG4pO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhIHRpbWUgZHVyYXRpb25cbiAqIEBwYXJhbSBuXHROdW1iZXIgb2YgaG91cnMgKG1heSBiZSBmcmFjdGlvbmFsIG9yIG5lZ2F0aXZlKVxuICogQHJldHVybiBBIGR1cmF0aW9uIG9mIG4gaG91cnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhvdXJzKG46IG51bWJlcik6IER1cmF0aW9uIHtcblx0cmV0dXJuIER1cmF0aW9uLmhvdXJzKG4pO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhIHRpbWUgZHVyYXRpb25cbiAqIEBwYXJhbSBuXHROdW1iZXIgb2YgbWludXRlcyAobWF5IGJlIGZyYWN0aW9uYWwgb3IgbmVnYXRpdmUpXG4gKiBAcmV0dXJuIEEgZHVyYXRpb24gb2YgbiBtaW51dGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW51dGVzKG46IG51bWJlcik6IER1cmF0aW9uIHtcblx0cmV0dXJuIER1cmF0aW9uLm1pbnV0ZXMobik7XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGEgdGltZSBkdXJhdGlvblxuICogQHBhcmFtIG5cdE51bWJlciBvZiBzZWNvbmRzIChtYXkgYmUgZnJhY3Rpb25hbCBvciBuZWdhdGl2ZSlcbiAqIEByZXR1cm4gQSBkdXJhdGlvbiBvZiBuIHNlY29uZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlY29uZHMobjogbnVtYmVyKTogRHVyYXRpb24ge1xuXHRyZXR1cm4gRHVyYXRpb24uc2Vjb25kcyhuKTtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3QgYSB0aW1lIGR1cmF0aW9uXG4gKiBAcGFyYW0gblx0TnVtYmVyIG9mIG1pbGxpc2Vjb25kcyAobWF5IGJlIGZyYWN0aW9uYWwgb3IgbmVnYXRpdmUpXG4gKiBAcmV0dXJuIEEgZHVyYXRpb24gb2YgbiBtaWxsaXNlY29uZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pbGxpc2Vjb25kcyhuOiBudW1iZXIpOiBEdXJhdGlvbiB7XG5cdHJldHVybiBEdXJhdGlvbi5taWxsaXNlY29uZHMobik7XG59XG5cbi8qKlxuICogVGltZSBkdXJhdGlvbiB3aGljaCBpcyByZXByZXNlbnRlZCBhcyBhbiBhbW91bnQgYW5kIGEgdW5pdCBlLmcuXG4gKiAnMSBNb250aCcgb3IgJzE2NiBTZWNvbmRzJy4gVGhlIHVuaXQgaXMgcHJlc2VydmVkIHRocm91Z2ggY2FsY3VsYXRpb25zLlxuICpcbiAqIEl0IGhhcyB0d28gc2V0cyBvZiBnZXR0ZXIgZnVuY3Rpb25zOlxuICogLSBzZWNvbmQoKSwgbWludXRlKCksIGhvdXIoKSBldGMsIHNpbmd1bGFyIGZvcm06IHRoZXNlIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zLlxuICogICBUaGVzZSByZXR1cm4gYSBwYXJ0IG9mIHlvdXIgc3RyaW5nIHJlcHJlc2VudGF0aW9uLiBFLmcuIGZvciAyNTAwIG1pbGxpc2Vjb25kcywgdGhlIG1pbGxpc2Vjb25kKCkgcGFydCB3b3VsZCBiZSA1MDBcbiAqIC0gc2Vjb25kcygpLCBtaW51dGVzKCksIGhvdXJzKCkgZXRjLCBwbHVyYWwgZm9ybTogdGhlc2UgcmV0dXJuIHRoZSB0b3RhbCBhbW91bnQgcmVwcmVzZW50ZWQgaW4gdGhlIGNvcnJlc3BvbmRpbmcgdW5pdC5cbiAqL1xuZXhwb3J0IGNsYXNzIER1cmF0aW9uIHtcblxuXHQvKipcblx0ICogQWxsb3cgbm90IHVzaW5nIGluc3RhbmNlb2Zcblx0ICovXG5cdHB1YmxpYyBraW5kID0gXCJEdXJhdGlvblwiO1xuXG5cdC8qKlxuXHQgKiBHaXZlbiBhbW91bnQgaW4gY29uc3RydWN0b3Jcblx0ICovXG5cdHByaXZhdGUgX2Ftb3VudDogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBVbml0XG5cdCAqL1xuXHRwcml2YXRlIF91bml0OiBUaW1lVW5pdDtcblxuXHQvKipcblx0ICogQ29uc3RydWN0IGEgdGltZSBkdXJhdGlvblxuXHQgKiBAcGFyYW0gblx0TnVtYmVyIG9mIHllYXJzIChtYXkgYmUgZnJhY3Rpb25hbCBvciBuZWdhdGl2ZSlcblx0ICogQHJldHVybiBBIGR1cmF0aW9uIG9mIG4geWVhcnNcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgeWVhcnMobjogbnVtYmVyKTogRHVyYXRpb24ge1xuXHRcdHJldHVybiBuZXcgRHVyYXRpb24obiwgVGltZVVuaXQuWWVhcik7XG5cdH1cblxuXHQvKipcblx0ICogQ29uc3RydWN0IGEgdGltZSBkdXJhdGlvblxuXHQgKiBAcGFyYW0gblx0TnVtYmVyIG9mIG1vbnRocyAobWF5IGJlIGZyYWN0aW9uYWwgb3IgbmVnYXRpdmUpXG5cdCAqIEByZXR1cm4gQSBkdXJhdGlvbiBvZiBuIG1vbnRoc1xuXHQgKi9cblx0cHVibGljIHN0YXRpYyBtb250aHMobjogbnVtYmVyKTogRHVyYXRpb24ge1xuXHRcdHJldHVybiBuZXcgRHVyYXRpb24obiwgVGltZVVuaXQuTW9udGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdCBhIHRpbWUgZHVyYXRpb25cblx0ICogQHBhcmFtIG5cdE51bWJlciBvZiBkYXlzIChtYXkgYmUgZnJhY3Rpb25hbCBvciBuZWdhdGl2ZSlcblx0ICogQHJldHVybiBBIGR1cmF0aW9uIG9mIG4gZGF5c1xuXHQgKi9cblx0cHVibGljIHN0YXRpYyBkYXlzKG46IG51bWJlcik6IER1cmF0aW9uIHtcblx0XHRyZXR1cm4gbmV3IER1cmF0aW9uKG4sIFRpbWVVbml0LkRheSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29uc3RydWN0IGEgdGltZSBkdXJhdGlvblxuXHQgKiBAcGFyYW0gblx0TnVtYmVyIG9mIGhvdXJzIChtYXkgYmUgZnJhY3Rpb25hbCBvciBuZWdhdGl2ZSlcblx0ICogQHJldHVybiBBIGR1cmF0aW9uIG9mIG4gaG91cnNcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgaG91cnMobjogbnVtYmVyKTogRHVyYXRpb24ge1xuXHRcdHJldHVybiBuZXcgRHVyYXRpb24obiwgVGltZVVuaXQuSG91cik7XG5cdH1cblxuXHQvKipcblx0ICogQ29uc3RydWN0IGEgdGltZSBkdXJhdGlvblxuXHQgKiBAcGFyYW0gblx0TnVtYmVyIG9mIG1pbnV0ZXMgKG1heSBiZSBmcmFjdGlvbmFsIG9yIG5lZ2F0aXZlKVxuXHQgKiBAcmV0dXJuIEEgZHVyYXRpb24gb2YgbiBtaW51dGVzXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIG1pbnV0ZXMobjogbnVtYmVyKTogRHVyYXRpb24ge1xuXHRcdHJldHVybiBuZXcgRHVyYXRpb24obiwgVGltZVVuaXQuTWludXRlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3QgYSB0aW1lIGR1cmF0aW9uXG5cdCAqIEBwYXJhbSBuXHROdW1iZXIgb2Ygc2Vjb25kcyAobWF5IGJlIGZyYWN0aW9uYWwgb3IgbmVnYXRpdmUpXG5cdCAqIEByZXR1cm4gQSBkdXJhdGlvbiBvZiBuIHNlY29uZHNcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc2Vjb25kcyhuOiBudW1iZXIpOiBEdXJhdGlvbiB7XG5cdFx0cmV0dXJuIG5ldyBEdXJhdGlvbihuLCBUaW1lVW5pdC5TZWNvbmQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdCBhIHRpbWUgZHVyYXRpb25cblx0ICogQHBhcmFtIG5cdE51bWJlciBvZiBtaWxsaXNlY29uZHMgKG1heSBiZSBmcmFjdGlvbmFsIG9yIG5lZ2F0aXZlKVxuXHQgKiBAcmV0dXJuIEEgZHVyYXRpb24gb2YgbiBtaWxsaXNlY29uZHNcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgbWlsbGlzZWNvbmRzKG46IG51bWJlcik6IER1cmF0aW9uIHtcblx0XHRyZXR1cm4gbmV3IER1cmF0aW9uKG4sIFRpbWVVbml0Lk1pbGxpc2Vjb25kKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3QgYSB0aW1lIGR1cmF0aW9uIG9mIDBcblx0ICovXG5cdGNvbnN0cnVjdG9yKCk7XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdCBhIHRpbWUgZHVyYXRpb24gZnJvbSBhIHN0cmluZyBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG5cdCAqIDEpIFstXWhoaGhbOm1tWzpzc1subm5uXV1dIGUuZy4gJy0wMTowMDozMC41MDEnXG5cdCAqIDIpIGFtb3VudCBhbmQgdW5pdCBlLmcuICctMSBkYXlzJyBvciAnMSB5ZWFyJy4gVGhlIHVuaXQgbWF5IGJlIGluIHNpbmd1bGFyIG9yIHBsdXJhbCBmb3JtIGFuZCBpcyBjYXNlLWluc2Vuc2l0aXZlXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihpbnB1dDogc3RyaW5nKTtcblxuXHQvKipcblx0ICogQ29uc3RydWN0IGEgZHVyYXRpb24gZnJvbSBhbiBhbW91bnQgYW5kIGEgdGltZSB1bml0LlxuXHQgKiBAcGFyYW0gYW1vdW50XHROdW1iZXIgb2YgdW5pdHNcblx0ICogQHBhcmFtIHVuaXRcdEEgdGltZSB1bml0IGkuZS4gVGltZVVuaXQuU2Vjb25kLCBUaW1lVW5pdC5Ib3VyIGV0Yy4gRGVmYXVsdCBNaWxsaXNlY29uZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGFtb3VudDogbnVtYmVyLCB1bml0PzogVGltZVVuaXQpO1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RvciBpbXBsZW1lbnRhdGlvblxuXHQgKi9cblx0Y29uc3RydWN0b3IoaTE/OiBhbnksIHVuaXQ/OiBUaW1lVW5pdCkge1xuXHRcdGlmICh0eXBlb2YgKGkxKSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0Ly8gYW1vdW50K3VuaXQgY29uc3RydWN0b3Jcblx0XHRcdGNvbnN0IGFtb3VudCA9IGkxIGFzIG51bWJlcjtcblx0XHRcdHRoaXMuX2Ftb3VudCA9IGFtb3VudDtcblx0XHRcdHRoaXMuX3VuaXQgPSAodHlwZW9mIHVuaXQgPT09IFwibnVtYmVyXCIgPyB1bml0IDogVGltZVVuaXQuTWlsbGlzZWNvbmQpO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIChpMSkgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdC8vIHN0cmluZyBjb25zdHJ1Y3RvclxuXHRcdFx0dGhpcy5fZnJvbVN0cmluZyhpMSBhcyBzdHJpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBkZWZhdWx0IGNvbnN0cnVjdG9yXG5cdFx0XHR0aGlzLl9hbW91bnQgPSAwO1xuXHRcdFx0dGhpcy5fdW5pdCA9IFRpbWVVbml0Lk1pbGxpc2Vjb25kO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIGFub3RoZXIgaW5zdGFuY2Ugb2YgRHVyYXRpb24gd2l0aCB0aGUgc2FtZSB2YWx1ZS5cblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOiBEdXJhdGlvbiB7XG5cdFx0cmV0dXJuIG5ldyBEdXJhdGlvbih0aGlzLl9hbW91bnQsIHRoaXMuX3VuaXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhpcyBkdXJhdGlvbiBleHByZXNzZWQgaW4gZGlmZmVyZW50IHVuaXQgKHBvc2l0aXZlIG9yIG5lZ2F0aXZlLCBmcmFjdGlvbmFsKS5cblx0ICogVGhpcyBpcyBwcmVjaXNlIGZvciBZZWFyIDwtPiBNb250aCBhbmQgZm9yIHRpbWUtdG8tdGltZSBjb252ZXJzaW9uIChpLmUuIEhvdXItb3ItbGVzcyB0byBIb3VyLW9yLWxlc3MpLlxuXHQgKiBJdCBpcyBhcHByb3hpbWF0ZSBmb3IgYW55IG90aGVyIGNvbnZlcnNpb25cblx0ICovXG5cdHB1YmxpYyBhcyh1bml0OiBUaW1lVW5pdCk6IG51bWJlciB7XG5cdFx0aWYgKHRoaXMuX3VuaXQgPT09IHVuaXQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9hbW91bnQ7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl91bml0ID49IFRpbWVVbml0Lk1vbnRoICYmIHVuaXQgPj0gVGltZVVuaXQuTW9udGgpIHtcblx0XHRcdGNvbnN0IHRoaXNNb250aHMgPSAodGhpcy5fdW5pdCA9PT0gVGltZVVuaXQuWWVhciA/IDEyIDogMSk7XG5cdFx0XHRjb25zdCByZXFNb250aHMgPSAodW5pdCA9PT0gVGltZVVuaXQuWWVhciA/IDEyIDogMSk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYW1vdW50ICogdGhpc01vbnRocyAvIHJlcU1vbnRocztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgdGhpc01zZWMgPSBiYXNpY3MudGltZVVuaXRUb01pbGxpc2Vjb25kcyh0aGlzLl91bml0KTtcblx0XHRcdGNvbnN0IHJlcU1zZWMgPSBiYXNpY3MudGltZVVuaXRUb01pbGxpc2Vjb25kcyh1bml0KTtcblx0XHRcdHJldHVybiB0aGlzLl9hbW91bnQgKiB0aGlzTXNlYyAvIHJlcU1zZWM7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgdGhpcyBkdXJhdGlvbiB0byBhIER1cmF0aW9uIGluIGFub3RoZXIgdW5pdC4gWW91IGFsd2F5cyBnZXQgYSBjbG9uZSBldmVuIGlmIHlvdSBzcGVjaWZ5XG5cdCAqIHRoZSBzYW1lIHVuaXQuXG5cdCAqIFRoaXMgaXMgcHJlY2lzZSBmb3IgWWVhciA8LT4gTW9udGggYW5kIGZvciB0aW1lLXRvLXRpbWUgY29udmVyc2lvbiAoaS5lLiBIb3VyLW9yLWxlc3MgdG8gSG91ci1vci1sZXNzKS5cblx0ICogSXQgaXMgYXBwcm94aW1hdGUgZm9yIGFueSBvdGhlciBjb252ZXJzaW9uXG5cdCAqL1xuXHRwdWJsaWMgY29udmVydCh1bml0OiBUaW1lVW5pdCk6IER1cmF0aW9uIHtcblx0XHRyZXR1cm4gbmV3IER1cmF0aW9uKHRoaXMuYXModW5pdCksIHVuaXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBlbnRpcmUgZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIChuZWdhdGl2ZSBvciBwb3NpdGl2ZSlcblx0ICogRm9yIERheS9Nb250aC9ZZWFyIGR1cmF0aW9ucywgdGhpcyBpcyBhcHByb3hpbWF0ZSFcblx0ICovXG5cdHB1YmxpYyBtaWxsaXNlY29uZHMoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5hcyhUaW1lVW5pdC5NaWxsaXNlY29uZCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1pbGxpc2Vjb25kIHBhcnQgb2YgdGhlIGR1cmF0aW9uIChhbHdheXMgcG9zaXRpdmUpXG5cdCAqIEZvciBEYXkvTW9udGgvWWVhciBkdXJhdGlvbnMsIHRoaXMgaXMgYXBwcm94aW1hdGUhXG5cdCAqIEByZXR1cm4gZS5nLiA0MDAgZm9yIGEgLTAxOjAyOjAzLjQwMCBkdXJhdGlvblxuXHQgKi9cblx0cHVibGljIG1pbGxpc2Vjb25kKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuX3BhcnQoVGltZVVuaXQuTWlsbGlzZWNvbmQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBlbnRpcmUgZHVyYXRpb24gaW4gc2Vjb25kcyAobmVnYXRpdmUgb3IgcG9zaXRpdmUsIGZyYWN0aW9uYWwpXG5cdCAqIEZvciBEYXkvTW9udGgvWWVhciBkdXJhdGlvbnMsIHRoaXMgaXMgYXBwcm94aW1hdGUhXG5cdCAqIEByZXR1cm4gZS5nLiAxLjUgZm9yIGEgMTUwMCBtaWxsaXNlY29uZHMgZHVyYXRpb25cblx0ICovXG5cdHB1YmxpYyBzZWNvbmRzKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuYXMoVGltZVVuaXQuU2Vjb25kKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgc2Vjb25kIHBhcnQgb2YgdGhlIGR1cmF0aW9uIChhbHdheXMgcG9zaXRpdmUpXG5cdCAqIEZvciBEYXkvTW9udGgvWWVhciBkdXJhdGlvbnMsIHRoaXMgaXMgYXBwcm94aW1hdGUhXG5cdCAqIEByZXR1cm4gZS5nLiAzIGZvciBhIC0wMTowMjowMy40MDAgZHVyYXRpb25cblx0ICovXG5cdHB1YmxpYyBzZWNvbmQoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5fcGFydChUaW1lVW5pdC5TZWNvbmQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBlbnRpcmUgZHVyYXRpb24gaW4gbWludXRlcyAobmVnYXRpdmUgb3IgcG9zaXRpdmUsIGZyYWN0aW9uYWwpXG5cdCAqIEZvciBEYXkvTW9udGgvWWVhciBkdXJhdGlvbnMsIHRoaXMgaXMgYXBwcm94aW1hdGUhXG5cdCAqIEByZXR1cm4gZS5nLiAxLjUgZm9yIGEgOTAwMDAgbWlsbGlzZWNvbmRzIGR1cmF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgbWludXRlcygpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmFzKFRpbWVVbml0Lk1pbnV0ZSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1pbnV0ZSBwYXJ0IG9mIHRoZSBkdXJhdGlvbiAoYWx3YXlzIHBvc2l0aXZlKVxuXHQgKiBGb3IgRGF5L01vbnRoL1llYXIgZHVyYXRpb25zLCB0aGlzIGlzIGFwcHJveGltYXRlIVxuXHQgKiBAcmV0dXJuIGUuZy4gMiBmb3IgYSAtMDE6MDI6MDMuNDAwIGR1cmF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgbWludXRlKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuX3BhcnQoVGltZVVuaXQuTWludXRlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZW50aXJlIGR1cmF0aW9uIGluIGhvdXJzIChuZWdhdGl2ZSBvciBwb3NpdGl2ZSwgZnJhY3Rpb25hbClcblx0ICogRm9yIERheS9Nb250aC9ZZWFyIGR1cmF0aW9ucywgdGhpcyBpcyBhcHByb3hpbWF0ZSFcblx0ICogQHJldHVybiBlLmcuIDEuNSBmb3IgYSA1NDAwMDAwIG1pbGxpc2Vjb25kcyBkdXJhdGlvblxuXHQgKi9cblx0cHVibGljIGhvdXJzKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuYXMoVGltZVVuaXQuSG91cik7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGhvdXIgcGFydCBvZiBhIGR1cmF0aW9uLiBUaGlzIGFzc3VtZXMgdGhhdCBhIGRheSBoYXMgMjQgaG91cnMgKHdoaWNoIGlzIG5vdCB0aGUgY2FzZVxuXHQgKiBkdXJpbmcgRFNUIGNoYW5nZXMpLlxuXHQgKi9cblx0cHVibGljIGhvdXIoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5fcGFydChUaW1lVW5pdC5Ib3VyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgaG91ciBwYXJ0IG9mIHRoZSBkdXJhdGlvbiAoYWx3YXlzIHBvc2l0aXZlKS5cblx0ICogTm90ZSB0aGF0IHRoaXMgcGFydCBjYW4gZXhjZWVkIDIzIGhvdXJzLCBiZWNhdXNlIGZvclxuXHQgKiBub3csIHdlIGRvIG5vdCBoYXZlIGEgZGF5cygpIGZ1bmN0aW9uXG5cdCAqIEZvciBEYXkvTW9udGgvWWVhciBkdXJhdGlvbnMsIHRoaXMgaXMgYXBwcm94aW1hdGUhXG5cdCAqIEByZXR1cm4gZS5nLiAyNSBmb3IgYSAtMjU6MDI6MDMuNDAwIGR1cmF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgd2hvbGVIb3VycygpOiBudW1iZXIge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKGJhc2ljcy50aW1lVW5pdFRvTWlsbGlzZWNvbmRzKHRoaXMuX3VuaXQpICogTWF0aC5hYnModGhpcy5fYW1vdW50KSAvIDM2MDAwMDApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBlbnRpcmUgZHVyYXRpb24gaW4gZGF5cyAobmVnYXRpdmUgb3IgcG9zaXRpdmUsIGZyYWN0aW9uYWwpXG5cdCAqIFRoaXMgaXMgYXBwcm94aW1hdGUgaWYgdGhpcyBkdXJhdGlvbiBpcyBub3QgaW4gZGF5cyFcblx0ICovXG5cdHB1YmxpYyBkYXlzKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuYXMoVGltZVVuaXQuRGF5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZGF5IHBhcnQgb2YgYSBkdXJhdGlvbi4gVGhpcyBhc3N1bWVzIHRoYXQgYSBtb250aCBoYXMgMzAgZGF5cy5cblx0ICovXG5cdHB1YmxpYyBkYXkoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5fcGFydChUaW1lVW5pdC5EYXkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBlbnRpcmUgZHVyYXRpb24gaW4gZGF5cyAobmVnYXRpdmUgb3IgcG9zaXRpdmUsIGZyYWN0aW9uYWwpXG5cdCAqIFRoaXMgaXMgYXBwcm94aW1hdGUgaWYgdGhpcyBkdXJhdGlvbiBpcyBub3QgaW4gTW9udGhzIG9yIFllYXJzIVxuXHQgKi9cblx0cHVibGljIG1vbnRocygpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmFzKFRpbWVVbml0Lk1vbnRoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbW9udGggcGFydCBvZiBhIGR1cmF0aW9uLlxuXHQgKi9cblx0cHVibGljIG1vbnRoKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuX3BhcnQoVGltZVVuaXQuTW9udGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBlbnRpcmUgZHVyYXRpb24gaW4geWVhcnMgKG5lZ2F0aXZlIG9yIHBvc2l0aXZlLCBmcmFjdGlvbmFsKVxuXHQgKiBUaGlzIGlzIGFwcHJveGltYXRlIGlmIHRoaXMgZHVyYXRpb24gaXMgbm90IGluIE1vbnRocyBvciBZZWFycyFcblx0ICovXG5cdHB1YmxpYyB5ZWFycygpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmFzKFRpbWVVbml0LlllYXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5vbi1mcmFjdGlvbmFsIHBvc2l0aXZlIHllYXJzXG5cdCAqL1xuXHRwdWJsaWMgd2hvbGVZZWFycygpOiBudW1iZXIge1xuXHRcdGlmICh0aGlzLl91bml0ID09PSBUaW1lVW5pdC5ZZWFyKSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLmFicyh0aGlzLl9hbW91bnQpKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuX3VuaXQgPT09IFRpbWVVbml0Lk1vbnRoKSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLmFicyh0aGlzLl9hbW91bnQpIC8gMTIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcihiYXNpY3MudGltZVVuaXRUb01pbGxpc2Vjb25kcyh0aGlzLl91bml0KSAqIE1hdGguYWJzKHRoaXMuX2Ftb3VudCkgL1xuXHRcdFx0XHRiYXNpY3MudGltZVVuaXRUb01pbGxpc2Vjb25kcyhUaW1lVW5pdC5ZZWFyKSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEFtb3VudCBvZiB1bml0cyAocG9zaXRpdmUgb3IgbmVnYXRpdmUsIGZyYWN0aW9uYWwpXG5cdCAqL1xuXHRwdWJsaWMgYW1vdW50KCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuX2Ftb3VudDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdW5pdCB0aGlzIGR1cmF0aW9uIHdhcyBjcmVhdGVkIHdpdGhcblx0ICovXG5cdHB1YmxpYyB1bml0KCk6IFRpbWVVbml0IHtcblx0XHRyZXR1cm4gdGhpcy5fdW5pdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTaWduXG5cdCAqIEByZXR1cm4gXCItXCIgaWYgdGhlIGR1cmF0aW9uIGlzIG5lZ2F0aXZlXG5cdCAqL1xuXHRwdWJsaWMgc2lnbigpOiBzdHJpbmcge1xuXHRcdHJldHVybiAodGhpcy5fYW1vdW50IDwgMCA/IFwiLVwiIDogXCJcIik7XG5cdH1cblxuXHQvKipcblx0ICogQXBwcm94aW1hdGUgaWYgdGhlIGR1cmF0aW9ucyBoYXZlIHVuaXRzIHRoYXQgY2Fubm90IGJlIGNvbnZlcnRlZFxuXHQgKiBAcmV0dXJuIFRydWUgaWZmICh0aGlzIDwgb3RoZXIpXG5cdCAqL1xuXHRwdWJsaWMgbGVzc1RoYW4ob3RoZXI6IER1cmF0aW9uKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMubWlsbGlzZWNvbmRzKCkgPCBvdGhlci5taWxsaXNlY29uZHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBcHByb3hpbWF0ZSBpZiB0aGUgZHVyYXRpb25zIGhhdmUgdW5pdHMgdGhhdCBjYW5ub3QgYmUgY29udmVydGVkXG5cdCAqIEByZXR1cm4gVHJ1ZSBpZmYgKHRoaXMgPD0gb3RoZXIpXG5cdCAqL1xuXHRwdWJsaWMgbGVzc0VxdWFsKG90aGVyOiBEdXJhdGlvbik6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLm1pbGxpc2Vjb25kcygpIDw9IG90aGVyLm1pbGxpc2Vjb25kcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNpbWlsYXIgYnV0IG5vdCBpZGVudGljYWxcblx0ICogQXBwcm94aW1hdGUgaWYgdGhlIGR1cmF0aW9ucyBoYXZlIHVuaXRzIHRoYXQgY2Fubm90IGJlIGNvbnZlcnRlZFxuXHQgKiBAcmV0dXJuIFRydWUgaWZmIHRoaXMgYW5kIG90aGVyIHJlcHJlc2VudCB0aGUgc2FtZSB0aW1lIGR1cmF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgZXF1YWxzKG90aGVyOiBEdXJhdGlvbik6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IGNvbnZlcnRlZCA9IG90aGVyLmNvbnZlcnQodGhpcy5fdW5pdCk7XG5cdFx0cmV0dXJuIHRoaXMuX2Ftb3VudCA9PT0gY29udmVydGVkLmFtb3VudCgpICYmIHRoaXMuX3VuaXQgPT09IGNvbnZlcnRlZC51bml0KCk7XG5cdH1cblxuXHQvKipcblx0ICogU2ltaWxhciBidXQgbm90IGlkZW50aWNhbFxuXHQgKiBSZXR1cm5zIGZhbHNlIGlmIHdlIGNhbm5vdCBkZXRlcm1pbmUgd2hldGhlciB0aGV5IGFyZSBlcXVhbCBpbiBhbGwgdGltZSB6b25lc1xuXHQgKiBzbyBlLmcuIDYwIG1pbnV0ZXMgZXF1YWxzIDEgaG91ciwgYnV0IDI0IGhvdXJzIGRvIE5PVCBlcXVhbCAxIGRheVxuXHQgKlxuXHQgKiBAcmV0dXJuIFRydWUgaWZmIHRoaXMgYW5kIG90aGVyIHJlcHJlc2VudCB0aGUgc2FtZSB0aW1lIGR1cmF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgZXF1YWxzRXhhY3Qob3RoZXI6IER1cmF0aW9uKTogYm9vbGVhbiB7XG5cdFx0aWYgKHRoaXMuX3VuaXQgPT09IG90aGVyLl91bml0KSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuX2Ftb3VudCA9PT0gb3RoZXIuX2Ftb3VudCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl91bml0ID49IFRpbWVVbml0Lk1vbnRoICYmIG90aGVyLnVuaXQoKSA+PSBUaW1lVW5pdC5Nb250aCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZXF1YWxzKG90aGVyKTsgLy8gY2FuIGNvbXBhcmUgbW9udGhzIGFuZCB5ZWFyc1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fdW5pdCA8IFRpbWVVbml0LkRheSAmJiBvdGhlci51bml0KCkgPCBUaW1lVW5pdC5EYXkpIHtcblx0XHRcdHJldHVybiB0aGlzLmVxdWFscyhvdGhlcik7IC8vIGNhbiBjb21wYXJlIG1pbGxpc2Vjb25kcyB0aHJvdWdoIGhvdXJzXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTsgLy8gY2Fubm90IGNvbXBhcmUgZGF5cyB0byBhbnl0aGluZyBlbHNlXG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNhbWUgdW5pdCBhbmQgc2FtZSBhbW91bnRcblx0ICovXG5cdHB1YmxpYyBpZGVudGljYWwob3RoZXI6IER1cmF0aW9uKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX2Ftb3VudCA9PT0gb3RoZXIuYW1vdW50KCkgJiYgdGhpcy5fdW5pdCA9PT0gb3RoZXIudW5pdCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcHJveGltYXRlIGlmIHRoZSBkdXJhdGlvbnMgaGF2ZSB1bml0cyB0aGF0IGNhbm5vdCBiZSBjb252ZXJ0ZWRcblx0ICogQHJldHVybiBUcnVlIGlmZiB0aGlzID4gb3RoZXJcblx0ICovXG5cdHB1YmxpYyBncmVhdGVyVGhhbihvdGhlcjogRHVyYXRpb24pOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5taWxsaXNlY29uZHMoKSA+IG90aGVyLm1pbGxpc2Vjb25kcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcHJveGltYXRlIGlmIHRoZSBkdXJhdGlvbnMgaGF2ZSB1bml0cyB0aGF0IGNhbm5vdCBiZSBjb252ZXJ0ZWRcblx0ICogQHJldHVybiBUcnVlIGlmZiB0aGlzID49IG90aGVyXG5cdCAqL1xuXHRwdWJsaWMgZ3JlYXRlckVxdWFsKG90aGVyOiBEdXJhdGlvbik6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLm1pbGxpc2Vjb25kcygpID49IG90aGVyLm1pbGxpc2Vjb25kcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcHJveGltYXRlIGlmIHRoZSBkdXJhdGlvbnMgaGF2ZSB1bml0cyB0aGF0IGNhbm5vdCBiZSBjb252ZXJ0ZWRcblx0ICogQHJldHVybiBUaGUgbWluaW11bSAobW9zdCBuZWdhdGl2ZSkgb2YgdGhpcyBhbmQgb3RoZXJcblx0ICovXG5cdHB1YmxpYyBtaW4ob3RoZXI6IER1cmF0aW9uKTogRHVyYXRpb24ge1xuXHRcdGlmICh0aGlzLmxlc3NUaGFuKG90aGVyKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY2xvbmUoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG90aGVyLmNsb25lKCk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwcm94aW1hdGUgaWYgdGhlIGR1cmF0aW9ucyBoYXZlIHVuaXRzIHRoYXQgY2Fubm90IGJlIGNvbnZlcnRlZFxuXHQgKiBAcmV0dXJuIFRoZSBtYXhpbXVtIChtb3N0IHBvc2l0aXZlKSBvZiB0aGlzIGFuZCBvdGhlclxuXHQgKi9cblx0cHVibGljIG1heChvdGhlcjogRHVyYXRpb24pOiBEdXJhdGlvbiB7XG5cdFx0aWYgKHRoaXMuZ3JlYXRlclRoYW4ob3RoZXIpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jbG9uZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gb3RoZXIuY2xvbmUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNdWx0aXBseSB3aXRoIGEgZml4ZWQgbnVtYmVyLlxuXHQgKiBBcHByb3hpbWF0ZSBpZiB0aGUgZHVyYXRpb25zIGhhdmUgdW5pdHMgdGhhdCBjYW5ub3QgYmUgY29udmVydGVkXG5cdCAqIEByZXR1cm4gYSBuZXcgRHVyYXRpb24gb2YgKHRoaXMgKiB2YWx1ZSlcblx0ICovXG5cdHB1YmxpYyBtdWx0aXBseSh2YWx1ZTogbnVtYmVyKTogRHVyYXRpb24ge1xuXHRcdHJldHVybiBuZXcgRHVyYXRpb24odGhpcy5fYW1vdW50ICogdmFsdWUsIHRoaXMuX3VuaXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpdmlkZSBieSBhIHVuaXRsZXNzIG51bWJlci4gVGhlIHJlc3VsdCBpcyBhIER1cmF0aW9uLCBlLmcuIDEgeWVhciAvIDIgPSAwLjUgeWVhclxuXHQgKiBUaGUgcmVzdWx0IGlzIGFwcHJveGltYXRlIGlmIHRoaXMgZHVyYXRpb24gYXMgYSB1bml0IHRoYXQgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIG51bWJlciAoZS5nLiAxIG1vbnRoIGhhcyB2YXJpYWJsZSBsZW5ndGgpXG5cdCAqIEByZXR1cm4gYSBuZXcgRHVyYXRpb24gb2YgKHRoaXMgLyB2YWx1ZSlcblx0ICovXG5cdHB1YmxpYyBkaXZpZGUodmFsdWU6IG51bWJlcik6IER1cmF0aW9uO1xuXHQvKipcblx0ICogRGl2aWRlIHRoaXMgRHVyYXRpb24gYnkgYSBEdXJhdGlvbi4gVGhlIHJlc3VsdCBpcyBhIHVuaXRsZXNzIG51bWJlciBlLmcuIDEgeWVhciAvIDEgbW9udGggPSAxMlxuXHQgKiBUaGUgcmVzdWx0IGlzIGFwcHJveGltYXRlIGlmIHRoaXMgZHVyYXRpb24gYXMgYSB1bml0IHRoYXQgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIG51bWJlciAoZS5nLiAxIG1vbnRoIGhhcyB2YXJpYWJsZSBsZW5ndGgpXG5cdCAqIEByZXR1cm4gYSBuZXcgRHVyYXRpb24gb2YgKHRoaXMgLyB2YWx1ZSlcblx0ICovXG5cdHB1YmxpYyBkaXZpZGUodmFsdWU6IER1cmF0aW9uKTogbnVtYmVyO1xuXHRwdWJsaWMgZGl2aWRlKHZhbHVlOiBudW1iZXIgfCBEdXJhdGlvbik6IER1cmF0aW9uIHwgbnVtYmVyIHtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRpZiAodmFsdWUgPT09IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRHVyYXRpb24uZGl2aWRlKCk6IERpdmlkZSBieSB6ZXJvXCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBEdXJhdGlvbih0aGlzLl9hbW91bnQgLyB2YWx1ZSwgdGhpcy5fdW5pdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh2YWx1ZS5fYW1vdW50ID09PSAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkR1cmF0aW9uLmRpdmlkZSgpOiBEaXZpZGUgYnkgemVybyBkdXJhdGlvblwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLm1pbGxpc2Vjb25kcygpIC8gdmFsdWUubWlsbGlzZWNvbmRzKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIGR1cmF0aW9uLlxuXHQgKiBAcmV0dXJuIGEgbmV3IER1cmF0aW9uIG9mICh0aGlzICsgdmFsdWUpIHdpdGggdGhlIHVuaXQgb2YgdGhpcyBkdXJhdGlvblxuXHQgKi9cblx0cHVibGljIGFkZCh2YWx1ZTogRHVyYXRpb24pOiBEdXJhdGlvbiB7XG5cdFx0cmV0dXJuIG5ldyBEdXJhdGlvbih0aGlzLl9hbW91bnQgKyB2YWx1ZS5hcyh0aGlzLl91bml0KSwgdGhpcy5fdW5pdCk7XG5cdH1cblxuXHQvKipcblx0ICogU3VidHJhY3QgYSBkdXJhdGlvbi5cblx0ICogQHJldHVybiBhIG5ldyBEdXJhdGlvbiBvZiAodGhpcyAtIHZhbHVlKSB3aXRoIHRoZSB1bml0IG9mIHRoaXMgZHVyYXRpb25cblx0ICovXG5cdHB1YmxpYyBzdWIodmFsdWU6IER1cmF0aW9uKTogRHVyYXRpb24ge1xuXHRcdHJldHVybiBuZXcgRHVyYXRpb24odGhpcy5fYW1vdW50IC0gdmFsdWUuYXModGhpcy5fdW5pdCksIHRoaXMuX3VuaXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhlIGR1cmF0aW9uIGkuZS4gcmVtb3ZlIHRoZSBzaWduLlxuXHQgKi9cblx0cHVibGljIGFicygpOiBEdXJhdGlvbiB7XG5cdFx0aWYgKHRoaXMuX2Ftb3VudCA+PSAwKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jbG9uZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFN0cmluZyBpbiBbLV1oaGhoOm1tOnNzLm5ubiBub3RhdGlvbi4gQWxsIGZpZWxkcyBhcmVcblx0ICogYWx3YXlzIHByZXNlbnQgZXhjZXB0IHRoZSBzaWduLlxuXHQgKi9cblx0cHVibGljIHRvRnVsbFN0cmluZygpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLnRvSG1zU3RyaW5nKHRydWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0cmluZyBpbiBbLV1oaGhoOm1tWzpzc1subm5uXV0gbm90YXRpb24uXG5cdCAqIEBwYXJhbSBmdWxsIElmIHRydWUsIHRoZW4gYWxsIGZpZWxkcyBhcmUgYWx3YXlzIHByZXNlbnQgZXhjZXB0IHRoZSBzaWduLiBPdGhlcndpc2UsIHNlY29uZHMgYW5kIG1pbGxpc2Vjb25kc1xuXHQgKiAgICAgICAgICAgICBhcmUgY2hvcHBlZCBvZmYgaWYgemVyb1xuXHQgKi9cblx0cHVibGljIHRvSG1zU3RyaW5nKGZ1bGw6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG5cdFx0bGV0IHJlc3VsdDogc3RyaW5nID0gXCJcIjtcblx0XHRpZiAoZnVsbCB8fCB0aGlzLm1pbGxpc2Vjb25kKCkgPiAwKSB7XG5cdFx0XHRyZXN1bHQgPSBcIi5cIiArIHN0cmluZ3MucGFkTGVmdCh0aGlzLm1pbGxpc2Vjb25kKCkudG9TdHJpbmcoMTApLCAzLCBcIjBcIik7XG5cdFx0fVxuXHRcdGlmIChmdWxsIHx8IHJlc3VsdC5sZW5ndGggPiAwIHx8IHRoaXMuc2Vjb25kKCkgPiAwKSB7XG5cdFx0XHRyZXN1bHQgPSBcIjpcIiArIHN0cmluZ3MucGFkTGVmdCh0aGlzLnNlY29uZCgpLnRvU3RyaW5nKDEwKSwgMiwgXCIwXCIpICsgcmVzdWx0O1xuXHRcdH1cblx0XHRpZiAoZnVsbCB8fCByZXN1bHQubGVuZ3RoID4gMCB8fCB0aGlzLm1pbnV0ZSgpID4gMCkge1xuXHRcdFx0cmVzdWx0ID0gXCI6XCIgKyBzdHJpbmdzLnBhZExlZnQodGhpcy5taW51dGUoKS50b1N0cmluZygxMCksIDIsIFwiMFwiKSArIHJlc3VsdDtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuc2lnbigpICsgc3RyaW5ncy5wYWRMZWZ0KHRoaXMud2hvbGVIb3VycygpLnRvU3RyaW5nKDEwKSwgMiwgXCIwXCIpICsgcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0cmluZyBpbiBJU08gODYwMSBub3RhdGlvbiBlLmcuICdQMU0nIGZvciBvbmUgbW9udGggb3IgJ1BUMU0nIGZvciBvbmUgbWludXRlXG5cdCAqL1xuXHRwdWJsaWMgdG9Jc29TdHJpbmcoKTogc3RyaW5nIHtcblx0XHRzd2l0Y2ggKHRoaXMuX3VuaXQpIHtcblx0XHRcdGNhc2UgVGltZVVuaXQuTWlsbGlzZWNvbmQ6IHtcblx0XHRcdFx0cmV0dXJuIFwiUFwiICsgKHRoaXMuX2Ftb3VudCAvIDEwMDApLnRvRml4ZWQoMykgKyBcIlNcIjtcblx0XHRcdH1cblx0XHRcdGNhc2UgVGltZVVuaXQuU2Vjb25kOiB7XG5cdFx0XHRcdHJldHVybiBcIlBcIiArIHRoaXMuX2Ftb3VudC50b1N0cmluZygxMCkgKyBcIlNcIjtcblx0XHRcdH1cblx0XHRcdGNhc2UgVGltZVVuaXQuTWludXRlOiB7XG5cdFx0XHRcdHJldHVybiBcIlBUXCIgKyB0aGlzLl9hbW91bnQudG9TdHJpbmcoMTApICsgXCJNXCI7IC8vIG5vdGUgdGhlIFwiVFwiIHRvIGRpc2FtYmlndWF0ZSB0aGUgXCJNXCJcblx0XHRcdH1cblx0XHRcdGNhc2UgVGltZVVuaXQuSG91cjoge1xuXHRcdFx0XHRyZXR1cm4gXCJQXCIgKyB0aGlzLl9hbW91bnQudG9TdHJpbmcoMTApICsgXCJIXCI7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFRpbWVVbml0LkRheToge1xuXHRcdFx0XHRyZXR1cm4gXCJQXCIgKyB0aGlzLl9hbW91bnQudG9TdHJpbmcoMTApICsgXCJEXCI7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFRpbWVVbml0LldlZWs6IHtcblx0XHRcdFx0cmV0dXJuIFwiUFwiICsgdGhpcy5fYW1vdW50LnRvU3RyaW5nKDEwKSArIFwiV1wiO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBUaW1lVW5pdC5Nb250aDoge1xuXHRcdFx0XHRyZXR1cm4gXCJQXCIgKyB0aGlzLl9hbW91bnQudG9TdHJpbmcoMTApICsgXCJNXCI7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFRpbWVVbml0LlllYXI6IHtcblx0XHRcdFx0cmV0dXJuIFwiUFwiICsgdGhpcy5fYW1vdW50LnRvU3RyaW5nKDEwKSArIFwiWVwiO1xuXHRcdFx0fVxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gcGVyaW9kIHVuaXQuXCIpO1xuXHRcdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFN0cmluZyByZXByZXNlbnRhdGlvbiB3aXRoIGFtb3VudCBhbmQgdW5pdCBlLmcuICcxLjUgeWVhcnMnIG9yICctMSBkYXknXG5cdCAqL1xuXHRwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5fYW1vdW50LnRvU3RyaW5nKDEwKSArIFwiIFwiICsgYmFzaWNzLnRpbWVVbml0VG9TdHJpbmcodGhpcy5fdW5pdCwgdGhpcy5fYW1vdW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdmFsdWVPZigpIG1ldGhvZCByZXR1cm5zIHRoZSBwcmltaXRpdmUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgdmFsdWVPZigpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLm1pbGxpc2Vjb25kcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiB0aGlzICUgdW5pdCwgYWx3YXlzIHBvc2l0aXZlXG5cdCAqL1xuXHRwcml2YXRlIF9wYXJ0KHVuaXQ6IFRpbWVVbml0KTogbnVtYmVyIHtcblx0XHRsZXQgbmV4dFVuaXQ6IFRpbWVVbml0O1xuXHRcdC8vIG5vdGUgbm90IGFsbCB1bml0cyBhcmUgdXNlZCBoZXJlOiBXZWVrcyBhbmQgWWVhcnMgYXJlIHJ1bGVkIG91dFxuXHRcdHN3aXRjaCAodW5pdCkge1xuXHRcdFx0Y2FzZSBUaW1lVW5pdC5NaWxsaXNlY29uZDogbmV4dFVuaXQgPSBUaW1lVW5pdC5TZWNvbmQ7IGJyZWFrO1xuXHRcdFx0Y2FzZSBUaW1lVW5pdC5TZWNvbmQ6IG5leHRVbml0ID0gVGltZVVuaXQuTWludXRlOyBicmVhaztcblx0XHRcdGNhc2UgVGltZVVuaXQuTWludXRlOiBuZXh0VW5pdCA9IFRpbWVVbml0LkhvdXI7IGJyZWFrO1xuXHRcdFx0Y2FzZSBUaW1lVW5pdC5Ib3VyOiBuZXh0VW5pdCA9IFRpbWVVbml0LkRheTsgYnJlYWs7XG5cdFx0XHRjYXNlIFRpbWVVbml0LkRheTogbmV4dFVuaXQgPSBUaW1lVW5pdC5Nb250aDsgYnJlYWs7XG5cdFx0XHRjYXNlIFRpbWVVbml0Lk1vbnRoOiBuZXh0VW5pdCA9IFRpbWVVbml0LlllYXI7IGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5hYnModGhpcy5hcyhUaW1lVW5pdC5ZZWFyKSkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG1zZWNzID0gKGJhc2ljcy50aW1lVW5pdFRvTWlsbGlzZWNvbmRzKHRoaXMuX3VuaXQpICogTWF0aC5hYnModGhpcy5fYW1vdW50KSkgJSBiYXNpY3MudGltZVVuaXRUb01pbGxpc2Vjb25kcyhuZXh0VW5pdCk7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IobXNlY3MgLyBiYXNpY3MudGltZVVuaXRUb01pbGxpc2Vjb25kcyh1bml0KSk7XG5cdH1cblxuXG5cdHByaXZhdGUgX2Zyb21TdHJpbmcoczogc3RyaW5nKTogdm9pZCB7XG5cdFx0Y29uc3QgdHJpbW1lZCA9IHMudHJpbSgpO1xuXHRcdGlmICh0cmltbWVkLm1hdGNoKC9eLT9cXGRcXGQ/KDpcXGRcXGQ/KDpcXGRcXGQ/KC5cXGRcXGQ/XFxkPyk/KT8pPyQvKSkge1xuXHRcdFx0bGV0IHNpZ246IG51bWJlciA9IDE7XG5cdFx0XHRsZXQgaG91cnM6IG51bWJlciA9IDA7XG5cdFx0XHRsZXQgbWludXRlczogbnVtYmVyID0gMDtcblx0XHRcdGxldCBzZWNvbmRzOiBudW1iZXIgPSAwO1xuXHRcdFx0bGV0IG1pbGxpc2Vjb25kczogbnVtYmVyID0gMDtcblx0XHRcdGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IHRyaW1tZWQuc3BsaXQoXCI6XCIpO1xuXHRcdFx0YXNzZXJ0KHBhcnRzLmxlbmd0aCA+IDAgJiYgcGFydHMubGVuZ3RoIDwgNCwgXCJOb3QgYSBwcm9wZXIgdGltZSBkdXJhdGlvbiBzdHJpbmc6IFxcXCJcIiArIHRyaW1tZWQgKyBcIlxcXCJcIik7XG5cdFx0XHRpZiAodHJpbW1lZC5jaGFyQXQoMCkgPT09IFwiLVwiKSB7XG5cdFx0XHRcdHNpZ24gPSAtMTtcblx0XHRcdFx0cGFydHNbMF0gPSBwYXJ0c1swXS5zdWJzdHIoMSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGFydHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRob3VycyA9ICtwYXJ0c1swXTtcblx0XHRcdH1cblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdG1pbnV0ZXMgPSArcGFydHNbMV07XG5cdFx0XHR9XG5cdFx0XHRpZiAocGFydHMubGVuZ3RoID4gMikge1xuXHRcdFx0XHRjb25zdCBzZWNvbmRQYXJ0cyA9IHBhcnRzWzJdLnNwbGl0KFwiLlwiKTtcblx0XHRcdFx0c2Vjb25kcyA9ICtzZWNvbmRQYXJ0c1swXTtcblx0XHRcdFx0aWYgKHNlY29uZFBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRtaWxsaXNlY29uZHMgPSArc3RyaW5ncy5wYWRSaWdodChzZWNvbmRQYXJ0c1sxXSwgMywgXCIwXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBhbW91bnRNc2VjID0gc2lnbiAqIE1hdGgucm91bmQobWlsbGlzZWNvbmRzICsgMTAwMCAqIHNlY29uZHMgKyA2MDAwMCAqIG1pbnV0ZXMgKyAzNjAwMDAwICogaG91cnMpO1xuXHRcdFx0Ly8gZmluZCBsb3dlc3Qgbm9uLXplcm8gbnVtYmVyIGFuZCB0YWtlIHRoYXQgYXMgdW5pdFxuXHRcdFx0aWYgKG1pbGxpc2Vjb25kcyAhPT0gMCkge1xuXHRcdFx0XHR0aGlzLl91bml0ID0gVGltZVVuaXQuTWlsbGlzZWNvbmQ7XG5cdFx0XHR9IGVsc2UgaWYgKHNlY29uZHMgIT09IDApIHtcblx0XHRcdFx0dGhpcy5fdW5pdCA9IFRpbWVVbml0LlNlY29uZDtcblx0XHRcdH0gZWxzZSBpZiAobWludXRlcyAhPT0gMCkge1xuXHRcdFx0XHR0aGlzLl91bml0ID0gVGltZVVuaXQuTWludXRlO1xuXHRcdFx0fSBlbHNlIGlmIChob3VycyAhPT0gMCkge1xuXHRcdFx0XHR0aGlzLl91bml0ID0gVGltZVVuaXQuSG91cjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3VuaXQgPSBUaW1lVW5pdC5NaWxsaXNlY29uZDtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2Ftb3VudCA9IGFtb3VudE1zZWMgLyBiYXNpY3MudGltZVVuaXRUb01pbGxpc2Vjb25kcyh0aGlzLl91bml0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3Qgc3BsaXQgPSB0cmltbWVkLnRvTG93ZXJDYXNlKCkuc3BsaXQoXCIgXCIpO1xuXHRcdFx0aWYgKHNwbGl0Lmxlbmd0aCAhPT0gMikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWUgc3RyaW5nICdcIiArIHMgKyBcIidcIik7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBhbW91bnQgPSBwYXJzZUZsb2F0KHNwbGl0WzBdKTtcblx0XHRcdGFzc2VydCghaXNOYU4oYW1vdW50KSwgXCJJbnZhbGlkIHRpbWUgc3RyaW5nICdcIiArIHMgKyBcIicsIGNhbm5vdCBwYXJzZSBhbW91bnRcIik7XG5cdFx0XHRhc3NlcnQoaXNGaW5pdGUoYW1vdW50KSwgXCJJbnZhbGlkIHRpbWUgc3RyaW5nICdcIiArIHMgKyBcIicsIGFtb3VudCBpcyBpbmZpbml0ZVwiKTtcblx0XHRcdHRoaXMuX2Ftb3VudCA9IGFtb3VudDtcblx0XHRcdHRoaXMuX3VuaXQgPSBiYXNpY3Muc3RyaW5nVG9UaW1lVW5pdChzcGxpdFsxXSk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgZ2l2ZW4gb2JqZWN0IGlzIG9mIHR5cGUgRHVyYXRpb24uIE5vdGUgdGhhdCBpdCBkb2VzIG5vdCB3b3JrIGZvciBzdWIgY2xhc3Nlcy4gSG93ZXZlciwgdXNlIHRoaXMgdG8gYmUgcm9idXN0XG4gKiBhZ2FpbnN0IGRpZmZlcmVudCB2ZXJzaW9ucyBvZiB0aGUgbGlicmFyeSBpbiBvbmUgcHJvY2VzcyBpbnN0ZWFkIG9mIGluc3RhbmNlb2ZcbiAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBjaGVja1xuICogQHRocm93cyBub3RoaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0R1cmF0aW9uKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBEdXJhdGlvbiB7XG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUua2luZCA9PT0gXCJEdXJhdGlvblwiO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBBQkIgU3dpdHplcmxhbmQgTHRkLlxuICpcbiAqIEZ1bmN0aW9uYWxpdHkgdG8gcGFyc2UgYSBEYXRlVGltZSBvYmplY3QgdG8gYSBzdHJpbmdcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgVGltZVN0cnVjdCB9IGZyb20gXCIuL2Jhc2ljc1wiO1xuaW1wb3J0ICogYXMgYmFzaWNzIGZyb20gXCIuL2Jhc2ljc1wiO1xuaW1wb3J0IHsgREVGQVVMVF9MT0NBTEUsIExvY2FsZSwgUGFydGlhbExvY2FsZSB9IGZyb20gXCIuL2xvY2FsZVwiO1xuaW1wb3J0ICogYXMgc3RyaW5ncyBmcm9tIFwiLi9zdHJpbmdzXCI7XG5pbXBvcnQgeyBUaW1lWm9uZSB9IGZyb20gXCIuL3RpbWV6b25lXCI7XG5pbXBvcnQgeyBUb2tlbiwgdG9rZW5pemUsIFRva2VuVHlwZSB9IGZyb20gXCIuL3Rva2VuXCI7XG5cblxuLyoqXG4gKiBGb3JtYXQgdGhlIHN1cHBsaWVkIGRhdGVUaW1lIHdpdGggdGhlIGZvcm1hdHRpbmcgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSBkYXRlVGltZSBUaGUgY3VycmVudCB0aW1lIHRvIGZvcm1hdFxuICogQHBhcmFtIHV0Y1RpbWUgVGhlIHRpbWUgaW4gVVRDXG4gKiBAcGFyYW0gbG9jYWxab25lIFRoZSB6b25lIHRoYXQgY3VycmVudFRpbWUgaXMgaW5cbiAqIEBwYXJhbSBmb3JtYXRTdHJpbmcgVGhlIExETUwgZm9ybWF0IHBhdHRlcm4gKHNlZSBMRE1MLm1kKVxuICogQHBhcmFtIGxvY2FsZSBPdGhlciBmb3JtYXQgb3B0aW9ucyBzdWNoIGFzIG1vbnRoIG5hbWVzXG4gKiBAcmV0dXJuIHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0KFxuXHRkYXRlVGltZTogVGltZVN0cnVjdCxcblx0dXRjVGltZTogVGltZVN0cnVjdCxcblx0bG9jYWxab25lOiBUaW1lWm9uZSB8IHVuZGVmaW5lZCB8IG51bGwsXG5cdGZvcm1hdFN0cmluZzogc3RyaW5nLFxuXHRsb2NhbGU6IFBhcnRpYWxMb2NhbGUgPSB7fVxuKTogc3RyaW5nIHtcblx0Y29uc3QgbWVyZ2VkTG9jYWxlOiBMb2NhbGUgPSB7XG5cdFx0Li4uREVGQVVMVF9MT0NBTEUsXG5cdFx0Li4ubG9jYWxlXG5cdH07XG5cblx0Y29uc3QgdG9rZW5zOiBUb2tlbltdID0gdG9rZW5pemUoZm9ybWF0U3RyaW5nKTtcblx0bGV0IHJlc3VsdDogc3RyaW5nID0gXCJcIjtcblx0Zm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpIHtcblx0XHRsZXQgdG9rZW5SZXN1bHQ6IHN0cmluZztcblx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcblx0XHRcdGNhc2UgVG9rZW5UeXBlLkVSQTpcblx0XHRcdFx0dG9rZW5SZXN1bHQgPSBfZm9ybWF0RXJhKGRhdGVUaW1lLCB0b2tlbiwgbWVyZ2VkTG9jYWxlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFRva2VuVHlwZS5ZRUFSOlxuXHRcdFx0XHR0b2tlblJlc3VsdCA9IF9mb3JtYXRZZWFyKGRhdGVUaW1lLCB0b2tlbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBUb2tlblR5cGUuUVVBUlRFUjpcblx0XHRcdFx0dG9rZW5SZXN1bHQgPSBfZm9ybWF0UXVhcnRlcihkYXRlVGltZSwgdG9rZW4sIG1lcmdlZExvY2FsZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBUb2tlblR5cGUuTU9OVEg6XG5cdFx0XHRcdHRva2VuUmVzdWx0ID0gX2Zvcm1hdE1vbnRoKGRhdGVUaW1lLCB0b2tlbiwgbWVyZ2VkTG9jYWxlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFRva2VuVHlwZS5EQVk6XG5cdFx0XHRcdHRva2VuUmVzdWx0ID0gX2Zvcm1hdERheShkYXRlVGltZSwgdG9rZW4pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVG9rZW5UeXBlLldFRUtEQVk6XG5cdFx0XHRcdHRva2VuUmVzdWx0ID0gX2Zvcm1hdFdlZWtkYXkoZGF0ZVRpbWUsIHRva2VuLCBtZXJnZWRMb2NhbGUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVG9rZW5UeXBlLkRBWVBFUklPRDpcblx0XHRcdFx0dG9rZW5SZXN1bHQgPSBfZm9ybWF0RGF5UGVyaW9kKGRhdGVUaW1lLCB0b2tlbiwgbWVyZ2VkTG9jYWxlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFRva2VuVHlwZS5IT1VSOlxuXHRcdFx0XHR0b2tlblJlc3VsdCA9IF9mb3JtYXRIb3VyKGRhdGVUaW1lLCB0b2tlbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBUb2tlblR5cGUuTUlOVVRFOlxuXHRcdFx0XHR0b2tlblJlc3VsdCA9IF9mb3JtYXRNaW51dGUoZGF0ZVRpbWUsIHRva2VuKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFRva2VuVHlwZS5TRUNPTkQ6XG5cdFx0XHRcdHRva2VuUmVzdWx0ID0gX2Zvcm1hdFNlY29uZChkYXRlVGltZSwgdG9rZW4pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVG9rZW5UeXBlLlpPTkU6XG5cdFx0XHRcdHRva2VuUmVzdWx0ID0gX2Zvcm1hdFpvbmUoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSA/IGxvY2FsWm9uZSA6IHVuZGVmaW5lZCwgdG9rZW4pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVG9rZW5UeXBlLldFRUs6XG5cdFx0XHRcdHRva2VuUmVzdWx0ID0gX2Zvcm1hdFdlZWsoZGF0ZVRpbWUsIHRva2VuKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFRva2VuVHlwZS5JREVOVElUWTogLy8gaW50ZW50aW9uYWwgZmFsbHRocm91Z2hcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0b2tlblJlc3VsdCA9IHRva2VuLnJhdztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHJlc3VsdCArPSB0b2tlblJlc3VsdDtcblx0fVxuXG5cdHJldHVybiByZXN1bHQudHJpbSgpO1xufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgZXJhIChCQyBvciBBRClcbiAqXG4gKiBAcGFyYW0gZGF0ZVRpbWUgVGhlIGN1cnJlbnQgdGltZSB0byBmb3JtYXRcbiAqIEBwYXJhbSB0b2tlbiBUaGUgdG9rZW4gcGFzc2VkXG4gKiBAcmV0dXJuIHN0cmluZ1xuICovXG5mdW5jdGlvbiBfZm9ybWF0RXJhKGRhdGVUaW1lOiBUaW1lU3RydWN0LCB0b2tlbjogVG9rZW4sIGxvY2FsZTogTG9jYWxlKTogc3RyaW5nIHtcblx0Y29uc3QgQUQ6IGJvb2xlYW4gPSBkYXRlVGltZS55ZWFyID4gMDtcblx0c3dpdGNoICh0b2tlbi5sZW5ndGgpIHtcblx0XHRjYXNlIDE6XG5cdFx0Y2FzZSAyOlxuXHRcdGNhc2UgMzpcblx0XHRcdHJldHVybiAoQUQgPyBsb2NhbGUuZXJhQWJicmV2aWF0ZWRbMF0gOiBsb2NhbGUuZXJhQWJicmV2aWF0ZWRbMV0pO1xuXHRcdGNhc2UgNDpcblx0XHRcdHJldHVybiAoQUQgPyBsb2NhbGUuZXJhV2lkZVswXSA6IGxvY2FsZS5lcmFXaWRlWzFdKTtcblx0XHRjYXNlIDU6XG5cdFx0XHRyZXR1cm4gKEFEID8gbG9jYWxlLmVyYU5hcnJvd1swXSA6IGxvY2FsZS5lcmFOYXJyb3dbMV0pO1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vIHRva2VuaXplciBzaG91bGQgcHJldmVudCB0aGlzXG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0cmV0dXJuIHRva2VuLnJhdztcblx0fVxufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgeWVhclxuICpcbiAqIEBwYXJhbSBkYXRlVGltZSBUaGUgY3VycmVudCB0aW1lIHRvIGZvcm1hdFxuICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBwYXNzZWRcbiAqIEByZXR1cm4gc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIF9mb3JtYXRZZWFyKGRhdGVUaW1lOiBUaW1lU3RydWN0LCB0b2tlbjogVG9rZW4pOiBzdHJpbmcge1xuXHRzd2l0Y2ggKHRva2VuLnN5bWJvbCkge1xuXHRcdGNhc2UgXCJ5XCI6XG5cdFx0Y2FzZSBcIllcIjpcblx0XHRjYXNlIFwiclwiOlxuXHRcdFx0bGV0IHllYXJWYWx1ZSA9IHN0cmluZ3MucGFkTGVmdChkYXRlVGltZS55ZWFyLnRvU3RyaW5nKCksIHRva2VuLmxlbmd0aCwgXCIwXCIpO1xuXHRcdFx0aWYgKHRva2VuLmxlbmd0aCA9PT0gMikgeyAvLyBTcGVjaWFsIGNhc2U6IGV4YWN0bHkgdHdvIGNoYXJhY3RlcnMgYXJlIGV4cGVjdGVkXG5cdFx0XHRcdHllYXJWYWx1ZSA9IHllYXJWYWx1ZS5zbGljZSgtMik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4geWVhclZhbHVlO1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vIHRva2VuaXplciBzaG91bGQgcHJldmVudCB0aGlzXG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0cmV0dXJuIHRva2VuLnJhdztcblx0fVxufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgcXVhcnRlclxuICpcbiAqIEBwYXJhbSBkYXRlVGltZSBUaGUgY3VycmVudCB0aW1lIHRvIGZvcm1hdFxuICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBwYXNzZWRcbiAqIEByZXR1cm4gc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIF9mb3JtYXRRdWFydGVyKGRhdGVUaW1lOiBUaW1lU3RydWN0LCB0b2tlbjogVG9rZW4sIGxvY2FsZTogTG9jYWxlKTogc3RyaW5nIHtcblx0Y29uc3QgcXVhcnRlciA9IE1hdGguY2VpbChkYXRlVGltZS5tb250aCAvIDMpO1xuXHRzd2l0Y2ggKHRva2VuLnN5bWJvbCkge1xuXHRcdGNhc2UgXCJRXCI6XG5cdFx0XHRzd2l0Y2ggKHRva2VuLmxlbmd0aCkge1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRyZXR1cm4gc3RyaW5ncy5wYWRMZWZ0KHF1YXJ0ZXIudG9TdHJpbmcoKSwgMiwgXCIwXCIpO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5xdWFydGVyTGV0dGVyICsgcXVhcnRlcjtcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJldHVybiBsb2NhbGUucXVhcnRlckFiYnJldmlhdGlvbnNbcXVhcnRlciAtIDFdICsgXCIgXCIgKyBsb2NhbGUucXVhcnRlcldvcmQ7XG5cdFx0XHRcdGNhc2UgNTpcblx0XHRcdFx0XHRyZXR1cm4gcXVhcnRlci50b1N0cmluZygpO1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vIHRva2VuaXplciBzaG91bGQgcHJldmVudCB0aGlzXG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRyZXR1cm4gdG9rZW4ucmF3O1xuXHRcdFx0fVxuXHRcdGNhc2UgXCJxXCI6XG5cdFx0XHRzd2l0Y2ggKHRva2VuLmxlbmd0aCkge1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRyZXR1cm4gc3RyaW5ncy5wYWRMZWZ0KHF1YXJ0ZXIudG9TdHJpbmcoKSwgMiwgXCIwXCIpO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5zdGFuZEFsb25lUXVhcnRlckxldHRlciArIHF1YXJ0ZXI7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLnN0YW5kQWxvbmVRdWFydGVyQWJicmV2aWF0aW9uc1txdWFydGVyIC0gMV0gKyBcIiBcIiArIGxvY2FsZS5zdGFuZEFsb25lUXVhcnRlcldvcmQ7XG5cdFx0XHRcdGNhc2UgNTpcblx0XHRcdFx0XHRyZXR1cm4gcXVhcnRlci50b1N0cmluZygpO1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vIHRva2VuaXplciBzaG91bGQgcHJldmVudCB0aGlzXG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRyZXR1cm4gdG9rZW4ucmF3O1xuXHRcdFx0fVxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHF1YXJ0ZXIgcGF0dGVyblwiKTtcblx0fVxufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgbW9udGhcbiAqXG4gKiBAcGFyYW0gZGF0ZVRpbWUgVGhlIGN1cnJlbnQgdGltZSB0byBmb3JtYXRcbiAqIEBwYXJhbSB0b2tlbiBUaGUgdG9rZW4gcGFzc2VkXG4gKiBAcmV0dXJuIHN0cmluZ1xuICovXG5mdW5jdGlvbiBfZm9ybWF0TW9udGgoZGF0ZVRpbWU6IFRpbWVTdHJ1Y3QsIHRva2VuOiBUb2tlbiwgbG9jYWxlOiBMb2NhbGUpOiBzdHJpbmcge1xuXHRzd2l0Y2ggKHRva2VuLnN5bWJvbCkge1xuXHRcdGNhc2UgXCJNXCI6XG5cdFx0XHRzd2l0Y2ggKHRva2VuLmxlbmd0aCkge1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRyZXR1cm4gc3RyaW5ncy5wYWRMZWZ0KGRhdGVUaW1lLm1vbnRoLnRvU3RyaW5nKCksIHRva2VuLmxlbmd0aCwgXCIwXCIpO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5zaG9ydE1vbnRoTmFtZXNbZGF0ZVRpbWUubW9udGggLSAxXTtcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJldHVybiBsb2NhbGUubG9uZ01vbnRoTmFtZXNbZGF0ZVRpbWUubW9udGggLSAxXTtcblx0XHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRcdHJldHVybiBsb2NhbGUubW9udGhMZXR0ZXJzW2RhdGVUaW1lLm1vbnRoIC0gMV07XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly8gdG9rZW5pemVyIHNob3VsZCBwcmV2ZW50IHRoaXNcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRcdHJldHVybiB0b2tlbi5yYXc7XG5cdFx0XHR9XG5cdFx0Y2FzZSBcIkxcIjpcblx0XHRcdHN3aXRjaCAodG9rZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHJldHVybiBzdHJpbmdzLnBhZExlZnQoZGF0ZVRpbWUubW9udGgudG9TdHJpbmcoKSwgdG9rZW4ubGVuZ3RoLCBcIjBcIik7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLnN0YW5kQWxvbmVTaG9ydE1vbnRoTmFtZXNbZGF0ZVRpbWUubW9udGggLSAxXTtcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJldHVybiBsb2NhbGUuc3RhbmRBbG9uZUxvbmdNb250aE5hbWVzW2RhdGVUaW1lLm1vbnRoIC0gMV07XG5cdFx0XHRcdGNhc2UgNTpcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLnN0YW5kQWxvbmVNb250aExldHRlcnNbZGF0ZVRpbWUubW9udGggLSAxXTtcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvLyB0b2tlbml6ZXIgc2hvdWxkIHByZXZlbnQgdGhpc1xuXHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdFx0cmV0dXJuIHRva2VuLnJhdztcblx0XHRcdH1cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBtb250aCBwYXR0ZXJuXCIpO1xuXHR9XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSB3ZWVrIG51bWJlclxuICpcbiAqIEBwYXJhbSBkYXRlVGltZSBUaGUgY3VycmVudCB0aW1lIHRvIGZvcm1hdFxuICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBwYXNzZWRcbiAqIEByZXR1cm4gc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIF9mb3JtYXRXZWVrKGRhdGVUaW1lOiBUaW1lU3RydWN0LCB0b2tlbjogVG9rZW4pOiBzdHJpbmcge1xuXHRpZiAodG9rZW4uc3ltYm9sID09PSBcIndcIikge1xuXHRcdHJldHVybiBzdHJpbmdzLnBhZExlZnQoYmFzaWNzLndlZWtOdW1iZXIoZGF0ZVRpbWUueWVhciwgZGF0ZVRpbWUubW9udGgsIGRhdGVUaW1lLmRheSkudG9TdHJpbmcoKSwgdG9rZW4ubGVuZ3RoLCBcIjBcIik7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHN0cmluZ3MucGFkTGVmdChiYXNpY3Mud2Vla09mTW9udGgoZGF0ZVRpbWUueWVhciwgZGF0ZVRpbWUubW9udGgsIGRhdGVUaW1lLmRheSkudG9TdHJpbmcoKSwgdG9rZW4ubGVuZ3RoLCBcIjBcIik7XG5cdH1cbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIGRheSBvZiB0aGUgbW9udGggKG9yIHllYXIpXG4gKlxuICogQHBhcmFtIGRhdGVUaW1lIFRoZSBjdXJyZW50IHRpbWUgdG8gZm9ybWF0XG4gKiBAcGFyYW0gdG9rZW4gVGhlIHRva2VuIHBhc3NlZFxuICogQHJldHVybiBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gX2Zvcm1hdERheShkYXRlVGltZTogVGltZVN0cnVjdCwgdG9rZW46IFRva2VuKTogc3RyaW5nIHtcblx0c3dpdGNoICh0b2tlbi5zeW1ib2wpIHtcblx0XHRjYXNlIFwiZFwiOlxuXHRcdFx0cmV0dXJuIHN0cmluZ3MucGFkTGVmdChkYXRlVGltZS5kYXkudG9TdHJpbmcoKSwgdG9rZW4ubGVuZ3RoLCBcIjBcIik7XG5cdFx0Y2FzZSBcIkRcIjpcblx0XHRcdGNvbnN0IGRheU9mWWVhciA9IGJhc2ljcy5kYXlPZlllYXIoZGF0ZVRpbWUueWVhciwgZGF0ZVRpbWUubW9udGgsIGRhdGVUaW1lLmRheSkgKyAxO1xuXHRcdFx0cmV0dXJuIHN0cmluZ3MucGFkTGVmdChkYXlPZlllYXIudG9TdHJpbmcoKSwgdG9rZW4ubGVuZ3RoLCBcIjBcIik7XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly8gdG9rZW5pemVyIHNob3VsZCBwcmV2ZW50IHRoaXNcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRyZXR1cm4gdG9rZW4ucmF3O1xuXHR9XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSBkYXkgb2YgdGhlIHdlZWtcbiAqXG4gKiBAcGFyYW0gZGF0ZVRpbWUgVGhlIGN1cnJlbnQgdGltZSB0byBmb3JtYXRcbiAqIEBwYXJhbSB0b2tlbiBUaGUgdG9rZW4gcGFzc2VkXG4gKiBAcmV0dXJuIHN0cmluZ1xuICovXG5mdW5jdGlvbiBfZm9ybWF0V2Vla2RheShkYXRlVGltZTogVGltZVN0cnVjdCwgdG9rZW46IFRva2VuLCBsb2NhbGU6IExvY2FsZSk6IHN0cmluZyB7XG5cdGNvbnN0IHdlZWtEYXlOdW1iZXIgPSBiYXNpY3Mud2Vla0RheU5vTGVhcFNlY3MoZGF0ZVRpbWUudW5peE1pbGxpcyk7XG5cblx0c3dpdGNoICh0b2tlbi5sZW5ndGgpIHtcblx0XHRjYXNlIDE6XG5cdFx0Y2FzZSAyOlxuXHRcdFx0aWYgKHRva2VuLnN5bWJvbCA9PT0gXCJlXCIpIHtcblx0XHRcdFx0cmV0dXJuIHN0cmluZ3MucGFkTGVmdChiYXNpY3Mud2Vla0RheU5vTGVhcFNlY3MoZGF0ZVRpbWUudW5peE1pbGxpcykudG9TdHJpbmcoKSwgdG9rZW4ubGVuZ3RoLCBcIjBcIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbG9jYWxlLnNob3J0V2Vla2RheU5hbWVzW3dlZWtEYXlOdW1iZXJdO1xuXHRcdFx0fVxuXHRcdGNhc2UgMzpcblx0XHRcdHJldHVybiBsb2NhbGUuc2hvcnRXZWVrZGF5TmFtZXNbd2Vla0RheU51bWJlcl07XG5cdFx0Y2FzZSA0OlxuXHRcdFx0cmV0dXJuIGxvY2FsZS5sb25nV2Vla2RheU5hbWVzW3dlZWtEYXlOdW1iZXJdO1xuXHRcdGNhc2UgNTpcblx0XHRcdHJldHVybiBsb2NhbGUud2Vla2RheUxldHRlcnNbd2Vla0RheU51bWJlcl07XG5cdFx0Y2FzZSA2OlxuXHRcdFx0cmV0dXJuIGxvY2FsZS53ZWVrZGF5VHdvTGV0dGVyc1t3ZWVrRGF5TnVtYmVyXTtcblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvLyB0b2tlbml6ZXIgc2hvdWxkIHByZXZlbnQgdGhpc1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdHJldHVybiB0b2tlbi5yYXc7XG5cdH1cbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIERheSBQZXJpb2QgKEFNIG9yIFBNKVxuICpcbiAqIEBwYXJhbSBkYXRlVGltZSBUaGUgY3VycmVudCB0aW1lIHRvIGZvcm1hdFxuICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBwYXNzZWRcbiAqIEByZXR1cm4gc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIF9mb3JtYXREYXlQZXJpb2QoZGF0ZVRpbWU6IFRpbWVTdHJ1Y3QsIHRva2VuOiBUb2tlbiwgbG9jYWxlOiBMb2NhbGUpOiBzdHJpbmcge1xuXHRzd2l0Y2ggKHRva2VuLnN5bWJvbCkge1xuXHRcdGNhc2UgXCJhXCI6IHtcblx0XHRcdGlmICh0b2tlbi5sZW5ndGggPD0gMykge1xuXHRcdFx0XHRpZiAoZGF0ZVRpbWUuaG91ciA8IDEyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5kYXlQZXJpb2RBYmJyZXZpYXRlZC5hbTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLmRheVBlcmlvZEFiYnJldmlhdGVkLnBtO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHRva2VuLmxlbmd0aCA9PT0gNCkge1xuXHRcdFx0XHRpZiAoZGF0ZVRpbWUuaG91ciA8IDEyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5kYXlQZXJpb2RXaWRlLmFtO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBsb2NhbGUuZGF5UGVyaW9kV2lkZS5wbTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGRhdGVUaW1lLmhvdXIgPCAxMikge1xuXHRcdFx0XHRcdHJldHVybiBsb2NhbGUuZGF5UGVyaW9kTmFycm93LmFtO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBsb2NhbGUuZGF5UGVyaW9kTmFycm93LnBtO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhc2UgXCJiXCI6XG5cdFx0Y2FzZSBcIkJcIjoge1xuXHRcdFx0aWYgKHRva2VuLmxlbmd0aCA8PSAzKSB7XG5cdFx0XHRcdGlmIChkYXRlVGltZS5ob3VyID09PSAwICYmIGRhdGVUaW1lLm1pbnV0ZSA9PT0gMCAmJiBkYXRlVGltZS5zZWNvbmQgPT09IDAgJiYgZGF0ZVRpbWUubWlsbGkgPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLmRheVBlcmlvZEFiYnJldmlhdGVkLm1pZG5pZ2h0O1xuXHRcdFx0XHR9IGVsc2UgaWYgKGRhdGVUaW1lLmhvdXIgPT09IDEyICYmIGRhdGVUaW1lLm1pbnV0ZSA9PT0gMCAmJiBkYXRlVGltZS5zZWNvbmQgPT09IDAgJiYgZGF0ZVRpbWUubWlsbGkgPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLmRheVBlcmlvZEFiYnJldmlhdGVkLm5vb247XG5cdFx0XHRcdH0gZWxzZSBpZiAoZGF0ZVRpbWUuaG91ciA8IDEyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5kYXlQZXJpb2RBYmJyZXZpYXRlZC5hbTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLmRheVBlcmlvZEFiYnJldmlhdGVkLnBtO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHRva2VuLmxlbmd0aCA9PT0gNCkge1xuXHRcdFx0XHRpZiAoZGF0ZVRpbWUuaG91ciA9PT0gMCAmJiBkYXRlVGltZS5taW51dGUgPT09IDAgJiYgZGF0ZVRpbWUuc2Vjb25kID09PSAwICYmIGRhdGVUaW1lLm1pbGxpID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5kYXlQZXJpb2RXaWRlLm1pZG5pZ2h0O1xuXHRcdFx0XHR9IGVsc2UgaWYgKGRhdGVUaW1lLmhvdXIgPT09IDEyICYmIGRhdGVUaW1lLm1pbnV0ZSA9PT0gMCAmJiBkYXRlVGltZS5zZWNvbmQgPT09IDAgJiYgZGF0ZVRpbWUubWlsbGkgPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLmRheVBlcmlvZFdpZGUubm9vbjtcblx0XHRcdFx0fSBlbHNlIGlmIChkYXRlVGltZS5ob3VyIDwgMTIpIHtcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxlLmRheVBlcmlvZFdpZGUuYW07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5kYXlQZXJpb2RXaWRlLnBtO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoZGF0ZVRpbWUuaG91ciA9PT0gMCAmJiBkYXRlVGltZS5taW51dGUgPT09IDAgJiYgZGF0ZVRpbWUuc2Vjb25kID09PSAwICYmIGRhdGVUaW1lLm1pbGxpID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5kYXlQZXJpb2ROYXJyb3cubWlkbmlnaHQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZGF0ZVRpbWUuaG91ciA9PT0gMTIgJiYgZGF0ZVRpbWUubWludXRlID09PSAwICYmIGRhdGVUaW1lLnNlY29uZCA9PT0gMCAmJiBkYXRlVGltZS5taWxsaSA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiBsb2NhbGUuZGF5UGVyaW9kTmFycm93Lm5vb247XG5cdFx0XHRcdH0gZWxzZSBpZiAoZGF0ZVRpbWUuaG91ciA8IDEyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5kYXlQZXJpb2ROYXJyb3cuYW07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxvY2FsZS5kYXlQZXJpb2ROYXJyb3cucG07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly8gdG9rZW5pemVyIHNob3VsZCBwcmV2ZW50IHRoaXNcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRyZXR1cm4gdG9rZW4ucmF3O1xuXHR9XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSBIb3VyXG4gKlxuICogQHBhcmFtIGRhdGVUaW1lIFRoZSBjdXJyZW50IHRpbWUgdG8gZm9ybWF0XG4gKiBAcGFyYW0gdG9rZW4gVGhlIHRva2VuIHBhc3NlZFxuICogQHJldHVybiBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gX2Zvcm1hdEhvdXIoZGF0ZVRpbWU6IFRpbWVTdHJ1Y3QsIHRva2VuOiBUb2tlbik6IHN0cmluZyB7XG5cdGxldCBob3VyID0gZGF0ZVRpbWUuaG91cjtcblx0c3dpdGNoICh0b2tlbi5zeW1ib2wpIHtcblx0XHRjYXNlIFwiaFwiOlxuXHRcdFx0aG91ciA9IGhvdXIgJSAxMjtcblx0XHRcdGlmIChob3VyID09PSAwKSB7XG5cdFx0XHRcdGhvdXIgPSAxMjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHJpbmdzLnBhZExlZnQoaG91ci50b1N0cmluZygpLCB0b2tlbi5sZW5ndGgsIFwiMFwiKTtcblx0XHRjYXNlIFwiSFwiOlxuXHRcdFx0cmV0dXJuIHN0cmluZ3MucGFkTGVmdChob3VyLnRvU3RyaW5nKCksIHRva2VuLmxlbmd0aCwgXCIwXCIpO1xuXHRcdGNhc2UgXCJLXCI6XG5cdFx0XHRob3VyID0gaG91ciAlIDEyO1xuXHRcdFx0cmV0dXJuIHN0cmluZ3MucGFkTGVmdChob3VyLnRvU3RyaW5nKCksIHRva2VuLmxlbmd0aCwgXCIwXCIpO1xuXHRcdGNhc2UgXCJrXCI6XG5cdFx0XHRpZiAoaG91ciA9PT0gMCkge1xuXHRcdFx0XHRob3VyID0gMjQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3RyaW5ncy5wYWRMZWZ0KGhvdXIudG9TdHJpbmcoKSwgdG9rZW4ubGVuZ3RoLCBcIjBcIik7XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly8gdG9rZW5pemVyIHNob3VsZCBwcmV2ZW50IHRoaXNcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRyZXR1cm4gdG9rZW4ucmF3O1xuXHR9XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSBtaW51dGVcbiAqXG4gKiBAcGFyYW0gZGF0ZVRpbWUgVGhlIGN1cnJlbnQgdGltZSB0byBmb3JtYXRcbiAqIEBwYXJhbSB0b2tlbiBUaGUgdG9rZW4gcGFzc2VkXG4gKiBAcmV0dXJuIHN0cmluZ1xuICovXG5mdW5jdGlvbiBfZm9ybWF0TWludXRlKGRhdGVUaW1lOiBUaW1lU3RydWN0LCB0b2tlbjogVG9rZW4pOiBzdHJpbmcge1xuXHRyZXR1cm4gc3RyaW5ncy5wYWRMZWZ0KGRhdGVUaW1lLm1pbnV0ZS50b1N0cmluZygpLCB0b2tlbi5sZW5ndGgsIFwiMFwiKTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIHNlY29uZHMgKG9yIGZyYWN0aW9uIG9mIGEgc2Vjb25kKVxuICpcbiAqIEBwYXJhbSBkYXRlVGltZSBUaGUgY3VycmVudCB0aW1lIHRvIGZvcm1hdFxuICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBwYXNzZWRcbiAqIEByZXR1cm4gc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIF9mb3JtYXRTZWNvbmQoZGF0ZVRpbWU6IFRpbWVTdHJ1Y3QsIHRva2VuOiBUb2tlbik6IHN0cmluZyB7XG5cdHN3aXRjaCAodG9rZW4uc3ltYm9sKSB7XG5cdFx0Y2FzZSBcInNcIjpcblx0XHRcdHJldHVybiBzdHJpbmdzLnBhZExlZnQoZGF0ZVRpbWUuc2Vjb25kLnRvU3RyaW5nKCksIHRva2VuLmxlbmd0aCwgXCIwXCIpO1xuXHRcdGNhc2UgXCJTXCI6XG5cdFx0XHRjb25zdCBmcmFjdGlvbiA9IGRhdGVUaW1lLm1pbGxpO1xuXHRcdFx0bGV0IGZyYWN0aW9uU3RyaW5nID0gc3RyaW5ncy5wYWRMZWZ0KGZyYWN0aW9uLnRvU3RyaW5nKCksIDMsIFwiMFwiKTtcblx0XHRcdGZyYWN0aW9uU3RyaW5nID0gc3RyaW5ncy5wYWRSaWdodChmcmFjdGlvblN0cmluZywgdG9rZW4ubGVuZ3RoLCBcIjBcIik7XG5cdFx0XHRyZXR1cm4gZnJhY3Rpb25TdHJpbmcuc2xpY2UoMCwgdG9rZW4ubGVuZ3RoKTtcblx0XHRjYXNlIFwiQVwiOlxuXHRcdFx0cmV0dXJuIHN0cmluZ3MucGFkTGVmdChiYXNpY3Muc2Vjb25kT2ZEYXkoZGF0ZVRpbWUuaG91ciwgZGF0ZVRpbWUubWludXRlLCBkYXRlVGltZS5zZWNvbmQpLnRvU3RyaW5nKCksIHRva2VuLmxlbmd0aCwgXCIwXCIpO1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vIHRva2VuaXplciBzaG91bGQgcHJldmVudCB0aGlzXG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0cmV0dXJuIHRva2VuLnJhdztcblx0fVxufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgdGltZSB6b25lLiBGb3IgdGhpcywgd2UgbmVlZCB0aGUgY3VycmVudCB0aW1lLCB0aGUgdGltZSBpbiBVVEMgYW5kIHRoZSB0aW1lIHpvbmVcbiAqIEBwYXJhbSBjdXJyZW50VGltZSBUaGUgdGltZSB0byBmb3JtYXRcbiAqIEBwYXJhbSB1dGNUaW1lIFRoZSB0aW1lIGluIFVUQ1xuICogQHBhcmFtIHpvbmUgVGhlIHRpbWV6b25lIGN1cnJlbnRUaW1lIGlzIGluXG4gKiBAcGFyYW0gdG9rZW4gVGhlIHRva2VuIHBhc3NlZFxuICogQHJldHVybiBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gX2Zvcm1hdFpvbmUoY3VycmVudFRpbWU6IFRpbWVTdHJ1Y3QsIHV0Y1RpbWU6IFRpbWVTdHJ1Y3QsIHpvbmU6IFRpbWVab25lIHwgdW5kZWZpbmVkLCB0b2tlbjogVG9rZW4pOiBzdHJpbmcge1xuXHRpZiAoIXpvbmUpIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXHRjb25zdCBvZmZzZXQgPSBNYXRoLnJvdW5kKChjdXJyZW50VGltZS51bml4TWlsbGlzIC0gdXRjVGltZS51bml4TWlsbGlzKSAvIDYwMDAwKTtcblxuXHRjb25zdCBvZmZzZXRIb3VyczogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmFicyhvZmZzZXQpIC8gNjApO1xuXHRsZXQgb2Zmc2V0SG91cnNTdHJpbmcgPSBzdHJpbmdzLnBhZExlZnQob2Zmc2V0SG91cnMudG9TdHJpbmcoKSwgMiwgXCIwXCIpO1xuXHRvZmZzZXRIb3Vyc1N0cmluZyA9IChvZmZzZXQgPj0gMCA/IFwiK1wiICsgb2Zmc2V0SG91cnNTdHJpbmcgOiBcIi1cIiArIG9mZnNldEhvdXJzU3RyaW5nKTtcblx0Y29uc3Qgb2Zmc2V0TWludXRlcyA9IE1hdGguYWJzKG9mZnNldCAlIDYwKTtcblx0Y29uc3Qgb2Zmc2V0TWludXRlc1N0cmluZyA9IHN0cmluZ3MucGFkTGVmdChvZmZzZXRNaW51dGVzLnRvU3RyaW5nKCksIDIsIFwiMFwiKTtcblx0bGV0IHJlc3VsdDogc3RyaW5nO1xuXG5cdHN3aXRjaCAodG9rZW4uc3ltYm9sKSB7XG5cdFx0Y2FzZSBcIk9cIjpcblx0XHRcdHJlc3VsdCA9IFwiR01UXCI7XG5cdFx0XHRpZiAob2Zmc2V0ID49IDApIHtcblx0XHRcdFx0cmVzdWx0ICs9IFwiK1wiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ICs9IFwiLVwiO1xuXHRcdFx0fVxuXHRcdFx0cmVzdWx0ICs9IG9mZnNldEhvdXJzLnRvU3RyaW5nKCk7XG5cdFx0XHRpZiAodG9rZW4ubGVuZ3RoID49IDQgfHwgb2Zmc2V0TWludXRlcyAhPT0gMCkge1xuXHRcdFx0XHRyZXN1bHQgKz0gXCI6XCIgKyBvZmZzZXRNaW51dGVzU3RyaW5nO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRva2VuLmxlbmd0aCA+IDQpIHtcblx0XHRcdFx0cmVzdWx0ICs9IHRva2VuLnJhdy5zbGljZSg0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0Y2FzZSBcIlpcIjpcblx0XHRcdHN3aXRjaCAodG9rZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0cmV0dXJuIG9mZnNldEhvdXJzU3RyaW5nICsgb2Zmc2V0TWludXRlc1N0cmluZztcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdGNvbnN0IG5ld1Rva2VuOiBUb2tlbiA9IHtcblx0XHRcdFx0XHRcdGxlbmd0aDogNCxcblx0XHRcdFx0XHRcdHJhdzogXCJPT09PXCIsXG5cdFx0XHRcdFx0XHRzeW1ib2w6IFwiT1wiLFxuXHRcdFx0XHRcdFx0dHlwZTogVG9rZW5UeXBlLlpPTkVcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBfZm9ybWF0Wm9uZShjdXJyZW50VGltZSwgdXRjVGltZSwgem9uZSwgbmV3VG9rZW4pO1xuXHRcdFx0XHRjYXNlIDU6XG5cdFx0XHRcdFx0aWYgKG9mZnNldCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiWlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gb2Zmc2V0SG91cnNTdHJpbmcgKyBcIjpcIiArIG9mZnNldE1pbnV0ZXNTdHJpbmc7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly8gdG9rZW5pemVyIHNob3VsZCBwcmV2ZW50IHRoaXNcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRcdHJldHVybiB0b2tlbi5yYXc7XG5cdFx0XHR9XG5cdFx0Y2FzZSBcInpcIjpcblx0XHRcdHN3aXRjaCAodG9rZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0cmV0dXJuIHpvbmUuYWJicmV2aWF0aW9uRm9yVXRjKGN1cnJlbnRUaW1lLCB0cnVlKTtcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJldHVybiB6b25lLnRvU3RyaW5nKCk7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly8gdG9rZW5pemVyIHNob3VsZCBwcmV2ZW50IHRoaXNcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRcdHJldHVybiB0b2tlbi5yYXc7XG5cdFx0XHR9XG5cdFx0Y2FzZSBcInZcIjpcblx0XHRcdGlmICh0b2tlbi5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIHpvbmUuYWJicmV2aWF0aW9uRm9yVXRjKGN1cnJlbnRUaW1lLCBmYWxzZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gem9uZS50b1N0cmluZygpO1xuXHRcdFx0fVxuXHRcdGNhc2UgXCJWXCI6XG5cdFx0XHRzd2l0Y2ggKHRva2VuLmxlbmd0aCkge1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0Ly8gTm90IGltcGxlbWVudGVkXG5cdFx0XHRcdFx0cmV0dXJuIFwidW5rXCI7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRyZXR1cm4gem9uZS5uYW1lKCk7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJldHVybiBcIlVua25vd25cIjtcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvLyB0b2tlbml6ZXIgc2hvdWxkIHByZXZlbnQgdGhpc1xuXHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdFx0cmV0dXJuIHRva2VuLnJhdztcblx0XHRcdH1cblx0XHRjYXNlIFwiWFwiOlxuXHRcdGNhc2UgXCJ4XCI6XG5cdFx0XHRpZiAodG9rZW4uc3ltYm9sID09PSBcIlhcIiAmJiBvZmZzZXQgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIFwiWlwiO1xuXHRcdFx0fVxuXHRcdFx0c3dpdGNoICh0b2tlbi5sZW5ndGgpIHtcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHJlc3VsdCA9IG9mZnNldEhvdXJzU3RyaW5nO1xuXHRcdFx0XHRcdGlmIChvZmZzZXRNaW51dGVzICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgKz0gb2Zmc2V0TWludXRlc1N0cmluZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRjYXNlIDQ6IC8vIE5vIHNlY29uZHMgaW4gb3VyIGltcGxlbWVudGF0aW9uLCBzbyB0aGlzIGlzIHRoZSBzYW1lXG5cdFx0XHRcdFx0cmV0dXJuIG9mZnNldEhvdXJzU3RyaW5nICsgb2Zmc2V0TWludXRlc1N0cmluZztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRjYXNlIDU6IC8vIE5vIHNlY29uZHMgaW4gb3VyIGltcGxlbWVudGF0aW9uLCBzbyB0aGlzIGlzIHRoZSBzYW1lXG5cdFx0XHRcdFx0cmV0dXJuIG9mZnNldEhvdXJzU3RyaW5nICsgXCI6XCIgKyBvZmZzZXRNaW51dGVzU3RyaW5nO1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vIHRva2VuaXplciBzaG91bGQgcHJldmVudCB0aGlzXG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRyZXR1cm4gdG9rZW4ucmF3O1xuXHRcdFx0fVxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vIHRva2VuaXplciBzaG91bGQgcHJldmVudCB0aGlzXG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0cmV0dXJuIHRva2VuLnJhdztcblx0fVxufVxuXG4iLCIvKipcbiAqIENvcHlyaWdodChjKSAyMDE0IEFCQiBTd2l0emVybGFuZCBMdGQuXG4gKlxuICogR2xvYmFsIGZ1bmN0aW9ucyBkZXBlbmRpbmcgb24gRGF0ZVRpbWUvRHVyYXRpb24gZXRjXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBhc3NlcnQgZnJvbSBcIi4vYXNzZXJ0XCI7XG5pbXBvcnQgeyBEYXRlVGltZSB9IGZyb20gXCIuL2RhdGV0aW1lXCI7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gXCIuL2R1cmF0aW9uXCI7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWluaW11bSBvZiB0d28gRGF0ZVRpbWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW4oZDE6IERhdGVUaW1lLCBkMjogRGF0ZVRpbWUpOiBEYXRlVGltZTtcbi8qKlxuICogUmV0dXJucyB0aGUgbWluaW11bSBvZiB0d28gRHVyYXRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW4oZDE6IER1cmF0aW9uLCBkMjogRHVyYXRpb24pOiBEdXJhdGlvbjtcbi8qKlxuICogUmV0dXJucyB0aGUgbWluaW11bSBvZiB0d28gRGF0ZVRpbWVzIG9yIER1cmF0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWluKGQxOiBEYXRlVGltZSB8IER1cmF0aW9uLCBkMjogRGF0ZVRpbWUgfCBEdXJhdGlvbik6IERhdGVUaW1lIHwgRHVyYXRpb24ge1xuXHRhc3NlcnQoZDEsIFwiZmlyc3QgYXJndW1lbnQgaXMgZmFsc3lcIik7XG5cdGFzc2VydChkMiwgXCJzZWNvbmQgYXJndW1lbnQgaXMgZmFsc3lcIik7XG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdGFzc2VydChkMS5raW5kID09PSBkMi5raW5kLCBcImV4cGVjdGVkIGVpdGhlciB0d28gZGF0ZXRpbWVzIG9yIHR3byBkdXJhdGlvbnNcIik7XG5cdHJldHVybiAoZDEgYXMgYW55KS5taW4oZDIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIG1heGltdW0gb2YgdHdvIERhdGVUaW1lc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWF4KGQxOiBEYXRlVGltZSwgZDI6IERhdGVUaW1lKTogRGF0ZVRpbWU7XG4vKipcbiAqIFJldHVybnMgdGhlIG1heGltdW0gb2YgdHdvIER1cmF0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWF4KGQxOiBEdXJhdGlvbiwgZDI6IER1cmF0aW9uKTogRHVyYXRpb247XG4vKipcbiAqIFJldHVybnMgdGhlIG1heGltdW0gb2YgdHdvIERhdGVUaW1lcyBvciBEdXJhdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1heChkMTogRGF0ZVRpbWUgfCBEdXJhdGlvbiwgZDI6IERhdGVUaW1lIHwgRHVyYXRpb24pOiBEYXRlVGltZSB8IER1cmF0aW9uIHtcblx0YXNzZXJ0KGQxLCBcImZpcnN0IGFyZ3VtZW50IGlzIGZhbHN5XCIpO1xuXHRhc3NlcnQoZDIsIFwic2Vjb25kIGFyZ3VtZW50IGlzIGZhbHN5XCIpO1xuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRhc3NlcnQoZDEua2luZCA9PT0gZDIua2luZCwgXCJleHBlY3RlZCBlaXRoZXIgdHdvIGRhdGV0aW1lcyBvciB0d28gZHVyYXRpb25zXCIpO1xuXHRyZXR1cm4gKGQxIGFzIGFueSkubWF4KGQyKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBhIER1cmF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYnMoZDogRHVyYXRpb24pOiBEdXJhdGlvbiB7XG5cdGFzc2VydChkLCBcImZpcnN0IGFyZ3VtZW50IGlzIGZhbHN5XCIpO1xuXHRyZXR1cm4gZC5hYnMoKTtcbn1cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBBQkIgU3dpdHplcmxhbmQgTHRkLlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEluZGljYXRlcyBob3cgYSBEYXRlIG9iamVjdCBzaG91bGQgYmUgaW50ZXJwcmV0ZWQuXG4gKiBFaXRoZXIgd2UgY2FuIHRha2UgZ2V0WWVhcigpLCBnZXRNb250aCgpIGV0YyBmb3Igb3VyIGZpZWxkXG4gKiB2YWx1ZXMsIG9yIHdlIGNhbiB0YWtlIGdldFVUQ1llYXIoKSwgZ2V0VXRjTW9udGgoKSBldGMgdG8gZG8gdGhhdC5cbiAqL1xuZXhwb3J0IGVudW0gRGF0ZUZ1bmN0aW9ucyB7XG5cdC8qKlxuXHQgKiBVc2UgdGhlIERhdGUuZ2V0RnVsbFllYXIoKSwgRGF0ZS5nZXRNb250aCgpLCAuLi4gZnVuY3Rpb25zLlxuXHQgKi9cblx0R2V0LFxuXHQvKipcblx0ICogVXNlIHRoZSBEYXRlLmdldFVUQ0Z1bGxZZWFyKCksIERhdGUuZ2V0VVRDTW9udGgoKSwgLi4uIGZ1bmN0aW9ucy5cblx0ICovXG5cdEdldFVUQ1xufVxuXG4iLCIvKipcbiAqIENvcHlyaWdodChjKSAyMDE3IEFCQiBTd2l0emVybGFuZCBMdGQuXG4gKi9cblxuLyoqXG4gKiBGaXhlZCBkYXkgcGVyaW9kIHJ1bGVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGF5UGVyaW9kIHtcblx0YW06IHN0cmluZztcblx0cG06IHN0cmluZztcblx0bWlkbmlnaHQ6IHN0cmluZztcblx0bm9vbjogc3RyaW5nO1xufVxuXG4vKipcbiAqIExvY2FsZSBmb3IgZm9ybWF0dGluZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsZSB7XG5cdC8qKlxuXHQgKiBFcmEgbmFtZXM6IEFELCBCQ1xuXHQgKi9cblx0ZXJhTmFycm93OiBbc3RyaW5nLCBzdHJpbmddO1xuXHRlcmFXaWRlOiBbc3RyaW5nLCBzdHJpbmddO1xuXHRlcmFBYmJyZXZpYXRlZDogW3N0cmluZywgc3RyaW5nXTtcblxuXHQvKipcblx0ICogVGhlIGxldHRlciBpbmRpY2F0aW5nIGEgcXVhcnRlciBlLmcuIFwiUVwiIChiZWNvbWVzIFExLCBRMiwgUTMsIFE0KVxuXHQgKi9cblx0cXVhcnRlckxldHRlcjogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHdvcmQgZm9yICdxdWFydGVyJ1xuXHQgKi9cblx0cXVhcnRlcldvcmQ6IHN0cmluZztcblx0LyoqXG5cdCAqIFF1YXJ0ZXIgYWJicmV2aWF0aW9ucyBlLmcuIDFzdCwgMm5kLCAzcmQsIDR0aFxuXHQgKi9cblx0cXVhcnRlckFiYnJldmlhdGlvbnM6IHN0cmluZ1tdO1xuXG5cdC8qKlxuXHQgKiBJbiBzb21lIGxhbmd1YWdlcywgcXVhcnRlcnMgbmVlZCBkaWZmZXJlbnQgbmFtZXMgd2hlbiB1c2VkIHN0YW5kLWFsb25lXG5cdCAqL1xuXHRzdGFuZEFsb25lUXVhcnRlckxldHRlcjogc3RyaW5nO1xuXHRzdGFuZEFsb25lUXVhcnRlcldvcmQ6IHN0cmluZztcblx0c3RhbmRBbG9uZVF1YXJ0ZXJBYmJyZXZpYXRpb25zOiBzdHJpbmdbXTtcblxuXHQvKipcblx0ICogTW9udGggbmFtZXNcblx0ICovXG5cdGxvbmdNb250aE5hbWVzOiBzdHJpbmdbXTtcblx0LyoqXG5cdCAqIFRocmVlLWxldHRlciBtb250aCBuYW1lc1xuXHQgKi9cblx0c2hvcnRNb250aE5hbWVzOiBzdHJpbmdbXTtcblx0LyoqXG5cdCAqIE1vbnRoIGxldHRlcnNcblx0ICovXG5cdG1vbnRoTGV0dGVyczogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIEluIHNvbWUgbGFuZ3VhZ2VzLCBtb250aHMgbmVlZCBkaWZmZXJlbnQgbmFtZXMgd2hlbiB1c2VkIHN0YW5kLWFsb25lXG5cdCAqL1xuXHRzdGFuZEFsb25lTG9uZ01vbnRoTmFtZXM6IHN0cmluZ1tdO1xuXHRzdGFuZEFsb25lU2hvcnRNb250aE5hbWVzOiBzdHJpbmdbXTtcblx0c3RhbmRBbG9uZU1vbnRoTGV0dGVyczogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIFdlZWsgZGF5IG5hbWVzLCBzdGFydGluZyB3aXRoIHN1bmRheVxuXHQgKi9cblx0bG9uZ1dlZWtkYXlOYW1lczogc3RyaW5nW107XG5cdHNob3J0V2Vla2RheU5hbWVzOiBzdHJpbmdbXTtcblx0d2Vla2RheVR3b0xldHRlcnM6IHN0cmluZ1tdO1xuXHR3ZWVrZGF5TGV0dGVyczogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIEZpeGVkIGRheSBwZXJpb2QgbmFtZXMgKEFNL1BNL25vb24vbWlkbmlnaHQsIGZvcm1hdCAnYScgYW5kICdiJylcblx0ICovXG5cdGRheVBlcmlvZE5hcnJvdzogRGF5UGVyaW9kO1xuXHRkYXlQZXJpb2RXaWRlOiBEYXlQZXJpb2Q7XG5cdGRheVBlcmlvZEFiYnJldmlhdGVkOiBEYXlQZXJpb2Q7XG59XG5cblxuLy8gdG9kbyB0aGlzIGNhbiBiZSBQYXJ0aWFsPEZvcm1hdE9wdGlvbnM+IGJ1dCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoXG4vLyBwcmUtMi4xIHR5cGVzY3JpcHQgdXNlcnMgd2Ugd3JpdGUgdGhpcyBvdXQgb3Vyc2VsdmVzIGZvciBhIHdoaWxlIHlldFxuZXhwb3J0IGludGVyZmFjZSBQYXJ0aWFsTG9jYWxlIHtcblx0LyoqXG5cdCAqIEVyYSBuYW1lczogQUQsIEJDXG5cdCAqL1xuXHRlcmFOYXJyb3c/OiBbc3RyaW5nLCBzdHJpbmddO1xuXHRlcmFXaWRlPzogW3N0cmluZywgc3RyaW5nXTtcblx0ZXJhQWJicmV2aWF0ZWQ/OiBbc3RyaW5nLCBzdHJpbmddO1xuXG5cdC8qKlxuXHQgKiBUaGUgbGV0dGVyIGluZGljYXRpbmcgYSBxdWFydGVyIGUuZy4gXCJRXCIgKGJlY29tZXMgUTEsIFEyLCBRMywgUTQpXG5cdCAqL1xuXHRxdWFydGVyTGV0dGVyPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHdvcmQgZm9yICdxdWFydGVyJ1xuXHQgKi9cblx0cXVhcnRlcldvcmQ/OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBRdWFydGVyIGFiYnJldmlhdGlvbnMgZS5nLiAxc3QsIDJuZCwgM3JkLCA0dGhcblx0ICovXG5cdHF1YXJ0ZXJBYmJyZXZpYXRpb25zPzogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIEluIHNvbWUgbGFuZ3VhZ2VzLCBxdWFydGVycyBuZWVkIGRpZmZlcmVudCBuYW1lcyB3aGVuIHVzZWQgc3RhbmQtYWxvbmVcblx0ICovXG5cdHN0YW5kQWxvbmVRdWFydGVyTGV0dGVyPzogc3RyaW5nO1xuXHRzdGFuZEFsb25lUXVhcnRlcldvcmQ/OiBzdHJpbmc7XG5cdHN0YW5kQWxvbmVRdWFydGVyQWJicmV2aWF0aW9ucz86IHN0cmluZ1tdO1xuXG5cdC8qKlxuXHQgKiBNb250aCBuYW1lc1xuXHQgKi9cblx0bG9uZ01vbnRoTmFtZXM/OiBzdHJpbmdbXTtcblx0LyoqXG5cdCAqIFRocmVlLWxldHRlciBtb250aCBuYW1lc1xuXHQgKi9cblx0c2hvcnRNb250aE5hbWVzPzogc3RyaW5nW107XG5cdC8qKlxuXHQgKiBNb250aCBsZXR0ZXJzXG5cdCAqL1xuXHRtb250aExldHRlcnM/OiBzdHJpbmdbXTtcblxuXHQvKipcblx0ICogSW4gc29tZSBsYW5ndWFnZXMsIG1vbnRocyBuZWVkIGRpZmZlcmVudCBuYW1lcyB3aGVuIHVzZWQgc3RhbmQtYWxvbmVcblx0ICovXG5cdHN0YW5kQWxvbmVMb25nTW9udGhOYW1lcz86IHN0cmluZ1tdO1xuXHRzdGFuZEFsb25lU2hvcnRNb250aE5hbWVzPzogc3RyaW5nW107XG5cdHN0YW5kQWxvbmVNb250aExldHRlcnM/OiBzdHJpbmdbXTtcblxuXHQvKipcblx0ICogV2VlayBkYXkgbmFtZXMsIHN0YXJ0aW5nIHdpdGggc3VuZGF5XG5cdCAqL1xuXHRsb25nV2Vla2RheU5hbWVzPzogc3RyaW5nW107XG5cdHNob3J0V2Vla2RheU5hbWVzPzogc3RyaW5nW107XG5cdHdlZWtkYXlUd29MZXR0ZXJzPzogc3RyaW5nW107XG5cdHdlZWtkYXlMZXR0ZXJzPzogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIEZpeGVkIGRheSBwZXJpb2QgbmFtZXMgKEFNL1BNL25vb24vbWlkbmlnaHQsIGZvcm1hdCAnYScgYW5kICdiJylcblx0ICovXG5cdGRheVBlcmlvZE5hcnJvdz86IERheVBlcmlvZDtcblx0ZGF5UGVyaW9kV2lkZT86IERheVBlcmlvZDtcblx0ZGF5UGVyaW9kQWJicmV2aWF0ZWQ/OiBEYXlQZXJpb2Q7XG59XG5cbmV4cG9ydCBjb25zdCBFUkFfTkFNRVNfTkFSUk9XOiBbc3RyaW5nLCBzdHJpbmddID0gW1wiQVwiLCBcIkJcIl07XG5leHBvcnQgY29uc3QgRVJBX05BTUVTX1dJREU6IFtzdHJpbmcsIHN0cmluZ10gPSBbXCJBbm5vIERvbWluaVwiLCBcIkJlZm9yZSBDaHJpc3RcIl07XG5leHBvcnQgY29uc3QgRVJBX05BTUVTX0FCQlJFVklBVEVEOiBbc3RyaW5nLCBzdHJpbmddID0gW1wiQURcIiwgXCJCQ1wiXTtcblxuZXhwb3J0IGNvbnN0IFFVQVJURVJfTEVUVEVSOiBzdHJpbmcgPSBcIlFcIjtcbmV4cG9ydCBjb25zdCBRVUFSVEVSX1dPUkQ6IHN0cmluZyA9IFwicXVhcnRlclwiO1xuZXhwb3J0IGNvbnN0IFFVQVJURVJfQUJCUkVWSUFUSU9OUzogc3RyaW5nW10gPSBbXCIxc3RcIiwgXCIybmRcIiwgXCIzcmRcIiwgXCI0dGhcIl07XG5cbi8qKlxuICogSW4gc29tZSBsYW5ndWFnZXMsIGRpZmZlcmVudCB3b3JkcyBhcmUgbmVjZXNzYXJ5IGZvciBzdGFuZC1hbG9uZSBxdWFydGVyIG5hbWVzXG4gKi9cbmV4cG9ydCBjb25zdCBTVEFORF9BTE9ORV9RVUFSVEVSX0xFVFRFUjogc3RyaW5nID0gUVVBUlRFUl9MRVRURVI7XG5leHBvcnQgY29uc3QgU1RBTkRfQUxPTkVfUVVBUlRFUl9XT1JEOiBzdHJpbmcgPSBRVUFSVEVSX1dPUkQ7XG5leHBvcnQgY29uc3QgU1RBTkRfQUxPTkVfUVVBUlRFUl9BQkJSRVZJQVRJT05TOiBzdHJpbmdbXSA9IFFVQVJURVJfQUJCUkVWSUFUSU9OUy5zbGljZSgpO1xuXG5leHBvcnQgY29uc3QgTE9OR19NT05USF9OQU1FUzogc3RyaW5nW10gPVxuXHRbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXTtcblxuZXhwb3J0IGNvbnN0IFNIT1JUX01PTlRIX05BTUVTOiBzdHJpbmdbXSA9XG5cdFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXTtcblxuZXhwb3J0IGNvbnN0IE1PTlRIX0xFVFRFUlM6IHN0cmluZ1tdID1cblx0W1wiSlwiLCBcIkZcIiwgXCJNXCIsIFwiQVwiLCBcIk1cIiwgXCJKXCIsIFwiSlwiLCBcIkFcIiwgXCJTXCIsIFwiT1wiLCBcIk5cIiwgXCJEXCJdO1xuXG5leHBvcnQgY29uc3QgU1RBTkRfQUxPTkVfTE9OR19NT05USF9OQU1FUzogc3RyaW5nW10gPSBMT05HX01PTlRIX05BTUVTLnNsaWNlKCk7XG5leHBvcnQgY29uc3QgU1RBTkRfQUxPTkVfU0hPUlRfTU9OVEhfTkFNRVM6IHN0cmluZ1tdID0gU0hPUlRfTU9OVEhfTkFNRVMuc2xpY2UoKTtcbmV4cG9ydCBjb25zdCBTVEFORF9BTE9ORV9NT05USF9MRVRURVJTOiBzdHJpbmdbXSA9IE1PTlRIX0xFVFRFUlMuc2xpY2UoKTtcblxuZXhwb3J0IGNvbnN0IExPTkdfV0VFS0RBWV9OQU1FUzogc3RyaW5nW10gPVxuXHRbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXTtcblxuZXhwb3J0IGNvbnN0IFNIT1JUX1dFRUtEQVlfTkFNRVM6IHN0cmluZ1tdID1cblx0W1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdO1xuXG5leHBvcnQgY29uc3QgV0VFS0RBWV9UV09fTEVUVEVSUzogc3RyaW5nW10gPVxuXHRbXCJTdVwiLCBcIk1vXCIsIFwiVHVcIiwgXCJXZVwiLCBcIlRoXCIsIFwiRnJcIiwgXCJTYVwiXTtcblxuZXhwb3J0IGNvbnN0IFdFRUtEQVlfTEVUVEVSUzogc3RyaW5nW10gPVxuXHRbXCJTXCIsIFwiTVwiLCBcIlRcIiwgXCJXXCIsIFwiVFwiLCBcIkZcIiwgXCJTXCJdO1xuXG5leHBvcnQgY29uc3QgREFZX1BFUklPRFNfQUJCUkVWSUFURUQgPSB7IGFtOiBcIkFNXCIsIHBtOiBcIlBNXCIsIG5vb246IFwibm9vblwiLCBtaWRuaWdodDogXCJtaWQuXCIgfTtcbmV4cG9ydCBjb25zdCBEQVlfUEVSSU9EU19XSURFID0geyBhbTogXCJBTVwiLCBwbTogXCJQTVwiLCBub29uOiBcIm5vb25cIiwgbWlkbmlnaHQ6IFwibWlkbmlnaHRcIiB9O1xuZXhwb3J0IGNvbnN0IERBWV9QRVJJT0RTX05BUlJPVyA9IHsgYW06IFwiQVwiLCBwbTogXCJQXCIsIG5vb246IFwibm9vblwiLCBtaWRuaWdodDogXCJtZFwiIH07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0xPQ0FMRTogTG9jYWxlID0ge1xuXHRlcmFOYXJyb3c6IEVSQV9OQU1FU19OQVJST1csXG5cdGVyYVdpZGU6IEVSQV9OQU1FU19XSURFLFxuXHRlcmFBYmJyZXZpYXRlZDogRVJBX05BTUVTX0FCQlJFVklBVEVELFxuXHRxdWFydGVyTGV0dGVyOiBRVUFSVEVSX0xFVFRFUixcblx0cXVhcnRlcldvcmQ6IFFVQVJURVJfV09SRCxcblx0cXVhcnRlckFiYnJldmlhdGlvbnM6IFFVQVJURVJfQUJCUkVWSUFUSU9OUyxcblx0c3RhbmRBbG9uZVF1YXJ0ZXJMZXR0ZXI6IFNUQU5EX0FMT05FX1FVQVJURVJfTEVUVEVSLFxuXHRzdGFuZEFsb25lUXVhcnRlcldvcmQ6IFNUQU5EX0FMT05FX1FVQVJURVJfV09SRCxcblx0c3RhbmRBbG9uZVF1YXJ0ZXJBYmJyZXZpYXRpb25zOiBTVEFORF9BTE9ORV9RVUFSVEVSX0FCQlJFVklBVElPTlMsXG5cdGxvbmdNb250aE5hbWVzOiBMT05HX01PTlRIX05BTUVTLFxuXHRzaG9ydE1vbnRoTmFtZXM6IFNIT1JUX01PTlRIX05BTUVTLFxuXHRtb250aExldHRlcnM6IE1PTlRIX0xFVFRFUlMsXG5cdHN0YW5kQWxvbmVMb25nTW9udGhOYW1lczogU1RBTkRfQUxPTkVfTE9OR19NT05USF9OQU1FUyxcblx0c3RhbmRBbG9uZVNob3J0TW9udGhOYW1lczogU1RBTkRfQUxPTkVfU0hPUlRfTU9OVEhfTkFNRVMsXG5cdHN0YW5kQWxvbmVNb250aExldHRlcnM6IFNUQU5EX0FMT05FX01PTlRIX0xFVFRFUlMsXG5cdGxvbmdXZWVrZGF5TmFtZXM6IExPTkdfV0VFS0RBWV9OQU1FUyxcblx0c2hvcnRXZWVrZGF5TmFtZXM6IFNIT1JUX1dFRUtEQVlfTkFNRVMsXG5cdHdlZWtkYXlUd29MZXR0ZXJzOiBXRUVLREFZX1RXT19MRVRURVJTLFxuXHR3ZWVrZGF5TGV0dGVyczogV0VFS0RBWV9MRVRURVJTLFxuXHRkYXlQZXJpb2RBYmJyZXZpYXRlZDogREFZX1BFUklPRFNfQUJCUkVWSUFURUQsXG5cdGRheVBlcmlvZFdpZGU6IERBWV9QRVJJT0RTX1dJREUsXG5cdGRheVBlcmlvZE5hcnJvdzogREFZX1BFUklPRFNfTkFSUk9XXG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBBQkIgU3dpdHplcmxhbmQgTHRkLlxuICpcbiAqIE1hdGggdXRpbGl0eSBmdW5jdGlvbnNcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IGFzc2VydCBmcm9tIFwiLi9hc3NlcnRcIjtcblxuLyoqXG4gKiBAcmV0dXJuIHRydWUgaWZmIGdpdmVuIGFyZ3VtZW50IGlzIGFuIGludGVnZXIgbnVtYmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ludChuOiBudW1iZXIpOiBib29sZWFuIHtcblx0aWYgKG4gPT09IG51bGwgfHwgIWlzRmluaXRlKG4pKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiAoTWF0aC5mbG9vcihuKSA9PT0gbik7XG59XG5cbi8qKlxuICogUm91bmRzIC0xLjUgdG8gLTIgaW5zdGVhZCBvZiAtMVxuICogUm91bmRzICsxLjUgdG8gKzJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kU3ltKG46IG51bWJlcik6IG51bWJlciB7XG5cdGlmIChuIDwgMCkge1xuXHRcdHJldHVybiAtMSAqIE1hdGgucm91bmQoLTEgKiBuKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gTWF0aC5yb3VuZChuKTtcblx0fVxufVxuXG4vKipcbiAqIFN0cmljdGVyIHZhcmlhbnQgb2YgcGFyc2VGbG9hdCgpLlxuICogQHBhcmFtIHZhbHVlXHRJbnB1dCBzdHJpbmdcbiAqIEByZXR1cm4gdGhlIGZsb2F0IGlmIHRoZSBzdHJpbmcgaXMgYSB2YWxpZCBmbG9hdCwgTmFOIG90aGVyd2lzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRmxvYXQodmFsdWU6IHN0cmluZyk6IG51bWJlciB7XG5cdGlmICgvXihcXC18XFwrKT8oWzAtOV0rKFxcLlswLTldKyk/fEluZmluaXR5KSQvLnRlc3QodmFsdWUpKSB7XG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSk7XG5cdH1cblx0cmV0dXJuIE5hTjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvc2l0aXZlTW9kdWxvKHZhbHVlOiBudW1iZXIsIG1vZHVsbzogbnVtYmVyKTogbnVtYmVyIHtcblx0YXNzZXJ0KG1vZHVsbyA+PSAxLCBcIm1vZHVsbyBzaG91bGQgYmUgPj0gMVwiKTtcblx0aWYgKHZhbHVlIDwgMCkge1xuXHRcdHJldHVybiAoKHZhbHVlICUgbW9kdWxvKSArIG1vZHVsbykgJSBtb2R1bG87XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHZhbHVlICUgbW9kdWxvO1xuXHR9XG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSAyMDE0IEFCQiBTd2l0emVybGFuZCBMdGQuXG4gKlxuICogRnVuY3Rpb25hbGl0eSB0byBwYXJzZSBhIERhdGVUaW1lIG9iamVjdCB0byBhIHN0cmluZ1xuICovXG5cbmltcG9ydCB7IFRpbWVDb21wb25lbnRPcHRzLCBUaW1lU3RydWN0IH0gZnJvbSBcIi4vYmFzaWNzXCI7XG5pbXBvcnQgeyBERUZBVUxUX0xPQ0FMRSwgTG9jYWxlLCBQYXJ0aWFsTG9jYWxlIH0gZnJvbSBcIi4vbG9jYWxlXCI7XG5pbXBvcnQgeyBUaW1lWm9uZSB9IGZyb20gXCIuL3RpbWV6b25lXCI7XG5pbXBvcnQgeyBUb2tlbiwgdG9rZW5pemUsIFRva2VuVHlwZSB9IGZyb20gXCIuL3Rva2VuXCI7XG5cbi8qKlxuICogVGltZVN0cnVjdCBwbHVzIHpvbmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBd2FyZVRpbWVTdHJ1Y3Qge1xuXHQvKipcblx0ICogVGhlIHRpbWUgc3RydWN0XG5cdCAqL1xuXHR0aW1lOiBUaW1lU3RydWN0O1xuXHQvKipcblx0ICogVGhlIHRpbWUgem9uZSAoY2FuIGJlIHVuZGVmaW5lZClcblx0ICovXG5cdHpvbmU6IFRpbWVab25lIHwgdW5kZWZpbmVkO1xufVxuXG5pbnRlcmZhY2UgUGFyc2VOdW1iZXJSZXN1bHQge1xuXHRuOiBudW1iZXI7XG5cdHJlbWFpbmluZzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgUGFyc2Vab25lUmVzdWx0IHtcblx0em9uZT86IFRpbWVab25lO1xuXHRyZW1haW5pbmc6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFBhcnNlRGF5UGVyaW9kUmVzdWx0IHtcblx0dHlwZTogXCJhbVwiIHwgXCJwbVwiIHwgXCJub29uXCIgfCBcIm1pZG5pZ2h0XCI7XG5cdHJlbWFpbmluZzogc3RyaW5nO1xufVxuXG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgZ2l2ZW4gZGF0ZXRpbWUgc3RyaW5nIGlzIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gZm9ybWF0XG4gKiBAcGFyYW0gZGF0ZVRpbWVTdHJpbmcgVGhlIHN0cmluZyB0byB0ZXN0XG4gKiBAcGFyYW0gZm9ybWF0U3RyaW5nIExETUwgZm9ybWF0IHN0cmluZyAoc2VlIExETUwubWQpXG4gKiBAcGFyYW0gYWxsb3dUcmFpbGluZyBBbGxvdyB0cmFpbGluZyBzdHJpbmcgYWZ0ZXIgdGhlIGRhdGUrdGltZVxuICogQHBhcmFtIGxvY2FsZSBMb2NhbGUtc3BlY2lmaWMgY29uc3RhbnRzIHN1Y2ggYXMgbW9udGggbmFtZXNcbiAqIEByZXR1cm5zIHRydWUgaWZmIHRoZSBzdHJpbmcgaXMgdmFsaWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlYWJsZShcblx0ZGF0ZVRpbWVTdHJpbmc6IHN0cmluZyxcblx0Zm9ybWF0U3RyaW5nOiBzdHJpbmcsXG5cdGFsbG93VHJhaWxpbmc6IGJvb2xlYW4gPSB0cnVlLFxuXHRsb2NhbGU6IFBhcnRpYWxMb2NhbGUgPSB7fVxuKTogYm9vbGVhbiB7XG5cdHRyeSB7XG5cdFx0cGFyc2UoZGF0ZVRpbWVTdHJpbmcsIGZvcm1hdFN0cmluZywgdW5kZWZpbmVkLCBhbGxvd1RyYWlsaW5nLCBsb2NhbGUpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIHN1cHBsaWVkIGRhdGVUaW1lIGFzc3VtaW5nIHRoZSBnaXZlbiBmb3JtYXQuXG4gKlxuICogQHBhcmFtIGRhdGVUaW1lU3RyaW5nIFRoZSBzdHJpbmcgdG8gcGFyc2VcbiAqIEBwYXJhbSBmb3JtYXRTdHJpbmcgVGhlIGZvcm1hdHRpbmcgc3RyaW5nIHRvIGJlIGFwcGxpZWRcbiAqIEBwYXJhbSBvdmVycmlkZVpvbmUgVXNlIHRoaXMgem9uZSBpbiB0aGUgcmVzdWx0XG4gKiBAcGFyYW0gYWxsb3dUcmFpbGluZyBBbGxvdyB0cmFpbGluZyBjaGFyYWN0ZXJzIGluIHRoZSBzb3VyY2Ugc3RyaW5nXG4gKiBAcGFyYW0gbG9jYWxlIExvY2FsZS1zcGVjaWZpYyBjb25zdGFudHMgc3VjaCBhcyBtb250aCBuYW1lc1xuICogQHJldHVybiBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKFxuXHRkYXRlVGltZVN0cmluZzogc3RyaW5nLFxuXHRmb3JtYXRTdHJpbmc6IHN0cmluZyxcblx0b3ZlcnJpZGVab25lPzogVGltZVpvbmUgfCBudWxsIHwgdW5kZWZpbmVkLFxuXHRhbGxvd1RyYWlsaW5nOiBib29sZWFuID0gdHJ1ZSxcblx0bG9jYWxlOiBQYXJ0aWFsTG9jYWxlID0ge31cbik6IEF3YXJlVGltZVN0cnVjdCB7XG5cdGlmICghZGF0ZVRpbWVTdHJpbmcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJubyBkYXRlIGdpdmVuXCIpO1xuXHR9XG5cdGlmICghZm9ybWF0U3RyaW5nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwibm8gZm9ybWF0IGdpdmVuXCIpO1xuXHR9XG5cdGNvbnN0IG1lcmdlZExvY2FsZTogTG9jYWxlID0ge1xuXHRcdC4uLkRFRkFVTFRfTE9DQUxFLFxuXHRcdC4uLmxvY2FsZVxuXHR9O1xuXHRjb25zdCB5ZWFyQ3V0b2ZmID0gKG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSArIDUwKSAlIDEwMDtcblxuXHR0cnkge1xuXHRcdGNvbnN0IHRva2VuczogVG9rZW5bXSA9IHRva2VuaXplKGZvcm1hdFN0cmluZyk7XG5cdFx0Y29uc3QgdGltZTogVGltZUNvbXBvbmVudE9wdHMgPSB7IHllYXI6IHVuZGVmaW5lZCB9O1xuXHRcdGxldCB6b25lOiBUaW1lWm9uZSB8IHVuZGVmaW5lZDtcblx0XHRsZXQgcG5yOiBQYXJzZU51bWJlclJlc3VsdCB8IHVuZGVmaW5lZDtcblx0XHRsZXQgcHpyOiBQYXJzZVpvbmVSZXN1bHQgfCB1bmRlZmluZWQ7XG5cdFx0bGV0IGRwcjogUGFyc2VEYXlQZXJpb2RSZXN1bHQgfCB1bmRlZmluZWQ7XG5cdFx0bGV0IGVyYTogbnVtYmVyID0gMTtcblx0XHRsZXQgcXVhcnRlcjogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXHRcdGxldCByZW1haW5pbmc6IHN0cmluZyA9IGRhdGVUaW1lU3RyaW5nO1xuXHRcdGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5zKSB7XG5cdFx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuRVJBOlxuXHRcdFx0XHRcdFtlcmEsIHJlbWFpbmluZ10gPSBzdHJpcEVyYSh0b2tlbiwgcmVtYWluaW5nLCBtZXJnZWRMb2NhbGUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFRva2VuVHlwZS5RVUFSVEVSOiB7XG5cdFx0XHRcdFx0Y29uc3QgciA9IHN0cmlwUXVhcnRlcih0b2tlbiwgcmVtYWluaW5nLCBtZXJnZWRMb2NhbGUpO1xuXHRcdFx0XHRcdHF1YXJ0ZXIgPSByLm47XG5cdFx0XHRcdFx0cmVtYWluaW5nID0gci5yZW1haW5pbmc7XG5cdFx0XHRcdH0gYnJlYWs7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLldFRUtEQVk6XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLldFRUs6XG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRicmVhazsgLy8gbm90aGluZyB0byBsZWFybiBmcm9tIHRoaXNcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuREFZUEVSSU9EOlxuXHRcdFx0XHRcdGRwciA9IHN0cmlwRGF5UGVyaW9kKHRva2VuLCByZW1haW5pbmcsIG1lcmdlZExvY2FsZSk7XG5cdFx0XHRcdFx0cmVtYWluaW5nID0gZHByLnJlbWFpbmluZztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuWUVBUjpcblx0XHRcdFx0XHRwbnIgPSBzdHJpcE51bWJlcihyZW1haW5pbmcsIEluZmluaXR5KTtcblx0XHRcdFx0XHRyZW1haW5pbmcgPSBwbnIucmVtYWluaW5nO1xuXHRcdFx0XHRcdGlmICh0b2tlbi5sZW5ndGggPT09IDIpIHtcblx0XHRcdFx0XHRcdGlmIChwbnIubiA+IHllYXJDdXRvZmYpIHtcblx0XHRcdFx0XHRcdFx0dGltZS55ZWFyID0gMTkwMCArIHBuci5uO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGltZS55ZWFyID0gMjAwMCArIHBuci5uO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aW1lLnllYXIgPSBwbnIubjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLk1PTlRIOlxuXHRcdFx0XHRcdHBuciA9IHN0cmlwTW9udGgodG9rZW4sIHJlbWFpbmluZywgbWVyZ2VkTG9jYWxlKTtcblx0XHRcdFx0XHRyZW1haW5pbmcgPSBwbnIucmVtYWluaW5nO1xuXHRcdFx0XHRcdHRpbWUubW9udGggPSBwbnIubjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuREFZOlxuXHRcdFx0XHRcdHBuciA9IHN0cmlwTnVtYmVyKHJlbWFpbmluZywgMik7XG5cdFx0XHRcdFx0cmVtYWluaW5nID0gcG5yLnJlbWFpbmluZztcblx0XHRcdFx0XHR0aW1lLmRheSA9IHBuci5uO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFRva2VuVHlwZS5IT1VSOlxuXHRcdFx0XHRcdHBuciA9IHN0cmlwSG91cih0b2tlbiwgcmVtYWluaW5nKTtcblx0XHRcdFx0XHRyZW1haW5pbmcgPSBwbnIucmVtYWluaW5nO1xuXHRcdFx0XHRcdHRpbWUuaG91ciA9IHBuci5uO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFRva2VuVHlwZS5NSU5VVEU6XG5cdFx0XHRcdFx0cG5yID0gc3RyaXBOdW1iZXIocmVtYWluaW5nLCAyKTtcblx0XHRcdFx0XHRyZW1haW5pbmcgPSBwbnIucmVtYWluaW5nO1xuXHRcdFx0XHRcdHRpbWUubWludXRlID0gcG5yLm47XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLlNFQ09ORDoge1xuXHRcdFx0XHRcdHBuciA9IHN0cmlwU2Vjb25kKHRva2VuLCByZW1haW5pbmcpO1xuXHRcdFx0XHRcdHJlbWFpbmluZyA9IHBuci5yZW1haW5pbmc7XG5cdFx0XHRcdFx0c3dpdGNoICh0b2tlbi5zeW1ib2wpIHtcblx0XHRcdFx0XHRcdGNhc2UgXCJzXCI6IHRpbWUuc2Vjb25kID0gcG5yLm47IGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIlNcIjogdGltZS5taWxsaSA9IDEwMDAgKiBwYXJzZUZsb2F0KFwiMC5cIiArIE1hdGguZmxvb3IocG5yLm4pLnRvU3RyaW5nKDEwKS5zbGljZSgwLCAzKSk7IGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIkFcIjpcblx0XHRcdFx0XHRcdFx0dGltZS5ob3VyID0gTWF0aC5mbG9vcigocG5yLm4gLyAzNjAwRTMpKTtcblx0XHRcdFx0XHRcdFx0dGltZS5taW51dGUgPSBNYXRoLmZsb29yKChwbnIubiAvIDYwRTMpICUgNjApO1xuXHRcdFx0XHRcdFx0XHR0aW1lLnNlY29uZCA9IE1hdGguZmxvb3IoKHBuci5uIC8gMTAwMCkgJSA2MCk7XG5cdFx0XHRcdFx0XHRcdHRpbWUubWlsbGkgPSBwbnIubiAlIDEwMDA7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgc2Vjb25kIGZvcm1hdCAnJHt0b2tlbi5yYXd9J2ApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBicmVhaztcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuWk9ORTpcblx0XHRcdFx0XHRwenIgPSBzdHJpcFpvbmUodG9rZW4sIHJlbWFpbmluZyk7XG5cdFx0XHRcdFx0cmVtYWluaW5nID0gcHpyLnJlbWFpbmluZztcblx0XHRcdFx0XHR6b25lID0gcHpyLnpvbmU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLklERU5USVRZOlxuXHRcdFx0XHRcdHJlbWFpbmluZyA9IHN0cmlwUmF3KHJlbWFpbmluZywgdG9rZW4ucmF3KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGRwcikge1xuXHRcdFx0c3dpdGNoIChkcHIudHlwZSkge1xuXHRcdFx0XHRjYXNlIFwiYW1cIjpcblx0XHRcdFx0XHRpZiAodGltZS5ob3VyICE9PSB1bmRlZmluZWQgJiYgdGltZS5ob3VyID49IDEyKSB7XG5cdFx0XHRcdFx0XHR0aW1lLmhvdXIgLT0gMTI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInBtXCI6XG5cdFx0XHRcdFx0aWYgKHRpbWUuaG91ciAhPT0gdW5kZWZpbmVkICYmIHRpbWUuaG91ciA8IDEyKSB7XG5cdFx0XHRcdFx0XHR0aW1lLmhvdXIgKz0gMTI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIm5vb25cIjpcblx0XHRcdFx0XHRpZiAodGltZS5ob3VyID09PSB1bmRlZmluZWQgfHwgdGltZS5ob3VyID09PSAwKSB7XG5cdFx0XHRcdFx0XHR0aW1lLmhvdXIgPSAxMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRpbWUubWludXRlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHRpbWUubWludXRlID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRpbWUuc2Vjb25kID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHRpbWUuc2Vjb25kID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRpbWUubWlsbGkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dGltZS5taWxsaSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aW1lLmhvdXIgIT09IDEyIHx8IHRpbWUubWludXRlICE9PSAwIHx8IHRpbWUuc2Vjb25kICE9PSAwIHx8IHRpbWUubWlsbGkgIT09IDApIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgaW52YWxpZCB0aW1lLCBjb250YWlucyAnbm9vbicgc3BlY2lmaWVyIGJ1dCB0aW1lIGRpZmZlcnMgZnJvbSBub29uYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIm1pZG5pZ2h0XCI6XG5cdFx0XHRcdFx0aWYgKHRpbWUuaG91ciA9PT0gdW5kZWZpbmVkIHx8IHRpbWUuaG91ciA9PT0gMTIpIHtcblx0XHRcdFx0XHRcdHRpbWUuaG91ciA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aW1lLmhvdXIgPT09IDEyKSB7XG5cdFx0XHRcdFx0XHR0aW1lLmhvdXIgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGltZS5taW51dGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dGltZS5taW51dGUgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGltZS5zZWNvbmQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dGltZS5zZWNvbmQgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGltZS5taWxsaSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHR0aW1lLm1pbGxpID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRpbWUuaG91ciAhPT0gMCB8fCB0aW1lLm1pbnV0ZSAhPT0gMCB8fCB0aW1lLnNlY29uZCAhPT0gMCB8fCB0aW1lLm1pbGxpICE9PSAwKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgdGltZSwgY29udGFpbnMgJ21pZG5pZ2h0JyBzcGVjaWZpZXIgYnV0IHRpbWUgZGlmZmVycyBmcm9tIG1pZG5pZ2h0YCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHRpbWUueWVhciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aW1lLnllYXIgKj0gZXJhO1xuXHRcdH1cblx0XHRpZiAocXVhcnRlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRpZiAodGltZS5tb250aCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHN3aXRjaCAocXVhcnRlcikge1xuXHRcdFx0XHRcdGNhc2UgMTogdGltZS5tb250aCA9IDE7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMjogdGltZS5tb250aCA9IDQ7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzogdGltZS5tb250aCA9IDc7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDogdGltZS5tb250aCA9IDEwOyBicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGVycm9yID0gZmFsc2U7XG5cdFx0XHRcdHN3aXRjaCAocXVhcnRlcikge1xuXHRcdFx0XHRcdGNhc2UgMTogZXJyb3IgPSAhKHRpbWUubW9udGggPj0gMSAmJiB0aW1lLm1vbnRoIDw9IDMpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDI6IGVycm9yID0gISh0aW1lLm1vbnRoID49IDQgJiYgdGltZS5tb250aCA8PSA2KTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzOiBlcnJvciA9ICEodGltZS5tb250aCA+PSA3ICYmIHRpbWUubW9udGggPD0gOSk7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDogZXJyb3IgPSAhKHRpbWUubW9udGggPj0gMTAgJiYgdGltZS5tb250aCA8PSAxMik7IGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInRoZSBxdWFydGVyIGRvZXMgbm90IG1hdGNoIHRoZSBtb250aFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodGltZS55ZWFyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRpbWUueWVhciA9IDE5NzA7XG5cdFx0fVxuXHRcdGNvbnN0IHJlc3VsdDogQXdhcmVUaW1lU3RydWN0ID0geyB0aW1lOiBuZXcgVGltZVN0cnVjdCh0aW1lKSwgem9uZSB9O1xuXHRcdGlmICghcmVzdWx0LnRpbWUudmFsaWRhdGUoKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHJlc3VsdGluZyBkYXRlYCk7XG5cdFx0fVxuXHRcdC8vIGFsd2F5cyBvdmVyd3JpdGUgem9uZSB3aXRoIGdpdmVuIHpvbmVcblx0XHRpZiAob3ZlcnJpZGVab25lKSB7XG5cdFx0XHRyZXN1bHQuem9uZSA9IG92ZXJyaWRlWm9uZTtcblx0XHR9XG5cdFx0aWYgKHJlbWFpbmluZyAmJiAhYWxsb3dUcmFpbGluZykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgaW52YWxpZCBkYXRlICcke2RhdGVUaW1lU3RyaW5nfScgbm90IGFjY29yZGluZyB0byBmb3JtYXQgJyR7Zm9ybWF0U3RyaW5nfSc6IHRyYWlsaW5nIGNoYXJhY3RlcnM6ICcke3JlbWFpbmluZ30nYFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBkYXRlICcke2RhdGVUaW1lU3RyaW5nfScgbm90IGFjY29yZGluZyB0byBmb3JtYXQgJyR7Zm9ybWF0U3RyaW5nfSc6ICR7ZS5tZXNzYWdlfWApO1xuXHR9XG59XG5cbmNvbnN0IFdISVRFU1BBQ0UgPSBbXCIgXCIsIFwiXFx0XCIsIFwiXFxyXCIsIFwiXFx2XCIsIFwiXFxuXCJdO1xuXG5mdW5jdGlvbiBzdHJpcFpvbmUodG9rZW46IFRva2VuLCBzOiBzdHJpbmcpOiBQYXJzZVpvbmVSZXN1bHQge1xuXHRjb25zdCB1bnN1cHBvcnRlZDogYm9vbGVhbiA9XG5cdFx0KHRva2VuLnN5bWJvbCA9PT0gXCJ6XCIpXG5cdFx0fHwgKHRva2VuLnN5bWJvbCA9PT0gXCJaXCIgJiYgdG9rZW4ubGVuZ3RoID09PSA1KVxuXHRcdHx8ICh0b2tlbi5zeW1ib2wgPT09IFwidlwiKVxuXHRcdHx8ICh0b2tlbi5zeW1ib2wgPT09IFwiVlwiICYmIHRva2VuLmxlbmd0aCAhPT0gMilcblx0XHR8fCAodG9rZW4uc3ltYm9sID09PSBcInhcIiAmJiB0b2tlbi5sZW5ndGggPj0gNClcblx0XHR8fCAodG9rZW4uc3ltYm9sID09PSBcIlhcIiAmJiB0b2tlbi5sZW5ndGggPj0gNClcblx0XHQ7XG5cdGlmICh1bnN1cHBvcnRlZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInRpbWUgem9uZSBwYXR0ZXJuICdcIiArIHRva2VuLnJhdyArIFwiJyBpcyBub3QgaW1wbGVtZW50ZWRcIik7XG5cdH1cblx0Y29uc3QgcmVzdWx0OiBQYXJzZVpvbmVSZXN1bHQgPSB7XG5cdFx0cmVtYWluaW5nOiBzXG5cdH07XG5cdC8vIGNob3Agb2ZmIFwiR01UXCIgcHJlZml4IGlmIG5lZWRlZFxuXHRsZXQgaGFkR01UID0gZmFsc2U7XG5cdGlmICgodG9rZW4uc3ltYm9sID09PSBcIlpcIiAmJiB0b2tlbi5sZW5ndGggPT09IDQpIHx8IHRva2VuLnN5bWJvbCA9PT0gXCJPXCIpIHtcblx0XHRpZiAocmVzdWx0LnJlbWFpbmluZy50b1VwcGVyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJHTVRcIikpIHtcblx0XHRcdHJlc3VsdC5yZW1haW5pbmcgPSByZXN1bHQucmVtYWluaW5nLnNsaWNlKDMpO1xuXHRcdFx0aGFkR01UID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0Ly8gcGFyc2UgYW55IHpvbmUsIHJlZ2FyZGxlc3Mgb2Ygc3BlY2lmaWVkIGZvcm1hdFxuXHRsZXQgem9uZVN0cmluZyA9IFwiXCI7XG5cdHdoaWxlIChyZXN1bHQucmVtYWluaW5nLmxlbmd0aCA+IDAgJiYgV0hJVEVTUEFDRS5pbmRleE9mKHJlc3VsdC5yZW1haW5pbmcuY2hhckF0KDApKSA9PT0gLTEpIHtcblx0XHR6b25lU3RyaW5nICs9IHJlc3VsdC5yZW1haW5pbmcuY2hhckF0KDApO1xuXHRcdHJlc3VsdC5yZW1haW5pbmcgPSByZXN1bHQucmVtYWluaW5nLnN1YnN0cigxKTtcblx0fVxuXHR6b25lU3RyaW5nID0gem9uZVN0cmluZy50cmltKCk7XG5cdGlmICh6b25lU3RyaW5nKSB7XG5cdFx0Ly8gZW5zdXJlIGNob3BwaW5nIG9mZiBHTVQgZG9lcyBub3QgaGlkZSB0aW1lIHpvbmUgZXJyb3JzIChiaXQgb2YgYSBzbG9wcHkgcmVnZXggYnV0IE9LKVxuXHRcdGlmIChoYWRHTVQgJiYgIXpvbmVTdHJpbmcubWF0Y2goL1tcXCtcXC1dP1tcXGRcXDpdKy9pKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCB0aW1lIHpvbmUgJ0dNVFwiICsgem9uZVN0cmluZyArIFwiJ1wiKTtcblx0XHR9XG5cdFx0cmVzdWx0LnpvbmUgPSBUaW1lWm9uZS56b25lKHpvbmVTdHJpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIm5vIHRpbWUgem9uZSBnaXZlblwiKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpcFJhdyhzOiBzdHJpbmcsIGV4cGVjdGVkOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRsZXQgcmVtYWluaW5nID0gcztcblx0bGV0IGVyZW1haW5pbmcgPSBleHBlY3RlZDtcblx0d2hpbGUgKHJlbWFpbmluZy5sZW5ndGggPiAwICYmIGVyZW1haW5pbmcubGVuZ3RoID4gMCAmJiByZW1haW5pbmcuY2hhckF0KDApID09PSBlcmVtYWluaW5nLmNoYXJBdCgwKSkge1xuXHRcdHJlbWFpbmluZyA9IHJlbWFpbmluZy5zdWJzdHIoMSk7XG5cdFx0ZXJlbWFpbmluZyA9IGVyZW1haW5pbmcuc3Vic3RyKDEpO1xuXHR9XG5cdGlmIChlcmVtYWluaW5nLmxlbmd0aCA+IDApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkICcke2V4cGVjdGVkfSdgKTtcblx0fVxuXHRyZXR1cm4gcmVtYWluaW5nO1xufVxuXG5mdW5jdGlvbiBzdHJpcERheVBlcmlvZCh0b2tlbjogVG9rZW4sIHJlbWFpbmluZzogc3RyaW5nLCBsb2NhbGU6IExvY2FsZSk6IFBhcnNlRGF5UGVyaW9kUmVzdWx0IHtcblx0bGV0IG9mZnNldHM6IHtbaW5kZXg6IHN0cmluZ106IFwiYW1cIiB8IFwicG1cIiB8IFwibm9vblwiIHwgXCJtaWRuaWdodFwifTtcblx0c3dpdGNoICh0b2tlbi5zeW1ib2wpIHtcblx0XHRjYXNlIFwiYVwiOlxuXHRcdFx0c3dpdGNoICh0b2tlbi5sZW5ndGgpIHtcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdG9mZnNldHMgPSB7XG5cdFx0XHRcdFx0XHRbbG9jYWxlLmRheVBlcmlvZFdpZGUuYW1dOiBcImFtXCIsXG5cdFx0XHRcdFx0XHRbbG9jYWxlLmRheVBlcmlvZFdpZGUucG1dOiBcInBtXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRcdG9mZnNldHMgPSB7XG5cdFx0XHRcdFx0XHRbbG9jYWxlLmRheVBlcmlvZE5hcnJvdy5hbV06IFwiYW1cIixcblx0XHRcdFx0XHRcdFtsb2NhbGUuZGF5UGVyaW9kTmFycm93LnBtXTogXCJwbVwiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0b2Zmc2V0cyA9IHtcblx0XHRcdFx0XHRcdFtsb2NhbGUuZGF5UGVyaW9kQWJicmV2aWF0ZWQuYW1dOiBcImFtXCIsXG5cdFx0XHRcdFx0XHRbbG9jYWxlLmRheVBlcmlvZEFiYnJldmlhdGVkLnBtXTogXCJwbVwiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHN3aXRjaCAodG9rZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRvZmZzZXRzID0ge1xuXHRcdFx0XHRcdFx0W2xvY2FsZS5kYXlQZXJpb2RXaWRlLmFtXTogXCJhbVwiLFxuXHRcdFx0XHRcdFx0W2xvY2FsZS5kYXlQZXJpb2RXaWRlLm1pZG5pZ2h0XTogXCJtaWRuaWdodFwiLFxuXHRcdFx0XHRcdFx0W2xvY2FsZS5kYXlQZXJpb2RXaWRlLnBtXTogXCJwbVwiLFxuXHRcdFx0XHRcdFx0W2xvY2FsZS5kYXlQZXJpb2RXaWRlLm5vb25dOiBcIm5vb25cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDU6XG5cdFx0XHRcdFx0b2Zmc2V0cyA9IHtcblx0XHRcdFx0XHRcdFtsb2NhbGUuZGF5UGVyaW9kTmFycm93LmFtXTogXCJhbVwiLFxuXHRcdFx0XHRcdFx0W2xvY2FsZS5kYXlQZXJpb2ROYXJyb3cubWlkbmlnaHRdOiBcIm1pZG5pZ2h0XCIsXG5cdFx0XHRcdFx0XHRbbG9jYWxlLmRheVBlcmlvZE5hcnJvdy5wbV06IFwicG1cIixcblx0XHRcdFx0XHRcdFtsb2NhbGUuZGF5UGVyaW9kTmFycm93Lm5vb25dOiBcIm5vb25cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdG9mZnNldHMgPSB7XG5cdFx0XHRcdFx0XHRbbG9jYWxlLmRheVBlcmlvZEFiYnJldmlhdGVkLmFtXTogXCJhbVwiLFxuXHRcdFx0XHRcdFx0W2xvY2FsZS5kYXlQZXJpb2RBYmJyZXZpYXRlZC5taWRuaWdodF06IFwibWlkbmlnaHRcIixcblx0XHRcdFx0XHRcdFtsb2NhbGUuZGF5UGVyaW9kQWJicmV2aWF0ZWQucG1dOiBcInBtXCIsXG5cdFx0XHRcdFx0XHRbbG9jYWxlLmRheVBlcmlvZEFiYnJldmlhdGVkLm5vb25dOiBcIm5vb25cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXHR9XG5cdC8vIG1hdGNoIGxvbmdlc3QgcG9zc2libGUgZGF5IHBlcmlvZCBzdHJpbmc7IHNvcnQga2V5cyBieSBsZW5ndGggZGVzY2VuZGluZ1xuXHRjb25zdCBzb3J0ZWRLZXlzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKG9mZnNldHMpXG5cdFx0LnNvcnQoKGE6IHN0cmluZywgYjogc3RyaW5nKTogbnVtYmVyID0+IChhLmxlbmd0aCA8IGIubGVuZ3RoID8gMSA6IGEubGVuZ3RoID4gYi5sZW5ndGggPyAtMSA6IDApKTtcblxuXHRjb25zdCB1cHBlciA9IHJlbWFpbmluZy50b1VwcGVyQ2FzZSgpO1xuXHRmb3IgKGNvbnN0IGtleSBvZiBzb3J0ZWRLZXlzKSB7XG5cdFx0aWYgKHVwcGVyLnN0YXJ0c1dpdGgoa2V5LnRvVXBwZXJDYXNlKCkpKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBvZmZzZXRzW2tleV0sXG5cdFx0XHRcdHJlbWFpbmluZzogcmVtYWluaW5nLnNsaWNlKGtleS5sZW5ndGgpXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXHR0aHJvdyBuZXcgRXJyb3IoXCJtaXNzaW5nIGRheSBwZXJpb2QgaS5lLiBcIiArIE9iamVjdC5rZXlzKG9mZnNldHMpLmpvaW4oXCIsIFwiKSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBmYWN0b3IgLTEgb3IgMSBkZXBlbmRpbmcgb24gQkMgb3IgQURcbiAqIEBwYXJhbSB0b2tlblxuICogQHBhcmFtIHJlbWFpbmluZ1xuICogQHBhcmFtIGxvY2FsZVxuICogQHJldHVybnMgW2ZhY3RvciwgcmVtYWluaW5nXVxuICovXG5mdW5jdGlvbiBzdHJpcEVyYSh0b2tlbjogVG9rZW4sIHJlbWFpbmluZzogc3RyaW5nLCBsb2NhbGU6IExvY2FsZSk6IFtudW1iZXIsIHN0cmluZ10ge1xuXHRsZXQgYWxsb3dlZDogc3RyaW5nW107XG5cdHN3aXRjaCAodG9rZW4ubGVuZ3RoKSB7XG5cdFx0Y2FzZSA0OiBhbGxvd2VkID0gbG9jYWxlLmVyYVdpZGU7IGJyZWFrO1xuXHRcdGNhc2UgNTogYWxsb3dlZCA9IGxvY2FsZS5lcmFOYXJyb3c7IGJyZWFrO1xuXHRcdGRlZmF1bHQ6IGFsbG93ZWQgPSBsb2NhbGUuZXJhQWJicmV2aWF0ZWQ7IGJyZWFrO1xuXHR9XG5cdGNvbnN0IHJlc3VsdCA9IHN0cmlwU3RyaW5ncyh0b2tlbiwgcmVtYWluaW5nLCBhbGxvd2VkKTtcblx0cmV0dXJuIFthbGxvd2VkLmluZGV4T2YocmVzdWx0LmNob3NlbikgPT09IDAgPyAxIDogLTEsIHJlc3VsdC5yZW1haW5pbmddO1xufVxuXG5mdW5jdGlvbiBzdHJpcFF1YXJ0ZXIodG9rZW46IFRva2VuLCByZW1haW5pbmc6IHN0cmluZywgbG9jYWxlOiBMb2NhbGUpOiBQYXJzZU51bWJlclJlc3VsdCB7XG5cdGxldCBxdWFydGVyTGV0dGVyOiBzdHJpbmc7XG5cdGxldCBxdWFydGVyV29yZDogc3RyaW5nO1xuXHRsZXQgcXVhcnRlckFiYnJldmlhdGlvbnM6IHN0cmluZ1tdO1xuXHRzd2l0Y2ggKHRva2VuLnN5bWJvbCkge1xuXHRcdGNhc2UgXCJRXCI6XG5cdFx0XHRxdWFydGVyTGV0dGVyID0gbG9jYWxlLnF1YXJ0ZXJMZXR0ZXI7XG5cdFx0XHRxdWFydGVyV29yZCA9IGxvY2FsZS5xdWFydGVyV29yZDtcblx0XHRcdHF1YXJ0ZXJBYmJyZXZpYXRpb25zID0gbG9jYWxlLnF1YXJ0ZXJBYmJyZXZpYXRpb25zO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInFcIjoge1xuXHRcdFx0cXVhcnRlckxldHRlciA9IGxvY2FsZS5zdGFuZEFsb25lUXVhcnRlckxldHRlcjtcblx0XHRcdHF1YXJ0ZXJXb3JkID0gbG9jYWxlLnN0YW5kQWxvbmVRdWFydGVyV29yZDtcblx0XHRcdHF1YXJ0ZXJBYmJyZXZpYXRpb25zID0gbG9jYWxlLnN0YW5kQWxvbmVRdWFydGVyQWJicmV2aWF0aW9ucztcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBxdWFydGVyIHBhdHRlcm5cIik7XG5cdH1cblx0bGV0IGFsbG93ZWQ6IHN0cmluZ1tdO1xuXHRzd2l0Y2ggKHRva2VuLmxlbmd0aCkge1xuXHRcdGNhc2UgMTpcblx0XHRjYXNlIDU6XG5cdFx0XHRyZXR1cm4gc3RyaXBOdW1iZXIocmVtYWluaW5nLCAxKTtcblx0XHRjYXNlIDI6XG5cdFx0XHRyZXR1cm4gc3RyaXBOdW1iZXIocmVtYWluaW5nLCAyKTtcblx0XHRjYXNlIDM6XG5cdFx0XHRhbGxvd2VkID0gWzEsIDIsIDMsIDRdLm1hcCgobjogbnVtYmVyKTogc3RyaW5nID0+IHF1YXJ0ZXJMZXR0ZXIgKyBuLnRvU3RyaW5nKDEwKSk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDQ6XG5cdFx0XHRhbGxvd2VkID0gcXVhcnRlckFiYnJldmlhdGlvbnMubWFwKChhOiBzdHJpbmcpOiBzdHJpbmcgPT4gYSArIFwiIFwiICsgcXVhcnRlcldvcmQpO1xuXHRcdFx0YnJlYWs7XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRkZWZhdWx0OlxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcXVhcnRlciBwYXR0ZXJuXCIpO1xuXHR9XG5cdGNvbnN0IHIgPSBzdHJpcFN0cmluZ3ModG9rZW4sIHJlbWFpbmluZywgYWxsb3dlZCk7XG5cdHJldHVybiB7IG46IGFsbG93ZWQuaW5kZXhPZihyLmNob3NlbikgKyAxLCByZW1haW5pbmc6IHIucmVtYWluaW5nIH07XG59XG5cbmZ1bmN0aW9uIHN0cmlwTW9udGgodG9rZW46IFRva2VuLCByZW1haW5pbmc6IHN0cmluZywgbG9jYWxlOiBMb2NhbGUpOiBQYXJzZU51bWJlclJlc3VsdCB7XG5cdGxldCBzaG9ydE1vbnRoTmFtZXM6IHN0cmluZ1tdO1xuXHRsZXQgbG9uZ01vbnRoTmFtZXM6IHN0cmluZ1tdO1xuXHRsZXQgbW9udGhMZXR0ZXJzOiBzdHJpbmdbXTtcblx0c3dpdGNoICh0b2tlbi5zeW1ib2wpIHtcblx0XHRjYXNlIFwiTVwiOlxuXHRcdFx0c2hvcnRNb250aE5hbWVzID0gbG9jYWxlLnNob3J0TW9udGhOYW1lcztcblx0XHRcdGxvbmdNb250aE5hbWVzID0gbG9jYWxlLmxvbmdNb250aE5hbWVzO1xuXHRcdFx0bW9udGhMZXR0ZXJzID0gbG9jYWxlLm1vbnRoTGV0dGVycztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJMXCI6XG5cdFx0XHRzaG9ydE1vbnRoTmFtZXMgPSBsb2NhbGUuc3RhbmRBbG9uZVNob3J0TW9udGhOYW1lcztcblx0XHRcdGxvbmdNb250aE5hbWVzID0gbG9jYWxlLnN0YW5kQWxvbmVMb25nTW9udGhOYW1lcztcblx0XHRcdG1vbnRoTGV0dGVycyA9IGxvY2FsZS5zdGFuZEFsb25lTW9udGhMZXR0ZXJzO1xuXHRcdFx0YnJlYWs7XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRkZWZhdWx0OlxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdHRocm93IG5ldyBFcnJvcihcImludmFsaWQgbW9udGggcGF0dGVyblwiKTtcblx0fVxuXHRsZXQgYWxsb3dlZDogc3RyaW5nW107XG5cdHN3aXRjaCAodG9rZW4ubGVuZ3RoKSB7XG5cdFx0Y2FzZSAxOlxuXHRcdGNhc2UgMjpcblx0XHRcdHJldHVybiBzdHJpcE51bWJlcihyZW1haW5pbmcsIDIpO1xuXHRcdGNhc2UgMzpcblx0XHRcdGFsbG93ZWQgPSBzaG9ydE1vbnRoTmFtZXM7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDQ6XG5cdFx0XHRhbGxvd2VkID0gbG9uZ01vbnRoTmFtZXM7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDU6XG5cdFx0XHRhbGxvd2VkID0gbW9udGhMZXR0ZXJzO1xuXHRcdFx0YnJlYWs7XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRkZWZhdWx0OlxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdHRocm93IG5ldyBFcnJvcihcImludmFsaWQgbW9udGggcGF0dGVyblwiKTtcblx0fVxuXHRjb25zdCByID0gc3RyaXBTdHJpbmdzKHRva2VuLCByZW1haW5pbmcsIGFsbG93ZWQpO1xuXHRyZXR1cm4geyBuOiBhbGxvd2VkLmluZGV4T2Yoci5jaG9zZW4pICsgMSwgcmVtYWluaW5nOiByLnJlbWFpbmluZyB9O1xufVxuXG5mdW5jdGlvbiBzdHJpcEhvdXIodG9rZW46IFRva2VuLCByZW1haW5pbmc6IHN0cmluZyk6IFBhcnNlTnVtYmVyUmVzdWx0IHtcblx0Y29uc3QgcmVzdWx0ID0gc3RyaXBOdW1iZXIocmVtYWluaW5nLCAyKTtcblx0c3dpdGNoICh0b2tlbi5zeW1ib2wpIHtcblx0XHRjYXNlIFwiaFwiOlxuXHRcdFx0aWYgKHJlc3VsdC5uID09PSAxMikge1xuXHRcdFx0XHRyZXN1bHQubiA9IDA7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiSFwiOlxuXHRcdFx0Ly8gbm90aGluZywgaW4gcmFuZ2UgMC0yM1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIktcIjpcblx0XHRcdC8vIG5vdGhpbmcsIGluIHJhbmdlIDAtMTFcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJrXCI6XG5cdFx0XHRyZXN1bHQubiAtPSAxO1xuXHRcdFx0YnJlYWs7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc3RyaXBTZWNvbmQodG9rZW46IFRva2VuLCByZW1haW5pbmc6IHN0cmluZyk6IFBhcnNlTnVtYmVyUmVzdWx0IHtcblx0c3dpdGNoICh0b2tlbi5zeW1ib2wpIHtcblx0XHRjYXNlIFwic1wiOlxuXHRcdFx0cmV0dXJuIHN0cmlwTnVtYmVyKHJlbWFpbmluZywgMik7XG5cdFx0Y2FzZSBcIlNcIjpcblx0XHRcdHJldHVybiBzdHJpcE51bWJlcihyZW1haW5pbmcsIHRva2VuLmxlbmd0aCk7XG5cdFx0Y2FzZSBcIkFcIjpcblx0XHRcdHJldHVybiBzdHJpcE51bWJlcihyZW1haW5pbmcsIDgpO1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHNlY29uZHMgcGF0dGVyblwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdHJpcE51bWJlcihzOiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyKTogUGFyc2VOdW1iZXJSZXN1bHQge1xuXHRjb25zdCByZXN1bHQ6IFBhcnNlTnVtYmVyUmVzdWx0ID0ge1xuXHRcdG46IE5hTixcblx0XHRyZW1haW5pbmc6IHNcblx0fTtcblx0bGV0IG51bWJlclN0cmluZyA9IFwiXCI7XG5cdHdoaWxlIChudW1iZXJTdHJpbmcubGVuZ3RoIDwgbWF4TGVuZ3RoICYmIHJlc3VsdC5yZW1haW5pbmcubGVuZ3RoID4gMCAmJiByZXN1bHQucmVtYWluaW5nLmNoYXJBdCgwKS5tYXRjaCgvXFxkLykpIHtcblx0XHRudW1iZXJTdHJpbmcgKz0gcmVzdWx0LnJlbWFpbmluZy5jaGFyQXQoMCk7XG5cdFx0cmVzdWx0LnJlbWFpbmluZyA9IHJlc3VsdC5yZW1haW5pbmcuc3Vic3RyKDEpO1xuXHR9XG5cdC8vIHJlbW92ZSBsZWFkaW5nIHplcm9lc1xuXHR3aGlsZSAobnVtYmVyU3RyaW5nLmNoYXJBdCgwKSA9PT0gXCIwXCIgJiYgbnVtYmVyU3RyaW5nLmxlbmd0aCA+IDEpIHtcblx0XHRudW1iZXJTdHJpbmcgPSBudW1iZXJTdHJpbmcuc3Vic3RyKDEpO1xuXHR9XG5cdHJlc3VsdC5uID0gcGFyc2VJbnQobnVtYmVyU3RyaW5nLCAxMCk7XG5cdGlmIChudW1iZXJTdHJpbmcgPT09IFwiXCIgfHwgIU51bWJlci5pc0Zpbml0ZShyZXN1bHQubikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkIGEgbnVtYmVyIGJ1dCBnb3QgJyR7bnVtYmVyU3RyaW5nfSdgKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpcFN0cmluZ3ModG9rZW46IFRva2VuLCByZW1haW5pbmc6IHN0cmluZywgYWxsb3dlZDogc3RyaW5nW10pOiB7IHJlbWFpbmluZzogc3RyaW5nLCBjaG9zZW46IHN0cmluZyB9IHtcblx0Ly8gbWF0Y2ggbG9uZ2VzdCBwb3NzaWJsZSBzdHJpbmc7IHNvcnQga2V5cyBieSBsZW5ndGggZGVzY2VuZGluZ1xuXHRjb25zdCBzb3J0ZWRLZXlzOiBzdHJpbmdbXSA9IGFsbG93ZWQuc2xpY2UoKVxuXHRcdC5zb3J0KChhOiBzdHJpbmcsIGI6IHN0cmluZyk6IG51bWJlciA9PiAoYS5sZW5ndGggPCBiLmxlbmd0aCA/IDEgOiBhLmxlbmd0aCA+IGIubGVuZ3RoID8gLTEgOiAwKSk7XG5cblx0Y29uc3QgdXBwZXIgPSByZW1haW5pbmcudG9VcHBlckNhc2UoKTtcblx0Zm9yIChjb25zdCBrZXkgb2Ygc29ydGVkS2V5cykge1xuXHRcdGlmICh1cHBlci5zdGFydHNXaXRoKGtleS50b1VwcGVyQ2FzZSgpKSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y2hvc2VuOiBrZXksXG5cdFx0XHRcdHJlbWFpbmluZzogcmVtYWluaW5nLnNsaWNlKGtleS5sZW5ndGgpXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXHR0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIFwiICsgVG9rZW5UeXBlW3Rva2VuLnR5cGVdLnRvTG93ZXJDYXNlKCkgKyBcIiwgZXhwZWN0ZWQgb25lIG9mIFwiICsgYWxsb3dlZC5qb2luKFwiLCBcIikpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBBQkIgU3dpdHplcmxhbmQgTHRkLlxuICpcbiAqIFBlcmlvZGljIGludGVydmFsIGZ1bmN0aW9uc1xuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgYXNzZXJ0IGZyb20gXCIuL2Fzc2VydFwiO1xuaW1wb3J0IHsgVGltZVVuaXQgfSBmcm9tIFwiLi9iYXNpY3NcIjtcbmltcG9ydCAqIGFzIGJhc2ljcyBmcm9tIFwiLi9iYXNpY3NcIjtcbmltcG9ydCB7IERhdGVUaW1lLCBpc0RhdGVUaW1lIH0gZnJvbSBcIi4vZGF0ZXRpbWVcIjtcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSBcIi4vZHVyYXRpb25cIjtcbmltcG9ydCB7IFRpbWVab25lLCBUaW1lWm9uZUtpbmQgfSBmcm9tIFwiLi90aW1lem9uZVwiO1xuXG4vKipcbiAqIFNwZWNpZmllcyBob3cgdGhlIHBlcmlvZCBzaG91bGQgcmVwZWF0IGFjcm9zcyB0aGUgZGF5XG4gKiBkdXJpbmcgRFNUIGNoYW5nZXMuXG4gKi9cbmV4cG9ydCBlbnVtIFBlcmlvZERzdCB7XG5cdC8qKlxuXHQgKiBLZWVwIHJlcGVhdGluZyBpbiBzaW1pbGFyIGludGVydmFscyBtZWFzdXJlZCBpbiBVVEMsXG5cdCAqIHVuYWZmZWN0ZWQgYnkgRGF5bGlnaHQgU2F2aW5nIFRpbWUuXG5cdCAqIEUuZy4gYSByZXBldGl0aW9uIG9mIG9uZSBob3VyIHdpbGwgdGFrZSBvbmUgcmVhbCBob3VyXG5cdCAqIGV2ZXJ5IHRpbWUsIGV2ZW4gaW4gYSB0aW1lIHpvbmUgd2l0aCBEU1QuXG5cdCAqIExlYXAgc2Vjb25kcywgbGVhcCBkYXlzIGFuZCBtb250aCBsZW5ndGhcblx0ICogZGlmZmVyZW5jZXMgd2lsbCBzdGlsbCBtYWtlIHRoZSBpbnRlcnZhbHMgZGlmZmVyZW50LlxuXHQgKi9cblx0UmVndWxhckludGVydmFscyxcblxuXHQvKipcblx0ICogRW5zdXJlIHRoYXQgdGhlIHRpbWUgYXQgd2hpY2ggdGhlIGludGVydmFscyBvY2N1ciBzdGF5XG5cdCAqIGF0IHRoZSBzYW1lIHBsYWNlIGluIHRoZSBkYXksIGxvY2FsIHRpbWUuIFNvIGUuZy5cblx0ICogYSBwZXJpb2Qgb2Ygb25lIGRheSwgcmVmZXJlbmNlaW5nIGF0IDg6MDVBTSBFdXJvcGUvQW1zdGVyZGFtIHRpbWVcblx0ICogd2lsbCBhbHdheXMgcmVmZXJlbmNlIGF0IDg6MDUgRXVyb3BlL0Ftc3RlcmRhbS4gVGhpcyBtZWFucyB0aGF0XG5cdCAqIGluIFVUQyB0aW1lLCBzb21lIGludGVydmFscyB3aWxsIGJlIDI1IGhvdXJzIGFuZCBzb21lXG5cdCAqIDIzIGhvdXJzIGR1cmluZyBEU1QgY2hhbmdlcy5cblx0ICogQW5vdGhlciBleGFtcGxlOiBhbiBob3VybHkgaW50ZXJ2YWwgd2lsbCBiZSBob3VybHkgaW4gbG9jYWwgdGltZSxcblx0ICogc2tpcHBpbmcgYW4gaG91ciBpbiBVVEMgZm9yIGEgRFNUIGJhY2t3YXJkIGNoYW5nZS5cblx0ICovXG5cdFJlZ3VsYXJMb2NhbFRpbWUsXG5cblx0LyoqXG5cdCAqIEVuZC1vZi1lbnVtIG1hcmtlclxuXHQgKi9cblx0TUFYXG59XG5cbi8qKlxuICogQ29udmVydCBhIFBlcmlvZERzdCB0byBhIHN0cmluZzogXCJyZWd1bGFyIGludGVydmFsc1wiIG9yIFwicmVndWxhciBsb2NhbCB0aW1lXCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBlcmlvZERzdFRvU3RyaW5nKHA6IFBlcmlvZERzdCk6IHN0cmluZyB7XG5cdHN3aXRjaCAocCkge1xuXHRcdGNhc2UgUGVyaW9kRHN0LlJlZ3VsYXJJbnRlcnZhbHM6IHJldHVybiBcInJlZ3VsYXIgaW50ZXJ2YWxzXCI7XG5cdFx0Y2FzZSBQZXJpb2REc3QuUmVndWxhckxvY2FsVGltZTogcmV0dXJuIFwicmVndWxhciBsb2NhbCB0aW1lXCI7XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRkZWZhdWx0OlxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0aWYgKHRydWUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBQZXJpb2REc3RcIik7XG5cdFx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBSZXBlYXRpbmcgdGltZSBwZXJpb2Q6IGNvbnNpc3RzIG9mIGEgcmVmZXJlbmNlIGRhdGUgYW5kXG4gKiBhIHRpbWUgbGVuZ3RoLiBUaGlzIGNsYXNzIGFjY291bnRzIGZvciBsZWFwIHNlY29uZHMgYW5kIGxlYXAgZGF5cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBlcmlvZCB7XG5cdC8qKlxuXHQgKiBBbGxvdyBub3QgdXNpbmcgaW5zdGFuY2VvZlxuXHQgKi9cblx0cHVibGljIGtpbmQgPSBcIlBlcmlvZFwiO1xuXG5cdC8qKlxuXHQgKiBSZWZlcmVuY2UgbW9tZW50IG9mIHBlcmlvZFxuXHQgKi9cblx0cHJpdmF0ZSBfcmVmZXJlbmNlOiBEYXRlVGltZTtcblxuXHQvKipcblx0ICogSW50ZXJ2YWxcblx0ICovXG5cdHByaXZhdGUgX2ludGVydmFsOiBEdXJhdGlvbjtcblxuXHQvKipcblx0ICogRFNUIGhhbmRsaW5nXG5cdCAqL1xuXHRwcml2YXRlIF9kc3Q6IFBlcmlvZERzdDtcblxuXHQvKipcblx0ICogTm9ybWFsaXplZCByZWZlcmVuY2UgZGF0ZSwgaGFzIGRheS1vZi1tb250aCA8PSAyOCBmb3IgTW9udGhseVxuXHQgKiBwZXJpb2QsIG9yIGZvciBZZWFybHkgcGVyaW9kIGlmIG1vbnRoIGlzIEZlYnJ1YXJ5XG5cdCAqL1xuXHRwcml2YXRlIF9pbnRSZWZlcmVuY2U6IERhdGVUaW1lO1xuXG5cdC8qKlxuXHQgKiBOb3JtYWxpemVkIGludGVydmFsXG5cdCAqL1xuXHRwcml2YXRlIF9pbnRJbnRlcnZhbDogRHVyYXRpb247XG5cblx0LyoqXG5cdCAqIE5vcm1hbGl6ZWQgaW50ZXJuYWwgRFNUIGhhbmRsaW5nLiBJZiBEU1QgaGFuZGxpbmcgaXMgaXJyZWxldmFudFxuXHQgKiAoYmVjYXVzZSB0aGUgcmVmZXJlbmNlIHRpbWUgem9uZSBkb2VzIG5vdCBoYXZlIERTVClcblx0ICogdGhlbiBpdCBpcyBzZXQgdG8gUmVndWxhckludGVydmFsXG5cdCAqL1xuXHRwcml2YXRlIF9pbnREc3Q6IFBlcmlvZERzdDtcblxuXHQvKipcblx0ICogQ29uc3RydWN0b3Jcblx0ICogTElNSVRBVElPTjogaWYgZHN0IGVxdWFscyBSZWd1bGFyTG9jYWxUaW1lLCBhbmQgdW5pdCBpcyBTZWNvbmQsIE1pbnV0ZSBvciBIb3VyLFxuXHQgKiB0aGVuIHRoZSBhbW91bnQgbXVzdCBiZSBhIGZhY3RvciBvZiAyNC4gU28gMTIwIHNlY29uZHMgaXMgYWxsb3dlZCB3aGlsZSAxMjEgc2Vjb25kcyBpcyBub3QuXG5cdCAqIFRoaXMgaXMgZHVlIHRvIHRoZSBlbm9ybW91cyBwcm9jZXNzaW5nIHBvd2VyIHJlcXVpcmVkIGJ5IHRoZXNlIGNhc2VzLiBUaGV5IGFyZSBub3Rcblx0ICogaW1wbGVtZW50ZWQgYW5kIHlvdSB3aWxsIGdldCBhbiBhc3NlcnQuXG5cdCAqXG5cdCAqIEBwYXJhbSByZWZlcmVuY2UgVGhlIHJlZmVyZW5jZSBkYXRlIG9mIHRoZSBwZXJpb2QuIElmIHRoZSBwZXJpb2QgaXMgaW4gTW9udGhzIG9yIFllYXJzLCBhbmRcblx0ICogICAgICAgICAgICAgICAgICB0aGUgZGF5IGlzIDI5IG9yIDMwIG9yIDMxLCB0aGUgcmVzdWx0cyBhcmUgbWF4aW1pc2VkIHRvIGVuZC1vZi1tb250aC5cblx0ICogQHBhcmFtIGludGVydmFsIFRoZSBpbnRlcnZhbCBvZiB0aGUgcGVyaW9kXG5cdCAqIEBwYXJhbSBkc3QgU3BlY2lmaWVzIGhvdyB0byBoYW5kbGUgRGF5bGlnaHQgU2F2aW5nIFRpbWUuIE5vdCByZWxldmFudFxuXHQgKiAgICAgICAgICAgIGlmIHRoZSB0aW1lIHpvbmUgb2YgdGhlIHJlZmVyZW5jZSBkYXRldGltZSBkb2VzIG5vdCBoYXZlIERTVC5cblx0ICogICAgICAgICAgICBEZWZhdWx0cyB0byBSZWd1bGFyTG9jYWxUaW1lLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoXG5cdFx0cmVmZXJlbmNlOiBEYXRlVGltZSxcblx0XHRpbnRlcnZhbDogRHVyYXRpb24sXG5cdFx0ZHN0PzogUGVyaW9kRHN0XG5cdCk7XG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RvclxuXHQgKiBMSU1JVEFUSU9OOiBpZiBkc3QgZXF1YWxzIFJlZ3VsYXJMb2NhbFRpbWUsIGFuZCB1bml0IGlzIFNlY29uZCwgTWludXRlIG9yIEhvdXIsXG5cdCAqIHRoZW4gdGhlIGFtb3VudCBtdXN0IGJlIGEgZmFjdG9yIG9mIDI0LiBTbyAxMjAgc2Vjb25kcyBpcyBhbGxvd2VkIHdoaWxlIDEyMSBzZWNvbmRzIGlzIG5vdC5cblx0ICogVGhpcyBpcyBkdWUgdG8gdGhlIGVub3Jtb3VzIHByb2Nlc3NpbmcgcG93ZXIgcmVxdWlyZWQgYnkgdGhlc2UgY2FzZXMuIFRoZXkgYXJlIG5vdFxuXHQgKiBpbXBsZW1lbnRlZCBhbmQgeW91IHdpbGwgZ2V0IGFuIGFzc2VydC5cblx0ICpcblx0ICogQHBhcmFtIHJlZmVyZW5jZSBUaGUgcmVmZXJlbmNlIG9mIHRoZSBwZXJpb2QuIElmIHRoZSBwZXJpb2QgaXMgaW4gTW9udGhzIG9yIFllYXJzLCBhbmRcblx0ICogICAgICAgICAgICAgICAgICB0aGUgZGF5IGlzIDI5IG9yIDMwIG9yIDMxLCB0aGUgcmVzdWx0cyBhcmUgbWF4aW1pc2VkIHRvIGVuZC1vZi1tb250aC5cblx0ICogQHBhcmFtIGFtb3VudCBUaGUgYW1vdW50IG9mIHVuaXRzLlxuXHQgKiBAcGFyYW0gdW5pdCBUaGUgdW5pdC5cblx0ICogQHBhcmFtIGRzdCBTcGVjaWZpZXMgaG93IHRvIGhhbmRsZSBEYXlsaWdodCBTYXZpbmcgVGltZS4gTm90IHJlbGV2YW50XG5cdCAqICAgICAgICAgICAgICBpZiB0aGUgdGltZSB6b25lIG9mIHRoZSByZWZlcmVuY2UgZGF0ZXRpbWUgZG9lcyBub3QgaGF2ZSBEU1QuXG5cdCAqICAgICAgICAgICAgICBEZWZhdWx0cyB0byBSZWd1bGFyTG9jYWxUaW1lLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoXG5cdFx0cmVmZXJlbmNlOiBEYXRlVGltZSxcblx0XHRhbW91bnQ6IG51bWJlcixcblx0XHR1bml0OiBUaW1lVW5pdCxcblx0XHRkc3Q/OiBQZXJpb2REc3Rcblx0KTtcblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yXG5cdCAqIExJTUlUQVRJT046IGlmIGRzdCBlcXVhbHMgUmVndWxhckxvY2FsVGltZSwgYW5kIHVuaXQgaXMgU2Vjb25kLCBNaW51dGUgb3IgSG91cixcblx0ICogdGhlbiB0aGUgYW1vdW50IG11c3QgYmUgYSBmYWN0b3Igb2YgMjQuIFNvIDEyMCBzZWNvbmRzIGlzIGFsbG93ZWQgd2hpbGUgMTIxIHNlY29uZHMgaXMgbm90LlxuXHQgKiBUaGlzIGlzIGR1ZSB0byB0aGUgZW5vcm1vdXMgcHJvY2Vzc2luZyBwb3dlciByZXF1aXJlZCBieSB0aGVzZSBjYXNlcy4gVGhleSBhcmUgbm90XG5cdCAqIGltcGxlbWVudGVkIGFuZCB5b3Ugd2lsbCBnZXQgYW4gYXNzZXJ0LlxuXHQgKlxuXHQgKiBAcGFyYW0ganNvbiBwZXJpb2QgcmVwcmVzZW50ZWQgYXMgSlNPTiBvYmplY3Rcblx0ICovXG5cdGNvbnN0cnVjdG9yKGpzb246IFBlcmlvZEpzb24pO1xuXHQvKipcblx0ICogQ29uc3RydWN0b3IgaW1wbGVtZW50YXRpb24uIFNlZSBvdGhlciBjb25zdHJ1Y3RvcnMgZm9yIGV4cGxhbmF0aW9uLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoXG5cdFx0YTogRGF0ZVRpbWUgfCBQZXJpb2RKc29uLFxuXHRcdGFtb3VudE9ySW50ZXJ2YWw/OiBhbnksXG5cdFx0dW5pdE9yRHN0PzogYW55LFxuXHRcdGdpdmVuRHN0PzogUGVyaW9kRHN0XG5cdCkge1xuXHRcdGxldCByZWZlcmVuY2U6IERhdGVUaW1lO1xuXHRcdGxldCBpbnRlcnZhbDogRHVyYXRpb247XG5cdFx0bGV0IGRzdDogUGVyaW9kRHN0ID0gUGVyaW9kRHN0LlJlZ3VsYXJMb2NhbFRpbWU7XG5cblx0XHRpZiAoaXNEYXRlVGltZShhKSkge1xuXHRcdFx0cmVmZXJlbmNlID0gYTtcblx0XHRcdGlmICh0eXBlb2YgKGFtb3VudE9ySW50ZXJ2YWwpID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdGludGVydmFsID0gYW1vdW50T3JJbnRlcnZhbCBhcyBEdXJhdGlvbjtcblx0XHRcdFx0ZHN0ID0gdW5pdE9yRHN0IGFzIFBlcmlvZERzdDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFzc2VydCh0eXBlb2YgdW5pdE9yRHN0ID09PSBcIm51bWJlclwiICYmIHVuaXRPckRzdCA+PSAwICYmIHVuaXRPckRzdCA8IFRpbWVVbml0Lk1BWCwgXCJJbnZhbGlkIHVuaXRcIik7XG5cdFx0XHRcdGludGVydmFsID0gbmV3IER1cmF0aW9uKGFtb3VudE9ySW50ZXJ2YWwgYXMgbnVtYmVyLCB1bml0T3JEc3QgYXMgVGltZVVuaXQpO1xuXHRcdFx0XHRkc3QgPSBnaXZlbkRzdCBhcyBQZXJpb2REc3Q7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIGRzdCAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRkc3QgPSBQZXJpb2REc3QuUmVndWxhckxvY2FsVGltZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVmZXJlbmNlID0gbmV3IERhdGVUaW1lKGEucmVmZXJlbmNlKTtcblx0XHRcdGludGVydmFsID0gbmV3IER1cmF0aW9uKGEuZHVyYXRpb24pO1xuXHRcdFx0ZHN0ID0gYS5wZXJpb2REc3QgPT09IFwicmVndWxhclwiID8gUGVyaW9kRHN0LlJlZ3VsYXJJbnRlcnZhbHMgOiBQZXJpb2REc3QuUmVndWxhckxvY2FsVGltZTtcblx0XHR9XG5cblx0XHRhc3NlcnQoZHN0ID49IDAgJiYgZHN0IDwgUGVyaW9kRHN0Lk1BWCwgXCJJbnZhbGlkIFBlcmlvZERzdCBzZXR0aW5nXCIpO1xuXHRcdGFzc2VydCghIXJlZmVyZW5jZSwgXCJSZWZlcmVuY2UgdGltZSBub3QgZ2l2ZW5cIik7XG5cdFx0YXNzZXJ0KGludGVydmFsLmFtb3VudCgpID4gMCwgXCJBbW91bnQgbXVzdCBiZSBwb3NpdGl2ZSBub24temVyby5cIik7XG5cdFx0YXNzZXJ0KE1hdGguZmxvb3IoaW50ZXJ2YWwuYW1vdW50KCkpID09PSBpbnRlcnZhbC5hbW91bnQoKSwgXCJBbW91bnQgbXVzdCBiZSBhIHdob2xlIG51bWJlclwiKTtcblxuXHRcdHRoaXMuX3JlZmVyZW5jZSA9IHJlZmVyZW5jZTtcblx0XHR0aGlzLl9pbnRlcnZhbCA9IGludGVydmFsO1xuXHRcdHRoaXMuX2RzdCA9IGRzdDtcblx0XHR0aGlzLl9jYWxjSW50ZXJuYWxWYWx1ZXMoKTtcblxuXHRcdC8vIHJlZ3VsYXIgbG9jYWwgdGltZSBrZWVwaW5nIGlzIG9ubHkgc3VwcG9ydGVkIGlmIHdlIGNhbiByZXNldCBlYWNoIGRheVxuXHRcdC8vIE5vdGUgd2UgdXNlIGludGVybmFsIGFtb3VudHMgdG8gZGVjaWRlIHRoaXMgYmVjYXVzZSBhY3R1YWxseSBpdCBpcyBzdXBwb3J0ZWQgaWZcblx0XHQvLyB0aGUgaW5wdXQgaXMgYSBtdWx0aXBsZSBvZiBvbmUgZGF5LlxuXHRcdGlmICh0aGlzLl9kc3RSZWxldmFudCgpICYmIGRzdCA9PT0gUGVyaW9kRHN0LlJlZ3VsYXJMb2NhbFRpbWUpIHtcblx0XHRcdHN3aXRjaCAodGhpcy5faW50SW50ZXJ2YWwudW5pdCgpKSB7XG5cdFx0XHRcdGNhc2UgVGltZVVuaXQuTWlsbGlzZWNvbmQ6XG5cdFx0XHRcdFx0YXNzZXJ0KFxuXHRcdFx0XHRcdFx0dGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkgPCA4NjQwMDAwMCxcblx0XHRcdFx0XHRcdFwiV2hlbiB1c2luZyBIb3VyLCBNaW51dGUgb3IgKE1pbGxpKVNlY29uZCB1bml0cywgd2l0aCBSZWd1bGFyIExvY2FsIFRpbWVzLCBcIiArXG5cdFx0XHRcdFx0XHRcInRoZW4gdGhlIGFtb3VudCBtdXN0IGJlIGVpdGhlciBsZXNzIHRoYW4gYSBkYXkgb3IgYSBtdWx0aXBsZSBvZiB0aGUgbmV4dCB1bml0LlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5TZWNvbmQ6XG5cdFx0XHRcdFx0YXNzZXJ0KFxuXHRcdFx0XHRcdFx0dGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkgPCA4NjQwMCxcblx0XHRcdFx0XHRcdFwiV2hlbiB1c2luZyBIb3VyLCBNaW51dGUgb3IgKE1pbGxpKVNlY29uZCB1bml0cywgd2l0aCBSZWd1bGFyIExvY2FsIFRpbWVzLCBcIiArXG5cdFx0XHRcdFx0XHRcInRoZW4gdGhlIGFtb3VudCBtdXN0IGJlIGVpdGhlciBsZXNzIHRoYW4gYSBkYXkgb3IgYSBtdWx0aXBsZSBvZiB0aGUgbmV4dCB1bml0LlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5NaW51dGU6XG5cdFx0XHRcdFx0YXNzZXJ0KFxuXHRcdFx0XHRcdFx0dGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkgPCAxNDQwLFxuXHRcdFx0XHRcdFx0XCJXaGVuIHVzaW5nIEhvdXIsIE1pbnV0ZSBvciAoTWlsbGkpU2Vjb25kIHVuaXRzLCB3aXRoIFJlZ3VsYXIgTG9jYWwgVGltZXMsIFwiICtcblx0XHRcdFx0XHRcdFwidGhlbiB0aGUgYW1vdW50IG11c3QgYmUgZWl0aGVyIGxlc3MgdGhhbiBhIGRheSBvciBhIG11bHRpcGxlIG9mIHRoZSBuZXh0IHVuaXQuXCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFRpbWVVbml0LkhvdXI6XG5cdFx0XHRcdFx0YXNzZXJ0KFxuXHRcdFx0XHRcdFx0dGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkgPCAyNCxcblx0XHRcdFx0XHRcdFwiV2hlbiB1c2luZyBIb3VyLCBNaW51dGUgb3IgKE1pbGxpKVNlY29uZCB1bml0cywgd2l0aCBSZWd1bGFyIExvY2FsIFRpbWVzLCBcIiArXG5cdFx0XHRcdFx0XHRcInRoZW4gdGhlIGFtb3VudCBtdXN0IGJlIGVpdGhlciBsZXNzIHRoYW4gYSBkYXkgb3IgYSBtdWx0aXBsZSBvZiB0aGUgbmV4dCB1bml0LlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJuIGEgZnJlc2ggY29weSBvZiB0aGUgcGVyaW9kXG5cdCAqL1xuXHRwdWJsaWMgY2xvbmUoKTogUGVyaW9kIHtcblx0XHRyZXR1cm4gbmV3IFBlcmlvZCh0aGlzLl9yZWZlcmVuY2UsIHRoaXMuX2ludGVydmFsLCB0aGlzLl9kc3QpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSByZWZlcmVuY2UgZGF0ZVxuXHQgKi9cblx0cHVibGljIHJlZmVyZW5jZSgpOiBEYXRlVGltZSB7XG5cdFx0cmV0dXJuIHRoaXMuX3JlZmVyZW5jZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBERVBSRUNBVEVEOiBvbGQgbmFtZSBmb3IgdGhlIHJlZmVyZW5jZSBkYXRlXG5cdCAqL1xuXHRwdWJsaWMgc3RhcnQoKTogRGF0ZVRpbWUge1xuXHRcdHJldHVybiB0aGlzLl9yZWZlcmVuY2U7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGludGVydmFsXG5cdCAqL1xuXHRwdWJsaWMgaW50ZXJ2YWwoKTogRHVyYXRpb24ge1xuXHRcdHJldHVybiB0aGlzLl9pbnRlcnZhbC5jbG9uZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbW91bnQgb2YgdW5pdHMgb2YgdGhlIGludGVydmFsXG5cdCAqL1xuXHRwdWJsaWMgYW1vdW50KCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuX2ludGVydmFsLmFtb3VudCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB1bml0IG9mIHRoZSBpbnRlcnZhbFxuXHQgKi9cblx0cHVibGljIHVuaXQoKTogVGltZVVuaXQge1xuXHRcdHJldHVybiB0aGlzLl9pbnRlcnZhbC51bml0KCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGRzdCBoYW5kbGluZyBtb2RlXG5cdCAqL1xuXHRwdWJsaWMgZHN0KCk6IFBlcmlvZERzdCB7XG5cdFx0cmV0dXJuIHRoaXMuX2RzdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiB0aGUgcGVyaW9kIGdyZWF0ZXIgdGhhblxuXHQgKiB0aGUgZ2l2ZW4gZGF0ZS4gVGhlIGdpdmVuIGRhdGUgbmVlZCBub3QgYmUgYXQgYSBwZXJpb2QgYm91bmRhcnkuXG5cdCAqIFByZTogdGhlIGZyb21kYXRlIGFuZCByZWZlcmVuY2UgZGF0ZSBtdXN0IGVpdGhlciBib3RoIGhhdmUgdGltZXpvbmVzIG9yIG5vdFxuXHQgKiBAcGFyYW0gZnJvbURhdGU6IHRoZSBkYXRlIGFmdGVyIHdoaWNoIHRvIHJldHVybiB0aGUgbmV4dCBkYXRlXG5cdCAqIEByZXR1cm4gdGhlIGZpcnN0IGRhdGUgbWF0Y2hpbmcgdGhlIHBlcmlvZCBhZnRlciBmcm9tRGF0ZSwgZ2l2ZW4gaW4gdGhlIHNhbWUgem9uZSBhcyB0aGUgZnJvbURhdGUuXG5cdCAqL1xuXHRwdWJsaWMgZmluZEZpcnN0KGZyb21EYXRlOiBEYXRlVGltZSk6IERhdGVUaW1lIHtcblx0XHRhc3NlcnQoXG5cdFx0XHQhIXRoaXMuX2ludFJlZmVyZW5jZS56b25lKCkgPT09ICEhZnJvbURhdGUuem9uZSgpLFxuXHRcdFx0XCJUaGUgZnJvbURhdGUgYW5kIHJlZmVyZW5jZSBkYXRlIG11c3QgYm90aCBiZSBhd2FyZSBvciB1bmF3YXJlXCJcblx0XHQpO1xuXHRcdGxldCBhcHByb3g6IERhdGVUaW1lO1xuXHRcdGxldCBhcHByb3gyOiBEYXRlVGltZTtcblx0XHRsZXQgYXBwcm94TWluOiBEYXRlVGltZTtcblx0XHRsZXQgcGVyaW9kczogbnVtYmVyO1xuXHRcdGxldCBkaWZmOiBudW1iZXI7XG5cdFx0bGV0IG5ld1llYXI6IG51bWJlcjtcblx0XHRsZXQgcmVtYWluZGVyOiBudW1iZXI7XG5cdFx0bGV0IGltYXg6IG51bWJlcjtcblx0XHRsZXQgaW1pbjogbnVtYmVyO1xuXHRcdGxldCBpbWlkOiBudW1iZXI7XG5cblx0XHRjb25zdCBub3JtYWxGcm9tID0gdGhpcy5fbm9ybWFsaXplRGF5KGZyb21EYXRlLnRvWm9uZSh0aGlzLl9pbnRSZWZlcmVuY2Uuem9uZSgpKSk7XG5cblx0XHRpZiAodGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkgPT09IDEpIHtcblx0XHRcdC8vIHNpbXBsZSBjYXNlczogYW1vdW50IGVxdWFscyAxIChlbGltaW5hdGVzIG5lZWQgZm9yIHNlYXJjaGluZyBmb3IgcmVmZXJlbmNlaW5nIHBvaW50KVxuXHRcdFx0aWYgKHRoaXMuX2ludERzdCA9PT0gUGVyaW9kRHN0LlJlZ3VsYXJJbnRlcnZhbHMpIHtcblx0XHRcdFx0Ly8gYXBwbHkgdG8gVVRDIHRpbWVcblx0XHRcdFx0c3dpdGNoICh0aGlzLl9pbnRJbnRlcnZhbC51bml0KCkpIHtcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0Lk1pbGxpc2Vjb25kOlxuXHRcdFx0XHRcdFx0YXBwcm94ID0gbmV3IERhdGVUaW1lKFxuXHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLnV0Y1llYXIoKSwgbm9ybWFsRnJvbS51dGNNb250aCgpLCBub3JtYWxGcm9tLnV0Y0RheSgpLFxuXHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLnV0Y0hvdXIoKSwgbm9ybWFsRnJvbS51dGNNaW51dGUoKSwgbm9ybWFsRnJvbS51dGNTZWNvbmQoKSxcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS51dGNNaWxsaXNlY29uZCgpLCBUaW1lWm9uZS51dGMoKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuU2Vjb25kOlxuXHRcdFx0XHRcdFx0YXBwcm94ID0gbmV3IERhdGVUaW1lKFxuXHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLnV0Y1llYXIoKSwgbm9ybWFsRnJvbS51dGNNb250aCgpLCBub3JtYWxGcm9tLnV0Y0RheSgpLFxuXHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLnV0Y0hvdXIoKSwgbm9ybWFsRnJvbS51dGNNaW51dGUoKSwgbm9ybWFsRnJvbS51dGNTZWNvbmQoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLnV0Y01pbGxpc2Vjb25kKCksIFRpbWVab25lLnV0YygpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5NaW51dGU6XG5cdFx0XHRcdFx0XHRhcHByb3ggPSBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20udXRjWWVhcigpLCBub3JtYWxGcm9tLnV0Y01vbnRoKCksIG5vcm1hbEZyb20udXRjRGF5KCksXG5cdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20udXRjSG91cigpLCBub3JtYWxGcm9tLnV0Y01pbnV0ZSgpLCB0aGlzLl9pbnRSZWZlcmVuY2UudXRjU2Vjb25kKCksXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS51dGNNaWxsaXNlY29uZCgpLCBUaW1lWm9uZS51dGMoKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuSG91cjpcblx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS51dGNZZWFyKCksIG5vcm1hbEZyb20udXRjTW9udGgoKSwgbm9ybWFsRnJvbS51dGNEYXkoKSxcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS51dGNIb3VyKCksIHRoaXMuX2ludFJlZmVyZW5jZS51dGNNaW51dGUoKSwgdGhpcy5faW50UmVmZXJlbmNlLnV0Y1NlY29uZCgpLFxuXHRcdFx0XHRcdFx0XHR0aGlzLl9pbnRSZWZlcmVuY2UudXRjTWlsbGlzZWNvbmQoKSwgVGltZVpvbmUudXRjKClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0LkRheTpcblx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS51dGNZZWFyKCksIG5vcm1hbEZyb20udXRjTW9udGgoKSwgbm9ybWFsRnJvbS51dGNEYXkoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLnV0Y0hvdXIoKSwgdGhpcy5faW50UmVmZXJlbmNlLnV0Y01pbnV0ZSgpLCB0aGlzLl9pbnRSZWZlcmVuY2UudXRjU2Vjb25kKCksXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS51dGNNaWxsaXNlY29uZCgpLCBUaW1lWm9uZS51dGMoKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuTW9udGg6XG5cdFx0XHRcdFx0XHRhcHByb3ggPSBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20udXRjWWVhcigpLCBub3JtYWxGcm9tLnV0Y01vbnRoKCksIHRoaXMuX2ludFJlZmVyZW5jZS51dGNEYXkoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLnV0Y0hvdXIoKSwgdGhpcy5faW50UmVmZXJlbmNlLnV0Y01pbnV0ZSgpLCB0aGlzLl9pbnRSZWZlcmVuY2UudXRjU2Vjb25kKCksXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS51dGNNaWxsaXNlY29uZCgpLCBUaW1lWm9uZS51dGMoKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuWWVhcjpcblx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS51dGNZZWFyKCksIHRoaXMuX2ludFJlZmVyZW5jZS51dGNNb250aCgpLCB0aGlzLl9pbnRSZWZlcmVuY2UudXRjRGF5KCksXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS51dGNIb3VyKCksIHRoaXMuX2ludFJlZmVyZW5jZS51dGNNaW51dGUoKSwgdGhpcy5faW50UmVmZXJlbmNlLnV0Y1NlY29uZCgpLFxuXHRcdFx0XHRcdFx0XHR0aGlzLl9pbnRSZWZlcmVuY2UudXRjTWlsbGlzZWNvbmQoKSwgVGltZVpvbmUudXRjKClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIFRpbWVVbml0XCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHdoaWxlICghYXBwcm94LmdyZWF0ZXJUaGFuKGZyb21EYXRlKSkge1xuXHRcdFx0XHRcdGFwcHJveCA9IGFwcHJveC5hZGQodGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCksIHRoaXMuX2ludEludGVydmFsLnVuaXQoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFRyeSB0byBrZWVwIHJlZ3VsYXIgbG9jYWwgaW50ZXJ2YWxzXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5faW50SW50ZXJ2YWwudW5pdCgpKSB7XG5cdFx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5NaWxsaXNlY29uZDpcblx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS55ZWFyKCksIG5vcm1hbEZyb20ubW9udGgoKSwgbm9ybWFsRnJvbS5kYXkoKSxcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS5ob3VyKCksIG5vcm1hbEZyb20ubWludXRlKCksIG5vcm1hbEZyb20uc2Vjb25kKCksXG5cdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20ubWlsbGlzZWNvbmQoKSwgdGhpcy5faW50UmVmZXJlbmNlLnpvbmUoKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuU2Vjb25kOlxuXHRcdFx0XHRcdFx0YXBwcm94ID0gbmV3IERhdGVUaW1lKFxuXHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLnllYXIoKSwgbm9ybWFsRnJvbS5tb250aCgpLCBub3JtYWxGcm9tLmRheSgpLFxuXHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLmhvdXIoKSwgbm9ybWFsRnJvbS5taW51dGUoKSwgbm9ybWFsRnJvbS5zZWNvbmQoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLm1pbGxpc2Vjb25kKCksIHRoaXMuX2ludFJlZmVyZW5jZS56b25lKClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0Lk1pbnV0ZTpcblx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS55ZWFyKCksIG5vcm1hbEZyb20ubW9udGgoKSwgbm9ybWFsRnJvbS5kYXkoKSxcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS5ob3VyKCksIG5vcm1hbEZyb20ubWludXRlKCksIHRoaXMuX2ludFJlZmVyZW5jZS5zZWNvbmQoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLm1pbGxpc2Vjb25kKCksIHRoaXMuX2ludFJlZmVyZW5jZS56b25lKClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0LkhvdXI6XG5cdFx0XHRcdFx0XHRhcHByb3ggPSBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20ueWVhcigpLCBub3JtYWxGcm9tLm1vbnRoKCksIG5vcm1hbEZyb20uZGF5KCksXG5cdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20uaG91cigpLCB0aGlzLl9pbnRSZWZlcmVuY2UubWludXRlKCksIHRoaXMuX2ludFJlZmVyZW5jZS5zZWNvbmQoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLm1pbGxpc2Vjb25kKCksIHRoaXMuX2ludFJlZmVyZW5jZS56b25lKClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0LkRheTpcblx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS55ZWFyKCksIG5vcm1hbEZyb20ubW9udGgoKSwgbm9ybWFsRnJvbS5kYXkoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLmhvdXIoKSwgdGhpcy5faW50UmVmZXJlbmNlLm1pbnV0ZSgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuc2Vjb25kKCksXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5taWxsaXNlY29uZCgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuem9uZSgpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5Nb250aDpcblx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS55ZWFyKCksIG5vcm1hbEZyb20ubW9udGgoKSwgdGhpcy5faW50UmVmZXJlbmNlLmRheSgpLFxuXHRcdFx0XHRcdFx0XHR0aGlzLl9pbnRSZWZlcmVuY2UuaG91cigpLCB0aGlzLl9pbnRSZWZlcmVuY2UubWludXRlKCksIHRoaXMuX2ludFJlZmVyZW5jZS5zZWNvbmQoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLm1pbGxpc2Vjb25kKCksIHRoaXMuX2ludFJlZmVyZW5jZS56b25lKClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0LlllYXI6XG5cdFx0XHRcdFx0XHRhcHByb3ggPSBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20ueWVhcigpLCB0aGlzLl9pbnRSZWZlcmVuY2UubW9udGgoKSwgdGhpcy5faW50UmVmZXJlbmNlLmRheSgpLFxuXHRcdFx0XHRcdFx0XHR0aGlzLl9pbnRSZWZlcmVuY2UuaG91cigpLCB0aGlzLl9pbnRSZWZlcmVuY2UubWludXRlKCksIHRoaXMuX2ludFJlZmVyZW5jZS5zZWNvbmQoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLm1pbGxpc2Vjb25kKCksIHRoaXMuX2ludFJlZmVyZW5jZS56b25lKClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIFRpbWVVbml0XCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHdoaWxlICghYXBwcm94LmdyZWF0ZXJUaGFuKG5vcm1hbEZyb20pKSB7XG5cdFx0XHRcdFx0YXBwcm94ID0gYXBwcm94LmFkZExvY2FsKHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpLCB0aGlzLl9pbnRJbnRlcnZhbC51bml0KCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEFtb3VudCBpcyBub3QgMSxcblx0XHRcdGlmICh0aGlzLl9pbnREc3QgPT09IFBlcmlvZERzdC5SZWd1bGFySW50ZXJ2YWxzKSB7XG5cdFx0XHRcdC8vIGFwcGx5IHRvIFVUQyB0aW1lXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5faW50SW50ZXJ2YWwudW5pdCgpKSB7XG5cdFx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5NaWxsaXNlY29uZDpcblx0XHRcdFx0XHRcdGRpZmYgPSBub3JtYWxGcm9tLmRpZmYodGhpcy5faW50UmVmZXJlbmNlKS5taWxsaXNlY29uZHMoKTtcblx0XHRcdFx0XHRcdHBlcmlvZHMgPSBNYXRoLmZsb29yKGRpZmYgLyB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSk7XG5cdFx0XHRcdFx0XHRhcHByb3ggPSB0aGlzLl9pbnRSZWZlcmVuY2UuYWRkKHBlcmlvZHMgKiB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSwgdGhpcy5faW50SW50ZXJ2YWwudW5pdCgpKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuU2Vjb25kOlxuXHRcdFx0XHRcdFx0ZGlmZiA9IG5vcm1hbEZyb20uZGlmZih0aGlzLl9pbnRSZWZlcmVuY2UpLnNlY29uZHMoKTtcblx0XHRcdFx0XHRcdHBlcmlvZHMgPSBNYXRoLmZsb29yKGRpZmYgLyB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSk7XG5cdFx0XHRcdFx0XHRhcHByb3ggPSB0aGlzLl9pbnRSZWZlcmVuY2UuYWRkKHBlcmlvZHMgKiB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSwgdGhpcy5faW50SW50ZXJ2YWwudW5pdCgpKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuTWludXRlOlxuXHRcdFx0XHRcdFx0Ly8gb25seSAyNSBsZWFwIHNlY29uZHMgaGF2ZSBldmVyIGJlZW4gYWRkZWQgc28gdGhpcyBzaG91bGQgc3RpbGwgYmUgT0suXG5cdFx0XHRcdFx0XHRkaWZmID0gbm9ybWFsRnJvbS5kaWZmKHRoaXMuX2ludFJlZmVyZW5jZSkubWludXRlcygpO1xuXHRcdFx0XHRcdFx0cGVyaW9kcyA9IE1hdGguZmxvb3IoZGlmZiAvIHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpKTtcblx0XHRcdFx0XHRcdGFwcHJveCA9IHRoaXMuX2ludFJlZmVyZW5jZS5hZGQocGVyaW9kcyAqIHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpLCB0aGlzLl9pbnRJbnRlcnZhbC51bml0KCkpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5Ib3VyOlxuXHRcdFx0XHRcdFx0ZGlmZiA9IG5vcm1hbEZyb20uZGlmZih0aGlzLl9pbnRSZWZlcmVuY2UpLmhvdXJzKCk7XG5cdFx0XHRcdFx0XHRwZXJpb2RzID0gTWF0aC5mbG9vcihkaWZmIC8gdGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkpO1xuXHRcdFx0XHRcdFx0YXBwcm94ID0gdGhpcy5faW50UmVmZXJlbmNlLmFkZChwZXJpb2RzICogdGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCksIHRoaXMuX2ludEludGVydmFsLnVuaXQoKSk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0LkRheTpcblx0XHRcdFx0XHRcdGRpZmYgPSBub3JtYWxGcm9tLmRpZmYodGhpcy5faW50UmVmZXJlbmNlKS5ob3VycygpIC8gMjQ7XG5cdFx0XHRcdFx0XHRwZXJpb2RzID0gTWF0aC5mbG9vcihkaWZmIC8gdGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkpO1xuXHRcdFx0XHRcdFx0YXBwcm94ID0gdGhpcy5faW50UmVmZXJlbmNlLmFkZChwZXJpb2RzICogdGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCksIHRoaXMuX2ludEludGVydmFsLnVuaXQoKSk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0Lk1vbnRoOlxuXHRcdFx0XHRcdFx0ZGlmZiA9IChub3JtYWxGcm9tLnV0Y1llYXIoKSAtIHRoaXMuX2ludFJlZmVyZW5jZS51dGNZZWFyKCkpICogMTIgK1xuXHRcdFx0XHRcdFx0XHQobm9ybWFsRnJvbS51dGNNb250aCgpIC0gdGhpcy5faW50UmVmZXJlbmNlLnV0Y01vbnRoKCkpIC0gMTtcblx0XHRcdFx0XHRcdHBlcmlvZHMgPSBNYXRoLmZsb29yKGRpZmYgLyB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSk7XG5cdFx0XHRcdFx0XHRhcHByb3ggPSB0aGlzLl9pbnRSZWZlcmVuY2UuYWRkKHBlcmlvZHMgKiB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSwgdGhpcy5faW50SW50ZXJ2YWwudW5pdCgpKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuWWVhcjpcblx0XHRcdFx0XHRcdC8vIFRoZSAtMSBiZWxvdyBpcyBiZWNhdXNlIHRoZSBkYXktb2YtbW9udGggb2YgcmVmZXJlbmNlIGRhdGUgbWF5IGJlIGFmdGVyIHRoZSBkYXkgb2YgdGhlIGZyb21EYXRlXG5cdFx0XHRcdFx0XHRkaWZmID0gbm9ybWFsRnJvbS55ZWFyKCkgLSB0aGlzLl9pbnRSZWZlcmVuY2UueWVhcigpIC0gMTtcblx0XHRcdFx0XHRcdHBlcmlvZHMgPSBNYXRoLmZsb29yKGRpZmYgLyB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSk7XG5cdFx0XHRcdFx0XHRhcHByb3ggPSB0aGlzLl9pbnRSZWZlcmVuY2UuYWRkKHBlcmlvZHMgKiB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSwgVGltZVVuaXQuWWVhcik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIFRpbWVVbml0XCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHdoaWxlICghYXBwcm94LmdyZWF0ZXJUaGFuKGZyb21EYXRlKSkge1xuXHRcdFx0XHRcdGFwcHJveCA9IGFwcHJveC5hZGQodGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCksIHRoaXMuX2ludEludGVydmFsLnVuaXQoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFRyeSB0byBrZWVwIHJlZ3VsYXIgbG9jYWwgdGltZXMuIElmIHRoZSB1bml0IGlzIGxlc3MgdGhhbiBhIGRheSwgd2UgcmVmZXJlbmNlIGVhY2ggZGF5IGFuZXdcblx0XHRcdFx0c3dpdGNoICh0aGlzLl9pbnRJbnRlcnZhbC51bml0KCkpIHtcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0Lk1pbGxpc2Vjb25kOlxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpIDwgMTAwMCAmJiAoMTAwMCAlIHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpKSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHQvLyBvcHRpbWl6YXRpb246IHNhbWUgbWlsbGlzZWNvbmQgZWFjaCBzZWNvbmQsIHNvIGp1c3QgdGFrZSB0aGUgZnJvbURhdGVcblx0XHRcdFx0XHRcdFx0Ly8gbWludXMgb25lIHNlY29uZCB3aXRoIHRoZSB0aGlzLl9pbnRSZWZlcmVuY2UgbWlsbGlzZWNvbmRzXG5cdFx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLnllYXIoKSwgbm9ybWFsRnJvbS5tb250aCgpLCBub3JtYWxGcm9tLmRheSgpLFxuXHRcdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20uaG91cigpLCBub3JtYWxGcm9tLm1pbnV0ZSgpLCBub3JtYWxGcm9tLnNlY29uZCgpLFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5taWxsaXNlY29uZCgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuem9uZSgpXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0LnN1YkxvY2FsKDEsIFRpbWVVbml0LlNlY29uZCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBwZXIgY29uc3RydWN0b3IgYXNzZXJ0LCB0aGUgc2Vjb25kcyBhcmUgbGVzcyB0aGFuIGEgZGF5LCBzbyBqdXN0IGdvIHRoZSBmcm9tRGF0ZSByZWZlcmVuY2Utb2YtZGF5XG5cdFx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLnllYXIoKSwgbm9ybWFsRnJvbS5tb250aCgpLCBub3JtYWxGcm9tLmRheSgpLFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5ob3VyKCksIHRoaXMuX2ludFJlZmVyZW5jZS5taW51dGUoKSwgdGhpcy5faW50UmVmZXJlbmNlLnNlY29uZCgpLFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5taWxsaXNlY29uZCgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuem9uZSgpXG5cdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gc2luY2Ugd2Ugc3RhcnQgY291bnRpbmcgZnJvbSB0aGlzLl9pbnRSZWZlcmVuY2UgZWFjaCBkYXksIHdlIGhhdmUgdG9cblx0XHRcdFx0XHRcdFx0Ly8gdGFrZSBjYXJlIG9mIHRoZSBzaG9ydGVyIGludGVydmFsIGF0IHRoZSBib3VuZGFyeVxuXHRcdFx0XHRcdFx0XHRyZW1haW5kZXIgPSBNYXRoLmZsb29yKCg4NjQwMDAwMCkgJSB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSk7XG5cdFx0XHRcdFx0XHRcdGlmIChhcHByb3guZ3JlYXRlclRoYW4obm9ybWFsRnJvbSkpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyB0b2RvXG5cdFx0XHRcdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGFwcHJveC5zdWJMb2NhbChyZW1haW5kZXIsIFRpbWVVbml0Lk1pbGxpc2Vjb25kKS5ncmVhdGVyVGhhbihub3JtYWxGcm9tKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gbm9ybWFsRnJvbSBsaWVzIG91dHNpZGUgdGhlIGJvdW5kYXJ5IHBlcmlvZCBiZWZvcmUgdGhlIHJlZmVyZW5jZSBkYXRlXG5cdFx0XHRcdFx0XHRcdFx0XHRhcHByb3ggPSBhcHByb3guc3ViTG9jYWwoMSwgVGltZVVuaXQuRGF5KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGFwcHJveC5hZGRMb2NhbCgxLCBUaW1lVW5pdC5EYXkpLnN1YkxvY2FsKHJlbWFpbmRlciwgVGltZVVuaXQuTWlsbGlzZWNvbmQpLmxlc3NFcXVhbChub3JtYWxGcm9tKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gbm9ybWFsRnJvbSBsaWVzIGluIHRoZSBib3VuZGFyeSBwZXJpb2QsIG1vdmUgdG8gdGhlIG5leHQgZGF5XG5cdFx0XHRcdFx0XHRcdFx0XHRhcHByb3ggPSBhcHByb3guYWRkTG9jYWwoMSwgVGltZVVuaXQuRGF5KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBvcHRpbWl6YXRpb246IGJpbmFyeSBzZWFyY2hcblx0XHRcdFx0XHRcdFx0aW1heCA9IE1hdGguZmxvb3IoKDg2NDAwMDAwKSAvIHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpKTtcblx0XHRcdFx0XHRcdFx0aW1pbiA9IDA7XG5cdFx0XHRcdFx0XHRcdHdoaWxlIChpbWF4ID49IGltaW4pIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBjYWxjdWxhdGUgdGhlIG1pZHBvaW50IGZvciByb3VnaGx5IGVxdWFsIHBhcnRpdGlvblxuXHRcdFx0XHRcdFx0XHRcdGltaWQgPSBNYXRoLmZsb29yKChpbWluICsgaW1heCkgLyAyKTtcblx0XHRcdFx0XHRcdFx0XHRhcHByb3gyID0gYXBwcm94LmFkZExvY2FsKGltaWQgKiB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSwgVGltZVVuaXQuTWlsbGlzZWNvbmQpO1xuXHRcdFx0XHRcdFx0XHRcdGFwcHJveE1pbiA9IGFwcHJveDIuc3ViTG9jYWwodGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCksIFRpbWVVbml0Lk1pbGxpc2Vjb25kKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYXBwcm94Mi5ncmVhdGVyVGhhbihub3JtYWxGcm9tKSAmJiBhcHByb3hNaW4ubGVzc0VxdWFsKG5vcm1hbEZyb20pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhcHByb3ggPSBhcHByb3gyO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcHByb3gyLmxlc3NFcXVhbChub3JtYWxGcm9tKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hhbmdlIG1pbiBpbmRleCB0byBzZWFyY2ggdXBwZXIgc3ViYXJyYXlcblx0XHRcdFx0XHRcdFx0XHRcdGltaW4gPSBpbWlkICsgMTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hhbmdlIG1heCBpbmRleCB0byBzZWFyY2ggbG93ZXIgc3ViYXJyYXlcblx0XHRcdFx0XHRcdFx0XHRcdGltYXggPSBpbWlkIC0gMTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuU2Vjb25kOlxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpIDwgNjAgJiYgKDYwICUgdGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdC8vIG9wdGltaXphdGlvbjogc2FtZSBzZWNvbmQgZWFjaCBtaW51dGUsIHNvIGp1c3QgdGFrZSB0aGUgZnJvbURhdGVcblx0XHRcdFx0XHRcdFx0Ly8gbWludXMgb25lIG1pbnV0ZSB3aXRoIHRoZSB0aGlzLl9pbnRSZWZlcmVuY2Ugc2Vjb25kc1xuXHRcdFx0XHRcdFx0XHRhcHByb3ggPSBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS55ZWFyKCksIG5vcm1hbEZyb20ubW9udGgoKSwgbm9ybWFsRnJvbS5kYXkoKSxcblx0XHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLmhvdXIoKSwgbm9ybWFsRnJvbS5taW51dGUoKSwgdGhpcy5faW50UmVmZXJlbmNlLnNlY29uZCgpLFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5taWxsaXNlY29uZCgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuem9uZSgpXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0LnN1YkxvY2FsKDEsIFRpbWVVbml0Lk1pbnV0ZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBwZXIgY29uc3RydWN0b3IgYXNzZXJ0LCB0aGUgc2Vjb25kcyBhcmUgbGVzcyB0aGFuIGEgZGF5LCBzbyBqdXN0IGdvIHRoZSBmcm9tRGF0ZSByZWZlcmVuY2Utb2YtZGF5XG5cdFx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLnllYXIoKSwgbm9ybWFsRnJvbS5tb250aCgpLCBub3JtYWxGcm9tLmRheSgpLFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5ob3VyKCksIHRoaXMuX2ludFJlZmVyZW5jZS5taW51dGUoKSwgdGhpcy5faW50UmVmZXJlbmNlLnNlY29uZCgpLFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5taWxsaXNlY29uZCgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuem9uZSgpXG5cdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gc2luY2Ugd2Ugc3RhcnQgY291bnRpbmcgZnJvbSB0aGlzLl9pbnRSZWZlcmVuY2UgZWFjaCBkYXksIHdlIGhhdmUgdG8gdGFrZVxuXHRcdFx0XHRcdFx0XHQvLyBhcmUgb2YgdGhlIHNob3J0ZXIgaW50ZXJ2YWwgYXQgdGhlIGJvdW5kYXJ5XG5cdFx0XHRcdFx0XHRcdHJlbWFpbmRlciA9IE1hdGguZmxvb3IoKDg2NDAwKSAlIHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpKTtcblx0XHRcdFx0XHRcdFx0aWYgKGFwcHJveC5ncmVhdGVyVGhhbihub3JtYWxGcm9tKSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChhcHByb3guc3ViTG9jYWwocmVtYWluZGVyLCBUaW1lVW5pdC5TZWNvbmQpLmdyZWF0ZXJUaGFuKG5vcm1hbEZyb20pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBub3JtYWxGcm9tIGxpZXMgb3V0c2lkZSB0aGUgYm91bmRhcnkgcGVyaW9kIGJlZm9yZSB0aGUgcmVmZXJlbmNlIGRhdGVcblx0XHRcdFx0XHRcdFx0XHRcdGFwcHJveCA9IGFwcHJveC5zdWJMb2NhbCgxLCBUaW1lVW5pdC5EYXkpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYXBwcm94LmFkZExvY2FsKDEsIFRpbWVVbml0LkRheSkuc3ViTG9jYWwocmVtYWluZGVyLCBUaW1lVW5pdC5TZWNvbmQpLmxlc3NFcXVhbChub3JtYWxGcm9tKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gbm9ybWFsRnJvbSBsaWVzIGluIHRoZSBib3VuZGFyeSBwZXJpb2QsIG1vdmUgdG8gdGhlIG5leHQgZGF5XG5cdFx0XHRcdFx0XHRcdFx0XHRhcHByb3ggPSBhcHByb3guYWRkTG9jYWwoMSwgVGltZVVuaXQuRGF5KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBvcHRpbWl6YXRpb246IGJpbmFyeSBzZWFyY2hcblx0XHRcdFx0XHRcdFx0aW1heCA9IE1hdGguZmxvb3IoKDg2NDAwKSAvIHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpKTtcblx0XHRcdFx0XHRcdFx0aW1pbiA9IDA7XG5cdFx0XHRcdFx0XHRcdHdoaWxlIChpbWF4ID49IGltaW4pIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBjYWxjdWxhdGUgdGhlIG1pZHBvaW50IGZvciByb3VnaGx5IGVxdWFsIHBhcnRpdGlvblxuXHRcdFx0XHRcdFx0XHRcdGltaWQgPSBNYXRoLmZsb29yKChpbWluICsgaW1heCkgLyAyKTtcblx0XHRcdFx0XHRcdFx0XHRhcHByb3gyID0gYXBwcm94LmFkZExvY2FsKGltaWQgKiB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSwgVGltZVVuaXQuU2Vjb25kKTtcblx0XHRcdFx0XHRcdFx0XHRhcHByb3hNaW4gPSBhcHByb3gyLnN1YkxvY2FsKHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpLCBUaW1lVW5pdC5TZWNvbmQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChhcHByb3gyLmdyZWF0ZXJUaGFuKG5vcm1hbEZyb20pICYmIGFwcHJveE1pbi5sZXNzRXF1YWwobm9ybWFsRnJvbSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFwcHJveCA9IGFwcHJveDI7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFwcHJveDIubGVzc0VxdWFsKG5vcm1hbEZyb20pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBjaGFuZ2UgbWluIGluZGV4IHRvIHNlYXJjaCB1cHBlciBzdWJhcnJheVxuXHRcdFx0XHRcdFx0XHRcdFx0aW1pbiA9IGltaWQgKyAxO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBjaGFuZ2UgbWF4IGluZGV4IHRvIHNlYXJjaCBsb3dlciBzdWJhcnJheVxuXHRcdFx0XHRcdFx0XHRcdFx0aW1heCA9IGltaWQgLSAxO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5NaW51dGU6XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkgPCA2MCAmJiAoNjAgJSB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSkgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0Ly8gb3B0aW1pemF0aW9uOiBzYW1lIGhvdXIgdGhpcy5faW50UmVmZXJlbmNlYXJ5IGVhY2ggdGltZSwgc28ganVzdCB0YWtlIHRoZSBmcm9tRGF0ZSBtaW51cyBvbmUgaG91clxuXHRcdFx0XHRcdFx0XHQvLyB3aXRoIHRoZSB0aGlzLl9pbnRSZWZlcmVuY2UgbWludXRlcywgc2Vjb25kc1xuXHRcdFx0XHRcdFx0XHRhcHByb3ggPSBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS55ZWFyKCksIG5vcm1hbEZyb20ubW9udGgoKSwgbm9ybWFsRnJvbS5kYXkoKSxcblx0XHRcdFx0XHRcdFx0XHRub3JtYWxGcm9tLmhvdXIoKSwgdGhpcy5faW50UmVmZXJlbmNlLm1pbnV0ZSgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuc2Vjb25kKCksXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLm1pbGxpc2Vjb25kKCksIHRoaXMuX2ludFJlZmVyZW5jZS56b25lKClcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHQuc3ViTG9jYWwoMSwgVGltZVVuaXQuSG91cik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBwZXIgY29uc3RydWN0b3IgYXNzZXJ0LCB0aGUgc2Vjb25kcyBmaXQgaW4gYSBkYXksIHNvIGp1c3QgZ28gdGhlIGZyb21EYXRlIHByZXZpb3VzIGRheVxuXHRcdFx0XHRcdFx0XHRhcHByb3ggPSBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdFx0XHRcdFx0bm9ybWFsRnJvbS55ZWFyKCksIG5vcm1hbEZyb20ubW9udGgoKSwgbm9ybWFsRnJvbS5kYXkoKSxcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9pbnRSZWZlcmVuY2UuaG91cigpLCB0aGlzLl9pbnRSZWZlcmVuY2UubWludXRlKCksIHRoaXMuX2ludFJlZmVyZW5jZS5zZWNvbmQoKSxcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9pbnRSZWZlcmVuY2UubWlsbGlzZWNvbmQoKSwgdGhpcy5faW50UmVmZXJlbmNlLnpvbmUoKVxuXHRcdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIHNpbmNlIHdlIHN0YXJ0IGNvdW50aW5nIGZyb20gdGhpcy5faW50UmVmZXJlbmNlIGVhY2ggZGF5LFxuXHRcdFx0XHRcdFx0XHQvLyB3ZSBoYXZlIHRvIHRha2UgY2FyZSBvZiB0aGUgc2hvcnRlciBpbnRlcnZhbCBhdCB0aGUgYm91bmRhcnlcblx0XHRcdFx0XHRcdFx0cmVtYWluZGVyID0gTWF0aC5mbG9vcigoMjQgKiA2MCkgJSB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSk7XG5cdFx0XHRcdFx0XHRcdGlmIChhcHByb3guZ3JlYXRlclRoYW4obm9ybWFsRnJvbSkpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYXBwcm94LnN1YkxvY2FsKHJlbWFpbmRlciwgVGltZVVuaXQuTWludXRlKS5ncmVhdGVyVGhhbihub3JtYWxGcm9tKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gbm9ybWFsRnJvbSBsaWVzIG91dHNpZGUgdGhlIGJvdW5kYXJ5IHBlcmlvZCBiZWZvcmUgdGhlIHJlZmVyZW5jZSBkYXRlXG5cdFx0XHRcdFx0XHRcdFx0XHRhcHByb3ggPSBhcHByb3guc3ViTG9jYWwoMSwgVGltZVVuaXQuRGF5KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGFwcHJveC5hZGRMb2NhbCgxLCBUaW1lVW5pdC5EYXkpLnN1YkxvY2FsKHJlbWFpbmRlciwgVGltZVVuaXQuTWludXRlKS5sZXNzRXF1YWwobm9ybWFsRnJvbSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vIG5vcm1hbEZyb20gbGllcyBpbiB0aGUgYm91bmRhcnkgcGVyaW9kLCBtb3ZlIHRvIHRoZSBuZXh0IGRheVxuXHRcdFx0XHRcdFx0XHRcdFx0YXBwcm94ID0gYXBwcm94LmFkZExvY2FsKDEsIFRpbWVVbml0LkRheSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFRpbWVVbml0LkhvdXI6XG5cdFx0XHRcdFx0XHRhcHByb3ggPSBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdFx0XHRcdG5vcm1hbEZyb20ueWVhcigpLCBub3JtYWxGcm9tLm1vbnRoKCksIG5vcm1hbEZyb20uZGF5KCksXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5ob3VyKCksIHRoaXMuX2ludFJlZmVyZW5jZS5taW51dGUoKSwgdGhpcy5faW50UmVmZXJlbmNlLnNlY29uZCgpLFxuXHRcdFx0XHRcdFx0XHR0aGlzLl9pbnRSZWZlcmVuY2UubWlsbGlzZWNvbmQoKSwgdGhpcy5faW50UmVmZXJlbmNlLnpvbmUoKVxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0Ly8gc2luY2Ugd2Ugc3RhcnQgY291bnRpbmcgZnJvbSB0aGlzLl9pbnRSZWZlcmVuY2UgZWFjaCBkYXksXG5cdFx0XHRcdFx0XHQvLyB3ZSBoYXZlIHRvIHRha2UgY2FyZSBvZiB0aGUgc2hvcnRlciBpbnRlcnZhbCBhdCB0aGUgYm91bmRhcnlcblx0XHRcdFx0XHRcdHJlbWFpbmRlciA9IE1hdGguZmxvb3IoMjQgJSB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSk7XG5cdFx0XHRcdFx0XHRpZiAoYXBwcm94LmdyZWF0ZXJUaGFuKG5vcm1hbEZyb20pKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChhcHByb3guc3ViTG9jYWwocmVtYWluZGVyLCBUaW1lVW5pdC5Ib3VyKS5ncmVhdGVyVGhhbihub3JtYWxGcm9tKSkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIG5vcm1hbEZyb20gbGllcyBvdXRzaWRlIHRoZSBib3VuZGFyeSBwZXJpb2QgYmVmb3JlIHRoZSByZWZlcmVuY2UgZGF0ZVxuXHRcdFx0XHRcdFx0XHRcdGFwcHJveCA9IGFwcHJveC5zdWJMb2NhbCgxLCBUaW1lVW5pdC5EYXkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZiAoYXBwcm94LmFkZExvY2FsKDEsIFRpbWVVbml0LkRheSkuc3ViTG9jYWwocmVtYWluZGVyLCBUaW1lVW5pdC5Ib3VyKS5sZXNzRXF1YWwobm9ybWFsRnJvbSkpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBub3JtYWxGcm9tIGxpZXMgaW4gdGhlIGJvdW5kYXJ5IHBlcmlvZCwgbW92ZSB0byB0aGUgbmV4dCBkYXlcblx0XHRcdFx0XHRcdFx0XHRhcHByb3ggPSBhcHByb3guYWRkTG9jYWwoMSwgVGltZVVuaXQuRGF5KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBUaW1lVW5pdC5EYXk6XG5cdFx0XHRcdFx0XHQvLyB3ZSBkb24ndCBoYXZlIGxlYXAgZGF5cywgc28gd2UgY2FuIGFwcHJveGltYXRlIGJ5IGNhbGN1bGF0aW5nIHdpdGggVVRDIHRpbWVzdGFtcHNcblx0XHRcdFx0XHRcdGRpZmYgPSBub3JtYWxGcm9tLmRpZmYodGhpcy5faW50UmVmZXJlbmNlKS5ob3VycygpIC8gMjQ7XG5cdFx0XHRcdFx0XHRwZXJpb2RzID0gTWF0aC5mbG9vcihkaWZmIC8gdGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkpO1xuXHRcdFx0XHRcdFx0YXBwcm94ID0gdGhpcy5faW50UmVmZXJlbmNlLmFkZExvY2FsKHBlcmlvZHMgKiB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSwgdGhpcy5faW50SW50ZXJ2YWwudW5pdCgpKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuTW9udGg6XG5cdFx0XHRcdFx0XHRkaWZmID0gKG5vcm1hbEZyb20ueWVhcigpIC0gdGhpcy5faW50UmVmZXJlbmNlLnllYXIoKSkgKiAxMiArXG5cdFx0XHRcdFx0XHRcdChub3JtYWxGcm9tLm1vbnRoKCkgLSB0aGlzLl9pbnRSZWZlcmVuY2UubW9udGgoKSk7XG5cdFx0XHRcdFx0XHRwZXJpb2RzID0gTWF0aC5mbG9vcihkaWZmIC8gdGhpcy5faW50SW50ZXJ2YWwuYW1vdW50KCkpO1xuXHRcdFx0XHRcdFx0YXBwcm94ID0gdGhpcy5faW50UmVmZXJlbmNlLmFkZExvY2FsKHRoaXMuX2ludGVydmFsLm11bHRpcGx5KHBlcmlvZHMpKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVGltZVVuaXQuWWVhcjpcblx0XHRcdFx0XHRcdC8vIFRoZSAtMSBiZWxvdyBpcyBiZWNhdXNlIHRoZSBkYXktb2YtbW9udGggb2YgcmVmZXJlbmNlIGRhdGUgbWF5IGJlIGFmdGVyIHRoZSBkYXkgb2YgdGhlIGZyb21EYXRlXG5cdFx0XHRcdFx0XHRkaWZmID0gbm9ybWFsRnJvbS55ZWFyKCkgLSB0aGlzLl9pbnRSZWZlcmVuY2UueWVhcigpIC0gMTtcblx0XHRcdFx0XHRcdHBlcmlvZHMgPSBNYXRoLmZsb29yKGRpZmYgLyB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSk7XG5cdFx0XHRcdFx0XHRuZXdZZWFyID0gdGhpcy5faW50UmVmZXJlbmNlLnllYXIoKSArIHBlcmlvZHMgKiB0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKTtcblx0XHRcdFx0XHRcdGFwcHJveCA9IG5ldyBEYXRlVGltZShcblx0XHRcdFx0XHRcdFx0bmV3WWVhciwgdGhpcy5faW50UmVmZXJlbmNlLm1vbnRoKCksIHRoaXMuX2ludFJlZmVyZW5jZS5kYXkoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5faW50UmVmZXJlbmNlLmhvdXIoKSwgdGhpcy5faW50UmVmZXJlbmNlLm1pbnV0ZSgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuc2Vjb25kKCksXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2ludFJlZmVyZW5jZS5taWxsaXNlY29uZCgpLCB0aGlzLl9pbnRSZWZlcmVuY2Uuem9uZSgpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRcdFx0aWYgKHRydWUpIHtcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBUaW1lVW5pdFwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR3aGlsZSAoIWFwcHJveC5ncmVhdGVyVGhhbihub3JtYWxGcm9tKSkge1xuXHRcdFx0XHRcdGFwcHJveCA9IGFwcHJveC5hZGRMb2NhbCh0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSwgdGhpcy5faW50SW50ZXJ2YWwudW5pdCgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY29ycmVjdERheShhcHByb3gpLmNvbnZlcnQoZnJvbURhdGUuem9uZSgpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBuZXh0IHRpbWVzdGFtcCBpbiB0aGUgcGVyaW9kLiBUaGUgZ2l2ZW4gdGltZXN0YW1wIG11c3Rcblx0ICogYmUgYXQgYSBwZXJpb2QgYm91bmRhcnksIG90aGVyd2lzZSB0aGUgYW5zd2VyIGlzIGluY29ycmVjdC5cblx0ICogVGhpcyBmdW5jdGlvbiBoYXMgTVVDSCBiZXR0ZXIgcGVyZm9ybWFuY2UgdGhhbiBmaW5kRmlyc3QuXG5cdCAqIFJldHVybnMgdGhlIGRhdGV0aW1lIFwiY291bnRcIiB0aW1lcyBhd2F5IGZyb20gdGhlIGdpdmVuIGRhdGV0aW1lLlxuXHQgKiBAcGFyYW0gcHJldlx0Qm91bmRhcnkgZGF0ZS4gTXVzdCBoYXZlIGEgdGltZSB6b25lIChhbnkgdGltZSB6b25lKSBpZmYgdGhlIHBlcmlvZCByZWZlcmVuY2UgZGF0ZSBoYXMgb25lLlxuXHQgKiBAcGFyYW0gY291bnRcdE51bWJlciBvZiBwZXJpb2RzIHRvIGFkZC4gT3B0aW9uYWwuIE11c3QgYmUgYW4gaW50ZWdlciBudW1iZXIsIG1heSBiZSBuZWdhdGl2ZS5cblx0ICogQHJldHVybiAocHJldiArIGNvdW50ICogcGVyaW9kKSwgaW4gdGhlIHNhbWUgdGltZXpvbmUgYXMgcHJldi5cblx0ICovXG5cdHB1YmxpYyBmaW5kTmV4dChwcmV2OiBEYXRlVGltZSwgY291bnQ6IG51bWJlciA9IDEpOiBEYXRlVGltZSB7XG5cdFx0YXNzZXJ0KCEhcHJldiwgXCJQcmV2IG11c3QgYmUgZ2l2ZW5cIik7XG5cdFx0YXNzZXJ0KFxuXHRcdFx0ISF0aGlzLl9pbnRSZWZlcmVuY2Uuem9uZSgpID09PSAhIXByZXYuem9uZSgpLFxuXHRcdFx0XCJUaGUgZnJvbURhdGUgYW5kIHJlZmVyZW5jZURhdGUgbXVzdCBib3RoIGJlIGF3YXJlIG9yIHVuYXdhcmVcIlxuXHRcdCk7XG5cdFx0YXNzZXJ0KHR5cGVvZiAoY291bnQpID09PSBcIm51bWJlclwiLCBcIkNvdW50IG11c3QgYmUgYSBudW1iZXJcIik7XG5cdFx0YXNzZXJ0KE1hdGguZmxvb3IoY291bnQpID09PSBjb3VudCwgXCJDb3VudCBtdXN0IGJlIGFuIGludGVnZXJcIik7XG5cdFx0Y29uc3Qgbm9ybWFsaXplZFByZXYgPSB0aGlzLl9ub3JtYWxpemVEYXkocHJldi50b1pvbmUodGhpcy5fcmVmZXJlbmNlLnpvbmUoKSkpO1xuXHRcdGlmICh0aGlzLl9pbnREc3QgPT09IFBlcmlvZERzdC5SZWd1bGFySW50ZXJ2YWxzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ycmVjdERheShub3JtYWxpemVkUHJldi5hZGQoXG5cdFx0XHRcdHRoaXMuX2ludEludGVydmFsLmFtb3VudCgpICogY291bnQsIHRoaXMuX2ludEludGVydmFsLnVuaXQoKSlcblx0XHRcdCkuY29udmVydChwcmV2LnpvbmUoKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb3JyZWN0RGF5KG5vcm1hbGl6ZWRQcmV2LmFkZExvY2FsKFxuXHRcdFx0XHR0aGlzLl9pbnRJbnRlcnZhbC5hbW91bnQoKSAqIGNvdW50LCB0aGlzLl9pbnRJbnRlcnZhbC51bml0KCkpXG5cdFx0XHQpLmNvbnZlcnQocHJldi56b25lKCkpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbGFzdCBvY2N1cnJlbmNlIG9mIHRoZSBwZXJpb2QgbGVzcyB0aGFuXG5cdCAqIHRoZSBnaXZlbiBkYXRlLiBUaGUgZ2l2ZW4gZGF0ZSBuZWVkIG5vdCBiZSBhdCBhIHBlcmlvZCBib3VuZGFyeS5cblx0ICogUHJlOiB0aGUgZnJvbWRhdGUgYW5kIHRoZSBwZXJpb2QgcmVmZXJlbmNlIGRhdGUgbXVzdCBlaXRoZXIgYm90aCBoYXZlIHRpbWV6b25lcyBvciBub3Rcblx0ICogQHBhcmFtIGZyb21EYXRlOiB0aGUgZGF0ZSBiZWZvcmUgd2hpY2ggdG8gcmV0dXJuIHRoZSBuZXh0IGRhdGVcblx0ICogQHJldHVybiB0aGUgbGFzdCBkYXRlIG1hdGNoaW5nIHRoZSBwZXJpb2QgYmVmb3JlIGZyb21EYXRlLCBnaXZlblxuXHQgKiAgICAgICAgIGluIHRoZSBzYW1lIHpvbmUgYXMgdGhlIGZyb21EYXRlLlxuXHQgKi9cblx0cHVibGljIGZpbmRMYXN0KGZyb206IERhdGVUaW1lKTogRGF0ZVRpbWUge1xuXHRcdGxldCByZXN1bHQgPSB0aGlzLmZpbmRQcmV2KHRoaXMuZmluZEZpcnN0KGZyb20pKTtcblx0XHRpZiAocmVzdWx0LmVxdWFscyhmcm9tKSkge1xuXHRcdFx0cmVzdWx0ID0gdGhpcy5maW5kUHJldihyZXN1bHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHByZXZpb3VzIHRpbWVzdGFtcCBpbiB0aGUgcGVyaW9kLiBUaGUgZ2l2ZW4gdGltZXN0YW1wIG11c3Rcblx0ICogYmUgYXQgYSBwZXJpb2QgYm91bmRhcnksIG90aGVyd2lzZSB0aGUgYW5zd2VyIGlzIGluY29ycmVjdC5cblx0ICogQHBhcmFtIHByZXZcdEJvdW5kYXJ5IGRhdGUuIE11c3QgaGF2ZSBhIHRpbWUgem9uZSAoYW55IHRpbWUgem9uZSkgaWZmIHRoZSBwZXJpb2QgcmVmZXJlbmNlIGRhdGUgaGFzIG9uZS5cblx0ICogQHBhcmFtIGNvdW50XHROdW1iZXIgb2YgcGVyaW9kcyB0byBzdWJ0cmFjdC4gT3B0aW9uYWwuIE11c3QgYmUgYW4gaW50ZWdlciBudW1iZXIsIG1heSBiZSBuZWdhdGl2ZS5cblx0ICogQHJldHVybiAobmV4dCAtIGNvdW50ICogcGVyaW9kKSwgaW4gdGhlIHNhbWUgdGltZXpvbmUgYXMgbmV4dC5cblx0ICovXG5cdHB1YmxpYyBmaW5kUHJldihuZXh0OiBEYXRlVGltZSwgY291bnQ6IG51bWJlciA9IDEpOiBEYXRlVGltZSB7XG5cdFx0cmV0dXJuIHRoaXMuZmluZE5leHQobmV4dCwgLTEgKiBjb3VudCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIGRhdGUgaXMgb24gYSBwZXJpb2QgYm91bmRhcnlcblx0ICogKGV4cGVuc2l2ZSEpXG5cdCAqL1xuXHRwdWJsaWMgaXNCb3VuZGFyeShvY2N1cnJlbmNlOiBEYXRlVGltZSk6IGJvb2xlYW4ge1xuXHRcdGlmICghb2NjdXJyZW5jZSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRhc3NlcnQoXG5cdFx0XHQhIXRoaXMuX2ludFJlZmVyZW5jZS56b25lKCkgPT09ICEhb2NjdXJyZW5jZS56b25lKCksXG5cdFx0XHRcIlRoZSBvY2N1cnJlbmNlIGFuZCByZWZlcmVuY2VEYXRlIG11c3QgYm90aCBiZSBhd2FyZSBvciB1bmF3YXJlXCJcblx0XHQpO1xuXHRcdHJldHVybiAodGhpcy5maW5kRmlyc3Qob2NjdXJyZW5jZS5zdWIoRHVyYXRpb24ubWlsbGlzZWNvbmRzKDEpKSkuZXF1YWxzKG9jY3VycmVuY2UpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRydWUgaWZmIHRoaXMgcGVyaW9kIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXMgdGhlIGdpdmVuIG9uZS5cblx0ICogaS5lLiBhIHBlcmlvZCBvZiAyNCBob3VycyBpcyBlcXVhbCB0byBvbmUgb2YgMSBkYXkgaWYgdGhleSBoYXZlIHRoZSBzYW1lIFVUQyByZWZlcmVuY2UgbW9tZW50XG5cdCAqIGFuZCBzYW1lIGRzdC5cblx0ICovXG5cdHB1YmxpYyBlcXVhbHMob3RoZXI6IFBlcmlvZCk6IGJvb2xlYW4ge1xuXHRcdC8vIG5vdGUgd2UgdGFrZSB0aGUgbm9uLW5vcm1hbGl6ZWQgX3JlZmVyZW5jZSBiZWNhdXNlIHRoaXMgaGFzIGFuIGluZmx1ZW5jZSBvbiB0aGUgb3V0Y29tZVxuXHRcdGlmICghdGhpcy5pc0JvdW5kYXJ5KG90aGVyLl9yZWZlcmVuY2UpIHx8ICF0aGlzLl9pbnRJbnRlcnZhbC5lcXVhbHMob3RoZXIuX2ludEludGVydmFsKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRjb25zdCByZWZab25lID0gdGhpcy5fcmVmZXJlbmNlLnpvbmUoKTtcblx0XHRjb25zdCBvdGhlclpvbmUgPSBvdGhlci5fcmVmZXJlbmNlLnpvbmUoKTtcblx0XHRjb25zdCB0aGlzSXNSZWd1bGFyID0gKHRoaXMuX2ludERzdCA9PT0gUGVyaW9kRHN0LlJlZ3VsYXJJbnRlcnZhbHMgfHwgIXJlZlpvbmUgfHwgcmVmWm9uZS5pc1V0YygpKTtcblx0XHRjb25zdCBvdGhlcklzUmVndWxhciA9IChvdGhlci5faW50RHN0ID09PSBQZXJpb2REc3QuUmVndWxhckludGVydmFscyB8fCAhb3RoZXJab25lIHx8IG90aGVyWm9uZS5pc1V0YygpKTtcblx0XHRpZiAodGhpc0lzUmVndWxhciAmJiBvdGhlcklzUmVndWxhcikge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmICh0aGlzLl9pbnREc3QgPT09IG90aGVyLl9pbnREc3QgJiYgcmVmWm9uZSAmJiBvdGhlclpvbmUgJiYgcmVmWm9uZS5lcXVhbHMob3RoZXJab25lKSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRydWUgaWZmIHRoaXMgcGVyaW9kIHdhcyBjb25zdHJ1Y3RlZCB3aXRoIGlkZW50aWNhbCBhcmd1bWVudHMgdG8gdGhlIG90aGVyIG9uZS5cblx0ICovXG5cdHB1YmxpYyBpZGVudGljYWwob3RoZXI6IFBlcmlvZCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAodGhpcy5fcmVmZXJlbmNlLmlkZW50aWNhbChvdGhlci5fcmVmZXJlbmNlKVxuXHRcdFx0JiYgdGhpcy5faW50ZXJ2YWwuaWRlbnRpY2FsKG90aGVyLl9pbnRlcnZhbClcblx0XHRcdCYmIHRoaXMuX2RzdCA9PT0gb3RoZXIuX2RzdCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBJU08gZHVyYXRpb24gc3RyaW5nIGUuZy5cblx0ICogMjAxNC0wMS0wMVQxMjowMDowMC4wMDArMDE6MDAvUDFIXG5cdCAqIDIwMTQtMDEtMDFUMTI6MDA6MDAuMDAwKzAxOjAwL1BUMU0gICAob25lIG1pbnV0ZSlcblx0ICogMjAxNC0wMS0wMVQxMjowMDowMC4wMDArMDE6MDAvUDFNICAgKG9uZSBtb250aClcblx0ICovXG5cdHB1YmxpYyB0b0lzb1N0cmluZygpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9yZWZlcmVuY2UudG9Jc29TdHJpbmcoKSArIFwiL1wiICsgdGhpcy5faW50ZXJ2YWwudG9Jc29TdHJpbmcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHN0cmluZyByZXByZXNlbnRhdGlvbiBlLmcuXG5cdCAqIFwiMTAgeWVhcnMsIHJlZmVyZW5jZWluZyBhdCAyMDE0LTAzLTAxVDEyOjAwOjAwIEV1cm9wZS9BbXN0ZXJkYW0sIGtlZXBpbmcgcmVndWxhciBpbnRlcnZhbHNcIi5cblx0ICovXG5cdHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuXHRcdGxldCByZXN1bHQ6IHN0cmluZyA9IHRoaXMuX2ludGVydmFsLnRvU3RyaW5nKCkgKyBcIiwgcmVmZXJlbmNlaW5nIGF0IFwiICsgdGhpcy5fcmVmZXJlbmNlLnRvU3RyaW5nKCk7XG5cdFx0Ly8gb25seSBhZGQgdGhlIERTVCBoYW5kbGluZyBpZiBpdCBpcyByZWxldmFudFxuXHRcdGlmICh0aGlzLl9kc3RSZWxldmFudCgpKSB7XG5cdFx0XHRyZXN1bHQgKz0gXCIsIGtlZXBpbmcgXCIgKyBwZXJpb2REc3RUb1N0cmluZyh0aGlzLl9kc3QpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSBKU09OLWNvbXBhdGlibGUgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBwZXJpb2Rcblx0ICovXG5cdHB1YmxpYyB0b0pzb24oKTogUGVyaW9kSnNvbiB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlZmVyZW5jZTogdGhpcy5yZWZlcmVuY2UoKS50b1N0cmluZygpLFxuXHRcdFx0ZHVyYXRpb246IHRoaXMuaW50ZXJ2YWwoKS50b1N0cmluZygpLFxuXHRcdFx0cGVyaW9kRHN0OiB0aGlzLmRzdCgpID09PSBQZXJpb2REc3QuUmVndWxhckludGVydmFscyA/IFwicmVndWxhclwiIDogXCJsb2NhbFwiXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb3JyZWN0cyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIF9yZWZlcmVuY2UgYW5kIF9pbnRSZWZlcmVuY2UuXG5cdCAqL1xuXHRwcml2YXRlIF9jb3JyZWN0RGF5KGQ6IERhdGVUaW1lKTogRGF0ZVRpbWUge1xuXHRcdGlmICh0aGlzLl9yZWZlcmVuY2UgIT09IHRoaXMuX2ludFJlZmVyZW5jZSkge1xuXHRcdFx0cmV0dXJuIG5ldyBEYXRlVGltZShcblx0XHRcdFx0ZC55ZWFyKCksIGQubW9udGgoKSwgTWF0aC5taW4oYmFzaWNzLmRheXNJbk1vbnRoKGQueWVhcigpLCBkLm1vbnRoKCkpLCB0aGlzLl9yZWZlcmVuY2UuZGF5KCkpLFxuXHRcdFx0XHRkLmhvdXIoKSwgZC5taW51dGUoKSwgZC5zZWNvbmQoKSwgZC5taWxsaXNlY29uZCgpLCBkLnpvbmUoKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBkO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBJZiB0aGlzLl9pbnRlcm5hbFVuaXQgaW4gW01vbnRoLCBZZWFyXSwgbm9ybWFsaXplcyB0aGUgZGF5LW9mLW1vbnRoXG5cdCAqIHRvIDw9IDI4LlxuXHQgKiBAcmV0dXJuIGEgbmV3IGRhdGUgaWYgZGlmZmVyZW50LCBvdGhlcndpc2UgdGhlIGV4YWN0IHNhbWUgb2JqZWN0IChubyBjbG9uZSEpXG5cdCAqL1xuXHRwcml2YXRlIF9ub3JtYWxpemVEYXkoZDogRGF0ZVRpbWUsIGFueW1vbnRoOiBib29sZWFuID0gdHJ1ZSk6IERhdGVUaW1lIHtcblx0XHRpZiAoKHRoaXMuX2ludEludGVydmFsLnVuaXQoKSA9PT0gVGltZVVuaXQuTW9udGggJiYgZC5kYXkoKSA+IDI4KVxuXHRcdFx0fHwgKHRoaXMuX2ludEludGVydmFsLnVuaXQoKSA9PT0gVGltZVVuaXQuWWVhciAmJiAoZC5tb250aCgpID09PSAyIHx8IGFueW1vbnRoKSAmJiBkLmRheSgpID4gMjgpXG5cdFx0XHQpIHtcblx0XHRcdHJldHVybiBuZXcgRGF0ZVRpbWUoXG5cdFx0XHRcdGQueWVhcigpLCBkLm1vbnRoKCksIDI4LFxuXHRcdFx0XHRkLmhvdXIoKSwgZC5taW51dGUoKSwgZC5zZWNvbmQoKSxcblx0XHRcdFx0ZC5taWxsaXNlY29uZCgpLCBkLnpvbmUoKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBkOyAvLyBzYXZlIG9uIHRpbWUgYnkgbm90IHJldHVybmluZyBhIGNsb25lXG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZiBEU1QgaGFuZGxpbmcgaXMgcmVsZXZhbnQgZm9yIHVzLlxuXHQgKiAoaS5lLiBpZiB0aGUgcmVmZXJlbmNlIHRpbWUgem9uZSBoYXMgRFNUKVxuXHQgKi9cblx0cHJpdmF0ZSBfZHN0UmVsZXZhbnQoKTogYm9vbGVhbiB7XG5cdFx0Y29uc3Qgem9uZSA9IHRoaXMuX3JlZmVyZW5jZS56b25lKCk7XG5cdFx0cmV0dXJuICEhKHpvbmVcblx0XHRcdCYmIHpvbmUua2luZCgpID09PSBUaW1lWm9uZUtpbmQuUHJvcGVyXG5cdFx0XHQmJiB6b25lLmhhc0RzdCgpXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOb3JtYWxpemUgdGhlIHZhbHVlcyB3aGVyZSBwb3NzaWJsZSAtIG5vdCBhbGwgdmFsdWVzXG5cdCAqIGFyZSBjb252ZXJ0aWJsZSBpbnRvIG9uZSBhbm90aGVyLiBXZWVrcyBhcmUgY29udmVydGVkIHRvIGRheXMuXG5cdCAqIEUuZy4gbW9yZSB0aGFuIDYwIG1pbnV0ZXMgaXMgdHJhbnNmZXJyZWQgdG8gaG91cnMsXG5cdCAqIGJ1dCBzZWNvbmRzIGNhbm5vdCBiZSB0cmFuc2ZlcnJlZCB0byBtaW51dGVzIGR1ZSB0byBsZWFwIHNlY29uZHMuXG5cdCAqIFdlZWtzIGFyZSBjb252ZXJ0ZWQgYmFjayB0byBkYXlzLlxuXHQgKi9cblx0cHJpdmF0ZSBfY2FsY0ludGVybmFsVmFsdWVzKCk6IHZvaWQge1xuXHRcdC8vIG5vcm1hbGl6ZSBhbnkgYWJvdmUtdW5pdCB2YWx1ZXNcblx0XHRsZXQgaW50QW1vdW50ID0gdGhpcy5faW50ZXJ2YWwuYW1vdW50KCk7XG5cdFx0bGV0IGludFVuaXQgPSB0aGlzLl9pbnRlcnZhbC51bml0KCk7XG5cblx0XHRpZiAoaW50VW5pdCA9PT0gVGltZVVuaXQuTWlsbGlzZWNvbmQgJiYgaW50QW1vdW50ID49IDEwMDAgJiYgaW50QW1vdW50ICUgMTAwMCA9PT0gMCkge1xuXHRcdFx0Ly8gbm90ZSB0aGlzIHdvbid0IHdvcmsgaWYgd2UgYWNjb3VudCBmb3IgbGVhcCBzZWNvbmRzXG5cdFx0XHRpbnRBbW91bnQgPSBpbnRBbW91bnQgLyAxMDAwO1xuXHRcdFx0aW50VW5pdCA9IFRpbWVVbml0LlNlY29uZDtcblx0XHR9XG5cdFx0aWYgKGludFVuaXQgPT09IFRpbWVVbml0LlNlY29uZCAmJiBpbnRBbW91bnQgPj0gNjAgJiYgaW50QW1vdW50ICUgNjAgPT09IDApIHtcblx0XHRcdC8vIG5vdGUgdGhpcyB3b24ndCB3b3JrIGlmIHdlIGFjY291bnQgZm9yIGxlYXAgc2Vjb25kc1xuXHRcdFx0aW50QW1vdW50ID0gaW50QW1vdW50IC8gNjA7XG5cdFx0XHRpbnRVbml0ID0gVGltZVVuaXQuTWludXRlO1xuXHRcdH1cblx0XHRpZiAoaW50VW5pdCA9PT0gVGltZVVuaXQuTWludXRlICYmIGludEFtb3VudCA+PSA2MCAmJiBpbnRBbW91bnQgJSA2MCA9PT0gMCkge1xuXHRcdFx0aW50QW1vdW50ID0gaW50QW1vdW50IC8gNjA7XG5cdFx0XHRpbnRVbml0ID0gVGltZVVuaXQuSG91cjtcblx0XHR9XG5cdFx0aWYgKGludFVuaXQgPT09IFRpbWVVbml0LkhvdXIgJiYgaW50QW1vdW50ID49IDI0ICYmIGludEFtb3VudCAlIDI0ID09PSAwKSB7XG5cdFx0XHRpbnRBbW91bnQgPSBpbnRBbW91bnQgLyAyNDtcblx0XHRcdGludFVuaXQgPSBUaW1lVW5pdC5EYXk7XG5cdFx0fVxuXHRcdC8vIG5vdyByZW1vdmUgd2Vla3Mgc28gd2UgaGF2ZSBvbmUgbGVzcyBjYXNlIHRvIHdvcnJ5IGFib3V0XG5cdFx0aWYgKGludFVuaXQgPT09IFRpbWVVbml0LldlZWspIHtcblx0XHRcdGludEFtb3VudCA9IGludEFtb3VudCAqIDc7XG5cdFx0XHRpbnRVbml0ID0gVGltZVVuaXQuRGF5O1xuXHRcdH1cblx0XHRpZiAoaW50VW5pdCA9PT0gVGltZVVuaXQuTW9udGggJiYgaW50QW1vdW50ID49IDEyICYmIGludEFtb3VudCAlIDEyID09PSAwKSB7XG5cdFx0XHRpbnRBbW91bnQgPSBpbnRBbW91bnQgLyAxMjtcblx0XHRcdGludFVuaXQgPSBUaW1lVW5pdC5ZZWFyO1xuXHRcdH1cblxuXHRcdHRoaXMuX2ludEludGVydmFsID0gbmV3IER1cmF0aW9uKGludEFtb3VudCwgaW50VW5pdCk7XG5cblx0XHQvLyBub3JtYWxpemUgZHN0IGhhbmRsaW5nXG5cdFx0aWYgKHRoaXMuX2RzdFJlbGV2YW50KCkpIHtcblx0XHRcdHRoaXMuX2ludERzdCA9IHRoaXMuX2RzdDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5faW50RHN0ID0gUGVyaW9kRHN0LlJlZ3VsYXJJbnRlcnZhbHM7XG5cdFx0fVxuXG5cdFx0Ly8gbm9ybWFsaXplIHJlZmVyZW5jZSBkYXlcblx0XHR0aGlzLl9pbnRSZWZlcmVuY2UgPSB0aGlzLl9ub3JtYWxpemVEYXkodGhpcy5fcmVmZXJlbmNlLCBmYWxzZSk7XG5cdH1cblxufVxuXG5cbi8qKlxuICogUGVyaW9kRHN0IGVuY29kZWQgYSBhIHN0cmluZ1xuICovXG5leHBvcnQgdHlwZSBQZXJpb2REc3RKc29uID0gXCJyZWd1bGFyXCIgfCBcImxvY2FsXCI7XG5cbi8qKlxuICogUGVyaW9kIGVuY29kZWQgYXMgYSBKU09OIG9iamVjdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBlcmlvZEpzb24ge1xuXHQvKipcblx0ICogUmVmZXJlbmNlIGRhdGUgYXMgaXNvIHRpbWVzdGFtcCArIHRpbWUgem9uZVxuXHQgKi9cblx0cmVmZXJlbmNlOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBJbnRlcnZhbCBhcyBhIHRpbWV6b25lY29tcGxldGUgZHVyYXRpb24gc3RyaW5nXG5cdCAqL1xuXHRkdXJhdGlvbjogc3RyaW5nO1xuXHQvKipcblx0ICogRGF5bGlnaHQgc2F2aW5nIHRpbWUgaGFuZGxpbmdcblx0ICovXG5cdHBlcmlvZERzdDogUGVyaW9kRHN0SnNvbjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWZmIHRoZSBnaXZlbiBqc29uIHZhbHVlIHJlcHJlc2VudHMgYSB2YWxpZCBwZXJpb2QgSlNPTlxuICogQHBhcmFtIGpzb25cbiAqIEB0aHJvd3Mgbm90aGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFBlcmlvZEpzb24oanNvbjogUGVyaW9kSnNvbik6IGJvb2xlYW4ge1xuXHRpZiAodHlwZW9mIGpzb24gIT09IFwib2JqZWN0XCIpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKGpzb24gPT09IG51bGwpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKHR5cGVvZiBqc29uLmR1cmF0aW9uICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlmICh0eXBlb2YganNvbi5wZXJpb2REc3QgIT09IFwic3RyaW5nXCIpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKHR5cGVvZiBqc29uLnJlZmVyZW5jZSAhPT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpZiAoIVtcInJlZ3VsYXJcIiwgXCJsb2NhbFwiXS5pbmNsdWRlcyhqc29uLnBlcmlvZERzdCkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dHJ5IHtcblx0XHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG5cdFx0bmV3IFBlcmlvZChqc29uKTtcblx0fSBjYXRjaCB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGdpdmVuIG9iamVjdCBpcyBvZiB0eXBlIFBlcmlvZC4gTm90ZSB0aGF0IGl0IGRvZXMgbm90IHdvcmsgZm9yIHN1YiBjbGFzc2VzLiBIb3dldmVyLCB1c2UgdGhpcyB0byBiZSByb2J1c3RcbiAqIGFnYWluc3QgZGlmZmVyZW50IHZlcnNpb25zIG9mIHRoZSBsaWJyYXJ5IGluIG9uZSBwcm9jZXNzIGluc3RlYWQgb2YgaW5zdGFuY2VvZlxuICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGNoZWNrXG4gKiBAdGhyb3dzIG5vdGhpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUGVyaW9kKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBQZXJpb2Qge1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLmtpbmQgPT09IFwiUGVyaW9kXCI7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSAyMDE0IEFCQiBTd2l0emVybGFuZCBMdGQuXG4gKlxuICogU3RyaW5nIHV0aWxpdHkgZnVuY3Rpb25zXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogUGFkIGEgc3RyaW5nIGJ5IGFkZGluZyBjaGFyYWN0ZXJzIHRvIHRoZSBiZWdpbm5pbmcuXG4gKiBAcGFyYW0gc1x0dGhlIHN0cmluZyB0byBwYWRcbiAqIEBwYXJhbSB3aWR0aFx0dGhlIGRlc2lyZWQgbWluaW11bSBzdHJpbmcgd2lkdGhcbiAqIEBwYXJhbSBjaGFyXHR0aGUgc2luZ2xlIGNoYXJhY3RlciB0byBwYWQgd2l0aFxuICogQHJldHVyblx0dGhlIHBhZGRlZCBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhZExlZnQoczogc3RyaW5nLCB3aWR0aDogbnVtYmVyLCBjaGFyOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRsZXQgcGFkZGluZzogc3RyaW5nID0gXCJcIjtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAod2lkdGggLSBzLmxlbmd0aCk7IGkrKykge1xuXHRcdHBhZGRpbmcgKz0gY2hhcjtcblx0fVxuXHRyZXR1cm4gcGFkZGluZyArIHM7XG59XG5cbi8qKlxuICogUGFkIGEgc3RyaW5nIGJ5IGFkZGluZyBjaGFyYWN0ZXJzIHRvIHRoZSBlbmQuXG4gKiBAcGFyYW0gc1x0dGhlIHN0cmluZyB0byBwYWRcbiAqIEBwYXJhbSB3aWR0aFx0dGhlIGRlc2lyZWQgbWluaW11bSBzdHJpbmcgd2lkdGhcbiAqIEBwYXJhbSBjaGFyXHR0aGUgc2luZ2xlIGNoYXJhY3RlciB0byBwYWQgd2l0aFxuICogQHJldHVyblx0dGhlIHBhZGRlZCBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhZFJpZ2h0KHM6IHN0cmluZywgd2lkdGg6IG51bWJlciwgY2hhcjogc3RyaW5nKTogc3RyaW5nIHtcblx0bGV0IHBhZGRpbmc6IHN0cmluZyA9IFwiXCI7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgKHdpZHRoIC0gcy5sZW5ndGgpOyBpKyspIHtcblx0XHRwYWRkaW5nICs9IGNoYXI7XG5cdH1cblx0cmV0dXJuIHMgKyBwYWRkaW5nO1xufVxuXG4iLCIvKipcbiAqIENvcHlyaWdodChjKSAyMDE0IEFCQiBTd2l0emVybGFuZCBMdGQuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogRm9yIHRlc3RpbmcgcHVycG9zZXMsIHdlIG9mdGVuIG5lZWQgdG8gbWFuaXB1bGF0ZSB3aGF0IHRoZSBjdXJyZW50XG4gKiB0aW1lIGlzLiBUaGlzIGlzIGFuIGludGVyZmFjZSBmb3IgYSBjdXN0b20gdGltZSBzb3VyY2Ugb2JqZWN0XG4gKiBzbyBpbiB0ZXN0cyB5b3UgY2FuIHVzZSBhIGN1c3RvbSB0aW1lIHNvdXJjZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaW1lU291cmNlIHtcblx0LyoqXG5cdCAqIFJldHVybiB0aGUgY3VycmVudCBkYXRlK3RpbWUgYXMgYSBqYXZhc2NyaXB0IERhdGUgb2JqZWN0XG5cdCAqL1xuXHRub3coKTogRGF0ZTtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHRpbWUgc291cmNlLCByZXR1cm5zIGFjdHVhbCB0aW1lXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFsVGltZVNvdXJjZSBpbXBsZW1lbnRzIFRpbWVTb3VyY2Uge1xuXHRwdWJsaWMgbm93KCk6IERhdGUge1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0aWYgKHRydWUpIHtcblx0XHRcdHJldHVybiBuZXcgRGF0ZSgpO1xuXHRcdH1cblx0fVxufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBBQkIgU3dpdHplcmxhbmQgTHRkLlxuICpcbiAqIFRpbWUgem9uZSByZXByZXNlbnRhdGlvbiBhbmQgb2Zmc2V0IGNhbGN1bGF0aW9uXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBhc3NlcnQgZnJvbSBcIi4vYXNzZXJ0XCI7XG5pbXBvcnQgeyBUaW1lU3RydWN0IH0gZnJvbSBcIi4vYmFzaWNzXCI7XG5pbXBvcnQgeyBEYXRlRnVuY3Rpb25zIH0gZnJvbSBcIi4vamF2YXNjcmlwdFwiO1xuaW1wb3J0ICogYXMgc3RyaW5ncyBmcm9tIFwiLi9zdHJpbmdzXCI7XG5pbXBvcnQgeyBOb3JtYWxpemVPcHRpb24sIFR6RGF0YWJhc2UgfSBmcm9tIFwiLi90ei1kYXRhYmFzZVwiO1xuXG4vKipcbiAqIFRoZSBsb2NhbCB0aW1lIHpvbmUgZm9yIGEgZ2l2ZW4gZGF0ZSBhcyBwZXIgT1Mgc2V0dGluZ3MuIE5vdGUgdGhhdCB0aW1lIHpvbmVzIGFyZSBjYWNoZWRcbiAqIHNvIHlvdSBkb24ndCBuZWNlc3NhcmlseSBnZXQgYSBuZXcgb2JqZWN0IGVhY2ggdGltZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsKCk6IFRpbWVab25lIHtcblx0cmV0dXJuIFRpbWVab25lLmxvY2FsKCk7XG59XG5cbi8qKlxuICogQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUgem9uZS4gTm90ZSB0aGF0IHRpbWUgem9uZXMgYXJlIGNhY2hlZFxuICogc28geW91IGRvbid0IG5lY2Vzc2FyaWx5IGdldCBhIG5ldyBvYmplY3QgZWFjaCB0aW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXRjKCk6IFRpbWVab25lIHtcblx0cmV0dXJuIFRpbWVab25lLnV0YygpO1xufVxuXG4vKipcbiAqIEBwYXJhbSBvZmZzZXQgb2Zmc2V0IHcuci50LiBVVEMgaW4gbWludXRlcywgZS5nLiA5MCBmb3IgKzAxOjMwLiBOb3RlIHRoYXQgdGltZSB6b25lcyBhcmUgY2FjaGVkXG4gKiBzbyB5b3UgZG9uJ3QgbmVjZXNzYXJpbHkgZ2V0IGEgbmV3IG9iamVjdCBlYWNoIHRpbWUuXG4gKiBAcmV0dXJucyBhIHRpbWUgem9uZSB3aXRoIHRoZSBnaXZlbiBmaXhlZCBvZmZzZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHpvbmUob2Zmc2V0OiBudW1iZXIpOiBUaW1lWm9uZTtcblxuLyoqXG4gKiBUaW1lIHpvbmUgZm9yIGFuIG9mZnNldCBzdHJpbmcgb3IgYW4gSUFOQSB0aW1lIHpvbmUgc3RyaW5nLiBOb3RlIHRoYXQgdGltZSB6b25lcyBhcmUgY2FjaGVkXG4gKiBzbyB5b3UgZG9uJ3QgbmVjZXNzYXJpbHkgZ2V0IGEgbmV3IG9iamVjdCBlYWNoIHRpbWUuXG4gKiBAcGFyYW0gcyBcImxvY2FsdGltZVwiIGZvciBsb2NhbCB0aW1lLFxuICogICAgICAgICAgYSBUWiBkYXRhYmFzZSB0aW1lIHpvbmUgbmFtZSAoZS5nLiBFdXJvcGUvQW1zdGVyZGFtKSxcbiAqICAgICAgICAgIG9yIGFuIG9mZnNldCBzdHJpbmcgKGVpdGhlciArMDE6MzAsICswMTMwLCArMDEsIFopLiBGb3IgYSBmdWxsIGxpc3Qgb2YgbmFtZXMsIHNlZTpcbiAqICAgICAgICAgIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfdHpfZGF0YWJhc2VfdGltZV96b25lc1xuICogQHBhcmFtIGRzdFx0T3B0aW9uYWwsIGRlZmF1bHQgdHJ1ZTogYWRoZXJlIHRvIERheWxpZ2h0IFNhdmluZyBUaW1lIGlmIGFwcGxpY2FibGUuIE5vdGUgZm9yXG4gKiAgICAgICAgICAgICAgXCJsb2NhbHRpbWVcIiwgdGltZXpvbmVjb21wbGV0ZSB3aWxsIGFkaGVyZSB0byB0aGUgY29tcHV0ZXIgc2V0dGluZ3MsIHRoZSBEU1QgZmxhZ1xuICogICAgICAgICAgICAgIGRvZXMgbm90IGhhdmUgYW55IGVmZmVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHpvbmUobmFtZTogc3RyaW5nLCBkc3Q/OiBib29sZWFuKTogVGltZVpvbmU7XG5cbi8qKlxuICogU2VlIHRoZSBkZXNjcmlwdGlvbnMgZm9yIHRoZSBvdGhlciB6b25lKCkgbWV0aG9kIHNpZ25hdHVyZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB6b25lKGE6IGFueSwgZHN0PzogYm9vbGVhbik6IFRpbWVab25lIHtcblx0cmV0dXJuIFRpbWVab25lLnpvbmUoYSwgZHN0KTtcbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiB0aW1lIHpvbmVcbiAqL1xuZXhwb3J0IGVudW0gVGltZVpvbmVLaW5kIHtcblx0LyoqXG5cdCAqIExvY2FsIHRpbWUgb2Zmc2V0IGFzIGRldGVybWluZWQgYnkgSmF2YVNjcmlwdCBEYXRlIGNsYXNzLlxuXHQgKi9cblx0TG9jYWwsXG5cdC8qKlxuXHQgKiBGaXhlZCBvZmZzZXQgZnJvbSBVVEMsIHdpdGhvdXQgRFNULlxuXHQgKi9cblx0T2Zmc2V0LFxuXHQvKipcblx0ICogSUFOQSB0aW1lem9uZSBtYW5hZ2VkIHRocm91Z2ggT2xzZW4gVFogZGF0YWJhc2UuIEluY2x1ZGVzXG5cdCAqIERTVCBpZiBhcHBsaWNhYmxlLlxuXHQgKi9cblx0UHJvcGVyXG59XG5cbi8qKlxuICogVGltZSB6b25lLiBUaGUgb2JqZWN0IGlzIGltbXV0YWJsZSBiZWNhdXNlIGl0IGlzIGNhY2hlZDpcbiAqIHJlcXVlc3RpbmcgYSB0aW1lIHpvbmUgdHdpY2UgeWllbGRzIHRoZSB2ZXJ5IHNhbWUgb2JqZWN0LlxuICogTm90ZSB0aGF0IHdlIHVzZSB0aW1lIHpvbmUgb2Zmc2V0cyBpbnZlcnRlZCB3LnIudC4gSmF2YVNjcmlwdCBEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCksXG4gKiBpLmUuIG9mZnNldCA5MCBtZWFucyArMDE6MzAuXG4gKlxuICogVGltZSB6b25lcyBjb21lIGluIHRocmVlIGZsYXZvcnM6IHRoZSBsb2NhbCB0aW1lIHpvbmUsIGFzIGNhbGN1bGF0ZWQgYnkgSmF2YVNjcmlwdCBEYXRlLFxuICogYSBmaXhlZCBvZmZzZXQgKFwiKzAxOjMwXCIpIHdpdGhvdXQgRFNULCBvciBhIElBTkEgdGltZXpvbmUgKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKSB3aXRoIERTVFxuICogYXBwbGllZCBkZXBlbmRpbmcgb24gdGhlIHRpbWUgem9uZSBydWxlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpbWVab25lIHtcblx0LyoqXG5cdCAqIEFsbG93IG5vdCB1c2luZyBpbnN0YW5jZW9mXG5cdCAqL1xuXHRwdWJsaWMgY2xhc3NLaW5kID0gXCJUaW1lWm9uZVwiO1xuXG5cdC8qKlxuXHQgKiBUaW1lIHpvbmUgaWRlbnRpZmllcjpcblx0ICogIFwibG9jYWx0aW1lXCIgc3RyaW5nIGZvciBsb2NhbCB0aW1lXG5cdCAqICBFLmcuIFwiLTAxOjMwXCIgZm9yIGEgZml4ZWQgb2Zmc2V0IGZyb20gVVRDXG5cdCAqICBFLmcuIFwiVVRDXCIgb3IgXCJFdXJvcGUvQW1zdGVyZGFtXCIgZm9yIGFuIE9sc2VuIFRaIGRhdGFiYXNlIHRpbWVcblx0ICovXG5cdHByaXZhdGUgX25hbWU6IHN0cmluZztcblxuXHQvKipcblx0ICogQWRoZXJlIHRvIERheWxpZ2h0IFNhdmluZyBUaW1lIGlmIGFwcGxpY2FibGVcblx0ICovXG5cdHByaXZhdGUgX2RzdDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIGtpbmQgb2YgdGltZSB6b25lIHNwZWNpZmllZCBieSBfbmFtZVxuXHQgKi9cblx0cHJpdmF0ZSBfa2luZDogVGltZVpvbmVLaW5kO1xuXG5cdC8qKlxuXHQgKiBPbmx5IGZvciBmaXhlZCBvZmZzZXRzOiB0aGUgb2Zmc2V0IGluIG1pbnV0ZXNcblx0ICovXG5cdHByaXZhdGUgX29mZnNldDogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgbG9jYWwgdGltZSB6b25lIGZvciBhIGdpdmVuIGRhdGUuIE5vdGUgdGhhdFxuXHQgKiB0aGUgdGltZSB6b25lIHZhcmllcyB3aXRoIHRoZSBkYXRlOiBhbXN0ZXJkYW0gdGltZSBmb3Jcblx0ICogMjAxNC0wMS0wMSBpcyArMDE6MDAgYW5kIGFtc3RlcmRhbSB0aW1lIGZvciAyMDE0LTA3LTAxIGlzICswMjowMFxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBsb2NhbCgpOiBUaW1lWm9uZSB7XG5cdFx0cmV0dXJuIFRpbWVab25lLl9maW5kT3JDcmVhdGUoXCJsb2NhbHRpbWVcIiwgdHJ1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIFVUQyB0aW1lIHpvbmUuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHV0YygpOiBUaW1lWm9uZSB7XG5cdFx0cmV0dXJuIFRpbWVab25lLl9maW5kT3JDcmVhdGUoXCJVVENcIiwgdHJ1ZSk7IC8vIHVzZSAndHJ1ZScgZm9yIERTVCBiZWNhdXNlIHdlIHdhbnQgaXQgdG8gZGlzcGxheSBhcyBcIlVUQ1wiLCBub3QgXCJVVEMgd2l0aG91dCBEU1RcIlxuXHR9XG5cblx0LyoqXG5cdCAqIFRpbWUgem9uZSB3aXRoIGEgZml4ZWQgb2Zmc2V0XG5cdCAqIEBwYXJhbSBvZmZzZXRcdG9mZnNldCB3LnIudC4gVVRDIGluIG1pbnV0ZXMsIGUuZy4gOTAgZm9yICswMTozMFxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB6b25lKG9mZnNldDogbnVtYmVyKTogVGltZVpvbmU7XG5cblx0LyoqXG5cdCAqIFRpbWUgem9uZSBmb3IgYW4gb2Zmc2V0IHN0cmluZyBvciBhbiBJQU5BIHRpbWUgem9uZSBzdHJpbmcuIE5vdGUgdGhhdCB0aW1lIHpvbmVzIGFyZSBjYWNoZWRcblx0ICogc28geW91IGRvbid0IG5lY2Vzc2FyaWx5IGdldCBhIG5ldyBvYmplY3QgZWFjaCB0aW1lLlxuXHQgKiBAcGFyYW0gcyBcImxvY2FsdGltZVwiIGZvciBsb2NhbCB0aW1lLFxuXHQgKiAgICAgICAgICBhIFRaIGRhdGFiYXNlIHRpbWUgem9uZSBuYW1lIChlLmcuIEV1cm9wZS9BbXN0ZXJkYW0pLFxuXHQgKiAgICAgICAgICBvciBhbiBvZmZzZXQgc3RyaW5nIChlaXRoZXIgKzAxOjMwLCArMDEzMCwgKzAxLCBaKS4gRm9yIGEgZnVsbCBsaXN0IG9mIG5hbWVzLCBzZWU6XG5cdCAqICAgICAgICAgIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfdHpfZGF0YWJhc2VfdGltZV96b25lc1xuXHQgKiAgICAgICAgICBUWiBkYXRhYmFzZSB6b25lIG5hbWUgbWF5IGJlIHN1ZmZpeGVkIHdpdGggXCIgd2l0aG91dCBEU1RcIiB0byBpbmRpY2F0ZSBubyBEU1Qgc2hvdWxkIGJlIGFwcGxpZWQuXG5cdCAqICAgICAgICAgIEluIHRoYXQgY2FzZSwgdGhlIGRzdCBwYXJhbWV0ZXIgaXMgaWdub3JlZC5cblx0ICogQHBhcmFtIGRzdFx0T3B0aW9uYWwsIGRlZmF1bHQgdHJ1ZTogYWRoZXJlIHRvIERheWxpZ2h0IFNhdmluZyBUaW1lIGlmIGFwcGxpY2FibGUuIE5vdGUgZm9yXG5cdCAqICAgICAgICAgICAgICBcImxvY2FsdGltZVwiLCB0aW1lem9uZWNvbXBsZXRlIHdpbGwgYWRoZXJlIHRvIHRoZSBjb21wdXRlciBzZXR0aW5ncywgdGhlIERTVCBmbGFnXG5cdCAqICAgICAgICAgICAgICBkb2VzIG5vdCBoYXZlIGFueSBlZmZlY3QuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHpvbmUoczogc3RyaW5nLCBkc3Q/OiBib29sZWFuKTogVGltZVpvbmU7XG5cblx0LyoqXG5cdCAqIFpvbmUgaW1wbGVtZW50YXRpb25zXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHpvbmUoYTogYW55LCBkc3Q6IGJvb2xlYW4gPSB0cnVlKTogVGltZVpvbmUge1xuXHRcdGxldCBuYW1lID0gXCJcIjtcblx0XHRzd2l0Y2ggKHR5cGVvZiAoYSkpIHtcblx0XHRcdGNhc2UgXCJzdHJpbmdcIjoge1xuXHRcdFx0XHRsZXQgcyA9IGEgYXMgc3RyaW5nO1xuXHRcdFx0XHRpZiAocy5pbmRleE9mKFwid2l0aG91dCBEU1RcIikgPj0gMCkge1xuXHRcdFx0XHRcdGRzdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHMgPSBzLnNsaWNlKDAsIHMuaW5kZXhPZihcIndpdGhvdXQgRFNUXCIpIC0gMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bmFtZSA9IFRpbWVab25lLl9ub3JtYWxpemVTdHJpbmcocyk7XG5cdFx0XHR9IGJyZWFrO1xuXHRcdFx0Y2FzZSBcIm51bWJlclwiOiB7XG5cdFx0XHRcdGNvbnN0IG9mZnNldDogbnVtYmVyID0gYSBhcyBudW1iZXI7XG5cdFx0XHRcdGFzc2VydChvZmZzZXQgPiAtMjQgKiA2MCAmJiBvZmZzZXQgPCAyNCAqIDYwLCBcIlRpbWVab25lLnpvbmUoKTogb2Zmc2V0IG91dCBvZiByYW5nZVwiKTtcblx0XHRcdFx0bmFtZSA9IFRpbWVab25lLm9mZnNldFRvU3RyaW5nKG9mZnNldCk7XG5cdFx0XHR9IGJyZWFrO1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRpbWVab25lLnpvbmUoKTogVW5leHBlY3RlZCBhcmd1bWVudCB0eXBlIFxcXCJcIiArIHR5cGVvZiAoYSkgKyBcIlxcXCJcIik7XG5cdFx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFRpbWVab25lLl9maW5kT3JDcmVhdGUobmFtZSwgZHN0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEbyBub3QgdXNlIHRoaXMgY29uc3RydWN0b3IsIHVzZSB0aGUgc3RhdGljXG5cdCAqIFRpbWVab25lLnpvbmUoKSBtZXRob2QgaW5zdGVhZC5cblx0ICogQHBhcmFtIG5hbWUgTk9STUFMSVpFRCBuYW1lLCBhc3N1bWVkIHRvIGJlIGNvcnJlY3Rcblx0ICogQHBhcmFtIGRzdFx0QWRoZXJlIHRvIERheWxpZ2h0IFNhdmluZyBUaW1lIGlmIGFwcGxpY2FibGUsIGlnbm9yZWQgZm9yIGxvY2FsIHRpbWUgYW5kIGZpeGVkIG9mZnNldHNcblx0ICovXG5cdHByaXZhdGUgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBkc3Q6IGJvb2xlYW4gPSB0cnVlKSB7XG5cdFx0dGhpcy5fbmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5fZHN0ID0gZHN0O1xuXHRcdGlmIChuYW1lID09PSBcImxvY2FsdGltZVwiKSB7XG5cdFx0XHR0aGlzLl9raW5kID0gVGltZVpvbmVLaW5kLkxvY2FsO1xuXHRcdH0gZWxzZSBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwiK1wiIHx8IG5hbWUuY2hhckF0KDApID09PSBcIi1cIiB8fCBuYW1lLmNoYXJBdCgwKS5tYXRjaCgvXFxkLykgfHwgbmFtZSA9PT0gXCJaXCIpIHtcblx0XHRcdHRoaXMuX2tpbmQgPSBUaW1lWm9uZUtpbmQuT2Zmc2V0O1xuXHRcdFx0dGhpcy5fb2Zmc2V0ID0gVGltZVpvbmUuc3RyaW5nVG9PZmZzZXQobmFtZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2tpbmQgPSBUaW1lWm9uZUtpbmQuUHJvcGVyO1xuXHRcdFx0YXNzZXJ0KFR6RGF0YWJhc2UuaW5zdGFuY2UoKS5leGlzdHMobmFtZSksIGBub24tZXhpc3RpbmcgdGltZSB6b25lIG5hbWUgJyR7bmFtZX0nYCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2VzIHRoaXMgY2xhc3MgYXBwZWFyIGNsb25hYmxlLiBOT1RFIGFzIHRpbWUgem9uZSBvYmplY3RzIGFyZSBjYWNoZWQgeW91IHdpbGwgTk9UXG5cdCAqIGFjdHVhbGx5IGdldCBhIGNsb25lIGJ1dCB0aGUgc2FtZSBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgY2xvbmUoKTogVGltZVpvbmUge1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0aW1lIHpvbmUgaWRlbnRpZmllci4gQ2FuIGJlIGFuIG9mZnNldCBcIi0wMTozMFwiIG9yIGFuXG5cdCAqIElBTkEgdGltZSB6b25lIG5hbWUgXCJFdXJvcGUvQW1zdGVyZGFtXCIsIG9yIFwibG9jYWx0aW1lXCIgZm9yXG5cdCAqIHRoZSBsb2NhbCB0aW1lIHpvbmUuXG5cdCAqL1xuXHRwdWJsaWMgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9uYW1lO1xuXHR9XG5cblx0cHVibGljIGRzdCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fZHN0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBraW5kIG9mIHRpbWUgem9uZSAoTG9jYWwvT2Zmc2V0L1Byb3Blcilcblx0ICovXG5cdHB1YmxpYyBraW5kKCk6IFRpbWVab25lS2luZCB7XG5cdFx0cmV0dXJuIHRoaXMuX2tpbmQ7XG5cdH1cblxuXHQvKipcblx0ICogRXF1YWxpdHkgb3BlcmF0b3IuIE1hcHMgemVybyBvZmZzZXRzIGFuZCBkaWZmZXJlbnQgbmFtZXMgZm9yIFVUQyBvbnRvXG5cdCAqIGVhY2ggb3RoZXIuIE90aGVyIHRpbWUgem9uZXMgYXJlIG5vdCBtYXBwZWQgb250byBlYWNoIG90aGVyLlxuXHQgKi9cblx0cHVibGljIGVxdWFscyhvdGhlcjogVGltZVpvbmUpOiBib29sZWFuIHtcblx0XHRpZiAodGhpcy5pc1V0YygpICYmIG90aGVyLmlzVXRjKCkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRzd2l0Y2ggKHRoaXMuX2tpbmQpIHtcblx0XHRcdGNhc2UgVGltZVpvbmVLaW5kLkxvY2FsOiByZXR1cm4gKG90aGVyLmtpbmQoKSA9PT0gVGltZVpvbmVLaW5kLkxvY2FsKTtcblx0XHRcdGNhc2UgVGltZVpvbmVLaW5kLk9mZnNldDogcmV0dXJuIChvdGhlci5raW5kKCkgPT09IFRpbWVab25lS2luZC5PZmZzZXQgJiYgdGhpcy5fb2Zmc2V0ID09PSBvdGhlci5fb2Zmc2V0KTtcblx0XHRcdGNhc2UgVGltZVpvbmVLaW5kLlByb3BlcjogcmV0dXJuIChvdGhlci5raW5kKCkgPT09IFRpbWVab25lS2luZC5Qcm9wZXJcblx0XHRcdFx0JiYgdGhpcy5fbmFtZSA9PT0gb3RoZXIuX25hbWVcblx0XHRcdFx0JiYgKHRoaXMuX2RzdCA9PT0gb3RoZXIuX2RzdCB8fCAhdGhpcy5oYXNEc3QoKSkpO1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gdGltZSB6b25lIGtpbmQuXCIpO1xuXHRcdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZmYgdGhlIGNvbnN0cnVjdG9yIGFyZ3VtZW50cyB3ZXJlIGlkZW50aWNhbCwgc28gVVRDICE9PSBHTVRcblx0ICovXG5cdHB1YmxpYyBpZGVudGljYWwob3RoZXI6IFRpbWVab25lKTogYm9vbGVhbiB7XG5cdFx0c3dpdGNoICh0aGlzLl9raW5kKSB7XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5Mb2NhbDogcmV0dXJuIChvdGhlci5raW5kKCkgPT09IFRpbWVab25lS2luZC5Mb2NhbCk7XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5PZmZzZXQ6IHJldHVybiAob3RoZXIua2luZCgpID09PSBUaW1lWm9uZUtpbmQuT2Zmc2V0ICYmIHRoaXMuX29mZnNldCA9PT0gb3RoZXIuX29mZnNldCk7XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5Qcm9wZXI6IHJldHVybiAob3RoZXIua2luZCgpID09PSBUaW1lWm9uZUtpbmQuUHJvcGVyICYmIHRoaXMuX25hbWUgPT09IG90aGVyLl9uYW1lICYmIHRoaXMuX2RzdCA9PT0gb3RoZXIuX2RzdCk7XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGlmICh0cnVlKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biB0aW1lIHpvbmUga2luZC5cIik7XG5cdFx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogSXMgdGhpcyB6b25lIGVxdWl2YWxlbnQgdG8gVVRDP1xuXHQgKi9cblx0cHVibGljIGlzVXRjKCk6IGJvb2xlYW4ge1xuXHRcdHN3aXRjaCAodGhpcy5fa2luZCkge1xuXHRcdFx0Y2FzZSBUaW1lWm9uZUtpbmQuTG9jYWw6IHJldHVybiBmYWxzZTtcblx0XHRcdGNhc2UgVGltZVpvbmVLaW5kLk9mZnNldDogcmV0dXJuICh0aGlzLl9vZmZzZXQgPT09IDApO1xuXHRcdFx0Y2FzZSBUaW1lWm9uZUtpbmQuUHJvcGVyOiByZXR1cm4gKFR6RGF0YWJhc2UuaW5zdGFuY2UoKS56b25lSXNVdGModGhpcy5fbmFtZSkpO1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIERvZXMgdGhpcyB6b25lIGhhdmUgRGF5bGlnaHQgU2F2aW5nIFRpbWUgYXQgYWxsP1xuXHQgKi9cblx0cHVibGljIGhhc0RzdCgpOiBib29sZWFuIHtcblx0XHRzd2l0Y2ggKHRoaXMuX2tpbmQpIHtcblx0XHRcdGNhc2UgVGltZVpvbmVLaW5kLkxvY2FsOiByZXR1cm4gZmFsc2U7XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5PZmZzZXQ6IHJldHVybiBmYWxzZTtcblx0XHRcdGNhc2UgVGltZVpvbmVLaW5kLlByb3BlcjogcmV0dXJuIChUekRhdGFiYXNlLmluc3RhbmNlKCkuaGFzRHN0KHRoaXMuX25hbWUpKTtcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0aWYgKHRydWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGUgdGltZXpvbmUgb2Zmc2V0IGluY2x1ZGluZyBEU1QgZnJvbSBhIFVUQyB0aW1lLlxuXHQgKiBAcmV0dXJuIHRoZSBvZmZzZXQgb2YgdGhpcyB0aW1lIHpvbmUgd2l0aCByZXNwZWN0IHRvIFVUQyBhdCB0aGUgZ2l2ZW4gdGltZSwgaW4gbWludXRlcy5cblx0ICovXG5cdHB1YmxpYyBvZmZzZXRGb3JVdGMob2Zmc2V0Rm9yVXRjOiBUaW1lU3RydWN0KTogbnVtYmVyO1xuXHRwdWJsaWMgb2Zmc2V0Rm9yVXRjKHllYXI/OiBudW1iZXIsIG1vbnRoPzogbnVtYmVyLCBkYXk/OiBudW1iZXIsIGhvdXI/OiBudW1iZXIsIG1pbnV0ZT86IG51bWJlciwgc2Vjb25kPzogbnVtYmVyLCBtaWxsaT86IG51bWJlcik6IG51bWJlcjtcblx0cHVibGljIG9mZnNldEZvclV0Yyhcblx0XHRhPzogVGltZVN0cnVjdCB8IG51bWJlciwgbW9udGg/OiBudW1iZXIsIGRheT86IG51bWJlciwgaG91cj86IG51bWJlciwgbWludXRlPzogbnVtYmVyLCBzZWNvbmQ/OiBudW1iZXIsIG1pbGxpPzogbnVtYmVyXG5cdCk6IG51bWJlciB7XG5cdFx0Y29uc3QgdXRjVGltZTogVGltZVN0cnVjdCA9IChcblx0XHRcdHR5cGVvZiBhID09PSBcIm51bWJlclwiID8gbmV3IFRpbWVTdHJ1Y3QoeyB5ZWFyOiBhLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGkgfSkgOlxuXHRcdFx0dHlwZW9mIGEgPT09IFwidW5kZWZpbmVkXCIgPyBuZXcgVGltZVN0cnVjdCh7fSkgOlxuXHRcdFx0YVxuXHRcdCk7XG5cdFx0c3dpdGNoICh0aGlzLl9raW5kKSB7XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5Mb2NhbDoge1xuXHRcdFx0XHRjb25zdCBkYXRlOiBEYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoXG5cdFx0XHRcdFx0dXRjVGltZS5jb21wb25lbnRzLnllYXIsIHV0Y1RpbWUuY29tcG9uZW50cy5tb250aCAtIDEsIHV0Y1RpbWUuY29tcG9uZW50cy5kYXksXG5cdFx0XHRcdFx0dXRjVGltZS5jb21wb25lbnRzLmhvdXIsIHV0Y1RpbWUuY29tcG9uZW50cy5taW51dGUsIHV0Y1RpbWUuY29tcG9uZW50cy5zZWNvbmQsIHV0Y1RpbWUuY29tcG9uZW50cy5taWxsaVxuXHRcdFx0XHQpKTtcblx0XHRcdFx0cmV0dXJuIC0xICogZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBUaW1lWm9uZUtpbmQuT2Zmc2V0OiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9vZmZzZXQ7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5Qcm9wZXI6IHtcblx0XHRcdFx0aWYgKHRoaXMuX2RzdCkge1xuXHRcdFx0XHRcdHJldHVybiBUekRhdGFiYXNlLmluc3RhbmNlKCkudG90YWxPZmZzZXQodGhpcy5fbmFtZSwgdXRjVGltZSkubWludXRlcygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBUekRhdGFiYXNlLmluc3RhbmNlKCkuc3RhbmRhcmRPZmZzZXQodGhpcy5fbmFtZSwgdXRjVGltZSkubWludXRlcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGlmICh0cnVlKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGB1bmtub3duIFRpbWVab25lS2luZCAnJHt0aGlzLl9raW5kfSdgKTtcblx0XHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGUgdGltZXpvbmUgc3RhbmRhcmQgb2Zmc2V0IGV4Y2x1ZGluZyBEU1QgZnJvbSBhIFVUQyB0aW1lLlxuXHQgKiBAcmV0dXJuIHRoZSBzdGFuZGFyZCBvZmZzZXQgb2YgdGhpcyB0aW1lIHpvbmUgd2l0aCByZXNwZWN0IHRvIFVUQyBhdCB0aGUgZ2l2ZW4gdGltZSwgaW4gbWludXRlcy5cblx0ICovXG5cdHB1YmxpYyBzdGFuZGFyZE9mZnNldEZvclV0YyhvZmZzZXRGb3JVdGM6IFRpbWVTdHJ1Y3QpOiBudW1iZXI7XG5cdHB1YmxpYyBzdGFuZGFyZE9mZnNldEZvclV0Yyhcblx0XHR5ZWFyPzogbnVtYmVyLCBtb250aD86IG51bWJlciwgZGF5PzogbnVtYmVyLCBob3VyPzogbnVtYmVyLCBtaW51dGU/OiBudW1iZXIsIHNlY29uZD86IG51bWJlciwgbWlsbGk/OiBudW1iZXJcblx0KTogbnVtYmVyO1xuXHRwdWJsaWMgc3RhbmRhcmRPZmZzZXRGb3JVdGMoXG5cdFx0YT86IFRpbWVTdHJ1Y3QgfCBudW1iZXIsIG1vbnRoPzogbnVtYmVyLCBkYXk/OiBudW1iZXIsIGhvdXI/OiBudW1iZXIsIG1pbnV0ZT86IG51bWJlciwgc2Vjb25kPzogbnVtYmVyLCBtaWxsaT86IG51bWJlclxuXHQpOiBudW1iZXIge1xuXHRcdGNvbnN0IHV0Y1RpbWU6IFRpbWVTdHJ1Y3QgPSAoXG5cdFx0XHR0eXBlb2YgYSA9PT0gXCJudW1iZXJcIiA/IG5ldyBUaW1lU3RydWN0KHsgeWVhcjogYSwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpIH0pIDpcblx0XHRcdHR5cGVvZiBhID09PSBcInVuZGVmaW5lZFwiID8gbmV3IFRpbWVTdHJ1Y3Qoe30pIDpcblx0XHRcdGFcblx0XHQpO1xuXHRcdHN3aXRjaCAodGhpcy5fa2luZCkge1xuXHRcdFx0Y2FzZSBUaW1lWm9uZUtpbmQuTG9jYWw6IHtcblx0XHRcdFx0Y29uc3QgZGF0ZTogRGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKHV0Y1RpbWUuY29tcG9uZW50cy55ZWFyLCAwLCAxLCAwKSk7XG5cdFx0XHRcdHJldHVybiAtMSAqIGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcblx0XHRcdH1cblx0XHRcdGNhc2UgVGltZVpvbmVLaW5kLk9mZnNldDoge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fb2Zmc2V0O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBUaW1lWm9uZUtpbmQuUHJvcGVyOiB7XG5cdFx0XHRcdHJldHVybiBUekRhdGFiYXNlLmluc3RhbmNlKCkuc3RhbmRhcmRPZmZzZXQodGhpcy5fbmFtZSwgdXRjVGltZSkubWludXRlcygpO1xuXHRcdFx0fVxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgdW5rbm93biBUaW1lWm9uZUtpbmQgJyR7dGhpcy5fa2luZH0nYCk7XG5cdFx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlIHRpbWV6b25lIG9mZnNldCBmcm9tIGEgem9uZS1sb2NhbCB0aW1lIChOT1QgYSBVVEMgdGltZSkuXG5cdCAqIEBwYXJhbSB5ZWFyIGxvY2FsIGZ1bGwgeWVhclxuXHQgKiBAcGFyYW0gbW9udGggbG9jYWwgbW9udGggMS0xMiAobm90ZSB0aGlzIGRldmlhdGVzIGZyb20gSmF2YVNjcmlwdCBkYXRlKVxuXHQgKiBAcGFyYW0gZGF5IGxvY2FsIGRheSBvZiBtb250aCAxLTMxXG5cdCAqIEBwYXJhbSBob3VyIGxvY2FsIGhvdXIgMC0yM1xuXHQgKiBAcGFyYW0gbWludXRlIGxvY2FsIG1pbnV0ZSAwLTU5XG5cdCAqIEBwYXJhbSBzZWNvbmQgbG9jYWwgc2Vjb25kIDAtNTlcblx0ICogQHBhcmFtIG1pbGxpc2Vjb25kIGxvY2FsIG1pbGxpc2Vjb25kIDAtOTk5XG5cdCAqIEByZXR1cm4gdGhlIG9mZnNldCBvZiB0aGlzIHRpbWUgem9uZSB3aXRoIHJlc3BlY3QgdG8gVVRDIGF0IHRoZSBnaXZlbiB0aW1lLCBpbiBtaW51dGVzLlxuXHQgKi9cblx0cHVibGljIG9mZnNldEZvclpvbmUobG9jYWxUaW1lOiBUaW1lU3RydWN0KTogbnVtYmVyO1xuXHRwdWJsaWMgb2Zmc2V0Rm9yWm9uZSh5ZWFyPzogbnVtYmVyLCBtb250aD86IG51bWJlciwgZGF5PzogbnVtYmVyLCBob3VyPzogbnVtYmVyLCBtaW51dGU/OiBudW1iZXIsIHNlY29uZD86IG51bWJlciwgbWlsbGk/OiBudW1iZXIpOiBudW1iZXI7XG5cdHB1YmxpYyBvZmZzZXRGb3Jab25lKFxuXHRcdGE/OiBUaW1lU3RydWN0IHwgbnVtYmVyLCBtb250aD86IG51bWJlciwgZGF5PzogbnVtYmVyLCBob3VyPzogbnVtYmVyLCBtaW51dGU/OiBudW1iZXIsIHNlY29uZD86IG51bWJlciwgbWlsbGk/OiBudW1iZXJcblx0KTogbnVtYmVyIHtcblx0XHRjb25zdCBsb2NhbFRpbWU6IFRpbWVTdHJ1Y3QgPSAoXG5cdFx0XHR0eXBlb2YgYSA9PT0gXCJudW1iZXJcIiA/IG5ldyBUaW1lU3RydWN0KHsgeWVhcjogYSwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpIH0pIDpcblx0XHRcdHR5cGVvZiBhID09PSBcInVuZGVmaW5lZFwiID8gbmV3IFRpbWVTdHJ1Y3Qoe30pIDpcblx0XHRcdGFcblx0XHQpO1xuXHRcdHN3aXRjaCAodGhpcy5fa2luZCkge1xuXHRcdFx0Y2FzZSBUaW1lWm9uZUtpbmQuTG9jYWw6IHtcblx0XHRcdFx0Y29uc3QgZGF0ZTogRGF0ZSA9IG5ldyBEYXRlKFxuXHRcdFx0XHRcdGxvY2FsVGltZS5jb21wb25lbnRzLnllYXIsIGxvY2FsVGltZS5jb21wb25lbnRzLm1vbnRoIC0gMSwgbG9jYWxUaW1lLmNvbXBvbmVudHMuZGF5LFxuXHRcdFx0XHRcdGxvY2FsVGltZS5jb21wb25lbnRzLmhvdXIsIGxvY2FsVGltZS5jb21wb25lbnRzLm1pbnV0ZSwgbG9jYWxUaW1lLmNvbXBvbmVudHMuc2Vjb25kLCBsb2NhbFRpbWUuY29tcG9uZW50cy5taWxsaVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRyZXR1cm4gLTEgKiBkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5PZmZzZXQ6IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX29mZnNldDtcblx0XHRcdH1cblx0XHRcdGNhc2UgVGltZVpvbmVLaW5kLlByb3Blcjoge1xuXHRcdFx0XHQvLyBub3RlIHRoYXQgVHpEYXRhYmFzZSBub3JtYWxpemVzIHRoZSBnaXZlbiBkYXRlIHNvIHdlIGRvbid0IGhhdmUgdG8gZG8gaXRcblx0XHRcdFx0aWYgKHRoaXMuX2RzdCkge1xuXHRcdFx0XHRcdHJldHVybiBUekRhdGFiYXNlLmluc3RhbmNlKCkudG90YWxPZmZzZXRMb2NhbCh0aGlzLl9uYW1lLCBsb2NhbFRpbWUpLm1pbnV0ZXMoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gVHpEYXRhYmFzZS5pbnN0YW5jZSgpLnN0YW5kYXJkT2Zmc2V0KHRoaXMuX25hbWUsIGxvY2FsVGltZSkubWludXRlcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGlmICh0cnVlKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGB1bmtub3duIFRpbWVab25lS2luZCAnJHt0aGlzLl9raW5kfSdgKTtcblx0XHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBOb3RlOiB3aWxsIGJlIHJlbW92ZWQgaW4gdmVyc2lvbiAyLjAuMFxuXHQgKlxuXHQgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiwgdGFrZXMgdmFsdWVzIGZyb20gYSBKYXZhc2NyaXB0IERhdGVcblx0ICogQ2FsbHMgb2Zmc2V0Rm9yVXRjKCkgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGRhdGVcblx0ICpcblx0ICogQHBhcmFtIGRhdGU6IHRoZSBkYXRlXG5cdCAqIEBwYXJhbSBmdW5jczogdGhlIHNldCBvZiBmdW5jdGlvbnMgdG8gdXNlOiBnZXQoKSBvciBnZXRVVEMoKVxuXHQgKi9cblx0cHVibGljIG9mZnNldEZvclV0Y0RhdGUoZGF0ZTogRGF0ZSwgZnVuY3M6IERhdGVGdW5jdGlvbnMpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLm9mZnNldEZvclV0YyhUaW1lU3RydWN0LmZyb21EYXRlKGRhdGUsIGZ1bmNzKSk7XG5cdH1cblxuXHQvKipcblx0ICogTm90ZTogd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gMi4wLjBcblx0ICpcblx0ICogQ29udmVuaWVuY2UgZnVuY3Rpb24sIHRha2VzIHZhbHVlcyBmcm9tIGEgSmF2YXNjcmlwdCBEYXRlXG5cdCAqIENhbGxzIG9mZnNldEZvclV0YygpIHdpdGggdGhlIGNvbnRlbnRzIG9mIHRoZSBkYXRlXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRlOiB0aGUgZGF0ZVxuXHQgKiBAcGFyYW0gZnVuY3M6IHRoZSBzZXQgb2YgZnVuY3Rpb25zIHRvIHVzZTogZ2V0KCkgb3IgZ2V0VVRDKClcblx0ICovXG5cdHB1YmxpYyBvZmZzZXRGb3Jab25lRGF0ZShkYXRlOiBEYXRlLCBmdW5jczogRGF0ZUZ1bmN0aW9ucyk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMub2Zmc2V0Rm9yWm9uZShUaW1lU3RydWN0LmZyb21EYXRlKGRhdGUsIGZ1bmNzKSk7XG5cdH1cblxuXHQvKipcblx0ICogWm9uZSBhYmJyZXZpYXRpb24gYXQgZ2l2ZW4gVVRDIHRpbWVzdGFtcCBlLmcuIENFU1QgZm9yIENlbnRyYWwgRXVyb3BlYW4gU3VtbWVyIFRpbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSB5ZWFyIEZ1bGwgeWVhclxuXHQgKiBAcGFyYW0gbW9udGggTW9udGggMS0xMiAobm90ZSB0aGlzIGRldmlhdGVzIGZyb20gSmF2YVNjcmlwdCBkYXRlKVxuXHQgKiBAcGFyYW0gZGF5IERheSBvZiBtb250aCAxLTMxXG5cdCAqIEBwYXJhbSBob3VyIEhvdXIgMC0yM1xuXHQgKiBAcGFyYW0gbWludXRlIE1pbnV0ZSAwLTU5XG5cdCAqIEBwYXJhbSBzZWNvbmQgU2Vjb25kIDAtNTlcblx0ICogQHBhcmFtIG1pbGxpc2Vjb25kIE1pbGxpc2Vjb25kIDAtOTk5XG5cdCAqIEBwYXJhbSBkc3REZXBlbmRlbnQgKGRlZmF1bHQgdHJ1ZSkgc2V0IHRvIGZhbHNlIGZvciBhIERTVC1hZ25vc3RpYyBhYmJyZXZpYXRpb25cblx0ICpcblx0ICogQHJldHVybiBcImxvY2FsXCIgZm9yIGxvY2FsIHRpbWV6b25lLCB0aGUgb2Zmc2V0IGZvciBhbiBvZmZzZXQgem9uZSwgb3IgdGhlIGFiYnJldmlhdGlvbiBmb3IgYSBwcm9wZXIgem9uZS5cblx0ICovXG5cdHB1YmxpYyBhYmJyZXZpYXRpb25Gb3JVdGMoXG5cdFx0eWVhcj86IG51bWJlciwgbW9udGg/OiBudW1iZXIsIGRheT86IG51bWJlciwgaG91cj86IG51bWJlciwgbWludXRlPzogbnVtYmVyLCBzZWNvbmQ/OiBudW1iZXIsIG1pbGxpPzogbnVtYmVyLCBkc3REZXBlbmRlbnQ/OiBib29sZWFuXG5cdCk6IHN0cmluZztcblx0cHVibGljIGFiYnJldmlhdGlvbkZvclV0Yyh1dGNUaW1lOiBUaW1lU3RydWN0LCBkc3REZXBlbmRlbnQ/OiBib29sZWFuKTogc3RyaW5nO1xuXHRwdWJsaWMgYWJicmV2aWF0aW9uRm9yVXRjKFxuXHRcdGE/OiBUaW1lU3RydWN0IHwgbnVtYmVyLCBiPzogbnVtYmVyIHwgYm9vbGVhbiwgZGF5PzogbnVtYmVyLCBob3VyPzogbnVtYmVyLCBtaW51dGU/OiBudW1iZXIsIHNlY29uZD86IG51bWJlciwgbWlsbGk/OiBudW1iZXIsIGM/OiBib29sZWFuXG5cdCk6IHN0cmluZyB7XG5cdFx0bGV0IHV0Y1RpbWU6IFRpbWVTdHJ1Y3Q7XG5cdFx0bGV0IGRzdERlcGVuZGVudDogYm9vbGVhbiA9IHRydWU7XG5cdFx0aWYgKHR5cGVvZiBhICE9PSBcIm51bWJlclwiICYmICEhYSkge1xuXHRcdFx0dXRjVGltZSA9IGE7XG5cdFx0XHRkc3REZXBlbmRlbnQgPSAoYiA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1dGNUaW1lID0gbmV3IFRpbWVTdHJ1Y3QoeyB5ZWFyOiBhLCBtb250aDogYiBhcyBudW1iZXIsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpIH0pO1xuXHRcdFx0ZHN0RGVwZW5kZW50ID0gKGMgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlKTtcblx0XHR9XG5cdFx0c3dpdGNoICh0aGlzLl9raW5kKSB7XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5Mb2NhbDoge1xuXHRcdFx0XHRyZXR1cm4gXCJsb2NhbFwiO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBUaW1lWm9uZUtpbmQuT2Zmc2V0OiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFRpbWVab25lS2luZC5Qcm9wZXI6IHtcblx0XHRcdFx0cmV0dXJuIFR6RGF0YWJhc2UuaW5zdGFuY2UoKS5hYmJyZXZpYXRpb24odGhpcy5fbmFtZSwgdXRjVGltZSwgZHN0RGVwZW5kZW50KTtcblx0XHRcdH1cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0aWYgKHRydWUpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gVGltZVpvbmVLaW5kICcke3RoaXMuX2tpbmR9J2ApO1xuXHRcdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE5vcm1hbGl6ZXMgbm9uLWV4aXN0aW5nIGxvY2FsIHRpbWVzIGJ5IGFkZGluZyBhIGZvcndhcmQgb2Zmc2V0IGNoYW5nZS5cblx0ICogRHVyaW5nIGEgZm9yd2FyZCBzdGFuZGFyZCBvZmZzZXQgY2hhbmdlIG9yIERTVCBvZmZzZXQgY2hhbmdlLCBzb21lIGFtb3VudCBvZlxuXHQgKiBsb2NhbCB0aW1lIGlzIHNraXBwZWQuIFRoZXJlZm9yZSwgdGhpcyBhbW91bnQgb2YgbG9jYWwgdGltZSBkb2VzIG5vdCBleGlzdC5cblx0ICogVGhpcyBmdW5jdGlvbiBhZGRzIHRoZSBhbW91bnQgb2YgZm9yd2FyZCBjaGFuZ2UgdG8gYW55IG5vbi1leGlzdGluZyB0aW1lLiBBZnRlciBhbGwsXG5cdCAqIHRoaXMgaXMgcHJvYmFibHkgd2hhdCB0aGUgdXNlciBtZWFudC5cblx0ICpcblx0ICogQHBhcmFtIGxvY2FsVGltZVx0em9uZSB0aW1lIHRpbWVzdGFtcCBhcyB1bml4IG1pbGxpc2Vjb25kc1xuXHQgKiBAcGFyYW0gb3B0XHQob3B0aW9uYWwpIFJvdW5kIHVwIG9yIGRvd24/IERlZmF1bHQ6IHVwXG5cdCAqXG5cdCAqIEByZXR1cm5zXHR1bml4IG1pbGxpc2Vjb25kcyBpbiB6b25lIHRpbWUsIG5vcm1hbGl6ZWQuXG5cdCAqL1xuXHRwdWJsaWMgbm9ybWFsaXplWm9uZVRpbWUobG9jYWxVbml4TWlsbGlzOiBudW1iZXIsIG9wdD86IE5vcm1hbGl6ZU9wdGlvbik6IG51bWJlcjtcblx0LyoqXG5cdCAqIE5vcm1hbGl6ZXMgbm9uLWV4aXN0aW5nIGxvY2FsIHRpbWVzIGJ5IGFkZGluZyBhIGZvcndhcmQgb2Zmc2V0IGNoYW5nZS5cblx0ICogRHVyaW5nIGEgZm9yd2FyZCBzdGFuZGFyZCBvZmZzZXQgY2hhbmdlIG9yIERTVCBvZmZzZXQgY2hhbmdlLCBzb21lIGFtb3VudCBvZlxuXHQgKiBsb2NhbCB0aW1lIGlzIHNraXBwZWQuIFRoZXJlZm9yZSwgdGhpcyBhbW91bnQgb2YgbG9jYWwgdGltZSBkb2VzIG5vdCBleGlzdC5cblx0ICogVGhpcyBmdW5jdGlvbiBhZGRzIHRoZSBhbW91bnQgb2YgZm9yd2FyZCBjaGFuZ2UgdG8gYW55IG5vbi1leGlzdGluZyB0aW1lLiBBZnRlciBhbGwsXG5cdCAqIHRoaXMgaXMgcHJvYmFibHkgd2hhdCB0aGUgdXNlciBtZWFudC5cblx0ICpcblx0ICogQHBhcmFtIGxvY2FsVGltZVx0em9uZSB0aW1lIHRpbWVzdGFtcFxuXHQgKiBAcGFyYW0gb3B0XHQob3B0aW9uYWwpIFJvdW5kIHVwIG9yIGRvd24/IERlZmF1bHQ6IHVwXG5cdCAqXG5cdCAqIEByZXR1cm5zXHR0aW1lIHN0cnVjdCBpbiB6b25lIHRpbWUsIG5vcm1hbGl6ZWQuXG5cdCAqL1xuXHRwdWJsaWMgbm9ybWFsaXplWm9uZVRpbWUobG9jYWxUaW1lOiBUaW1lU3RydWN0LCBvcHQ/OiBOb3JtYWxpemVPcHRpb24pOiBUaW1lU3RydWN0O1xuXHRwdWJsaWMgbm9ybWFsaXplWm9uZVRpbWUobG9jYWxUaW1lOiBUaW1lU3RydWN0IHwgbnVtYmVyLCBvcHQ6IE5vcm1hbGl6ZU9wdGlvbiA9IE5vcm1hbGl6ZU9wdGlvbi5VcCk6IFRpbWVTdHJ1Y3QgfCBudW1iZXIge1xuXHRcdGNvbnN0IHR6b3B0OiBOb3JtYWxpemVPcHRpb24gPSAob3B0ID09PSBOb3JtYWxpemVPcHRpb24uRG93biA/IE5vcm1hbGl6ZU9wdGlvbi5Eb3duIDogTm9ybWFsaXplT3B0aW9uLlVwKTtcblx0XHRpZiAodGhpcy5raW5kKCkgPT09IFRpbWVab25lS2luZC5Qcm9wZXIpIHtcblx0XHRcdGlmICh0eXBlb2YgbG9jYWxUaW1lID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdHJldHVybiBUekRhdGFiYXNlLmluc3RhbmNlKCkubm9ybWFsaXplTG9jYWwodGhpcy5fbmFtZSwgbmV3IFRpbWVTdHJ1Y3QobG9jYWxUaW1lKSwgdHpvcHQpLnVuaXhNaWxsaXM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gVHpEYXRhYmFzZS5pbnN0YW5jZSgpLm5vcm1hbGl6ZUxvY2FsKHRoaXMuX25hbWUsIGxvY2FsVGltZSwgdHpvcHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbG9jYWxUaW1lO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdGltZSB6b25lIGlkZW50aWZpZXIgKG5vcm1hbGl6ZWQpLlxuXHQgKiBFaXRoZXIgXCJsb2NhbHRpbWVcIiwgSUFOQSBuYW1lLCBvciBcIitoaDptbVwiIG9mZnNldC5cblx0ICovXG5cdHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuXHRcdGxldCByZXN1bHQgPSB0aGlzLm5hbWUoKTtcblx0XHRpZiAodGhpcy5raW5kKCkgPT09IFRpbWVab25lS2luZC5Qcm9wZXIpIHtcblx0XHRcdGlmICh0aGlzLmhhc0RzdCgpICYmICF0aGlzLmRzdCgpKSB7XG5cdFx0XHRcdHJlc3VsdCArPSBcIiB3aXRob3V0IERTVFwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgYW4gb2Zmc2V0IG51bWJlciBpbnRvIGFuIG9mZnNldCBzdHJpbmdcblx0ICogQHBhcmFtIG9mZnNldCBUaGUgb2Zmc2V0IGluIG1pbnV0ZXMgZnJvbSBVVEMgZS5nLiA5MCBtaW51dGVzXG5cdCAqIEByZXR1cm4gdGhlIG9mZnNldCBpbiBJU08gbm90YXRpb24gXCIrMDE6MzBcIiBmb3IgKzkwIG1pbnV0ZXNcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgb2Zmc2V0VG9TdHJpbmcob2Zmc2V0OiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdGNvbnN0IHNpZ24gPSAob2Zmc2V0IDwgMCA/IFwiLVwiIDogXCIrXCIpO1xuXHRcdGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcihNYXRoLmFicyhvZmZzZXQpIC8gNjApO1xuXHRcdGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKG9mZnNldCkgJSA2MCk7XG5cdFx0cmV0dXJuIHNpZ24gKyBzdHJpbmdzLnBhZExlZnQoaG91cnMudG9TdHJpbmcoMTApLCAyLCBcIjBcIikgKyBcIjpcIiArIHN0cmluZ3MucGFkTGVmdChtaW51dGVzLnRvU3RyaW5nKDEwKSwgMiwgXCIwXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0cmluZyB0byBvZmZzZXQgY29udmVyc2lvbi5cblx0ICogQHBhcmFtIHNcdEZvcm1hdHM6IFwiLTAxOjAwXCIsIFwiLTAxMDBcIiwgXCItMDFcIiwgXCJaXCJcblx0ICogQHJldHVybiBvZmZzZXQgdy5yLnQuIFVUQyBpbiBtaW51dGVzXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHN0cmluZ1RvT2Zmc2V0KHM6IHN0cmluZyk6IG51bWJlciB7XG5cdFx0Y29uc3QgdCA9IHMudHJpbSgpO1xuXHRcdC8vIGVhc3kgY2FzZVxuXHRcdGlmICh0ID09PSBcIlpcIikge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXHRcdC8vIGNoZWNrIHRoYXQgdGhlIHJlbWFpbmRlciBjb25mb3JtcyB0byBJU08gdGltZSB6b25lIHNwZWNcblx0XHRhc3NlcnQodC5tYXRjaCgvXlsrLV1cXGQkLykgfHwgdC5tYXRjaCgvXlsrLV1cXGRcXGQkLykgfHwgdC5tYXRjaCgvXlsrLV1cXGRcXGQoOj8pXFxkXFxkJC8pLCBcIldyb25nIHRpbWUgem9uZSBmb3JtYXQ6IFxcXCJcIiArIHQgKyBcIlxcXCJcIik7XG5cdFx0Y29uc3Qgc2lnbjogbnVtYmVyID0gKHQuY2hhckF0KDApID09PSBcIitcIiA/IDEgOiAtMSk7XG5cdFx0bGV0IGhvdXJzOiBudW1iZXIgPSAwO1xuXHRcdGxldCBtaW51dGVzOiBudW1iZXIgPSAwO1xuXHRcdHN3aXRjaCAodC5sZW5ndGgpIHtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0aG91cnMgPSBwYXJzZUludCh0LnNsaWNlKDEsIDIpLCAxMCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRob3VycyA9IHBhcnNlSW50KHQuc2xpY2UoMSwgMyksIDEwKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDU6XG5cdFx0XHRcdGhvdXJzID0gcGFyc2VJbnQodC5zbGljZSgxLCAzKSwgMTApO1xuXHRcdFx0XHRtaW51dGVzID0gcGFyc2VJbnQodC5zbGljZSgzLCA1KSwgMTApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNjpcblx0XHRcdFx0aG91cnMgPSBwYXJzZUludCh0LnNsaWNlKDEsIDMpLCAxMCk7XG5cdFx0XHRcdG1pbnV0ZXMgPSBwYXJzZUludCh0LnNsaWNlKDQsIDYpLCAxMCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHRhc3NlcnQoaG91cnMgPj0gMCAmJiBob3VycyA8IDI0LCBgSW52YWxpZCB0aW1lIHpvbmUgKGhvdXJzIG91dCBvZiByYW5nZSk6ICcke3R9J2ApO1xuXHRcdGFzc2VydChtaW51dGVzID49IDAgJiYgbWludXRlcyA8IDYwLCBgSW52YWxpZCB0aW1lIHpvbmUgKG1pbnV0ZXMgb3V0IG9mIHJhbmdlKTogJyR7dH0nYCk7XG5cdFx0cmV0dXJuIHNpZ24gKiAoaG91cnMgKiA2MCArIG1pbnV0ZXMpO1xuXHR9XG5cblxuXHQvKipcblx0ICogVGltZSB6b25lIGNhY2hlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX2NhY2hlOiB7IFtpbmRleDogc3RyaW5nXTogVGltZVpvbmUgfSA9IHt9O1xuXG5cdC8qKlxuXHQgKiBGaW5kIGluIGNhY2hlIG9yIGNyZWF0ZSB6b25lXG5cdCAqIEBwYXJhbSBuYW1lXHRUaW1lIHpvbmUgbmFtZVxuXHQgKiBAcGFyYW0gZHN0XHRBZGhlcmUgdG8gRGF5bGlnaHQgU2F2aW5nIFRpbWU/XG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfZmluZE9yQ3JlYXRlKG5hbWU6IHN0cmluZywgZHN0OiBib29sZWFuKTogVGltZVpvbmUge1xuXHRcdGNvbnN0IGtleSA9IG5hbWUgKyAoZHN0ID8gXCJfRFNUXCIgOiBcIl9OTy1EU1RcIik7XG5cdFx0aWYgKGtleSBpbiBUaW1lWm9uZS5fY2FjaGUpIHtcblx0XHRcdHJldHVybiBUaW1lWm9uZS5fY2FjaGVba2V5XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgdCA9IG5ldyBUaW1lWm9uZShuYW1lLCBkc3QpO1xuXHRcdFx0VGltZVpvbmUuX2NhY2hlW2tleV0gPSB0O1xuXHRcdFx0cmV0dXJuIHQ7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE5vcm1hbGl6ZSBhIHN0cmluZyBzbyBpdCBjYW4gYmUgdXNlZCBhcyBhIGtleSBmb3IgYVxuXHQgKiBjYWNoZSBsb29rdXBcblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9ub3JtYWxpemVTdHJpbmcoczogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRjb25zdCB0OiBzdHJpbmcgPSBzLnRyaW0oKTtcblx0XHRhc3NlcnQodC5sZW5ndGggPiAwLCBcIkVtcHR5IHRpbWUgem9uZSBzdHJpbmcgZ2l2ZW5cIik7XG5cdFx0aWYgKHQgPT09IFwibG9jYWx0aW1lXCIpIHtcblx0XHRcdHJldHVybiB0O1xuXHRcdH0gZWxzZSBpZiAodCA9PT0gXCJaXCIpIHtcblx0XHRcdHJldHVybiBcIiswMDowMFwiO1xuXHRcdH0gZWxzZSBpZiAoVGltZVpvbmUuX2lzT2Zmc2V0U3RyaW5nKHQpKSB7XG5cdFx0XHQvLyBvZmZzZXQgc3RyaW5nXG5cdFx0XHQvLyBub3JtYWxpemUgYnkgY29udmVydGluZyBiYWNrIGFuZCBmb3J0aFxuXHRcdFx0cmV0dXJuIFRpbWVab25lLm9mZnNldFRvU3RyaW5nKFRpbWVab25lLnN0cmluZ1RvT2Zmc2V0KHQpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gT2xzZW4gVFogZGF0YWJhc2UgbmFtZVxuXHRcdFx0cmV0dXJuIHQ7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX2lzT2Zmc2V0U3RyaW5nKHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IHQgPSBzLnRyaW0oKTtcblx0XHRyZXR1cm4gKHQuY2hhckF0KDApID09PSBcIitcIiB8fCB0LmNoYXJBdCgwKSA9PT0gXCItXCIgfHwgdCA9PT0gXCJaXCIpO1xuXHR9XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgZ2l2ZW4gb2JqZWN0IGlzIG9mIHR5cGUgVGltZVpvbmUuIE5vdGUgdGhhdCBpdCBkb2VzIG5vdCB3b3JrIGZvciBzdWIgY2xhc3Nlcy4gSG93ZXZlciwgdXNlIHRoaXMgdG8gYmUgcm9idXN0XG4gKiBhZ2FpbnN0IGRpZmZlcmVudCB2ZXJzaW9ucyBvZiB0aGUgbGlicmFyeSBpbiBvbmUgcHJvY2VzcyBpbnN0ZWFkIG9mIGluc3RhbmNlb2ZcbiAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBjaGVja1xuICogQHRocm93cyBub3RoaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1RpbWVab25lKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBUaW1lWm9uZSB7XG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUuY2xhc3NLaW5kID09PSBcIlRpbWVab25lXCI7XG59XG4iLCIvKipcbiAqIEZ1bmN0aW9uYWxpdHkgdG8gcGFyc2UgYSBEYXRlVGltZSBvYmplY3QgdG8gYSBzdHJpbmdcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBEaWZmZXJlbnQgdHlwZXMgb2YgdG9rZW5zLCBlYWNoIGZvciBhIERhdGVUaW1lIFwicGVyaW9kIHR5cGVcIiAobGlrZSB5ZWFyLCBtb250aCwgaG91ciBldGMuKVxuICovXG5leHBvcnQgZW51bSBUb2tlblR5cGUge1xuXHQvKipcblx0ICogUmF3IHRleHRcblx0ICovXG5cdElERU5USVRZLFxuXHRFUkEsXG5cdFlFQVIsXG5cdFFVQVJURVIsXG5cdE1PTlRILFxuXHRXRUVLLFxuXHREQVksXG5cdFdFRUtEQVksXG5cdERBWVBFUklPRCxcblx0SE9VUixcblx0TUlOVVRFLFxuXHRTRUNPTkQsXG5cdFpPTkVcbn1cblxuLyoqXG4gKiBCYXNpYyB0b2tlblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuIHtcblx0LyoqXG5cdCAqIFRoZSB0eXBlIG9mIHRva2VuXG5cdCAqL1xuXHR0eXBlOiBUb2tlblR5cGU7XG5cblx0LyoqXG5cdCAqIFRoZSBzeW1ib2wgZnJvbSB3aGljaCB0aGUgdG9rZW4gd2FzIHBhcnNlZFxuXHQgKi9cblx0c3ltYm9sOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBsZW5ndGggb2YgdGhlIHRva2VuXG5cdCAqL1xuXHRsZW5ndGg6IG51bWJlcjtcblxuXHQvKipcblx0ICogVGhlIG9yaWdpbmFsIHN0cmluZyB0aGF0IHByb2R1Y2VkIHRoaXMgdG9rZW5cblx0ICovXG5cdHJhdzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRva2VuaXplIGFuIExETUwgZGF0ZS90aW1lIGZvcm1hdCBzdHJpbmdcbiAqIEBwYXJhbSBmb3JtYXRTdHJpbmcgdGhlIHN0cmluZyB0byB0b2tlbml6ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9rZW5pemUoZm9ybWF0U3RyaW5nOiBzdHJpbmcpOiBUb2tlbltdIHtcblx0aWYgKCFmb3JtYXRTdHJpbmcpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRjb25zdCByZXN1bHQ6IFRva2VuW10gPSBbXTtcblxuXHRjb25zdCBhcHBlbmRUb2tlbiA9ICh0b2tlblN0cmluZzogc3RyaW5nLCByYXc/OiBib29sZWFuKTogdm9pZCA9PiB7XG5cdFx0Ly8gVGhlIHRva2VuU3RyaW5nIG1heSBiZSBsb25nZXIgdGhhbiBzdXBwb3J0ZWQgZm9yIGEgdG9rZW50eXBlLCBlLmcuIFwiaGhoaFwiIHdoaWNoIHdvdWxkIGJlIFRXTyBob3VyIHNwZWNzLlxuXHRcdC8vIFdlIGdyZWVkaWx5IGNvbnN1bWUgTERNTCBzcGVjcyB3aGlsZSBwb3NzaWJsZVxuXHRcdHdoaWxlICh0b2tlblN0cmluZyAhPT0gXCJcIikge1xuXHRcdFx0aWYgKHJhdyB8fCAhU1lNQk9MX01BUFBJTkcuaGFzT3duUHJvcGVydHkodG9rZW5TdHJpbmdbMF0pKSB7XG5cdFx0XHRcdGNvbnN0IHRva2VuOiBUb2tlbiA9IHtcblx0XHRcdFx0XHRsZW5ndGg6IHRva2VuU3RyaW5nLmxlbmd0aCxcblx0XHRcdFx0XHRyYXc6IHRva2VuU3RyaW5nLFxuXHRcdFx0XHRcdHN5bWJvbDogdG9rZW5TdHJpbmdbMF0sXG5cdFx0XHRcdFx0dHlwZTogVG9rZW5UeXBlLklERU5USVRZXG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlc3VsdC5wdXNoKHRva2VuKTtcblx0XHRcdFx0dG9rZW5TdHJpbmcgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gZGVwZW5kaW5nIG9uIHRoZSB0eXBlIG9mIHRva2VuLCBkaWZmZXJlbnQgbGVuZ3RocyBtYXkgYmUgc3VwcG9ydGVkXG5cdFx0XHRcdGNvbnN0IGluZm8gPSBTWU1CT0xfTUFQUElOR1t0b2tlblN0cmluZ1swXV07XG5cdFx0XHRcdGxldCBsZW5ndGg6IG51bWJlciB8IHVuZGVmaW5lZDtcblx0XHRcdFx0aWYgKGluZm8ubWF4TGVuZ3RoID09PSB1bmRlZmluZWQgJiYgKCFBcnJheS5pc0FycmF5KGluZm8ubGVuZ3RocykgfHwgaW5mby5sZW5ndGhzLmxlbmd0aCA9PT0gMCkpIHtcblx0XHRcdFx0XHQvLyBldmVyeXRoaW5nIGlzIGFsbG93ZWRcblx0XHRcdFx0XHRsZW5ndGggPSB0b2tlblN0cmluZy5sZW5ndGg7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaW5mby5tYXhMZW5ndGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIGdyZWVkaWx5IGdvYmJsZSB1cFxuXHRcdFx0XHRcdGxlbmd0aCA9IE1hdGgubWluKHRva2VuU3RyaW5nLmxlbmd0aCwgaW5mby5tYXhMZW5ndGgpO1xuXHRcdFx0XHR9IGVsc2UgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi8gaWYgKEFycmF5LmlzQXJyYXkoaW5mby5sZW5ndGhzKSAmJiBpbmZvLmxlbmd0aHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdC8vIGZpbmQgbWF4aW11bSBhbGxvd2VkIGxlbmd0aFxuXHRcdFx0XHRcdGZvciAoY29uc3QgbCBvZiBpbmZvLmxlbmd0aHMpIHtcblx0XHRcdFx0XHRcdGlmIChsIDw9IHRva2VuU3RyaW5nLmxlbmd0aCAmJiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoIDwgbCkpIHtcblx0XHRcdFx0XHRcdFx0bGVuZ3RoID0gbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIG5vIGFsbG93ZWQgbGVuZ3RoIGZvdW5kIChub3QgcG9zc2libGUgd2l0aCBjdXJyZW50IHN5bWJvbCBtYXBwaW5nIHNpbmNlIGxlbmd0aCAxIGlzIGFsd2F5cyBhbGxvd2VkKVxuXHRcdFx0XHRcdGNvbnN0IHRva2VuOiBUb2tlbiA9IHtcblx0XHRcdFx0XHRcdGxlbmd0aDogdG9rZW5TdHJpbmcubGVuZ3RoLFxuXHRcdFx0XHRcdFx0cmF3OiB0b2tlblN0cmluZyxcblx0XHRcdFx0XHRcdHN5bWJvbDogdG9rZW5TdHJpbmdbMF0sXG5cdFx0XHRcdFx0XHR0eXBlOiBUb2tlblR5cGUuSURFTlRJVFlcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKHRva2VuKTtcblx0XHRcdFx0XHR0b2tlblN0cmluZyA9IFwiXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gcHJlZml4IGZvdW5kXG5cdFx0XHRcdFx0Y29uc3QgdG9rZW46IFRva2VuID0ge1xuXHRcdFx0XHRcdFx0bGVuZ3RoLFxuXHRcdFx0XHRcdFx0cmF3OiB0b2tlblN0cmluZy5zbGljZSgwLCBsZW5ndGgpLFxuXHRcdFx0XHRcdFx0c3ltYm9sOiB0b2tlblN0cmluZ1swXSxcblx0XHRcdFx0XHRcdHR5cGU6IGluZm8udHlwZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmVzdWx0LnB1c2godG9rZW4pO1xuXHRcdFx0XHRcdHRva2VuU3RyaW5nID0gdG9rZW5TdHJpbmcuc2xpY2UobGVuZ3RoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRsZXQgY3VycmVudFRva2VuOiBzdHJpbmcgPSBcIlwiO1xuXHRsZXQgcHJldmlvdXNDaGFyOiBzdHJpbmcgPSBcIlwiO1xuXHRsZXQgcXVvdGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXHRsZXQgcG9zc2libGVFc2NhcGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdGZvciAoY29uc3QgY3VycmVudENoYXIgb2YgZm9ybWF0U3RyaW5nKSB7XG5cdFx0Ly8gSGFubGRlIGVzY2FwaW5nIGFuZCBxdW90aW5nXG5cdFx0aWYgKGN1cnJlbnRDaGFyID09PSBcIidcIikge1xuXHRcdFx0aWYgKCFxdW90aW5nKSB7XG5cdFx0XHRcdGlmIChwb3NzaWJsZUVzY2FwaW5nKSB7XG5cdFx0XHRcdFx0Ly8gRXNjYXBlZCBhIHNpbmdsZSAnIGNoYXJhY3RlciB3aXRob3V0IHF1b3Rpbmdcblx0XHRcdFx0XHRpZiAoY3VycmVudENoYXIgIT09IHByZXZpb3VzQ2hhcikge1xuXHRcdFx0XHRcdFx0YXBwZW5kVG9rZW4oY3VycmVudFRva2VuKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRUb2tlbiA9IFwiXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN1cnJlbnRUb2tlbiArPSBcIidcIjtcblx0XHRcdFx0XHRwb3NzaWJsZUVzY2FwaW5nID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cG9zc2libGVFc2NhcGluZyA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFR3byBwb3NzaWJpbGl0aWVzOiBXZXJlIGFyZSBkb25lIHF1b3RpbmcsIG9yIHdlIGFyZSBlc2NhcGluZyBhICcgY2hhcmFjdGVyXG5cdFx0XHRcdGlmIChwb3NzaWJsZUVzY2FwaW5nKSB7XG5cdFx0XHRcdFx0Ly8gRXNjYXBpbmcsIGFkZCAnIHRvIHRoZSB0b2tlblxuXHRcdFx0XHRcdGN1cnJlbnRUb2tlbiArPSBjdXJyZW50Q2hhcjtcblx0XHRcdFx0XHRwb3NzaWJsZUVzY2FwaW5nID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gTWF5YmUgZXNjYXBpbmcsIHdhaXQgZm9yIG5leHQgdG9rZW4gaWYgd2UgYXJlIGVzY2FwaW5nXG5cdFx0XHRcdFx0cG9zc2libGVFc2NhcGluZyA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0aWYgKCFwb3NzaWJsZUVzY2FwaW5nKSB7XG5cdFx0XHRcdC8vIEN1cnJlbnQgY2hhcmFjdGVyIGlzIHJlbGV2YW50LCBzbyBzYXZlIGl0IGZvciBpbnNwZWN0aW5nIG5leHQgcm91bmRcblx0XHRcdFx0cHJldmlvdXNDaGFyID0gY3VycmVudENoYXI7XG5cdFx0XHR9XG5cdFx0XHRjb250aW51ZTtcblx0XHR9IGVsc2UgaWYgKHBvc3NpYmxlRXNjYXBpbmcpIHtcblx0XHRcdHF1b3RpbmcgPSAhcXVvdGluZztcblx0XHRcdHBvc3NpYmxlRXNjYXBpbmcgPSBmYWxzZTtcblxuXHRcdFx0Ly8gRmx1c2ggY3VycmVudCB0b2tlblxuXHRcdFx0YXBwZW5kVG9rZW4oY3VycmVudFRva2VuLCAhcXVvdGluZyk7XG5cdFx0XHRjdXJyZW50VG9rZW4gPSBcIlwiO1xuXHRcdH1cblxuXHRcdGlmIChxdW90aW5nKSB7XG5cdFx0XHQvLyBRdW90aW5nIG1vZGUsIGFkZCBjaGFyYWN0ZXIgdG8gdG9rZW4uXG5cdFx0XHRjdXJyZW50VG9rZW4gKz0gY3VycmVudENoYXI7XG5cdFx0XHRwcmV2aW91c0NoYXIgPSBjdXJyZW50Q2hhcjtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGlmIChjdXJyZW50Q2hhciAhPT0gcHJldmlvdXNDaGFyKSB7XG5cdFx0XHQvLyBXZSBzdHVtYmxlZCB1cG9uIGEgbmV3IHRva2VuIVxuXHRcdFx0YXBwZW5kVG9rZW4oY3VycmVudFRva2VuKTtcblx0XHRcdGN1cnJlbnRUb2tlbiA9IGN1cnJlbnRDaGFyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBXZSBhcmUgcmVwZWF0aW5nIHRoZSB0b2tlbiB3aXRoIG1vcmUgY2hhcmFjdGVyc1xuXHRcdFx0Y3VycmVudFRva2VuICs9IGN1cnJlbnRDaGFyO1xuXHRcdH1cblxuXHRcdHByZXZpb3VzQ2hhciA9IGN1cnJlbnRDaGFyO1xuXHR9XG5cdC8vIERvbid0IGZvcmdldCB0byBhZGQgdGhlIGxhc3QgdG9rZW4gdG8gdGhlIHJlc3VsdCFcblx0YXBwZW5kVG9rZW4oY3VycmVudFRva2VuLCBxdW90aW5nKTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5pbnRlcmZhY2UgU3ltYm9sSW5mbyB7XG5cdC8qKlxuXHQgKiBUb2tlbiB0eXBlXG5cdCAqL1xuXHR0eXBlOiBUb2tlblR5cGU7XG5cdC8qKlxuXHQgKiBNYXhpbXVtIHRva2VuIGxlbmd0aCAodW5kZWZpbmVkIGZvciB1bmxpbWl0ZWQgdG9rZW5zKVxuXHQgKi9cblx0bWF4TGVuZ3RoPzogbnVtYmVyO1xuXHQvKipcblx0ICogQWxsb3dlZCB0b2tlbiBsZW5ndGhzIChpbnN0ZWFkIG9mIG1pbkxlbmd0aC9tYXhMZW5ndGgpXG5cdCAqL1xuXHRsZW5ndGhzPzogbnVtYmVyW107XG59XG5cbmNvbnN0IFNZTUJPTF9NQVBQSU5HOiB7IFtjaGFyOiBzdHJpbmddOiBTeW1ib2xJbmZvIH0gPSB7XG5cdEc6IHsgdHlwZTogVG9rZW5UeXBlLkVSQSwgbWF4TGVuZ3RoOiA1IH0sXG5cdHk6IHsgdHlwZTogVG9rZW5UeXBlLllFQVIgfSxcblx0WTogeyB0eXBlOiBUb2tlblR5cGUuWUVBUiB9LFxuXHR1OiB7IHR5cGU6IFRva2VuVHlwZS5ZRUFSIH0sXG5cdFU6IHsgdHlwZTogVG9rZW5UeXBlLllFQVIsIG1heExlbmd0aDogNSB9LFxuXHRyOiB7IHR5cGU6IFRva2VuVHlwZS5ZRUFSIH0sXG5cdFE6IHsgdHlwZTogVG9rZW5UeXBlLlFVQVJURVIsIG1heExlbmd0aDogNSB9LFxuXHRxOiB7IHR5cGU6IFRva2VuVHlwZS5RVUFSVEVSLCBtYXhMZW5ndGg6IDUgfSxcblx0TTogeyB0eXBlOiBUb2tlblR5cGUuTU9OVEgsIG1heExlbmd0aDogNSB9LFxuXHRMOiB7IHR5cGU6IFRva2VuVHlwZS5NT05USCwgbWF4TGVuZ3RoOiA1IH0sXG5cdGw6IHsgdHlwZTogVG9rZW5UeXBlLk1PTlRILCBtYXhMZW5ndGg6IDEgfSxcblx0dzogeyB0eXBlOiBUb2tlblR5cGUuV0VFSywgbWF4TGVuZ3RoOiAyIH0sXG5cdFc6IHsgdHlwZTogVG9rZW5UeXBlLldFRUssIG1heExlbmd0aDogMSB9LFxuXHRkOiB7IHR5cGU6IFRva2VuVHlwZS5EQVksIG1heExlbmd0aDogMiB9LFxuXHREOiB7IHR5cGU6IFRva2VuVHlwZS5EQVksIG1heExlbmd0aDogMyB9LFxuXHRGOiB7IHR5cGU6IFRva2VuVHlwZS5EQVksIG1heExlbmd0aDogMSB9LFxuXHRnOiB7IHR5cGU6IFRva2VuVHlwZS5EQVkgfSxcblx0RTogeyB0eXBlOiBUb2tlblR5cGUuV0VFS0RBWSwgbWF4TGVuZ3RoOiA2IH0sXG5cdGU6IHsgdHlwZTogVG9rZW5UeXBlLldFRUtEQVksIG1heExlbmd0aDogNiB9LFxuXHRjOiB7IHR5cGU6IFRva2VuVHlwZS5XRUVLREFZLCBtYXhMZW5ndGg6IDYgfSxcblx0YTogeyB0eXBlOiBUb2tlblR5cGUuREFZUEVSSU9ELCBtYXhMZW5ndGg6IDUgfSxcblx0YjogeyB0eXBlOiBUb2tlblR5cGUuREFZUEVSSU9ELCBtYXhMZW5ndGg6IDUgfSxcblx0QjogeyB0eXBlOiBUb2tlblR5cGUuREFZUEVSSU9ELCBtYXhMZW5ndGg6IDUgfSxcblx0aDogeyB0eXBlOiBUb2tlblR5cGUuSE9VUiwgbWF4TGVuZ3RoOiAyIH0sXG5cdEg6IHsgdHlwZTogVG9rZW5UeXBlLkhPVVIsIG1heExlbmd0aDogMiB9LFxuXHRrOiB7IHR5cGU6IFRva2VuVHlwZS5IT1VSLCBtYXhMZW5ndGg6IDIgfSxcblx0SzogeyB0eXBlOiBUb2tlblR5cGUuSE9VUiwgbWF4TGVuZ3RoOiAyIH0sXG5cdGo6IHsgdHlwZTogVG9rZW5UeXBlLkhPVVIsIG1heExlbmd0aDogNiB9LFxuXHRKOiB7IHR5cGU6IFRva2VuVHlwZS5IT1VSLCBtYXhMZW5ndGg6IDIgfSxcblx0bTogeyB0eXBlOiBUb2tlblR5cGUuTUlOVVRFLCBtYXhMZW5ndGg6IDIgfSxcblx0czogeyB0eXBlOiBUb2tlblR5cGUuU0VDT05ELCBtYXhMZW5ndGg6IDIgfSxcblx0UzogeyB0eXBlOiBUb2tlblR5cGUuU0VDT05EIH0sXG5cdEE6IHsgdHlwZTogVG9rZW5UeXBlLlNFQ09ORCB9LFxuXHR6OiB7IHR5cGU6IFRva2VuVHlwZS5aT05FLCBtYXhMZW5ndGg6IDQgfSxcblx0WjogeyB0eXBlOiBUb2tlblR5cGUuWk9ORSwgbWF4TGVuZ3RoOiA1IH0sXG5cdE86IHsgdHlwZTogVG9rZW5UeXBlLlpPTkUsIGxlbmd0aHM6IFsxLCA0XSB9LFxuXHR2OiB7IHR5cGU6IFRva2VuVHlwZS5aT05FLCBsZW5ndGhzOiBbMSwgNF0gfSxcblx0VjogeyB0eXBlOiBUb2tlblR5cGUuWk9ORSwgbWF4TGVuZ3RoOiA0IH0sXG5cdFg6IHsgdHlwZTogVG9rZW5UeXBlLlpPTkUsIG1heExlbmd0aDogNSB9LFxuXHR4OiB7IHR5cGU6IFRva2VuVHlwZS5aT05FLCBtYXhMZW5ndGg6IDUgfSxcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSAyMDE0IEFCQiBTd2l0emVybGFuZCBMdGQuXG4gKlxuICogT2xzZW4gVGltZXpvbmUgRGF0YWJhc2UgY29udGFpbmVyXG4gKlxuICogRE8gTk9UIFVTRSBUSElTIENMQVNTIERJUkVDVExZLCBVU0UgVGltZVpvbmVcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IGFzc2VydCBmcm9tIFwiLi9hc3NlcnRcIjtcbmltcG9ydCB7IFRpbWVDb21wb25lbnRPcHRzLCBUaW1lU3RydWN0LCBUaW1lVW5pdCwgV2Vla0RheSB9IGZyb20gXCIuL2Jhc2ljc1wiO1xuaW1wb3J0ICogYXMgYmFzaWNzIGZyb20gXCIuL2Jhc2ljc1wiO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tIFwiLi9kdXJhdGlvblwiO1xuaW1wb3J0ICogYXMgbWF0aCBmcm9tIFwiLi9tYXRoXCI7XG5cbi8qKlxuICogVHlwZSBvZiBydWxlIFRPIGNvbHVtbiB2YWx1ZVxuICovXG5leHBvcnQgZW51bSBUb1R5cGUge1xuXHQvKipcblx0ICogRWl0aGVyIGEgeWVhciBudW1iZXIgb3IgXCJvbmx5XCJcblx0ICovXG5cdFllYXIsXG5cdC8qKlxuXHQgKiBcIm1heFwiXG5cdCAqL1xuXHRNYXhcbn1cblxuLyoqXG4gKiBUeXBlIG9mIHJ1bGUgT04gY29sdW1uIHZhbHVlXG4gKi9cbmV4cG9ydCBlbnVtIE9uVHlwZSB7XG5cdC8qKlxuXHQgKiBEYXktb2YtbW9udGggbnVtYmVyXG5cdCAqL1xuXHREYXlOdW0sXG5cdC8qKlxuXHQgKiBcImxhc3RTdW5cIiBvciBcImxhc3RXZWRcIiBldGNcblx0ICovXG5cdExhc3RYLFxuXHQvKipcblx0ICogZS5nLiBcIlN1bj49OFwiXG5cdCAqL1xuXHRHcmVxWCxcblx0LyoqXG5cdCAqIGUuZy4gXCJTdW48PThcIlxuXHQgKi9cblx0TGVxWFxufVxuXG5leHBvcnQgZW51bSBBdFR5cGUge1xuXHQvKipcblx0ICogTG9jYWwgdGltZSAobm8gRFNUKVxuXHQgKi9cblx0U3RhbmRhcmQsXG5cdC8qKlxuXHQgKiBXYWxsIGNsb2NrIHRpbWUgKGxvY2FsIHRpbWUgd2l0aCBEU1QpXG5cdCAqL1xuXHRXYWxsLFxuXHQvKipcblx0ICogVXRjIHRpbWVcblx0ICovXG5cdFV0Yyxcbn1cblxuLyoqXG4gKiBETyBOT1QgVVNFIFRISVMgQ0xBU1MgRElSRUNUTFksIFVTRSBUaW1lWm9uZVxuICpcbiAqIFNlZSBodHRwOi8vd3d3LmNzdGRiaWxsLmNvbS90emRiL3R6LWhvdy10by5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBSdWxlSW5mbyB7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0LyoqXG5cdFx0ICogRlJPTSBjb2x1bW4geWVhciBudW1iZXIuXG5cdFx0ICogTm90ZSwgY2FuIGJlIC0xMDAwMCBmb3IgTmFOIHZhbHVlIChlLmcuIGZvciBcIlN5c3RlbVZcIiBydWxlcylcblx0XHQgKi9cblx0XHRwdWJsaWMgZnJvbTogbnVtYmVyLFxuXHRcdC8qKlxuXHRcdCAqIFRPIGNvbHVtbiB0eXBlOiBZZWFyIGZvciB5ZWFyIG51bWJlcnMgYW5kIFwib25seVwiIHZhbHVlcywgTWF4IGZvciBcIm1heFwiIHZhbHVlLlxuXHRcdCAqL1xuXHRcdHB1YmxpYyB0b1R5cGU6IFRvVHlwZSxcblx0XHQvKipcblx0XHQgKiBJZiBUTyBjb2x1bW4gaXMgYSB5ZWFyLCB0aGUgeWVhciBudW1iZXIuIElmIFRPIGNvbHVtbiBpcyBcIm9ubHlcIiwgdGhlIEZST00geWVhci5cblx0XHQgKi9cblx0XHRwdWJsaWMgdG9ZZWFyOiBudW1iZXIsXG5cdFx0LyoqXG5cdFx0ICogVFlQRSBjb2x1bW4sIG5vdCB1c2VkIHNvIGZhclxuXHRcdCAqL1xuXHRcdHB1YmxpYyB0eXBlOiBzdHJpbmcsXG5cdFx0LyoqXG5cdFx0ICogSU4gY29sdW1uIG1vbnRoIG51bWJlciAxLTEyXG5cdFx0ICovXG5cdFx0cHVibGljIGluTW9udGg6IG51bWJlcixcblx0XHQvKipcblx0XHQgKiBPTiBjb2x1bW4gdHlwZVxuXHRcdCAqL1xuXHRcdHB1YmxpYyBvblR5cGU6IE9uVHlwZSxcblx0XHQvKipcblx0XHQgKiBJZiBvblR5cGUgaXMgRGF5TnVtLCB0aGUgZGF5IG51bWJlclxuXHRcdCAqL1xuXHRcdHB1YmxpYyBvbkRheTogbnVtYmVyLFxuXHRcdC8qKlxuXHRcdCAqIElmIG9uVHlwZSBpcyBub3QgRGF5TnVtLCB0aGUgd2Vla2RheVxuXHRcdCAqL1xuXHRcdHB1YmxpYyBvbldlZWtEYXk6IFdlZWtEYXksXG5cdFx0LyoqXG5cdFx0ICogQVQgY29sdW1uIGhvdXJcblx0XHQgKi9cblx0XHRwdWJsaWMgYXRIb3VyOiBudW1iZXIsXG5cdFx0LyoqXG5cdFx0ICogQVQgY29sdW1uIG1pbnV0ZVxuXHRcdCAqL1xuXHRcdHB1YmxpYyBhdE1pbnV0ZTogbnVtYmVyLFxuXHRcdC8qKlxuXHRcdCAqIEFUIGNvbHVtbiBzZWNvbmRcblx0XHQgKi9cblx0XHRwdWJsaWMgYXRTZWNvbmQ6IG51bWJlcixcblx0XHQvKipcblx0XHQgKiBBVCBjb2x1bW4gdHlwZVxuXHRcdCAqL1xuXHRcdHB1YmxpYyBhdFR5cGU6IEF0VHlwZSxcblx0XHQvKipcblx0XHQgKiBEU1Qgb2Zmc2V0IGZyb20gbG9jYWwgc3RhbmRhcmQgdGltZSAoTk9UIGZyb20gVVRDISlcblx0XHQgKi9cblx0XHRwdWJsaWMgc2F2ZTogRHVyYXRpb24sXG5cdFx0LyoqXG5cdFx0ICogQ2hhcmFjdGVyIHRvIGluc2VydCBpbiAlcyBmb3IgdGltZSB6b25lIGFiYnJldmlhdGlvblxuXHRcdCAqIE5vdGUgaWYgVFogZGF0YWJhc2UgaW5kaWNhdGVzIFwiLVwiIHRoaXMgaXMgdGhlIGVtcHR5IHN0cmluZ1xuXHRcdCAqL1xuXHRcdHB1YmxpYyBsZXR0ZXI6IHN0cmluZ1xuXHRcdCkge1xuXG5cdFx0aWYgKHRoaXMuc2F2ZSkge1xuXHRcdFx0dGhpcy5zYXZlID0gdGhpcy5zYXZlLmNvbnZlcnQoVGltZVVuaXQuSG91cik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZmYgdGhpcyBydWxlIGlzIGFwcGxpY2FibGUgaW4gdGhlIHllYXJcblx0ICovXG5cdHB1YmxpYyBhcHBsaWNhYmxlKHllYXI6IG51bWJlcik6IGJvb2xlYW4ge1xuXHRcdGlmICh5ZWFyIDwgdGhpcy5mcm9tKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHN3aXRjaCAodGhpcy50b1R5cGUpIHtcblx0XHRcdGNhc2UgVG9UeXBlLk1heDogcmV0dXJuIHRydWU7XG5cdFx0XHRjYXNlIFRvVHlwZS5ZZWFyOiByZXR1cm4gKHllYXIgPD0gdGhpcy50b1llYXIpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTb3J0IGNvbXBhcmlzb25cblx0ICogQHJldHVybiAoZmlyc3QgZWZmZWN0aXZlIGRhdGUgaXMgbGVzcyB0aGFuIG90aGVyJ3MgZmlyc3QgZWZmZWN0aXZlIGRhdGUpXG5cdCAqL1xuXHRwdWJsaWMgZWZmZWN0aXZlTGVzcyhvdGhlcjogUnVsZUluZm8pOiBib29sZWFuIHtcblx0XHRpZiAodGhpcy5mcm9tIDwgb3RoZXIuZnJvbSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmICh0aGlzLmZyb20gPiBvdGhlci5mcm9tKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGlmICh0aGlzLmluTW9udGggPCBvdGhlci5pbk1vbnRoKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuaW5Nb250aCA+IG90aGVyLmluTW9udGgpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuZWZmZWN0aXZlRGF0ZSh0aGlzLmZyb20pIDwgb3RoZXIuZWZmZWN0aXZlRGF0ZSh0aGlzLmZyb20pKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNvcnQgY29tcGFyaXNvblxuXHQgKiBAcmV0dXJuIChmaXJzdCBlZmZlY3RpdmUgZGF0ZSBpcyBlcXVhbCB0byBvdGhlcidzIGZpcnN0IGVmZmVjdGl2ZSBkYXRlKVxuXHQgKi9cblx0cHVibGljIGVmZmVjdGl2ZUVxdWFsKG90aGVyOiBSdWxlSW5mbyk6IGJvb2xlYW4ge1xuXHRcdGlmICh0aGlzLmZyb20gIT09IG90aGVyLmZyb20pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuaW5Nb250aCAhPT0gb3RoZXIuaW5Nb250aCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMuZWZmZWN0aXZlRGF0ZSh0aGlzLmZyb20pLmVxdWFscyhvdGhlci5lZmZlY3RpdmVEYXRlKHRoaXMuZnJvbSkpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGRhdGUgdGhhdCB0aGUgcnVsZSB0YWtlcyBlZmZlY3QuIE5vdGUgdGhhdCB0aGUgdGltZVxuXHQgKiBpcyBOT1QgYWRqdXN0ZWQgZm9yIHdhbGwgY2xvY2sgdGltZSBvciBzdGFuZGFyZCB0aW1lLCBpLmUuIHRoaXMuYXRUeXBlIGlzXG5cdCAqIG5vdCB0YWtlbiBpbnRvIGFjY291bnRcblx0ICovXG5cdHB1YmxpYyBlZmZlY3RpdmVEYXRlKHllYXI6IG51bWJlcik6IFRpbWVTdHJ1Y3Qge1xuXHRcdGFzc2VydCh0aGlzLmFwcGxpY2FibGUoeWVhciksIFwiUnVsZSBpcyBub3QgYXBwbGljYWJsZSBpbiBcIiArIHllYXIudG9TdHJpbmcoMTApKTtcblxuXHRcdC8vIHllYXIgYW5kIG1vbnRoIGFyZSBnaXZlblxuXHRcdGNvbnN0IHRtOiBUaW1lQ29tcG9uZW50T3B0cyA9IHt5ZWFyLCBtb250aDogdGhpcy5pbk1vbnRoIH07XG5cblx0XHQvLyBjYWxjdWxhdGUgZGF5XG5cdFx0c3dpdGNoICh0aGlzLm9uVHlwZSkge1xuXHRcdFx0Y2FzZSBPblR5cGUuRGF5TnVtOiB7XG5cdFx0XHRcdHRtLmRheSA9IHRoaXMub25EYXk7XG5cdFx0XHR9IGJyZWFrO1xuXHRcdFx0Y2FzZSBPblR5cGUuR3JlcVg6IHtcblx0XHRcdFx0dG0uZGF5ID0gYmFzaWNzLndlZWtEYXlPbk9yQWZ0ZXIoeWVhciwgdGhpcy5pbk1vbnRoLCB0aGlzLm9uRGF5LCB0aGlzLm9uV2Vla0RheSk7XG5cdFx0XHR9IGJyZWFrO1xuXHRcdFx0Y2FzZSBPblR5cGUuTGVxWDoge1xuXHRcdFx0XHR0bS5kYXkgPSBiYXNpY3Mud2Vla0RheU9uT3JCZWZvcmUoeWVhciwgdGhpcy5pbk1vbnRoLCB0aGlzLm9uRGF5LCB0aGlzLm9uV2Vla0RheSk7XG5cdFx0XHR9IGJyZWFrO1xuXHRcdFx0Y2FzZSBPblR5cGUuTGFzdFg6IHtcblx0XHRcdFx0dG0uZGF5ID0gYmFzaWNzLmxhc3RXZWVrRGF5T2ZNb250aCh5ZWFyLCB0aGlzLmluTW9udGgsIHRoaXMub25XZWVrRGF5KTtcblx0XHRcdH0gYnJlYWs7XG5cdFx0fVxuXG5cdFx0Ly8gY2FsY3VsYXRlIHRpbWVcblx0XHR0bS5ob3VyID0gdGhpcy5hdEhvdXI7XG5cdFx0dG0ubWludXRlID0gdGhpcy5hdE1pbnV0ZTtcblx0XHR0bS5zZWNvbmQgPSB0aGlzLmF0U2Vjb25kO1xuXG5cdFx0cmV0dXJuIG5ldyBUaW1lU3RydWN0KHRtKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB0cmFuc2l0aW9uIG1vbWVudCBpbiBVVEMgaW4gdGhlIGdpdmVuIHllYXJcblx0ICpcblx0ICogQHBhcmFtIHllYXJcdFRoZSB5ZWFyIGZvciB3aGljaCB0byByZXR1cm4gdGhlIHRyYW5zaXRpb25cblx0ICogQHBhcmFtIHN0YW5kYXJkT2Zmc2V0XHRUaGUgc3RhbmRhcmQgb2Zmc2V0IGZvciB0aGUgdGltZXpvbmUgd2l0aG91dCBEU1Rcblx0ICogQHBhcmFtIHByZXZSdWxlXHRUaGUgcHJldmlvdXMgcnVsZVxuXHQgKi9cblx0cHVibGljIHRyYW5zaXRpb25UaW1lVXRjKHllYXI6IG51bWJlciwgc3RhbmRhcmRPZmZzZXQ6IER1cmF0aW9uLCBwcmV2UnVsZT86IFJ1bGVJbmZvKTogbnVtYmVyIHtcblx0XHRhc3NlcnQodGhpcy5hcHBsaWNhYmxlKHllYXIpLCBcIlJ1bGUgbm90IGFwcGxpY2FibGUgaW4gZ2l2ZW4geWVhclwiKTtcblx0XHRjb25zdCB1bml4TWlsbGlzID0gdGhpcy5lZmZlY3RpdmVEYXRlKHllYXIpLnVuaXhNaWxsaXM7XG5cblx0XHQvLyBhZGp1c3QgZm9yIGdpdmVuIG9mZnNldFxuXHRcdGxldCBvZmZzZXQ6IER1cmF0aW9uO1xuXHRcdHN3aXRjaCAodGhpcy5hdFR5cGUpIHtcblx0XHRcdGNhc2UgQXRUeXBlLlV0Yzpcblx0XHRcdFx0b2Zmc2V0ID0gRHVyYXRpb24uaG91cnMoMCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBBdFR5cGUuU3RhbmRhcmQ6XG5cdFx0XHRcdG9mZnNldCA9IHN0YW5kYXJkT2Zmc2V0O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgQXRUeXBlLldhbGw6XG5cdFx0XHRcdGlmIChwcmV2UnVsZSkge1xuXHRcdFx0XHRcdG9mZnNldCA9IHN0YW5kYXJkT2Zmc2V0LmFkZChwcmV2UnVsZS5zYXZlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvZmZzZXQgPSBzdGFuZGFyZE9mZnNldDtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0aWYgKHRydWUpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIEF0VHlwZVwiKTtcblx0XHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1bml4TWlsbGlzIC0gb2Zmc2V0Lm1pbGxpc2Vjb25kcygpO1xuXHR9XG5cblxufVxuXG4vKipcbiAqIFR5cGUgb2YgcmVmZXJlbmNlIGZyb20gem9uZSB0byBydWxlXG4gKi9cbmV4cG9ydCBlbnVtIFJ1bGVUeXBlIHtcblx0LyoqXG5cdCAqIE5vIHJ1bGUgYXBwbGllc1xuXHQgKi9cblx0Tm9uZSxcblx0LyoqXG5cdCAqIEZpeGVkIGdpdmVuIG9mZnNldFxuXHQgKi9cblx0T2Zmc2V0LFxuXHQvKipcblx0ICogUmVmZXJlbmNlIHRvIGEgbmFtZWQgc2V0IG9mIHJ1bGVzXG5cdCAqL1xuXHRSdWxlTmFtZVxufVxuXG4vKipcbiAqIERPIE5PVCBVU0UgVEhJUyBDTEFTUyBESVJFQ1RMWSwgVVNFIFRpbWVab25lXG4gKlxuICogU2VlIGh0dHA6Ly93d3cuY3N0ZGJpbGwuY29tL3R6ZGIvdHotaG93LXRvLmh0bWxcbiAqIEZpcnN0LCBhbmQgc29tZXdoYXQgdHJpdmlhbGx5LCB3aGVyZWFzIFJ1bGVzIGFyZSBjb25zaWRlcmVkIHRvIGNvbnRhaW4gb25lIG9yIG1vcmUgcmVjb3JkcywgYSBab25lIGlzIGNvbnNpZGVyZWQgdG9cbiAqIGJlIGEgc2luZ2xlIHJlY29yZCB3aXRoIHplcm8gb3IgbW9yZSBjb250aW51YXRpb24gbGluZXMuIFRodXMsIHRoZSBrZXl3b3JkLCDigJxab25lLOKAnSBhbmQgdGhlIHpvbmUgbmFtZSBhcmUgbm90IHJlcGVhdGVkLlxuICogVGhlIGxhc3QgbGluZSBpcyB0aGUgb25lIHdpdGhvdXQgYW55dGhpbmcgaW4gdGhlIFtVTlRJTF0gY29sdW1uLlxuICogU2Vjb25kLCBhbmQgbW9yZSBmdW5kYW1lbnRhbGx5LCBlYWNoIGxpbmUgb2YgYSBab25lIHJlcHJlc2VudHMgYSBzdGVhZHkgc3RhdGUsIG5vdCBhIHRyYW5zaXRpb24gYmV0d2VlbiBzdGF0ZXMuXG4gKiBUaGUgc3RhdGUgZXhpc3RzIGZyb20gdGhlIGRhdGUgYW5kIHRpbWUgaW4gdGhlIHByZXZpb3VzIGxpbmXigJlzIFtVTlRJTF0gY29sdW1uIHVwIHRvIHRoZSBkYXRlIGFuZCB0aW1lIGluIHRoZSBjdXJyZW50IGxpbmXigJlzXG4gKiBbVU5USUxdIGNvbHVtbi4gSW4gb3RoZXIgd29yZHMsIHRoZSBkYXRlIGFuZCB0aW1lIGluIHRoZSBbVU5USUxdIGNvbHVtbiBpcyB0aGUgaW5zdGFudCB0aGF0IHNlcGFyYXRlcyB0aGlzIHN0YXRlIGZyb20gdGhlIG5leHQuXG4gKiBXaGVyZSB0aGF0IHdvdWxkIGJlIGFtYmlndW91cyBiZWNhdXNlIHdl4oCZcmUgc2V0dGluZyBvdXIgY2xvY2tzIGJhY2ssIHRoZSBbVU5USUxdIGNvbHVtbiBzcGVjaWZpZXMgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgdGhlIGluc3RhbnQuXG4gKiBUaGUgc3RhdGUgc3BlY2lmaWVkIGJ5IHRoZSBsYXN0IGxpbmUsIHRoZSBvbmUgd2l0aG91dCBhbnl0aGluZyBpbiB0aGUgW1VOVElMXSBjb2x1bW4sIGNvbnRpbnVlcyB0byB0aGUgcHJlc2VudC5cbiAqIFRoZSBmaXJzdCBsaW5lIHR5cGljYWxseSBzcGVjaWZpZXMgdGhlIG1lYW4gc29sYXIgdGltZSBvYnNlcnZlZCBiZWZvcmUgdGhlIGludHJvZHVjdGlvbiBvZiBzdGFuZGFyZCB0aW1lLiBTaW5jZSB0aGVyZeKAmXMgbm8gbGluZSBiZWZvcmVcbiAqIHRoYXQsIGl0IGhhcyBubyBiZWdpbm5pbmcuIDgtKSBGb3Igc29tZSBwbGFjZXMgbmVhciB0aGUgSW50ZXJuYXRpb25hbCBEYXRlIExpbmUsIHRoZSBmaXJzdCB0d28gbGluZXMgd2lsbCBzaG93IHNvbGFyIHRpbWVzIGRpZmZlcmluZyBieVxuICogMjQgaG91cnM7IHRoaXMgY29ycmVzcG9uZHMgdG8gYSBtb3ZlbWVudCBvZiB0aGUgRGF0ZSBMaW5lLiBGb3IgZXhhbXBsZTpcbiAqICMgWm9uZVx0TkFNRVx0XHRHTVRPRkZcdFJVTEVTXHRGT1JNQVRcdFtVTlRJTF1cbiAqIFpvbmUgQW1lcmljYS9KdW5lYXVcdCAxNTowMjoxOSAtXHRMTVRcdDE4NjcgT2N0IDE4XG4gKiBcdFx0XHQgLTg6NTc6NDEgLVx0TE1UXHQuLi5cbiAqIFdoZW4gQWxhc2thIHdhcyBwdXJjaGFzZWQgZnJvbSBSdXNzaWEgaW4gMTg2NywgdGhlIERhdGUgTGluZSBtb3ZlZCBmcm9tIHRoZSBBbGFza2EvQ2FuYWRhIGJvcmRlciB0byB0aGUgQmVyaW5nIFN0cmFpdDsgYW5kIHRoZSB0aW1lIGluXG4gKiBBbGFza2Egd2FzIHRoZW4gMjQgaG91cnMgZWFybGllciB0aGFuIGl0IGhhZCBiZWVuLiA8YXNpZGU+KDYgT2N0b2JlciBpbiB0aGUgSnVsaWFuIGNhbGVuZGFyLCB3aGljaCBSdXNzaWEgd2FzIHN0aWxsIHVzaW5nIHRoZW4gZm9yXG4gKiByZWxpZ2lvdXMgcmVhc29ucywgd2FzIGZvbGxvd2VkIGJ5IGEgc2Vjb25kIGluc3RhbmNlIG9mIHRoZSBzYW1lIGRheSB3aXRoIGEgZGlmZmVyZW50IG5hbWUsIDE4IE9jdG9iZXIgaW4gdGhlIEdyZWdvcmlhbiBjYWxlbmRhci5cbiAqIElzbuKAmXQgY2l2aWwgdGltZSB3b25kZXJmdWw/IDgtKSk8L2FzaWRlPlxuICogVGhlIGFiYnJldmlhdGlvbiwg4oCcTE1ULOKAnSBzdGFuZHMgZm9yIOKAnGxvY2FsIG1lYW4gdGltZSzigJ0gd2hpY2ggaXMgYW4gaW52ZW50aW9uIG9mIHRoZSB0eiBkYXRhYmFzZSBhbmQgd2FzIHByb2JhYmx5IG5ldmVyIGFjdHVhbGx5XG4gKiB1c2VkIGR1cmluZyB0aGUgcGVyaW9kLiBGdXJ0aGVybW9yZSwgdGhlIHZhbHVlIGlzIGFsbW9zdCBjZXJ0YWlubHkgd3JvbmcgZXhjZXB0IGluIHRoZSBhcmNoZXR5cGFsIHBsYWNlIGFmdGVyIHdoaWNoIHRoZSB6b25lIGlzIG5hbWVkLlxuICogKFRoZSB0eiBkYXRhYmFzZSB1c3VhbGx5IGRvZXNu4oCZdCBwcm92aWRlIGEgc2VwYXJhdGUgWm9uZSByZWNvcmQgZm9yIHBsYWNlcyB3aGVyZSBub3RoaW5nIHNpZ25pZmljYW50IGhhcHBlbmVkIGFmdGVyIDE5NzAuKVxuICovXG5leHBvcnQgY2xhc3MgWm9uZUluZm8ge1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdC8qKlxuXHRcdCAqIEdNVCBvZmZzZXQgaW4gZnJhY3Rpb25hbCBtaW51dGVzLCBQT1NJVElWRSB0byBVVEMgKG5vdGUgSmF2YVNjcmlwdC5EYXRlIGdpdmVzIG9mZnNldHNcblx0XHQgKiBjb250cmFyeSB0byB3aGF0IHlvdSBtaWdodCBleHBlY3QpLiAgRS5nLiBFdXJvcGUvQW1zdGVyZGFtIGhhcyArNjAgbWludXRlcyBpbiB0aGlzIGZpZWxkIGJlY2F1c2Vcblx0XHQgKiBpdCBpcyBvbmUgaG91ciBhaGVhZCBvZiBVVENcblx0XHQgKi9cblx0XHRwdWJsaWMgZ210b2ZmOiBEdXJhdGlvbixcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBSVUxFUyBjb2x1bW4gdGVsbHMgdXMgd2hldGhlciBkYXlsaWdodCBzYXZpbmcgdGltZSBpcyBiZWluZyBvYnNlcnZlZDpcblx0XHQgKiBBIGh5cGhlbiwgYSBraW5kIG9mIG51bGwgdmFsdWUsIG1lYW5zIHRoYXQgd2UgaGF2ZSBub3Qgc2V0IG91ciBjbG9ja3MgYWhlYWQgb2Ygc3RhbmRhcmQgdGltZS5cblx0XHQgKiBBbiBhbW91bnQgb2YgdGltZSAodXN1YWxseSBidXQgbm90IG5lY2Vzc2FyaWx5IOKAnDE6MDDigJ0gbWVhbmluZyBvbmUgaG91cikgbWVhbnMgdGhhdCB3ZSBoYXZlIHNldCBvdXIgY2xvY2tzIGFoZWFkIGJ5IHRoYXQgYW1vdW50LlxuXHRcdCAqIFNvbWUgYWxwaGFiZXRpYyBzdHJpbmcgbWVhbnMgdGhhdCB3ZSBtaWdodCBoYXZlIHNldCBvdXIgY2xvY2tzIGFoZWFkOyBhbmQgd2UgbmVlZCB0byBjaGVjayB0aGUgcnVsZVxuXHRcdCAqIHRoZSBuYW1lIG9mIHdoaWNoIGlzIHRoZSBnaXZlbiBhbHBoYWJldGljIHN0cmluZy5cblx0XHQgKi9cblx0XHRwdWJsaWMgcnVsZVR5cGU6IFJ1bGVUeXBlLFxuXG5cdFx0LyoqXG5cdFx0ICogSWYgdGhlIHJ1bGUgY29sdW1uIGlzIGFuIG9mZnNldCwgdGhpcyBpcyB0aGUgb2Zmc2V0XG5cdFx0ICovXG5cdFx0cHVibGljIHJ1bGVPZmZzZXQ6IER1cmF0aW9uLFxuXG5cdFx0LyoqXG5cdFx0ICogSWYgdGhlIHJ1bGUgY29sdW1uIGlzIGEgcnVsZSBuYW1lLCB0aGlzIGlzIHRoZSBydWxlIG5hbWVcblx0XHQgKi9cblx0XHRwdWJsaWMgcnVsZU5hbWU6IHN0cmluZyxcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBGT1JNQVQgY29sdW1uIHNwZWNpZmllcyB0aGUgdXN1YWwgYWJicmV2aWF0aW9uIG9mIHRoZSB0aW1lIHpvbmUgbmFtZS4gSXQgY2FuIGhhdmUgb25lIG9mIGZvdXIgZm9ybXM6XG5cdFx0ICogdGhlIHN0cmluZywg4oCcenp6LOKAnSB3aGljaCBpcyBhIGtpbmQgb2YgbnVsbCB2YWx1ZSAoZG9u4oCZdCBhc2spXG5cdFx0ICogYSBzaW5nbGUgYWxwaGFiZXRpYyBzdHJpbmcgb3RoZXIgdGhhbiDigJx6enos4oCdIGluIHdoaWNoIGNhc2UgdGhhdOKAmXMgdGhlIGFiYnJldmlhdGlvblxuXHRcdCAqIGEgcGFpciBvZiBzdHJpbmdzIHNlcGFyYXRlZCBieSBhIHNsYXNoICjigJgv4oCZKSwgaW4gd2hpY2ggY2FzZSB0aGUgZmlyc3Qgc3RyaW5nIGlzIHRoZSBhYmJyZXZpYXRpb25cblx0XHQgKiBmb3IgdGhlIHN0YW5kYXJkIHRpbWUgbmFtZSBhbmQgdGhlIHNlY29uZCBzdHJpbmcgaXMgdGhlIGFiYnJldmlhdGlvbiBmb3IgdGhlIGRheWxpZ2h0IHNhdmluZyB0aW1lIG5hbWVcblx0XHQgKiBhIHN0cmluZyBjb250YWluaW5nIOKAnCVzLOKAnSBpbiB3aGljaCBjYXNlIHRoZSDigJwlc+KAnSB3aWxsIGJlIHJlcGxhY2VkIGJ5IHRoZSB0ZXh0IGluIHRoZSBhcHByb3ByaWF0ZSBSdWxl4oCZcyBMRVRURVIgY29sdW1uXG5cdFx0ICovXG5cdFx0cHVibGljIGZvcm1hdDogc3RyaW5nLFxuXG5cdFx0LyoqXG5cdFx0ICogVW50aWwgdGltZXN0YW1wIGluIHVuaXggdXRjIG1pbGxpcy4gVGhlIHpvbmUgaW5mbyBpcyB2YWxpZCB1cCB0b1xuXHRcdCAqIGFuZCBleGNsdWRpbmcgdGhpcyB0aW1lc3RhbXAuXG5cdFx0ICogTm90ZSB0aGlzIHZhbHVlIGNhbiBiZSB1bmRlZmluZWQgKGZvciB0aGUgZmlyc3QgcnVsZSlcblx0XHQgKi9cblx0XHRwdWJsaWMgdW50aWw/OiBudW1iZXJcblx0KSB7XG5cdFx0aWYgKHRoaXMucnVsZU9mZnNldCkge1xuXHRcdFx0dGhpcy5ydWxlT2Zmc2V0ID0gdGhpcy5ydWxlT2Zmc2V0LmNvbnZlcnQoYmFzaWNzLlRpbWVVbml0LkhvdXIpO1xuXHRcdH1cblx0fVxufVxuXG5cbmVudW0gVHpNb250aE5hbWVzIHtcblx0SmFuID0gMSxcblx0RmViID0gMixcblx0TWFyID0gMyxcblx0QXByID0gNCxcblx0TWF5ID0gNSxcblx0SnVuID0gNixcblx0SnVsID0gNyxcblx0QXVnID0gOCxcblx0U2VwID0gOSxcblx0T2N0ID0gMTAsXG5cdE5vdiA9IDExLFxuXHREZWMgPSAxMlxufVxuXG5mdW5jdGlvbiBtb250aE5hbWVUb1N0cmluZyhuYW1lOiBzdHJpbmcpOiBudW1iZXIge1xuXHRmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDw9IDEyOyArK2kpIHtcblx0XHRpZiAoVHpNb250aE5hbWVzW2ldID09PSBuYW1lKSB7XG5cdFx0XHRyZXR1cm4gaTtcblx0XHR9XG5cdH1cblx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdGlmICh0cnVlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBtb250aCBuYW1lIFxcXCJcIiArIG5hbWUgKyBcIlxcXCJcIik7XG5cdH1cbn1cblxuZW51bSBUekRheU5hbWVzIHtcblx0U3VuID0gMCxcblx0TW9uID0gMSxcblx0VHVlID0gMixcblx0V2VkID0gMyxcblx0VGh1ID0gNCxcblx0RnJpID0gNSxcblx0U2F0ID0gNlxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gc3RyaW5nIGlzIGEgdmFsaWQgb2Zmc2V0IHN0cmluZyBpLmUuXG4gKiAxLCAtMSwgKzEsIDAxLCAxOjAwLCAxOjIzOjI1LjE0M1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZE9mZnNldFN0cmluZyhzOiBzdHJpbmcpOiBib29sZWFuIHtcblx0cmV0dXJuIC9eKFxcLXxcXCspPyhbMC05XSsoKFxcOlswLTldKyk/KFxcOlswLTldKyhcXC5bMC05XSspPyk/KSkkLy50ZXN0KHMpO1xufVxuXG4vKipcbiAqIERlZmluZXMgYSBtb21lbnQgYXQgd2hpY2ggdGhlIGdpdmVuIHJ1bGUgYmVjb21lcyB2YWxpZFxuICovXG5leHBvcnQgY2xhc3MgVHJhbnNpdGlvbiB7XG5cdGNvbnN0cnVjdG9yKFxuXHRcdC8qKlxuXHRcdCAqIFRyYW5zaXRpb24gdGltZSBpbiBVVEMgbWlsbGlzXG5cdFx0ICovXG5cdFx0cHVibGljIGF0OiBudW1iZXIsXG5cdFx0LyoqXG5cdFx0ICogTmV3IG9mZnNldCAodHlwZSBvZiBvZmZzZXQgZGVwZW5kcyBvbiB0aGUgZnVuY3Rpb24pXG5cdFx0ICovXG5cdFx0cHVibGljIG9mZnNldDogRHVyYXRpb24sXG5cblx0XHQvKipcblx0XHQgKiBOZXcgdGltem9uZSBhYmJyZXZpYXRpb24gbGV0dGVyXG5cdFx0ICovXG5cdFx0cHVibGljIGxldHRlcjogc3RyaW5nXG5cblx0XHQpIHtcblx0XHRpZiAodGhpcy5vZmZzZXQpIHtcblx0XHRcdHRoaXMub2Zmc2V0ID0gdGhpcy5vZmZzZXQuY29udmVydChiYXNpY3MuVGltZVVuaXQuSG91cik7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogT3B0aW9uIGZvciBUekRhdGFiYXNlI25vcm1hbGl6ZUxvY2FsKClcbiAqL1xuZXhwb3J0IGVudW0gTm9ybWFsaXplT3B0aW9uIHtcblx0LyoqXG5cdCAqIE5vcm1hbGl6ZSBub24tZXhpc3RpbmcgdGltZXMgYnkgQURESU5HIHRoZSBEU1Qgb2Zmc2V0XG5cdCAqL1xuXHRVcCxcblx0LyoqXG5cdCAqIE5vcm1hbGl6ZSBub24tZXhpc3RpbmcgdGltZXMgYnkgU1VCVFJBQ1RJTkcgdGhlIERTVCBvZmZzZXRcblx0ICovXG5cdERvd25cbn1cblxuLyoqXG4gKiBUaGlzIGNsYXNzIGlzIGEgd3JhcHBlciBhcm91bmQgdGltZSB6b25lIGRhdGEgSlNPTiBvYmplY3QgZnJvbSB0aGUgdHpkYXRhIE5QTSBtb2R1bGUuXG4gKiBZb3UgdXN1YWxseSBkbyBub3QgbmVlZCB0byB1c2UgdGhpcyBkaXJlY3RseSwgdXNlIFRpbWVab25lIGFuZCBEYXRlVGltZSBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgVHpEYXRhYmFzZSB7XG5cblx0LyoqXG5cdCAqIFNpbmdsZSBpbnN0YW5jZSBtZW1iZXJcblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZT86IFR6RGF0YWJhc2U7XG5cblx0LyoqXG5cdCAqIChyZS0pIGluaXRpYWxpemUgdGltZXpvbmVjb21wbGV0ZSB3aXRoIHRpbWUgem9uZSBkYXRhXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRhIFRaIGRhdGEgYXMgSlNPTiBvYmplY3QgKGZyb20gb25lIG9mIHRoZSB0emRhdGEgTlBNIG1vZHVsZXMpLlxuXHQgKiAgICAgICAgICAgICBJZiBub3QgZ2l2ZW4sIFRpbWV6b25lY29tcGxldGUgd2lsbCBzZWFyY2ggZm9yIGluc3RhbGxlZCBtb2R1bGVzLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBpbml0KGRhdGE/OiBhbnkgfCBhbnlbXSk6IHZvaWQge1xuXHRcdGlmIChkYXRhKSB7XG5cdFx0XHRUekRhdGFiYXNlLl9pbnN0YW5jZSA9IHVuZGVmaW5lZDsgLy8gbmVlZGVkIGZvciBhc3NlcnQgaW4gY29uc3RydWN0b3Jcblx0XHRcdFR6RGF0YWJhc2UuX2luc3RhbmNlID0gbmV3IFR6RGF0YWJhc2UoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbZGF0YV0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBkYXRhOiBhbnlbXSA9IFtdO1xuXHRcdFx0Ly8gdHJ5IHRvIGZpbmQgVFogZGF0YSBpbiBnbG9iYWwgdmFyaWFibGVzXG5cdFx0XHRsZXQgZzogYW55O1xuXHRcdFx0aWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0ZyA9IHdpbmRvdztcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRnID0gZ2xvYmFsO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRnID0gc2VsZjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGcgPSB7fTtcblx0XHRcdH1cblx0XHRcdGlmIChnKSB7XG5cdFx0XHRcdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGcpKSB7XG5cdFx0XHRcdFx0aWYgKGtleS5zdGFydHNXaXRoKFwidHpkYXRhXCIpKSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGdba2V5XSA9PT0gXCJvYmplY3RcIiAmJiBnW2tleV0ucnVsZXMgJiYgZ1trZXldLnpvbmVzKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGEucHVzaChnW2tleV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gdHJ5IHRvIGZpbmQgVFogZGF0YSBhcyBpbnN0YWxsZWQgTlBNIG1vZHVsZXNcblx0XHRcdGNvbnN0IGZpbmROb2RlTW9kdWxlcyA9IChyZXF1aXJlOiBhbnkpOiB2b2lkID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBmaXJzdCB0cnkgdHpkYXRhIHdoaWNoIGNvbnRhaW5zIGFsbCBkYXRhXG5cdFx0XHRcdFx0Y29uc3QgdHpEYXRhTmFtZSA9IFwidHpkYXRhXCI7XG5cdFx0XHRcdFx0Y29uc3QgZCA9IHJlcXVpcmUodHpEYXRhTmFtZSk7IC8vIHVzZSB2YXJpYWJsZSB0byBhdm9pZCBicm93c2VyaWZ5IGFjdGluZyB1cFxuXHRcdFx0XHRcdGRhdGEucHVzaChkKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdC8vIHRoZW4gdHJ5IHN1YnNldHNcblx0XHRcdFx0XHRjb25zdCBtb2R1bGVOYW1lczogc3RyaW5nW10gPSBbXG5cdFx0XHRcdFx0XHRcInR6ZGF0YS1hZnJpY2FcIixcblx0XHRcdFx0XHRcdFwidHpkYXRhLWFudGFyY3RpY2FcIixcblx0XHRcdFx0XHRcdFwidHpkYXRhLWFzaWFcIixcblx0XHRcdFx0XHRcdFwidHpkYXRhLWF1c3RyYWxhc2lhXCIsXG5cdFx0XHRcdFx0XHRcInR6ZGF0YS1iYWNrd2FyZFwiLFxuXHRcdFx0XHRcdFx0XCJ0emRhdGEtYmFja3dhcmQtdXRjXCIsXG5cdFx0XHRcdFx0XHRcInR6ZGF0YS1ldGNldGVyYVwiLFxuXHRcdFx0XHRcdFx0XCJ0emRhdGEtZXVyb3BlXCIsXG5cdFx0XHRcdFx0XHRcInR6ZGF0YS1ub3J0aGFtZXJpY2FcIixcblx0XHRcdFx0XHRcdFwidHpkYXRhLXBhY2lmaWNuZXdcIixcblx0XHRcdFx0XHRcdFwidHpkYXRhLXNvdXRoYW1lcmljYVwiLFxuXHRcdFx0XHRcdFx0XCJ0emRhdGEtc3lzdGVtdlwiXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0XHRtb2R1bGVOYW1lcy5mb3JFYWNoKChtb2R1bGVOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGQgPSByZXF1aXJlKG1vZHVsZU5hbWUpO1xuXHRcdFx0XHRcdFx0XHRkYXRhLnB1c2goZCk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRcdC8vIG5vdGhpbmdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRmaW5kTm9kZU1vZHVsZXMocmVxdWlyZSk7IC8vIG5lZWQgdG8gcHV0IHJlcXVpcmUgaW50byBhIGZ1bmN0aW9uIHRvIG1ha2Ugd2VicGFjayBoYXBweVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRUekRhdGFiYXNlLl9pbnN0YW5jZSA9IG5ldyBUekRhdGFiYXNlKGRhdGEpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTaW5nbGUgaW5zdGFuY2Ugb2YgdGhpcyBkYXRhYmFzZVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBpbnN0YW5jZSgpOiBUekRhdGFiYXNlIHtcblx0XHRpZiAoIVR6RGF0YWJhc2UuX2luc3RhbmNlKSB7XG5cdFx0XHRUekRhdGFiYXNlLmluaXQoKTtcblx0XHR9XG5cdFx0cmV0dXJuIFR6RGF0YWJhc2UuX2luc3RhbmNlIGFzIFR6RGF0YWJhc2U7XG5cdH1cblxuXHQvKipcblx0ICogVGltZSB6b25lIGRhdGFiYXNlIGRhdGFcblx0ICovXG5cdHByaXZhdGUgX2RhdGE6IGFueTtcblxuXHQvKipcblx0ICogQ2FjaGVkIG1pbi9tYXggRFNUIHZhbHVlc1xuXHQgKi9cblx0cHJpdmF0ZSBfbWlubWF4OiBNaW5NYXhJbmZvO1xuXG5cdC8qKlxuXHQgKiBDYWNoZWQgem9uZSBuYW1lc1xuXHQgKi9cblx0cHJpdmF0ZSBfem9uZU5hbWVzOiBzdHJpbmdbXTtcblxuXHQvKipcblx0ICogQ29uc3RydWN0b3IgLSBkbyBub3QgdXNlLCB0aGlzIGlzIGEgc2luZ2xldG9uIGNsYXNzLiBVc2UgVHpEYXRhYmFzZS5pbnN0YW5jZSgpIGluc3RlYWRcblx0ICovXG5cdHByaXZhdGUgY29uc3RydWN0b3IoZGF0YTogYW55W10pIHtcblx0XHRhc3NlcnQoIVR6RGF0YWJhc2UuX2luc3RhbmNlLCBcIllvdSBzaG91bGQgbm90IGNyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGUgVHpEYXRhYmFzZSBjbGFzcyB5b3Vyc2VsZi4gVXNlIFR6RGF0YWJhc2UuaW5zdGFuY2UoKVwiKTtcblx0XHRhc3NlcnQoXG5cdFx0XHRkYXRhLmxlbmd0aCA+IDAsXG5cdFx0XHRcIlRpbWV6b25lY29tcGxldGUgbmVlZHMgdGltZSB6b25lIGRhdGEuIFlvdSBuZWVkIHRvIGluc3RhbGwgb25lIG9mIHRoZSB0emRhdGEgTlBNIG1vZHVsZXMgYmVmb3JlIHVzaW5nIHRpbWV6b25lY29tcGxldGUuXCJcblx0XHQpO1xuXHRcdGlmIChkYXRhLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0dGhpcy5fZGF0YSA9IGRhdGFbMF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2RhdGEgPSB7IHpvbmVzOiB7fSwgcnVsZXM6IHt9IH07XG5cdFx0XHRkYXRhLmZvckVhY2goKGQ6IGFueSk6IHZvaWQgPT4ge1xuXHRcdFx0XHRpZiAoZCAmJiBkLnJ1bGVzICYmIGQuem9uZXMpIHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhkLnJ1bGVzKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5ydWxlc1trZXldID0gZC5ydWxlc1trZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhkLnpvbmVzKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS56b25lc1trZXldID0gZC56b25lc1trZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHRoaXMuX21pbm1heCA9IHZhbGlkYXRlRGF0YSh0aGlzLl9kYXRhKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgc29ydGVkIGxpc3Qgb2YgYWxsIHpvbmUgbmFtZXNcblx0ICovXG5cdHB1YmxpYyB6b25lTmFtZXMoKTogc3RyaW5nW10ge1xuXHRcdGlmICghdGhpcy5fem9uZU5hbWVzKSB7XG5cdFx0XHR0aGlzLl96b25lTmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLl9kYXRhLnpvbmVzKTtcblx0XHRcdHRoaXMuX3pvbmVOYW1lcy5zb3J0KCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl96b25lTmFtZXM7XG5cdH1cblxuXHRwdWJsaWMgZXhpc3RzKHpvbmVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fZGF0YS56b25lcy5oYXNPd25Qcm9wZXJ0eSh6b25lTmFtZSk7XG5cdH1cblxuXHQvKipcblx0ICogTWluaW11bSBub24temVybyBEU1Qgb2Zmc2V0ICh3aGljaCBleGNsdWRlcyBzdGFuZGFyZCBvZmZzZXQpIG9mIGFsbCBydWxlcyBpbiB0aGUgZGF0YWJhc2UuXG5cdCAqIE5vdGUgdGhhdCBEU1Qgb2Zmc2V0cyBuZWVkIG5vdCBiZSB3aG9sZSBob3Vycy5cblx0ICpcblx0ICogRG9lcyByZXR1cm4gemVybyBpZiBhIHpvbmVOYW1lIGlzIGdpdmVuIGFuZCB0aGVyZSBpcyBubyBEU1QgYXQgYWxsIGZvciB0aGUgem9uZS5cblx0ICpcblx0ICogQHBhcmFtIHpvbmVOYW1lXHQob3B0aW9uYWwpIGlmIGdpdmVuLCB0aGUgcmVzdWx0IGZvciB0aGUgZ2l2ZW4gem9uZSBpcyByZXR1cm5lZFxuXHQgKi9cblx0cHVibGljIG1pbkRzdFNhdmUoem9uZU5hbWU/OiBzdHJpbmcpOiBEdXJhdGlvbiB7XG5cdFx0aWYgKHpvbmVOYW1lKSB7XG5cdFx0XHRjb25zdCB6b25lSW5mb3M6IFpvbmVJbmZvW10gPSB0aGlzLmdldFpvbmVJbmZvcyh6b25lTmFtZSk7XG5cdFx0XHRsZXQgcmVzdWx0OiBEdXJhdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRcdGNvbnN0IHJ1bGVOYW1lczogc3RyaW5nW10gPSBbXTtcblx0XHRcdGZvciAoY29uc3Qgem9uZUluZm8gb2Ygem9uZUluZm9zKSB7XG5cdFx0XHRcdGlmICh6b25lSW5mby5ydWxlVHlwZSA9PT0gUnVsZVR5cGUuT2Zmc2V0KSB7XG5cdFx0XHRcdFx0aWYgKCFyZXN1bHQgfHwgcmVzdWx0LmdyZWF0ZXJUaGFuKHpvbmVJbmZvLnJ1bGVPZmZzZXQpKSB7XG5cdFx0XHRcdFx0XHRpZiAoem9uZUluZm8ucnVsZU9mZnNldC5taWxsaXNlY29uZHMoKSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSB6b25lSW5mby5ydWxlT2Zmc2V0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoem9uZUluZm8ucnVsZVR5cGUgPT09IFJ1bGVUeXBlLlJ1bGVOYW1lXG5cdFx0XHRcdFx0JiYgcnVsZU5hbWVzLmluZGV4T2Yoem9uZUluZm8ucnVsZU5hbWUpID09PSAtMSkge1xuXHRcdFx0XHRcdHJ1bGVOYW1lcy5wdXNoKHpvbmVJbmZvLnJ1bGVOYW1lKTtcblx0XHRcdFx0XHRjb25zdCB0ZW1wID0gdGhpcy5nZXRSdWxlSW5mb3Moem9uZUluZm8ucnVsZU5hbWUpO1xuXHRcdFx0XHRcdGZvciAoY29uc3QgcnVsZUluZm8gb2YgdGVtcCkge1xuXHRcdFx0XHRcdFx0aWYgKCFyZXN1bHQgfHwgcmVzdWx0LmdyZWF0ZXJUaGFuKHJ1bGVJbmZvLnNhdmUpKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChydWxlSW5mby5zYXZlLm1pbGxpc2Vjb25kcygpICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0ID0gcnVsZUluZm8uc2F2ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0cmVzdWx0ID0gRHVyYXRpb24uaG91cnMoMCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0LmNsb25lKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBEdXJhdGlvbi5taW51dGVzKHRoaXMuX21pbm1heC5taW5Ec3RTYXZlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTWF4aW11bSBEU1Qgb2Zmc2V0ICh3aGljaCBleGNsdWRlcyBzdGFuZGFyZCBvZmZzZXQpIG9mIGFsbCBydWxlcyBpbiB0aGUgZGF0YWJhc2UuXG5cdCAqIE5vdGUgdGhhdCBEU1Qgb2Zmc2V0cyBuZWVkIG5vdCBiZSB3aG9sZSBob3Vycy5cblx0ICpcblx0ICogUmV0dXJucyAwIGlmIHpvbmVOYW1lIGdpdmVuIGFuZCBubyBEU1Qgb2JzZXJ2ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB6b25lTmFtZVx0KG9wdGlvbmFsKSBpZiBnaXZlbiwgdGhlIHJlc3VsdCBmb3IgdGhlIGdpdmVuIHpvbmUgaXMgcmV0dXJuZWRcblx0ICovXG5cdHB1YmxpYyBtYXhEc3RTYXZlKHpvbmVOYW1lPzogc3RyaW5nKTogRHVyYXRpb24ge1xuXHRcdGlmICh6b25lTmFtZSkge1xuXHRcdFx0Y29uc3Qgem9uZUluZm9zOiBab25lSW5mb1tdID0gdGhpcy5nZXRab25lSW5mb3Moem9uZU5hbWUpO1xuXHRcdFx0bGV0IHJlc3VsdDogRHVyYXRpb24gfCB1bmRlZmluZWQ7XG5cdFx0XHRjb25zdCBydWxlTmFtZXM6IHN0cmluZ1tdID0gW107XG5cdFx0XHRmb3IgKGNvbnN0IHpvbmVJbmZvIG9mIHpvbmVJbmZvcykge1xuXHRcdFx0XHRpZiAoem9uZUluZm8ucnVsZVR5cGUgPT09IFJ1bGVUeXBlLk9mZnNldCkge1xuXHRcdFx0XHRcdGlmICghcmVzdWx0IHx8IHJlc3VsdC5sZXNzVGhhbih6b25lSW5mby5ydWxlT2Zmc2V0KSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gem9uZUluZm8ucnVsZU9mZnNldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHpvbmVJbmZvLnJ1bGVUeXBlID09PSBSdWxlVHlwZS5SdWxlTmFtZVxuXHRcdFx0XHRcdCYmIHJ1bGVOYW1lcy5pbmRleE9mKHpvbmVJbmZvLnJ1bGVOYW1lKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRydWxlTmFtZXMucHVzaCh6b25lSW5mby5ydWxlTmFtZSk7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcCA9IHRoaXMuZ2V0UnVsZUluZm9zKHpvbmVJbmZvLnJ1bGVOYW1lKTtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IHJ1bGVJbmZvIG9mIHRlbXApIHtcblx0XHRcdFx0XHRcdGlmICghcmVzdWx0IHx8IHJlc3VsdC5sZXNzVGhhbihydWxlSW5mby5zYXZlKSkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBydWxlSW5mby5zYXZlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0cmVzdWx0ID0gRHVyYXRpb24uaG91cnMoMCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0LmNsb25lKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBEdXJhdGlvbi5taW51dGVzKHRoaXMuX21pbm1heC5tYXhEc3RTYXZlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIHdoZXRoZXIgdGhlIHpvbmUgaGFzIERTVCBhdCBhbGxcblx0ICovXG5cdHB1YmxpYyBoYXNEc3Qoem9uZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAodGhpcy5tYXhEc3RTYXZlKHpvbmVOYW1lKS5taWxsaXNlY29uZHMoKSAhPT0gMCk7XG5cdH1cblxuXHQvKipcblx0ICogRmlyc3QgRFNUIGNoYW5nZSBtb21lbnQgQUZURVIgdGhlIGdpdmVuIFVUQyBkYXRlIGluIFVUQyBtaWxsaXNlY29uZHMsIHdpdGhpbiBvbmUgeWVhcixcblx0ICogcmV0dXJucyB1bmRlZmluZWQgaWYgbm8gc3VjaCBjaGFuZ2Vcblx0ICovXG5cdHB1YmxpYyBuZXh0RHN0Q2hhbmdlKHpvbmVOYW1lOiBzdHJpbmcsIHV0Y1RpbWU6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZDtcblx0cHVibGljIG5leHREc3RDaGFuZ2Uoem9uZU5hbWU6IHN0cmluZywgdXRjVGltZTogVGltZVN0cnVjdCk6IG51bWJlciB8IHVuZGVmaW5lZDtcblx0cHVibGljIG5leHREc3RDaGFuZ2Uoem9uZU5hbWU6IHN0cmluZywgYTogVGltZVN0cnVjdCB8IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgdXRjVGltZTogVGltZVN0cnVjdCA9ICh0eXBlb2YgYSA9PT0gXCJudW1iZXJcIiA/IG5ldyBUaW1lU3RydWN0KGEpIDogYSk7XG5cblx0XHQvLyBnZXQgYWxsIHpvbmUgaW5mb3MgZm9yIFtkYXRlLCBkYXRlKzF5ZWFyKVxuXHRcdGNvbnN0IGFsbFpvbmVJbmZvczogWm9uZUluZm9bXSA9IHRoaXMuZ2V0Wm9uZUluZm9zKHpvbmVOYW1lKTtcblx0XHRjb25zdCByZWxldmFudFpvbmVJbmZvczogWm9uZUluZm9bXSA9IFtdO1xuXHRcdGNvbnN0IHJhbmdlU3RhcnQ6IG51bWJlciA9IHV0Y1RpbWUudW5peE1pbGxpcztcblx0XHRjb25zdCByYW5nZUVuZDogbnVtYmVyID0gcmFuZ2VTdGFydCArIDM2NSAqIDg2NDAwRTM7XG5cdFx0bGV0IHByZXZFbmQ6IG51bWJlciB8IHVuZGVmaW5lZDtcblx0XHRmb3IgKGNvbnN0IHpvbmVJbmZvIG9mIGFsbFpvbmVJbmZvcykge1xuXHRcdFx0aWYgKChwcmV2RW5kID09PSB1bmRlZmluZWQgfHwgcHJldkVuZCA8IHJhbmdlRW5kKSAmJiAoem9uZUluZm8udW50aWwgPT09IHVuZGVmaW5lZCB8fCB6b25lSW5mby51bnRpbCA+IHJhbmdlU3RhcnQpKSB7XG5cdFx0XHRcdHJlbGV2YW50Wm9uZUluZm9zLnB1c2goem9uZUluZm8pO1xuXHRcdFx0fVxuXHRcdFx0cHJldkVuZCA9IHpvbmVJbmZvLnVudGlsO1xuXHRcdH1cblxuXHRcdC8vIGNvbGxlY3QgYWxsIHRyYW5zaXRpb25zIGluIHRoZSB6b25lcyBmb3IgdGhlIHllYXJcblx0XHRsZXQgdHJhbnNpdGlvbnM6IFRyYW5zaXRpb25bXSA9IFtdO1xuXHRcdGZvciAoY29uc3Qgem9uZUluZm8gb2YgcmVsZXZhbnRab25lSW5mb3MpIHtcblx0XHRcdC8vIGZpbmQgYXBwbGljYWJsZSB0cmFuc2l0aW9uIG1vbWVudHNcblx0XHRcdHRyYW5zaXRpb25zID0gdHJhbnNpdGlvbnMuY29uY2F0KFxuXHRcdFx0XHR0aGlzLmdldFRyYW5zaXRpb25zRHN0T2Zmc2V0cyh6b25lSW5mby5ydWxlTmFtZSwgdXRjVGltZS5jb21wb25lbnRzLnllYXIgLSAxLCB1dGNUaW1lLmNvbXBvbmVudHMueWVhciArIDEsIHpvbmVJbmZvLmdtdG9mZilcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHRyYW5zaXRpb25zLnNvcnQoKGE6IFRyYW5zaXRpb24sIGI6IFRyYW5zaXRpb24pOiBudW1iZXIgPT4ge1xuXHRcdFx0cmV0dXJuIGEuYXQgLSBiLmF0O1xuXHRcdH0pO1xuXG5cdFx0Ly8gZmluZCB0aGUgZmlyc3QgYWZ0ZXIgdGhlIGdpdmVuIGRhdGUgdGhhdCBoYXMgYSBkaWZmZXJlbnQgb2Zmc2V0XG5cdFx0bGV0IHByZXZTYXZlOiBEdXJhdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRmb3IgKGNvbnN0IHRyYW5zaXRpb24gb2YgdHJhbnNpdGlvbnMpIHtcblx0XHRcdGlmICghcHJldlNhdmUgfHwgIXByZXZTYXZlLmVxdWFscyh0cmFuc2l0aW9uLm9mZnNldCkpIHtcblx0XHRcdFx0aWYgKHRyYW5zaXRpb24uYXQgPiB1dGNUaW1lLnVuaXhNaWxsaXMpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJhbnNpdGlvbi5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cHJldlNhdmUgPSB0cmFuc2l0aW9uLm9mZnNldDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZmYgdGhlIGdpdmVuIHpvbmUgbmFtZSBldmVudHVhbGx5IGxpbmtzIHRvXG5cdCAqIFwiRXRjL1VUQ1wiLCBcIkV0Yy9HTVRcIiBvciBcIkV0Yy9VQ1RcIiBpbiB0aGUgVFogZGF0YWJhc2UuIFRoaXMgaXMgdHJ1ZSBlLmcuIGZvclxuXHQgKiBcIlVUQ1wiLCBcIkdNVFwiLCBcIkV0Yy9HTVRcIiBldGMuXG5cdCAqXG5cdCAqIEBwYXJhbSB6b25lTmFtZVx0SUFOQSB0aW1lIHpvbmUgbmFtZS5cblx0ICovXG5cdHB1YmxpYyB6b25lSXNVdGMoem9uZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdGxldCBhY3R1YWxab25lTmFtZTogc3RyaW5nID0gem9uZU5hbWU7XG5cdFx0bGV0IHpvbmVFbnRyaWVzOiBhbnkgPSB0aGlzLl9kYXRhLnpvbmVzW3pvbmVOYW1lXTtcblx0XHQvLyBmb2xsb3cgbGlua3Ncblx0XHR3aGlsZSAodHlwZW9mICh6b25lRW50cmllcykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0aWYgKCF0aGlzLl9kYXRhLnpvbmVzLmhhc093blByb3BlcnR5KHpvbmVFbnRyaWVzKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJab25lIFxcXCJcIiArIHpvbmVFbnRyaWVzICsgXCJcXFwiIG5vdCBmb3VuZCAocmVmZXJyZWQgdG8gaW4gbGluayBmcm9tIFxcXCJcIlxuXHRcdFx0XHRcdCsgem9uZU5hbWUgKyBcIlxcXCIgdmlhIFxcXCJcIiArIGFjdHVhbFpvbmVOYW1lICsgXCJcXFwiXCIpO1xuXHRcdFx0fVxuXHRcdFx0YWN0dWFsWm9uZU5hbWUgPSB6b25lRW50cmllcztcblx0XHRcdHpvbmVFbnRyaWVzID0gdGhpcy5fZGF0YS56b25lc1thY3R1YWxab25lTmFtZV07XG5cdFx0fVxuXHRcdHJldHVybiAoYWN0dWFsWm9uZU5hbWUgPT09IFwiRXRjL1VUQ1wiIHx8IGFjdHVhbFpvbmVOYW1lID09PSBcIkV0Yy9HTVRcIiB8fCBhY3R1YWxab25lTmFtZSA9PT0gXCJFdGMvVUNUXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5vcm1hbGl6ZXMgbm9uLWV4aXN0aW5nIGxvY2FsIHRpbWVzIGJ5IGFkZGluZy9zdWJ0cmFjdGluZyBhIGZvcndhcmQgb2Zmc2V0IGNoYW5nZS5cblx0ICogRHVyaW5nIGEgZm9yd2FyZCBzdGFuZGFyZCBvZmZzZXQgY2hhbmdlIG9yIERTVCBvZmZzZXQgY2hhbmdlLCBzb21lIGFtb3VudCBvZlxuXHQgKiBsb2NhbCB0aW1lIGlzIHNraXBwZWQuIFRoZXJlZm9yZSwgdGhpcyBhbW91bnQgb2YgbG9jYWwgdGltZSBkb2VzIG5vdCBleGlzdC5cblx0ICogVGhpcyBmdW5jdGlvbiBhZGRzIHRoZSBhbW91bnQgb2YgZm9yd2FyZCBjaGFuZ2UgdG8gYW55IG5vbi1leGlzdGluZyB0aW1lLiBBZnRlciBhbGwsXG5cdCAqIHRoaXMgaXMgcHJvYmFibHkgd2hhdCB0aGUgdXNlciBtZWFudC5cblx0ICpcblx0ICogQHBhcmFtIHpvbmVOYW1lXHRJQU5BIHRpbWUgem9uZSBuYW1lXG5cdCAqIEBwYXJhbSBsb2NhbFRpbWVcdEEgbG9jYWwgdGltZSwgZWl0aGVyIGFzIGEgVGltZVN0cnVjdCBvciBhcyBhIHVuaXggbWlsbGlzZWNvbmQgdmFsdWVcblx0ICogQHBhcmFtIG9wdFx0KG9wdGlvbmFsKSBSb3VuZCB1cCBvciBkb3duPyBEZWZhdWx0OiB1cC5cblx0ICpcblx0ICogQHJldHVyblx0VGhlIG5vcm1hbGl6ZWQgdGltZSwgaW4gdGhlIHNhbWUgZm9ybWF0IGFzIHRoZSBsb2NhbFRpbWUgcGFyYW1ldGVyIChUaW1lU3RydWN0IG9yIHVuaXggbWlsbGlzKVxuXHQgKi9cblx0cHVibGljIG5vcm1hbGl6ZUxvY2FsKHpvbmVOYW1lOiBzdHJpbmcsIGxvY2FsVGltZTogbnVtYmVyLCBvcHQ/OiBOb3JtYWxpemVPcHRpb24pOiBudW1iZXI7XG5cdHB1YmxpYyBub3JtYWxpemVMb2NhbCh6b25lTmFtZTogc3RyaW5nLCBsb2NhbFRpbWU6IFRpbWVTdHJ1Y3QsIG9wdD86IE5vcm1hbGl6ZU9wdGlvbik6IFRpbWVTdHJ1Y3Q7XG5cdHB1YmxpYyBub3JtYWxpemVMb2NhbCh6b25lTmFtZTogc3RyaW5nLCBhOiBUaW1lU3RydWN0IHwgbnVtYmVyLCBvcHQ6IE5vcm1hbGl6ZU9wdGlvbiA9IE5vcm1hbGl6ZU9wdGlvbi5VcCk6IFRpbWVTdHJ1Y3QgfCBudW1iZXIge1xuXHRcdGlmICh0aGlzLmhhc0RzdCh6b25lTmFtZSkpIHtcblx0XHRcdGNvbnN0IGxvY2FsVGltZTogVGltZVN0cnVjdCA9ICh0eXBlb2YgYSA9PT0gXCJudW1iZXJcIiA/IG5ldyBUaW1lU3RydWN0KGEpIDogYSk7XG5cdFx0XHQvLyBsb2NhbCB0aW1lcyBiZWhhdmUgbGlrZSB0aGlzIGR1cmluZyBEU1QgY2hhbmdlczpcblx0XHRcdC8vIGZvcndhcmQgY2hhbmdlICgxaCk6ICAgMCAxIDMgNCA1XG5cdFx0XHQvLyBmb3J3YXJkIGNoYW5nZSAoMmgpOiAgIDAgMSA0IDUgNlxuXHRcdFx0Ly8gYmFja3dhcmQgY2hhbmdlICgxaCk6ICAxIDIgMiAzIDRcblx0XHRcdC8vIGJhY2t3YXJkIGNoYW5nZSAoMmgpOiAgMSAyIDEgMiAzXG5cblx0XHRcdC8vIFRoZXJlZm9yZSwgYmluYXJ5IHNlYXJjaGluZyBpcyBub3QgcG9zc2libGUuXG5cdFx0XHQvLyBJbnN0ZWFkLCB3ZSBzaG91bGQgY2hlY2sgdGhlIERTVCBmb3J3YXJkIHRyYW5zaXRpb25zIHdpdGhpbiBhIHdpbmRvdyBhcm91bmQgdGhlIGxvY2FsIHRpbWVcblxuXHRcdFx0Ly8gZ2V0IGFsbCB0cmFuc2l0aW9ucyAobm90ZSB0aGlzIGluY2x1ZGVzIGZha2UgdHJhbnNpdGlvbiBydWxlcyBmb3Igem9uZSBvZmZzZXQgY2hhbmdlcylcblx0XHRcdGNvbnN0IHRyYW5zaXRpb25zOiBUcmFuc2l0aW9uW10gPSB0aGlzLmdldFRyYW5zaXRpb25zVG90YWxPZmZzZXRzKFxuXHRcdFx0XHR6b25lTmFtZSwgbG9jYWxUaW1lLmNvbXBvbmVudHMueWVhciAtIDEsIGxvY2FsVGltZS5jb21wb25lbnRzLnllYXIgKyAxXG5cdFx0XHQpO1xuXG5cdFx0XHQvLyBmaW5kIHRoZSBEU1QgZm9yd2FyZCB0cmFuc2l0aW9uc1xuXHRcdFx0bGV0IHByZXY6IER1cmF0aW9uID0gRHVyYXRpb24uaG91cnMoMCk7XG5cdFx0XHRmb3IgKGNvbnN0IHRyYW5zaXRpb24gb2YgdHJhbnNpdGlvbnMpIHtcblx0XHRcdFx0Ly8gZm9yd2FyZCB0cmFuc2l0aW9uP1xuXHRcdFx0XHRpZiAodHJhbnNpdGlvbi5vZmZzZXQuZ3JlYXRlclRoYW4ocHJldikpIHtcblx0XHRcdFx0XHRjb25zdCBsb2NhbEJlZm9yZTogbnVtYmVyID0gdHJhbnNpdGlvbi5hdCArIHByZXYubWlsbGlzZWNvbmRzKCk7XG5cdFx0XHRcdFx0Y29uc3QgbG9jYWxBZnRlcjogbnVtYmVyID0gdHJhbnNpdGlvbi5hdCArIHRyYW5zaXRpb24ub2Zmc2V0Lm1pbGxpc2Vjb25kcygpO1xuXHRcdFx0XHRcdGlmIChsb2NhbFRpbWUudW5peE1pbGxpcyA+PSBsb2NhbEJlZm9yZSAmJiBsb2NhbFRpbWUudW5peE1pbGxpcyA8IGxvY2FsQWZ0ZXIpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGZvcndhcmRDaGFuZ2UgPSB0cmFuc2l0aW9uLm9mZnNldC5zdWIocHJldik7XG5cdFx0XHRcdFx0XHQvLyBub24tZXhpc3RpbmcgdGltZVxuXHRcdFx0XHRcdFx0Y29uc3QgZmFjdG9yOiBudW1iZXIgPSAob3B0ID09PSBOb3JtYWxpemVPcHRpb24uVXAgPyAxIDogLTEpO1xuXHRcdFx0XHRcdFx0Y29uc3QgcmVzdWx0TWlsbGlzID0gbG9jYWxUaW1lLnVuaXhNaWxsaXMgKyBmYWN0b3IgKiBmb3J3YXJkQ2hhbmdlLm1pbGxpc2Vjb25kcygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuICh0eXBlb2YgYSA9PT0gXCJudW1iZXJcIiA/IHJlc3VsdE1pbGxpcyA6IG5ldyBUaW1lU3RydWN0KHJlc3VsdE1pbGxpcykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRwcmV2ID0gdHJhbnNpdGlvbi5vZmZzZXQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG5vIG5vbi1leGlzdGluZyB0aW1lXG5cdFx0fVxuXHRcdHJldHVybiAodHlwZW9mIGEgPT09IFwibnVtYmVyXCIgPyBhIDogYS5jbG9uZSgpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBzdGFuZGFyZCB0aW1lIHpvbmUgb2Zmc2V0IGZyb20gVVRDLCB3aXRob3V0IERTVC5cblx0ICogVGhyb3dzIGlmIGluZm8gbm90IGZvdW5kLlxuXHQgKiBAcGFyYW0gem9uZU5hbWVcdElBTkEgdGltZSB6b25lIG5hbWVcblx0ICogQHBhcmFtIHV0Y1RpbWVcdFRpbWVzdGFtcCBpbiBVVEMsIGVpdGhlciBhcyBUaW1lU3RydWN0IG9yIGFzIFVuaXggbWlsbGlzZWNvbmQgdmFsdWVcblx0ICovXG5cdHB1YmxpYyBzdGFuZGFyZE9mZnNldCh6b25lTmFtZTogc3RyaW5nLCB1dGNUaW1lOiBUaW1lU3RydWN0IHwgbnVtYmVyKTogRHVyYXRpb24ge1xuXHRcdGNvbnN0IHpvbmVJbmZvOiBab25lSW5mbyA9IHRoaXMuZ2V0Wm9uZUluZm8oem9uZU5hbWUsIHV0Y1RpbWUpO1xuXHRcdHJldHVybiB6b25lSW5mby5nbXRvZmYuY2xvbmUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB0b3RhbCB0aW1lIHpvbmUgb2Zmc2V0IGZyb20gVVRDLCBpbmNsdWRpbmcgRFNULCBhdFxuXHQgKiB0aGUgZ2l2ZW4gVVRDIHRpbWVzdGFtcC5cblx0ICogVGhyb3dzIGlmIHpvbmUgaW5mbyBub3QgZm91bmQuXG5cdCAqXG5cdCAqIEBwYXJhbSB6b25lTmFtZVx0SUFOQSB0aW1lIHpvbmUgbmFtZVxuXHQgKiBAcGFyYW0gdXRjVGltZVx0VGltZXN0YW1wIGluIFVUQywgZWl0aGVyIGFzIFRpbWVTdHJ1Y3Qgb3IgYXMgVW5peCBtaWxsaXNlY29uZCB2YWx1ZVxuXHQgKi9cblx0cHVibGljIHRvdGFsT2Zmc2V0KHpvbmVOYW1lOiBzdHJpbmcsIHV0Y1RpbWU6IFRpbWVTdHJ1Y3QgfCBudW1iZXIpOiBEdXJhdGlvbiB7XG5cdFx0Y29uc3Qgem9uZUluZm86IFpvbmVJbmZvID0gdGhpcy5nZXRab25lSW5mbyh6b25lTmFtZSwgdXRjVGltZSk7XG5cdFx0bGV0IGRzdE9mZnNldDogRHVyYXRpb247XG5cblx0XHRzd2l0Y2ggKHpvbmVJbmZvLnJ1bGVUeXBlKSB7XG5cdFx0XHRjYXNlIFJ1bGVUeXBlLk5vbmU6IHtcblx0XHRcdFx0ZHN0T2Zmc2V0ID0gRHVyYXRpb24ubWludXRlcygwKTtcblx0XHRcdH0gYnJlYWs7XG5cdFx0XHRjYXNlIFJ1bGVUeXBlLk9mZnNldDoge1xuXHRcdFx0XHRkc3RPZmZzZXQgPSB6b25lSW5mby5ydWxlT2Zmc2V0O1xuXHRcdFx0fSBicmVhaztcblx0XHRcdGNhc2UgUnVsZVR5cGUuUnVsZU5hbWU6IHtcblx0XHRcdFx0ZHN0T2Zmc2V0ID0gdGhpcy5kc3RPZmZzZXRGb3JSdWxlKHpvbmVJbmZvLnJ1bGVOYW1lLCB1dGNUaW1lLCB6b25lSW5mby5nbXRvZmYpO1xuXHRcdFx0fSBicmVhaztcblx0XHRcdGRlZmF1bHQ6IC8vIGNhbm5vdCBoYXBwZW4sIGJ1dCB0aGUgY29tcGlsZXIgZG9lc250IHJlYWxpemUgaXRcblx0XHRcdFx0ZHN0T2Zmc2V0ID0gRHVyYXRpb24ubWludXRlcygwKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRzdE9mZnNldC5hZGQoem9uZUluZm8uZ210b2ZmKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdGltZSB6b25lIHJ1bGUgYWJicmV2aWF0aW9uLCBlLmcuIENFU1QgZm9yIENlbnRyYWwgRXVyb3BlYW4gU3VtbWVyIFRpbWUuXG5cdCAqIE5vdGUgdGhpcyBpcyBkZXBlbmRlbnQgb24gdGhlIHRpbWUsIGJlY2F1c2Ugd2l0aCB0aW1lIGRpZmZlcmVudCBydWxlcyBhcmUgaW4gZWZmZWN0XG5cdCAqIGFuZCB0aGVyZWZvcmUgZGlmZmVyZW50IGFiYnJldmlhdGlvbnMuIFRoZXkgYWxzbyBjaGFuZ2Ugd2l0aCBEU1Q6IGUuZy4gQ0VTVCBvciBDRVQuXG5cdCAqXG5cdCAqIEBwYXJhbSB6b25lTmFtZVx0SUFOQSB6b25lIG5hbWVcblx0ICogQHBhcmFtIHV0Y1RpbWVcdFRpbWVzdGFtcCBpbiBVVEMgdW5peCBtaWxsaXNlY29uZHNcblx0ICogQHBhcmFtIGRzdERlcGVuZGVudCAoZGVmYXVsdCB0cnVlKSBzZXQgdG8gZmFsc2UgZm9yIGEgRFNULWFnbm9zdGljIGFiYnJldmlhdGlvblxuXHQgKiBAcmV0dXJuXHRUaGUgYWJicmV2aWF0aW9uIG9mIHRoZSBydWxlIHRoYXQgaXMgaW4gZWZmZWN0XG5cdCAqL1xuXHRwdWJsaWMgYWJicmV2aWF0aW9uKHpvbmVOYW1lOiBzdHJpbmcsIHV0Y1RpbWU6IFRpbWVTdHJ1Y3QgfCBudW1iZXIsIGRzdERlcGVuZGVudDogYm9vbGVhbiA9IHRydWUpOiBzdHJpbmcge1xuXHRcdGNvbnN0IHpvbmVJbmZvOiBab25lSW5mbyA9IHRoaXMuZ2V0Wm9uZUluZm8oem9uZU5hbWUsIHV0Y1RpbWUpO1xuXHRcdGNvbnN0IGZvcm1hdDogc3RyaW5nID0gem9uZUluZm8uZm9ybWF0O1xuXG5cdFx0Ly8gaXMgZm9ybWF0IGRlcGVuZGVudCBvbiBEU1Q/XG5cdFx0aWYgKGZvcm1hdC5pbmRleE9mKFwiJXNcIikgIT09IC0xXG5cdFx0XHQmJiB6b25lSW5mby5ydWxlVHlwZSA9PT0gUnVsZVR5cGUuUnVsZU5hbWUpIHtcblx0XHRcdGxldCBsZXR0ZXI6IHN0cmluZztcblx0XHRcdC8vIHBsYWNlIGluIGZvcm1hdCBzdHJpbmdcblx0XHRcdGlmIChkc3REZXBlbmRlbnQpIHtcblx0XHRcdFx0bGV0dGVyID0gdGhpcy5sZXR0ZXJGb3JSdWxlKHpvbmVJbmZvLnJ1bGVOYW1lLCB1dGNUaW1lLCB6b25lSW5mby5nbXRvZmYpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0dGVyID0gXCJcIjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmb3JtYXQucmVwbGFjZShcIiVzXCIsIGxldHRlcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZvcm1hdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBzdGFuZGFyZCB0aW1lIHpvbmUgb2Zmc2V0IGZyb20gVVRDLCBleGNsdWRpbmcgRFNULCBhdFxuXHQgKiB0aGUgZ2l2ZW4gTE9DQUwgdGltZXN0YW1wLCBhZ2FpbiBleGNsdWRpbmcgRFNULlxuXHQgKlxuXHQgKiBJZiB0aGUgbG9jYWwgdGltZXN0YW1wIGV4aXN0cyB0d2ljZSAoYXMgY2FuIG9jY3VyIHZlcnkgcmFyZWx5IGR1ZSB0byB6b25lIGNoYW5nZXMpXG5cdCAqIHRoZW4gdGhlIGZpcnN0IG9jY3VycmVuY2UgaXMgcmV0dXJuZWQuXG5cdCAqXG5cdCAqIFRocm93cyBpZiB6b25lIGluZm8gbm90IGZvdW5kLlxuXHQgKlxuXHQgKiBAcGFyYW0gem9uZU5hbWVcdElBTkEgdGltZSB6b25lIG5hbWVcblx0ICogQHBhcmFtIGxvY2FsVGltZVx0VGltZXN0YW1wIGluIHRpbWUgem9uZSB0aW1lXG5cdCAqL1xuXHRwdWJsaWMgc3RhbmRhcmRPZmZzZXRMb2NhbCh6b25lTmFtZTogc3RyaW5nLCBsb2NhbFRpbWU6IFRpbWVTdHJ1Y3QgfCBudW1iZXIpOiBEdXJhdGlvbiB7XG5cdFx0Y29uc3QgdW5peE1pbGxpcyA9ICh0eXBlb2YgbG9jYWxUaW1lID09PSBcIm51bWJlclwiID8gbG9jYWxUaW1lIDogbG9jYWxUaW1lLnVuaXhNaWxsaXMpO1xuXHRcdGNvbnN0IHpvbmVJbmZvczogWm9uZUluZm9bXSA9IHRoaXMuZ2V0Wm9uZUluZm9zKHpvbmVOYW1lKTtcblx0XHRmb3IgKGNvbnN0IHpvbmVJbmZvIG9mIHpvbmVJbmZvcykge1xuXHRcdFx0aWYgKHpvbmVJbmZvLnVudGlsID09PSB1bmRlZmluZWQgfHwgem9uZUluZm8udW50aWwgKyB6b25lSW5mby5nbXRvZmYubWlsbGlzZWNvbmRzKCkgPiB1bml4TWlsbGlzKSB7XG5cdFx0XHRcdHJldHVybiB6b25lSW5mby5nbXRvZmYuY2xvbmUoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiTm8gem9uZSBpbmZvIGZvdW5kXCIpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB0b3RhbCB0aW1lIHpvbmUgb2Zmc2V0IGZyb20gVVRDLCBpbmNsdWRpbmcgRFNULCBhdFxuXHQgKiB0aGUgZ2l2ZW4gTE9DQUwgdGltZXN0YW1wLiBOb24tZXhpc3RpbmcgbG9jYWwgdGltZSBpcyBub3JtYWxpemVkIG91dC5cblx0ICogVGhlcmUgY2FuIGJlIG11bHRpcGxlIFVUQyB0aW1lcyBhbmQgdGhlcmVmb3JlIG11bHRpcGxlIG9mZnNldHMgZm9yIGEgbG9jYWwgdGltZVxuXHQgKiBuYW1lbHkgZHVyaW5nIGEgYmFja3dhcmQgRFNUIGNoYW5nZS4gVGhpcyByZXR1cm5zIHRoZSBGSVJTVCBzdWNoIG9mZnNldC5cblx0ICogVGhyb3dzIGlmIHpvbmUgaW5mbyBub3QgZm91bmQuXG5cdCAqXG5cdCAqIEBwYXJhbSB6b25lTmFtZVx0SUFOQSB0aW1lIHpvbmUgbmFtZVxuXHQgKiBAcGFyYW0gbG9jYWxUaW1lXHRUaW1lc3RhbXAgaW4gdGltZSB6b25lIHRpbWVcblx0ICovXG5cdHB1YmxpYyB0b3RhbE9mZnNldExvY2FsKHpvbmVOYW1lOiBzdHJpbmcsIGxvY2FsVGltZTogVGltZVN0cnVjdCB8IG51bWJlcik6IER1cmF0aW9uIHtcblx0XHRjb25zdCB0czogVGltZVN0cnVjdCA9ICh0eXBlb2YgbG9jYWxUaW1lID09PSBcIm51bWJlclwiID8gbmV3IFRpbWVTdHJ1Y3QobG9jYWxUaW1lKSA6IGxvY2FsVGltZSk7XG5cdFx0Y29uc3Qgbm9ybWFsaXplZFRtOiBUaW1lU3RydWN0ID0gdGhpcy5ub3JtYWxpemVMb2NhbCh6b25lTmFtZSwgdHMpO1xuXG5cdFx0Ly8vIE5vdGU6IGR1cmluZyBvZmZzZXQgY2hhbmdlcywgbG9jYWwgdGltZSBjYW4gYmVoYXZlIGxpa2U6XG5cdFx0Ly8gZm9yd2FyZCBjaGFuZ2UgKDFoKTogICAwIDEgMyA0IDVcblx0XHQvLyBmb3J3YXJkIGNoYW5nZSAoMmgpOiAgIDAgMSA0IDUgNlxuXHRcdC8vIGJhY2t3YXJkIGNoYW5nZSAoMWgpOiAgMSAyIDIgMyA0XG5cdFx0Ly8gYmFja3dhcmQgY2hhbmdlICgyaCk6ICAxIDIgMSAyIDMgIDwtLSBub3RlIHRpbWUgZ29pbmcgQkFDS1dBUkRcblxuXHRcdC8vIFRoZXJlZm9yZSBiaW5hcnkgc2VhcmNoIGRvZXMgbm90IGFwcGx5LiBMaW5lYXIgc2VhcmNoIHRocm91Z2ggdHJhbnNpdGlvbnNcblx0XHQvLyBhbmQgcmV0dXJuIHRoZSBmaXJzdCBvZmZzZXQgdGhhdCBtYXRjaGVzXG5cblx0XHRjb25zdCB0cmFuc2l0aW9uczogVHJhbnNpdGlvbltdID0gdGhpcy5nZXRUcmFuc2l0aW9uc1RvdGFsT2Zmc2V0cyhcblx0XHRcdHpvbmVOYW1lLCBub3JtYWxpemVkVG0uY29tcG9uZW50cy55ZWFyIC0gMSwgbm9ybWFsaXplZFRtLmNvbXBvbmVudHMueWVhciArIDFcblx0XHQpO1xuXHRcdGxldCBwcmV2OiBUcmFuc2l0aW9uIHwgdW5kZWZpbmVkO1xuXHRcdGxldCBwcmV2UHJldjogVHJhbnNpdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRmb3IgKGNvbnN0IHRyYW5zaXRpb24gb2YgdHJhbnNpdGlvbnMpIHtcblx0XHRcdGlmICh0cmFuc2l0aW9uLmF0ICsgdHJhbnNpdGlvbi5vZmZzZXQubWlsbGlzZWNvbmRzKCkgPiBub3JtYWxpemVkVG0udW5peE1pbGxpcykge1xuXHRcdFx0XHQvLyBmb3VuZCBvZmZzZXQ6IHByZXYub2Zmc2V0IGFwcGxpZXNcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRwcmV2UHJldiA9IHByZXY7XG5cdFx0XHRwcmV2ID0gdHJhbnNpdGlvbjtcblx0XHR9XG5cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmIChwcmV2KSB7XG5cdFx0XHQvLyBzcGVjaWFsIGNhcmUgZHVyaW5nIGJhY2t3YXJkIGNoYW5nZTogdGFrZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGxvY2FsIHRpbWVcblx0XHRcdGlmIChwcmV2UHJldiAmJiBwcmV2UHJldi5vZmZzZXQuZ3JlYXRlclRoYW4ocHJldi5vZmZzZXQpKSB7XG5cdFx0XHRcdC8vIGJhY2t3YXJkIGNoYW5nZVxuXHRcdFx0XHRjb25zdCBkaWZmID0gcHJldlByZXYub2Zmc2V0LnN1YihwcmV2Lm9mZnNldCk7XG5cdFx0XHRcdGlmIChub3JtYWxpemVkVG0udW5peE1pbGxpcyA+PSBwcmV2LmF0ICsgcHJldi5vZmZzZXQubWlsbGlzZWNvbmRzKClcblx0XHRcdFx0XHQmJiBub3JtYWxpemVkVG0udW5peE1pbGxpcyA8IHByZXYuYXQgKyBwcmV2Lm9mZnNldC5taWxsaXNlY29uZHMoKSArIGRpZmYubWlsbGlzZWNvbmRzKCkpIHtcblx0XHRcdFx0XHQvLyB3aXRoaW4gZHVwbGljYXRlIHJhbmdlXG5cdFx0XHRcdFx0cmV0dXJuIHByZXZQcmV2Lm9mZnNldC5jbG9uZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBwcmV2Lm9mZnNldC5jbG9uZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gcHJldi5vZmZzZXQuY2xvbmUoKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gdGhpcyBjYW5ub3QgaGFwcGVuIGFzIHRoZSB0cmFuc2l0aW9ucyBhcnJheSBpcyBndWFyYW50ZWVkIHRvIGNvbnRhaW4gYSB0cmFuc2l0aW9uIGF0IHRoZVxuXHRcdFx0Ly8gYmVnaW5uaW5nIG9mIHRoZSByZXF1ZXN0ZWQgZnJvbVllYXJcblx0XHRcdHJldHVybiBEdXJhdGlvbi5ob3VycygwKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgRFNUIG9mZnNldCAoV0lUSE9VVCB0aGUgc3RhbmRhcmQgem9uZSBvZmZzZXQpIGZvciB0aGUgZ2l2ZW5cblx0ICogcnVsZXNldCBhbmQgdGhlIGdpdmVuIFVUQyB0aW1lc3RhbXBcblx0ICpcblx0ICogQHBhcmFtIHJ1bGVOYW1lXHRuYW1lIG9mIHJ1bGVzZXRcblx0ICogQHBhcmFtIHV0Y1RpbWVcdFVUQyB0aW1lc3RhbXBcblx0ICogQHBhcmFtIHN0YW5kYXJkT2Zmc2V0XHRTdGFuZGFyZCBvZmZzZXQgd2l0aG91dCBEU1QgZm9yIHRoZSB0aW1lIHpvbmVcblx0ICovXG5cdHB1YmxpYyBkc3RPZmZzZXRGb3JSdWxlKHJ1bGVOYW1lOiBzdHJpbmcsIHV0Y1RpbWU6IFRpbWVTdHJ1Y3QgfCBudW1iZXIsIHN0YW5kYXJkT2Zmc2V0OiBEdXJhdGlvbik6IER1cmF0aW9uIHtcblx0XHRjb25zdCB0czogVGltZVN0cnVjdCA9ICh0eXBlb2YgdXRjVGltZSA9PT0gXCJudW1iZXJcIiA/IG5ldyBUaW1lU3RydWN0KHV0Y1RpbWUpIDogdXRjVGltZSk7XG5cblx0XHQvLyBmaW5kIGFwcGxpY2FibGUgdHJhbnNpdGlvbiBtb21lbnRzXG5cdFx0Y29uc3QgdHJhbnNpdGlvbnM6IFRyYW5zaXRpb25bXSA9IHRoaXMuZ2V0VHJhbnNpdGlvbnNEc3RPZmZzZXRzKFxuXHRcdFx0cnVsZU5hbWUsIHRzLmNvbXBvbmVudHMueWVhciAtIDEsIHRzLmNvbXBvbmVudHMueWVhciwgc3RhbmRhcmRPZmZzZXRcblx0XHQpO1xuXG5cdFx0Ly8gZmluZCB0aGUgbGFzdCBwcmlvciB0byBnaXZlbiBkYXRlXG5cdFx0bGV0IG9mZnNldDogRHVyYXRpb24gfCB1bmRlZmluZWQ7XG5cdFx0Zm9yIChsZXQgaSA9IHRyYW5zaXRpb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRjb25zdCB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbnNbaV07XG5cdFx0XHRpZiAodHJhbnNpdGlvbi5hdCA8PSB0cy51bml4TWlsbGlzKSB7XG5cdFx0XHRcdG9mZnNldCA9IHRyYW5zaXRpb24ub2Zmc2V0LmNsb25lKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdGlmICghb2Zmc2V0KSB7XG5cdFx0XHQvLyBhcHBhcmVudGx5IG5vIGxvbmdlciBEU1QsIGFzIGUuZy4gZm9yIEFzaWEvVG9reW9cblx0XHRcdG9mZnNldCA9IER1cmF0aW9uLm1pbnV0ZXMoMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9mZnNldDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB0aW1lIHpvbmUgbGV0dGVyIGZvciB0aGUgZ2l2ZW5cblx0ICogcnVsZXNldCBhbmQgdGhlIGdpdmVuIFVUQyB0aW1lc3RhbXBcblx0ICpcblx0ICogQHBhcmFtIHJ1bGVOYW1lXHRuYW1lIG9mIHJ1bGVzZXRcblx0ICogQHBhcmFtIHV0Y1RpbWVcdFVUQyB0aW1lc3RhbXAgYXMgVGltZVN0cnVjdCBvciB1bml4IG1pbGxpc1xuXHQgKiBAcGFyYW0gc3RhbmRhcmRPZmZzZXRcdFN0YW5kYXJkIG9mZnNldCB3aXRob3V0IERTVCBmb3IgdGhlIHRpbWUgem9uZVxuXHQgKi9cblx0cHVibGljIGxldHRlckZvclJ1bGUocnVsZU5hbWU6IHN0cmluZywgdXRjVGltZTogVGltZVN0cnVjdCB8IG51bWJlciwgc3RhbmRhcmRPZmZzZXQ6IER1cmF0aW9uKTogc3RyaW5nIHtcblx0XHRjb25zdCB0czogVGltZVN0cnVjdCA9ICh0eXBlb2YgdXRjVGltZSA9PT0gXCJudW1iZXJcIiA/IG5ldyBUaW1lU3RydWN0KHV0Y1RpbWUpIDogdXRjVGltZSk7XG5cdFx0Ly8gZmluZCBhcHBsaWNhYmxlIHRyYW5zaXRpb24gbW9tZW50c1xuXHRcdGNvbnN0IHRyYW5zaXRpb25zOiBUcmFuc2l0aW9uW10gPSB0aGlzLmdldFRyYW5zaXRpb25zRHN0T2Zmc2V0cyhcblx0XHRcdHJ1bGVOYW1lLCB0cy5jb21wb25lbnRzLnllYXIgLSAxLCB0cy5jb21wb25lbnRzLnllYXIsIHN0YW5kYXJkT2Zmc2V0XG5cdFx0KTtcblxuXHRcdC8vIGZpbmQgdGhlIGxhc3QgcHJpb3IgdG8gZ2l2ZW4gZGF0ZVxuXHRcdGxldCBsZXR0ZXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHRmb3IgKGxldCBpID0gdHJhbnNpdGlvbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGNvbnN0IHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uc1tpXTtcblx0XHRcdGlmICh0cmFuc2l0aW9uLmF0IDw9IHRzLnVuaXhNaWxsaXMpIHtcblx0XHRcdFx0bGV0dGVyID0gdHJhbnNpdGlvbi5sZXR0ZXI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdGlmICghbGV0dGVyKSB7XG5cdFx0XHQvLyBhcHBhcmVudGx5IG5vIGxvbmdlciBEU1QsIGFzIGUuZy4gZm9yIEFzaWEvVG9reW9cblx0XHRcdGxldHRlciA9IFwiXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxldHRlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBsaXN0IG9mIGFsbCB0cmFuc2l0aW9ucyBpbiBbZnJvbVllYXIuLnRvWWVhcl0gc29ydGVkIGJ5IGVmZmVjdGl2ZSBkYXRlXG5cdCAqXG5cdCAqIEBwYXJhbSBydWxlTmFtZVx0TmFtZSBvZiB0aGUgcnVsZSBzZXRcblx0ICogQHBhcmFtIGZyb21ZZWFyXHRmaXJzdCB5ZWFyIHRvIHJldHVybiB0cmFuc2l0aW9ucyBmb3Jcblx0ICogQHBhcmFtIHRvWWVhclx0TGFzdCB5ZWFyIHRvIHJldHVybiB0cmFuc2l0aW9ucyBmb3Jcblx0ICogQHBhcmFtIHN0YW5kYXJkT2Zmc2V0XHRTdGFuZGFyZCBvZmZzZXQgd2l0aG91dCBEU1QgZm9yIHRoZSB0aW1lIHpvbmVcblx0ICpcblx0ICogQHJldHVybiBUcmFuc2l0aW9ucywgd2l0aCBEU1Qgb2Zmc2V0cyAobm8gc3RhbmRhcmQgb2Zmc2V0IGluY2x1ZGVkKVxuXHQgKi9cblx0cHVibGljIGdldFRyYW5zaXRpb25zRHN0T2Zmc2V0cyhydWxlTmFtZTogc3RyaW5nLCBmcm9tWWVhcjogbnVtYmVyLCB0b1llYXI6IG51bWJlciwgc3RhbmRhcmRPZmZzZXQ6IER1cmF0aW9uKTogVHJhbnNpdGlvbltdIHtcblx0XHRhc3NlcnQoZnJvbVllYXIgPD0gdG9ZZWFyLCBcImZyb21ZZWFyIG11c3QgYmUgPD0gdG9ZZWFyXCIpO1xuXG5cdFx0Y29uc3QgcnVsZUluZm9zOiBSdWxlSW5mb1tdID0gdGhpcy5nZXRSdWxlSW5mb3MocnVsZU5hbWUpO1xuXHRcdGNvbnN0IHJlc3VsdDogVHJhbnNpdGlvbltdID0gW107XG5cblx0XHRmb3IgKGxldCB5ID0gZnJvbVllYXI7IHkgPD0gdG9ZZWFyOyB5KyspIHtcblx0XHRcdGxldCBwcmV2SW5mbzogUnVsZUluZm8gfCB1bmRlZmluZWQ7XG5cdFx0XHRmb3IgKGNvbnN0IHJ1bGVJbmZvIG9mIHJ1bGVJbmZvcykge1xuXHRcdFx0XHRpZiAocnVsZUluZm8uYXBwbGljYWJsZSh5KSkge1xuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKG5ldyBUcmFuc2l0aW9uKFxuXHRcdFx0XHRcdFx0cnVsZUluZm8udHJhbnNpdGlvblRpbWVVdGMoeSwgc3RhbmRhcmRPZmZzZXQsIHByZXZJbmZvKSxcblx0XHRcdFx0XHRcdHJ1bGVJbmZvLnNhdmUsXG5cdFx0XHRcdFx0XHRydWxlSW5mby5sZXR0ZXIpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwcmV2SW5mbyA9IHJ1bGVJbmZvO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJlc3VsdC5zb3J0KChhOiBUcmFuc2l0aW9uLCBiOiBUcmFuc2l0aW9uKTogbnVtYmVyID0+IHtcblx0XHRcdHJldHVybiBhLmF0IC0gYi5hdDtcblx0XHR9KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiBib3RoIHpvbmUgYW5kIHJ1bGUgY2hhbmdlcyBhcyB0b3RhbCAoc3RkICsgZHN0KSBvZmZzZXRzLlxuXHQgKiBBZGRzIGFuIGluaXRpYWwgdHJhbnNpdGlvbiBpZiB0aGVyZSBpcyBubyB6b25lIGNoYW5nZSB3aXRoaW4gdGhlIHJhbmdlLlxuXHQgKlxuXHQgKiBAcGFyYW0gem9uZU5hbWVcdElBTkEgem9uZSBuYW1lXG5cdCAqIEBwYXJhbSBmcm9tWWVhclx0Rmlyc3QgeWVhciB0byBpbmNsdWRlXG5cdCAqIEBwYXJhbSB0b1llYXJcdExhc3QgeWVhciB0byBpbmNsdWRlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0VHJhbnNpdGlvbnNUb3RhbE9mZnNldHMoem9uZU5hbWU6IHN0cmluZywgZnJvbVllYXI6IG51bWJlciwgdG9ZZWFyOiBudW1iZXIpOiBUcmFuc2l0aW9uW10ge1xuXHRcdGFzc2VydChmcm9tWWVhciA8PSB0b1llYXIsIFwiZnJvbVllYXIgbXVzdCBiZSA8PSB0b1llYXJcIik7XG5cblx0XHRjb25zdCBzdGFydE1pbGxpczogbnVtYmVyID0gYmFzaWNzLnRpbWVUb1VuaXhOb0xlYXBTZWNzKHsgeWVhcjogZnJvbVllYXIgfSk7XG5cdFx0Y29uc3QgZW5kTWlsbGlzOiBudW1iZXIgPSBiYXNpY3MudGltZVRvVW5peE5vTGVhcFNlY3MoeyB5ZWFyOiB0b1llYXIgKyAxIH0pO1xuXG5cblx0XHRjb25zdCB6b25lSW5mb3M6IFpvbmVJbmZvW10gPSB0aGlzLmdldFpvbmVJbmZvcyh6b25lTmFtZSk7XG5cdFx0YXNzZXJ0KHpvbmVJbmZvcy5sZW5ndGggPiAwLCBcIkVtcHR5IHpvbmVJbmZvcyBhcnJheSByZXR1cm5lZCBmcm9tIGdldFpvbmVJbmZvcygpXCIpO1xuXG5cdFx0Y29uc3QgcmVzdWx0OiBUcmFuc2l0aW9uW10gPSBbXTtcblxuXHRcdGxldCBwcmV2Wm9uZTogWm9uZUluZm8gfCB1bmRlZmluZWQ7XG5cdFx0bGV0IHByZXZVbnRpbFllYXI6IG51bWJlciB8IHVuZGVmaW5lZDtcblx0XHRsZXQgcHJldlN0ZE9mZnNldDogRHVyYXRpb24gPSBEdXJhdGlvbi5ob3VycygwKTtcblx0XHRsZXQgcHJldkRzdE9mZnNldDogRHVyYXRpb24gPSBEdXJhdGlvbi5ob3VycygwKTtcblx0XHRsZXQgcHJldkxldHRlcjogc3RyaW5nID0gXCJcIjtcblx0XHRmb3IgKGNvbnN0IHpvbmVJbmZvIG9mIHpvbmVJbmZvcykge1xuXHRcdFx0Y29uc3QgdW50aWxZZWFyOiBudW1iZXIgPSB6b25lSW5mby51bnRpbCAhPT0gdW5kZWZpbmVkID8gbmV3IFRpbWVTdHJ1Y3Qoem9uZUluZm8udW50aWwpLmNvbXBvbmVudHMueWVhciA6IHRvWWVhciArIDE7XG5cdFx0XHRsZXQgc3RkT2Zmc2V0OiBEdXJhdGlvbiA9IHByZXZTdGRPZmZzZXQ7XG5cdFx0XHRsZXQgZHN0T2Zmc2V0OiBEdXJhdGlvbiA9IHByZXZEc3RPZmZzZXQ7XG5cdFx0XHRsZXQgbGV0dGVyOiBzdHJpbmcgPSBwcmV2TGV0dGVyO1xuXG5cdFx0XHQvLyB6b25lIGFwcGxpY2FibGU/XG5cdFx0XHRpZiAoKCFwcmV2Wm9uZSB8fCBwcmV2Wm9uZS51bnRpbCEgPCBlbmRNaWxsaXMgLSAxKSAmJiAoem9uZUluZm8udW50aWwgPT09IHVuZGVmaW5lZCB8fCB6b25lSW5mby51bnRpbCA+PSBzdGFydE1pbGxpcykpIHtcblxuXHRcdFx0XHRzdGRPZmZzZXQgPSB6b25lSW5mby5nbXRvZmY7XG5cblx0XHRcdFx0c3dpdGNoICh6b25lSW5mby5ydWxlVHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgUnVsZVR5cGUuTm9uZTpcblx0XHRcdFx0XHRcdGRzdE9mZnNldCA9IER1cmF0aW9uLmhvdXJzKDApO1xuXHRcdFx0XHRcdFx0bGV0dGVyID0gXCJcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgUnVsZVR5cGUuT2Zmc2V0OlxuXHRcdFx0XHRcdFx0ZHN0T2Zmc2V0ID0gem9uZUluZm8ucnVsZU9mZnNldDtcblx0XHRcdFx0XHRcdGxldHRlciA9IFwiXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFJ1bGVUeXBlLlJ1bGVOYW1lOlxuXHRcdFx0XHRcdFx0Ly8gY2hlY2sgd2hldGhlciB0aGUgZmlyc3QgcnVsZSB0YWtlcyBlZmZlY3QgaW1tZWRpYXRlbHkgb24gdGhlIHpvbmUgdHJhbnNpdGlvblxuXHRcdFx0XHRcdFx0Ly8gKGUuZy4gTHliaWEpXG5cdFx0XHRcdFx0XHRpZiAocHJldlpvbmUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgcnVsZUluZm9zOiBSdWxlSW5mb1tdID0gdGhpcy5nZXRSdWxlSW5mb3Moem9uZUluZm8ucnVsZU5hbWUpO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGNvbnN0IHJ1bGVJbmZvIG9mIHJ1bGVJbmZvcykge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJldlVudGlsWWVhciA9PT0gXCJudW1iZXJcIiAmJiBydWxlSW5mby5hcHBsaWNhYmxlKHByZXZVbnRpbFllYXIpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocnVsZUluZm8udHJhbnNpdGlvblRpbWVVdGMocHJldlVudGlsWWVhciwgc3RkT2Zmc2V0LCB1bmRlZmluZWQpID09PSBwcmV2Wm9uZS51bnRpbCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkc3RPZmZzZXQgPSBydWxlSW5mby5zYXZlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXR0ZXIgPSBydWxlSW5mby5sZXR0ZXI7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGFkZCBhIHRyYW5zaXRpb24gZm9yIHRoZSB6b25lIHRyYW5zaXRpb25cblx0XHRcdFx0Y29uc3QgYXQ6IG51bWJlciA9IChwcmV2Wm9uZSAmJiBwcmV2Wm9uZS51bnRpbCAhPT0gdW5kZWZpbmVkID8gcHJldlpvbmUudW50aWwgOiBzdGFydE1pbGxpcyk7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKG5ldyBUcmFuc2l0aW9uKGF0LCBzdGRPZmZzZXQuYWRkKGRzdE9mZnNldCksIGxldHRlcikpO1xuXG5cdFx0XHRcdC8vIGFkZCB0cmFuc2l0aW9ucyBmb3IgdGhlIHpvbmUgcnVsZXMgaW4gdGhlIHJhbmdlXG5cdFx0XHRcdGlmICh6b25lSW5mby5ydWxlVHlwZSA9PT0gUnVsZVR5cGUuUnVsZU5hbWUpIHtcblx0XHRcdFx0XHRjb25zdCBkc3RUcmFuc2l0aW9uczogVHJhbnNpdGlvbltdID0gdGhpcy5nZXRUcmFuc2l0aW9uc0RzdE9mZnNldHMoXG5cdFx0XHRcdFx0XHR6b25lSW5mby5ydWxlTmFtZSxcblx0XHRcdFx0XHRcdHByZXZVbnRpbFllYXIgIT09IHVuZGVmaW5lZCA/IE1hdGgubWF4KHByZXZVbnRpbFllYXIsIGZyb21ZZWFyKSA6IGZyb21ZZWFyLFxuXHRcdFx0XHRcdFx0TWF0aC5taW4odW50aWxZZWFyLCB0b1llYXIpLFxuXHRcdFx0XHRcdFx0c3RkT2Zmc2V0XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IHRyYW5zaXRpb24gb2YgZHN0VHJhbnNpdGlvbnMpIHtcblx0XHRcdFx0XHRcdGxldHRlciA9IHRyYW5zaXRpb24ubGV0dGVyO1xuXHRcdFx0XHRcdFx0ZHN0T2Zmc2V0ID0gdHJhbnNpdGlvbi5vZmZzZXQ7XG5cdFx0XHRcdFx0XHRyZXN1bHQucHVzaChuZXcgVHJhbnNpdGlvbih0cmFuc2l0aW9uLmF0LCB0cmFuc2l0aW9uLm9mZnNldC5hZGQoc3RkT2Zmc2V0KSwgdHJhbnNpdGlvbi5sZXR0ZXIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cHJldlpvbmUgPSB6b25lSW5mbztcblx0XHRcdHByZXZVbnRpbFllYXIgPSB1bnRpbFllYXI7XG5cdFx0XHRwcmV2U3RkT2Zmc2V0ID0gc3RkT2Zmc2V0O1xuXHRcdFx0cHJldkRzdE9mZnNldCA9IGRzdE9mZnNldDtcblx0XHRcdHByZXZMZXR0ZXIgPSBsZXR0ZXI7XG5cdFx0fVxuXG5cdFx0cmVzdWx0LnNvcnQoKGE6IFRyYW5zaXRpb24sIGI6IFRyYW5zaXRpb24pOiBudW1iZXIgPT4ge1xuXHRcdFx0cmV0dXJuIGEuYXQgLSBiLmF0O1xuXHRcdH0pO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB6b25lIGluZm8gZm9yIHRoZSBnaXZlbiBVVEMgdGltZXN0YW1wLiBUaHJvd3MgaWYgbm90IGZvdW5kLlxuXHQgKiBAcGFyYW0gem9uZU5hbWVcdElBTkEgdGltZSB6b25lIG5hbWVcblx0ICogQHBhcmFtIHV0Y1RpbWVcdFVUQyB0aW1lIHN0YW1wIGFzIHVuaXggbWlsbGlzZWNvbmRzIG9yIGFzIGEgVGltZVN0cnVjdFxuXHQgKiBAcmV0dXJuc1x0Wm9uZUluZm8gb2JqZWN0LiBEbyBub3QgY2hhbmdlLCB3ZSBjYWNoZSB0aGlzIG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBnZXRab25lSW5mbyh6b25lTmFtZTogc3RyaW5nLCB1dGNUaW1lOiBUaW1lU3RydWN0IHwgbnVtYmVyKTogWm9uZUluZm8ge1xuXHRcdGNvbnN0IHVuaXhNaWxsaXMgPSAodHlwZW9mIHV0Y1RpbWUgPT09IFwibnVtYmVyXCIgPyB1dGNUaW1lIDogdXRjVGltZS51bml4TWlsbGlzKTtcblx0XHRjb25zdCB6b25lSW5mb3M6IFpvbmVJbmZvW10gPSB0aGlzLmdldFpvbmVJbmZvcyh6b25lTmFtZSk7XG5cdFx0Zm9yIChjb25zdCB6b25lSW5mbyBvZiB6b25lSW5mb3MpIHtcblx0XHRcdGlmICh6b25lSW5mby51bnRpbCA9PT0gdW5kZWZpbmVkIHx8IHpvbmVJbmZvLnVudGlsID4gdW5peE1pbGxpcykge1xuXHRcdFx0XHRyZXR1cm4gem9uZUluZm87XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0aWYgKHRydWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk5vIHpvbmUgaW5mbyBmb3VuZFwiKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQ6IHpvbmUgaW5mbyBjYWNoZVxuXHQgKi9cblx0cHJpdmF0ZSBfem9uZUluZm9DYWNoZTogeyBbaW5kZXg6IHN0cmluZ106IFpvbmVJbmZvW10gfSA9IHt9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gdGhlIHpvbmUgcmVjb3JkcyBmb3IgYSBnaXZlbiB6b25lIG5hbWUsIGFmdGVyXG5cdCAqIGZvbGxvd2luZyBhbnkgbGlua3MuXG5cdCAqXG5cdCAqIEBwYXJhbSB6b25lTmFtZVx0SUFOQSB6b25lIG5hbWUgbGlrZSBcIlBhY2lmaWMvRWZhdGVcIlxuXHQgKiBAcmV0dXJuIEFycmF5IG9mIHpvbmUgaW5mb3MuIERvIG5vdCBjaGFuZ2UsIHRoaXMgaXMgYSBjYWNoZWQgdmFsdWUuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0Wm9uZUluZm9zKHpvbmVOYW1lOiBzdHJpbmcpOiBab25lSW5mb1tdIHtcblx0XHQvLyBGSVJTVCB2YWxpZGF0ZSB6b25lIG5hbWUgYmVmb3JlIHNlYXJjaGluZyBjYWNoZVxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdGlmICghdGhpcy5fZGF0YS56b25lcy5oYXNPd25Qcm9wZXJ0eSh6b25lTmFtZSkpIHtcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGlmICh0cnVlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlpvbmUgXFxcIlwiICsgem9uZU5hbWUgKyBcIlxcXCIgbm90IGZvdW5kLlwiKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBUYWtlIGZyb20gY2FjaGVcblx0XHRpZiAodGhpcy5fem9uZUluZm9DYWNoZS5oYXNPd25Qcm9wZXJ0eSh6b25lTmFtZSkpIHtcblx0XHRcdHJldHVybiB0aGlzLl96b25lSW5mb0NhY2hlW3pvbmVOYW1lXTtcblx0XHR9XG5cblx0XHRjb25zdCByZXN1bHQ6IFpvbmVJbmZvW10gPSBbXTtcblx0XHRsZXQgYWN0dWFsWm9uZU5hbWU6IHN0cmluZyA9IHpvbmVOYW1lO1xuXHRcdGxldCB6b25lRW50cmllczogYW55ID0gdGhpcy5fZGF0YS56b25lc1t6b25lTmFtZV07XG5cdFx0Ly8gZm9sbG93IGxpbmtzXG5cdFx0d2hpbGUgKHR5cGVvZiAoem9uZUVudHJpZXMpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdGlmICghdGhpcy5fZGF0YS56b25lcy5oYXNPd25Qcm9wZXJ0eSh6b25lRW50cmllcykpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiWm9uZSBcXFwiXCIgKyB6b25lRW50cmllcyArIFwiXFxcIiBub3QgZm91bmQgKHJlZmVycmVkIHRvIGluIGxpbmsgZnJvbSBcXFwiXCJcblx0XHRcdFx0XHQrIHpvbmVOYW1lICsgXCJcXFwiIHZpYSBcXFwiXCIgKyBhY3R1YWxab25lTmFtZSArIFwiXFxcIlwiKTtcblx0XHRcdH1cblx0XHRcdGFjdHVhbFpvbmVOYW1lID0gem9uZUVudHJpZXM7XG5cdFx0XHR6b25lRW50cmllcyA9IHRoaXMuX2RhdGEuem9uZXNbYWN0dWFsWm9uZU5hbWVdO1xuXHRcdH1cblx0XHQvLyBmaW5hbCB6b25lIGluZm8gZm91bmRcblx0XHRmb3IgKGNvbnN0IHpvbmVFbnRyeSBvZiB6b25lRW50cmllcykge1xuXHRcdFx0Y29uc3QgcnVsZVR5cGU6IFJ1bGVUeXBlID0gdGhpcy5wYXJzZVJ1bGVUeXBlKHpvbmVFbnRyeVsxXSk7XG5cdFx0XHRsZXQgdW50aWw6IG51bWJlciB8IHVuZGVmaW5lZCA9IG1hdGguZmlsdGVyRmxvYXQoem9uZUVudHJ5WzNdKTtcblx0XHRcdGlmIChpc05hTih1bnRpbCkpIHtcblx0XHRcdFx0dW50aWwgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cblx0XHRcdHJlc3VsdC5wdXNoKG5ldyBab25lSW5mbyhcblx0XHRcdFx0RHVyYXRpb24ubWludXRlcygtMSAqIG1hdGguZmlsdGVyRmxvYXQoem9uZUVudHJ5WzBdKSksXG5cdFx0XHRcdHJ1bGVUeXBlLFxuXHRcdFx0XHRydWxlVHlwZSA9PT0gUnVsZVR5cGUuT2Zmc2V0ID8gbmV3IER1cmF0aW9uKHpvbmVFbnRyeVsxXSkgOiBuZXcgRHVyYXRpb24oKSxcblx0XHRcdFx0cnVsZVR5cGUgPT09IFJ1bGVUeXBlLlJ1bGVOYW1lID8gem9uZUVudHJ5WzFdIDogXCJcIixcblx0XHRcdFx0em9uZUVudHJ5WzJdLFxuXHRcdFx0XHR1bnRpbFxuXHRcdFx0KSk7XG5cdFx0fVxuXG5cdFx0cmVzdWx0LnNvcnQoKGE6IFpvbmVJbmZvLCBiOiBab25lSW5mbyk6IG51bWJlciA9PiB7XG5cdFx0XHQvLyBzb3J0IHVuZGVmaW5lZCBsYXN0XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdGlmIChhLnVudGlsID09PSB1bmRlZmluZWQgJiYgYi51bnRpbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGEudW50aWwgIT09IHVuZGVmaW5lZCAmJiBiLnVudGlsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGEudW50aWwgPT09IHVuZGVmaW5lZCAmJiBiLnVudGlsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKGEudW50aWwhIC0gYi51bnRpbCEpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fem9uZUluZm9DYWNoZVt6b25lTmFtZV0gPSByZXN1bHQ7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBQZXJmb3JtYW5jZSBpbXByb3ZlbWVudDogcnVsZSBpbmZvIGNhY2hlXG5cdCAqL1xuXHRwcml2YXRlIF9ydWxlSW5mb0NhY2hlOiB7IFtpbmRleDogc3RyaW5nXTogUnVsZUluZm9bXSB9ID0ge307XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHJ1bGUgc2V0IHdpdGggdGhlIGdpdmVuIHJ1bGUgbmFtZSxcblx0ICogc29ydGVkIGJ5IGZpcnN0IGVmZmVjdGl2ZSBkYXRlICh1bmNvbXBlbnNhdGVkIGZvciBcIndcIiBvciBcInNcIiBBdFRpbWUpXG5cdCAqXG5cdCAqIEBwYXJhbSBydWxlTmFtZVx0TmFtZSBvZiBydWxlIHNldFxuXHQgKiBAcmV0dXJuIFJ1bGVJbmZvIGFycmF5LiBEbyBub3QgY2hhbmdlLCB0aGlzIGlzIGEgY2FjaGVkIHZhbHVlLlxuXHQgKi9cblx0cHVibGljIGdldFJ1bGVJbmZvcyhydWxlTmFtZTogc3RyaW5nKTogUnVsZUluZm9bXSB7XG5cdFx0Ly8gdmFsaWRhdGUgbmFtZSBCRUZPUkUgc2VhcmNoaW5nIGNhY2hlXG5cdFx0aWYgKCF0aGlzLl9kYXRhLnJ1bGVzLmhhc093blByb3BlcnR5KHJ1bGVOYW1lKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUnVsZSBzZXQgXFxcIlwiICsgcnVsZU5hbWUgKyBcIlxcXCIgbm90IGZvdW5kLlwiKTtcblx0XHR9XG5cblx0XHQvLyByZXR1cm4gZnJvbSBjYWNoZVxuXHRcdGlmICh0aGlzLl9ydWxlSW5mb0NhY2hlLmhhc093blByb3BlcnR5KHJ1bGVOYW1lKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3J1bGVJbmZvQ2FjaGVbcnVsZU5hbWVdO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlc3VsdDogUnVsZUluZm9bXSA9IFtdO1xuXHRcdGNvbnN0IHJ1bGVTZXQgPSB0aGlzLl9kYXRhLnJ1bGVzW3J1bGVOYW1lXTtcblx0XHRmb3IgKGNvbnN0IHJ1bGUgb2YgcnVsZVNldCkge1xuXG5cdFx0XHRjb25zdCBmcm9tWWVhcjogbnVtYmVyID0gKHJ1bGVbMF0gPT09IFwiTmFOXCIgPyAtMTAwMDAgOiBwYXJzZUludChydWxlWzBdLCAxMCkpO1xuXHRcdFx0Y29uc3QgdG9UeXBlOiBUb1R5cGUgPSB0aGlzLnBhcnNlVG9UeXBlKHJ1bGVbMV0pO1xuXHRcdFx0Y29uc3QgdG9ZZWFyOiBudW1iZXIgPSAodG9UeXBlID09PSBUb1R5cGUuTWF4ID8gMCA6IChydWxlWzFdID09PSBcIm9ubHlcIiA/IGZyb21ZZWFyIDogcGFyc2VJbnQocnVsZVsxXSwgMTApKSk7XG5cdFx0XHRjb25zdCBvblR5cGU6IE9uVHlwZSA9IHRoaXMucGFyc2VPblR5cGUocnVsZVs0XSk7XG5cdFx0XHRjb25zdCBvbkRheTogbnVtYmVyID0gdGhpcy5wYXJzZU9uRGF5KHJ1bGVbNF0sIG9uVHlwZSk7XG5cdFx0XHRjb25zdCBvbldlZWtEYXk6IFdlZWtEYXkgPSB0aGlzLnBhcnNlT25XZWVrRGF5KHJ1bGVbNF0pO1xuXHRcdFx0Y29uc3QgbW9udGhOYW1lOiBzdHJpbmcgPSBydWxlWzNdIGFzIHN0cmluZztcblx0XHRcdGNvbnN0IG1vbnRoTnVtYmVyOiBudW1iZXIgPSBtb250aE5hbWVUb1N0cmluZyhtb250aE5hbWUpO1xuXG5cdFx0XHRyZXN1bHQucHVzaChuZXcgUnVsZUluZm8oXG5cdFx0XHRcdGZyb21ZZWFyLFxuXHRcdFx0XHR0b1R5cGUsXG5cdFx0XHRcdHRvWWVhcixcblx0XHRcdFx0cnVsZVsyXSxcblx0XHRcdFx0bW9udGhOdW1iZXIsXG5cdFx0XHRcdG9uVHlwZSxcblx0XHRcdFx0b25EYXksXG5cdFx0XHRcdG9uV2Vla0RheSxcblx0XHRcdFx0bWF0aC5wb3NpdGl2ZU1vZHVsbyhwYXJzZUludChydWxlWzVdWzBdLCAxMCksIDI0KSwgLy8gbm90ZSB0aGUgZGF0YWJhc2Ugc29tZXRpbWVzIGNvbnRhaW5zIFwiMjRcIiBhcyBob3VyIHZhbHVlXG5cdFx0XHRcdG1hdGgucG9zaXRpdmVNb2R1bG8ocGFyc2VJbnQocnVsZVs1XVsxXSwgMTApLCA2MCksXG5cdFx0XHRcdG1hdGgucG9zaXRpdmVNb2R1bG8ocGFyc2VJbnQocnVsZVs1XVsyXSwgMTApLCA2MCksXG5cdFx0XHRcdHRoaXMucGFyc2VBdFR5cGUocnVsZVs1XVszXSksXG5cdFx0XHRcdER1cmF0aW9uLm1pbnV0ZXMocGFyc2VJbnQocnVsZVs2XSwgMTApKSxcblx0XHRcdFx0cnVsZVs3XSA9PT0gXCItXCIgPyBcIlwiIDogcnVsZVs3XVxuXHRcdFx0XHQpKTtcblxuXHRcdH1cblxuXHRcdHJlc3VsdC5zb3J0KChhOiBSdWxlSW5mbywgYjogUnVsZUluZm8pOiBudW1iZXIgPT4ge1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRpZiAoYS5lZmZlY3RpdmVFcXVhbChiKSkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH0gZWxzZSBpZiAoYS5lZmZlY3RpdmVMZXNzKGIpKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fcnVsZUluZm9DYWNoZVtydWxlTmFtZV0gPSByZXN1bHQ7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZSB0aGUgUlVMRVMgY29sdW1uIG9mIGEgem9uZSBpbmZvIGVudHJ5XG5cdCAqIGFuZCBzZWUgd2hhdCBraW5kIG9mIGVudHJ5IGl0IGlzLlxuXHQgKi9cblx0cHVibGljIHBhcnNlUnVsZVR5cGUocnVsZTogc3RyaW5nKTogUnVsZVR5cGUge1xuXHRcdGlmIChydWxlID09PSBcIi1cIikge1xuXHRcdFx0cmV0dXJuIFJ1bGVUeXBlLk5vbmU7XG5cdFx0fSBlbHNlIGlmIChpc1ZhbGlkT2Zmc2V0U3RyaW5nKHJ1bGUpKSB7XG5cdFx0XHRyZXR1cm4gUnVsZVR5cGUuT2Zmc2V0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gUnVsZVR5cGUuUnVsZU5hbWU7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFBhcnNlIHRoZSBUTyBjb2x1bW4gb2YgYSBydWxlIGluZm8gZW50cnlcblx0ICogYW5kIHNlZSB3aGF0IGtpbmQgb2YgZW50cnkgaXQgaXMuXG5cdCAqL1xuXHRwdWJsaWMgcGFyc2VUb1R5cGUodG86IHN0cmluZyk6IFRvVHlwZSB7XG5cdFx0aWYgKHRvID09PSBcIm1heFwiKSB7XG5cdFx0XHRyZXR1cm4gVG9UeXBlLk1heDtcblx0XHR9IGVsc2UgaWYgKHRvID09PSBcIm9ubHlcIikge1xuXHRcdFx0cmV0dXJuIFRvVHlwZS5ZZWFyOyAvLyB5ZXMgd2UgcmV0dXJuIFllYXIgZm9yIG9ubHlcblx0XHR9IGVsc2UgaWYgKCFpc05hTihwYXJzZUludCh0bywgMTApKSkge1xuXHRcdFx0cmV0dXJuIFRvVHlwZS5ZZWFyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUTyBjb2x1bW4gaW5jb3JyZWN0OiBcIiArIHRvKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2UgdGhlIE9OIGNvbHVtbiBvZiBhIHJ1bGUgaW5mbyBlbnRyeVxuXHQgKiBhbmQgc2VlIHdoYXQga2luZCBvZiBlbnRyeSBpdCBpcy5cblx0ICovXG5cdHB1YmxpYyBwYXJzZU9uVHlwZShvbjogc3RyaW5nKTogT25UeXBlIHtcblx0XHRpZiAob24ubGVuZ3RoID4gNCAmJiBvbi5zdWJzdHIoMCwgNCkgPT09IFwibGFzdFwiKSB7XG5cdFx0XHRyZXR1cm4gT25UeXBlLkxhc3RYO1xuXHRcdH1cblx0XHRpZiAob24uaW5kZXhPZihcIjw9XCIpICE9PSAtMSkge1xuXHRcdFx0cmV0dXJuIE9uVHlwZS5MZXFYO1xuXHRcdH1cblx0XHRpZiAob24uaW5kZXhPZihcIj49XCIpICE9PSAtMSkge1xuXHRcdFx0cmV0dXJuIE9uVHlwZS5HcmVxWDtcblx0XHR9XG5cdFx0cmV0dXJuIE9uVHlwZS5EYXlOdW07XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBkYXkgbnVtYmVyIGZyb20gYW4gT04gY29sdW1uIHN0cmluZywgMCBpZiBubyBkYXkuXG5cdCAqL1xuXHRwdWJsaWMgcGFyc2VPbkRheShvbjogc3RyaW5nLCBvblR5cGU6IE9uVHlwZSk6IG51bWJlciB7XG5cdFx0c3dpdGNoIChvblR5cGUpIHtcblx0XHRcdGNhc2UgT25UeXBlLkRheU51bTogcmV0dXJuIHBhcnNlSW50KG9uLCAxMCk7XG5cdFx0XHRjYXNlIE9uVHlwZS5MZXFYOiByZXR1cm4gcGFyc2VJbnQob24uc3Vic3RyKG9uLmluZGV4T2YoXCI8PVwiKSArIDIpLCAxMCk7XG5cdFx0XHRjYXNlIE9uVHlwZS5HcmVxWDogcmV0dXJuIHBhcnNlSW50KG9uLnN1YnN0cihvbi5pbmRleE9mKFwiPj1cIikgKyAyKSwgMTApO1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgZGF5LW9mLXdlZWsgZnJvbSBhbiBPTiBjb2x1bW4gc3RyaW5nLCBTdW5kYXkgaWYgbm90IHByZXNlbnQuXG5cdCAqL1xuXHRwdWJsaWMgcGFyc2VPbldlZWtEYXkob246IHN0cmluZyk6IFdlZWtEYXkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG5cdFx0XHRpZiAob24uaW5kZXhPZihUekRheU5hbWVzW2ldKSAhPT0gLTEpIHtcblx0XHRcdFx0cmV0dXJuIGkgYXMgV2Vla0RheTtcblx0XHRcdH1cblx0XHR9XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRpZiAodHJ1ZSkge1xuXHRcdFx0cmV0dXJuIFdlZWtEYXkuU3VuZGF5O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZSB0aGUgQVQgY29sdW1uIG9mIGEgcnVsZSBpbmZvIGVudHJ5XG5cdCAqIGFuZCBzZWUgd2hhdCBraW5kIG9mIGVudHJ5IGl0IGlzLlxuXHQgKi9cblx0cHVibGljIHBhcnNlQXRUeXBlKGF0OiBhbnkpOiBBdFR5cGUge1xuXHRcdHN3aXRjaCAoYXQpIHtcblx0XHRcdGNhc2UgXCJzXCI6IHJldHVybiBBdFR5cGUuU3RhbmRhcmQ7XG5cdFx0XHRjYXNlIFwidVwiOiByZXR1cm4gQXRUeXBlLlV0Yztcblx0XHRcdGNhc2UgXCJnXCI6IHJldHVybiBBdFR5cGUuVXRjO1xuXHRcdFx0Y2FzZSBcInpcIjogcmV0dXJuIEF0VHlwZS5VdGM7XG5cdFx0XHRjYXNlIFwid1wiOiByZXR1cm4gQXRUeXBlLldhbGw7XG5cdFx0XHRjYXNlIFwiXCI6IHJldHVybiBBdFR5cGUuV2FsbDtcblx0XHRcdGNhc2UgbnVsbDogcmV0dXJuIEF0VHlwZS5XYWxsO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdGlmICh0cnVlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIEF0VHlwZS5XYWxsO1xuXHRcdFx0XHR9XG5cdFx0fVxuXHR9XG5cbn1cblxuaW50ZXJmYWNlIE1pbk1heEluZm8ge1xuXHRtaW5Ec3RTYXZlOiBudW1iZXI7XG5cdG1heERzdFNhdmU6IG51bWJlcjtcblx0bWluR210T2ZmOiBudW1iZXI7XG5cdG1heEdtdE9mZjogbnVtYmVyO1xufVxuXG4vKipcbiAqIFNhbml0eSBjaGVjayBvbiBkYXRhLiBSZXR1cm5zIG1pbi9tYXggdmFsdWVzLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZURhdGEoZGF0YTogYW55KTogTWluTWF4SW5mbyB7XG5cdGNvbnN0IHJlc3VsdDogUGFydGlhbDxNaW5NYXhJbmZvPiA9IHt9O1xuXG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRpZiAodHlwZW9mKGRhdGEpICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGF0YSBpcyBub3QgYW4gb2JqZWN0XCIpO1xuXHR9XG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoXCJydWxlc1wiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImRhdGEgaGFzIG5vIHJ1bGVzIHByb3BlcnR5XCIpO1xuXHR9XG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoXCJ6b25lc1wiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImRhdGEgaGFzIG5vIHpvbmVzIHByb3BlcnR5XCIpO1xuXHR9XG5cblx0Ly8gdmFsaWRhdGUgem9uZXNcblx0Zm9yIChjb25zdCB6b25lTmFtZSBpbiBkYXRhLnpvbmVzKSB7XG5cdFx0aWYgKGRhdGEuem9uZXMuaGFzT3duUHJvcGVydHkoem9uZU5hbWUpKSB7XG5cdFx0XHRjb25zdCB6b25lQXJyOiBhbnkgPSBkYXRhLnpvbmVzW3pvbmVOYW1lXTtcblx0XHRcdGlmICh0eXBlb2YgKHpvbmVBcnIpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdC8vIG9rLCBpcyBsaW5rIHRvIG90aGVyIHpvbmUsIGNoZWNrIGxpbmtcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdGlmICghZGF0YS56b25lcy5oYXNPd25Qcm9wZXJ0eSh6b25lQXJyIGFzIHN0cmluZykpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbnRyeSBmb3Igem9uZSBcXFwiXCIgKyB6b25lTmFtZSArIFwiXFxcIiBsaW5rcyB0byBcXFwiXCIgKyB6b25lQXJyIGFzIHN0cmluZyArIFwiXFxcIiBidXQgdGhhdCBkb2VzblxcJ3QgZXhpc3RcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkoem9uZUFycikpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbnRyeSBmb3Igem9uZSBcXFwiXCIgKyB6b25lTmFtZSArIFwiXFxcIiBpcyBuZWl0aGVyIGEgc3RyaW5nIG5vciBhbiBhcnJheVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHpvbmVBcnIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBlbnRyeTogYW55ID0gem9uZUFycltpXTtcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkoZW50cnkpKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbnRyeSBcIiArIGkudG9TdHJpbmcoMTApICsgXCIgZm9yIHpvbmUgXFxcIlwiICsgem9uZU5hbWUgKyBcIlxcXCIgaXMgbm90IGFuIGFycmF5XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRpZiAoZW50cnkubGVuZ3RoICE9PSA0KSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbnRyeSBcIiArIGkudG9TdHJpbmcoMTApICsgXCIgZm9yIHpvbmUgXFxcIlwiICsgem9uZU5hbWUgKyBcIlxcXCIgaGFzIGxlbmd0aCAhPSA0XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRpZiAodHlwZW9mIGVudHJ5WzBdICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbnRyeSBcIiArIGkudG9TdHJpbmcoMTApICsgXCIgZm9yIHpvbmUgXFxcIlwiICsgem9uZU5hbWUgKyBcIlxcXCIgZmlyc3QgY29sdW1uIGlzIG5vdCBhIHN0cmluZ1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc3QgZ210b2ZmID0gbWF0aC5maWx0ZXJGbG9hdChlbnRyeVswXSk7XG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdFx0aWYgKGlzTmFOKGdtdG9mZikpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVudHJ5IFwiICsgaS50b1N0cmluZygxMCkgKyBcIiBmb3Igem9uZSBcXFwiXCIgKyB6b25lTmFtZSArIFwiXFxcIiBmaXJzdCBjb2x1bW4gZG9lcyBub3QgY29udGFpbiBhIG51bWJlclwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBlbnRyeVsxXSAhPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRW50cnkgXCIgKyBpLnRvU3RyaW5nKDEwKSArIFwiIGZvciB6b25lIFxcXCJcIiArIHpvbmVOYW1lICsgXCJcXFwiIHNlY29uZCBjb2x1bW4gaXMgbm90IGEgc3RyaW5nXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRpZiAodHlwZW9mIGVudHJ5WzJdICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbnRyeSBcIiArIGkudG9TdHJpbmcoMTApICsgXCIgZm9yIHpvbmUgXFxcIlwiICsgem9uZU5hbWUgKyBcIlxcXCIgdGhpcmQgY29sdW1uIGlzIG5vdCBhIHN0cmluZ1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBlbnRyeVszXSAhPT0gXCJzdHJpbmdcIiAmJiBlbnRyeVszXSAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRW50cnkgXCIgKyBpLnRvU3RyaW5nKDEwKSArIFwiIGZvciB6b25lIFxcXCJcIiArIHpvbmVOYW1lICsgXCJcXFwiIGZvdXJ0aCBjb2x1bW4gaXMgbm90IGEgc3RyaW5nIG5vciBudWxsXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRpZiAodHlwZW9mIGVudHJ5WzNdID09PSBcInN0cmluZ1wiICYmIGlzTmFOKG1hdGguZmlsdGVyRmxvYXQoZW50cnlbM10pKSkge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRW50cnkgXCIgKyBpLnRvU3RyaW5nKDEwKSArIFwiIGZvciB6b25lIFxcXCJcIiArIHpvbmVOYW1lICsgXCJcXFwiIGZvdXJ0aCBjb2x1bW4gZG9lcyBub3QgY29udGFpbiBhIG51bWJlclwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5tYXhHbXRPZmYgPT09IHVuZGVmaW5lZCB8fCBnbXRvZmYgPiByZXN1bHQubWF4R210T2ZmKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQubWF4R210T2ZmID0gZ210b2ZmO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVzdWx0Lm1pbkdtdE9mZiA9PT0gdW5kZWZpbmVkIHx8IGdtdG9mZiA8IHJlc3VsdC5taW5HbXRPZmYpIHtcblx0XHRcdFx0XHRcdHJlc3VsdC5taW5HbXRPZmYgPSBnbXRvZmY7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gdmFsaWRhdGUgcnVsZXNcblx0Zm9yIChjb25zdCBydWxlTmFtZSBpbiBkYXRhLnJ1bGVzKSB7XG5cdFx0aWYgKGRhdGEucnVsZXMuaGFzT3duUHJvcGVydHkocnVsZU5hbWUpKSB7XG5cdFx0XHRjb25zdCBydWxlQXJyOiBhbnkgPSBkYXRhLnJ1bGVzW3J1bGVOYW1lXTtcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KHJ1bGVBcnIpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVudHJ5IGZvciBydWxlIFxcXCJcIiArIHJ1bGVOYW1lICsgXCJcXFwiIGlzIG5vdCBhbiBhcnJheVwiKTtcblx0XHRcdH1cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcnVsZUFyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBydWxlID0gcnVsZUFycltpXTtcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KHJ1bGUpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUnVsZSBcIiArIHJ1bGVOYW1lICsgXCJbXCIgKyBpLnRvU3RyaW5nKDEwKSArIFwiXSBpcyBub3QgYW4gYXJyYXlcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0aWYgKHJ1bGUubGVuZ3RoIDwgOCkgeyAvLyBub3RlIHNvbWUgcnVsZXMgPiA4IGV4aXN0cyBidXQgdGhhdCBzZWVtcyB0byBiZSBhIGJ1ZyBpbiB0eiBmaWxlIHBhcnNpbmdcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSdWxlIFwiICsgcnVsZU5hbWUgKyBcIltcIiArIGkudG9TdHJpbmcoMTApICsgXCJdIGlzIG5vdCBvZiBsZW5ndGggOFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHJ1bGUubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0XHRpZiAoaiAhPT0gNSAmJiB0eXBlb2YgcnVsZVtqXSAhPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUnVsZSBcIiArIHJ1bGVOYW1lICsgXCJbXCIgKyBpLnRvU3RyaW5nKDEwKSArIFwiXVtcIiArIGoudG9TdHJpbmcoMTApICsgXCJdIGlzIG5vdCBhIHN0cmluZ1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdGlmIChydWxlWzBdICE9PSBcIk5hTlwiICYmIGlzTmFOKHBhcnNlSW50KHJ1bGVbMF0sIDEwKSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSdWxlIFwiICsgcnVsZU5hbWUgKyBcIltcIiArIGkudG9TdHJpbmcoMTApICsgXCJdWzBdIGlzIG5vdCBhIG51bWJlclwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0aWYgKHJ1bGVbMV0gIT09IFwib25seVwiICYmIHJ1bGVbMV0gIT09IFwibWF4XCIgJiYgaXNOYU4ocGFyc2VJbnQocnVsZVsxXSwgMTApKSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlJ1bGUgXCIgKyBydWxlTmFtZSArIFwiW1wiICsgaS50b1N0cmluZygxMCkgKyBcIl1bMV0gaXMgbm90IGEgbnVtYmVyLCBvbmx5IG9yIG1heFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0aWYgKCFUek1vbnRoTmFtZXMuaGFzT3duUHJvcGVydHkocnVsZVszXSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSdWxlIFwiICsgcnVsZU5hbWUgKyBcIltcIiArIGkudG9TdHJpbmcoMTApICsgXCJdWzNdIGlzIG5vdCBhIG1vbnRoIG5hbWVcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdGlmIChydWxlWzRdLnN1YnN0cigwLCA0KSAhPT0gXCJsYXN0XCIgJiYgcnVsZVs0XS5pbmRleE9mKFwiPj1cIikgPT09IC0xXG5cdFx0XHRcdFx0JiYgcnVsZVs0XS5pbmRleE9mKFwiPD1cIikgPT09IC0xICYmIGlzTmFOKHBhcnNlSW50KHJ1bGVbNF0sIDEwKSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUnVsZSBcIiArIHJ1bGVOYW1lICsgXCJbXCIgKyBpLnRvU3RyaW5nKDEwKSArIFwiXVs0XSBpcyBub3QgYSBrbm93biB0eXBlIG9mIGV4cHJlc3Npb25cIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdFx0XHRcdGlmICghQXJyYXkuaXNBcnJheShydWxlWzVdKSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlJ1bGUgXCIgKyBydWxlTmFtZSArIFwiW1wiICsgaS50b1N0cmluZygxMCkgKyBcIl1bNV0gaXMgbm90IGFuIGFycmF5XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHRpZiAocnVsZVs1XS5sZW5ndGggIT09IDQpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSdWxlIFwiICsgcnVsZU5hbWUgKyBcIltcIiArIGkudG9TdHJpbmcoMTApICsgXCJdWzVdIGlzIG5vdCBvZiBsZW5ndGggNFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0aWYgKGlzTmFOKHBhcnNlSW50KHJ1bGVbNV1bMF0sIDEwKSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSdWxlIFwiICsgcnVsZU5hbWUgKyBcIltcIiArIGkudG9TdHJpbmcoMTApICsgXCJdWzVdWzBdIGlzIG5vdCBhIG51bWJlclwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0aWYgKGlzTmFOKHBhcnNlSW50KHJ1bGVbNV1bMV0sIDEwKSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSdWxlIFwiICsgcnVsZU5hbWUgKyBcIltcIiArIGkudG9TdHJpbmcoMTApICsgXCJdWzVdWzFdIGlzIG5vdCBhIG51bWJlclwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0aWYgKGlzTmFOKHBhcnNlSW50KHJ1bGVbNV1bMl0sIDEwKSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSdWxlIFwiICsgcnVsZU5hbWUgKyBcIltcIiArIGkudG9TdHJpbmcoMTApICsgXCJdWzVdWzJdIGlzIG5vdCBhIG51bWJlclwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0XHRcdFx0aWYgKHJ1bGVbNV1bM10gIT09IFwiXCIgJiYgcnVsZVs1XVszXSAhPT0gXCJzXCIgJiYgcnVsZVs1XVszXSAhPT0gXCJ3XCJcblx0XHRcdFx0XHQmJiBydWxlWzVdWzNdICE9PSBcImdcIiAmJiBydWxlWzVdWzNdICE9PSBcInVcIiAmJiBydWxlWzVdWzNdICE9PSBcInpcIiAmJiBydWxlWzVdWzNdICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUnVsZSBcIiArIHJ1bGVOYW1lICsgXCJbXCIgKyBpLnRvU3RyaW5nKDEwKSArIFwiXVs1XVszXSBpcyBub3QgZW1wdHksIGcsIHosIHMsIHcsIHUgb3IgbnVsbFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBzYXZlOiBudW1iZXIgPSBwYXJzZUludChydWxlWzZdLCAxMCk7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHRcdFx0XHRpZiAoaXNOYU4oc2F2ZSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSdWxlIFwiICsgcnVsZU5hbWUgKyBcIltcIiArIGkudG9TdHJpbmcoMTApICsgXCJdWzZdIGRvZXMgbm90IGNvbnRhaW4gYSB2YWxpZCBudW1iZXJcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHNhdmUgIT09IDApIHtcblx0XHRcdFx0XHRpZiAocmVzdWx0Lm1heERzdFNhdmUgPT09IHVuZGVmaW5lZCB8fCBzYXZlID4gcmVzdWx0Lm1heERzdFNhdmUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdC5tYXhEc3RTYXZlID0gc2F2ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5taW5Ec3RTYXZlID09PSB1bmRlZmluZWQgfHwgc2F2ZSA8IHJlc3VsdC5taW5Ec3RTYXZlKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQubWluRHN0U2F2ZSA9IHNhdmU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdCBhcyBNaW5NYXhJbmZvO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBBQkIgU3dpdHplcmxhbmQgTHRkLlxuICpcbiAqIERhdGUgYW5kIFRpbWUgdXRpbGl0eSBmdW5jdGlvbnMgLSBtYWluIGluZGV4XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCAqIGZyb20gXCIuL2Jhc2ljc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vZGF0ZXRpbWVcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2R1cmF0aW9uXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9mb3JtYXRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2dsb2JhbHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2phdmFzY3JpcHRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2xvY2FsZVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vcGFyc2VcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3BlcmlvZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vYmFzaWNzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi90aW1lc291cmNlXCI7XG5leHBvcnQgKiBmcm9tIFwiLi90aW1lem9uZVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHotZGF0YWJhc2VcIjtcbiJdfQ==
