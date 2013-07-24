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

var categories;

// START FETCH DATADIR FUNCTION

function render_article(articlename){
    //alert('try to render');
    //alert(localStorage.downloaded);
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

//A ton of callback function needed to store files on sd card persistent storage on device
function onFSSuccess(fileSystem) {
    //alert('find or create Directory'+'-'+foldername);
    fileSystem.root.getDirectory("Android/data/rephelp.com.scknss.www",{create:true, exclusive: false}, function(appID){
    //fileSystem.root.getDirectory("magtemplate.com.scknss.www",{create:true, exclusive: false}, function(appID){
        appID.getDirectory(foldername, {create: true, exclusive: false}, madeDir, onError_test_2)
    },onError_test_1);
};

function madeDir(d){
    //alert('found/made Directory'+'-'+foldername);
    DATADIR = d;
    var reader = DATADIR.createReader();
    reader.readEntries(function(d){
        //alert('done with dirs'+'-'+foldername);
        gotFileEntries(d);
    },onError_test);
};

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

function download_handler(issue){
    //alert('download handler'+issue);
    foldername = issue;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);
};

function download_issue_files(issue){
    //alert('getting file dict to download');
    $('#issue_'+issue).html('Loading');
    $.get("http://eaerephelp.appspot.com/getfilelist/"+issue+"", {}, function(data) {
        
        //**
        
        product_html = "";
        
        var files_downloaded = 0;
        
        for (j=0; j < data.length; j++){
        
            var files = [];
            //var files_downloaded = 0;
            
            var img_name = "";
            
            for (var key in data[j]) {
                if (data[j].hasOwnProperty(key)) {
                    //alert('key '+key);
                    if (key !='price' && key != 'inventory' && key != 'itemcode' && key != 'description'){
                        files.push(key);
                        img_name = key
                    }
                };
            };
            
            var temp_product_html = '<div>'+data[j]['itemcode']+'</div>\
                            <div class="fullw_auto"><img id="'+img_name+'" width="100%"></img></div>\
                            <div>Price: '+data[j]['price']+'</div>\
                            <div>Description: '+data[j]['description']+'</div>\
                            <div>Inventory: '+data[j]['inventory']+'</div>\
                            ';
                            
            product_html += temp_product_html;
            //gotFS_write(DATADIR);
            
            //alert(product_html);
            
            /*for (var key in data[j]) {
                if (data[j].hasOwnProperty(key)) {
                    //alert('key '+key);
                    if (key !='price' && key != 'inventory' && key != 'itemcode' && key != 'description'){
                        files.push(key);
                    }
                };
            };*/
            
            var $status = $('#issue_'+foldername);
            
            /*
            var num_files_to_download = 0;
            for (var i=0; i < files.length; i++){
                if (i !='price' && i != 'inventory' && i!= 'itemcode' && i!= 'description'){
                    num_files_to_download += 1;
                }
            };
            */
            
            for (var i=0; i < files.length; i++){
                
                if (files[i]=='price'){
                    //alert('price'+data[files[i]]);
                    //to_download = false;
                }else if (files[i]=='inventory'){
                    //alert('inventory'+data[files[i]]);
                    //to_download = false;
                }else if (files[i]=='itemcode'){
                    //alert('itemcode'+data[files[i]]);
                    //to_download = false;
                }else if (files[i]=='description'){
                    //alert('description'+data[files[i]]);
                    //to_download = false;
                }else{
                    var data_key = files[i];
                    
                    //gotFS_write(DATADIR);
                    
                    //to_download = true;
                    
                    //alert(data[j][data_key]);
                    
                    var ft = new FileTransfer();

                    ft.onprogress = function(progressEvent) {
                        if (progressEvent.lengthComputable) {
                            var perc = Math.abs(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
                            $status.html(perc + " Loading...")
                        } else {
                            if($status.innerHTML == "") {
                                $status.innerHTML = "Loading";
                            } else {
                                $status.innerHTML += ".";
                            }
                        }
                    };
                    var dlPath = DATADIR.fullPath + "/" + data_key;
                    ft.download("http://eaerephelp.appspot.com/getfile/" + data[j][data_key], dlPath, function(){
                        files_downloaded += 1;
                        //alert(files_downloaded);
                        //alert('downloaded');
                        //gotFS_write(DATADIR);
                        if (files_downloaded == files.length){
                            gotFS_write(DATADIR);
                            
                            //set_issue_list();//adds articles once all files are downloaded
                            //render_issue(foldername);
                        };
                    },onError_test_6);
                    
                };
                
            };
            
            var string_folder = foldername.toString();
            if (localStorage.downloaded == undefined){
                localStorage.downloaded = string_folder;
            }else{
                localStorage.downloaded = localStorage.downloaded+','+string_folder;
            };
    
        };
    
    //**
    
    }, "json")
    .fail(function() {
        no_connection = true;
        set_issue_list();
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
        $('#menu_content').html('please connect to the internet<br>tap<br>"Refresh Issues"<br>to see issue list');
    }else{
        for(var i = 0; i < num_categories; i++){
            
            $('#get_issues_btn').html('Refresh Issues');
            
            if (localStorage.downloaded){
                var str = localStorage.downloaded;
                var n = str.split(",");
                var i_string = i.toString();
                var in_array = $.inArray(i_string,n);
                //vie element id the same name as the issue number or category
                if (in_array > -1){
                    $('#menu_content').append('<div class="issue_download btn downloaded" id="issue_'+category_array[i]+'">'+category_array[i]+'</div><div id="article_list_'+category_array[i]+'" class="article_list"></div>');
                }else{
                    $('#menu_content').append('<div class="issue_download btn" id="issue_'+category_array[i]+'">Download '+category_array[i]+'</div><div id="article_list_'+category_array[i]+'" class="article_list"></div>');
                };
            }else{
                $('#menu_content').append('<div class="issue_download btn" id="issue_'+category_array[i]+'">Download '+category_array[i]+'</div>');
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
        
        //for (i=0; i < category_list.length; i++){
        //    
        //};
        
        //var latest_issue = parseInt(data['issue_num'])
        //localStorage.issue_list = latest_issue;

        set_issue_list();

    })
    .fail(function() {
        if (!localStorage.category_list){
            $('#get_issues_btn').html('Refresh Issues');
            $('#menu_content').html('Cannot download category list<br>Please connect to the internet');
        }else{
            $('#get_issues_btn').html('Refresh Issues');
            set_issue_list();
        };
    });
    
};

/*
function SaveDataToLocalStorage(data)
{
    var a = [];
    // Parse the serialized data back into an aray of objects
    a = JSON.parse(localStorage.getItem('session'));
    // Push the new data (whether it be an object or anything else) onto the array
    a.push(data);
    // Alert the array value
    alert(a);  // Should be something like [Object array]
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('session', JSON.stringify(a));
};
*/


// FILE WRITER

function gotFS_write(DIR) {
        DIR.getFile("product_list.html", {create: true, exclusive: false}, gotFileEntry_write, onError_test_1);
    };

    function gotFileEntry_write(fileEntry) {
        fileEntry.createWriter(gotFileWriter, onError_test_1);
    };

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            render_issue(foldername);
            //alert('finished writing');
            
            /*writer.seek(writer.length);
                writer.write(product_html);*/
            //console.log("contents of file now 'some sample text'");
            //writer.truncate(11);
        };
        writer.write(product_html);
    };



$(document).ready(function(){
    
    init();
    
    $('body').on('click tap', '#get_issues_btn', function(){
        $('#get_issues_btn').html('Loading');
        get_issue_list_handler();
    });
    
    $('body').on('tap click', '.issue_download', function(){
        var div_id = $(this).attr('id');
        var issue = div_id.slice(6);
        download_handler(issue);
    });
    
    $(document).on('touchend', '.article', function(){
        var id = $(this).attr('id');
        var filenum = id.slice(1);
        var filename = filenum+'.html';
        $(this).append('<span id="loading_span"> -Loading</span>');
        render_article(filename);
    });
    
});




