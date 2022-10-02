const bycrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require('path');
const tbProduct = require('../models/product');
// const tbMember = require('../models/member');
const tbType = require('../models/type');
const tbMerk = require('../models/merk');

module.exports = {
    getProduct: async (req, res) => {
        try {
            const product = await tbProduct.find()
                .populate({ path: 'typeId', select: 'id name' })
                .populate({ path: 'merkId', select: 'id name' })
            const merk = await tbMerk.find();
            const type = await tbType.find();
            res.status(200).json({
                message: "Success GET Product",
                "response": 200,
                "result": {
                    product,
                    merk,
                    type,
                }
            })
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
}




