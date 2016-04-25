/*
get extremely hot place's weather:
Dallol, Ethiopia
Aziziya, Libya
The Atacama Desert, South America
Death Valley, California
The Sahara Desert, Africa
*/
var $deferredHotMetrics = $.getJSON("/api/getCondLatLon?lat=14&lon=40");
var $deferredHotMetrics = $.getJSON("/api/getCondLatLon?lat=32&lon=13");
var $deferredHotMetrics = $.getJSON("/api/getCondLatLon?lat=24&lon=69");
var $deferredHotMetrics = $.getJSON("/api/getCondLatLon?lat=36&lon=116");
var $deferredHotMetrics = $.getJSON("/api/getCondLatLon?lat=23&lon=13");

/*
get extremely cold place's weather:
Yakutsk, Russia
Verkhoyansk, Russia
International Falls, Minnesota
Fraser, Colorado
Hell, Norway
*/
var $deferredColdMetrics = $.getJSON("/api/getCondLatLon?lat=62&lon=129");
var $deferredColdMetrics = $.getJSON("/api/getCondLatLon?lat=67&lon=133");
var $deferredColdMetrics = $.getJSON("/api/getCondLatLon?lat=48&lon=93");
var $deferredColdMetrics = $.getJSON("/api/getCondLatLon?lat=39&lon=105");
var $deferredColdMetrics = $.getJSON("/api/getCondLatLon?lat=63&lon=10");
