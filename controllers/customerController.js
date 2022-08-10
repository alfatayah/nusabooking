const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
const tbCustomer = require('../models/customer');
// var _id = mongoose.Types.ObjectId();


module.exports = {
  viewCustomer: async (req, res) => {
    try {
      const customer = await tbCustomer.find();
      // untuk alert message dia call component dari partials/message.ejs
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus, user: req.session.user };
      res.render('admin/customer/view_customer', {
        title: "Nusa | Product",
        user: req.session.user,
        customer,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/customer");
    }
  },


  addCustomer: async (req, res) => {
    try {
      const { nik, name, username_ig } = req.body;
      const newItem = {
        nik, name, username_ig
      }
      await tbCustomer.create(newItem);
      req.flash("alertMessage", "Succes Add Customer");
      req.flash("alertStatus", "success");
      res.redirect("/admin/customer");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/customer");
    }
  },

  editCustomer : async (req, res) => {
    const {id, nik, name, username_ig  } = req.body;
    try {
      const customer = await tbCustomer.findOne({ _id: id })
      customer.nik = nik;
      customer.name = name;
      customer.username_ig = username_ig;
      await customer.save();
      req.flash("alertMessage", "Succes Update Customer");
      req.flash("alertStatus", "success");
      res.redirect("/admin/customer");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
     res.redirect("/admin/customer");
    }
   },

   deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await tbCustomer.findOne({ _id: id })
      await customer.remove();
      req.flash('alertMessage', 'Success Delete Customer');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/customer');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/customer');
    }
  },


}

