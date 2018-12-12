// @flow
/* eslint-env mocha */

import assert from 'power-assert'
import lightFormat from '.'

describe.only('lightFormat', () => {
  const date = new Date(1986, 3 /* Apr */, 4, 10, 32, 55, 123)

  // var offset = date.getTimezoneOffset()
  // var absoluteOffset = Math.abs(offset)
  // var hours = Math.floor(absoluteOffset / 60)
  // var hoursLeadingZero = hours < 10 ? '0' : ''
  // var minutes = absoluteOffset % 60
  // var minutesLeadingZero = minutes < 10 ? '0' : ''
  // var sign = offset > 0 ? '-' : '+'

  // var timezone =
  //   sign + hoursLeadingZero + hours + ':' + minutesLeadingZero + minutes
  // var timezoneShort = timezone.replace(':', '')
  // var timezoneWithOptionalMinutesShort =
  //   minutes === 0 ? sign + hoursLeadingZero + hours : timezoneShort

  // var timezoneWithZ = offset === 0 ? 'Z' : timezone
  // var timezoneWithZShort = offset === 0 ? 'Z' : timezoneShort
  // var timezoneWithOptionalMinutesAndZShort =
  //   offset === 0 ? 'Z' : timezoneWithOptionalMinutesShort

  // var timezoneGMTShort =
  //   minutes === 0
  //     ? 'GMT' + sign + hours
  //     : 'GMT' + sign + hours + ':' + minutesLeadingZero + minutes
  // var timezoneGMT = 'GMT' + timezone

  // var timestamp = date.getTime().toString()
  // var secondsTimestamp = Math.floor(date.getTime() / 1000).toString()

  it('accepts a string', () => {
    var date = new Date(1987, 1, 11).toISOString()
    assert(lightFormat(date, 'yyyy-MM-dd') === '1987-02-11')
  })

  it('accepts a timestamp', () => {
    var date = new Date(2014, 3, 4).getTime()
    assert(lightFormat(date, 'yyyy-MM-dd') === '2014-04-04')
  })

  it.skip('escapes characters between the single quote characters', () => {
    var result = lightFormat(date, "'yyyy-'MM-dd'THH:mm:ss.SSSX' yyyy-'MM-dd'")
    assert(result === 'yyyy-04-04THH:mm:ss.SSSX 1986-MM-dd')
  })

  it.skip('two single quote characters are transformed into a "real" single quote', () => {
    var date = new Date(2014, 3, 4, 5)
    assert(lightFormat(date, "''h 'o''clock'''") === "'5 o'clock'")
  })

  describe.skip('year', () => {
    describe('regular year', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'y yo yy yyy yyyy yyyyy')
        assert(result === '1986 1986th 86 1986 1986 01986')
      })

      it('1 BC formats as 1', () => {
        var date = new Date(0, 0 /* Jan */, 1)
        date.setFullYear(0)
        var result = lightFormat(date, 'y')
        assert(result === '1')
      })

      it('2 BC formats as 2', () => {
        var date = new Date(0, 0 /* Jan */, 1)
        date.setFullYear(-1)
        var result = lightFormat(date, 'y')
        assert(result === '2')
      })
    })

    describe('local week-numbering year', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'Y Yo YY YYY YYYY YYYYY', {
          awareOfUnicodeTokens: true
        })
        assert(result === '1986 1986th 86 1986 1986 01986')
      })

      it('the first week of the next year', () => {
        var result = lightFormat(new Date(2013, 11 /* Dec */, 29), 'YYYY', {
          awareOfUnicodeTokens: true
        })
        assert(result === '2014')
      })

      it('allows to specify `weekStartsOn` and `firstWeekContainsDate` in options', () => {
        var result = lightFormat(new Date(2013, 11 /* Dec */, 29), 'YYYY', {
          weekStartsOn: 1,
          firstWeekContainsDate: 4,
          awareOfUnicodeTokens: true
        })
        assert(result === '2013')
      })

      it('the first week of year', () => {
        var result = lightFormat(new Date(2016, 0 /* Jan */, 1), 'YYYY', {
          awareOfUnicodeTokens: true
        })
        assert(result === '2016')
      })

      it('1 BC formats as 1', () => {
        var date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(0)
        var result = lightFormat(date, 'Y')
        assert(result === '1')
      })

      it('2 BC formats as 2', () => {
        var date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(-1)
        var result = lightFormat(date, 'Y')
        assert(result === '2')
      })
    })

    describe('ISO week-numbering year', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'R RR RRR RRRR RRRRR')
        assert(result === '1986 1986 1986 1986 01986')
      })

      it('the first week of the next year', () => {
        var result = lightFormat(new Date(2013, 11 /* Dec */, 30), 'RRRR')
        assert(result === '2014')
      })

      it('the last week of the previous year', () => {
        var result = lightFormat(new Date(2016, 0 /* Jan */, 1), 'RRRR')
        assert(result === '2015')
      })

      it('1 BC formats as 0', () => {
        var date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(0)
        var result = lightFormat(date, 'R')
        assert(result === '0')
      })

      it('2 BC formats as -1', () => {
        var date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(-1)
        var result = lightFormat(date, 'R')
        assert(result === '-1')
      })
    })

    describe('extended year', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'u uu uuu uuuu uuuuu')
        assert(result === '1986 1986 1986 1986 01986')
      })

      it('1 BC formats as 0', () => {
        var date = new Date(0, 0, 1)
        date.setFullYear(0)
        var result = lightFormat(date, 'u')
        assert(result === '0')
      })

      it('2 BC formats as -1', () => {
        var date = new Date(0, 0, 1)
        date.setFullYear(-1)
        var result = lightFormat(date, 'u')
        assert(result === '-1')
      })
    })
  })

  describe.skip('quarter', () => {
    it('formatting quarter', () => {
      var result = lightFormat(date, 'Q Qo QQ QQQ QQQQ QQQQQ')
      assert(result === '2 2nd 02 Q2 2nd quarter 2')
    })

    it('stand-alone quarter', () => {
      var result = lightFormat(date, 'q qo qq qqq qqqq qqqqq')
      assert(result === '2 2nd 02 Q2 2nd quarter 2')
    })

    it('returns a correct quarter for each month', () => {
      var result = []
      for (var i = 0; i <= 11; i++) {
        result.push(lightFormat(new Date(1986, i, 1), 'Q'))
      }
      var expected = [
        '1',
        '1',
        '1',
        '2',
        '2',
        '2',
        '3',
        '3',
        '3',
        '4',
        '4',
        '4'
      ]
      assert.deepEqual(result, expected)
    })
  })

  describe.skip('month', () => {
    it('formatting month', () => {
      var result = lightFormat(date, 'M Mo MM MMM MMMM MMMMM')
      assert(result === '4 4th 04 Apr April A')
    })

    it('stand-alone month', () => {
      var result = lightFormat(date, 'L Lo LL LLL LLLL LLLLL')
      assert(result === '4 4th 04 Apr April A')
    })
  })

  describe.skip('week', () => {
    describe('local week of year', () => {
      it('works as expected', () => {
        var date = new Date(1986, 3 /* Apr */, 6)
        var result = lightFormat(date, 'w wo ww')
        assert(result === '15 15th 15')
      })

      it('allows to specify `weekStartsOn` and `firstWeekContainsDate` in options', () => {
        var date = new Date(1986, 3 /* Apr */, 6)
        var result = lightFormat(date, 'w wo ww', {
          weekStartsOn: 1,
          firstWeekContainsDate: 4
        })
        assert(result === '14 14th 14')
      })
    })

    it('ISO week of year', () => {
      var date = new Date(1986, 3 /* Apr */, 6)
      var result = lightFormat(date, 'I Io II')
      assert(result === '14 14th 14')
    })
  })

  describe.skip('day', () => {
    it('date', () => {
      var result = lightFormat(date, 'd do dd')
      assert(result === '4 4th 04')
    })

    describe('day of year', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'D Do DD DDD DDDDD', {
          awareOfUnicodeTokens: true
        })
        assert(result === '94 94th 94 094 00094')
      })

      it('returns a correct day number for the last day of a leap year', () => {
        var result = lightFormat(
          new Date(1992, 11 /* Dec */, 31, 23, 59, 59, 999),
          'D',
          { awareOfUnicodeTokens: true }
        )
        assert(result === '366')
      })
    })
  })

  describe.skip('week day', () => {
    describe('day of week', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'E EE EEE EEEE EEEEE EEEEEE')
        assert(result === 'Fri Fri Fri Friday F Fr')
      })
    })

    describe('ISO day of week', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'i io ii iii iiii iiiii iiiiii')
        assert(result === '5 5th 05 Fri Friday F Fr')
      })

      it('returns a correct day of an ISO week', () => {
        var result = []
        for (var i = 1; i <= 7; i++) {
          result.push(lightFormat(new Date(1986, 8 /* Sep */, i), 'i'))
        }
        var expected = ['1', '2', '3', '4', '5', '6', '7']
        assert.deepEqual(result, expected)
      })
    })

    describe('formatting day of week', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'e eo ee eee eeee eeeee eeeeee')
        assert(result === '6 6th 06 Fri Friday F Fr')
      })

      it('by default, 1 is Sunday, 2 is Monday, ...', () => {
        var result = []
        for (var i = 7; i <= 13; i++) {
          result.push(lightFormat(new Date(1986, 8 /* Sep */, i), 'e'))
        }
        var expected = ['1', '2', '3', '4', '5', '6', '7']
        assert.deepEqual(result, expected)
      })

      it('allows to specify which day is the first day of the week', () => {
        var result = []
        for (var i = 1; i <= 7; i++) {
          result.push(
            lightFormat(new Date(1986, 8 /* Sep */, i), 'e', {
              weekStartsOn: 1
            })
          )
        }
        var expected = ['1', '2', '3', '4', '5', '6', '7']
        assert.deepEqual(result, expected)
      })
    })

    describe('stand-alone day of week', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'c co cc ccc cccc ccccc cccccc')
        assert(result === '6 6th 06 Fri Friday F Fr')
      })

      it('by default, 1 is Sunday, 2 is Monday, ...', () => {
        var result = []
        for (var i = 7; i <= 13; i++) {
          result.push(lightFormat(new Date(1986, 8 /* Sep */, i), 'c'))
        }
        var expected = ['1', '2', '3', '4', '5', '6', '7']
        assert.deepEqual(result, expected)
      })

      it('allows to specify which day is the first day of the week', () => {
        var result = []
        for (var i = 1; i <= 7; i++) {
          result.push(
            lightFormat(new Date(1986, 8 /* Sep */, i), 'c', {
              weekStartsOn: 1
            })
          )
        }
        var expected = ['1', '2', '3', '4', '5', '6', '7']
        assert.deepEqual(result, expected)
      })
    })
  })

  describe.skip('day period and hour', () => {
    it('hour [1-12]', () => {
      var result = lightFormat(
        new Date(2018, 0 /* Jan */, 1, 0, 0, 0, 0),
        'h ho hh'
      )
      assert(result === '12 12th 12')
    })

    it('hour [0-23]', () => {
      var result = lightFormat(
        new Date(2018, 0 /* Jan */, 1, 0, 0, 0, 0),
        'H Ho HH'
      )
      assert(result === '0 0th 00')
    })

    it('hour [0-11]', () => {
      var result = lightFormat(
        new Date(2018, 0 /* Jan */, 1, 0, 0, 0, 0),
        'K Ko KK'
      )
      assert(result === '0 0th 00')
    })

    it('hour [1-24]', () => {
      var result = lightFormat(
        new Date(2018, 0 /* Jan */, 1, 0, 0, 0, 0),
        'k ko kk'
      )
      assert(result === '24 24th 24')
    })

    describe('AM, PM', () => {
      it('works as expected', () => {
        var result = lightFormat(
          new Date(2018, 0 /* Jan */, 1, 0, 0, 0, 0),
          'a aa aaa aaaa aaaaa'
        )
        assert(result === 'AM AM AM a.m. a')
      })

      it('12 PM', () => {
        var date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 900)
        assert(lightFormat(date, 'h H K k a') === '12 12 0 12 PM')
      })

      it('12 AM', () => {
        var date = new Date(1986, 3 /* Apr */, 6, 0, 0, 0, 900)
        assert(lightFormat(date, 'h H K k a') === '12 0 0 24 AM')
      })
    })

    describe('AM, PM, noon, midnight', () => {
      it('works as expected', () => {
        var result = lightFormat(
          new Date(1986, 3 /* Apr */, 6, 2, 0, 0, 900),
          'b bb bbb bbbb bbbbb'
        )
        assert(result === 'AM AM AM a.m. a')
      })

      it('12 PM', () => {
        var date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 900)
        assert(
          lightFormat(date, 'b bb bbb bbbb bbbbb') === 'noon noon noon noon n'
        )
      })

      it('12 AM', () => {
        var date = new Date(1986, 3 /* Apr */, 6, 0, 0, 0, 900)
        assert(
          lightFormat(date, 'b bb bbb bbbb bbbbb') ===
            'midnight midnight midnight midnight mi'
        )
      })
    })

    describe('flexible day periods', () => {
      it('works as expected', () => {
        var result = lightFormat(date, 'B, BB, BBB, BBBB, BBBBB')
        assert(
          result ===
            'in the morning, in the morning, in the morning, in the morning, in the morning'
        )
      })

      it('12 PM', () => {
        var date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 900)
        assert(lightFormat(date, 'h B') === '12 in the afternoon')
      })

      it('5 PM', () => {
        var date = new Date(1986, 3 /* Apr */, 6, 17, 0, 0, 900)
        assert(lightFormat(date, 'h B') === '5 in the evening')
      })

      it('12 AM', () => {
        var date = new Date(1986, 3 /* Apr */, 6, 0, 0, 0, 900)
        assert(lightFormat(date, 'h B') === '12 at night')
      })

      it('4 AM', () => {
        var date = new Date(1986, 3 /* Apr */, 6, 4, 0, 0, 900)
        assert(lightFormat(date, 'h B') === '4 in the morning')
      })
    })
  })

  it.skip('minute', () => {
    var result = lightFormat(date, 'm mo mm')
    assert(result === '32 32nd 32')
  })

  describe.skip('second', () => {
    it('second', () => {
      var result = lightFormat(date, 's so ss')
      assert(result === '55 55th 55')
    })

    it('fractional seconds', () => {
      var result = lightFormat(date, 'S SS SSS SSSS')
      assert(result === '1 12 123 1230')
    })
  })

  describe.skip('time zone', () => {
    it('should toDate the given date in a local timezone', () => {
      assert(lightFormat('2015-01-01', 'yyyy-MM-dd') === '2015-01-01')
    })
    it('ISO-8601 with Z', () => {
      var result = lightFormat(date, 'X XX XXX XXXX XXXXX')
      var expectedResult = [
        timezoneWithOptionalMinutesAndZShort,
        timezoneWithZShort,
        timezoneWithZ,
        timezoneWithZShort,
        timezoneWithZ
      ].join(' ')
      assert(result === expectedResult)
    })

    it('ISO-8601 without Z', () => {
      var result = lightFormat(date, 'x xx xxx xxxx xxxxx')
      var expectedResult = [
        timezoneWithOptionalMinutesShort,
        timezoneShort,
        timezone,
        timezoneShort,
        timezone
      ].join(' ')
      assert(result === expectedResult)
    })

    it('GMT', () => {
      var result = lightFormat(date, 'O OO OOO OOOO')
      var expectedResult = [
        timezoneGMTShort,
        timezoneGMTShort,
        timezoneGMTShort,
        timezoneGMT
      ].join(' ')
      assert(result === expectedResult)
    })

    it('Specific non-location', () => {
      var result = lightFormat(date, 'z zz zzz zzzz')
      var expectedResult = [
        timezoneGMTShort,
        timezoneGMTShort,
        timezoneGMTShort,
        timezoneGMT
      ].join(' ')
      assert(result === expectedResult)
    })
  })

  it("returns String('Invalid Date') if the date isn't valid", () => {
    assert(lightFormat(new Date(NaN), 'MMMM d, yyyy') === 'Invalid Date')
  })

  it('implicitly converts `formatString`', () => {
    // eslint-disable-next-line no-new-wrappers
    var formatString = new String('yyyy-MM-dd')

    var date = new Date(2014, 3, 4)

    // $ExpectedMistake
    assert(lightFormat(date, formatString) === '2014-04-04')
  })

  it('throws TypeError exception if passed less than 2 arguments', () => {
    assert.throws(lightFormat.bind(null), TypeError)
    assert.throws(lightFormat.bind(null, 1), TypeError)
  })
})
