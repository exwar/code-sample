$W = $(window);
$D = $(document);
$H = $('html');
$B = $('body');

$(function() {

    // Window size change
    (function() {
        var lastMqPoint = 0;

        function checkMQ() {
            var _mqPoint = 1000;

            if (Modernizr.mq('screen and (min-width: 1300px)')) _mqPoint = 1300;
            if (Modernizr.mq('screen and (min-width: 1600px)')) _mqPoint = 1600;

            if (_mqPoint !== lastMqPoint) {
                lastMqPoint = _mqPoint;

                $D.trigger({
                    'type': 'window:changemq'
                  , 'mqPoint': _mqPoint
                });
            }
        }

        $D.on('checkmq', checkMQ);
        $W.on('resize', $.debounce(300, checkMQ));
    })();
});