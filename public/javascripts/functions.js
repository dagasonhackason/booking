const API_BASE_URL = "http://localhost:3000/";
const clientJS = new ClientJS();
const isCookie = clientJS.isCookie();

if (typeof populateSeatsBookingView == "undefined") {
    var populateSeatsBookingView = () => {
        axios.get(API_BASE_URL + "api/seats", {
                param :  null,
                config : { headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json; charset=utf-8'
                }}
            }).then((response) => {
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
                    window.callErrorPopup(response.data.responseMessage + "... Click Ok to continue!", (() => {
                        //DO NOTHING YET
                    }));
                } else if(response.data.status == "warning"){
                    window.callInfoPopup(response.data.responseMessage);
                } else if(response.data.status == "information"){
                    window.callWarnPopup(response.data.responseMessage);
                }
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                // always executed
            });
    }
}

if (typeof loginAndSetSessionDetails == "undefined") {
    var loginAndSetSessionDetails = (arg) => {
        axios.post(API_BASE_URL + "api/users/login", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }
        }).then((response) => {
            if(response.data.status == "success"){
                if(isCookie) {
                    setCookie( "userId", response.data.data.userId,  ((new Date(Date.now() + 12096e5))) );
                    setCookie( "username", response.data.data.username, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "createdOn", response.data.data.createdOn, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "updatedOn", response.data.data.updatedOn, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "updatedBy", response.data.data.updatedBy, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "lastLoginOn", response.data.data.lastLoginOn, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "isDeleted", response.data.data.isDeleted, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "loggedInOn", response.data.data.loggedInOn, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "loggedOutOn", response.data.data.loggedOutOn, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "loggedOutBy", response.data.data.loggedOutBy, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "_id", response.data.data._id, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "sessionId", response.data.data.sessionId, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "isExpired", response.data.data.isExpired, ((new Date(Date.now() + 12096e5))) );
                    setCookie( "expiresOn", response.data.data.expiresOn, ((new Date(Date.now() + 12096e5))) );
                    console.log("Geting extractAllLoginSessionData() from cookie store", window.extractAllLoginSessionData());
                    window.callSuccessPopup("Login Successful!", (() => { 
                        window.location.href = "/dash";
                    }));
                } else {
                    window.callWarnPopup("There was a problem... Your Cookie functionality has been turned off... Please Turn it back on!");
                }
            } else if(response.data.status == "error"){
                window.callErrorPopup("Login Failed... " + response.data.responseMessage + "... Click Ok to continue!", (() => {
                    //DO NOTHING YET
                }));
            } else if(response.data.status == "warning"){
                window.callInfoPopup(response.data.responseMessage);
            } else if(response.data.status == "information"){
                window.callWarnPopup(response.data.responseMessage);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            // always executed
        });  
    }
}

if (typeof logoutAndKillSession == "undefined") {
    var logoutAndKillSession = (arg) => {
        axios.post(API_BASE_URL + "api/users/logout", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }
        }).then((response) => {
            if(response.data.status == "success"){
                if(isCookie) {
                    setCookie( "userId", "EXPIRED",  ((new Date().getTime()) - 1209600) );
                    setCookie( "username", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "createdOn", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "updatedOn", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "updatedBy", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "lastLoginOn", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "isDeleted", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "loggedInOn", response.data.data.loggedInOn, ((new Date().getTime()) - 1209600) );
                    setCookie( "loggedOutOn", response.data.data.loggedOutOn, ((new Date().getTime()) - 1209600) );
                    setCookie( "loggedOutBy", response.data.data.loggedOutBy, ((new Date().getTime()) - 1209600) );
                    setCookie( "_id", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "sessionId", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "isExpired", "EXPIRED", ((new Date().getTime()) - 1209600) );
                    setCookie( "expiresOn", "EXPIRED", ((new Date().getTime()) - 1209600) );

                    window.callSuccessPopup("Logout Successful!", (() => {
                        window.location.href = "/login";
                    }));
                    
                } else {
                    window.callWarnPopup("There was a problem... Your Cookie functionality has been turned off... Please Turn it back on!");
                }
            } else if(response.data.status == "error"){
                window.callErrorPopup("Logout Failed... " + response.data.responseMessage + "... Click Ok to continue!", (() => {
                    //DO NOTHING YET
                }));
            } else if(response.data.status == "warning"){
                window.callInfoPopup(response.data.responseMessage);
            } else if(response.data.status == "information"){
                window.callWarnPopup(response.data.responseMessage);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            // always executed
        });  
    }
}

