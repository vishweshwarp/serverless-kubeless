/*
 Copyright 2017 Bitnami.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');
const getInfo = require('../lib/get-info');
const helpers = require('../lib/helpers');

class KubelessInfo {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('kubeless');
    this.commands = {
      info: {
        usage: 'Display information about the current functions',
        lifecycleEvents: [
          'info',
        ],
        options: {
          verbose: {
            usage: 'Display metadata',
            shortcut: 'v',
          },
        },
      },
    };
    this.hooks = {
      'info:info': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.infoFunction),
    };
  }

  validate() {
    const unsupportedOptions = ['stage', 'region'];
    helpers.warnUnsupportedOptions(
      unsupportedOptions,
      this.options,
      this.serverless.cli.log.bind(this.serverless.cli)
    );
    return BbPromise.resolve();
  }

  infoFunction(options) {
    return getInfo(this.serverless.service.functions, _.defaults({}, options, {
      namespace: this.serverless.service.provider.namespace,
      verbose: this.options.verbose,
      log: this.serverless.cli.consoleLog,
    }));
  }
}

module.exports = KubelessInfo;
