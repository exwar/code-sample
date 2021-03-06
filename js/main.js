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

    // Detect mouse focus
    //(function() {
    //    var mouseFocusedClass = '_mouse-focused';
    //
    //    $B.on('mousedown', function() {
    //        //wait for `document.activeElement` to change
    //        setTimeout(function() {
    //            //find focused element
    //            var activeElement = document.activeElement,
    //                $activeElement = $(activeElement);
    //
    //            //if found and it's not body...
    //            if (activeElement && activeElement !== document.body) {
    //                //add special class, remove it after `blur`
    //                $activeElement.addClass(mouseFocusedClass).one('blur', function() {
    //                    $activeElement.removeClass(mouseFocusedClass);
    //                });
    //            }
    //        }, 0);
    //    });
    //})();

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

    // Descbox
    (function() {
        var target = $('.js-descbox');

        target.each(function() {
            var $context = $(this)
              , el = {
                    'part': $('.js-descbox-part', $context),
                    'more': $('.js-descbox-more', $context)
                };

            function toggleBody(event) {
                var _oldText = el.more.text();

                event.preventDefault();
                el.part.slideToggle(500, function() {
                    $context.trigger({
                        'type': 'descbox:toggle:end'
                    });
                });
                $context.toggleClass('_active');

                el.more
                    .text(el.more.data('alt'))
                    .data('alt', _oldText);
            }

            el.more.on('click', toggleBody);
        });
    })();

    // Product
    (function() {
        var target = $('.js-product');

        target.each(function() {
            var $context = $(this),
                el = {
                    'descBox': $('.js-descbox', $context)
                }
              , data = {
                    'footerHeight': $('.l-footer').outerHeight(),
                    'headerHeight': $('.l-header').outerHeight(),
                    'descBoxHeight': el.descBox.outerHeight(),
                    'minArea': 0,
                    'isReady': false
                };

            data.minArea = 610 - data.headerHeight;

            function setHeight() {
                var _areaHeight = $W.height() - (data.headerHeight + data.footerHeight);
                var _descBoxMargin = 0;

                if (_areaHeight < data.minArea) _areaHeight = data.minArea;
                $context.css('height', (_areaHeight / 10) + 'rem');

                _descBoxMargin = Math.floor((_areaHeight - data.descBoxHeight) / 2);
                if (_descBoxMargin < 20) _descBoxMargin = 20;

                // el.descBox.css({
                //    'margin': (_descBoxMargin / 10) + 'rem 0 2rem'
                // });

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

                if (_areaHeight < 590) _areaHeight = 590;
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

        $D.on('click touchend', '.js-marker-close, .js-marker-image', toggleMarker);
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
                    .on('click touchend', '.js-marker-image', function() {
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
                    .on('click touchend', '.js-marker-close', backToInitPos);
            }

            function initZoom() {
                var $buttons = el.zoom.find('.js-map-zoom-button');
                var MINZOOM = ~~el.mapObject.data('zoomMin') || 8;
                var MAXZOOM = ~~el.mapObject.data('zoomMax') || 18;

                var _farZoom = [MINZOOM, MINZOOM + 1, MINZOOM + 2];

                function checkZoom() {
                    var _expZoom = _map.getZoom();

                    var $inButton = $buttons.filter('._in');
                    var $outButton = $buttons.filter('._out');

                    $buttons.removeClass('_disabled');

                    if (_expZoom == MAXZOOM) $inButton.addClass('_disabled');
                    if (_expZoom == MINZOOM) $outButton.addClass('_disabled');

                    $context.toggleClass('_far-zoom', _farZoom.indexOf(_expZoom) > -1);
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

                checkZoom();
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
                    var _curCenter = _map.getCenter();

                    google.maps.event.trigger(_map, 'resize');

                    _map.panTo(_curCenter);
                });
            }

            // Catch promise
            new MakeMap({
                'el': el.mapObject,
                'zoom': 9
            }).done(initMarketMap);
        });
    })();

    // Contacts
    (function() {
        var target = $('.js-contacts');

        target.each(function() {
            var $context = $(this)
              , el = {
                    'map': $('.js-contacts-map', $context),
                    'mapObject': $('.js-contacts-map-object', $context),
                    'mapClose': $('.js-contacts-map-close', $context),
                    'markerTPL': $('.js-contacts-map-markertpl', $context),
                    'mapControls': $('.js-contacts-map-controls', $context),
                    'infoShowMap': $('.js-contacts-info-show', $context)
                };

            var _contactsPoints = window.G.contacts['points'] || [];
            var _markerTPL = el.markerTPL.html();

            var _map = null;
            var $markers = null;
            var _markerBounds = null;
            var _mapInitPos = {  };
            var _closeZoom = 16;

            function drawMarkers() {
                _markerBounds = new google.maps.LatLngBounds();

                $.each(_contactsPoints, function(prop, value) {
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

                    _markerBounds.extend(_latLng);
                });

                el.mapObject
                    .on('click touchend', '.js-marker-close', function(event) {
                        event.stopPropagation();

                        hideMap();
                    });
            }

            function offsetCenter(latlng,offsetx,offsety) {
                var scale = Math.pow(2, _map.getZoom());
                var nw = new google.maps.LatLng(
                    _map.getBounds().getNorthEast().lat(),
                    _map.getBounds().getSouthWest().lng()
                );

                var worldCoordinateCenter = _map.getProjection().fromLatLngToPoint(latlng);
                var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

                var worldCoordinateNewCenter = new google.maps.Point(
                    worldCoordinateCenter.x - pixelOffset.x,
                    worldCoordinateCenter.y + pixelOffset.y
                );

                var newCenter = _map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

                _map.setCenter(newCenter);

            }

            function initZoom() {
                var $buttons = el.zoom.find('.js-map-zoom-button');
                var MINZOOM = ~~el.mapObject.data('zoomMin') || 8;
                var MAXZOOM = ~~el.mapObject.data('zoomMax') || 18;

                var _farZoom = [MINZOOM , MINZOOM + 1, MINZOOM + 2];

                function checkZoom() {
                    var _expZoom = _map.getZoom();

                    console.info(_expZoom);

                    var $inButton = $buttons.filter('._in');
                    var $outButton = $buttons.filter('._out');

                    $buttons.removeClass('_disabled');

                    if (_expZoom == MAXZOOM) $inButton.addClass('_disabled');
                    if (_expZoom == MINZOOM) $outButton.addClass('_disabled');

                    el.map.toggleClass('_far-zoom', _farZoom.indexOf(_expZoom) > -1);
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

                checkZoom();
                google.maps.event.addListener(_map, "zoom_changed", checkZoom);
            }

            function initContactsMap() {
                _map = el.mapObject.data('map');

                _mapInitPos.center = _map.getCenter();
                _mapInitPos.zoom = _map.getZoom();

                setTimeout(function() {
                    $(_map.getDiv()).find('> DIV').addClass('gm-map-holder');
                }, 100);

                if (el.mapControls.length) {
                    $context.before(el.mapControls);
                    el.zoom = el.mapControls.find('.js-map-zoom');

                    initZoom();
                }

                drawMarkers();

                $W.on('resize', function() {
                    var _curCenter = _map.getCenter();

                    google.maps.event.trigger(_map, 'resize');

                    _map.panTo(_curCenter);
                });
            }

            function showMap() {
                $context.addClass('_show-map');
                el.mapControls.addClass('_active');

                if (_map) {
                    _map.fitBounds(_markerBounds);

                    if (_map.getZoom() > 15) {
                        _map.setZoom(15);
                        offsetCenter(_map.getCenter(), -105, -100);
                    }
                }
            }

            function hideMap() {
                $context.removeClass('_show-map');
                el.mapControls.removeClass('_active');

                if (_map) {
                    _map.panTo(_mapInitPos.center);
                    _map.setZoom(_mapInitPos.zoom);
                }
            }

            // Catch promise
            new MakeMap({
                'el': el.mapObject,
                'zoom': 14
            }).done(initContactsMap);

            el.infoShowMap
                .on('click', function(event) {
                    event.preventDefault();

                    showMap();
                });

            el.mapClose
                .on('click', hideMap);

            $D
                .on('contacts:map:show', showMap)
                .on('contacts:map:hide', hideMap);
        });
    })();

    // Product table
    (function() {
        var target = $('.js-product-table');

        target.each(function() {
            var $context = $(this)
              , el = {
                    'arrows': $('.js-product-caro-arrow', $context),
                    'caro': $('.js-product-caro', $context),
                    'list': $('.js-product-caro-list', $context),
                    'listItems': $('.js-product-caro-list > LI', $context),
                    'specs': $('.js-product-spec-item', $context)
                };

            if (el.listItems.length > 1) {
                el.caro.addClass('_multiple');

                function cbItemBefore($slideElement) {
                    var _slideIndex = $slideElement.data('item');
                    var $relSpec = el.specs.filter('[data-spec="'+ _slideIndex +'"]');

                    el.specs.removeClass('_active');

                    if ($relSpec.length) {
                        $relSpec.addClass('_active');
                    }

                }

                function cbSliderLoad() {
                    if (Modernizr.touch) {
                        el.caro
                            .hide(0).show(0)
                            .addClass('_ready');
                    } else {
                        el.caro
                            .addClass('_ready');
                    }
                }

                el.list.bxSlider({
                    'mode': 'fade',
                    'minSlides': 1,
                    'maxSlides': 1,
                    'pager': false,
                    'slideMargin': 0,
                    'responsive': true,
                    'controls': true,
                    'prevSelector': el.arrows.filter('._prev'),
                    'nextSelector': el.arrows.filter('._next'),
                    'onSlideBefore': cbItemBefore,
                    'onSliderLoad': cbSliderLoad
                });
            } else {
                if (Modernizr.touch) {
                    el.caro
                        .hide(0).show(0)
                        .addClass('_single _ready');
                } else {
                    el.caro
                        .addClass('_single _ready');
                }
            }
        });
    })();


});
