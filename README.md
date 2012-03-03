
NewRelic API wrapper for nodejs
===============================

[node-newrelicapi](https://github.com/philk/node-newrelicapi) is a simple API wrapper for the [NewRelic API](http://newrelic.github.com/newrelic_api/) written in nodejs.

## Installation

`npm install newrelicapi`

## Usage

```javascript
var newrelic = require('newrelicapi');

newrelic.setAccountId(ACCOUNT_ID_HERE);
newrelic.setApiKey(APIKEY_HERE)

// Get a list of applications on the account
newrelic.getApplications(function(err, apps){
  if (err) {
    console.log(err);
  }else{
    console.log(apps);
  }
});

// Get a list of summary metrics for an application
var appId = 'Application ID from getApplications';
newrelic.getSummaryMetrics(appId, function(err, metrics){
  if (err) {
    console.log(err);
  }else{
    console.log(metrics);
  }
});

// Get a list of available metrics for an application
var appId = 'Application ID from getApplications';
newrelic.getAppMetrics(appId, function(err, metrics){
  if (err) {
    console.log(err);
  }else{
    console.log(metrics);
  }
});

// Specify a begin and end date range, list of metric names, a field, and an
// application id.
// Get back those metrics.
var options = {
  begin: yesterday.toISOString(),
  end: today.toISOString(),
  metrics: list_of_metric_names,
  field: infield,
  appId: appId
};
newrelic.getMetrics(options, function(err, metrics){
  if (err) {
    console.log(err);
  }else{
    console.log(metrics);
  }
});
```

## Tests

Tests use the [vows](http://vowsjs.org/) project. To run them:

```
npm install --dev
npm test
```

## Todo

- Add inline documentation/comments for methods
- Add more tests
- Add better handling of failures returned from the API
  - Currently I just ignore the status code returned and pass through the body. That kind of sucks and it'd be better to return a helpful error.
- Add remaining APIs
  - Deployments
- Add re and limit to metric names request
  - You can filter the list of metric names using a regular expression parameter (re).
  - You can limit the list of metric names using limit.

## Contributing

Fork the repo, create a branch, and submit a pull request.

## License

Copyright [2012] [Phil Kates]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

