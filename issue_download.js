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

// START FETCH DATADIR FUNCTION

function render_article(articlename){
    //alert('try to render');
    article_name = articlename;
    DATADIR.getFile(article_name, {}, gotFileEntry_new, onError_test_2);
};

function gotFileEntry_new(fileEntry) {
    fileEntry.file(gotFile_new, onError_test_2);
};

function gotFile_new(file){
    readAsText_new(file);
};

function readAsText_new(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        
        $('#content').html(evt.target.result);
        set_img_heights();
        pageScroll.refresh();
        pageScroll.scrollTo(0, 0, 200);
        
        //setting the src url for all images
        //var imgs = document.getElementsByTagName("img");
        
        var imgs = $('img').not('.native_img');
        
        for(var i = 0; i < imgs.length; i++){
           var file_name = imgs[i].getAttribute('id');
           imgs[i].src = DATADIR.fullPath+'/'+file_name;
           // close_menu();
        };
        
        $('#loading_span').remove();
        close_menu();
        
    };
    reader.readAsText(file);
};

// END FETCH DATADIR FUNCTION

// KEEP

//A ton of callback function needed to store files on sd card persistent storage on device
function onFSSuccess(fileSystem) {
    //alert('find or create Directory'+'-'+foldername);
    fileSystem.root.getDirectory("Android/data/rephelp2.com.scknss.www",{create:true, exclusive: false}, function(appID){
    //fileSystem.root.getDirectory("magtemplate.com.scknss.www",{create:true, exclusive: false}, function(appID){
        appID.getDirectory(foldername, {create: true, exclusive: false}, madeDir, onError_test_2)
    },onError_test_1);
};

// KEEP
function madeDir(d){
    //alert('found/made Directory'+'-'+foldername);
    DATADIR = d;
    var reader = DATADIR.createReader();
    reader.readEntries(function(d){
        //alert('done with dirs'+'-'+foldername);
        gotFileEntries(d);
    },onError_test);
};


// KEEP
function gotFileEntries(fileEntries) {
    //alert("The dir has "+fileEntries.length+" entries."+'-'+foldername);
    
    if (localStorage.downloaded){
            var str = localStorage.downloaded;
            var n = str.split(",");
            var i_string = foldername.toString();
            var in_array = $.inArray(i_string,n);
            //alert(in_array);
            if (in_array > -1){
                render_issue(foldername);
            }else{
                download_issue_files(foldername);
            };
        }else{
            download_issue_files(foldername);
        };
};


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
function onError_test_6(e){
    var str = localStorage.downloaded;
    var n = str.split(",");
    var i_string = foldername.toString();
    var index = n.indexOf(i_string);
    n.splice(index, 1);
    localStorage.downloaded = "";
    for (var i=0; n.length; i++){
        var elem = n[i];
        localStorage.downloaded = localStorage.downloaded+','+elem
    };
    set_issue_list();
    //alert("ERROR TEST 6");
};

function onDeviceReady() {
    get_issue_list_handler ()
};


// KEEP
function download_handler(issue){
    //alert('download handler'+issue);
    foldername = issue;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);
};

//KEEP

function download_issue_files(issue){
    //alert('getting file dict to download');
    $('#issue_'+issue).html('Loading');
	
	$.getJSON('http://50.22.164.226/CatalogueIntegration/ProductsList.aspx?callback=?', function (data){
		//console.log(data);
		products = $.map(data.Products, function(p){
			//console.log(p);
			return{
				product: p,
			};
		});
		gotFS_write(DATADIR);
	});
	
};

function render_issue(foldername){
    //alert('should render '+foldername);
    
    DATADIR.getFile("product_list.html", {}, gotFileEntry, onError_test_3);//was "index.html"
};

function gotFileEntry(fileEntry) {
    //alert('gotfileentry');
    fileEntry.file(gotFile, onError_test_4);
}

function gotFile(file){
    //alert('gotfile');
    readAsText(file);
}

