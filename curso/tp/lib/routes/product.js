var express = require('express');
var authService = require('../services/auth');
var error = require('../helpers/error');

var router = express.Router({
  mergeParams : true
});

var Product = require('../models/db').Product; 


//Login
router.post('/login', function(req, res,next){
  User.findOne( { userName : req.body.userName } , function(err, user){
   
    if (err) return next(err);
    if(!user) return next(error.NotFound('Incorrect username or password')); 
    
    user.comparePassword(req.body.password, function(err, match){
    
      if(!match){
        return next(error.NotFound('Incorrect username or password')); 
      }
      
      var token = authService.getToken(
        {
          sub : user._id,
          username : user.userName
        }, 
        '15m'
      );
      
      res.status(200).json({ token : token });
    });
  });
});



//Listar todos
router.get('/', 
  authService.authenticate(),         
  function(req, res, next){
    console.log(req.user);
    Product.find({},
      function (err, data){
        if (err) return next(err);
        res.status(200).json(data);
      }
    );
  }
);


//Alta
router.post('/', authService.authenticate(),function(req, res, next){
  var product = new Product(req.body);
  product.save(function(err, data){
    if (err) return next(err);
    res.status(200).json(data);
  });
});


//Consulta
router.get('/:id', 
 authService.authenticate(),
 function(req, res, next){
  Product.findById(req.params.id, function(err, product){
    if (err) return next(err);
    if (!product) return next(error.NotFound('Product Not Found'));
    res.status(200).json(product);
  });
});


//Baja
router.delete('/:id', authService.authenticate(),function(req, res, next){
  Product.findById(req.params.id, function(err, product){
    if (err) return next(err);
    if(!product) return next(error.NotFound('Product Not Found'));    
    product.remove(function(err, data){
        if (err) return next(err);
        res.status(200).json(data);
    });
  });
});

//Modificacion
router.put('/:id', authService.authenticate(),
    function(req, res, next){
      Product.findById(req.params.id, function(err, product) {
          if (err) return next(err);
          if(!product) return next(error.NotFound('Product Not Found'));
          product.name = req.body.name;
          product.price = req.body.price;
          product.desc = req.body.desc;
          product.category = req.body.category;
          product.save(function(err,product){
            if (err) return next(err);
            res.status(200).json(product);
          });
        }
    );
});


module.exports = router;