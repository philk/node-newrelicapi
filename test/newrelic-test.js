
var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    fs = require('fs');

var apikey_test = 'OhT6aephei6neinaethooghu9eaXahSho';
var accountid_test = '12345';
var appid_test = '8375309';

nock('https://rpm.newrelic.com')
  .get('/accounts/' + accountid_test + '/applications.xml')
  .matchHeader('x-api-key', apikey_test)
  .reply(200, fs.readFileSync('./test/fixtures/applications.xml'), { server: 'NewRelic/0.8.53',
  'content-type': 'application/xml; charset=utf-8',
  'x-runtime': '1243',
  'content-length': '277',
  'cache-control': 'private, max-age=0, must-revalidate'
});

nock('https://rpm.newrelic.com')
  .get('/accounts/' + accountid_test + '/applications/' + appid_test + '/threshold_values.xml')
  .reply(200, fs.readFileSync('./test/fixtures/threshold_values.xml'), { server: 'NewRelic/0.8.53',
  'content-type': 'application/xml; charset=utf-8',
  'x-runtime': '41',
  'content-length': '1594',
  'cache-control': 'private, max-age=0, must-revalidate',
  vary: 'Accept-Encoding'
});

nock('https://api.newrelic.com')
  .get('/api/v1/applications/' + appid_test + '/metrics.json')
  .reply(200, fs.readFileSync('./test/fixtures/metrics.json'), { server: 'NewRelic/0.8.53',
  date: 'Fri, 02 Mar 2012 23:35:30 GMT',
  'content-type': 'application/json; charset=utf-8',
  connection: 'keep-alive',
  status: '200',
  etag: '"e6c2933b3c0af76e6ca380bdb1d6d898"',
  'x-runtime': '177',
  'content-length': '82473',
  'cache-control': 'private, max-age=0, must-revalidate'
});

nock('https://api.newrelic.com')
  .get(['/api/v1/accounts',
       accountid_test,
       'applications',
       appid_test,
       'data.json?begin=2012-03-02T08%3A00%3A00.000Z&end=2012-03-03T08%3A00%3A00.000Z&metrics=WebTransaction%2FFunction%2Fdjango.views.defaults%3Apage_not_found&field=requests_per_minute'].join("/"))
  .reply(200, fs.readFileSync('./test/fixtures/data.json'), { server: 'NewRelic/0.8.53',
  'content-type': 'application/json; charset=utf-8',
  'x-runtime': '58',
  'content-length': '4370',
  'cache-control': 'private, max-age=0, must-revalidate'
});

vows.describe('New Relic Api').addBatch({
  'A NewRelicApi object': {
    topic: function(){
      var NewRelicApi = require('../lib/newrelicapi');
      return NewRelicApi;
    },
    'when setting an API key': {
      topic: function (NewRelicApi) {
        return NewRelicApi.setApiKey(apikey_test);
      },
      'returns the API key': function (topic) {
        assert.equal(topic, apikey_test);
      }
    },
    'when an Account ID is set': {
      topic: function(NewRelicApi){
        return NewRelicApi.setAccountId(accountid_test);
      },
      'has an Account ID': function (topic) {
        assert.equal(topic, accountid_test);
      }
    },
    'when asked for applications': {
      topic: function (NewRelicApi) {
        NewRelicApi.getApplications(this.callback);
      },
      "doesn't return error and returns an applications list": function (err, apps) {
        assert.equal(err, null);
        assert.equal(typeof(apps), "object");
        assert.equal(apps.length, 2);
      },
      "first application has id 123 and name 'My Application'": function (err, apps) {
        assert.equal(apps[0].id, "123");
        assert.equal(apps[0].name, "My Application");
      }
    },
    'when asked for summary metrics': {
      topic: function(NewRelicApi) {
        NewRelicApi.getSummaryMetrics(appid_test, this.callback);
      },
      "doesn't return error and returns a list of threshold values": function(err, tvs) {
        assert.equal(err, null);
        assert.equal(typeof(tvs), "object");
      },
      "first threshold value has all attributes": function(err, tvs) {
        var ftv = tvs[0];
        assert.notEqual(ftv.name, null);
        assert.notEqual(ftv.formatted_metric_value, null);
        assert.notEqual(ftv.metric_value, null);
        assert.notEqual(ftv.threshold_value, null);
        assert.notEqual(ftv.begin_time, null);
        assert.notEqual(ftv.end_time, null);
      }
    },
    'when asked for application metrics': {
      topic: function(NewRelicApi) {
        NewRelicApi.getAppMetrics(appid_test, this.callback);
      },
      "doesn't return error but returns a list of metrics": function(err, metrics) {
        assert.equal(err, null);
        assert.equal(typeof(metrics), "object");
      },
      "number of metrics is 8": function(err, metrics) {
        assert.equal(metrics.length, 8);
      }
    },
    'when asked for a metric': {
      topic: function(NewRelicApi) {
        var options = {
          begin: "2012-03-02T08:00:00.000Z",
          end: "2012-03-03T08:00:00.000Z",
          metrics: ['WebTransaction/Function/django.views.defaults:page_not_found'],
          field: 'requests_per_minute',
          appId: appid_test
        };
        NewRelicApi.getMetrics(options, this.callback);
      },
      "doesn't return an error but returns the metrics": function(err, metrics) {
        assert.equal(err, null);
        assert.equal(typeof(metrics), "object");
      },
      "number of metrics is 24": function(err, metrics) {
        assert.equal(metrics.length, 24);
      }
    }
  }
}).export(module);
