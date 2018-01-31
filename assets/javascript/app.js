//Initialize Firebase
var config = {
    apiKey: "AIzaSyD0zDkV8W-YfyebRoX22x6juk_tmEW0Uv0",
    authDomain: "train-times-week7.firebaseapp.com",
    databaseURL: "https://train-times-week7.firebaseio.com",
    projectId: "train-times-week7",
    storageBucket: "train-times-week7.appspot.com",
    messagingSenderId: "314866384040"
  };

  firebase.initializeApp(config);

  //Create a variable for firebase database and empty variables for text values
  var database = firebase.database();
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";

  //Capture Button Click
  $("#add-train").on("click", function() {
      
      event.preventDefault();

      trainName = $("#trainName-input").val().trim();
      destination = $("#destination-input").val().trim();
      firstTrainTime = $("#time-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      $("#trainName-input").val("");
      $("#destination-input").val("");
      $("#time-input").val("");
      $("#frequency-input").val("");

      database.ref().push({
          dbTrainName: trainName,
          dbDestination: destination,
          dbFirstTrainTime: firstTrainTime,
          dbFrequency: frequency
      });
  });

  database.ref().on("child_added", function(snapshot) {
      var trainInfo = snapshot.val();

      //Using the dbFirstTrainTime and the dbFrequency to display the next arrival time and minutes away
      
      //Converting the first time and placing back one year to make sure it is never in the future
      var firstTimeConverted = moment(trainInfo.dbFirstTrainTime, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);
      
      //Difference in time from the first train time to the current time
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("Difference in time: " + diffTime);
      
      //The amount of time that has elapsed since the previous train 
      var timeElapsed = diffTime % trainInfo.dbFrequency;
      console.log("Time elapsed from previous train: " + timeElapsed);

      //The amount of time until the next train
      var minutesTillTrain = trainInfo.dbFrequency - timeElapsed;
      console.log(minutesTillTrain);

      //Next Train
      var nextTrain = moment().add(minutesTillTrain, "minutes");
      var nextTrainDisplay = moment(nextTrain).format("hh:mm A");
      console.log("Next Arrival: " + nextTrainDisplay);

      
      //Alter HTML to post the new train

      var newTrow = $("<tr>");
      var trainNameDisplay = $("<td>").text(trainInfo.dbTrainName);
      var destinationDisplay = $("<td>").text(trainInfo.dbDestination);
      var frequencyDisplay = $("<td>").text(trainInfo.dbFrequency);
      var nextArrivalDisplay = $("<td>").text(nextTrainDisplay);
      var minutesAwayDisplay = $("<td>").text(minutesTillTrain);
      newTrow.append(trainNameDisplay)
             .append(destinationDisplay)
             .append(frequencyDisplay)
             .append(nextArrivalDisplay)
             .append(minutesAwayDisplay);
      $("#train-display").append(newTrow);

      //Set Timeout to have page refresh every 60 seconds to keep page up to date
      setTimeout(function(){
          location= ''}, 1000 * 60
      );


  });