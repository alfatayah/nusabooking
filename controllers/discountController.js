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
  // viewDiscount: async (req, res) => {
  //   try {
  //     const discount = await tbDiscount.find()
  //     const alertMessage = req.flash("alertMessage");
  //     const alertStatus = req.flash("alertStatus");
  //     const alert = { message: alertMessage, status: alertStatus , user: req.session.user };
  //     res.render('admin/discount/view_discount', {
  //       title: "Nusa | Discount",
  //       user: req.session.user, 
  //       discount,
  //       alert,
  //     });
  //   } catch (error) {
  //     req.flash("alertMessage", `${error.message}`);
  //     req.flash("alertStatus", 'danger');
  //     res.redirect("/admin/discount");
  //   }
  // },

  addDiscount: async (req, res) => {
    try {
      const {typeDiscount, amount, description, status  } = req.body;
        const  newItem = {
          typeDiscount,
          amount,
          description, 
          status,
        }
        const dataItem = await tbDiscount.create(newItem);
        await dataItem.save();

        const discount = await tbDiscount.find();
        const mapidDiscount = discount.map(x => x.id);
        const mapTypediscount = discount.map(x => x.typeDiscount);
        const mapAmount = discount.map(x => x.amount);

        const product = await tbProduct.find();
        const mapidProduct = product.map(z => z.id);
        for (let i = 0; i < product.length; i++) {
          const productPush = await tbProduct.findOne({ _id: product[i].id })
          productPush.discount_id = mapidDiscount;
          await productPush.save();
        }

        for (x = 0; x < discount.length; x++) {
          const discountPush = await tbDiscount.findOne({ _id: discount[x].id})
          discountPush.product_id = mapidProduct;
          await discountPush.save();
        }


        req.flash("alertMessage", "Succes Add Discount");
        req.flash("alertStatus", "success");
        res.redirect("/admin/discount");

    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
      res.redirect("/admin/discount");
    }
  },

  editDiscount : async (req, res) => {
    const {id, typeDiscount, amount, description, status  } = req.body;
    try {
      const discount = await tbDiscount.findOne({ _id: id })
      discount.typeDiscount = typeDiscount;
      discount.amount = amount;
      discount.description = description;
      discount.status = status;
      await discount.save();
      req.flash("alertMessage", "Succes Update Discount");
      req.flash("alertStatus", "success");
      res.redirect("/admin/discount");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", 'danger');
     res.redirect("/admin/discount");
    }
   },

   deleteDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      const discount = await tbDiscount.findOne({ _id: id });
      await discount.remove();
      req.flash('alertMessage', 'Success Delete Discount');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/discount');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/discount');
    }
  },

}