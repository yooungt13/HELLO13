var map,geocoder,mapMarkers = [];
var emActList = [];
var addActFormFlag = false;
var markersFlag = 0;
var markerCurrentPos ={};
var listenerMapChange;
var mapCurrentZoom;

$(document).ready(function init() {
    var myLatlng = new qq.maps.LatLng(22.54027, 113.93457);
    var myOptions = {
        zoom: 12,
        center: myLatlng
    }
    var mapTest = document.getElementById("mapTest");
    map = new qq.maps.Map(mapTest, myOptions);

    var anchor = new qq.maps.Point(6, 6),
        size = new qq.maps.Size(50, 65),
        origin = new qq.maps.Point(0, 0),
        icon = new qq.maps.MarkerImage('img/chooselocation.png', size, origin, anchor);
    markerCurrentPos = new qq.maps.Marker({
        icon :icon,
        map: map,
        animation: qq.maps.MarkerAnimation.BOUNCE
    });
    geocoder = new qq.maps.Geocoder({
        complete : function(result){

            map.setCenter(result.detail.location);
            markerCurrentPos.position = result.detail.location;
            markerCurrentPos.setMap(null);
            markerCurrentPos.setMap(map);
            map.zoomTo(14);
        }
    });

    var btnAddAct = document.getElementById("btnAddAct");
    var formAddAct =document.getElementById("formAddAct");
    var divAddForm = $('#divAddForm');
    var btnCancleForm =$('#btnCancleForm');
    btnCancleForm.click(function(){
        divAddForm.hide();
    });
    divAddForm.hide();

    var btnLocate = $('#btnLocate');
    btnLocate.click(function(){
        navigator.geolocation.getCurrentPosition(updateLocation);
    })

    var inputSearchLocate = $('#inputSearchLocate');
    var btnSearchLocate = $("#btnSearchLocate");
    btnSearchLocate.click(function(){
        codeAddress();
    })




    var flag = 1;
    btnAddAct.onclick = function() {
        addMapClick();
        divAddForm.show();
    };

    $('#btnReflash').click(function(){
        alert(mapMarkers.length);
        deleteOverlays(mapMarkers);
        emActList.length = 0 ;
        getCurrentActList2();
    })
//    getActList();
//    getActList2();
//
//    getCurrentActList1();
    getCurrentActList2();

    // getUesrList();
    //定位当前位置
    //定位太不靠谱！！！
    // navigator.geolocation.getCurrentPosition(updateLocation);

    //实现缩放返回地图大小

   listenerMapChange = qq.maps.event.addListener(map, 'bounds_changed',mapChange );
})

//添加标记事件
function addMarker(location,content,actid) {
    var info = new qq.maps.InfoWindow({
        map: map
    });
    var marker = new qq.maps.Marker({
        position: location,
        map: map,
        animation:qq.maps.MarkerAnimation.DROP,
        actId : actid
    });

    qq.maps.event.addListener(marker, 'click', function(event) {
        info.open();
        //显示位置
        // info.setContent('<div style="text-align:center;white-space:nowrap;' +
        //     'margin:10px;">你点击了' + event.latLng + '</div>');
        var marHtml = '<div style="width:150px;padding-top:10px;"><div><h5>活动名' + content.title + '</h5></div>' +
            '<div> <p>活动内容' + content.content + '</p> </div>' +
            '<div><p>活动人数 ' + content["num_people"] + '</p> </div>' +
            '<div><p>活动类型' + content.tags + '</p> </div></div>'

        info.setContent(marHtml);

        info.setPosition(event.latLng)
    });
    mapMarkers.push(marker);
    // showActives(mapMarkers);
    console.log("地图上所有的标记点数组\n"+mapMarkers);
    markersFlag++;
}
//添加地图标记事件（只能点击一次）
function addMapClick() {
    var listener;
    listener = qq.maps.event.addListener(
        map,
        'click',
        function(event) {
            addMarker(event.latLng);
            console.log("点击的方位" + (typeof event.latLng));
            console.log(event);
            if (event) {
                qq.maps.event.removeListener(listener);
            }
        }
    );
}

// function showActives(Array){
//     $(Array).each(function(){
//         $("#activeList").append('<p>'+this.position+'</p>');
//     })
// }

