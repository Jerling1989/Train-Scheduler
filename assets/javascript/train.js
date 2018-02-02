// CREATE VARIABLES NEEDED FOR PROGRAM
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

// INITIALIZE FIREBASE
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

// CREATE ON CLICK EVENT WHEN USER SUBMITS FORM INFO
$('#submit').on('click', function(event) {
  event.preventDefault();

  // STORE USER INPUTS INTO APPROPRIATELY NAMED VARIABLES
  trainName= $("#train-name").val().trim();
  destination= $("#destination").val().trim();
  frequency= $("#frequency").val().trim();
  time= $("#train-time").val();

  console.log(trainName);
  console.log(destination);
  console.log(frequency);
  console.log(time);

  // SUBTRACT 1 YEAR FROM TIME TO MAKE SURE IT'S BEFORE CURRENT TIME
  convertedTime= moment(time, "hh:mm").subtract("1, years");
  console.log(convertedTime);

  // STORE CURRENT TIME INTO VARIABLE
  currentTime = moment();
  console.log(currentTime);

  // GET THE DIFFERENCE BETWEEN OUR CURRENT TIME AND CONVERTEDTIME
  timeDifference = currentTime.diff(moment(convertedTime), "minutes");
  console.log(timeDifference);

  // CALCULATE MINUTESLEFT BY GETTING THE REMAINDER(MODULAS) OF TIMEDIFFERENCE AND FREQUENCY
  // AND SUBTRACT IT FROM THE FREQUENCY
  remainder = timeDifference % frequency;
  minutesLeft = frequency - remainder;
  console.log(minutesLeft);

  // CALCULATE NEXT TRAIN ARRIVAL BY ADDING MINUTESLEFT TO CURRENTTIME
  nextTrainTime = moment().add(minutesLeft, "minutes").format("hh:mm a");
  console.log(nextTrainTime);

  // CLEAR FORM VALUES
  $("#train-name").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#train-time").val("");

  // PUSH FORM VALUES THAT WE STORED INSIDE VARIABLES INTO THE DATABASE(FIREBASE)
  database.ref().push ({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      minutesLeft: minutesLeft,
      nextTrainTime: nextTrainTime
  });

});

// PUT THE VALUES STORED IN OUR DATABASE INTO THE HTML DATA TABLE
database.ref().on("child_added", function(snapshot){
  console.log(snapshot.val());

  // CREATE NEW TABLE ROW
  var row= $("<tr>");

  // ADD VALUES FROM DATABASE TO TABLE ROW
  var data= $("<td>" +snapshot.val().trainName + "</td><td>" +snapshot.val().destination + "</td><td>" +snapshot.val().frequency + "</td><td>" +snapshot.val().nextTrainTime + "</td><td>" +snapshot.val().minutesLeft + "</td>");
  row.append(data)

  // ADD TABLE ROW TO TABLE BODY
  $("tbody").append(row);

});