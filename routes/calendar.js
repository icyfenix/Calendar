// var db = require('pg');
// express = require('express');

// //make app local to file (references the same app as app.js)
// var app = express();

exports.getNItems = function(request, response) {
	// var SQL = 'SELECT * FROM events ORDER BY date, starttime, endtime;';
	// var database = new db.Client(app.get('db connection'));
	var itemCount = request.params.num || 3; //pass in num of events from request
	var now = new Date(); //current date and time
	var eligible_events = [];
	// database.connect(function(err) {
	// 	if(!err) {
	// 		database.query(SQL, function(err, content) {
	// 			console.log(err);
	// 			console.log(content);
	// 		});
	// 	} else {
	// 		console.log('error connecting to database *sadface*');
	// 		response(err, null);
	// 	}
	// });
	for (var i = 0; i < Calendar.length; i++){
		//Eliminate dates already passed by adding all future dates to array
		if (Calendar[i].startTime.getTime() > now.getTime()){
			eligible_events.push(Calendar[i]);
		}
		//Now we have dates only in the future.
	}
	retItems = new Array(itemCount); //new array with length of num passed in from request (default 3)
	for (var y = 0; y < eligible_events.length; y++){ //loop through eligible events array
		var smallCount = 0;
		var num = eligible_events[y].startTime.getTime(); //grab the time of each eligible event
		for (var x = 0; x < eligible_events.length; x++){ //loop through eligible events array
			if (num > eligible_events[x].startTime.getTime()){
				smallCount++; //loop through eligible events again and find the position (smallcount) for each event
			}
		}
		if (smallCount < itemCount) {
			retItems[smallCount] = eligible_events[y]; //add eligible events to retItem array in order from soonest to lastest
		}
	}
	var retString = JSON.stringify(retItems); //stringify the retItem array
	response.send(retString); //send the stringified array with the response
};

exports.getItemsForDay = function(request, response) {
	var day = new Date(request.params.day);
	var elligible_events = [];
	//look for entries in that date
	for (var i = 0; i < Calendar.length; i++){
		//Eliminate dates already passed.
		if (Calendar[i].date.toDateString() == day.toDateString()){
			elligible_events.push(Calendar[i]);
		}
		//Now we have dates only in the future.
	}
	response.send(elligible_events);
};

exports.newEvent = function(req, res) {
	var event_name = req.body.newEventName;
	var event_date = req.body.newEventDate;
	var event_description = req.body.newEventDescription;
	var event_attendees = req.body.newEventAttendees;
	var event_location = req.body.newEventAttendees;
	Calendar.push({
		Name : event_name,
		date : new Date(event_date),
		Description : event_description,
		Attendees : event_attendees,
		Location : event_location
	});
	res.send('New event added to calendar successfully!');
};

exports.nextTime = function(req, res) {
	console.log(req);
	var activity = req.query.activity;
	//define a variable time that will store the start time of of available activity
	var time;
	var available_times = [];
	//Loop through the next 31 days
	for (var i = 0; i < 31; i++) {
		if(available_times.length < 3) {
			//The day that we will check
			var day = new Date().getDate() + i;
			var month = new Date().getMonth() + 1; //getMonth returns a month (0-11)
			var year = new Date().getFullYear();
			console.log("day: " + day);
			console.log("month: " + month);
			console.log("year: " + year);

			//create empty array with 24 null spaces (for each hour in a day)
			var dayArray = [];
			for (var o = 1; o < 25; o++) {
				dayArray.push(o);
			}
			console.log("dayArray: " + JSON.stringify(dayArray));

			//loop through our Calendar data
			for (var j = 0; j < Calendar.length; j++){
				//grab the month from the start time (number)
				var startMonth = Calendar[j].startTime.getMonth() + 1;
				//grab the day of the month from the start time (number)
				var startDate = Calendar[j].startTime.getDate();
				//grab the year from the start time (number)
				var startYear = Calendar[j].startTime.getFullYear();
				console.log("startMonth: " + startMonth);
				console.log("startDate: " + startDate);
				console.log("startYear: " + startYear);

				//if there is a calendar item on a the day we're checking
				if (startMonth == month && startDate == day && startYear == year) {
					//grab the start time hour (evals to a number)
					var hour = Calendar[j].startTime.getHours();
					console.log("hour: " + hour);

					//grab the end time hour (evals to a number)
					var hour2 = Calendar[j].endTime.getHours();
					console.log("hour2: " + hour2);

					//loop through through the hours, starting with the start hour and ending with the end hour
					for(var k = hour; k <= hour2; k++) {
						//add an x to the dayArray for all the hours that we have scheduled in our calendar
						dayArray[k] = 'x';
					}

					console.log("dayArray: " + JSON.stringify(dayArray));
					//return dayArray with all the busy times in the day
				}
			}

			//loop through array of available activities
			for (var m = 0; m < activities.length; m++) {

				//if the activity name we passed in matches an available activity
				if (activities[m].name == activity) {
					//grab the start time of the activity
					time = activities[m].timeStart;
					console.log("time: " + time);
				}
			}

			//if the start time in the dateArray is empty (does not contain an 'x')
			//TODO: figure out logic, so if there's any free time within a specific block, schedule activity
			if (dayArray[time] !== 'x') {
				//push the day onto our available_times array
				available_times.push(month + "-" + day + "-" + year + " at " + dayArray[time] + ":00");
				console.log('available times: ' + JSON.stringify(available_times));
			}

		} else {
			res.send(JSON.stringify(available_times));
		}
	}
};

