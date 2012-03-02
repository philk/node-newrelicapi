
var et = require('elementtree');

module.exports = NewRelicXML = function(){};

function Application() {
  this.id = null;
  this.name = null;
  this.overview_url = null;
}
function makeApplication(element) {
  var app = new Application();
  app.id = element.find('.//id').text;
  app.name = element.find('.//name').text;
  app.overview_url = element.find('.//overview-url').text;
  return app;
}
NewRelicXML.parseApplications = function (xml) {
  var etree = et.parse(xml);
  return etree.getroot().findall('./application').map(makeApplication);
};

function ThresholdValue() {
  this.name = null;
  this.formatted_metric_value = null;
  this.metric_value = null;
  this.threshold_value = null;
  this.begin_time = null;
  this.end_time = null;
}
function makeThresholdValue(element) {
  var tv = new ThresholdValue();
  tv.name = element.attrib.name;
  tv.formatted_metric_value = element.attrib.formatted_metric_value;
  tv.metric_value = element.attrib.metric_value;
  tv.threshold_value = element.attrib.threshold_value;
  tv.begin_time = element.attrib.begin_time;
  tv.end_time = element.attrib.end_time;
  return tv;
}
NewRelicXML.parseThresholdValues = function (xml) {
  var etree = et.parse(xml);
  return etree.getroot().findall('./threshold_value').map(makeThresholdValue);
};
