const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const users = require('../models/user');
const tbProduct = require('../models/product');
const tbCustomer = require('../models/customer');
const tbType = require('../models/type');
const tbMerk = require('../models/merk');
const tbBooking = require('../models/booking');
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
var moment = require('moment');  
var list = [];
module.exports = {
  viewSignIn: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user == undefined) {
        res.render('index', {
          alert,
          title: "Nusa | Login"
        });
      } else {
        res.redirect('/admin/dashboard');
      }
    } catch (error) {
      res.redirect('/admin/signin');
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await users.findOne({ username: username });
   
      if (!user) {
        req.flash("alertMessage", "User Not Found !");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
      
      if (user.username == username && user.password == password) {
        req.session.user = {
          id: user.id,
          username: user.username,
          status : user.status
        }
        res.redirect('/admin/dashboard');
      }else{
        req.flash("alertMessage", "Username or Password Not Match !");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
    } catch (error) {
    }
  },

  actionLogout: async (req, res) => {
    req.session.destroy();
    res.redirect('/admin/signin');
  },

  viewType: async (req, res) => {
    try {
      list.splice(0, list.length )
      const type = await tbType.find()
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
      res.render('admin/type/view_type', {
        title: "Nusa | Type",
        user: req.session.user, 
        type,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/type");
    }
  },
  
  viewMerk: async (req, res) => {
    try {
      list.splice(0, list.length )
      const merk = await tbMerk.find()
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
      res.render('admin/merk/view_merk', {
        title: "Nusa | Merk",
        user: req.session.user, 
        merk,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/merk");
    }
  },
  viewDashboard: async (req, res) => {
    try {
      const booking = await tbBooking.find()
      .populate({ path: 'product_id', model: 'product' })
      .populate({ path: 'customer_id', model: 'customer' , select: 'name'})
      .populate({ path: 'user_id', model: 'user' , select: 'username'})
      const customer = await tbCustomer.find()
      const products = await tbProduct.find()

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/dashboard/view_dashboard', {
        title: "Nusa | Dashboard",
        user: req.session.user,
        booking,
        customer,
        products,
        alert,
      });
    
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect('/admin/dashboard');
    }
  },

  viewBooking: async (req, res) => {
    try {
      const booking = await tbBooking.find()
      .populate({ path: 'product_id', model: 'product' })
      .populate({ path: 'customer_id', model: 'customer' , select: 'name'})
      .populate({ path: 'user_id', model: 'user' , select: 'username'})
      const customer = await tbCustomer.find()
      const products = await tbProduct.find()

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/booking/view_booking', {
        title: "Nusa | Booking",
        user: req.session.user,
        booking,
        customer,
        products,
        alert,
      });
    
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect('/admin/booking');
    }
  },

  viewDetailBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const detailData = await tbBooking.findOne({_id : id})
      .populate({ path: 'product_id', model: 'product'})
      let dataProduct = [];
      detailData.product_id.forEach(element => {
         dataProduct.push(element.product_name)
      });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/booking/view_detail', {
        title: "Nusa | Detail Booking",
        user: req.session.user,
        dataProduct,
        alert
      });
    
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect('/admin/booking');
    }
  },

  addBook: async (req, res) => {
    const {user_id, customer_id, productbook, statusPenempatan, start_date, end_date, booking_date} = req.body;
    // Change data string to array example '0,1' => ['0','1']
    var arrProduct = productbook.split(",").map(x => x);
    const newData = {
      product_id : arrProduct,
      customer_id,
      user_id,
      start_date, 
      end_date,
      booking_date,
      lokasi_pengambilan: statusPenempatan,
    }
    try {       
      await tbBooking.create(newData);  
      arrProduct.forEach(async res => {
      const product = await tbProduct.findOne({ _id: res })
      product.dateBooked.push(start_date);
      await product.save();
      });
     
      req.flash("alertMessage", "Succes Add Booking");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect(`/admin/booking`);
    }
  },

  editBooking : async (req, res) => {
    const {user_id, customer_id, productbook, statusPenempatan, start_date, end_date} = req.body;
    try {
      const booking = await tbBooking.findOne({ _id: id })
      booking.user_id = user_id;
      booking.customer_id = customer_id;
      booking.productbook = productbook;
      booking.username_ig = username_ig;
      await booking.save();
      req.flash("alertMessage", "Succes Update Booking");
      req.flash("alertStatus", "success");
      res.redirect("/admin/customer");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
     res.redirect("/admin/customer");
    }
   },


   deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await tbBooking.findOne({ _id: id });
      await booking.remove();
      req.flash('alertMessage', 'Success Delete Booking');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/booking');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/booking');
    }
  },

  
 

}