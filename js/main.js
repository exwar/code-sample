$W = $(window);
$D = $(document);
$H = $('html');
$B = $('body');


var MakeMap = function(options) {
    var settings = $.extend({}, this.defaults, options);
    var isModLoaded = new $.Deferred();
    var mapInstance = null;
    var mapOptions = {
        'center': null,
        'zoom': settings.zoom,
        'disableDefaultUI': true,
        'scrollwheel': false,
        'styles': settings.styles
    };

    this.checkGMapsLoad()
        .done(function() {
            mapOptions.center = new google.maps.LatLng(settings.center[0], settings.center[1]);
            mapInstance = new google.maps.Map(settings.el.get(0), mapOptions);

            settings.el.data('map', mapInstance);
            isModLoaded.resolve();
        });

    return isModLoaded;
};

MakeMap.prototype = {
    constructor: MakeMap,
    isLibLoaded: new $.Deferred(),

    checkGMapsLoad: function() {
        var self = this;

        if ('google' in window) {
            self.isLibLoaded.resolve();
        } else {
            setTimeout(function() {
                self.checkGMapsLoad();
            }, 500)
        }

        return self.isLibLoaded;
    },

    defaults: {
        'center': [55.755826, 37.6173],
        'zoom': 11,
        'styles': [
            { featureType: "poi", elementType: "labels", stylers: [{visibility: "off"}]},
            {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"visibility": "simplified"}, {"hue": "#0091ff"}, {"saturation": 17}, {"gamma": 0.74}, {"lightness": -8}]}, {"featureType": "administrative.locality", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}, {"featureType": "transit.station.rail", "elementType": "labels.text.fill", "stylers": [{"weight": 0.1}, {"invert_lightness": true}, {"visibility": "on"}, {"color": "#877673"}, {"hue": "#ff0000"}, {"saturation": -30}, {"lightness": 16}, {"gamma": 0.78}]}, {"stylers": [{"gamma": 1.18}, {"saturation": 4}, {"lightness": 4}]}
        ]
    }
};

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
        });
    })();

    // Full height
    (function() {
        var target = $('.js-fullheight');

        target.each(function() {
            var $context = $(this);
            var data = {
                'footerHeight': 60,
                'isReady': false
            };

            function setHeight() {
                var _areaHeight = $W.height() - data.footerHeight;

                if (_areaHeight < 620) _areaHeight = 620;
                $context.height((_areaHeight / 10) + 'rem');

                if (!data.isReady) {
                    data.isReady = true;

                    $context
                        .addClass('_ready');
                }
            }


            $W
                .on('resize', setHeight)
                .trigger('resize');
        });
    })();

    // Markers
    (function() {
        function toggleMarker() {
            var $that = $(this);
            var $relMarker = $that.closest('.js-marker');

            if ($relMarker.length) {
                $relMarker.toggleClass('_active');
            }
        }

        $D.on('click', '.js-marker-close, .js-marker-image', toggleMarker);
    })();

    // Market
    (function() {
        var target = $('.js-market-map');

        target.each(function() {
            var $context = $(this);

            var el = {
                'mapObject': $('.js-market-map-object', $context),
                'markerTPL': $('.js-market-map-markertpl', $context),
                'zoom': $('.js-map-zoom', $context)
            };


            var _marketPoints = window.G.market['points'] || [];
            var _markerTPL = el.markerTPL.html();

            var _map = null;
            var $markers = null;
            var _markerBounds = null;
            var _mapInitPos = {  };
            var _closeZoom = 16;

            if (!Modernizr.flexbox) {
                var ieMapObject = null;

                el.mapObject.append('<div class="market-map-ie"><div class="market-map-ie__nest"></div></div>');
                ieMapObject = el.mapObject.find('.market-map-ie__nest');

                ieMapObject.data(el.mapObject.data());

                el.mapObject = ieMapObject;
            }

            function backToInitPos() {
                _map.panTo(_mapInitPos.center);
                _map.setZoom(_mapInitPos.zoom);
            }

            function drawMarkers() {
                _markerBounds = new google.maps.LatLngBounds();

                $.each(_marketPoints, function(prop, value) {
                    var _markerContent = _markerTPL
                        .replace('{{ title }}', value.title)
                        .replace('{{ content }}', value.content)
                        .replace('{{ coords }}', value.coords.join(';'));

                    var _latLng = new google.maps.LatLng(value.coords[0], value.coords[1]);

                    var _marker =  new RichMarker({
                        map: _map,
                        position: _latLng,
                        draggable: false,
                        flat: true,
                        content: _markerContent,
                        enableEventPropagation: true
                    });

                    //_markerBounds.extend(_latLng);
                });

                //_map.fitBounds(_markerBounds);

                el.mapObject
                    .on('click', '.js-marker-image', function() {
                        var $that = $(this);
                        var $relMarker = $that.closest('.js-marker');
                        var coords = $relMarker.data('coords').split(';');

                        var _markerLoc = new google.maps.LatLng(coords[0], coords[1]);

                        // Hide others
                        el.mapObject.find('.js-marker')
                            .not($relMarker)
                            .removeClass('_active');

                        // Center on marker
                        _map.panTo(_markerLoc);
                        _map.setZoom(_closeZoom);

                    })
                    .on('click', '.js-marker-close', backToInitPos);
            }

            function initZoom() {
                var $buttons = el.zoom.find('.js-map-zoom-button');
                var MINZOOM = ~~el.mapObject.data('zoomMin') || 6;
                var MAXZOOM = ~~el.mapObject.data('zoomMax') || 18;

                function checkZoom() {
                    var _expZoom = _map.getZoom();

                    var $inButton = $buttons.filter('._in');
                    var $outButton = $buttons.filter('._out');

                    $buttons.removeClass('_disabled');

                    if (_expZoom == MAXZOOM) $inButton.addClass('_disabled');
                    if (_expZoom == MINZOOM) $outButton.addClass('_disabled');
                }

                $buttons.on('click', function() {
                    var $that = $(this);
                    var _dir = $that.hasClass('_out') ? -1 : 1;
                    var _currentZoom = _map.getZoom();
                    var _expZoom = _currentZoom + _dir;

                    if (!$that.hasClass('_disabled')) {
                        _map.setZoom(_expZoom);
                    }
                });

                google.maps.event.addListener(_map, "zoom_changed", checkZoom);
            }

            function initMarketMap() {
                _map = el.mapObject.data('map');

                _mapInitPos.center = _map.getCenter();
                _mapInitPos.zoom = _map.getZoom();

                setTimeout(function() {
                    $(_map.getDiv()).find('> DIV').addClass('gm-map-holder');
                }, 100);


                drawMarkers();
                initZoom();

                $W.on('resize', function() {
                    var _curZoom = _map.getZoom();
                    var _curCenter = _map.getCenter();

                    google.maps.event.trigger(_map, 'resize');

                    _map.setZoom(_curZoom);
                    _map.setCenter(_curCenter);
                });
            }

            // Catch promise
            new MakeMap({
                'el': el.mapObject,
                'zoom': 9
            }).done(initMarketMap);
        });
    })();

});