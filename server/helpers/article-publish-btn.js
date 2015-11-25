/**
 * We {{article-publish-btn}}  helper
 *
 * usage:  {{article-publish-btn record=record req=req}}
 */

module.exports = function(we) {
  return function helper() {
    var options = arguments[arguments.length-1];

    var url = '/article/'+options.hash.record.id+'/edit?redirectTo='+
      options.hash.req.url;

    var html = '<form class="form-inline publish-btn-form" action="'+url+'" method="POST">';

    if (options.hash.record.published) {
      html += '<input name="published" type="hidden" value="false">'+
        '<button class="btn btn-default btn-publish"  type="submit">'+
          options.hash.req.res.__('article.published.btn.unpublish')+
        '</button>';
    } else {
      html += '<input name="published" type="hidden" value="true">'+
        '<button class="btn btn-default btn-publish" type="submit">'+
          options.hash.req.res.__('article.published.btn.publish')+
        '</button>';
    }

    html += '</form>';
    return  new we.hbs.SafeString(html);
  }
}