exports.scheduleOnDate = function(req, res) {
	var searchDate = req.query.date;
	var eventsOnDate = [];
	for (var i = 0; i < Calendar.length; i++) {
		//grab the month from the start time (number)
		var startMonth = Calendar[i].startTime.getMonth() + 1;
		if (startMonth < 10) {
			startMonth = "0" + startMonth;
		}
		//grab the day of the month from the start time (number)
		var startDate = Calendar[i].startTime.getDate();
		//grab the year from the start time (number)
		var startYear = Calendar[i].startTime.getFullYear();
		var calDate = startMonth + "/" + startDate + "/" + startYear;
		if (searchDate == calDate) {
			eventsOnDate.push(Calendar[i]);
		}
	}
	var eventsOnDateString = JSON.stringify(eventsOnDate);
	res.send(eventsOnDateString);
};

var activities =[
	{
		name: 'lunch',
		length: 1,
		timeStart: 11,
		timeEnd:14
	},
	{
		name: 'drink',
		length: 3,
		timeStart: 18,
		timeEnd:22
	},
	{
		name: 'off',
		length: 8,
		timeStart: 8,
		timeEnd:18
	}
];

var Calendar = [
{
	Name : "Tutor Lillian",
	startTime : new Date("3/22/13 1:30 PM"),
	endTime : new Date("3/22/13 2:30 PM"),
	Description : "I have to tutor lillian because then she can learn all the things",
	Attendees : ["Lillian", "Me"],
	Location : "Citizen Space"
},
{
	Name :" Meet with DBC people",
	startTime : new Date("3/22/13 7:00 PM"),
	endTime : new Date("3/22/13 8:00 PM"),
	Description : "I have to help them with their project",
	Attendees : ["Alyssa", "Sara", "Me"],
	Location : "Dev Boot Camp"
},
{
	Name : "Breakfast With Housemates",
	startTime : new Date("3/24/13 9:00 AM"),
	endTime : new Date("3/24/13 10:30 AM"),
	Description : "Meet our new housemate, Ionas!",
	Attendees : ["Me", "Janardan", "Ionas", "Greg", "Carrie", "Rowan", "Rick"],
	Location : "Home"
},
{
	Name : "Meet with Aiphi",
	startTime : new Date("3/24/13 2:00 PM"),
	endTime : new Date("3/24/13 3:00 PM"),
	Description : "Rescheduled mentorship stuff",
	Attendees : ["Me", "Aiphi"],
	Location : "Citizen Space"
},
{
	Name : "Church in Berkeley",
	startTime : new Date("3/25/13 10:00 AM"),
	endTime : new Date("3/25/13 11:30 AM"),
	Description : "Checking out the unitarian church in berkeley",
	Attendees : ["Me", "Janardan"],
	Location : "Berkeley somewhere"
},
{
	Name : "Lunch with Samihah",
	startTime : new Date("3/25/13 12:30 PM"),
	endTime : new Date("3/25/13 2:30 PM"),
	Description : "Lunch and shyt ",
	Attendees : ["Me", "Samihah"],
	Location : "Julia's Kitchen"
}
]