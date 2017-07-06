(function (factory) {

  window['DatePicker'] = factory()

})(function () {
  var Picker = window['Picker']

  var LANG = (function () {
    var lang =  {
      year:'Year',
      month:'Month',
      day:'Day',
      cancel:'Cancel',
      confirm:'Confirm'
    };
    return lang;
  })();

  var DatePicker = function (conf) {
    this.target = conf.target
    this.callback = conf.callback
    this.value = conf.value

  }

  DatePicker.prototype.init = function () {
    var target = this.target
    var callback = this.callback
    var formatDate = this.value

    if (typeof target === 'string') target = document.querySelector(this.target)

    function getMaxDate (year, month) {
      var d = new Date()
      d.setFullYear(year)
      d.setMonth(month)
      d.setDate(0)
      return d.getDate()
    }

    //倒计50年
    var years = (function () {
      var a = [], d = (new Date()).getFullYear()
      for (var i = d - 50; i <= d; i++) a.push(i + '');
      return a
    }())
    //1-12月
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '08', '10', '11', '12']
    //1-31天
    var days = (function () {
      var a = []
      for (var i = 1; i <= 31; i++) {
        if (i < 10) a.push('0' + i)
        else a.push('' + i)
      }
      return a
    }())

    var checkedIndexes = [14, 5, 24]
    /* 已选选项 */

    //处理默认选项
    if (formatDate) {
      var ds = formatDate.split('-')
      var y = ds[0], m = ds[1], d = ds[2]

      if(m.length==1) m = '0'+m;
      if(d.length==1) d = '0'+d;

      checkedIndexes[2] = years.indexOf(y)
      checkedIndexes[1] = months.indexOf(m)
      checkedIndexes[0] = days.indexOf(d)
    }

    function getPickerList (array, maxCount) {
      var list = []
      for (var i = 0; i < array.length; i++) {
        list.push({text: array[i], value: array[i]})
        if (maxCount && maxCount === (i + 1)) break
      }
      return list
    }

    /* 默认选中的地区 */
    var third = getPickerList(years)
    var second = getPickerList(months)
    var first = getPickerList(days, getMaxDate(years[checkedIndexes[1]], years[checkedIndexes[2]]))

    var picker = new Picker({
      cols: [LANG['day'],LANG['month'],LANG['year']],
      data: [first, second, third],
      selectedIndex: checkedIndexes,
      cancel:LANG['cancel'],
      confirm:LANG['confirm'],
      title: ''
    })

    picker.on('picker.select', function (values, indexes) {

      console.log('picker.select', values, indexes)

      var year = values[2]
      var month = values[1]
      var date = values[0]

      callback && callback(year + '-' + month + '-' + date, parseInt(year), parseInt(month), parseInt(date))
    })

    picker.on('picker.change', function (index, selectedIndex) {
      console.log('picker.change', index, selectedIndex)

      checkedIndexes[index] = selectedIndex

      var year = years[checkedIndexes[2]]
      var month = months[checkedIndexes[1]]
      var day = days[checkedIndexes[0]]

      if (index === 0) {

      } else if (index === 1) {
        //month change
        fillDays(year, month)
      } else if (index === 2) {
        //year change
        fillDays(year, month)
      }

      function fillDays (year, month) {
        var max = getMaxDate(year, month)
        picker.refillColumn(0, getPickerList(days, max))
        if (day > max) picker.scrollColumn(0, max - 1)
      }

    })

    target.addEventListener('click', function () {
      picker.show()
    })

  }

  return DatePicker;
});


