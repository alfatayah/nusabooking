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
  // viewMerk: async (req, res) => {
  //   try {
  //     const merk = await tbMerk.find()
  //     const alertMessage = req.flash("alertMessage");
  //     const alertStatus = req.flash("alertStatus");
  //     const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
  //     res.render('admin/merk/view_merk', {
  //       title: "Nusa | Merk",
  //       user: req.session.user, 
  //       merk,
  //       alert,
  //     });
  //   } catch (error) {
  //     req.flash("alertMessage", `${error.message}`);
  //     req.flash("alertStatus", 'danger');
  //     res.redirect("/admin/merk");
  //   }
  // },

  addMerk: async (req, res) => {
    try {
      const { name  } = req.body;
       await tbMerk.create({name});
        req.flash("alertMessage", "Succes Add Merk");
        req.flash("alertStatus", "success");
        res.redirect("/admin/merk");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/merk");
    }
  },

  editMerk : async (req, res) => {
    const {id, name  } = req.body;
    try {
      const merk = await tbMerk.findOne({ _id: id })
      merk.name = name;
      await merk.save();
      req.flash("alertMessage", "Succes Update Merk");
      req.flash("alertStatus", "success");
      res.redirect("/admin/merk");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
     res.redirect("/admin/merk");
    }
   },

   deleteMerk: async (req, res) => {
    try {
      const { id } = req.params;
      const merk = await tbMerk.findOne({ _id: id });
      await merk.remove();
      req.flash('alertMessage', 'Success Delete Merk');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/merk');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/merk');
    }
  },

}