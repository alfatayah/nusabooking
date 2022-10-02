const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const users = require('../models/user');
const tbProduct = require('../models/product');
const tbType = require('../models/type');
const tbMerk = require('../models/merk');
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
// var _id = mongoose.Types.ObjectId();
var utils = require('../utils/utilization');


module.exports = {
  viewProduct: async (req, res) => {
    try {
      const product = await tbProduct.find()
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
      res.render('admin/product/view_product', {
        title: "Nusa | Product",
        user: req.session.user,
        product,
        utils,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/product");
    }
  },

  addProduct: async (req, res) => {
    try {
      const { product_name, tipe, barcode, price, status_produk } = req.body;
      const newItem = {
        product_name, tipe, barcode, price, status_produk
      }
       await tbProduct.create(newItem);  
        req.flash("alertMessage", "Succes Add Product");
        req.flash("alertStatus", "success");
        res.redirect("/admin/product");
      

    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/product");
    }
  },

  editProduct: async (req, res) => {
    const {id, product_name, tipe, barcode, price } = req.body;
    try {
      const product = await tbProduct.findOne({ _id : id})
      product.product_name = product_name;
      product.tipe = tipe;
      product.barcode = barcode;
      product.price = price;
     await product.save();
     req.flash("alertMessage", "Succes Update Produk");
     req.flash("alertStatus", "success");
     res.redirect("/admin/product");
    } catch (error) {
     req.flash("alertMessage", `${error.message}`);
     req.flash("alertStatus", 'danger');
     res.redirect("/admin/product");
    }
   },

   deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await tbProduct.findOne({ _id: id });
      await product.remove();
      req.flash('alertMessage', 'Success Delete Product');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/product');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/product');
    }
  },

}