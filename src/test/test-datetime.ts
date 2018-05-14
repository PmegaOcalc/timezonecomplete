/**
 * Copyright(c) 2014 ABB Switzerland Ltd.
 */

"use strict";

// tslint:disable:no-unused-expression

import sourcemapsupport = require("source-map-support");
// Enable source-map support for backtraces. Causes TS files & linenumbers to show up in them.
sourcemapsupport.install({ handleUncaughtExceptions: false });

import * as assert from "assert";
import { expect } from "chai";

import { DateFunctions, DateTime, Duration, TimeSource, TimeUnit, TimeZone, WeekDay } from "../lib/index";
import * as index from "../lib/index";

// Fake time source
class TestTimeSource implements TimeSource {
	public currentTime: Date = new Date("2014-01-03T04:05:06.007Z");

	public now(): Date {
		return this.currentTime;
	}
}

// Insert fake time source so that now() is stable
const testTimeSource: TestTimeSource = new TestTimeSource();
DateTime.timeSource = testTimeSource;

describe("datetime loose", (): void => {
	// ensure time faked
	beforeEach((): void => {
		testTimeSource.currentTime = new Date("2014-01-03T04:05:06.007Z");
		DateTime.timeSource = testTimeSource;
	});

	describe("nowLocal()", (): void => {
		it("should return something with a local time zone", (): void => {
			expect(index.nowLocal().offset()).to.equal(-1 * testTimeSource.now().getTimezoneOffset());
		});
		it("should return the local time", (): void => {
			expect(index.nowLocal().year()).to.equal(testTimeSource.currentTime.getFullYear());
			expect(index.nowLocal().month()).to.equal(testTimeSource.currentTime.getMonth() + 1); // javascript starts from 0
			expect(index.nowLocal().day()).to.equal(testTimeSource.currentTime.getDate());
			expect(index.nowLocal().hour()).to.equal(testTimeSource.currentTime.getHours());
			expect(index.nowLocal().minute()).to.equal(testTimeSource.currentTime.getMinutes());
			expect(index.nowLocal().second()).to.equal(testTimeSource.currentTime.getSeconds());
			expect(index.nowLocal().millisecond()).to.equal(testTimeSource.currentTime.getMilliseconds());
		});
	});

	describe("nowUtc()", (): void => {
		it("should return something with a local time zone", (): void => {
			expect(index.nowUtc().zone()).to.equal(TimeZone.utc());
		});
		it("should return the local time", (): void => {
			expect(index.nowUtc().year()).to.equal(testTimeSource.currentTime.getUTCFullYear());
			expect(index.nowUtc().month()).to.equal(testTimeSource.currentTime.getUTCMonth() + 1); // javascript starts from 0
			expect(index.nowUtc().day()).to.equal(testTimeSource.currentTime.getUTCDate());
			expect(index.nowUtc().hour()).to.equal(testTimeSource.currentTime.getUTCHours());
			expect(index.nowUtc().minute()).to.equal(testTimeSource.currentTime.getUTCMinutes());
			expect(index.nowUtc().second()).to.equal(testTimeSource.currentTime.getUTCSeconds());
			expect(index.nowUtc().millisecond()).to.equal(testTimeSource.currentTime.getUTCMilliseconds());
		});
	});

	describe("now", (): void => {
		it("should return something with the given zone", (): void => {
			expect(index.now(TimeZone.zone("+03:00")).zone()).to.equal(TimeZone.zone("+03:00"));
		});
		it("should return the zone time", (): void => {
			expect(index.now(TimeZone.zone("+03:00")).hour()).to.equal(testTimeSource.currentTime.getUTCHours() + 3);
		});
		it("should default to UTC", (): void => {
			expect(index.now().hour()).to.equal(testTimeSource.currentTime.getUTCHours());
		});
	});

	describe("isDateTime()", (): void => {
		it("should return true for DateTime", (): void => {
			expect(index.isDateTime(index.nowLocal())).to.equal(true);
		});
		it("should return false for non-DateTime", (): void => {
			expect(index.isDateTime(new Buffer("tralala"))).to.equal(false);
		});
		it("should return false for null", (): void => {
			expect(index.isDateTime(null)).to.equal(false);
		});
	});
});

