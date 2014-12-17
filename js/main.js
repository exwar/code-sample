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

    // Start page
    (function() {
        var target = $('.start-page');

        target.each(function() {
            var $context = $(this);
            var el = {
                'split': $('.js-start-split', $context)
            };

            var data = {
                'footerHeight': 60,
                'isReady': false
            };

            $context.parallax({
                calibrateX: true,
                calibrateY: true,
                limitX: 50,
                limitY: true,
                scalarY: false
            });

            function setSplitHeight() {
                var _areaHeight = $W.height() - data.footerHeight;

                if (_areaHeight < 620) _areaHeight = 620;
                el.split.height((_areaHeight / 10) + 'rem');

                if (!data.isReady) {
                    data.isReady = true;

                    el.split
                        .addClass('_ready');
                }
            }

            $W
                .on('resize', setSplitHeight)
                .trigger('resize');

        });
    })();

});