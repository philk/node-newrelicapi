
var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    fs = require('fs');

var apps_xml = fs.readFileSync('./test/fixtures/applications.xml', 'utf-8');
var threshold_xml = fs.readFileSync('./test/fixtures/threshold_values.xml', 'utf-8');

vows.describe('New Relic XML').addBatch({
  'A NewRelicXML object': {
    topic: function(){
      var nrx = require('../lib/elements');
      return nrx;
    },
    'when provided an applications.xml string': {
      topic: function (nrx) {
        return nrx.parseApplications(apps_xml);
      },
      'returns a list of 2 apps': function (topic) {
        assert.equal(typeof(topic), "object");
        assert.equal(topic.length, 2);
      }
    },
    'when provided an threshold_values.xml string': {
      topic: function (nrx) {
        return nrx.parseThresholdValues(threshold_xml);
      },
      'returns an object': function (topic) {
        assert.equal(typeof(topic), "object");
      },
      'with 9 values': function (topic) {
        assert.equal(topic.length, 9);
      },
      'Memory has the correct metric_value': function(topic) {
        var idx;
        topic.forEach(function(tv, i){
          if (tv.name === "Memory") { idx = i; }
        });
        assert.equal(topic[idx].metric_value, "2215");
      }
    }
  }
}).export(module);
