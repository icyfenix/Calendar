exports.getNItems = function(request, response) {
	var itemCount = request.params.num || 3;
	var now = new Date();
	var elligible_events = [];
	for (var i=0;i<Calendar.length;i++){
		//Eliminate dates already passed.
		if (Calendar[i].date.getTime() > now.getTime()){
			elligible_events.push(Calendar[i]);
		}
		//Now we have dates only in the future.
	}
	retItems = new Array(itemCount);
	for (var y=0;y<elligible_events.length;y++){
		var smallCount = 0;
		var num = elligible_events[y].date.getTime(); 
		for (var x=0;x<elligible_events.length;x++){
			
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
	for (var i=0;i<Calendar.length;i++){
		//Eliminate dates already passed.
		if (Calendar[i].date.toDateString() == day.toDateString()){
			elligible_events.push(Calendar[i]);
		}
		//Now we have dates only in the future.
	}



	response.send(elligible_events);
};

var Calendar = [
{
	Name : "Tutor Lillian",
	date : new Date("2/22/13 1:30 PM"),
	Description : "I have to tutor lillian because then she can learn all the things",
	Attendees : ["Lillian", "Me"],
	Location : "Citizen Space"
},
{
	Name :" Meet with DBC people",
	date : new Date("2/22/2013 7:00 PM"),
	Description : "I have to help them with their project",
	Attendees : ["Alyssa", "Sara", "Me"],
	Location : "Dev Boot Camp"
},
{
	Name : "Breakfast With Housemates",
	date : new Date("2-24-2013 9:00"),
	Description : "Meet our new housemate, Ionas!",
	Attendees : ["Me", "Janardan", "Ionas", "Greg", "Carrie", "Rowan", "Rick"],
	Location : "Home"
},
{
	Name : "Meet with Aiphi",
	date : new Date("2/24/2013 2:00"),
	Description : "Rescheduled mentorship stuff",
	Attendees : ["Me", "Aiphi"],
	Location : "Citizen Space"
},
{
	Name : "Church in Berkeley",
	date : new Date("2/25/2013 10:00"),
	Description : "Checking out the unitarian church in berkeley",
	Attendees : ["Me", "Janardan"],
	Location : "Berkeley somewhere"
},
{
	Name : "Lunch with Samihah",
	date : new Date("2/25/13 12:30"),
	Description : "Lunch and shyt ",
	Attendees : ["Me", "Samihah"],
	Location : "Julia's Kitchen"
}
]