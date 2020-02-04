const API_BASE_URL = "http://localhost:3000/";
const clientJS = new ClientJS();
const isCookie = clientJS.isCookie();

function populateSeatsBookingView() {
    axios.get(API_BASE_URL + "api/seats", {
            param :  null,
            config : { headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }}
        }).then(function (response) {
            if(response.data.status == "success"){
                var dataArray = response.data.data;
                var jsonStrippedData= {};
                jsonStrippedData.dataArray = [];
                if(dataArray.length > 0){
                    for(var j = 0; j < dataArray.length; j++){
                        var _id = dataArray[j]['_id'];
                        var seatNumber = dataArray[j]['seatNumber'];
                        var status = dataArray[j]['status'];
                        var createdBy = dataArray[j]['createdBy'];
                        var createdOn = dataArray[j]['createdOn'];
                        var updatedOn = dataArray[j]['updatedOn'];
                        var updatedBy = dataArray[j]['updatedBy'];
                        var isDeleted = dataArray[j]['isDeleted'];

                        jsonStrippedData.dataArray.push({
                            "_id" : _id,
                            "seatNumber" : seatNumber,
                            "status" : status,
                            "createdBy" : createdBy,
                            "createdOn" : createdOn,
                            "updatedOn" : updatedOn,
                            "updatedBy" : updatedBy,
                            "isDeleted" : isDeleted,
                        });
                    }
                } else {
                    // TODO: We will put empty message ui response for no seats here;
                }    

                console.log("jsonStrippedData", jsonStrippedData);
                jsonToSeatsBookingView(jsonStrippedData.dataArray);
            } else if(response.data.status == "error"){
                callErrorPopup(response.data.responseMessage + "... Click Ok to continue!", (function() {
                    //DO NOTHING YET
                }));
            } else if(response.data.status == "warning"){
                callInfoPopup(response.data.responseMessage);
            } else if(response.data.status == "information"){
                callWarnPopup(response.data.responseMessage);
            }
        }).catch(function (error) {
            console.log(error);
        }).finally(function () {
            // always executed
        });
}

function loginAndSetSessionDetails(arg) {
    axios.post(API_BASE_URL + "api/users/login", arg, {
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json; charset=utf-8'
        }
    }).then(function (response) {
        if(response.data.status == "success"){
            if(isCookie) {
                setcookie( "userId", response.data.data.userId,  ((new Date(Date.now() + 12096e5))) );
                setcookie( "username", response.data.data.username, ((new Date(Date.now() + 12096e5))) );
                setcookie( "createdOn", response.data.data.createdOn, ((new Date(Date.now() + 12096e5))) );
                setcookie( "updatedOn", response.data.data.updatedOn, ((new Date(Date.now() + 12096e5))) );
                setcookie( "updatedBy", response.data.data.updatedBy, ((new Date(Date.now() + 12096e5))) );
                setcookie( "lastLoginOn", response.data.data.lastLoginOn, ((new Date(Date.now() + 12096e5))) );
                setcookie( "isDeleted", response.data.data.isDeleted, ((new Date(Date.now() + 12096e5))) );
                setcookie( "loggedInOn", response.data.data.loggedInOn, ((new Date(Date.now() + 12096e5))) );
                setcookie( "loggedOutOn", response.data.data.loggedOutOn, ((new Date(Date.now() + 12096e5))) );
                setcookie( "loggedOutBy", response.data.data.loggedOutBy, ((new Date(Date.now() + 12096e5))) );
                setcookie( "sessionId", response.data.data.sessionId, ((new Date(Date.now() + 12096e5))) );
                
                callSuccessPopup("Login Successful!", (function() {
                    window.location.href = "/dash";
                }));
            } else {
                callWarnPopup("There was a problem... Your Cookie functionality have been turned off... Please Turn it back on!");
            }
        } else if(response.data.status == "error"){
            callErrorPopup("Login Failed... " + response.data.responseMessage + "... Click Ok to continue!", (function() {
                //DO NOTHING YET
            }));
        } else if(response.data.status == "warning"){
            callInfoPopup(response.data.responseMessage);
        } else if(response.data.status == "information"){
            callWarnPopup(response.data.responseMessage);
        }
    }).catch(function (error) {
        console.log(error);
    }).finally(function () {
        // always executed
    });  
}