function readAsText(file) {
    //alert("Read as text");
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        
        $('#content').html("");
        $('#content').html(evt.target.result);
        
        var imgs = $('img').not('.native_img');
        
        for(var i = 0; i < imgs.length; i++){
           var file_name = imgs[i].getAttribute('id');
           imgs[i].src = DATADIR.fullPath+'/'+file_name;
           pageScroll.refresh();
           // close_menu();
        };
        
        pageScroll.refresh();
        close_menu();
        /*$('.article_list').html("");
        
        $('#article_list_'+foldername).html(evt.target.result);
        menuScroll.refresh();*/
    };
    reader.readAsText(file);
}

function close_menu(){
    hide_tab();
    //table_of_contents script needs to be at bottom of html body instead of in document ready...
};

function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
};

function set_issue_list(){
    $('#menu_content').html("");
    //var num_issues = parseInt(localStorage.issue_list);
    
    var category_array_str = localStorage.category_list;
    var category_array = category_array_str.split(',');
    //category_array.slice(0,-1);
    
    var num_categories = category_array.length;
    
    if(no_connection){
        no_connection = false;
        $('#menu_content').html('please connect to the internet<br>tap<br>"Sync"<br>to see issue list');
    }else{
        for(var i = 0; i < num_categories; i++){
            
            $('#get_issues_btn').html('Sync');
            
            if (localStorage.downloaded){
                var str = localStorage.downloaded;
                var n = str.split(",");
                var i_string = i.toString();
                var in_array = $.inArray(i_string,n);
                //vie element id the same name as the issue number or category
                if (in_array > -1){
                    $('#menu_content').append('<div class="issue_download btn downloaded" id="issue_'+category_array[i]+'">'+category_array[i]+'</div><div id="article_list_'+category_array[i]+'" class="article_list"></div>');
                }else{
                    $('#menu_content').append('<div class="issue_download btn" id="issue_'+category_array[i]+'">'+category_array[i]+'</div><div id="article_list_'+category_array[i]+'" class="article_list"></div>');
                };
            }else{
                $('#menu_content').append('<div class="issue_download btn" id="issue_'+category_array[i]+'">'+category_array[i]+'</div>');
            };

        };
        menuScroll.refresh();
    };
};


function get_issue_list_handler (){
    
    $.get("http://eaerephelp.appspot.com/get_issue_list", {}, function(data) {
        
        //alert(data['category_list']);
        
        var category_list = data['category_list'];
        
        localStorage.category_list = category_list;

        set_issue_list();

    })
    .fail(function() {
        if (!localStorage.category_list){
            $('#get_issues_btn').html('Sync');
            $('#menu_content').html('Cannot download category list<br>Please connect to the internet');
        }else{
            $('#get_issues_btn').html('Sync');
            set_issue_list();
        };
    });
    
};

// FILE WRITER
// KEEP
function gotFS_write(DIR) {
        DIR.getFile("product_list.html", {create: true, exclusive: false}, gotFileEntry_write, onError_test_1);
    };
//KEEP
    function gotFileEntry_write(fileEntry) {
        fileEntry.createWriter(gotFileWriter, onError_test_1);
    };
//KEEP
    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            //render_issue(foldername);
            alert('finished writing');
        };
        writer.write(products);
    };



$(document).ready(function(){
    
    init();
	
	$('body').on('tap click', '#saveJSON', function(){
		  folder = 'products'
		 download_handler(folder);
    });
    
    $('body').on('submit', '#order_form', function(){
        var email = $('#order_email').val();
        var item_code = $('#item_code').val();
        var qty = $('#qty').val();
        $.ajax({
            type: 'POST',
            data: {email:email, item_code:item_code, qty:qty},
            url: 'http://eaerephelp.appspot.com/order',
            success: function(data){
                console.log(data);
                //alert('new inventory'+data['category']);
                download_issue_files(data['category'])
                $('#full_overlay').remove();
                $('#overlay_content').remove();
                menu_active = true;
                popupScroll.destroy();
                popupScroll = null;
                imgScroll.destroy();
                imgScroll = null;
            },
            error: function(data){
                console.log(data);
                alert('There was an error adding your comment');
                $('#full_overlay').remove();
                $('#overlay_content').remove();
                menu_active = true;
                popupScroll.destroy();
                popupScroll = null;
                imgScroll.destroy();
                imgScroll = null;
            }
        });
        return false;
    });
    
});




