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
    './models/booking',
    './models/type',
  ]);

  // Clear specified collections
  seeder.clearModels(['user' , 'customer', 'merk','product' , 'type', 'booking'  ], function () {
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
        name: 'Fadhillah Alfatayah Rizqan',
        username_ig: '@alfatayah',
      },
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b91300fc903315'),
        no_member: 'NK000002',
        nik: 21312312313123,
        name: 'Bobi Hendra',
        username_ig: '@bobi',
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
      },
      {
        _id: mongoose.Types.ObjectId('4e96cbe292b37300fc90bb01'),
        product_name: 'Canon D300',
        tipe: "Lighting",
        price: 12000,
        barcode: 'BR121345',
      },
    ]
  },
  {
    'model': 'booking',
    'documents': [  
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc101445'),
        product_id: [
          { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb01') },
          { _id: mongoose.Types.ObjectId('4e96cbe292b37300fc90bb01') },
        ],
        customer_id: mongoose.Types.ObjectId('5e96cbe292b97300fc903315'),
        user_id: mongoose.Types.ObjectId('5e96cbe292b97300fc903345'),

        start_date: '2022-10-20 11:00',
        end_date: '2022-10-22 12:00',
        lokasi_pengambilan: 'Cipadung',
      },
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc102445'),
        product_id: [
          { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb01') },
        ],
        customer_id: mongoose.Types.ObjectId('5e96cbe292b91300fc903315'),
        user_id: mongoose.Types.ObjectId('5e96cbe292b97300fc903345'),
        start_date: '2022-10-24 11:00',
        end_date: '2022-10-25 12:00',
        lokasi_pengambilan: 'DU',
      },
    ]
  }
  
]


