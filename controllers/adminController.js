const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const users = require('../models/user');
const tbProduct = require('../models/product');
const tbTrans = require('../models/transaction');
const tbTransDetail = require('../models/transaction_detail')
const tbCustomer = require('../models/customer');
const tbType = require('../models/type');
const tbMerk = require('../models/merk');
const tbBooking = require('../models/booking');
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
var moment = require('moment');  
var list = [];
module.exports = {
  
  /**
   * sign in module
   * @module viewSignIn
   * @param  {asdasd} req asdasd
   * @param  {asdasd} res asdasd
   * @param  {asdadasd} =>{try{constalertMessage=req.flash('alertMessage'
   * @param  {asdasd} ;constalertStatus=req.flash('alertStatus'
   * @param  {alertMessage} ;constalert={message
   * @param  {alertStatus};if(req.session.user===null||req.session.user==undefined} status
   */
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
      res.redirect(`/admin/transaction/detail`);
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
    const {user_id, customer_id , datetimes, productbook, statusPenempatan, start_date, end_date} = req.body;
    // Change data string to array example '0,1' => ['0','1']
    var arrProduct = productbook.split(",").map(x => x);
    const newData = {
      product_id : arrProduct,
      customer_id,
      user_id,
      start_date, 
      end_date,
      lokasi_pengambilan: statusPenempatan,
    }
    try {       
      await tbBooking.create(newData);  
      req.flash("alertMessage", "Succes Add Booking");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect(`/admin/booking`);
    }
  },

  addTrans: async (req, res) => {
    var transid = mongoose.Types.ObjectId();
    var transdetail_id = mongoose.Types.ObjectId();
    const trans = await tbTrans.find();
    const numberinvoice =  trans.length + 1;
    const invoice = "INV"+ moment().format('DDMMYY') + numberinvoice ;
    const status = "NOT_DONE";
    const { select2, productId, jaminan  , days , subtotal, diskonID, total_discount, total,  desc_trans, date_transaction, userid,  start_date , end_date  }  = req.body;
    const product = await tbProduct.find({ _id : productId});
    // const member = await tbMember.findOne({_id : select2});
    const transactionWithDiskon = {
      _id: transid,
      // member_Id: select2, 
      subtotal, 
      total,
      total_discount, 
      start_date, 
      end_date, 
      days,
      invoice,
      status, 
      jaminan,
      date_transaction,
      userid,
      product_id: productId,
      discountId: diskonID,
      payment_method: "_",
      desc_trans,
      transdetail_id,
    }
    const newTransaction = {
      _id: transid,
      // member_Id: select2, 
      subtotal, 
      total,
      total_discount, 
      start_date, 
      end_date, 
      days,
      invoice,
      status, 
      jaminan,
      date_transaction,
      userid,
      product_id: productId,
      payment_method: "_",
      desc_trans,
      transdetail_id,
    }

    try {
      if(!productId || product.status === "NOT AVALAIBLE" ){
        req.flash("alertMessage", "Product Empty or Not Avalaible");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/dashboard`);
      } else {
        await tbTrans.create(diskonID ? transactionWithDiskon : newTransaction );
        await tbTransDetail.create({ _id:transdetail_id , transaction_Id: transid , dp_id : null , split_id : null, cash_id: null , kasbon_id: null, transfer_id: null})
        for (var i = 0; i < product.length; i++){
          product[i].status = "NOT AVALAIBLE";
          product[i].transaction_Id.push({_id : transid})
          await product[i].save();
        }

        member.transaction_Id.push({_id : transid});
        await member.save();
        
        list.splice(0, list.length )
        req.flash("alertMessage", "Succes Add Transaction");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/dashboard`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect(`/admin/dashboard`);
    }
  },

  // ALL report 
  reportCustomer: async (req, res) => {
    try {
      // untuk alert message dia call component dari partials/message.ejs
      // const member = await tbMember.find()
      // .populate({ path: 'transaction_Id '})
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
      res.render('admin/report/view_customer', {
        title: "Nusa | Laporan Pelanggan",
        user: req.session.user, 
        // member,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/report");
    }
  },
 

}