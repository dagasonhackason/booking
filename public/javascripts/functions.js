// const API_BASE_URL = "http://159.69.36.51:3000/";
const API_BASE_URL = "http://localhost:3000/";
const clientJS = new ClientJS();
const isCookie = clientJS.isCookie();
window.currentTablePageNumber = new Array();
window.isAPICallSessionOngoing = false;

if (typeof setCurrentTablePageNumber == "undefined") {
    var setCurrentTablePageNumber = (pageNumber) => {
        window.currentTablePageNumber.push(parseInt(pageNumber))
        console.log("Current Page changes stack for window.currentTablePageNumber", window.currentTablePageNumber);
    }
}

if (typeof getCurrentTablePageNumber == "undefined") {
    var getCurrentTablePageNumber = () => {
        if(window.isAPICallSessionOngoing) {
            if(window.currentTablePageNumber.length >= 2) {
                return parseInt(window.currentTablePageNumber[window.currentTablePageNumber.length - 2]);
            } else {
                return 0;
            }
        } else {
            if(window.currentTablePageNumber.length >= 1) {
                return parseInt(window.currentTablePageNumber[window.currentTablePageNumber.length - 1]);
            } else {
                return 0;
            }   
        }
    }
}

if (typeof populateSeatsConfigTable == "undefined") {
    var populateSeatsConfigTable = () => {
        console.log("populateSeatsConfigTable() request data", {});
        console.log("populateSeatsConfigTable() username and session request headers", window.userData.username, window.userData.sessionId);

        axios.get(API_BASE_URL + "api/seats/populate", {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
                console.log("populateSeatsConfigTable() response data", response.data);
                if(response.data.status == "success") {
                    var dataArray = response.data.data;
                    window.LoadCurrentTableReport(dataArray, "configureSeatsActions");
                } else if(response.data.status == "error"){
                    window.callErrorPopup(response.data.responseMessage, (() => {
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

if (typeof populateSecretCodesConfigTable == "undefined") {
    var populateSecretCodesConfigTable = () => {
        console.log("populateSecretCodesConfigTable() request data", {});
        console.log("populateSecretCodesConfigTable() username and session request headers", window.userData.username, window.userData.sessionId);

        axios.get(API_BASE_URL + "api/secretcodes/populate", {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
                console.log("populateSecretCodesConfigTable() response data", response.data);
                if(response.data.status == "success") {
                    var dataArray = response.data.data;
                    window.LoadCurrentTableReport(dataArray, "configureSecretCodesActions");
                } else if(response.data.status == "error"){
                    window.callErrorPopup(response.data.responseMessage, (() => {
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

if (typeof populateBookingsConfigTable == "undefined") {
    var populateBookingsConfigTable = () => {
        console.log("populateBookingsConfigTable() request data", {});
        console.log("populateBookingsConfigTable() username and session request headers", window.userData.username, window.userData.sessionId);

        axios.get(API_BASE_URL + "api/bookings/populate", {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
                console.log("populateBookingsConfigTable() response data", response.data);
                if(response.data.status == "success") {
                    var dataArray = response.data.data;
                    window.LoadCurrentTableReport(dataArray, "configureBookingsActions");
                } else if(response.data.status == "error"){
                    window.callErrorPopup(response.data.responseMessage, (() => {
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

if (typeof populateUsersConfigTable == "undefined") {
    var populateUsersConfigTable = () => {
        console.log("populateUsersConfigTable() request data", {});
        console.log("populateUsersConfigTable() username and session request headers", window.userData.username, window.userData.sessionId);

        axios.get(API_BASE_URL + "api/users/populate", {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
                console.log("populateUsersConfigTable() response data", response.data);
                if(response.data.status == "success") {
                    var dataArray = response.data.data;
                    window.LoadCurrentTableReport(dataArray, "configureUsersActions");
                } else if(response.data.status == "error"){
                    window.callErrorPopup(response.data.responseMessage, (() => {
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

if (typeof populateSeatsBookingView == "undefined") {
    var populateSeatsBookingView = () => {
        console.log("populateSeatsBookingView() request data", {});
        axios.get(API_BASE_URL + "api/seats", {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }
        }).then((response) => {
                console.log("populateSeatsBookingView() response data", response.data);
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
                    window.callErrorPopup(response.data.responseMessage, (() => {
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
        console.log("loginAndSetSessionDetails() request data", arg);
        axios.post(API_BASE_URL + "api/users/login", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }
        }).then((response) => {
            console.log("loginAndSetSessionDetails() response data", response.data);
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
                window.callErrorPopup("Login Failed... " + response.data.responseMessage, (() => {
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
    var logoutAndKillSession = () => {
        console.log("logoutAndKillSession() request data", {});
        console.log("logging out from this username and session", window.userData.username, window.userData.sessionId);

        axios.post(API_BASE_URL + "api/users/logout", {}, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
            console.log("logoutAndKillSession() response data", response.data);
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
                window.callErrorPopup("Logout Failed... " + response.data.responseMessage, (() => {
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
    window.extractAllLoginSessionData = (isToNavigateAfter, whereToNaviagte) => {
        if(isCookie) {
            if((!(/true/i).test(("" + getCookie("isExpired")).toLocaleLowerCase()) && getCookie("isExpired") != '') && (!(/EXPIRED/i).test(("" + getCookie("sessionId")).toLocaleUpperCase()) && getCookie("sessionId") != '')) {
                if(isToNavigateAfter) {
                    window.location.href = "/" + whereToNaviagte;
                } else {
                    window.userData = {
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
                    };

                    console.log("Geting window.userData from cookie store", window.userData);
                    return (window.userData);
                }
            } else {
                if(!isToNavigateAfter) {
                    window.location.href = "/" + whereToNaviagte;
                } else {
                    console.log("No correct login window.userData from cookie store... may be logged out?", {
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
                    return (null);
                }
            } 
        } else {
            window.callWarnPopup("There was a problem... Your Cookie functionality has been turned off... Please Turn it back on!");
            return (null);
        }
    }
}

if (typeof createNewUser == "undefined") {
    var createNewUser = (arg) => {
        console.log("createNewUser() request data", arg);
        axios.post(API_BASE_URL + "api/users/create", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }
        }).then((response) => {
            console.log("createNewUser() response data", response.data);
            if(response.data.status == "success") {
                window.callSuccessPopup("The user account was created successfully!", (() => {
                    
                }));
            } else if(response.data.status == "error"){
                window.callErrorPopup(response.data.responseMessage, (() => {
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
        console.log("createNewBooking() request data", arg);
        axios.post(API_BASE_URL + "api/bookings/create", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8'
            }
        }).then((response) => {
            console.log("createNewBooking() response data", response.data);
            if(response.data.status == "success") {
                window.callSuccessPopup("The booking was created successfully... Click Ok to continue!", (() => {
                    window.location.href = "/showticket/" + response.data.data._id;
                }));
            } else if(response.data.status == "error"){
                window.callErrorPopup(response.data.responseMessage, (() => {
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

if (typeof createBulkSeats == "undefined") {
    var createBulkSeats = (arg) => {
        console.log("createBulkSeats() request data", arg);
        console.log("createBulkSeats() username and session", window.userData.username, window.userData.sessionId);

        axios.post(API_BASE_URL + "api/seats/bulkcreate", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
            console.log("createBulkSeats() response data", response.data);
            if(response.data.status == "success") {
                window.callSuccessPopup(response.data.responseMessage + "... Click Ok to refresh table data!", (() => {
                    populateSeatsConfigTable();
                }));
            } else if(response.data.status == "error"){
                window.callErrorPopup(response.data.responseMessage, (() => {
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

if (typeof createSecretCode == "undefined") {
    var createSecretCode = (arg) => {
        console.log("createSecretCode() request data", arg);
        console.log("createSecretCode() username and session", window.userData.username, window.userData.sessionId);

        axios.post(API_BASE_URL + "api/secretcodes/create", arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
            console.log("createSecretCode() response data", response.data);
            if(response.data.status == "success") {
                window.callSuccessPopup(response.data.responseMessage + "... Click Ok to refresh table data!", (() => {
                    populateSecretCodesConfigTable();
                }));
            } else if(response.data.status == "error"){
                window.callErrorPopup(response.data.responseMessage, (() => {
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

if (typeof tblTypeCallback == "undefined") {
    var tblTypeCallback = (tblType) => {
        if(tblType == 'configureSeatsActions') {
            populateSeatsConfigTable();
        } else if(tblType == 'configureSecretCodesActions') {
            populateSecretCodesConfigTable();
        } else if(tblType == 'configureUsersActions') {
            populateUsersConfigTable();
        } else if(tblType == 'configureBookingsActions') {
            populateBookingsConfigTable();
        }
    };
}

if (typeof makeActionPostRequest == "undefined") {
    var makeActionPostRequest = (route, arg, tblType) => {
        console.log("makeActionPostRequest() to " + API_BASE_URL + route + " request data", arg);
        console.log("makeActionPostRequest() username and session", window.userData.username, window.userData.sessionId);

        axios.post(API_BASE_URL + route, arg, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
            console.log("makeActionPostRequest() response data", response.data);
            if(response.data.status == "success") {
                window.callSuccessPopup(response.data.responseMessage + "... Click Ok to refresh table data!", (() => {
                    window.tblTypeCallback(tblType);
                }));
            } else if(response.data.status == "error"){
                window.callErrorPopup(response.data.responseMessage, (() => {
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

if (typeof makeActionGetRequest == "undefined") {
    var makeActionGetRequest = (route, arg, tblType) => {
        console.log("makeActionGetRequest() username and session request headers", window.userData.username, window.userData.sessionId);
        
        let urlGeneratedParams = "";

        if(arg) {
            if(URLSearchParams) {
                urlGeneratedParams = new URLSearchParams(arg).toString();
            } else {
                urlGeneratedParams = Object.keys(arg).map((k) => {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(arg[k])
                }).join('&');
            }
        }

        console.log("makeActionGetRequest() request data", API_BASE_URL + route + ((arg) ? ("?" + urlGeneratedParams) : ""));

        axios.get(API_BASE_URL + route + ((arg) ? ("?" + urlGeneratedParams) : ""), {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json; charset=utf-8',
                'sessionId' : window.userData.sessionId,
                'username' : window.userData.username
            }
        }).then((response) => {
                console.log("makeActionGetRequest() response data", response.data);
                if(response.data.status == "success") {
                    window.callSuccessPopup(response.data.responseMessage + "... Click Ok to refresh table data!", (() => {
                        window.tblTypeCallback(tblType);
                    }));
                } else if(response.data.status == "error"){
                    window.callErrorPopup(response.data.responseMessage, (() => {
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

            populator += '<div class="col-md-2 col-sm-4 hero-feature"><div class="thumbnail"><img class="chair" src="/images/ch.png" alt=""><div class="caption"><h3 class="seatNumber">' + ((seatNumber[i] <10) ? '0' + seatNumber[i] : seatNumber[i] ) + '</h3>' + ((status[i] == true) ? '<p class="unavailable">Unavailable</p>' : '<p class="available">Available</p>') + '<p><a href="#" onclick="event.preventDefault(); ' + ((status[i] == true) ? 'callWarnPopup(\'Sorry... This Seat has been booked already!\');' : 'let number=$(this).parent().parent().children(\':first\').text(); console.log(\'seat number \' + number); window.location.href = \'/confirm/' + _id[i] + '\';') + '" class="btn btn-primary" ' + ((status[i] == true) ? 'disabled' : '') + '>Book!</a></p></div></div></div>';
            
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
    window.LoadCurrentTableReport = (oDataArray, tblType) => {
        window.isAPICallSessionOngoing = true;

        let configureSeatsActions = [
            {   route: "api/seats/delete", 
                method: "POST" 
            },
            {   route: "api/seats/deactivate", 
                method: "POST" 
            }, 
            // {   route: "api/seats/read/:id", 
            //     method: "GET" 
            // }, 
            // {   route: "api/seats/update/:id", 
            //     method: "POST" 
            // }
        ];

        let configureSecretCodesActions = [
            {   route: "api/secretcodes/delete", 
                method: "POST" 
            },
            // {   route: "api/secretcodes/read/:id", 
            //     method: "GET" 
            // }, 
            // {   route: "api/secretcodes/update/:id", 
            //     method: "POST" 
            // }
        ];
        
        let configureUsersActions = [
            {   route: "api/users/delete", 
                method: "POST" 
            },
            // {   route: "api/users/read/:id", 
            //     method: "GET" 
            // }, 
            // {   route: "api/users/update/:id", 
            //     method: "POST" 
            // }
        ];
        
        let configureBookingsActions = [
            // {   route: "api/bookings/read/:id", 
            //     method: "GET" 
            // },
            {   route: "api/bookings/useticket/:ticketCode/:id", 
                method: "POST" 
            }
        ];

        let jsonString = JSON.parse(JSON.stringify(oDataArray)); 
        jsonString = jsonString.map(function(individualItem) {
            let actionBuilder = "";
            let actionsArray = [];
            
            if(tblType == "configureSeatsActions") {
                actionsArray = configureSeatsActions;
            } else if(tblType == "configureSecretCodesActions") {
                actionsArray = configureSecretCodesActions;
            } else if(tblType == "configureUsersActions") {
                actionsArray = configureUsersActions;
            } else if(tblType == "configureBookingsActions") {
                actionsArray = configureBookingsActions;
            }

            for(let i = 0; i < actionsArray.length; i++) {
                if((new String("" + actionsArray[i].route)).endsWith("/delete")) {
                    actionBuilder += '<a href="#" style="border-radius: 7px; color: #FFFFFF; margin: 7px; background-color: #BB0000; padding: 7px;" onclick="event.preventDefault(); console.log(\'table action calling ' + actionsArray[i].route + ' via the method ' + actionsArray[i].method + ' - ' + ("" + individualItem._id) + '\'); let route = \'' + ((individualItem.isDeleted == false) ? ("" + actionsArray[i].route) : ("" + actionsArray[i].route).replace(/delete/g, "restore")) + '\'; let argData = {_id: \'' + ("" + individualItem._id) + '\'}; makeActionPostRequest(route, argData, \'' + ("" + tblType) + '\');">' + ((individualItem.isDeleted == true) ? ('<i class="fa fa-refresh"></i>') : ('<i class="fa fa-trash"></i>')) + '</a>';
                } else if((new String("" + actionsArray[i].route)).endsWith("/read/:id")) {
                    actionBuilder += '<a href="#" style="border-radius: 7px; color: #FFFFFF; margin: 7px; background-color: #BB00BB; padding: 7px;" onclick="event.preventDefault(); console.log(\'table action calling ' + actionsArray[i].route + ' via the method ' + actionsArray[i].method + ' - ' + individualItem._id + '\'); "><i class="fa fa-search"></i></a>';
                } else if((new String("" + actionsArray[i].route)).endsWith("/update/:id")) {
                    actionBuilder += '<a href="#" style="border-radius: 7px; color: #FFFFFF; margin: 7px; background-color: #0000BB; padding: 7px;" onclick="event.preventDefault(); console.log(\'table action calling ' + actionsArray[i].route + ' via the method ' + actionsArray[i].method + ' - ' + individualItem._id + '\'); "><i class="fa fa-edit"></i></a>';
                } else if((new String("" + actionsArray[i].route)).endsWith("/useticket/:ticketCode/:id")) {
                    actionBuilder += '<a href="#" style="border-radius: 7px; color: #FFFFFF; margin: 7px; background-color: #00BB00; padding: 7px;" onclick="event.preventDefault(); console.log(\'table action calling ' + actionsArray[i].route + ' via the method ' + actionsArray[i].method + ' - ' + individualItem._id + '\'); makeActionPostRequest(\'' + ("" + actionsArray[i].route).replace(/:ticketCode/g, individualItem.ticketCode).replace(/:id/g, individualItem._id) + '\', null, \'' + ("" + tblType) + '\');"><i class="fa fa-check"></i></a>';
                } else if((new String("" + actionsArray[i].route)).endsWith("/deactivate")) {
                    actionBuilder += '<a href="#" style="border-radius: 7px; color: #FFFFFF; margin: 7px; background-color: #000000; padding: 7px;" onclick="event.preventDefault(); console.log(\'table action calling ' + actionsArray[i].route + ' via the method ' + actionsArray[i].method + ' - ' + individualItem._id + '\'); let route = \'' + ((individualItem.isActivated == true) ? ("" + actionsArray[i].route) : ("" + actionsArray[i].route).replace(/deactivate/g, "activate")) + '\'; let argData = {_id: \'' + ("" + individualItem._id) + '\'}; makeActionPostRequest(route, argData, \'' + ("" + tblType) + '\');">' + ((individualItem.isActivated == true) ? ('<i class="fa fa-ban"></i>') : ('<i class="fa fa-star"></i>')) + '</a>';
                }
                
            };

            let o = Object.assign({}, individualItem);
            o.Actions = actionBuilder;
            return o;
        });

        let tblColumns = new Array();
        let oDataTbl = $("#DataTblElement");

        if(Array.isArray(jsonString) && jsonString.length > 0) {
            let tblColumnKeys = Object.keys(jsonString[0]);
            tblColumnKeys.map(x => {
                switch(x) {
                    case "_id":
                        tblColumns.push({"data": "_id", "sTitle": "<center>_id</center>", "visible": false, mRender: function ( data, type, row ) {
                            return data ? "<center>" + data + "</center>" : "<center>" + data + "</center>";
                        }});
                    break;
                    
                    case "seatId":
                        tblColumns.push({"data": "seatId", "sTitle": "<center>Seat</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center>" + data + "</center>" : "<center>" + data + "</center>";
                        }});
                    break;
                    
                    case "secretCode":
                        tblColumns.push({"data": "secretCode", "sTitle": "<center>Secret Code</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center>" + data + "</center>" : "<center>" + data + "</center>";
                        }});
                    break;
                    
                    case "username":
                        tblColumns.push({"data": "username", "sTitle": "<center>Username</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center>" + data + "</center>" : "<center>" + data + "</center>";
                        }});
                    break;

                    case "seatNumber":
                        tblColumns.push({"data": "seatNumber", "sTitle": "<center>Seat Number</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center>" + data + "</center>" : "<center>" + data + "</center>";
                        }});
                    break;
                    
                    case "ticketCode":
                        tblColumns.push({"data": "ticketCode", "sTitle": "<center>Ticket Code</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center>" + data + "</center>" : "<center>" + data + "</center>";
                        }});
                    break;
                    
                    case "bookedByName":
                        tblColumns.push({"data": "bookedByName", "sTitle": "<center>Booked By</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center>" + data + "</center>" : "<center>" + data + "</center>";
                        }});
                    break;
                    
                    case "createdBy":
                        tblColumns.push({"data": "createdBy", "sTitle": "<center>Created By</center>", "visible": true, mRender: function ( data, type, row ) {
                            return ((("" + data) != "null") ? ("<center>" + data + "</center>") : ("<center><img src='/images/not-yet.png' style='height: 32px;' /> <b style='display: none;'>" + data + " not-yet</b><center>"));
                        }});
                    break;
                    
                    case "updatedBy":
                        tblColumns.push({"data": "updatedBy", "sTitle": "<center>Updated By</center>", "visible": true, mRender: function ( data, type, row ) {
                            return ((("" + data) != "null") ? ("<center>" + data + "</center>") : ("<center><img src='/images/not-yet.png' style='height: 32px;' /> <b style='display: none;'>" + data + " not-yet</b><center>"));
                        }});
                    break;
                    
                    case "createdOn":
                        tblColumns.push({"data": "createdOn", "sTitle": "<center>Created On</center>", "visible": true, mRender: function ( data, type, row ) {
                            return (("" + data) != "") ? "<center>" + data + "</center>" : "<center><img src='/images/not-yet.png' style='height: 32px;' /> <b style='display: none;'>" + data + " not-yet</b><center>";
                        }});
                    break;
                    
                    case "updatedOn":
                        tblColumns.push({"data": "updatedOn", "sTitle": "<center>Updated On</center>", "visible": true, mRender: function ( data, type, row ) {
                            return ((("" + data) != "") ? ("<center>" + data + "</center>") : ("<center><img src='/images/not-yet.png' style='height: 32px;' /> <b style='display: none;'>" + data + " not-yet</b><center>"));
                        }});
                    break;
                    
                    case "lastLoginOn":
                        tblColumns.push({"data": "lastLoginOn", "sTitle": "<center>Last Login On</center>", "visible": true, mRender: function ( data, type, row ) {
                            return ((("" + data) != "") ? ("<center>" + data + "</center>") : ("<center><img src='/images/not-yet.png' style='height: 32px;' /> <b style='display: none;'>" + data + " not-yet</b><center>"));
                        }});
                    break;
                    
                    case "ticketCodeUsedOn":
                        tblColumns.push({"data": "ticketCodeUsedOn", "sTitle": "<center>Ticket Code Used On</center>", "visible": true, mRender: function ( data, type, row ) {
                            return ((("" + data) != "") ? ("<center>" + data + "</center>") : ("<center><img src='/images/not-yet.png' style='height: 32px;' /> <b style='display: none;'>" + data + " not-yet</b><center>"));
                        }});
                    break;
                    
                    case "bookedOn":
                        tblColumns.push({"data": "bookedOn", "sTitle": "<center>Booked On</center>", "visible": true, mRender: function ( data, type, row ) {
                            return ((("" + data) != "") ? ("<center>" + data + "</center>") : ("<center><img src='/images/not-yet.png' style='height: 32px;' /> <b style='display: none;'>" + data + " not-yet</b><center>"));
                        }});
                    break;
                    
                    case "status":
                        tblColumns.push({"data": "status", "sTitle": "<center>Booking Status?</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center><img src='/images/booked.png' style='height: 32px;' /> <b style='display: none;'>" + data + " booked</b></center>" : "<center><img src='/images/not-booked.png' style='height: 32px;' /> <b style='display: none;'>" + data + " not-booked</b></center>";
                        }});
                    break;
                    
                    case "isActivated":
                        tblColumns.push({"data": "isActivated", "sTitle": "<center>Activated?</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center><img src='/images/check-green.png' /> <b style='display: none;'>" + data + " activated</b></center>" : "<center><img src='/images/error-red.png' /> <b style='display: none;'>" + data + " not-activated</b><center>";
                        }});
                    break;
                    
                    case "isDeleted":
                        tblColumns.push({"data": "isDeleted", "sTitle": "<center>Deleted?</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center><img src='/images/check-green.png' /> <b style='display: none;'>" + data + " deleted</b></center>" : "<center><img src='/images/error-red.png' /> <b style='display: none;'>" + data + "not-deleted</b></center>";
                        }});
                    break;

                    case "isTicketCodeUsed":
                        tblColumns.push({"data": "isTicketCodeUsed", "sTitle": "<center>Ticket Code Used?</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center><img src='/images/check-green.png' /> <b style='display: none;'>" + data + " used</b><center>" : "<center><img src='/images/error-red.png' /> <b style='display: none;'>" + data + " not-used</b></center>";
                        }});
                    break;
                    
                    case "Actions":
                        tblColumns.push({"data": "Actions", "sTitle": "<center>Actions</center>", "visible": true, mRender: function ( data, type, row ) {
                            return data ? "<center>" + data + "</center>" : "<center>" + data + "</center>";
                        }});
                    break;

                    default: 
                        tblColumns.push({"data": x, sTitle: x});
                    break;
                }
            });

            console.log("generated table columns", tblColumns);
            
            oDataTbl.DataTable({
                "destroy": true,
                "data" : jsonString,
                "columns" : tblColumns,
                dom: "<'row'<'col-md-6'l><'col-md-6'f>><'row'<'col-md-6'B><'col-md-6'p>><'row'<'col-md-12't>><'row'<'col-md-12'i>>",
                buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ],
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                scrollX: '1000px',
                scrollX: true,
                scrollCollapse: true,
                "responsive": true,
                "fnDrawCallback": function () {
                    console.log( 'Showing page : ' + this.fnPagingInfo().iPage );
                    setCurrentTablePageNumber(this.fnPagingInfo().iPage);
                }
            }).page(getCurrentTablePageNumber()).draw(false);

            console.log("seting oDataTbl pageNumber to", getCurrentTablePageNumber());
            window.isAPICallSessionOngoing = false;
        }
    };

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
                                        button1 : {text: 'OK', onclick: () => {
                                            callback();
                                            $.fallr.hide();
                                        }},
                },
                icon              : 'error',
                content           : '<h4>Error Message</h4><p>' + message +'.</p>'
            });
            },

            success  : (message, callback) => {
            $.fallr.show({
                closeOverlay      : false,
                buttons           : {
                                        button1 : {text: 'OK', onclick: () => {
                                            callback();
                                            $.fallr.hide();
                                        }},
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
        methods['delete'].apply($('a[href^="#fallr-"]'),[id]);
    };

    window.callErrorPopup = (message, callback) => {
        methods['error'].apply($('a[href^="#fallr-"]'),[message, callback]);
    };

    
    window.callSuccessPopup = (message, callback) => {
        methods['success'].apply($('a[href^="#fallr-"]'),[message, callback]);
    };

    window.callInfoPopup = (message) => {
        methods['info'].apply($('a[href^="#fallr-"]'),[message]);
    };

    window.callWarnPopup = (message) => {
        methods['warning'].apply($('a[href^="#fallr-"]'),[message]);
    };
});

// Calling startup functions
if(typeof isIndexPage != "undefined") {
    populateSeatsBookingView();
} else if(typeof isBookingsPage != "undefined") {
    window.userData = window.extractAllLoginSessionData(false, "dash");
} else if(typeof isLoginPage != "undefined") {
    window.userData = window.extractAllLoginSessionData(true, "dash");
} else if(typeof isDashPage != "undefined") {
    window.userData = window.extractAllLoginSessionData(false, "login");
} else if(typeof isRegisterPage != "undefined") {
    window.userData = window.extractAllLoginSessionData(true, "dash");
} else if(typeof isShowTicketPage != "undefined") {
    // DO NOTHING YET
} else if(typeof isConfirmPage != "undefined") {
    disableConfirmButton();
} else if(typeof isConfigurePage != "undefined") {
    window.userData = window.extractAllLoginSessionData(false, "login");
}