const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const users = require('../models/user');
const tbTrans = require('../models/transaction');
const tbTransDetail = require('../models/transaction_detail');
const tbProduct = require('../models/product');
// const tbMember = require('../models/customer');
const tbType = require('../models/type');
const tbMerk = require('../models/merk');
const payment_cash = require('../models/cash_payment');
const payment_transfer = require('../models/transfer_payment');
const kasbon_payment = require("../models/kasbon_payment");
const dp_payment = require("../models/dp_payment");
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
var moment = require('moment');


module.exports = {
  viewTransaction: async (req, res) => {
    try {
      // operator $ne == not equal value
      // operator $nin == not equal with 2 value
      const trans = await tbTrans.find({ status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
        .populate({path : 'userid' })
      // const member = await tbMember.find()
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus, user: req.session.user };
      res.render('admin/transaction/view_transaction', {
        title: "Nusa | Transaction",
        user: req.session.user,
        trans,
        // member,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/transaction");
    }
  },

  viewTransactionLast7Days: async (req, res) => {
    try {
      // operator $ne == not equal value
      // operator $nin == not equal with 2 value
      let allData = [];
      const today = moment().format('DD-MMM-YY');
      const last1 = moment().subtract(1, 'days').format('DD-MMM-YY');
      const last2 = moment().subtract(2, 'days').format('DD-MMM-YY');
      const last3 = moment().subtract(3, 'days').format('DD-MMM-YY');
      const last4 = moment().subtract(4, 'days').format('DD-MMM-YY');
      const last5 = moment().subtract(5, 'days').format('DD-MMM-YY');
      const last6 = moment().subtract(6, 'days').format('DD-MMM-YY');
      const last7 = moment().subtract(7, 'days').format('DD-MMM-YY');

      const dayToday = await tbTrans.find({ date_transaction: today, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
      const day1 = await tbTrans.find({ date_transaction: last1, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
      const day2 = await tbTrans.find({ date_transaction: last2, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
        const day3 = await tbTrans.find({ date_transaction: last3, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
        const day4 = await tbTrans.find({ date_transaction: last4, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
        const day5 = await tbTrans.find({ date_transaction: last5, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
        const day6 = await tbTrans.find({ date_transaction: last6, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
        const day7 = await tbTrans.find({ date_transaction: last7, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
       allData.push(dayToday, day1, day2, day3, day4, day5, day6, day7); 

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus, user: req.session.user };
      res.render('admin/transaction/view_transaction_last7', {
        title: "Nusa | Transaction",
        user: req.session.user,
        alert,
        allData,
      });

    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/transaction/transaction_7days");
    }

  },

  filterbyDate: async (req, res) => {
    try {
      const { startDate } = req.query;
      // const trans = await tbTrans.find({ 
      //   date_transaction: { $gte: startDate ,  $lt : endDate}}).sort({ date_transaction: 'asc'})
      console.log("startDate ", startDate);
      console.log("endDate ", endDate);

      const trans = await tbTrans.find({ date_transaction: { $gte: startDate, $lt: endDate }, status: { $nin: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
      // const member = await tbMember.find()
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus, user: req.session.user };
      res.render('admin/transaction/view_transaction', {
        title: "Nusa | Transaction",
        user: req.session.user,
        trans,
        // member,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/transaction/");

    }
  },

  viewTransactionKasbon: async (req, res) => {
    try {
      const trans = await tbTrans.find({ status: { $in: ['KASBON', 'DP'] } })
        .populate({ path: 'member_Id ', select: 'no_member name' })
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus, user: req.session.user };
      res.render('admin/transaction/view_kasbon', {
        title: "Nusa | Transaction",
        user: req.session.user,
        trans,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/transaction/kasbon");
    }
  },

  showDetailTransaction: async (req, res) => {
    const { id } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const trans_detail = await tbTransDetail.findOne({ _id: id })
        .populate({ path: "transaction_Id", populate: { path: "discountId" } })
        .populate('dp_id')
      let transID = trans_detail.transaction_Id._id;
      const trans = await tbTrans.findOne({ _id: transID })
        .populate("product_id")

      res.render("admin/transaction/show_detail_transaction", {
        title: "Staycation | Detail Transaction",
        user: req.session.user,
        trans_detail,
        trans,
        alert
      });
    } catch (error) {
      console.log("error  ", error);
      res.redirect(`/admin/transaction/detail`);
    }
  },

  /**
   * @module cancelTransaction
   * @param req body get id and desc transaction from table transaction
   * @param res redirect to /admin/transaction 
   * @description Get id and desc from req.body then status update to "CANCEL" after that save all data to table transaction
   * @todo Cancel transaction when admin wrong input data in system
   */
  cancelTransaction: async (req, res) => {
    const { id, desc } = req.body;
    try {
      const trans = await tbTrans.findOne({ _id: id })
      trans.status = "CANCEL";
      trans.desc_trans = desc;
      await trans.save();
      req.flash("alertMessage", "Succes Cancel Transaction");
      req.flash("alertStatus", "success");
      res.redirect("/admin/transaction");
    } catch (error) {
      console.log("error  ", error);
      res.redirect(`/admin/transaction`);
    }
  },



 

  /**
  * @module paymentTransfer
  * @param req body get id_transaction from input user
  * @param res redirect to /admin/transaction 
  * @description
  *  1. Update status transaksi to "PAYMENT" 
  *  2. Update status payment method to "TRANSFER" 
  *  3. Save data to table transfer_payment , 
  *  4. Save id payment transfer to table transaction detail
  * @todo transfer payment when user choose payment method transfer
  */
  paymentTransfer: async (req, res) => {
    const { id_transaction, no_transfer } = req.body;
    try {
      // update status transaksi
      const trans = await tbTrans.findOne({ _id: id_transaction })
      trans.status = "PAYMENT";
      trans.payment_method = "TRANSFER";
      await trans.save();
      //save ke table transfer_payments
      const newItem = {
        no_transfer,
        transdetail_id: trans.transdetail_id,
      }
      const paymentTransfer = await payment_transfer.create(newItem);
      const transDetail = await tbTransDetail.findOne({ _id: trans.transdetail_id })
      transDetail.transfer_id = paymentTransfer._id;
      await transDetail.save();
      req.flash("alertMessage", "Success Payment Transaction !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/transaction")
    } catch (error) {
      req.flash("alertMessage", "Failed Payment Transaction ! ");
      req.flash("alertStatus", "danger");
      console.log("error  ", error);
      res.redirect("/admin/transaction")
    }
  },

  /**
 * @module paymentKasbon
 * @param req body get id_transaction and dateline from input user
 * @param res redirect to /admin/transaction 
 * @description
 *  1. Update status transaksi to "KASBON" 
 *  2. Update status payment method to "KASBON" 
 *  3. Save data to table kasbon_payment , 
 *  4. Save id payment kasbon to table transaction detail
 * @todo transfer payment when user choose payment method transfer
 */
  paymentKasbon: async (req, res) => {
    const { id_transaction, dateline } = req.body;
    try {
      // update status transaksi
      const trans = await tbTrans.findOne({ _id: id_transaction });
      trans.status = "KASBON";
      trans.payment_method = "KASBON";
      await trans.save();
      // save ke table kasbon_payments
      const newItem = {
        due_date: dateline,
        transdetail_id: trans.transdetail_id,
      }
      const kasbonPayment = await kasbon_payment.create(newItem);
      const transDetail = await tbTransDetail.findOne({ _id: trans.transdetail_id })
      transDetail.kasbon_id = kasbonPayment._id;
      await transDetail.save();
      req.flash("alertMessage", "Success Payment Transaction !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/transaction")
    } catch (error) {
      req.flash("alertMessage", "Failed Payment Transaction ! ", error);
      req.flash("alertStatus", "danger");
      console.log("error  ", error);
      res.redirect("/admin/transaction")
    }
  },

  paymentDP: async (req, res) => {
    const { id_transaction, paid_dp, due_date, fix_total } = req.body;
    try {
      // update status transaksi
      const trans = await tbTrans.findOne({ _id: id_transaction });
      trans.status = "DP";
      trans.payment_method = "DP";
      trans.total = fix_total;
      await trans.save();
      // save ke table kasbon_payments
      const newItem = {
        paid: paid_dp,
        due_date,
        transdetail_id: trans.transdetail_id,
      }
      const dpPayment = await dp_payment.create(newItem);
      const transDetail = await tbTransDetail.findOne({ _id: trans.transdetail_id })
      transDetail.dp_id = dpPayment._id;
      await transDetail.save();
      req.flash("alertMessage", "Success Payment Transaction !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/transaction")
    } catch (error) {
      req.flash("alertMessage", "Failed Payment Transaction ! ", error);
      req.flash("alertStatus", "danger");
      console.log("error  ", error);
      res.redirect("/admin/transaction")
    }
  },

  showPrintTransaction: async (req, res) => {
    const { id } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const trans_detail = await tbTransDetail.findOne({ _id: id })
        .populate({ path: "transaction_Id", populate: { path: "discountId" } })
      let transID = trans_detail.transaction_Id._id;
      const trans = await tbTrans.findOne({ _id: transID })
        .populate("product_id")
        .populate("member_Id")
      console.log("data trans ", trans);
      res.render("admin/transaction/print", {
        title: "Staycation | Print Transaction",
        user: req.session.user,
        trans_detail,
        trans,
        alert
      });
    } catch (error) {
      console.log("error  ", error);
      res.redirect(`/admin/transaction/print`);
    }
  },



}