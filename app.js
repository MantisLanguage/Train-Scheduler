$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyBIOr6zYdgRRlzKoR1ewLPwkRxk-cJ4UI0",
        authDomain: "train-scheduler-70d21.firebaseapp.com",
        databaseURL: "https://train-scheduler-70d21.firebaseio.com/",
        projectId: "train-scheduler-70d21",
        storageBucket: "train-scheduler-70d21.appspot.com",
        messagingSenderId: "182770530078"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // input variables
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    // new train function
    $("#add-train").on("click", function() {
        event.preventDefault();
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // database storage function
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
       
        var minAway;
        // subtract year to make it current 
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        // updating html with database values 
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});