
var clock;
$(document).ready(function () {
    var clock;
    clock = $('.clock').FlipClock({
        clockFace: 'DailyCounter',
        autoStart: false,
        callbacks: {
            stop: function () {
                location.reload(true);
                $('.message').html('The clock has stopped!');
            }
        }
    });
    $.get('/api/countdown/get', function (cb) {
        if (cb) {
            clock.setTime(cb.info);
            clock.setCountdown(true);
            clock.start();
        }
    });
});