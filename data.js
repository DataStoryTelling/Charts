function loadData(){
	d3.queue()
		.defer(d3.json, "16-17.json")
		.defer(d3.json, "17-18.json")
		.defer(d3.json, "term6.json")
		.await(ready);

	function ready(error, data1617, data1718, dataTerm6){
		console.log("legco vote of 2016-2017");
		console.log(data1617);
		console.log("legco vote of 2017-2018");
		console.log(data1718);

		console.log("Merge data: all votes in legco term 6 so far (up tp March 22th 2018)");
		console.log(dataTerm6);

		processData(dataTerm6);
		stats(dataTerm6);
	}
}

function processData(data){
	var meetingDates = [];
	var choiceOfMotion;
	data["legcohk-vote"]['meeting'].forEach(function(d){
		meetingDates.push(d['_start-date']);
	})
	console.log(meetingDates);

	d3.select("#meetingDates").selectAll("option")
		.data(meetingDates)
		.enter().append("option").attr("value", function(d, i){
			//get the index of meeting
			return i;
		})
		.html(function(d){return d;})

	var choiceOfMeetingDate; //is the int of index of meeting
	d3.select("#meetingDates").on("change", function(){
		//remove motions select
		d3.select("#motions").selectAll("option").remove();
		choiceOfMeetingDate = d3.select(this).property('value');
		var votes = data["legcohk-vote"]['meeting'][choiceOfMeetingDate]['vote']
		
		var motionNameChi = [];
		votes.forEach(function(d){motionNameChi.push(d["motion-ch"]);})
		d3.select("#motions").selectAll("option")
			.data(motionNameChi).enter()
			.append("option").attr("value", function(d, i){
				return i; //index of vote on that meeting
			})
			.html(function(d){return d;});

		var choiceOfMotion_index;
		d3.select("#motions").on("change", function(){
			choiceOfMotion_index = d3.select(this).property('value');
			choiceOfMotion = data["legcohk-vote"]['meeting'][choiceOfMeetingDate]['vote'][choiceOfMotion_index];
			console.log(choiceOfMotion);
		});
	});	
}


function stats(data){
	var numberOfVotes = 0;
	data["legcohk-vote"]['meeting'].forEach(function(d){
		//console.log(d);
		numberOfVotes += d['vote'].length;
	})
	console.log("numberOfVotes: " + numberOfVotes);

	//try absent times of lam cheuck ting
	var count = 0;
	var abstainCount = 0;
	var yesCount =0;
	var noCount =0;
	var absentCount =0;
	var presentCount= 0;
	data["legcohk-vote"]['meeting'].forEach(function(d){
		//meeting
		d['vote'].forEach(function(d){
			//vote
			d["individual-votes"]["member"].forEach(function(d){
				//member
				count++; // count every vote

				if (d['vote'][0] === "Yes"){yesCount ++;}
				else if (d['vote'][0] === "No"){noCount ++;}
				else if (d['vote'][0] === "Absent"){absentCount ++;}
				else if (d['vote'][0] === "Abstain"){abstainCount ++;}
				else if (d['vote'][0] === "Present"){presentCount ++;}
				else {console.log(d['vote'][0])}
				/*
				if (d["_name-ch"] === "張宇人"){
					console.log(d)
					//console.log(d["vote"][0]);
				}
				*/
			})
		})
	})
	console.log("count: " + count);
	console.log("yesCount: " + yesCount);
	console.log("noCount: " + noCount);
	console.log("abstainCount: " + abstainCount);
	console.log("absentCount: " + absentCount);
	console.log("presentCount: " + presentCount);

}