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
      
      if (user.username ==  username && user.password == password) {
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
      res.redirect("/admin/signin");
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
//   events: [
//     {
//       title: 'Camera 1',
//       description: 'description for Long Event',
//       start: '2018-08-01 11:00',      
//       end: '2022-08-02 11:00'
//     },
// ],
  viewDashboard: async (req, res) => {
    try {
      const booking = await tbBooking.find()
      .populate({ path: 'product_id', model: 'product' })
      .populate({ path: 'customer_id', model: 'customer' , select: 'name'})
    //  .populate('products')
      const customer = await tbCustomer.find()
      const products = await tbProduct.find()
      // .populate({ path: 'customer_id',})
      // .populate({ path: 'user_id',})
      // for (let i = 0; i < booking.length; i++) {
      //   console.Console.log
      // }
    

      // const product = booking.map(x => x.product_id)
      // const nameCustomer = booking.map(x => x.customer_id).map(y => y.name);


      console.log("booking " , booking)
      // console.log('booking', booking);

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/dashboard/view_dashboard', {
        title: "Nusa | Dashboard",
        user: req.session.user,
        booking,
        customer,
        products,
        // nameCustomer: nameCustomer,
        alert,
      });
    
    } catch (error) {
      console.log("error " , error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect('/admin/dashboard');
    }
  },
  

  addBook: async (req, res) => {
    const { barcode } = req.body;
    const productSearch = await tbProduct.findOne({ barcode: barcode , status: 'AVALAIBLE' })
    .populate("discount_id")

    try {       
      //ini ulang dari render view
      const product = await tbProduct.find()
      .populate({ path: 'discount_id', select: 'typeDiscount amount' })
      
      // const member = await tbMember.find()
      const discount = await tbDiscount.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };


      const mapList = list.map(x => x.barcode)
      if(!productSearch ||  mapList.includes(barcode) ){
        req.flash("alertMessage", "Product already choose or not avalaible");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/dashboard`);
      } else {
        list.push(productSearch);
        res.render('admin/dashboard/view_dashboard', {
          title: "Nusa | Dashboard",
          user: req.session.user,
          product,
          list,
          // member,
          discount,
          alert
        });
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect(`/admin/dashboard`);
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