//获取活动数据
function getActList() {
    $.ajax({
        type: "get",
        url: "http://203.195.164.190/v1/activity/search.php",
        data :{
            activityid : 2
        },
        success: function(data) {
            console.log("未处理的数据类型 " + (typeof data));
            data = JSON.parse(data);
            console.log("处理后的数据类型 " + (typeof data));
            emActList.push(data.data);
            console.log("现在所有的事件数组" + emActList);
            //实现根据数据库返回数据向地图添加标注
            addMarkersByAct(emActList);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    })
}

//获取活动数据2
function getActList2() {
    $.ajax({
        type: "get",
        url: "http://203.195.164.190/v1/activity/search.php",
        data : {
            activityid : 1
        },
        success: function(data) {
            console.log("未处理的数据类型 " + (typeof data));
            data = JSON.parse(data);
            console.log("处理后的数据类型 " + (typeof data));
            emActList.push(data.data);
            console.log("现在所有的事件数组" + emActList);
            //实现根据数据库返回数据向地图添加标注
            addMarkersByAct(emActList);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    })
}
//获取用户数据
function getUesrList() {
    $.ajax({
        type: "get",
        url: "http://203.195.164.190/v1/activity/search.php",
        data :{
            "username" : "songbo"
        },
        success: function(data) {
            console.log("未处理的数据类型 " + (typeof data));
            data = JSON.parse(data);
            console.log("处理后的数据类型 " + (typeof data));

            $("#activeList").append('<pre>' + data + '</pre>');
            emActList.push(data.data);
            console.log("现在所有的事件数组" + emActList);
            //实现根据数据库返回数据向地图添加标注
            addMarkersByAct(emActList);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    })
}

//获取活动数据3
function getCurrentActList1(){
    $.ajax({
        type : 'get',
        url : 'http://203.195.164.190/v1/activity/search.php',
        data : {
            minLat : "0",
            maxLat : "23",
            minLng : "0",
            maxLng : "120",
            detail : "0"
        },
        success : function(data){
            console.log(data);
            data = JSON.parse(data);
            console.log('当前的活动位置是');
            console.log(data);
        },
        error :function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
        }
    })
}

function getCurrentActList2(){
    $.ajax({
        type : 'get',
        url : 'http://203.195.164.190/v1/activity/search.php',
        data : {
            minLat : "0",
            maxLat : "23",
            minLng : "0",
            maxLng : "120",
            detail : "1"
        },
        success : function(data){
            console.log(data);
            data = JSON.parse(data);
            console.log('当前的活动详情是');
            console.log(data);
            $(data.data).each(function(){
                emActList.push(this);
            })
            addMarkersByAct(emActList);
        },
        error :function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
        }
    })
}

//带参数的ajax调取活动方法
function getCurrentActList(){
    $.ajax({
        type : 'get',
        url : 'http://203.195.164.190/v1/activity/search.php',
        data : currentMapSize(),
        success : function(data){
            console.log(data);
            data = JSON.parse(data);
            console.log('当前的活动详情是');
            console.log(data);
            $(data.data).each(function(){
                emActList.push(this);
            })
            deleteOverlays(mapMarkers);
            addMarkersByAct(emActList);
        },
        error :function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
        }
    })
}

//根据数组向地图添加标注
function addMarkersByAct(Array){
    $(Array).each(function(){
        addMarker(new qq.maps.LatLng(this.addr.latitude,this.addr.longitude),this.detail,this.activityid);
    })
}

function updateLocation(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    markerCurrentPos.position = new qq.maps.LatLng(position.coords.latitude,position.coords.longitude);
    markerCurrentPos.setMap(null);
    markerCurrentPos.setMap(map);
    map.zoomTo(15);
    map.panTo(new qq.maps.LatLng(position.coords.latitude,position.coords.longitude));

}

function validateForm(formName) {
    //validate方法参数可选
    return $("#formAddAct").validate({
        rules: {
            title : "required",
            content : "required",
            "num_people" : "required",
            tags : "required"
        },
        messages:{
        }
    }).form();
}

function doSubmit(){
    //do other things
    //验证通过后提交
    if(validateForm()){
        document.form1.submit()
    }
}


