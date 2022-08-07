const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const users = require('../models/user');
const tbProduct = require('../models/product');
const tbTrans = require('../models/transaction');
const tbMember = require('../models/member');
const tbType = require('../models/type');
const tbMerk = require('../models/merk');
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
// var _id = mongoose.Types.ObjectId();


module.exports = {
  // viewType: async (req, res) => {
  //   try {
  //     const type = await tbType.find()
  //     const alertMessage = req.flash("alertMessage");
  //     const alertStatus = req.flash("alertStatus");
  //     const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
  //     res.render('admin/type/view_type', {
  //       title: "Nusa | Type",
  //       user: req.session.user, 
  //       type,
  //       alert,
  //     });
  //   } catch (error) {
  //     req.flash("alertMessage", `${error.message}`);
  //     req.flash("alertStatus", 'danger');
  //     res.redirect("/admin/type");
  //   }
  // },

  addType: async (req, res) => {
    try {
      const { name  } = req.body;
       await tbType.create({name});
        req.flash("alertMessage", "Succes Add Type");
        req.flash("alertStatus", "success");
        res.redirect("/admin/type");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/type");
    }
  },

  editType : async (req, res) => {
    const {id, name  } = req.body;
    try {
      const type = await tbType.findOne({ _id: id })
      type.name = name;
      await type.save();
      req.flash("alertMessage", "Succes Update Type");
      req.flash("alertStatus", "success");
      res.redirect("/admin/type");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
     res.redirect("/admin/type");
    }
   },

   deleteType: async (req, res) => {
    try {
      const { id } = req.params;
      const type = await tbType.findOne({ _id: id });
      await type.remove();
      req.flash('alertMessage', 'Success Delete Type');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/type');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/type');
    }
  },

}