if (typeof extractAllLoginSessionData == "undefined") {
    window.extractAllLoginSessionData = () => {
        if(isCookie) {
            if((!(/true/i).test(("" + getCookie("isExpired")).toLocaleLowerCase()) && getCookie("isExpired") != '') && (!(/EXPIRED/i).test(("" + getCookie("sessionId")).toLocaleUpperCase()) && getCookie("sessionId") != '')) {
                return ({
                    userId: getCookie("userId"),
                    username: getCookie("username"),
                    createdOn: getCookie("createdOn"),
                    updatedOn: getCookie("updatedOn"),
                    updatedBy: getCookie("updatedBy"),
                    lastLoginOn: getCookie("lastLoginOn"),
                    isDeleted: getCookie("isDeleted"),
                    loggedInOn: getCookie("loggedInOn"),
                    loggedOutOn: getCookie("loggedOutOn"),
                    loggedOutBy: getCookie("loggedOutBy"),
                    _id: getCookie("_id"),
                    sessionId: getCookie("sessionId"),
                    isExpired: getCookie("isExpired"),
                    expiresOn: getCookie("expiresOn")
                });
            } else {
                return (null);
            } 
        } else {
            window.callWarnPopup("There was a problem... Your Cookie functionality has been turned off... Please Turn it back on!");
            return (null);
        }
    }
}

if (typeof createNewUser == "undefined") {
    var createNewUser = (arg) => {
        axios.post(API_BASE_URL + "api/users/create", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }
        }).then((response) => {
            if(response.data.status == "success") {
                window.callSuccessPopup("The user account was created successfully!", (() => {
                    
                }));
            } else if(response.data.status == "error"){
                window.callErrorPopup(response.data.responseMessage + "... Click Ok to continue!", (() => {
                    //DO NOTHING YET
                }));
            } else if(response.data.status == "warning"){
                window.callInfoPopup(response.data.responseMessage);
            } else if(response.data.status == "information"){
                window.callWarnPopup(response.data.responseMessage);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            // always executed
        });  
    }
}

if (typeof createNewBooking == "undefined") {
    var createNewBooking = (arg) => {
        axios.post(API_BASE_URL + "api/bookings/create", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }
        }).then((response) => {
            if(response.data.status == "success") {
                window.callSuccessPopup("The booking was created successfully... Click Ok to continue!", (() => {
                    window.location.href = "/showticket/" + response.data.data._id;
                }));
            } else if(response.data.status == "error"){
                window.callErrorPopup(response.data.responseMessage + "... Click Ok to continue!", (() => {
                    //DO NOTHING YET
                }));
            } else if(response.data.status == "warning"){
                window.callInfoPopup(response.data.responseMessage);
            } else if(response.data.status == "information"){
                window.callWarnPopup(response.data.responseMessage);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            // always executed
        });  
    }
}

