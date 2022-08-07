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
  viewUser: async (req, res) => {
    try {
      const dataUser = await users.find()
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
      res.render('admin/user/view_user', {
        title: "Nusa | Karyawan",
        user: req.session.user, 
        dataUser,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/user");
    }
  },

  addUser: async (req, res) => {
    try {
      const {namaKaryawan, password, statusPenempatan, status  } = req.body;
        const  newItem = {
          username : namaKaryawan, 
          password,
          statusPenempatan, 
          status,
        }
       await users.create(newItem);
        req.flash("alertMessage", "Succes Add User");
        req.flash("alertStatus", "success");
        res.redirect("/admin/user");

    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/user");
    }
  },

  editUser : async (req, res) => {
    const {id, namaKaryawan, password, statusPenempatan, status } = req.body;
    try {
      const dataUser = await users.findOne({ _id: id })
      dataUser.username = namaKaryawan;
      dataUser.password = password;
      dataUser.statusPenempatan = statusPenempatan;
      dataUser.status = status;
      await dataUser.save();
      req.flash("alertMessage", "Succes Update Karyawan");
      req.flash("alertStatus", "success");
      res.redirect("/admin/user");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
     res.redirect("/admin/user");
    }
   },

   deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const dataUser = await users.findOne({ _id: id })
      await dataUser.remove();
      req.flash('alertMessage', 'Success Delete Karyawan');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/user');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/user');
    }
  },

}