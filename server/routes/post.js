var model = require('../lib/model');

exports.get = function(req, res) {
  var id = req.params.id;
  model.Post.find(id).success(function(post) {
    res.render('post');
  });
}

exports.all = function(req, res) {
  model.Post.findAll.success(function(posts) {

  });
}
