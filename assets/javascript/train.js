// Create Variables Needed For Program
var trainName = "";
var destination = "";
var frequency = 0;
var time;
var convertedTime;
var currentTime;
var timeDifference;
var remainder;
var minutesLeft;
var nextTrainTime;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDjAgBODS-gIWYJ1eC9az38jQ87N1s5GkU",
  authDomain: "train-scheduler-cc76d.firebaseapp.com",
  databaseURL: "https://train-scheduler-cc76d.firebaseio.com",
  projectId: "train-scheduler-cc76d",
  storageBucket: "train-scheduler-cc76d.appspot.com",
  messagingSenderId: "411204775013"
};
firebase.initializeApp(config);

var database = firebase.database();

// Create On Click Event When User Submits Form Info
$('#submit').on('click', function(event) {
  event.preventDefault();

  // Store User Inputs into Appropriately Named Variables
  trainName= $("#train-name").val().trim();
  destination= $("#destination").val().trim();
  frequency= $("#frequency").val().trim();
  time= $("#train-time").val();

  console.log(trainName);
  console.log(destination);
  console.log(frequency);
  console.log(time);

  // Subtract 1 Year From time to Make Sure it's Before Current Time
  convertedTime= moment(time, "hh:mm").subtract("1, years");
  console.log(convertedTime);

  // Store Current Time into Variable
  currentTime = moment();
  console.log(currentTime);

  // Get the Difference Between Our Current Time and ConvertedTime
  timeDifference = currentTime.diff(moment(convertedTime), "minutes");
  console.log(timeDifference);

  // Calculate minutesLeft by Getting the Remainder(modulas) of timeDifference and frequency
  // And Subtractind it From the frequency
  remainder = timeDifference % frequency;
  minutesLeft = frequency - remainder;
  console.log(minutesLeft);

  // Calculate Next Train Arrival by Adding minutesLeft to CurrentTime
  nextTrainTime = moment().add(minutesLeft, "minutes").format("hh:mm a");
  console.log(nextTrainTime);

  // Clear Form Values
  $("#train-name").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#train-time").val("");

  // Push Form Values That We Stored Inside Variables into the Database(firebase)
  database.ref().push ({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      minutesLeft: minutesLeft,
      nextTrainTime: nextTrainTime
  });

});

// Put The Values Stored in Our Database into the HTML Data Table
database.ref().on("child_added", function(snapshot){
  console.log(snapshot.val());

  // Create New Table Row
  var row= $("<tr>");

  // Add Values From Database to Table Row
  var data= $("<td>" +snapshot.val().trainName + "</td><td>" +snapshot.val().destination + "</td><td>" +snapshot.val().frequency + "</td><td>" +snapshot.val().nextTrainTime + "</td><td>" +snapshot.val().minutesLeft + "</td>");
  row.append(data)

  // Add Table Row to Table Body
  $("tbody").append(row);

});