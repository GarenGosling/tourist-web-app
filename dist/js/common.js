var server = {};
server.ip_test = '120.27.22.41';
server.ip_local = 'localhost';
server.base = "http://";
server.tourist = server.base + server.ip_test + ':9092';

var url={};
url.tourist={}
url.tourist.applys=server.tourist+"/applys"