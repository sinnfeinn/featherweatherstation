$(document).ready(function() {
  $('#my-final-table').dynatable({
    features: {
  paginate: false,
  recordCount: false,
  search: false
},
    dataset: {
      ajax: true,
      ajaxUrl: 'http://YOUR_IP/db.json', //Enter your raspberry pi ip. Also works with noip. db.json is located in /var/www/html folder on raspberry pi.
      ajaxOnLoad: true,
      records: []
    }
  });
} );
