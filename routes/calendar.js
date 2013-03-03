exports.getNItems = function(request, response) {
	var itemCount = request.params.num || 3; //pass in num of events from request
	var now = new Date(); //current date and time
	console.log("date: " + now);
	var elligible_events = [];
	for (var i = 0; i < Calendar.length; i++){
		console.log("Calendar items: " + Calendar[i].startTime);
		//Eliminate dates already passed by adding all future dates to array
		if (Calendar[i].startTime.getTime() > now.getTime()){
			elligible_events.push(Calendar[i]);
		}
		//Now we have dates only in the future.
	}
	retItems = new Array(itemCount); //new array with length of num passed in from request (default 3)
	for (var y = 0; y < elligible_events.length; y++){ //loop through eligible events array
		var smallCount = 0;
		var num = elligible_events[y].startTime.getTime(); //grab the time of each eligible event
		for (var x = 0; x < elligible_events.length; x++){ //loop through eligible events array
			if (num > elligible_events[x].startTime.getTime()){
				smallCount++; //loop through eligible events again and find the position (smallcount) for each event
			}
		}
		if (smallCount < itemCount) {
			retItems[smallCount] = elligible_events[y]; //add eligible events to retItem array in order from soonest to lastest
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
	response.send(elligible_events);vc
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
	console.log(Calendar);
};

exports.nextTime = function(req, res) {
	var activity = req.params.activity;
	console.log(req.params.activity);
	//define a variable time that will store the start time of of available activity
	var time;
	var available_times = [];
	//Loop through the next 31 days
	for (var i = 0; i < 31; i++) {
		//The day that we will check
		var day = new Date().getDate() + i;
		console.log("day: " + day);

		//create empty array with 24 null spaces (for each hour in a day)
		var dayArray = new Array(24);
		console.log("dayArray: " + JSON.stringify(dayArray));

		//loop through our Calendar data
		for (var j = 0; j < Calendar.length; j++){
			//grab the date of the start time for each calendar item (evals to a number)
			var calendarDate = Calendar[j].startTime.getDate();
			console.log("calendarDate: " + calendarDate);

			//if there is a calendar item on a the day we're checking
			if (calendarDate == day){
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

		//if the time in the dateArray is empty (does not contain an 'x')
		if (dayArray[time] !== 'x') {
			//push the day onto our available_times array
			available_times.push(day);
			console.log('available times: ' + JSON.stringify(available_times));
		}
	}

	res.send(JSON.stringify(available_times));
};

// exports.eventsOnDate = function(req, res) {
// 	var date = req.
// }

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