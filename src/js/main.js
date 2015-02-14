var React = require('react');
var mui = require('material-ui');
var DatePicker = mui.DatePicker;
var DropDownMenu = mui.DropDownMenu;
var TimePicker = require('./components/time-picker.js');
var Countdown = require('./components/countdown.js');

var Main = React.createClass({

  getInitialState: function() {
    return { alarm: null, countdown: null, hours: 0, minutes: 0, seconds: 0 };
  },

  render: function() {
    return (
      <div id="main">

        <Countdown
          hours={this.state.hours}
          minutes={this.state.minutes}
          seconds={this.state.seconds} />

        <div className="time-picker-container">
          <div className="until-container">
          <h2 className="until top">UNTIL</h2>
          </div>
          <div className="until-container bottom">
          <h2 className="until bottom">UNTIL</h2>
          </div>
          <TimePicker onTimeChange={this._handleTimeChange} />
        </div>

      </div>
    );
  },

  _handleTimeChange: function(hour, minute, ampm) {
    if (isNaN(hour) || isNaN(minute) || !ampm || ampm.length === 0) return;

    var MS_PER_MINUTE = 60 * 1000;
    var MS_PER_HOUR = MS_PER_MINUTE * 60;
    var MS_PER_DAY = MS_PER_HOUR * 24;

    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();
    var currentSecond = currentDate.getSeconds();
    var currentMs = currentDate.getMilliseconds();

    var ampmOffset = ampm === 'AM' ? 0 : 12;
    var laterHour = hour === 12 ? ampmOffset : hour + ampmOffset;
    var laterMinute = minute;

    var currentTotalMs = 1000 * (60 * (60 * currentHour + currentMinute) + currentSecond) + currentMs;
    var laterTotalMs = MS_PER_MINUTE * (60 * laterHour + laterMinute);

    function parseClockVals(ms) {
      var hours = Math.floor(ms / MS_PER_HOUR);
      var minutes = Math.floor((ms - (hours * MS_PER_HOUR)) / MS_PER_MINUTE);
      var seconds = Math.floor((ms - (hours * MS_PER_HOUR) - (minutes * MS_PER_MINUTE)) / 1000);

      return { hours: hours, minutes: minutes, seconds: seconds };
    }

    function updateCountdown() {
      var newVals;

      if (this.state.hours <= 0 && this.state.minutes <= 0 && this.state.seconds <= 0) {
        clearInterval(this.state.countdown);
      } else {
        newVals = parseClockVals(this.state.wait);
        this.setState({
          wait: this.state.wait - 1000,
          hours: newVals.hours,
          minutes: newVals.minutes,
          seconds: newVals.seconds
        });
      }
    }

    var wait;
    if (currentTotalMs < laterTotalMs) {
      wait = laterTotalMs - currentTotalMs;
    } else if (currentTotalMs > laterTotalMs) {
      wait = (MS_PER_DAY - currentMs) + laterTotalMs;
    }

    var countdownVals = parseClockVals(wait);
    if (this.state.alarm) clearTimeout(this.state.alarm);
    this.setState({
      alarm: setTimeout(function() { alert('time is up'); }, wait),
      wait: wait,
      hours: countdownVals.hours,
      minutes: countdownVals.minutes,
      seconds: countdownVals.seconds,
      countdown: setInterval(updateCountdown.bind(this), 1000)
    });
  }
});

module.exports = Main;