function logoutAndKillSession(arg) {
    axios.post(API_BASE_URL + "api/users/logout", arg, {
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json; charset=utf-8'
        }
    }).then(function (response) {
        if(response.data.status == "success"){
            if(isCookie)
            {
                setcookie( "userId", "EXPIRED",  ((new Date().getTime()) - 1209600) );
                setcookie( "username", "EXPIRED", ((new Date().getTime()) - 1209600) );
                setcookie( "createdOn", "EXPIRED", ((new Date().getTime()) - 1209600) );
                setcookie( "updatedOn", "EXPIRED", ((new Date().getTime()) - 1209600) );
                setcookie( "updatedBy", "EXPIRED", ((new Date().getTime()) - 1209600) );
                setcookie( "lastLoginOn", "EXPIRED", ((new Date().getTime()) - 1209600) );
                setcookie( "isDeleted", "EXPIRED", ((new Date().getTime()) - 1209600) );
                setcookie( "loggedInOn", response.data.data.loggedInOn, ((new Date().getTime()) - 1209600) );
                setcookie( "loggedOutOn", response.data.data.loggedOutOn, ((new Date().getTime()) - 1209600) );
                setcookie( "loggedOutBy", response.data.data.loggedOutBy, ((new Date().getTime()) - 1209600) );
                setcookie( "sessionId", "EXPIRED", ((new Date().getTime()) - 1209600) );

                callSuccessPopup("Logout Successful!", (function(){
                    window.location.href = "/login";
                }));
                
            } else {
                callWarnPopup("There was a problem... Your Cookie functionality have been turned off... Please Turn it back on!");
            }
        } else if(response.data.status == "error"){
            callErrorPopup("Logout Failed... " + response.data.responseMessage + "... Click Ok to continue!", (function() {
                //DO NOTHING YET
            }));
        } else if(response.data.status == "warning"){
            callInfoPopup(response.data.responseMessage);
        } else if(response.data.status == "information"){
            callWarnPopup(response.data.responseMessage);
        }
    }).catch(function (error) {
        console.log(error);
    }).finally(function () {
        // always executed
    });  
}

function createNewUser(arg) {
    axios.post(API_BASE_URL + "api/users/create", arg, {
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json; charset=utf-8'
        }
    }).then(function (response) {
        if(response.data.status == "success") {
            callSuccessPopup("The user account was created successfully!", (function() {
                //DO NOTHING YET
            }));
        } else if(response.data.status == "error"){
            callErrorPopup(response.data.responseMessage + "... Click Ok to continue!", (function() {
                //DO NOTHING YET
            }));
        } else if(response.data.status == "warning"){
            callInfoPopup(response.data.responseMessage);
        } else if(response.data.status == "information"){
            callWarnPopup(response.data.responseMessage);
        }
    }).catch(function (error) {
        console.log(error);
    }).finally(function () {
        // always executed
    });  
}

function createNewBooking(arg) {
    axios.post(API_BASE_URL + "api/bookings/create", arg, {
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json; charset=utf-8'
        }
    }).then(function (response) {
        if(response.data.status == "success") {
            callSuccessPopup("The booking was created successfully... Click Ok to continue!", (function() {
                window.location.href = "/showticket/" + response.data.data._id;
            }));
        } else if(response.data.status == "error"){
            callErrorPopup(response.data.responseMessage + "... Click Ok to continue!", (function() {
                //DO NOTHING YET
            }));
        } else if(response.data.status == "warning"){
            callInfoPopup(response.data.responseMessage);
        } else if(response.data.status == "information"){
            callWarnPopup(response.data.responseMessage);
        }
    }).catch(function (error) {
        console.log(error);
    }).finally(function () {
        // always executed
    });  
}

