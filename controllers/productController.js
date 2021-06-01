const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const users = require('../models/User');
const tbProduct = require('../models/product');
const tbTrans = require('../models/Transaction');
const tbMember = require('../models/Member');
const tbType = require('../models/type');
const tbMerk = require('../models/merk');
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
// var _id = mongoose.Types.ObjectId();


module.exports = {
  viewProduct: async (req, res) => {
    try {
      const product = await tbProduct.find()
      .populate({ path: 'typeId', select: 'id name' })
      .populate({ path: 'merkId', select: 'id name' })
      console.log("product data " , product);
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
      res.render('admin/product/view_product', {
        title: "Nusa | Product",
        user: req.session.user, 
        product,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/product");
    }
  },

  addProduct: async (req, res) => {
    const item =  { product_name, typeId, merkId, status, price , description , barcode  } = req.body;
    console.log("item " , item);
    console.log("req.file " , req.file);
    try {
      const { product_name, typeId, merkId, status, price , description , barcode  } = req.body;
      if(req.file){
        const image = `images/${req.file.filename}`
        const dataType = await tbType.findOne({_id: typeId});
        console.log("dataType " , dataType);
        const dataMerk = await tbMerk.findOne({_id : merkId});
        console.log("dataMerk " , dataMerk);
        const  newItem = {
          typeId,
          merkId,
          product_name, 
          status, 
          description, 
          image,
          price ,
          barcode  
        }
        console.log("newItem " , newItem);
        const dataItem = await tbProduct.create(newItem);
        console.log("dataitem ID " , dataItem._id);
        dataType.product_id.push({product_id : dataItem._id})
        await dataType.save();
        dataMerk.product_id.push({product_id : dataItem._id})
        await dataMerk.save();
        req.flash("alertMessage", "Succes Add Product");
        req.flash("alertStatus", "success");
        res.redirect("/admin/product");
      }

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

   deleteProduct: async (req, res) => {
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