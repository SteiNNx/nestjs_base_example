// src/components/payment_mdr_applied/payment_mdr_applied.route.js

/**
 * @module paymentMdrAppliedRoutes
 * @description Rutas para la gestión de Payment Merchant Discount Rate Applied.
 * Este módulo registra la(s) ruta(s) necesarias para agregar un registro de Payment MDR Applied.
 */

const express = require('express');
const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('payment_mdr_applied.route.js');

const { AddPaymentMerchantDiscountRateAppliedController } = require('./payment_mdr_applied.controller');

/**
 * @function paymentMdrAppliedRoutes
 * @description Registra la ruta para agregar un registro de Payment Merchant Discount Rate Applied.
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 * @param {string} prefixApi - Prefijo para las rutas de la API.
 */
const paymentMdrAppliedRoutes = (app, prefixApi) => {
    const routeAdd = `${prefixApi}/payment-mdr-applied/add`;
    logger.info(`Registrando ruta: [POST] ${routeAdd}`);
    app.post(routeAdd, AddPaymentMerchantDiscountRateAppliedController);
};

module.exports = paymentMdrAppliedRoutes;
