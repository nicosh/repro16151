'use strict';

/**
 * app-log service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::app-log.app-log');
