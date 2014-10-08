setInterval(function () {
    pollBid()
}, 500);

function pollBid() {
    $.get('/api/auction/get', function (cb) {
        if (cb) {
            $("#bid").html("$" + cb.bid);
            $("#high").html(cb.high);
        }
        else {
        }
    });
}

$(document).ready(function () {
    $("#fl").featherlight();
});