function currentMapSize(){
    console.log ({
        center : map.center,
        maxLat : map.getBounds().lat.maxY,
        minLat : map.getBounds().lat.minY,
        maxLng : map.getBounds().lng.maxX,
        minLng : map.getBounds().lng.minX
    })
    return  {
        maxLat : map.getBounds().lat.maxY,
        minLat : map.getBounds().lat.minY,
        maxLng : map.getBounds().lng.maxX,
        minLng : map.getBounds().lng.minX,
        detail :1
    }
}

// 转化文字为ip地址

function codeAddress() {
    var address = document.getElementById("inputSearchLocate").value;
    geocoder.getLocation(address);
}



function clearOverlays(markersArray) {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
    }
}

function showOverlays(markersArray) {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(map);
        }
    }
}

function deleteOverlays(markersArray) {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
}

function currentScreenAct(position,actArray){
    var currentScreenActList = {};
    currentScreenActList.length = 0 ;
    $(actArray).each(function(){
        var lat = this.addr.latitude;
        var lng = this.addr.longitude;
        if(lat<position.maxLat&&lat>position.minLat&&lng<position.maxLng&&lng>position.minLng){
            if(!currentScreenActList[this.activityid]){
                currentScreenActList[this.activityid] = this;
                currentScreenActList.length++;
            }
        }
    });
    return currentScreenActList;
}

function currentScreenActHtml(currentScreenActList){
    var newElem,detailElem ;
    var divCurrentScreenAct = $('#divCurrentScreenAct');
    divCurrentScreenAct.empty();
    divCurrentScreenAct.append('<h1>当前屏幕范围内的活动共有<strong>'+ currentScreenActList.length +'</strong>个</h1>');
    for( elem in currentScreenActList){
        if(elem !== 'length'){
            newElem =$('<div style="background-color:#5bc0de">'+
                '<p><span>title:'+ currentScreenActList[elem].detail["title"] +'</span>'+
                '<span>time:'+ currentScreenActList[elem].detail["start_time"]+'</span></p>'+
                '<p><span>address:'+ currentScreenActList[elem].addr.addrname +'</span></p>'+
                '<hr></div>');
            newElem.attr("id",currentScreenActList[elem]["activityid"]);
            newElem.click(function(){
                qq.maps.event.removeListener(listenerMapChange);
                divCurrentScreenAct.empty();
                console.log("findMapMarker");
                console.log(findMapMarker(this.id));
                mapCurrentZoom = map.zoom;
                map.panTo(findMapMarker(this.id));

                map.zoomTo(16);

                detailElem = '<div >'+
                    '<h1>事件详情</h1>'+
                    '<p>title:'+ currentScreenActList[this.getAttribute("id")].detail.title +'</p>'+
                    '<p>start_time:'+ currentScreenActList[this.getAttribute("id")].detail["start_time"]+'</p>'+
                    '<p>end_time:'+ currentScreenActList[this.getAttribute("id")].detail["end_time"]+'</p>'+
                    '<p>content:'+ currentScreenActList[this.getAttribute("id")].detail["content"] +'</p>'+
                    '<p>number of people :'+ currentScreenActList[this.getAttribute("id")].detail["num_people"] +'</p>'+
                    '<p>address:'+ currentScreenActList[this.getAttribute("id")].addr.addrname +'</p>'+
                    '<button class="btn btn-danger" onclick="mapChange1()">返回列表详情</button>'
                    '<hr></div>'
                divCurrentScreenAct.append(detailElem)
            });
            divCurrentScreenAct.append(newElem);
        }
    }

}

function mapChange(){
    var currentScreenActList=currentScreenAct(currentMapSize(),emActList)
    console.log(currentScreenActList);
    currentScreenActHtml(currentScreenActList);
}

function mapChange1(){
    listenerMapChange = qq.maps.event.addListener(map, 'bounds_changed',mapChange );
    map.zoomTo(mapCurrentZoom);
    var currentScreenActList=currentScreenAct(currentMapSize(),emActList)
    console.log(currentScreenActList);
    currentScreenActHtml(currentScreenActList);

}
function findMapMarker(actId){
    var latLng ;
    var pos = null;
    $(mapMarkers).each(function(){
        if(this.actId == actId){
            latLng = new qq.maps.LatLng(this.position.lat,this.position.lng);

//            console.log("marker type" + (typeof latLng));
//            console.log(this.position);
//            console.log(latLng);
//            map.panTo(this.position);
            return pos = this.position;
        }
    })
    return pos;
}