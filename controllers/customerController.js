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
          const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
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
}

