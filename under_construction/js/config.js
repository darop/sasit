var params = {
	
	//Progressbar
	//set the current stat in % (0-100) //This is useless if you set a startDate
	currentState: 77,
	
	//set the Date to a GMT/UTC
	//format: mm/dd/yyyy hh:mm:ss GMT  //If you set a startDate the currenState value gets calculated
	startDate: '01/01/2011 00:00:00 GMT',
	//startDate: false,  //Set startDate to false to use the currentState value
	//format: mm/dd/yyyy hh:mm:ss GMT
	targetDate: '12/31/2012 23:59:59 GMT',
	
	//redirect when targetDate is reached (a url like http://www.google.com)
	redirectto: '',
	
	/* This Block is just for some random demonstration. delete it! */
	//currentState: Math.round(Math.random() * 70 + 30),
	//targetDate: (new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1,new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()+3)),
	/* delete until here */
	
	//increase for slower progressbar animation
	steps: 150,
	
	
	//Some dynamic text can be modified here
	texts: {
		emailstatus: 'enter your email to subscribe',
		emailinvalid: 'oops, it seems your email address is not valid!',
		emailok: 'ok, your email looks fine, click submit!',
		emailwait: 'please wait...',
		emailadded: "thanks, we got you! we will email you on launch",
		emailaddfail: "oops, it seems there is something wrong! please try again later!",
		contactforminvalidemail: 'oops, it seems your email address is not valid!',
		contactforminvalid: 'please provide all fields!',
		contactformwait: 'please wait...',
		contactformadded: "thanks for your interest! we will contact you soon!",
		contactformaddfail: "oops, it seems there is something wrong! please try again later!",
		days:'days',
		day:'day',
		hours:'hours',
		hour:'hour',
		minutes:'minutes',
		minute:'minute',
		seconds:'seconds',
		second:'second'
	}
	
};