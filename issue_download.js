// -- downloading files based on a file list that is requested from an external server and storing files on device for later viewing

//Global instance of DirectoryEntry for our data
var DATADIR;
var fetched_datadir;
var article_name;
var issue_dir;
var knownfiles = []; 
var filename = "";
var foldername = "";
var setting_issue_list = false;
var no_connection = false;
var product_html = "";
var products="";

var categories;


// DOWNLOADING JSON
function download_handler(issue){
    foldername = issue;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);
};

function onFSSuccess(fileSystem) {
    fileSystem.root.getDirectory("Android/data/rephelp2.com.scknss.www",{create:true, exclusive: false}, function(appID){
        appID.getDirectory(foldername, {create: true, exclusive: false}, madeDir, onError_test_2)
    },onError_test_1);
};

function madeDir(d){
    DATADIR = d;
    var reader = DATADIR.createReader();
    reader.readEntries(function(d){
        gotFileEntries(d);
    },onError_test);
};

function gotFileEntries(fileEntries) {
    if (localStorage.downloaded){
            var str = localStorage.downloaded;
            var n = str.split(",");
            var i_string = foldername.toString();
            var in_array = $.inArray(i_string,n);
            if (in_array > -1){
                render_issue(foldername);
            }else{
                download_issue_files(foldername);
            };
        }else{
            download_issue_files(foldername);
        };
};

function download_issue_files(issue){

    $('#issue_'+issue).html('Loading');
	
	$.getJSON('http://50.22.164.226/CatalogueIntegration/ProductsList.aspx?callback=?', function (data){
		products = $.map(data.Products, function(p){
			return{
				product: p,
			};
		});
		gotFS_write(DATADIR);
	});
};

// TEXT FILE WRITER
function gotFS_write(DIR) {
        DIR.getFile("product_list.html", {create: true, exclusive: false}, gotFileEntry_write, onError_test_1);
    };

    function gotFileEntry_write(fileEntry) {
        fileEntry.createWriter(gotFileWriter, onError_test_1);
    };

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            alert('finished writing');
			render_issue('product_list.html')
        };
        writer.write(products);
    };
	
// RENDER Function	
function render_issue(filename){
    DATADIR.getFile(filename, {}, gotFileEntry, onError_test_3);//was "index.html"
};

function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, onError_test_4);
}

function gotFile(file){
    readAsText(file);
}

function readAsText(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
		var resultJSON = JSON.parse(evt.target.result);
		var productsArray = resultJSON.Products;
		alert(productsArray);
		var template = Handlebars.compile( $('#product_template').html() );
		var html = template( productsArray );
		$('#displayJSON').html( html );
		
        //$('#displayJSON').html(evt.target.result);
    };
    reader.readAsText(file);
}


// INIT FUNCTION AND DEVICE READY -- not being ued
	
function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
};

function onDeviceReady() {
    get_issue_list_handler ()
};


// ERROR FNs

function onError(e){
    alert("ERROR");
    //alert(e.target.error.code);
    //alert(JSON.stringify(e));
};
function onError_test(e){
    alert("ERROR TEST");
};
function onError_test_1(e){
    alert("ERROR TEST 1");
};
function onError_test_2(e){
    alert("ERROR TEST 2");
};
function onError_test_3(e){
    alert("ERROR TEST 3");
};
function onError_test_4(e){
    alert("ERROR TEST 4");
};
function onError_test_5(e){
    alert("ERROR TEST 5");
};
	
	

$(document).ready(function(){
    
    init();
	
	$('body').on('tap click', '#saveJSON', function(){
		  folder = 'products'
		 download_handler(folder);
    });
    
});




