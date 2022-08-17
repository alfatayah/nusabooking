var seeder = require('mongoose-seed');
var mongoose = require('mongoose');
require('dotenv').config();
let localDB =  process.env.LOCAL_DB;
let deployDB =  process.env.DEPLOY_DB;
seeder.connect(localDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: false,
}, function () {

  // Load Mongoose models
  seeder.loadModels([
    './models/user',
    './models/customer',
    './models/merk',
    './models/product',
    './models/transaction',
    './models/transaction_detail',
    './models/type',
    './models/cash_payment',
    './models/split_payment',
    './models/transfer_payment',
    './models/kasbon_payment',
    './models/dp_payment'
  ]);

  // Clear specified collections
  seeder.clearModels(['user' , 'customer', 'merk','product' , 'transaction', 'transaction_detail', 'type', 'cash_payment', 'split_payment', 'transfer_payment','kasbon_payment', 'dp_payment'  ], function () {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });

  });
});

var data = [
  {
    'model': 'user',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903345'),
        username: 'jafar',
        password: 'rahasia',
        statusPenempatan: 'Cipadung',
        status: 'admin',
      },
      {
        _id: mongoose.Types.ObjectId('1e96cbe292b97300fc903341'),
        username: 'fadhil',
        password: 'rahasia',
        statusPenempatan: 'DU',
        status: 'staff',
      },
      {
        _id: mongoose.Types.ObjectId('1e96cbe292b17300fc903341'),
        username: 'yudha',
        password: 'rahasia',
        statusPenempatan: 'DU',
        status: 'kepala_staff',
      },
    ]
  },
  {
    'model': 'customer',
    'documents': [
      {
        
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903315'),
        no_member: 'NK000001',
        nik: 21312312313123,
        name: 'fadhil',
        username_ig: '@alfatayah',
      },
    
    ]
  },
  {
    'model': 'merk',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('1e96cbe292b97300fc904315'),
        name: 'Canon',
        product_id: [
          { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb01') },
        ]
      },
      {
        _id: mongoose.Types.ObjectId('3e96cbe292b97300fc904315'),
        name: 'Nikon',
        product_id: [
          { _id: mongoose.Types.ObjectId('1e96cbe292b97310fc90bb01') },
        ]
      }
    ]
  },
  {
    'model': 'type',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('5e96cbe392b97300fc904315'),
        name: 'Mirrorless',
        product_id: [
          { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb01') },
        ]
      },
      {
        _id: mongoose.Types.ObjectId('2e96dbe292b97300fc904315'),
        name: 'Dslr',
        product_id: [
          { _id: mongoose.Types.ObjectId('1e96cbe292b97310fc90bb01') },
        ]
      },
      
    ]
  },
  {
    'model': 'product',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb01'),
        product_name: 'Canon D100',
        tipe: "Camera",
        price: 12000,
        barcode: 'BR12345',
        status_produk:"Avalaible",
      },
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b37300fc90bb01'),
        product_name: 'Canon D300',
        tipe: "Lighting",
        price: 12000,
        barcode: 'BR121345',
        status_produk:"Booked",
      },
    ]
  },
  {
    'model': 'transaction',
    'documents': [  
      // {
      //   _id: mongoose.Types.ObjectId('5e96cbe292b97300fc101445'),
      //   member_Id:{ _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903315') },
      //   subtotal : 30000,
      //   total : 40000,
      //   total_discount : 10000,
      //   start_date: '11-1-2021',
      //   end_date: '12-1-2021',
      //   days: 1,
      //   invoice: "INV0001",
      //   status: "NOT_DONE",
      //   jaminan: "KTP", 
      //   date_transaction : '11-1-2021',
      //   user_id: mongoose.Types.ObjectId('5e96cbe292b97300fc903345'),
      //   desc_trans: "transakasi pertama bos",
      //   transdetail_id: { _id: mongoose.Types.ObjectId('5e961be292b97300fc101245') },
      // },
    ]
  },
  {
    'model': 'transaction_detail',
    'documents': [  
      // {
      //   _id: mongoose.Types.ObjectId('5e961be292b97300fc101245'),
      //   transaction_Id: { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc101445') },
      // },
    ]
  },
  {
    'model': 'cash_payment',
    'documents': [  
      {
        _id: mongoose.Types.ObjectId('1e96cbe292b973001c101445'),
        paid: 50000,
        changes : 40000,
        transdetail_id: mongoose.Types.ObjectId('5e961be292b97300fc101245'),
      },
    ]
  },
  {
    'model': 'split_payment',
    'documents': [  
      {
        _id: mongoose.Types.ObjectId('2296cbe292b973001c101445'),
        first_paid: 20000,
        first_changes : 10000,
        second_paid: 20000,
        second_changes : 10000,
        transdetail_id: mongoose.Types.ObjectId('5e92cbe292b97300fc101245'),
      },
    ]
  },
  {
    'model': 'transfer_payment',
    'documents': [  
      {
        _id: mongoose.Types.ObjectId('2496cbe292b973001c101445'),
        no_transfer: 'T00232323',
        transdetail_id: mongoose.Types.ObjectId('1396cbe292b97300fc101245'),
      },
    ]
  },
  {
    'model': 'kasbon_payment',
    'documents': [  
      {
        _id: mongoose.Types.ObjectId('2196cbe292b973001c101445'),
        paid: 50000,
        due_date : '11-1-2021',
        transdetail_id: mongoose.Types.ObjectId('3496cbe292b97300fc101245'),
      },
    ]
  },
  {
    'model': 'dp_payment',
    'documents': [  
      {
        _id: mongoose.Types.ObjectId('3496bbe292b97300fc101245'),
        paid: 51000,
        due_date : '11-1-2021',
        transdetail_id: mongoose.Types.ObjectId('1396cbe292b97300fc101245'),
      },
    ]
  }
]


