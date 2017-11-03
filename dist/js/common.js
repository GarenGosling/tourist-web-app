var server = {};
server.ip_test = '120.27.22.41';
server.ip_local = 'localhost';
server.base = "http://";
server.tourist = server.base + server.ip_local + ':8092';

var url={};
url.tourist={}
url.tourist.applys=server.tourist+"/applys"