if (typeof jsonToSeatsBookingView == "undefined") {
    var jsonToSeatsBookingView = (arrParam) => {
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

            $.each(arrParam, (i, d) => {
                $.each(d, (j, e) => {
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

            populator += '<div class="col-md-2 col-sm-4 hero-feature"><div class="thumbnail"><img class="chair" src="/images/csd.png" alt=""><div class="caption"><h3 class="seatNumber">' + ((seatNumber[i] <10) ? '0' + seatNumber[i] : seatNumber[i] ) + '</h3>' + ((status[i] == true) ? '<p class="unavailable">Unavailable</p>' : '<p class="available">Available</p>') + '<p><a href="#" onclick="' + ((status[i] == true) ? 'callWarnPopup(\'Sorry... This Seat has been booked already!\');' : 'let number=$(this).parent().parent().children(\':first\').text(); console.log(\'seat number \' + number); window.location.href = \'/confirm/' + _id[i] + '\';') + '" class="btn btn-primary" ' + ((status[i] == true) ? 'disabled' : '') + '>Book!</a></p></div></div></div>';
            
            if((((i+1)%6) == 0)) {
                populator += '<div class="row text-center">';
            }
        }

        $(selector).append(populator);
    }
}

if (typeof setCookie == "undefined") {
    var setCookie = (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

if (typeof getCookie == "undefined") {
    var getCookie = (cname) => {
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
}

$(document).ready(() => {
    if (typeof methods == "undefined") {
        var methods 	= {
            delete  : (id) => {
            $.fallr.show({
                closeOverlay      : true,
                easingDuration    : 1000,
                buttons : {
                    button1 : {text: 'Yes', onclick: () => {callback(id)}},
                    button2 : {text: 'No'}
                },
                easingIn          : 'easeOutBounce',
                easingOut         : 'easeInElastic',
                icon              : 'trash',
                position          : 'center',
                content           : '<h4>Delete Confirmation</h4><p>Are you sure you want to delete this entry.</p>'
            });
            },

            error   : (message,callback) => {
            $.fallr.show({
                closeOverlay      : true,
                buttons           : {
                                        button1 : {text: 'OK', onclick: () => {callback()}},
                },
                icon              : 'error',
                content           : '<h4>Error Message</h4><p>' + message +'.</p>'
            });
            },

            success  : (message, callback) => {
            $.fallr.show({
                closeOverlay      : false,
                buttons           : {
                                        button1 : {text: 'OK', onclick: () => {callback()}},
                },
                icon              : 'check',
                content           : '<h4>Success Message</h4><p>' + message +'.</p>'
            });
            },

            info    : (message) => {
            $.fallr.show({
                closeOverlay      : true,
                autoclose         : 3500,
                buttons           : {},
                icon              : 'info',
                content           : '<h4>Information Message</h4><p>' + message +'.</p>'
            });
            },

            warning  : (message) => {
            $.fallr.show({
                closeOverlay      : true,
                autoclose         : 3500,
                buttons           : {},
                icon              : 'minus',
                content           : '<h4>Warning Message</h4><p>' + message +'.</p>'
            });
            }
        };
    }

    window.callDeletePopup = (id) => {
        // var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
        methods['delete'].apply($('a[href^="#fallr-"]'),[id]);
    };

    window.callErrorPopup = (message, callback) => {
        // var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
        methods['error'].apply($('a[href^="#fallr-"]'),[message, callback]);
    };

    
    window.callSuccessPopup = (message, callback) => {
        // var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
        methods['success'].apply($('a[href^="#fallr-"]'),[message, callback]);
    };

    window.callInfoPopup = (message) => {
        // var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
        methods['info'].apply($('a[href^="#fallr-"]'),[message]);
    };

    window.callWarnPopup = (message) => {
        // var id = $($('a[href^="#fallr-"]')).attr('href').substring(7);
        methods['warning'].apply($('a[href^="#fallr-"]'),[message]);
    };
});

// Calling startup functions
if(isIndexPage()) {
    populateSeatsBookingView();
} 

if(isBookingsPage()) {
    // DO NOTHING YET
} 

if(isLoginPage()) {
    // DO NOTHING YET
} 

if(isDashPage()) {
    // DO NOTHING YET
} 

if(isRegisterPage()) {
    // DO NOTHING YET
} 

if(isShowTicketPage()) {
    // DO NOTHING YET
} 

if(isConfirmPage()) {
    disableConfirmButton();
} 

if(isConfigurePage()) {
    // DO NOTHING YET
}