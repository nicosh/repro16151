"use strict";
const _ = require("lodash");
const slugify = require("@sindresorhus/slugify");
const allPermissions = require("./app_permissions");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   * Andiamo a popolare i permessi di default
   */

  async bootstrap({ strapi }) {},
};
