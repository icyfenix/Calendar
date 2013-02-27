exports.getNItems = function(request, response) {
	var itemCount = request.params.num || 3; //pass in num of events from request
	var now = new Date(); //current date and time
	var elligible_events = [];
	for (var i = 0; i < Calendar.length; i++){
		//Eliminate dates already passed by adding all future dates to array
		if (Calendar[i].date.getTime() > now.getTime()){
			elligible_events.push(Calendar[i]);
		}
		//Now we have dates only in the future.
	}
	retItems = new Array(itemCount); //new array with length of num passed in from request
	for (var y = 0; y < elligible_events.length; y++){ //loop through eligible events array
		var smallCount = 0;
		var num = elligible_events[y].date.getTime(); //grab the time of each eligible event
		for (var x = 0; x < elligible_events.length; x++){ //loop through eligible events array
			if (num > elligible_events[x].date.getTime()){
				smallCount++;
			}
		}
		if (smallCount < itemCount) {
			retItems[smallCount] = elligible_events[y];
		}
	}
	var retString = JSON.stringify(retItems);
	response.send(retString);
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
	console.log(Calendar);
};

// exports.nextTimeCanActivity = function(req, res) {
// 	var now = new Date(); //current date and time
// 	var activity = req.param.activity;
// 	var available_times = [];
// 	if (activity == "lunch") {
// 		for(var i = 0; i < Calendar.length; i++) {


// 		}
// 	} else if (activity == "dinner") {

// 	} else if (activity == "drinks") {

// 	} else if (activity == "vacation") {

// 	} else if (activity == "mentor") {

// 	} else if (activity == "hack") {

// 	}
// };

var Calendar = [
{
	Name : "Tutor Lillian",
	date : new Date("3/22/13 1:30 PM"),
	Description : "I have to tutor lillian because then she can learn all the things",
	Attendees : ["Lillian", "Me"],
	Location : "Citizen Space"
},
{
	Name :" Meet with DBC people",
	date : new Date("3/22/2013 7:00 PM"),
	Description : "I have to help them with their project",
	Attendees : ["Alyssa", "Sara", "Me"],
	Location : "Dev Boot Camp"
},
{
	Name : "Breakfast With Housemates",
	date : new Date("3-24-2013 9:00"),
	Description : "Meet our new housemate, Ionas!",
	Attendees : ["Me", "Janardan", "Ionas", "Greg", "Carrie", "Rowan", "Rick"],
	Location : "Home"
},
{
	Name : "Meet with Aiphi",
	date : new Date("3/24/2013 2:00"),
	Description : "Rescheduled mentorship stuff",
	Attendees : ["Me", "Aiphi"],
	Location : "Citizen Space"
},
{
	Name : "Church in Berkeley",
	date : new Date("3/25/2013 10:00"),
	Description : "Checking out the unitarian church in berkeley",
	Attendees : ["Me", "Janardan"],
	Location : "Berkeley somewhere"
},
{
	Name : "Lunch with Samihah",
	date : new Date("3/25/13 12:30"),
	Description : "Lunch and shyt ",
	Attendees : ["Me", "Samihah"],
	Location : "Julia's Kitchen"
}
]