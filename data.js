function loadData(){
	d3.queue()
		.defer(d3.json, "16-17.json")
		.defer(d3.json, "17-18.json")
		.defer(d3.json, "term6.json")
		.defer(d3.csv, "member.csv")
		.await(ready);

	function ready(error, data1617, data1718, dataTerm6, memberList){
		/*
		console.log("legco vote of 2016-2017");
		console.log(data1617);
		console.log("legco vote of 2017-2018");
		console.log(data1718);
		*/
		console.log("Merge data: all votes in legco term 6 so far (up tp March 22th 2018)");
		console.log(dataTerm6);

		processData(dataTerm6);
		stats(dataTerm6, memberList);
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
			d3.select(".motionInfo").select(".motion-ch").html("Motion Name (Chinese): " + choiceOfMotion["motion-ch"]);
			d3.select(".motionInfo").select(".motion-en").html("Motion Name (English): " + choiceOfMotion["motion-en"]);
			d3.select(".motionInfo").select(".vote-date").html("Date-Time of Vote: " + choiceOfMotion["vote-date"] + " - " + choiceOfMotion["vote-time"] );
			d3.select(".motionInfo").select(".vote-result").html("Result: "+choiceOfMotion["vote-summary"]["overall"]["result"]);
			d3.select(".motionInfo").select(".mover").html("Motion mover: " + choiceOfMotion["mover-en"] + ", " + choiceOfMotion["mover-ch"]);
			var sepFlag = choiceOfMotion["vote-separate-mechanism"];
			d3.select(".motionInfo").select(".voteSepMech").html("Vote Seperate Mechanism: " + sepFlag);
			var temp1 = choiceOfMotion["vote-summary"]["geographical-constituency"];
			var temp2 = choiceOfMotion["vote-summary"]["functional-constituency"];
			if (sepFlag === "Yes"){
				d3.select(".motionInfo").select(".geo-con").html("Geographical Constituency Vote: " + "Obstain: "+ temp1["abstain-count"] + "| Vote Count: " + temp1["vote-count"] + 
															"| Yes: " + temp1["yes-count"] + "| No: " + temp1["no-count"] + "| Vote Count: " +temp1["vote-count"]+ "| Present Count: " + temp1["present-count"]);
				d3.select(".motionInfo").select(".func-con").html("Functional Constituency Vote: " + "Obstain: "+ temp2["abstain-count"] + "| Vote Count: " + temp2["vote-count"] + 
															"| Yes: " + temp2["yes-count"] + "| No: " + temp2["no-count"] + "| Vote Count: " +temp2["vote-count"]+ "| Present Count: " + temp2["present-count"]);
			} else{
				var temp = choiceOfMotion["vote-summary"]["overall"];
				d3.select(".motionInfo").select(".all-con").html("");
			}
		});
	});	
}


function stats(data, memberList){
	//console.log("memberList:");
	//console.log(memberList);

	var numberOfVotes = 0;
	data["legcohk-vote"]['meeting'].forEach(function(d){
		//console.log(d);
		numberOfVotes += d['vote'].length;
	})
	console.log("numberOfVotes: " + numberOfVotes);

	//try absent times of lam cheuck ting
	var memberName_en = "Tony TSE";

	function createRecord(__name){//function to iterate record

	var count = 0;
	var abstainCount = 0;
	var yesCount =0;
	var noCount =0;
	var absentCount =0;
	var presentCount= 0;
	var memberVotes = []; // to store one member's all vote
	var memberRecord = {"_name-en":"", "_name-ch":"", "yes":0, "no":0, "absent":0, "abstain":0, "present":0, "count":0, "party_division": 0};
	data["legcohk-vote"]['meeting'].forEach(function(d){
		//meeting
		d['vote'].forEach(function(d){
			//vote
			d["individual-votes"]["member"].forEach(function(d){
				//member
				/* general analysis
				count++; // count every vote

				if (d['vote'][0] === "Yes"){yesCount ++;}
				else if (d['vote'][0] === "No"){noCount ++;}
				else if (d['vote'][0] === "Absent"){absentCount ++;}
				else if (d['vote'][0] === "Abstain"){abstainCount ++;}
				else if (d['vote'][0] === "Present"){presentCount ++;}
				else {console.log(d['vote'][0])}
				*/
				//console.log(d["_name-en"] + "," + d["_name-ch"]);
				if (d["_name-en"] === __name){
					memberVotes.push(d);
				}
				
			})
		})
	})

	//console.log(memberVotes); see the member's all votes
	memberRecord["_name-en"] = __name;
	memberVotes.forEach(function(d){
		if (d['vote'][0] === "Yes"){memberRecord["yes"] +=1;}
		else if (d['vote'][0] === "No"){memberRecord["no"] +=1;}
		else if (d['vote'][0] === "Absent"){memberRecord["absent"] +=1;}
		else if (d['vote'][0] === "Abstain"){memberRecord["abstain"] +=1;}
		else if (d['vote'][0] === "Present"){memberRecord["present"] +=1;}
		memberRecord["count"] +=1;
	});
	//console.log(memberRecord);
	return memberRecord;
	/*
	console.log("count: " + count);
	console.log("yesCount: " + yesCount);
	console.log("noCount: " + noCount);
	console.log("abstainCount: " + abstainCount);
	console.log("absentCount: " + absentCount);
	console.log("presentCount: " + presentCount);
	*/
	}//function to iterate record

	var recordList = [];
	memberList.forEach(function(d){
		recordList.push(createRecord(d["_name-en"]));
	});
	console.log(recordList);
	//stringify json object
	//console.log(JSON.stringify(recordList));

}