describe("DateTime", (): void => {
	// ensure time faked
	beforeEach((): void => {
		testTimeSource.currentTime = new Date("2014-01-03T04:05:06.007Z");
		DateTime.timeSource = testTimeSource;
	});

	describe("nowLocal()", (): void => {
		it("should return something with a local time zone", (): void => {
			expect(DateTime.nowLocal().offset()).to.equal(-1 * testTimeSource.now().getTimezoneOffset());
		});
		it("should return the local time", (): void => {
			expect(DateTime.nowLocal().year()).to.equal(testTimeSource.currentTime.getFullYear());
			expect(DateTime.nowLocal().month()).to.equal(testTimeSource.currentTime.getMonth() + 1); // javascript starts from 0
			expect(DateTime.nowLocal().day()).to.equal(testTimeSource.currentTime.getDate());
			expect(DateTime.nowLocal().hour()).to.equal(testTimeSource.currentTime.getHours());
			expect(DateTime.nowLocal().minute()).to.equal(testTimeSource.currentTime.getMinutes());
			expect(DateTime.nowLocal().second()).to.equal(testTimeSource.currentTime.getSeconds());
			expect(DateTime.nowLocal().millisecond()).to.equal(testTimeSource.currentTime.getMilliseconds());
		});
	});

	describe("nowUtc()", (): void => {
		it("should return something with a local time zone", (): void => {
			expect(DateTime.nowUtc().zone()).to.equal(TimeZone.utc());
		});
		it("should return the local time", (): void => {
			expect(DateTime.nowUtc().year()).to.equal(testTimeSource.currentTime.getUTCFullYear());
			expect(DateTime.nowUtc().month()).to.equal(testTimeSource.currentTime.getUTCMonth() + 1); // javascript starts from 0
			expect(DateTime.nowUtc().day()).to.equal(testTimeSource.currentTime.getUTCDate());
			expect(DateTime.nowUtc().hour()).to.equal(testTimeSource.currentTime.getUTCHours());
			expect(DateTime.nowUtc().minute()).to.equal(testTimeSource.currentTime.getUTCMinutes());
			expect(DateTime.nowUtc().second()).to.equal(testTimeSource.currentTime.getUTCSeconds());
			expect(DateTime.nowUtc().millisecond()).to.equal(testTimeSource.currentTime.getUTCMilliseconds());
		});
	});

	describe("now", (): void => {
		it("should return something with the given zone", (): void => {
			expect(DateTime.now(TimeZone.zone("+03:00")).zone()).to.equal(TimeZone.zone("+03:00"));
		});
		it("should return the zone time", (): void => {
			expect(DateTime.now(TimeZone.zone("+03:00")).hour()).to.equal(testTimeSource.currentTime.getUTCHours() + 3);
		});
		it("should default to UTC", (): void => {
			expect(DateTime.now().hour()).to.equal(testTimeSource.currentTime.getUTCHours());
		});
	});

	describe("fromExcel()", (): void => {
		it("should perform correct conversion", (): void => {
			expect(DateTime.fromExcel(42005.5430555556).toString()).to.equal("2015-01-01T13:02:00.000");
		});
		it("should add timezone if given", (): void => {
			expect(DateTime.fromExcel(42005.5430555556, TimeZone.zone("+03:00")).toString()).to.equal("2015-01-01T13:02:00.000+03:00");
		});
	});

	describe("toExcel()", (): void => {
		const oneMsec = (1 / 86400000);
		it("should perform correct conversion", (): void => {
			expect((new DateTime("2015-01-01T13:02:00.000")).toExcel()).to.be.within(42005.5430555556 - oneMsec, 42005.5430555556 + oneMsec);
		});
		it("should add timezone if given", (): void => {
			expect((new DateTime("2015-01-01T13:02:00.000 UTC")).toExcel(TimeZone.zone("+01:00")))
				.to.be.within(42005.5430555556 + 1 / 24 - oneMsec, 42005.5430555556 + 1 / 24 + oneMsec);
		});
		it("should add timezone if given", (): void => {
			expect((new DateTime("2015-01-01T13:02:00.000 UTC")).toExcel(TimeZone.zone("+01:00")))
				.to.be.within(42005.5430555556 + 1 / 24 - oneMsec, 42005.5430555556 + 1 / 24 + oneMsec);
		});
	});

	describe("toUtcExcel()", (): void => {
		const oneMsec = (1 / 86400000);
		it("should perform correct conversion", (): void => {
			expect((new DateTime("2015-01-01T13:02:00.000")).toUtcExcel()).to.be.within(42005.5430555556 - oneMsec, 42005.5430555556 + oneMsec);
		});
		it("should use the UTC value", (): void => {
			expect((new DateTime("2015-01-01T13:02:00.000+01:00")).toUtcExcel()).
				to.be.within(42005.5430555556 - 1 / 24 - oneMsec, 42005.5430555556 - 1 / 24 + oneMsec);
		});
	});

	describe("exists", (): void => {
		it("should handle leap years", (): void => {
			expect(DateTime.exists(2012, 2, 29)).to.equal(true);
			expect(DateTime.exists(2013, 2, 29)).to.equal(false);
		});
		it("should handle # days in month", (): void => {
			expect(DateTime.exists(2012, 4, 30)).to.equal(true);
			expect(DateTime.exists(2012, 4, 31)).to.equal(false);
		});
		it("should handle DST changes", (): void => {
			expect(DateTime.exists(2015, 3, 29, 2, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"))).to.equal(false);
			expect(DateTime.exists(2015, 3, 29, 1, 59, 59, 999, TimeZone.zone("Europe/Amsterdam"))).to.equal(true);
			expect(DateTime.exists(2015, 3, 29, 3, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"))).to.equal(true);
		});
		it("should handle pre-1970 dates", (): void => {
			expect(DateTime.exists(1969, 12, 31, 23, 59, 59, 999, undefined, false)).to.equal(false);
			expect(DateTime.exists(1969, 12, 31, 23, 59, 59, 999, undefined, true)).to.equal(true);
			expect(DateTime.exists(1969, 12, 31, 23, 59, 59, 999, TimeZone.zone("Europe/Amsterdam"), false)).to.equal(false);
			expect(DateTime.exists(1969, 12, 31, 23, 59, 59, 999, TimeZone.zone("Europe/Amsterdam"), true)).to.equal(true);
		});
		it("should return false for NaN values", (): void => {
			expect(DateTime.exists(2015, NaN, 29, 2, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"))).to.equal(false);
			expect(DateTime.exists(2015, 3, Infinity, 1, 59, 59, 999, TimeZone.zone("Europe/Amsterdam"))).to.equal(false);
		});
		it("should fill in default arguments", (): void => {
			expect(DateTime.exists(1969)).to.equal(false);
			expect(DateTime.exists(1970)).to.equal(true);
		});
	});

	describe("constructor()", (): void => {
		it("should return something with a local time zone", (): void => {
			expect((new DateTime()).offset()).to.equal(-1 * testTimeSource.now().getTimezoneOffset());
		});
		it("should return the local time", (): void => {
			expect((new DateTime()).year()).to.equal(testTimeSource.currentTime.getFullYear());
			expect((new DateTime()).month()).to.equal(testTimeSource.currentTime.getMonth() + 1); // javascript starts from 0
			expect((new DateTime()).day()).to.equal(testTimeSource.currentTime.getDate());
			expect((new DateTime()).hour()).to.equal(testTimeSource.currentTime.getHours());
			expect((new DateTime()).minute()).to.equal(testTimeSource.currentTime.getMinutes());
			expect((new DateTime()).second()).to.equal(testTimeSource.currentTime.getSeconds());
			expect((new DateTime()).millisecond()).to.equal(testTimeSource.currentTime.getMilliseconds());
		});
	});

	describe("constructor(string)", (): void => {
		it("should parse unaware date (no argument)", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(7);
			expect(d.minute()).to.equal(8);
			expect(d.second()).to.equal(9);
			expect(d.millisecond()).to.equal(10);
			expect(d.zone()).to.be.undefined;
			expect(d.offset()).to.equal(0);
		});
		it("should parse unaware date (null)", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010", null);
			expect(d.zone()).to.be.undefined;
		});
		it("should parse unaware date (undefined)", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010", undefined);
			expect(d.zone()).to.be.undefined;
		});
		it("should round the milliseconds", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.0105");
			expect(d.millisecond()).to.equal(11);
		});
		it("should parse only date", (): void => {
			const d = new DateTime("2014-05-06");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(0);
			expect(d.zone()).to.be.undefined;
			expect(d.offset()).to.equal(0);
		});
		it("should parse Zulu date", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010Z");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(7);
			expect(d.minute()).to.equal(8);
			expect(d.second()).to.equal(9);
			expect(d.millisecond()).to.equal(10);
			expect((d.zone() as TimeZone).name()).to.equal("+00:00");
			expect(d.offset()).to.equal(0);
		});
		it("should parse zero-offset date", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010+00:00");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(7);
			expect(d.minute()).to.equal(8);
			expect(d.second()).to.equal(9);
			expect(d.millisecond()).to.equal(10);
			expect((d.zone() as TimeZone).name()).to.equal("+00:00");
			expect(d.offset()).to.equal(0);
		});
		it("should parse positive-offset date", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010+01:30");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(7);
			expect(d.minute()).to.equal(8);
			expect(d.second()).to.equal(9);
			expect(d.millisecond()).to.equal(10);
			expect(d.zone()).to.equal(TimeZone.zone(90));
			expect(d.offset()).to.equal(90);
		});
		it("should parse negative-offset date", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010-01:30");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(7);
			expect(d.minute()).to.equal(8);
			expect(d.second()).to.equal(9);
			expect(d.millisecond()).to.equal(10);
			expect(d.zone()).to.equal(TimeZone.zone(-90));
			expect(d.offset()).to.equal(-90);
		});
		it("should parse IANA time zone", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010 Europe/Amsterdam");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(7);
			expect(d.minute()).to.equal(8);
			expect(d.second()).to.equal(9);
			expect(d.millisecond()).to.equal(10);
			expect(d.zone()).to.equal(TimeZone.zone("Europe/Amsterdam"));
			expect(d.offset()).to.equal(120);
		});
		it("should parse IANA time zone without DST", (): void => {
			const d = new DateTime("2014-05-06T07:08:09.010 Europe/Amsterdam without DST");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(7);
			expect(d.minute()).to.equal(8);
			expect(d.second()).to.equal(9);
			expect(d.millisecond()).to.equal(10);
			expect(d.zone()).to.equal(TimeZone.zone("Europe/Amsterdam", false));
			expect(d.offset()).to.equal(60);
		});
		it("should take care of whitespace", (): void => {
			const d = new DateTime(" \n\t2014-05-06T07:08:09.010 Europe/Amsterdam \n\t");
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(7);
			expect(d.minute()).to.equal(8);
			expect(d.second()).to.equal(9);
			expect(d.millisecond()).to.equal(10);
			expect(d.zone()).to.equal(TimeZone.zone("Europe/Amsterdam"));
			expect(d.offset()).to.equal(120);
		});
		it("should add given time zone", (): void => {
			const d = new DateTime("2014-05-06", TimeZone.zone(6));
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(0);
			expect(!!d.zone()).to.equal(true);
			expect(d.offset()).to.equal(6);
		});
		it("should override time zone in string", (): void => {
			const d = new DateTime("2014-05-06T00:00:00+05", TimeZone.zone(6));
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(5);
			expect(d.day()).to.equal(6);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(0);
			expect(!!d.zone()).to.equal(true);
			expect(d.offset()).to.equal(6);
		});
	});

	describe("constructor(string, string, zone?)", (): void => {
		it("should parse ISO date", (): void => {
			const d = new DateTime("2015-03-02T23:44:12.233", "yyyy-MM-ddTHH:mm:ss.SSS");
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(44);
			expect(d.second()).to.equal(12);
			expect(d.millisecond()).to.equal(233);
			expect(d.zone()).to.be.undefined;
		});
		it("should parse unaware NL date", (): void => {
			const d = new DateTime("02-03-2015 23:44:12.233", "dd-MM-yyyy HH:mm:ss.SSS");
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(44);
			expect(d.second()).to.equal(12);
			expect(d.millisecond()).to.equal(233);
			expect(d.zone()).to.be.undefined;
		});
		it("should parse unaware NL date (null)", (): void => {
			const d = new DateTime("02-03-2015 23:44:12.233", "dd-MM-yyyy HH:mm:ss.SSS", null);
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(44);
			expect(d.second()).to.equal(12);
			expect(d.millisecond()).to.equal(233);
			expect(d.zone()).to.be.undefined;
		});
		it("should parse unaware NL date without leading zeroes", (): void => {
			const d = new DateTime("2-3-2015 23:44:12.233", "dd-MM-yyyy HH:mm:ss.SSS");
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(44);
			expect(d.second()).to.equal(12);
			expect(d.millisecond()).to.equal(233);
			expect(d.zone()).to.be.undefined;
		});
		it("should parse unaware US date", (): void => {
			const d = new DateTime("3/2/2015 23:44:12.233", "MM/dd/yyyy HH:mm:ss.SSS");
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(44);
			expect(d.second()).to.equal(12);
			expect(d.millisecond()).to.equal(233);
			expect(d.zone()).to.be.undefined;
		});
		it("should add given zone", (): void => {
			const d = new DateTime("3/2/2015 23:44:12.233", "MM/dd/yyyy HH:mm:ss.SSS", TimeZone.utc());
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(44);
			expect(d.second()).to.equal(12);
			expect(d.millisecond()).to.equal(233);
			expect((d.zone() as TimeZone).identical(TimeZone.utc())).to.equal(true);
		});
		it("should parse date with offset", (): void => {
			const d = new DateTime("3/2/2015 23:44:12.233+02:30", "MM/dd/yyyy HH:mm:ss.SSSXXX");
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(44);
			expect(d.second()).to.equal(12);
			expect(d.millisecond()).to.equal(233);
			expect((d.zone() as TimeZone).identical(TimeZone.zone("+02:30"))).to.equal(true);
		});
		it("should parse date with zone name", (): void => {
			const d = new DateTime("3/2/2015 23:44:12.233 America/Chicago", "MM/dd/yyyy HH:mm:ss.SSS VV");
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(44);
			expect(d.second()).to.equal(12);
			expect(d.millisecond()).to.equal(233);
			expect((d.zone() as TimeZone).identical(TimeZone.zone("America/Chicago"))).to.equal(true);
		});
		it("should parse date with zeroes", (): void => {
			const d = new DateTime("3/2/2015 06:00:00.000 America/Chicago", "MM/dd/yyyy HH:mm:ss.SSS VV");
			expect(d.year()).to.equal(2015);
			expect(d.month()).to.equal(3);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(6);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(0);
			expect((d.zone() as TimeZone).identical(TimeZone.zone("America/Chicago"))).to.equal(true);
		});
	});

	describe("constructor(date: Date, dateKind: DateFunctions, timeZone?: TimeZone)", (): void => {
		it("should throw on null date", (): void => {
			assert.throws((): void => {
				new DateTime(null as any, DateFunctions.Get);
			});
		});
		it("should parse date as local,unaware (winter time)", (): void => {
			const date = new Date("2014-01-02T03:04:05.006Z");
			const d = new DateTime(date, DateFunctions.Get);
			expect(d.year()).to.equal(date.getFullYear());
			expect(d.month()).to.equal(date.getMonth() + 1);
			expect(d.day()).to.equal(date.getDate());
			expect(d.hour()).to.equal(date.getHours());
			expect(d.minute()).to.equal(date.getMinutes());
			expect(d.second()).to.equal(date.getSeconds());
			expect(d.millisecond()).to.equal(date.getMilliseconds());
			expect(d.zone()).to.be.undefined;
		});
		it("should parse date as utc,unaware (winter time)", (): void => {
			const date = new Date("2014-01-02T03:04:05.006Z");
			const d = new DateTime(date, DateFunctions.GetUTC);
			expect(d.year()).to.equal(date.getUTCFullYear());
			expect(d.month()).to.equal(date.getUTCMonth() + 1);
			expect(d.day()).to.equal(date.getUTCDate());
			expect(d.hour()).to.equal(date.getUTCHours());
			expect(d.minute()).to.equal(date.getUTCMinutes());
			expect(d.second()).to.equal(date.getUTCSeconds());
			expect(d.millisecond()).to.equal(date.getUTCMilliseconds());
			expect(d.zone()).to.be.undefined;
		});
		it("should parse date as local,unaware (summer time)", (): void => {
			const date = new Date("2014-07-02T03:04:05.006Z");
			const d = new DateTime(date, DateFunctions.Get);
			expect(d.year()).to.equal(date.getFullYear());
			expect(d.month()).to.equal(date.getMonth() + 1);
			expect(d.day()).to.equal(date.getDate());
			expect(d.hour()).to.equal(date.getHours());
			expect(d.minute()).to.equal(date.getMinutes());
			expect(d.second()).to.equal(date.getSeconds());
			expect(d.millisecond()).to.equal(date.getMilliseconds());
			expect(d.zone()).to.be.undefined;
		});
		it("should parse date as utc,unaware (summer time)", (): void => {
			const date = new Date("2014-07-02T03:04:05.006Z");
			const d = new DateTime(date, DateFunctions.GetUTC, undefined);
			expect(d.year()).to.equal(date.getUTCFullYear());
			expect(d.month()).to.equal(date.getUTCMonth() + 1);
			expect(d.day()).to.equal(date.getUTCDate());
			expect(d.hour()).to.equal(date.getUTCHours());
			expect(d.minute()).to.equal(date.getUTCMinutes());
			expect(d.second()).to.equal(date.getUTCSeconds());
			expect(d.millisecond()).to.equal(date.getUTCMilliseconds());
			expect(d.zone()).to.be.undefined;
		});
		it("should parse date local,aware", (): void => {
			const date = new Date("2014-01-02T03:04:05.006Z");
			const d = new DateTime(date, DateFunctions.Get, TimeZone.zone(90));
			expect(d.year()).to.equal(date.getFullYear());
			expect(d.month()).to.equal(date.getMonth() + 1);
			expect(d.day()).to.equal(date.getDate());
			expect(d.hour()).to.equal(date.getHours());
			expect(d.minute()).to.equal(date.getMinutes());
			expect(d.second()).to.equal(date.getSeconds());
			expect(d.millisecond()).to.equal(date.getMilliseconds());
			expect(d.offset()).to.equal(90);
		});
		it("should parse date utc,aware", (): void => {
			const date = new Date("2014-01-02T03:04:05.006Z");
			const d = new DateTime(date, DateFunctions.GetUTC, TimeZone.zone(90));
			expect(d.year()).to.equal(date.getUTCFullYear());
			expect(d.month()).to.equal(date.getUTCMonth() + 1);
			expect(d.day()).to.equal(date.getUTCDate());
			expect(d.hour()).to.equal(date.getUTCHours());
			expect(d.minute()).to.equal(date.getUTCMinutes());
			expect(d.second()).to.equal(date.getUTCSeconds());
			expect(d.millisecond()).to.equal(date.getUTCMilliseconds());
			expect(d.offset()).to.equal(90);
		});
	});

	describe("constructor(timestruct)", (): void => {
		it("should throw on null TimeStruct", (): void => {
			assert.throws((): void => {
				new DateTime(null as any);
			});
		});
	});

	describe("constructor(year, month, ..., millisecond, timeZone?: TimeZone)", (): void => {
		it("full entries, unaware", (): void => {
			const d = new DateTime(2014, 1, 2, 3, 4, 5, 6, undefined);
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(3);
			expect(d.minute()).to.equal(4);
			expect(d.second()).to.equal(5);
			expect(d.millisecond()).to.equal(6);
			expect(d.zone()).to.be.undefined;
		});
		it("full entries, unaware (null)", (): void => {
			const d = new DateTime(2014, 1, 2, 3, 4, 5, 6, null);
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(3);
			expect(d.minute()).to.equal(4);
			expect(d.second()).to.equal(5);
			expect(d.millisecond()).to.equal(6);
			expect(d.zone()).to.be.undefined;
		});
		it("should round the numbers", (): void => {
			const d = new DateTime(2014.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1);
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(3);
			expect(d.minute()).to.equal(4);
			expect(d.second()).to.equal(5);
			expect(d.millisecond()).to.equal(6);
			expect(d.zone()).to.be.undefined;
		});
		it("missing entries, unaware", (): void => {
			const d = new DateTime(2014, 1, 2);
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(0);
			expect(d.zone()).to.be.undefined;
		});
		it("full entries, aware", (): void => {
			const d = new DateTime(2014, 1, 2, 3, 4, 5, 6, TimeZone.zone(90));
			expect(d.year()).to.equal(2014);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(2);
			expect(d.hour()).to.equal(3);
			expect(d.minute()).to.equal(4);
			expect(d.second()).to.equal(5);
			expect(d.millisecond()).to.equal(6);
			expect(d.zone()).to.equal(TimeZone.zone(90));
		});

		it("should normalize around DST", (): void => {
			const d = new DateTime(2014, 3, 30, 2, 0, 0, 0, TimeZone.zone("Europe/Amsterdam")); // non-existing due to DST forward
			expect(d.hour()).to.equal(3); // should be normalized to 3AM
		});
		it("should throw on wrong input", (): void => {
			assert.throws((): void => { new DateTime(2014, 0, 1); }, "doesn't throw on invalid month");
			assert.throws((): void => { new DateTime(2014, 13, 1); }, "doesn't throw on invalid month");
			assert.throws((): void => { new DateTime(2014, 1, 0); }, "doesn't throw on invalid day");
			assert.throws((): void => { new DateTime(2014, 1, 32); }, "doesn't throw on invalid day");
			assert.throws((): void => { new DateTime(2014, 1, 30, 24); }, "doesn't throw on invalid hour");
			assert.throws((): void => { new DateTime(2014, 1, 30, -1); }, "doesn't throw on invalid hour");
			assert.throws((): void => { new DateTime(2014, 1, 30, 1, 60); }, "doesn't throw on invalid minute");
			assert.throws((): void => { new DateTime(2014, 1, 30, 1, -1); }, "doesn't throw on invalid minute");
			assert.throws((): void => { new DateTime(2014, 1, 30, 1, 1, 60); }, "doesn't throw on invalid second");
			assert.throws((): void => { new DateTime(2014, 1, 30, 1, 1, -1); }, "doesn't throw on invalid second");
			assert.throws((): void => { new DateTime(2014, 1, 30, 1, 1, 1, -1); }, "doesn't throw on invalid millisecond");
			assert.throws((): void => { new DateTime(2014, 1, 30, 1, 1, 1, 1000); }, "doesn't throw on invalid millisecond");
		});
	});

	describe("constructor(utcUnixTime: number, timeZone?: TimeZone)", (): void => {
		it("unaware", (): void => {
			const d = new DateTime(1);
			expect(d.year()).to.equal(1970);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(1);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(1);
			expect(d.zone()).to.be.undefined;
		});
		it("unaware (null)", (): void => {
			const d = new DateTime(1, null);
			expect(d.year()).to.equal(1970);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(1);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(1);
			expect(d.zone()).to.be.undefined;
		});
		it("should round to millisecs", (): void => {
			const d = new DateTime(1.1);
			expect(d.year()).to.equal(1970);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(1);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(1);
			expect(d.zone()).to.be.undefined;
		});
		it("should round to millisecs, negative", (): void => {
			const d = new DateTime(-1.5);
			expect(d.year()).to.equal(1969);
			expect(d.month()).to.equal(12);
			expect(d.day()).to.equal(31);
			expect(d.hour()).to.equal(23);
			expect(d.minute()).to.equal(59);
			expect(d.second()).to.equal(59);
			expect(d.millisecond()).to.equal(998);
			expect(d.zone()).to.be.undefined;
		});
		it("UTC", (): void => {
			const d = new DateTime(1, TimeZone.utc());
			expect(d.year()).to.equal(1970);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(1);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(1);
			expect(d.zone()).to.equal(TimeZone.utc());
		});
		it("non-utc", (): void => {
			const d = new DateTime(1, TimeZone.zone(240));
			expect(d.year()).to.equal(1970);
			expect(d.month()).to.equal(1);
			expect(d.day()).to.equal(1);
			expect(d.hour()).to.equal(0);
			expect(d.minute()).to.equal(0);
			expect(d.second()).to.equal(0);
			expect(d.millisecond()).to.equal(1);
			expect(d.zone()).to.equal(TimeZone.zone(240));
		});
		it("non-existing", (): void => {
			// non-existing due to DST forward
			const d = new DateTime(index.timeToUnixNoLeapSecs(2014, 3, 30, 2, 0, 0, 0), TimeZone.zone("Europe/Amsterdam"));
			expect(d.hour()).to.equal(3); // should be normalized to 3AM
		});
	});

	describe("clone", (): void => {
		it("should return an object with the same value", (): void => {
			const d: DateTime = new DateTime(2015, 2, 3, 4, 5, 6, 7, TimeZone.zone("+03"));
			expect(d.clone().unixUtcMillis()).to.equal(d.unixUtcMillis());
		});
		it("should return a new object", (): void => {
			const d: DateTime = new DateTime(2015, 2, 3, 4, 5, 6, 7, TimeZone.zone("+03"));
			expect(d.clone() === d).to.equal(false);
		});
	});

	describe("withZone()", (): void => {
		it("should allow changing naive date to aware date", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, undefined);
			const e = d.withZone(TimeZone.zone(1));
			expect(e.equals(new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone(1)))).to.equal(true);
		});
		it("should allow changing aware date to naive date (null)", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone(1));
			const e = d.withZone(null);
			expect(e.equals(new DateTime(2014, 1, 1, 12, 0, 0, 0, undefined))).to.equal(true);
		});
		it("should allow changing aware date to naive date (undefined)", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone(1));
			const e = d.withZone(undefined);
			expect(e.equals(new DateTime(2014, 1, 1, 12, 0, 0, 0, undefined))).to.equal(true);
		});
		it("should allow changing aware date to aware date", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone(1));
			const e = d.withZone(TimeZone.zone("America/Chicago"));
			expect(e.equals(new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone("America/Chicago")))).to.equal(true);
		});
		it("should return a new object", (): void => {
			const d: DateTime = new DateTime(2015, 2, 3, 4, 5, 6, 7, TimeZone.zone("+03"));
			expect(d.withZone(d.zone()) === d).to.equal(false);
		});
	});

	describe("convert()", (): void => {
		it("unaware to aware", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			assert.throws((): void => { d.convert(TimeZone.zone("Europe/Amsterdam")); });
		});
		it("unaware to unaware (null)", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			d.convert(null);
			expect(d.equals(new DateTime(2014, 1, 1, 0, 0, 0, 0))).to.equal(true);
		});
		it("unaware to unaware (undefined)", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			d.convert(undefined);
			expect(d.equals(new DateTime(2014, 1, 1, 0, 0, 0, 0))).to.equal(true);
		});
		it("aware", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone("+01:00"));
			d.convert(TimeZone.zone("-01:00"));
			expect(d.hour()).to.equal(10);
		});
		it("aware to unaware (null)", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone("+01:00"));
			d.convert(null);
			expect(d.equals(new DateTime(2014, 1, 1, 12, 0, 0, 0))).to.equal(true);
		});
		it("aware to unaware (undefined)", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone("+01:00"));
			d.convert(undefined);
			expect(d.equals(new DateTime(2014, 1, 1, 12, 0, 0, 0))).to.equal(true);
		});
	});

	describe("toZone()", (): void => {
		it("unaware to aware", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			assert.throws((): void => { d.toZone(TimeZone.zone("Europe/Amsterdam")); });
		});
		it("unaware to unaware", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			expect(d.equals(d.toZone(undefined))).to.equal(true);
		});
		it("aware", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone("+01:00"));
			const e = d.toZone(TimeZone.zone("-01:00"));
			expect(d.hour()).to.equal(12);
			expect(e.hour()).to.equal(10);
		});
		it("aware to unaware", (): void => {
			const d = new DateTime(2014, 1, 1, 12, 0, 0, 0, TimeZone.zone("+01:00"));
			const e = d.toZone(undefined);
			expect(e.equals(new DateTime(2014, 1, 1, 12, 0, 0, 0))).to.equal(true);
		});
		it("Europe/Amsterdam DST forward to UTC", (): void => {
			let d = new DateTime(2014, 3, 30, 1, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.toZone(TimeZone.utc()).toString()).to.equal("2014-03-30T00:59:59.000 UTC");
			d = new DateTime(2014, 3, 30, 3, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.toZone(TimeZone.utc()).toString()).to.equal("2014-03-30T01:00:00.000 UTC");
		});
		it("Europe/Amsterdam DST forward to UTC (nonexisting)", (): void => {
			const d = new DateTime(2014, 3, 30, 2, 0, 0, 0, TimeZone.zone("Europe/Amsterdam")); // non-existing date
			expect(d.toZone(TimeZone.utc()).toString()).to.equal("2014-03-30T01:00:00.000 UTC");
		});
		it("Europe/Amsterdam DST backward to UTC", (): void => {
			let d = new DateTime(2014, 10, 26, 1, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.toZone(TimeZone.utc()).toString()).to.equal("2014-10-25T23:59:59.000 UTC");
			d = new DateTime(2014, 10, 26, 3, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.toZone(TimeZone.utc()).toString()).to.equal("2014-10-26T02:00:00.000 UTC");
			d = new DateTime(2014, 10, 26, 2, 59, 59, 0, TimeZone.zone("Europe/Amsterdam")); // could mean either of two dates
			expect(d.toZone(TimeZone.utc()).toString()).to.satisfy((s: string): boolean => {
				return (s === "2014-10-26T00:59:59.000 UTC" || s === "2014-10-26T01:59:59.000	 UTC");
			});
		});
		it("Europe/Amsterdam DST forward from UTC", (): void => {
			let d = new DateTime("2014-03-30T00:59:59.000 UTC");
			expect(d.toZone(TimeZone.zone("Europe/Amsterdam")).toString()).to.equal("2014-03-30T01:59:59.000 Europe/Amsterdam");
			d = new DateTime("2014-03-30T01:00:00.000 UTC");
			expect(d.toZone(TimeZone.zone("Europe/Amsterdam")).toString()).to.equal("2014-03-30T03:00:00.000 Europe/Amsterdam");
		});
		it("Europe/Amsterdam DST backward from UTC", (): void => {
			let d = new DateTime("2014-10-25T23:59:59.000 UTC");
			expect(d.toZone(TimeZone.zone("Europe/Amsterdam")).toString()).to.equal("2014-10-26T01:59:59.000 Europe/Amsterdam");
			d = new DateTime("2014-10-26T02:00:00.000 UTC");
			expect(d.toZone(TimeZone.zone("Europe/Amsterdam")).toString()).to.equal("2014-10-26T03:00:00.000 Europe/Amsterdam");
			d = new DateTime("2014-10-26T00:59:59.000 UTC");
			expect(d.toZone(TimeZone.zone("Europe/Amsterdam")).toString()).to.equal("2014-10-26T02:59:59.000 Europe/Amsterdam");
			d = new DateTime("2014-10-26T01:59:59.000 UTC");
			expect(d.toZone(TimeZone.zone("Europe/Amsterdam")).toString()).to.equal("2014-10-26T02:59:59.000 Europe/Amsterdam");
		});
		it("maintains UTC through conversions", (): void => {
			// expect UTC to be maintained through conversions in the presence of DST switch
			let d: DateTime = (new DateTime(2014, 10, 26, 0, 0, 0, 0, TimeZone.utc())).toZone(
				TimeZone.zone("Europe/Amsterdam")).toZone(TimeZone.utc());
			expect(d.toString()).to.equal("2014-10-26T00:00:00.000 UTC");
			d = (new DateTime(2014, 10, 26, 1, 0, 0, 0, TimeZone.utc())).toZone(TimeZone.zone("Europe/Amsterdam")).toZone(TimeZone.utc());
			expect(d.toString()).to.equal("2014-10-26T01:00:00.000 UTC");
			d = (new DateTime(2014, 10, 26, 2, 0, 0, 0, TimeZone.utc())).toZone(TimeZone.zone("Europe/Amsterdam")).toZone(TimeZone.utc());
			expect(d.toString()).to.equal("2014-10-26T02:00:00.000 UTC");
		});

	});

	describe("toDate()", (): void => {
		it("unaware", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			const date = d.toDate();
			expect(date.getFullYear()).to.equal(2014);
			expect(date.getMonth()).to.equal(0);
			expect(date.getDate()).to.equal(1);
			expect(date.getHours()).to.equal(0);
			expect(date.getMinutes()).to.equal(0);
			expect(date.getSeconds()).to.equal(0);
			expect(date.getMilliseconds()).to.equal(0);
		});
		it("aware", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("+01:00"));
			const date = d.toDate();
			expect(date.getFullYear()).to.equal(2014);
			expect(date.getMonth()).to.equal(0);
			expect(date.getDate()).to.equal(1);
			expect(date.getHours()).to.equal(0);
			expect(date.getMinutes()).to.equal(0);
			expect(date.getSeconds()).to.equal(0);
			expect(date.getMilliseconds()).to.equal(0);
		});
	});

	// todo check normalization
	describe("add(duration)", (): void => {
		it("should add zero", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			const e = d.add(Duration.hours(0));
			expect(d.toString()).to.equal(e.toString());
		});
		it("should add positive value", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			const e = d.add(Duration.hours(1));
			expect(d.hour()).to.equal(0);
			expect(e.hour()).to.equal(1);
		});
		it("should add negative value", (): void => {
			const d = new DateTime(2014, 1, 1, 1, 0, 0, 0);
			const e = d.add(Duration.hours(-1));
			expect(d.hour()).to.equal(1);
			expect(e.hour()).to.equal(0);
		});
		it("should account for DST forward", (): void => {
			const d = new DateTime(2014, 3, 30, 1, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(Duration.hours(1));
			expect(e.toString()).to.equal("2014-03-30T03:59:59.000 Europe/Amsterdam");
		});
		it("should account for DST forward (2)", (): void => {
			const d = new DateTime(2014, 3, 30, 1, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(Duration.hours(1));
			expect(e.toString()).to.equal("2014-03-30T03:00:00.000 Europe/Amsterdam");
		});
		it("should account for DST backward", (): void => {
			// the conversion to UTC for this date is not well-defined, could mean either
			// the first 02:59:59 or the second one of that day
			const d = new DateTime(2014, 10, 26, 2, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(Duration.hours(1));
			expect(e.toString()).to.satisfy((s: string): boolean => {
				return (s === "2014-10-26T02:59:59.000 Europe/Amsterdam" || s === "2014-10-26T03:59:59.000 Europe/Amsterdam");
			});
		});
	});

	describe("add(amount, unit)", (): void => {
		it("should add 0", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.add(0, TimeUnit.Millisecond).toString()).to.equal(d.toString());
			expect(d.add(0, TimeUnit.Second).toString()).to.equal(d.toString());
			expect(d.add(0, TimeUnit.Minute).toString()).to.equal(d.toString());
			expect(d.add(0, TimeUnit.Hour).toString()).to.equal(d.toString());
			expect(d.add(0, TimeUnit.Day).toString()).to.equal(d.toString());
			expect(d.add(0, TimeUnit.Week).toString()).to.equal(d.toString());
			expect(d.add(0, TimeUnit.Month).toString()).to.equal(d.toString());
			expect(d.add(0, TimeUnit.Year).toString()).to.equal(d.toString());
		});
		it("should add milliseconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(23, TimeUnit.Millisecond);
			expect(e.toString()).to.equal("2014-01-01T00:00:00.023 Europe/Amsterdam");
		});
		it("should add more than 1000 milliseconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(1001, TimeUnit.Millisecond);
			expect(e.toString()).to.equal("2014-01-01T00:00:01.001 Europe/Amsterdam");
		});
		it("should add seconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(23, TimeUnit.Second);
			expect(e.toString()).to.equal("2014-01-01T00:00:23.000 Europe/Amsterdam");
		});
		it("should add fractional seconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(23.5, TimeUnit.Second);
			expect(e.toString()).to.equal("2014-01-01T00:00:23.500 Europe/Amsterdam");
		});
		it("should add more than 60 seconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(61, TimeUnit.Second);
			expect(e.toString()).to.equal("2014-01-01T00:01:01.000 Europe/Amsterdam");
		});
		it("should add minutes", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(23, TimeUnit.Minute);
			expect(e.toString()).to.equal("2014-01-01T00:23:00.000 Europe/Amsterdam");
		});
		it("should add more than 60 minutes", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(61, TimeUnit.Minute);
			expect(e.toString()).to.equal("2014-01-01T01:01:00.000 Europe/Amsterdam");
		});
		it("should add hours", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(23, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-01-01T23:00:00.000 Europe/Amsterdam");
		});
		it("should add more than 24 hours", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(25, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-01-02T01:00:00.000 Europe/Amsterdam");
		});
		it("should add days", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(23, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-01-24T00:00:00.000 Europe/Amsterdam");
		});
		it("should add more than 30 days", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(31, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-02-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should add weeks", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(2, TimeUnit.Week);
			expect(e.toString()).to.equal("2014-01-15T00:00:00.000 Europe/Amsterdam");
		});
		it("should add months", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(2, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-03-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should throw on adding fractional months", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			assert.throws((): void => {
				d.add(2.1, TimeUnit.Month);
			});
		});
		it("should add months across year boundary", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(12, TimeUnit.Month);
			expect(e.toString()).to.equal("2015-01-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should add years", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(2, TimeUnit.Year);
			expect(e.toString()).to.equal("2016-01-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should throw on adding fractional years", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			assert.throws((): void => {
				d.add(2.1, TimeUnit.Year);
			});
		});
		it("should add negative numbers", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(-2, TimeUnit.Day);
			expect(e.toString()).to.equal("2013-12-30T00:00:00.000 Europe/Amsterdam");
		});
		it("should add to unaware", (): void => {
			const d = new DateTime(2014, 3, 30, 1, 59, 59, 0, undefined);
			const e = d.add(1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-03-30T02:59:59.000");
		});
		it("should add to UTC", (): void => {
			const d = new DateTime(2014, 3, 30, 1, 59, 59, 0, TimeZone.utc());
			const e = d.add(1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-03-30T02:59:59.000 UTC");
		});
		it("should account for DST forward", (): void => {
			const d = new DateTime(2014, 3, 30, 1, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-03-30T03:59:59.000 Europe/Amsterdam");
		});
		it("should account for DST backward", (): void => {
			// this could mean either of two UTC times
			const d = new DateTime(2014, 10, 26, 2, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(1, TimeUnit.Hour);
			expect(e.toString()).to.satisfy((s: string): boolean => {
				return (s === "2014-10-26T02:59:59.000 Europe/Amsterdam" || s === "2014-10-26T03:59:59.000 Europe/Amsterdam");
			});
		});
		it("should keep incrementing UTC even if local time does not increase", (): void => {
			// check that UTC moves forward even though local date is not deterministic
			let d = (new DateTime(2014, 10, 26, 0, 0, 0, 0, TimeZone.zone("UTC"))).toZone(TimeZone.zone("Europe/Amsterdam"));
			expect(d.add(1, TimeUnit.Hour).toZone(TimeZone.utc()).toString()).to.equal("2014-10-26T01:00:00.000 UTC");

			d = (new DateTime(2014, 10, 26, 1, 0, 0, 0, TimeZone.zone("UTC"))).toZone(TimeZone.zone("Europe/Amsterdam"));
			expect(d.add(1, TimeUnit.Hour).toZone(TimeZone.utc()).toString()).to.equal("2014-10-26T02:00:00.000 UTC");
		});
		it("should shift local time when adding days across DST fw", (): void => {
			const d = new DateTime(2014, 3, 29, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(1, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-03-30T09:00:00.000 Europe/Amsterdam");
		});
		it("should shift local time when adding days across DST bw", (): void => {
			const d = new DateTime(2014, 10, 25, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(1, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-10-26T07:00:00.000 Europe/Amsterdam");
		});
		it("should shift local time when adding negative days across DST fw", (): void => {
			const d = new DateTime(2014, 3, 30, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(-1, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-03-29T07:00:00.000 Europe/Amsterdam");
		});
		it("should shift local time when adding negative days across DST bw", (): void => {
			const d = new DateTime(2014, 10, 26, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(-1, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-10-25T09:00:00.000 Europe/Amsterdam");
		});
		it("should keep local time when adding year across 2 DSTs", (): void => {
			const d = new DateTime(2014, 1, 29, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(1, TimeUnit.Year);
			expect(e.toString()).to.equal("2015-01-29T08:00:00.000 Europe/Amsterdam");
		});
		it("should keep local time when adding negative year across 2 DSTs", (): void => {
			const d = new DateTime(2014, 1, 29, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(-1, TimeUnit.Year);
			expect(e.toString()).to.equal("2013-01-29T08:00:00.000 Europe/Amsterdam");
		});
		it("should shift local time when adding year across 1 DSTs", (): void => {
			const d = new DateTime(2014, 3, 29, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.add(1, TimeUnit.Year); // note in 2015 DST shift is on march 29 iso march 30
			expect(e.toString()).to.equal("2015-03-29T09:00:00.000 Europe/Amsterdam");
		});
		it("should shift local time when adding month across 1 DST", (): void => {
			let d = new DateTime(2014, 3, 3, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			let e = d.add(1, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-04-03T09:00:00.000 Europe/Amsterdam");
			d = new DateTime(2014, 9, 26, 3, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			e = d.add(1, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-10-26T02:00:00.000 Europe/Amsterdam");
		});
		it("should shift remote zone time when adding month across 1 DST", (): void => {
			const d = new DateTime(2014, 3, 3, 8, 0, 0, 0, TimeZone.zone("Asia/Gaza"));
			const e = d.add(1, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-04-03T09:00:00.000 Asia/Gaza");
		});
		it("should not shift remote zone time when adding month across 1 local DST ", (): void => {
			// this is already in summer time Gaza but winter time Europe/Amsterdam
			const d = new DateTime(2014, 3, 29, 8, 0, 0, 0, TimeZone.zone("Asia/Gaza"));
			const e = d.add(1, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-04-29T08:00:00.000 Asia/Gaza");
		});
	});

	describe("addLocal()", (): void => {
		it("should work with a Duration object", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(Duration.minutes(23));
			expect(e.toString()).to.equal("2014-01-01T00:23:00.000 Europe/Amsterdam");
		});
		it("should add 0", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.addLocal(0, TimeUnit.Millisecond).toString()).to.equal(d.toString());
			expect(d.addLocal(0, TimeUnit.Second).toString()).to.equal(d.toString());
			expect(d.addLocal(0, TimeUnit.Minute).toString()).to.equal(d.toString());
			expect(d.addLocal(0, TimeUnit.Hour).toString()).to.equal(d.toString());
			expect(d.addLocal(0, TimeUnit.Day).toString()).to.equal(d.toString());
			expect(d.addLocal(0, TimeUnit.Week).toString()).to.equal(d.toString());
			expect(d.addLocal(0, TimeUnit.Month).toString()).to.equal(d.toString());
			expect(d.addLocal(0, TimeUnit.Year).toString()).to.equal(d.toString());
		});
		it("should add milliseconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(23, TimeUnit.Millisecond);
			expect(e.toString()).to.equal("2014-01-01T00:00:00.023 Europe/Amsterdam");
		});
		it("should add more than 1000 milliseconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1001, TimeUnit.Millisecond);
			expect(e.toString()).to.equal("2014-01-01T00:00:01.001 Europe/Amsterdam");
		});
		it("should add seconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(23, TimeUnit.Second);
			expect(e.toString()).to.equal("2014-01-01T00:00:23.000 Europe/Amsterdam");
		});
		it("should add more than 60 seconds", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(61, TimeUnit.Second);
			expect(e.toString()).to.equal("2014-01-01T00:01:01.000 Europe/Amsterdam");
		});
		it("should add minutes", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(23, TimeUnit.Minute);
			expect(e.toString()).to.equal("2014-01-01T00:23:00.000 Europe/Amsterdam");
		});
		it("should add more than 60 minutes", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(61, TimeUnit.Minute);
			expect(e.toString()).to.equal("2014-01-01T01:01:00.000 Europe/Amsterdam");
		});
		it("should add hours", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(23, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-01-01T23:00:00.000 Europe/Amsterdam");
		});
		it("should add more than 24 hours", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(25, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-01-02T01:00:00.000 Europe/Amsterdam");
		});
		it("should add days", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(23, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-01-24T00:00:00.000 Europe/Amsterdam");
		});
		it("should add more than 30 days", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(31, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-02-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should add weeks", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(2, TimeUnit.Week);
			expect(e.toString()).to.equal("2014-01-15T00:00:00.000 Europe/Amsterdam");
		});
		it("should add months", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(2, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-03-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should clamp end-of-month", (): void => {
			const d = new DateTime(2014, 1, 31, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-02-28T00:00:00.000 Europe/Amsterdam");
		});
		it("should clamp end-of-month (leap year)", (): void => {
			const d = new DateTime(2004, 1, 31, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1, TimeUnit.Month);
			expect(e.toString()).to.equal("2004-02-29T00:00:00.000 Europe/Amsterdam");
		});
		it("should add months across year boundary", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(12, TimeUnit.Month);
			expect(e.toString()).to.equal("2015-01-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should add years", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(2, TimeUnit.Year);
			expect(e.toString()).to.equal("2016-01-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should clamp end-of-month (leap year)", (): void => {
			const d = new DateTime(2004, 2, 29, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1, TimeUnit.Year);
			expect(e.toString()).to.equal("2005-02-28T00:00:00.000 Europe/Amsterdam");
		});
		it("should add negative numbers", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(-2, TimeUnit.Day);
			expect(e.toString()).to.equal("2013-12-30T00:00:00.000 Europe/Amsterdam");
		});
		it("should add to unaware", (): void => {
			const d = new DateTime(2014, 3, 30, 1, 59, 59, 0, undefined);
			const e = d.addLocal(1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-03-30T02:59:59.000");
		});
		it("should add to UTC", (): void => {
			const d = new DateTime(2014, 3, 30, 1, 59, 59, 0, TimeZone.utc());
			const e = d.addLocal(1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-03-30T02:59:59.000 UTC");
		});
		it("should account for DST forward", (): void => {
			const d = new DateTime(2014, 3, 30, 1, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-03-30T03:59:59.000 Europe/Amsterdam");
		});
		it("should account for DST forward, -1", (): void => {
			// it should skip over 02:59 since that does not exist
			const d = new DateTime(2014, 3, 30, 3, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(-1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-03-30T01:59:59.000 Europe/Amsterdam");
		});
		it("should account for DST backward", (): void => {
			// this could mean either of two UTC times
			const d = new DateTime(2014, 10, 26, 2, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			// but addLocal should increment the local hour field regardless
			let e = d.addLocal(1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-10-26T03:59:59.000 Europe/Amsterdam");
			// similar with subtraction: local hour field should decrease
			e = d.addLocal(-1, TimeUnit.Hour);
			expect(e.toString()).to.equal("2014-10-26T01:59:59.000 Europe/Amsterdam");
		});
		it("should keep local time same when adding days across DST fw", (): void => {
			const d = new DateTime(2014, 3, 29, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-03-30T08:00:00.000 Europe/Amsterdam");
		});
		it("should keep local time same when adding days across DST bw", (): void => {
			const d = new DateTime(2014, 10, 25, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-10-26T08:00:00.000 Europe/Amsterdam");
		});
		it("should keep local time same when adding negative days across DST fw", (): void => {
			const d = new DateTime(2014, 3, 30, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(-1, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-03-29T08:00:00.000 Europe/Amsterdam");
		});
		it("should keep local time same when adding negative days across DST bw", (): void => {
			const d = new DateTime(2014, 10, 26, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(-1, TimeUnit.Day);
			expect(e.toString()).to.equal("2014-10-25T08:00:00.000 Europe/Amsterdam");
		});
		it("should keep local time same when adding year across 2 DSTs", (): void => {
			const d = new DateTime(2014, 3, 29, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1, TimeUnit.Year);
			expect(e.toString()).to.equal("2015-03-29T08:00:00.000 Europe/Amsterdam");
		});
		it("should keep local time same when adding negative year across 2 DSTs", (): void => {
			const d = new DateTime(2014, 3, 29, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(-1, TimeUnit.Year);
			expect(e.toString()).to.equal("2013-03-29T08:00:00.000 Europe/Amsterdam");
		});
		it("should keep local time when adding month across 1 DST", (): void => {
			const d = new DateTime(2014, 3, 3, 8, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.addLocal(1, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-04-03T08:00:00.000 Europe/Amsterdam");
		});
	});

	describe("subLocal()", (): void => {
		// this calls addLocal(-duration) so we rely on the addLocal tests
		it("should work with a Duration object", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.subLocal(Duration.minutes(-23));
			expect(e.toString()).to.equal("2014-01-01T00:23:00.000 Europe/Amsterdam");
		});
		it("should work with amount & unit", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.subLocal(-23, TimeUnit.Minute);
			expect(e.toString()).to.equal("2014-01-01T00:23:00.000 Europe/Amsterdam");
		});
	});

	describe("sub(Duration)", (): void => {
		it("should subtract zero", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			const e = d.sub(Duration.hours(0));
			expect(d.toString()).to.equal(e.toString());
		});
		it("should sub positive value", (): void => {
			const d = new DateTime(2014, 1, 1, 1, 0, 0, 0);
			const e = d.sub(Duration.hours(1));
			expect(d.hour()).to.equal(1);
			expect(e.hour()).to.equal(0);
		});
		it("should sub negative value", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			const e = d.sub(Duration.hours(-1));
			expect(d.hour()).to.equal(0);
			expect(e.hour()).to.equal(1);
		});
		it("should sub value in presence of time zone", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0, TimeZone.zone(3));
			const e = d.sub(Duration.hours(1));
			expect(d.hour()).to.equal(0);
			expect(e.hour()).to.equal(23);
			expect(e.day()).to.equal(31);
		});
	});

	describe("sub(amount, unit)", (): void => {
		// not thoroughly tested since implementation is routed to add(-amount, unit)
		it("should account for DST forward", (): void => {
			const d = new DateTime(2014, 3, 30, 3, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.toZone(TimeZone.utc()).toString()).to.equal("2014-03-30T01:59:59.000 UTC");
			const e = d.sub(1, TimeUnit.Hour);
			expect(e.toZone(TimeZone.utc()).toString()).to.equal("2014-03-30T00:59:59.000 UTC");
			expect(e.toString()).to.equal("2014-03-30T01:59:59.000 Europe/Amsterdam");
		});
		it("should account for DST backward", (): void => {
			const d = new DateTime(2014, 10, 26, 2, 59, 59, 0, TimeZone.zone("Europe/Amsterdam"));
			const e = d.sub(1, TimeUnit.Hour);
			expect(e.toString()).to.satisfy((s: string): boolean => {
				return (s === "2014-10-26T02:59:59.000 Europe/Amsterdam" || s === "2014-10-26T01:59:59.000 Europe/Amsterdam");
			});
		});
		it("should keep decrementing UTC even if local time does not decrease", (): void => {
			// check that UTC moves forward even though local date is not deterministic
			let d = (new DateTime(2014, 10, 26, 1, 0, 0, 0, TimeZone.zone("UTC"))).toZone(TimeZone.zone("Europe/Amsterdam"));
			expect(d.sub(1, TimeUnit.Hour).toZone(TimeZone.utc()).toString()).to.equal("2014-10-26T00:00:00.000 UTC");

			d = (new DateTime(2014, 10, 26, 2, 0, 0, 0, TimeZone.zone("UTC"))).toZone(TimeZone.zone("Europe/Amsterdam"));
			expect(d.sub(1, TimeUnit.Hour).toZone(TimeZone.utc()).toString()).to.equal("2014-10-26T01:00:00.000 UTC");
		});
		it("should handle subtracting from january", (): void => {
			const d = new DateTime(2014, 1, 15, 0, 0, 0, 0, TimeZone.zone("UTC"));
			const e = d.sub(1, TimeUnit.Month);
			expect(e.toString()).to.equal("2013-12-15T00:00:00.000 UTC");
		});
		it("should handle adding to december", (): void => {
			const d = new DateTime(2013, 12, 15, 0, 0, 0, 0, TimeZone.zone("UTC"));
			const e = d.sub(-1, TimeUnit.Month);
			expect(e.toString()).to.equal("2014-01-15T00:00:00.000 UTC");
		});
		it("should handle adding more than a year in months", (): void => {
			const d = new DateTime(2013, 9, 15, 0, 0, 0, 0, TimeZone.zone("UTC"));
			const e = d.sub(-24, TimeUnit.Month);
			expect(e.toString()).to.equal("2015-09-15T00:00:00.000 UTC");
		});
		it("should handle subtracting more than a year in months", (): void => {
			const d = new DateTime(2013, 9, 15, 0, 0, 0, 0, TimeZone.zone("UTC"));
			const e = d.sub(24, TimeUnit.Month);
			expect(e.toString()).to.equal("2011-09-15T00:00:00.000 UTC");
		});
	});

	describe("diff()", (): void => {
		it("should diff identical dates zero", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 0, 0);
			const diff = d.diff(d);
			expect(diff.milliseconds()).to.equal(0);
		});
		it("should diff positive value", (): void => {
			const d = new DateTime(2014, 1, 1, 1, 0, 0, 0);
			const diff = d.diff(new DateTime(2014, 1, 1, 2, 0, 0, 0));
			expect(diff.milliseconds()).to.equal(Duration.hours(-1).milliseconds());
		});
		it("should diff negative value", (): void => {
			const d = new DateTime(2014, 1, 1, 1, 0, 0, 0);
			const diff = d.diff(new DateTime(2014, 1, 1, 0, 0, 0, 0));
			expect(diff.milliseconds()).to.equal(Duration.hours(1).milliseconds());
		});
		it("should diff across time zones", (): void => {
			const d = new DateTime(2014, 1, 1, 1, 0, 0, 0, TimeZone.zone("+0100"));
			const e = new DateTime(2014, 1, 1, 1, 0, 0, 0, TimeZone.zone("-0100"));
			const diff = d.diff(e);
			expect(diff.milliseconds()).to.equal(Duration.hours(-2).milliseconds());
		});
	});

	describe("startOfDay()", (): void => {
		it("should work for a date with a zone", (): void => {
			expect((new DateTime(2014, 1, 1, 23, 59, 59, 999, TimeZone.zone("Europe/Amsterdam")))
				.startOfDay().toString()).to.equal("2014-01-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should work for a date without a zone", (): void => {
			expect((new DateTime(2014, 1, 24, 23, 59, 59, 999)).startOfDay().toString()).to.equal("2014-01-24T00:00:00.000");
		});
		it("should work for already truncated date", (): void => {
			expect((new DateTime(2014, 1, 1)).startOfDay().toString()).to.equal("2014-01-01T00:00:00.000");
		});
		it("should return a fresh clone", (): void => {
			const d = new DateTime(2014, 1, 1);
			expect(d.startOfDay()).not.to.equal(d);
		});
	});

	describe("startOfMonth()", (): void => {
		it("should work for a date with a zone", (): void => {
			expect((new DateTime(2014, 1, 31, 23, 59, 59, 999, TimeZone.zone("Europe/Amsterdam")))
				.startOfMonth().toString()).to.equal("2014-01-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should work for a date without a zone", (): void => {
			expect((new DateTime(2014, 1, 24, 23, 59, 59, 999)).startOfMonth().toString()).to.equal("2014-01-01T00:00:00.000");
		});
		it("should work for already truncated date", (): void => {
			expect((new DateTime(2014, 1, 1)).startOfMonth().toString()).to.equal("2014-01-01T00:00:00.000");
		});
		it("should return a fresh clone", (): void => {
			const d = new DateTime(2014, 1, 1);
			expect(d.startOfMonth()).not.to.equal(d);
		});
	});

	describe("startOfYear()", (): void => {
		it("should work for a date with a zone", (): void => {
			expect((new DateTime(2014, 2, 28, 23, 59, 59, 999, TimeZone.zone("Europe/Amsterdam")))
				.startOfYear().toString()).to.equal("2014-01-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should work for a date without a zone", (): void => {
			expect((new DateTime(2014, 2, 24, 23, 59, 59, 999)).startOfYear().toString()).to.equal("2014-01-01T00:00:00.000");
		});
		it("should work for already truncated date", (): void => {
			expect((new DateTime(2014, 1, 1)).startOfYear().toString()).to.equal("2014-01-01T00:00:00.000");
		});
		it("should return a fresh clone", (): void => {
			const d = new DateTime(2014, 1, 1);
			expect(d.startOfYear()).not.to.equal(d);
		});
	});

	describe("lessThan()", (): void => {
		it("should return true for a greater other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").lessThan(new DateTime("2014-02-02T02:02:02.003"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+01").lessThan(new DateTime("2014-02-02T02:02:03.002+01"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+01").lessThan(new DateTime("2014-02-02T02:02:02.002+00"))).to.equal(true);
		});
		it("should return false for an equal other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").lessThan(new DateTime("2014-02-02T02:02:02.002"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+01").lessThan(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002 Europe/Amsterdam").lessThan(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
		});
		it("should return false for a lesser other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.003").lessThan(new DateTime("2014-02-02T02:02:02.002"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:03.002+01").lessThan(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+00").lessThan(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
		});
	});

	describe("lessEqual()", (): void => {
		it("should return true for a greater other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").lessEqual(new DateTime("2014-02-02T02:02:02.003"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+01").lessEqual(new DateTime("2014-02-02T02:02:03.002+01"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+01").lessEqual(new DateTime("2014-02-02T02:02:02.002+00"))).to.equal(true);
		});
		it("should return true for an equal other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").lessEqual(new DateTime("2014-02-02T02:02:02.002"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+01").lessEqual(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002 Europe/Amsterdam").lessEqual(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
		});
		it("should return false for a lesser other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.003").lessEqual(new DateTime("2014-02-02T02:02:02.002"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:03.002+01").lessEqual(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+00").lessEqual(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
		});
	});

	describe("equals()", (): void => {
		it("should return false for a greater other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").equals(new DateTime("2014-02-02T02:02:02.003"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+01").equals(new DateTime("2014-02-02T02:02:03.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+01").equals(new DateTime("2014-02-02T02:02:02.002+00"))).to.equal(false);
		});
		it("should return true for an equal other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").equals(new DateTime("2014-02-02T02:02:02.002"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+01").equals(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002 Europe/Amsterdam").equals(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
		});
		it("should return false for a lesser other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.003").equals(new DateTime("2014-02-02T02:02:02.002"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:03.002+01").equals(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+00").equals(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
		});
	});

	describe("identical()", (): void => {
		it("should return false if time zone differs", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").identical(new DateTime("2014-02-02T02:02:02.002+01:00"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+02:00").identical(new DateTime("2014-02-02T03:02:02.002+01:00"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002 Europe/Amsterdam").identical(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002 GMT").identical(new DateTime("2014-02-02T02:02:02.002 UTC"))).to.equal(false);
		});
		it("should return true for an identical other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").identical(new DateTime("2014-02-02T02:02:02.002"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+01").identical(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
		});
		it("should return false if time zones are not identical but equal", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002+00:00").identical(new DateTime("2014-02-02T02:02:02.002 UTC"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002 GMT").identical(new DateTime("2014-02-02T02:02:02.002 UTC"))).to.equal(false);
		});
	});

	describe("greaterThan()", (): void => {
		it("should return false for a greater other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").greaterThan(new DateTime("2014-02-02T02:02:02.003"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+01").greaterThan(new DateTime("2014-02-02T02:02:03.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+01").greaterThan(new DateTime("2014-02-02T02:02:02.002+00"))).to.equal(false);
		});
		it("should return false for an equal other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").greaterThan(new DateTime("2014-02-02T02:02:02.002"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+01").greaterThan(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002 Europe/Amsterdam")
				.greaterThan(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(false);
		});
		it("should return true for a lesser other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.003").greaterThan(new DateTime("2014-02-02T02:02:02.002"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:03.002+01").greaterThan(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+00").greaterThan(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
		});
	});

	describe("greaterEqual()", (): void => {
		it("should return false for a greater other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002").greaterEqual(new DateTime("2014-02-02T02:02:02.003"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+01").greaterEqual(new DateTime("2014-02-02T02:02:03.002+01"))).to.equal(false);
			expect(new DateTime("2014-02-02T02:02:02.002+01").greaterEqual(new DateTime("2014-02-02T02:02:02.002+00"))).to.equal(false);
		});
		it("should return true for an equal other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.002")
				.greaterEqual(new DateTime("2014-02-02T02:02:02.002"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+01")
				.greaterEqual(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002 Europe/Amsterdam")
				.greaterEqual(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
		});
		it("should return true for a lesser other", (): void => {
			expect(new DateTime("2014-02-02T02:02:02.003").greaterEqual(new DateTime("2014-02-02T02:02:02.002"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:03.002+01").greaterEqual(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
			expect(new DateTime("2014-02-02T02:02:02.002+00").greaterEqual(new DateTime("2014-02-02T02:02:02.002+01"))).to.equal(true);
		});
	});

	describe("min()", (): void => {
		it("should return a value equal to this if this is smaller", (): void => {
			expect(new DateTime(1).min(new DateTime(2)).unixUtcMillis()).to.equal(1);
		});
		it("should any of the values if they are equal", (): void => {
			expect(new DateTime(2).min(new DateTime(2)).unixUtcMillis()).to.equal(2);
		});
		it("should the other value if it is smaller", (): void => {
			expect(new DateTime(2).min(new DateTime(1)).unixUtcMillis()).to.equal(1);
		});
	});

	describe("max()", (): void => {
		it("should return a value equal to other if this is smaller", (): void => {
			expect(new DateTime(1).max(new DateTime(2)).unixUtcMillis()).to.equal(2);
		});
		it("should any of the values if they are equal", (): void => {
			expect(new DateTime(2).max(new DateTime(2)).unixUtcMillis()).to.equal(2);
		});
		it("should this value if this is greater", (): void => {
			expect(new DateTime(2).max(new DateTime(1)).unixUtcMillis()).to.equal(2);
		});
	});

	describe("toIsoString()", (): void => {
		it("should work for unaware date", (): void => {
			expect((new DateTime("2014-02-03T05:06:07.008")).toIsoString()).to.equal("2014-02-03T05:06:07.008");
		});
		it("should work for proper timezone", (): void => {
			expect((new DateTime("2014-02-03T05:06:07.008 Europe/Amsterdam")).toIsoString()).to.equal("2014-02-03T05:06:07.008+01:00");
		});
		it("should work for offset timezone", (): void => {
			expect((new DateTime("2014-02-03T05:06:07.008+02:00")).toIsoString()).to.equal("2014-02-03T05:06:07.008+02:00");
		});
		it("should work for local timezone", (): void => {
			expect((new DateTime("2014-02-03T05:06:07.008 localtime")).toIsoString()).to.equal(
				"2014-02-03T05:06:07.008" + TimeZone.offsetToString(TimeZone.local().offsetForZone(2014, 2, 3, 5, 6, 7, 8)));
		});
	});

	describe("toUtcString()", (): void => {
		it("should work for unaware date", (): void => {
			expect((new DateTime("2014-02-03T05:06:07.008")).toUtcString()).to.equal("2014-02-03T05:06:07.008");
		});
		it("should work for offset zone", (): void => {
			expect((new DateTime("2014-02-03T05:06:07.008+01")).toUtcString()).to.equal("2014-02-03T04:06:07.008");
		});
		it("should work for proper zone", (): void => {
			expect((new DateTime("2014-02-03T05:06:07.008 Europe/Amsterdam")).toUtcString()).to.equal("2014-02-03T04:06:07.008");
		});
	});

	describe("valueOf()", (): void => {
		it("should work", (): void => {
			expect((new DateTime("2014-02-03T05:06:07.008")).valueOf()).to.equal(
				(new DateTime("2014-02-03T05:06:07.008")).unixUtcMillis());
		});
	});

	describe("weekDay()", (): void => {
		it("should return a local week day", (): void => {
			expect(new DateTime("2014-07-07T00:00:00.00 Europe/Amsterdam").weekDay()).to.equal(WeekDay.Monday);
			expect(new DateTime("2014-07-07T23:59:59.999 Europe/Amsterdam").weekDay()).to.equal(WeekDay.Monday);
		});
	});

	describe("utcWeekDay()", (): void => {
		it("should return a UTC week day", (): void => {
			expect(new DateTime("2014-07-07T00:00:00.00 Europe/Amsterdam").utcWeekDay()).to.equal(WeekDay.Sunday);
		});
	});

	describe("dayOfYear()", (): void => {
		it("should return a local dayOfYear", (): void => {
			expect(new DateTime("2014-01-01T00:00:00.00 Europe/Amsterdam").dayOfYear()).to.equal(0);
			expect(new DateTime("2014-12-31T23:59:59.999 Europe/Amsterdam").dayOfYear()).to.equal(364);
		});
	});

	describe("utcDayOfYear()", (): void => {
		it("should return a UTC week day", (): void => {
			// note this is still january 1st in utc
			expect(new DateTime("2014-01-02T00:00:00.00 Europe/Amsterdam").utcDayOfYear()).to.equal(0);
		});
	});

	describe("weekNumber()", (): void => {
		// note already thoroughly tested in index.weekDay()
		it("should work on local date", (): void => {
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0, TimeZone.zone(60));
			expect(d.weekNumber()).to.equal(22);
		});
	});

	describe("utcWeekNumber()", (): void => {
		// note already thoroughly tested in index.weekDay()
		it("should work on utc date", (): void => {
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0, TimeZone.zone(60));
			expect(d.utcWeekNumber()).to.equal(21);
		});
	});

	describe("weekOfMonth()", (): void => {
		// note already thoroughly tested in index.weekOfMonth()
		it("should work", (): void => {
			const d = new DateTime(2014, 8, 11, 0, 0, 0, 0, TimeZone.zone(60));
			expect(d.weekOfMonth()).to.equal(2);
		});
	});

	describe("utcWeekOfMonth()", (): void => {
		// note already thoroughly tested in index.weekOfMonth()
		it("should work", (): void => {
			const d = new DateTime(2014, 8, 11, 0, 0, 0, 0, TimeZone.zone(60));
			expect(d.utcWeekOfMonth()).to.equal(1);
		});
	});

	describe("secondOfDay()", (): void => {
		// note already thoroughly tested in index.secondOfDay()
		it("should work", (): void => {
			const d = new DateTime(2014, 1, 1, 0, 0, 3, 0, TimeZone.zone(60));
			expect(d.secondOfDay()).to.equal(3);
		});
	});

	describe("utcSecondOfDay()", (): void => {
		// note already thoroughly tested in index.secondOfDay()
		it("should work", (): void => {
			const d = new DateTime(2014, 1, 1, 1, 0, 0, 0, TimeZone.zone(60));
			expect(d.utcSecondOfDay()).to.equal(0);
		});
	});

	describe("zoneAbbreviation()", (): void => {
		it("should return nothing for naive date", (): void => {
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0);
			expect(d.zoneAbbreviation()).to.equal("");
		});
		it("should return the zone abbrev for aware date", (): void => {
			// note already tested in test-tz-database
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.zoneAbbreviation()).to.equal("CEST");
		});
		it("should allow to remove the DST flag", (): void => {
			// note already tested in test-tz-database
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.zoneAbbreviation(false)).to.equal("CET"); // instead of CEST
		});
	});

	describe("format()", (): void => {
		it("should format to a user-defined string", (): void => {
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0, TimeZone.zone("Europe/Amsterdam"));
			expect(d.format("dd/MM/yyyy HH:mm:ss")).to.equal("26/05/2014 00:30:00");
		});
		it("should not care about undefined time zone", (): void => {
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0, undefined);
			expect(d.format("dd/MM/yyyy HH:mm:ss VV")).to.equal("26/05/2014 00:30:00");
		});
		it("should add defined time zone", (): void => {
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0, TimeZone.zone("America/Chicago"));
			expect(d.format("dd/MM/yyyy HH:mm:ss VV")).to.equal("26/05/2014 00:30:00 America/Chicago");
		});
		it("should use given format options", (): void => {
			const d = new DateTime(2014, 5, 26, 0, 30, 0, 0, TimeZone.zone("America/Chicago"));
			expect(d.format("MMM", {
				shortMonthNames: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
			})).to.equal("E");
		});
	});

	describe("parse()", (): void => {
		it("should parse a date string", (): void => {
			const dt = DateTime.parse("2017-11-01", "yyyy-MM-dd");
			expect(dt.toString()).to.equal("2017-11-01T00:00:00.000");
		});
		it("should parse a date string and add a zone", (): void => {
			const dt = DateTime.parse("2017-11-01", "yyyy-MM-dd", TimeZone.zone("Europe/Amsterdam"));
			expect(dt.toString()).to.equal("2017-11-01T00:00:00.000 Europe/Amsterdam");
		});
		it("should throw on invalid date string", (): void => {
			assert.throws(() => DateTime.parse("2017-11-foo", "yyyy-MM-dd"));
		});
	});

	describe("issue #22", (): void => {
		it("should not crash", (): void => {
			let arrivalTime = new DateTime(2016, 2, 12, 11, 0, 0, 0, TimeZone.zone("Asia/Tokyo"));
			arrivalTime = arrivalTime.add(Duration.days(1));
			expect(arrivalTime.toString()).to.equal("2016-02-13T11:00:00.000 Asia/Tokyo");
		});
	});

	describe("offsetDuration()", (): void => {
		it("should return 0 for naive dates", (): void => {
			expect(new DateTime("2016-03-31").offsetDuration().milliseconds()).to.equal(0);
		});
		it("should return total offset for aware dates", (): void => {
			expect(new DateTime("2016-03-31 Europe/Amsterdam").offsetDuration().hours()).to.equal(2);
		});
		it("should return standard offset for aware dates without DST", (): void => {
			expect(new DateTime("2016-03-31 Europe/Amsterdam without DST").offsetDuration().hours()).to.equal(1);
		});
	});

	describe("standardOffsetDuration()", (): void => {
		it("should return 0 for naive dates", (): void => {
			expect(new DateTime("2016-03-31").standardOffsetDuration().milliseconds()).to.equal(0);
		});
		it("should return standard offset for aware dates", (): void => {
			expect(new DateTime("2016-03-31 Europe/Amsterdam").standardOffsetDuration().hours()).to.equal(1);
		});
		it("should return standard offset for aware dates without DST", (): void => {
			expect(new DateTime("2016-03-31 Europe/Amsterdam without DST").standardOffsetDuration().hours()).to.equal(1);
		});
	});
});



