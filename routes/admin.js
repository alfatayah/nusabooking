const router = require('express').Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController')
const { uploadSingle, uploadMultiple } = require('../middleware/multer');
const auth = require('../middleware/auth');
const merkController = require('../controllers/merkController');
const typeController = require('../controllers/typeController');
const userController = require('../controllers/userController');
const customerController = require('../controllers/customerController');
/**
 *  @name viewsigninRoutes  
 *  @route {POST} /v1/file
 */
router.get("/signin", adminController.viewSignIn);
router.post("/signin", adminController.actionSignin);
router.use(auth);
router.get("/logout", adminController.actionLogout);

// ketika login succes akan mengarahkan ke screen view dashboard
router.get("/dashboard", adminController.viewDashboard);

router.get("/booking", adminController.viewBooking);
router.post("/booking/add_booking", adminController.addBook);
router.get("/booking/detail/:id", adminController.viewDetailBooking); 
router.put("/booking", adminController.editBooking);
router.delete('/booking/:id', adminController.deleteBooking);
router.get('/booking/check/:id', adminController.checkBook);

router.get("/user", userController.viewUser);
router.post("/user", userController.addUser);
router.put("/user", userController.editUser);
router.delete('/user/:id', userController.deleteUser);

router.get("/product", productController.viewProduct);
router.post("/product", productController.addProduct);
router.put("/product", uploadSingle, productController.editProduct);
router.delete('/product/:id', productController.deleteProduct);

router.get("/customer", customerController.viewCustomer);
router.post("/customer", customerController.addCustomer);
router.put("/customer", customerController.editCustomer);
router.delete('/customer/:id', customerController.deleteCustomer);

router.get("/merk", adminController.viewMerk);
router.post("/merk", merkController.addMerk);
router.put("/merk", merkController.editMerk);
router.delete('/merk/:id', merkController.deleteMerk);

router.get("/type", adminController.viewType);
router.post("/type", typeController.addType);
router.put("/type", typeController.editType);
router.delete('/type/:id', typeController.deleteType);



module.exports = router;