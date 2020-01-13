module.exports = function (we, done) {
  Promise.all([
    // Article publication:
    we.db.defaultConnection.query(
      'UPDATE `articles` SET `published`="1" WHERE publishedAt <= NOW() AND published != 1'
    )
  ])
  .then( ()=> {
    done();
  })
  .catch(done);
};