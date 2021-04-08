let countDownDate = 'hello'
var baseUrl = window.location.origin
let uuid = ''

function CreateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function submitDate() {
  var myDate = $('#datepicker').val()
  console.log(myDate)
  var newDate = new Date(myDate)
  $.post(
    baseUrl + '/submit',
    {
      uuid: uuid,
      timestamp: newDate.getTime(),
    },
    function (data, status) {
      refresh()
    }
  )
}

function refresh(cb) {
  $.get(baseUrl + '/stats', function (data, status) {
    console.log(data)
    countDownDate = data.timestampAvg
    if (cb) {
      cb()
    }
  })
}

function startCountdown() {
  console.log(window.countDownDate)
  // Update the count down every 1 second
  var x = setInterval(function () {
    if (countDownDate !== '') {
      // Get today's date and time
      var now = new Date().getTime()

      // Find the distance between now and the count down date
      var distance = countDownDate - now

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24))
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // Display the result in the element with id="demo"
      document.getElementById('demo').innerHTML =
        days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's '

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x)
        document.getElementById('demo').innerHTML = 'EXPIRED'
      }
    } else {
      document.getElementById('demo').innerHTML = 'UNKNOWN'
    }
  }, 1000)
}

function setCookie(cookieName, cookieValue) {
  var d = new Date()
  d.setTime(d.getTime() + 2 * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toGMTString()
  document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/'
}

function getCookie(cookieName) {
  var name = cookieName + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var cookieArray = decodedCookie.split(';')
  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i]
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1)
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }

  return ''
}

function checkCookie() {
  uuid = getCookie('uuid')
  if (uuid === '') {
    uuid = CreateUUID()
    setCookie('uuid', uuid)
  }
  window.countDownDate = ''
  refresh(() => {
    startCountdown()
  })
}
