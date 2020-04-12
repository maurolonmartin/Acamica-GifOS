if (location.hostname.toLocaleLowerCase() == "gifos-acamica.firebaseapp.com") {
    var firebaseConfig = {
        apiKey: "AIzaSyCT7aNn-6jAEM7rLA4UK4Kw4gxvmb3HY-c",
        authDomain: "hitcounter-f9f71.firebaseapp.com",
        databaseURL: "https://hitcounter-f9f71.firebaseio.com",
        projectId: "hitcounter-f9f71",
        storageBucket: "hitcounter-f9f71.appspot.com",
        messagingSenderId: "908691370144",
        appId: "1:908691370144:web:dccde79554a0e4803819c5",
        measurementId: "G-0TZ20X2MR0"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    const rootRef = firebase.database().ref();
    // pageCountRef is just the node that tracks hits
    const pageCountsRef = rootRef.child("pageCounts");


    //Gets the key and current hit count for the page (if it exists)
    let getHistory = new Promise(function (resolve, reject) {
        //Create an object to store copy of the saved db data.
        let obj = {};
        pageCountsRef.orderByChild("page").equalTo(location.pathname).once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                obj = {
                    key: child.key,
                    count: child.val().count
                }
            });
            if (obj) {
                resolve(obj);
            } else {
                reject(error);
            }
        });
    });
    //When getHistory promise resoves, the key is either undefined (page not in the database),
    //Or key is a string that uniquely identifies the page in the database.
    getHistory.then(function (fromResolve) {
        var key = fromResolve.key;
        var pastcounts = fromResolve.count;
        //If key is undefined, create a new key for this database item.
        if (key == undefined) {
            key = pageCountsRef.push().key;
            pastcounts = 0;
        }
        //Total hits to date.
        counts = pastcounts + 1;
        //Gather info to post
        var postData = {
            page: location.pathname,
            count: counts,
            lastvisit: firebase.database.ServerValue.TIMESTAMP,
            lastreferrer: document.referrer
        }

        var updates = {}
        updates["/pageCounts/" + key] = postData;
        document.getElementById("contador").innerHTML = postData.count;
        rootRef.update(updates);
    }).catch(function (fromReject) {
        console.log(error);
    })
}