function jsonToSeatsBookingView(arrParam) {
    var _id = [];
    var seatNumber = [];
    var status = [];
    var populator = '';
    var selector = "#booking-view";

    $(selector).empty();

    for(var i = 0; i < arrParam.length; i++) {
        if( (i < 0) || (((i+1)%7) == 0)) {
            populator += '<div class="row text-center">';
        }

        $.each(arrParam, function (i, d) {
            $.each(d, function (j, e) {
                if(j == "_id"){
                    _id[i] = e;
                }
                else if(j == "seatNumber"){
                    seatNumber[i] = e;
                }
                else if(j == "status"){
                    status[i] = e;
                }
            });
        });

        populator += '<div class="col-md-2 col-sm-4 hero-feature"><div class="thumbnail"><img class="chair" src="/images/ch.png" alt=""><div class="caption"><h3 class="seatNumber">' + ((seatNumber[i] <10) ? '0' + seatNumber[i] : seatNumber[i] ) + '</h3>' + ((status[i] == "BOOKED") ? '<p class="unavailable">Unavailable</p>' : '<p class="available">Available</p>') + '<p><a href="#" onclick="let number=$(this).parent().parent().children(\':first\').text(); console.log(\'seat number \' + number); window.location.href = \'/confirm/' + _id[i] + '\';" class="btn btn-primary">Book!</a></p></div></div></div>';
        
        if((((i+1)%6) == 0)) {
            populator += '<div class="row text-center">';
        }
    }

    $(selector).append(populator);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var methods 	= {
    delete  : function(id){
      $.fallr.show({
        easingDuration    : 1000,
        buttons : {
            button1 : {text: 'Yes', onclick: function(){deleteZone(id)}},
            button2 : {text: 'No'}
        },
        easingIn          : 'easeOutBounce',
        easingOut         : 'easeInElastic',
        icon              : 'trash',
        position          : 'center',
        content           : '<h4>Delete Confirmation</h4><p>Are you sure you want to delete this entry.</p>'
      });
    },

    error   : function(message,callback){
      $.fallr.show({
        closeOverlay      : false,
        buttons           : {
                                button1 : {text: 'OK', onclick: function(){callback()}},
        },
        icon              : 'error',
        content           : '<h4>Error Message</h4><p>' + message +'.</p>'
      });
    },

    success  : function(message, callback){
      $.fallr.show({
        closeOverlay      : false,
        buttons           : {
                                button1 : {text: 'OK', onclick: function(){callback()}},
        },
        icon              : 'check',
        content           : '<h4>Success Message</h4><p>' + message +'.</p>'
      });
    },

    info    : function(message){
      $.fallr.show({
        autoclose         : 3500,
        buttons           : {},
        icon              : 'info',
        content           : '<h4>Information Message</h4><p>' + message +'.</p>'
      });
    },

    warning  : function(message){
      $.fallr.show({
        autoclose         : 3500,
        buttons           : {},
        icon              : 'minus',
        content           : '<h4>Warning Message</h4><p>' + message +'.</p>'
      });
    }
};
  
window.callDeletePopup = function callDeletePopup(id){
    var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
    methods['delete'].apply($('a[href^="#fallr-"]'),[id]);
}
  
window.callErrorPopup = function callErrorPopup(message,callback){
    var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
    methods['error'].apply($('a[href^="#fallr-"]'),[message,callback]);
}
  
window.callSuccessPopup = function callSuccessPopup(message,callback){
    var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
    methods['success'].apply($('a[href^="#fallr-"]'),[message,callback]);
}
  
window.callInfoPopup = function callInfoPopup(message){
    var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
    methods['info'].apply($('a[href^="#fallr-"]'),[message]);
}

window.callWarnPopup = function callWarnPopup(message){
    var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
    methods['warning'].apply($('a[href^="#fallr-"]'),[message]);
}

// Calling startup functions
if(isIndexPage()) {
    populateSeatsBookingView();
} else if(isBookingsPage()) {
    // DO NOTHING YET
} else if(isLoginPage()) {
    // DO NOTHING YET
} else if(isDashPage()) {
    // DO NOTHING YET
} else if(isRegisterPage()) {
    // DO NOTHING YET
} else if(isShowTicketPage()) {
    // DO NOTHING YET
} else if(isConfirmPage()) {
    // DO NOTHING YET
} else if(isConfigurePage()) {
    // DO NOTHING YET
}