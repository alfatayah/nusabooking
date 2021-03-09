const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const users = require('../models/users');
const tbProduct = require('../models/products');

module.exports = {
  viewSignIn: async (req, res) => {
    res.render('index');
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
      const isPasswordMatch = await bycrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Password Not Match !");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
      req.session.user = {
        id: user.id,
        username: user.username
      }
      res.redirect('/admin/dashboard');

    } catch (error) {
      res.redirect("/admin/signin");
    }
  },

  actionLogout: async (req, res) => {
    req.session.destroy();
    res.redirect('/admin/signin');
  },

  viewDashboard: async (req, res) => {
    res.render('admin/dashboard/view_dashboard');
  },

  viewProduct: async (req, res) => {
    try {
      const product = await tbProduct.find();
      console.log("product " + product);
      // untuk alert message dia call component dari partials/message.ejs
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
      res.render('admin/product/view_product', { product, alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/product");
    }
  },

  addProduct: async (req, res) => {
    try {
      const { name, merk, type , status, price , description , barcode  } = req.body;
      await tbProduct.create({ name, merk, type , status,  image: `images/${req.file.filename}` , price , description , barcode  });
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
   try {
    const { id , name, merk, type , status, price , description , barcode  } = req.body;
     const product = await tbProduct.findOne({ _id : id});
     if(req.file == undefined){
       product.name = name;
       product.merk = merk;
       product.type = type;
       product.status = status;
       product.price = price;
       product.description = description;
       product.barcode = barcode;
       await product.save();
       req.flash("alertMessage", "Succes Update Product");
       req.flash("alertStatus", "success");
       res.redirect("/admin/product");
     }else {
       await fs.unlink(path.join(`public/${product.image}`));
       product.name = name;
       product.merk = merk;
       product.type = type;
       product.status = status;
       product.image = `images/${req.file.filename}`
       product.price = price;
       product.description = description;
       product.barcode = barcode;
       await product.save();
       req.flash("alertMessage", "Succes Update Product");
       req.flash("alertStatus", "success");
       res.redirect("/admin/product");
     }
   } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", 'danger');
    res.redirect("/admin/product");
   }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await tbProduct.findOne({ _id: id });
      await fs.unlink(path.join(`public/${product.image}`));
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