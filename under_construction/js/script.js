$(document).ready(function() {
	
		//some vars for caching
	var slides = $('.slide', '#content'),
		navanchors = $('a', '#nav');
							
	var init = function(){

		//replace all headings with custom font
		Cufon.replace('h1,h2,h3,h4,h5');
		//get the current location
		var current = location.hash.substr(3) || slides[0].id;
		
		//show current
		$('#'+current).show();						  

		slides.css({
			position:'absolute',
			top:70,
			left:0
		});
		
		//bind the pagetransition to the navigation
		navanchors.bind('click', function(){
										   
			var t = $(this);
			
			navanchors.removeClass('active');
			t.addClass('active');
			var id = t.attr('href').substr(1);
			if(id != current){
				$('#'+id).stop().css({
						  top:10,
						  opacity:0,
						  'z-index':3
						  }).show();
				$('#'+current).stop().animate({
						top:120,
						opacity:0
						}).css('zIndex', '2');
				$('#'+id).animate({
						top:70,
						opacity:1
						});
				current = id;
				document.title = document.title.split(' - ')[0]+' - '+t.text();
				location.href = '#!/'+current;
			}
			
				//if a scrollable div exists in the current section make it scrollable but only once
				if($('#'+current).find('div.scroll').length && !$('div.scroll').data('jsp')) $('div.scroll').jScrollPane();
			
			return false;
			
		});
		
		if($('#nav a[href=#'+current+']').length){
			//trigger current navigation point if it exists
			$('#nav a[href=#'+current+']').click();
		}else{
			//trigger first navigation point if not exists
			navanchors.eq(0).click();
		}
		
		
		
		//placholder in inputs is not implemented well in all browsers, so we need to trick this		
		$("[placeholder]").focus(function() {
			var el = $(this);
			if (el.val() == el.attr("placeholder")) {
				el.val("");
				el.removeClass("placeholder").css('color','#CCCCCC');
			}
		}).blur(function() {
			var el = $(this);
			if (el.val() == "" || el.val() == el.attr("placeholder")) {
				el.addClass("placeholder");
				el.val(el.attr("placeholder")).css('color','#444444');
			}
		}).blur();
		
		
		//This Sections are all optional so we have to check if they exist before init
		
		//countdown
		if ($('#countdown').length) {
			var c = new countdown();
			c.start();
		}
		//progress bar
		if ($('#progess').length) {
			var p = new progress();
			p.start();
		}
		//email subscription
		if ($('#emailfield').length) {
			var e = new email();
			e.init();
		}
		//contact form
		if ($('#contact').length) {
			var co = new contact();
			co.init();
		}
	};



/* COUNTDOWN SECTION START
  *  
  *  This part for the Countdown
  */

    var countdown = function () {

        var interval, i = 0,
            now, finish = new Date(params.targetDate),
            values = [0, 0, 0, 0],
			text = '',
			d = $('#days'),
			h = $('#hours'),
			m = $('#minutes'),
			s = $('#seconds');


        //Make Countdown visible and fade in
        $('#countdown').hide().css('visibility', 'visible').fadeIn('slow');


        //method for setting the values
        function setValues() {
			printValue(d, values[0]);
			printValue(h, values[1]);
			printValue(m, values[2]);
			printValue(s, values[3]);
		}

        
		function printValue(el, value) {

            //if the letter exists
            if (el.length) {
				if(!values[0]){
					//days are 0 so delete it
					d.remove();
					if(!values[1]){
						//hours are 0 so delete it
						h.remove();
						if(!values[2]){
							//minutes are 0 so delete it
							m.remove();
						}
					}
				}
                drawLetters(el, value.toString());
            }
        }

        //method for drawing letters
        function drawLetters(el, value) {
            var d = [],
                v = '',
                l,
				id = el.attr('id'),
				name = params.texts[id];
						
            //increment each letter and wrap it with a span tag
            for (var i = 0; i < value.length; i++) {
                l = value.substr(i, 1);
                d.push(l);
                v += '<span class="letter c i_' + l + '">&nbsp;</span>';
            }
			//take the singular
			if(value == 1){
				name = params.texts[id.substring(0,id.length-1)];	
			}
            //write the new letters in the element
            el.html(v+name+'&nbsp;');
        }

        //method for Interval. sets the values
        function calc() {
           var now = new Date(),
           	sec = Math.round((finish - now) / 1000);

            //targetDate is in the future
            if (sec >= 0) {
                values[0] = calcdiff(sec, 86400, 100000);
                values[1] = calcdiff(sec, 3600, 24);
                values[2] = calcdiff(sec, 60, 60);
                values[3] = calcdiff(sec, 1, 60);
            //targetDate is in the back
            } else {
				//clear the Interval
                clearInterval(interval);
				//redirect to te specific url
                if (params.redirectto) {
                    //redirect to if set
                   window.location.href = params.redirectto;
                }
            }
            setValues();

        }

        //calcs the different
        function calcdiff(sec, n1, n2) {
            var s = ((Math.floor(sec / n1)) % n2).toString();
            return parseInt(s,10);
        }

        //first calc
        calc();


        //public methods
        return {
            start: function () {
				interval = setInterval(function () {
					calc();
				}, 1000);
            }
        };
    };

/* COUNTDOWN SECTION END

	*/
	
	
/* PROGRESS BAR SECTION START
	*  
	*  This part for the Progress Bar
	*/

    var progress = function () {

        var el = $('#progessbar'),
            pel = $('#percent'),
            interval, i = 0;

        //set progress bar to user color
        el.css('background-color', '#58ADCC');
		
		if(params.startDate){
			//days total
			var total = (new Date(params.targetDate).getTime()-new Date(params.startDate).getTime())/86400000;
			//days since start
			var current = (new Date().getTime()-new Date(params.startDate).getTime())/86400000;
			
			//set a new currentState
			params.currentState = Math.floor((100/total)*current);
		}

		
       	//set the percentage
	    function setPercent(p) {
            el.width(p+'%');
            pel.html(p+'%');
        }


        //interval method
        function step() {

            //clears interval if no steps left
            if (i >= params.steps) {
                clearInterval(interval);
            }
           setPercent(Math.round(easing(i++, 0, params.currentState, params.steps)));
        }

        //easing method
        function easing(a, b, c, d) {
            if ((a /= d / 2) < 1) {
                return c / 2 * a * a * a * a * a + b;
            }
            return c / 2 * ((a -= 2) * a * a * a * a + 2) + b;
        }

        //public functions
        return {
            start: function () {
				interval = setInterval(function () {
					step();
				}, 10);
            }
        };
    };


/* PROGRESS BAR SECTION END
	*/




/* EMAIL SUBSCRIPTION SECTION START
	*  
	*  This part for the Email Subscription
	*/

    var email = function () {

        var timeout, email, el = $('#email'),
            form = $('#emailform'),
            button = $('#submitbutton');


        //init
        function init() {
			setStatus(params.texts.emailstatus);

			//add event handler for validation and submiting
			el.focus().bind('keyup', keyupHandler);
			form.bind('submit', submitEmail);
			
			//first check of email input
			check();
        }

        //checks the input after 500 ms
        function keyupHandler() {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                check();
            }, 500);
        }

        //sets the status
        function setStatus(status) {
            $('#emailstatus').html(status);
			Cufon.replace('h4');
        }

        //submits the email address
        function submitEmail() {

            //make email lowercase
            email = el.val().toLowerCase();

            //only when its an email
            if (verify(email)) {
                //unbind event and clear interval to prevent false status
                el.unbind('keyup');
				//disable the button
				button.attr('disabled','disabled');
                setStatus(params.texts.emailwait);
                //ajax call
                $.post("register.php", {
                    email: $.trim(email)
                }, function (data) {
					//enable the button
					button.removeAttr('disabled');
                    if (data.success) {
                        //set status and clear the input
                        setStatus(params.texts.emailadded);
                        el.val('');
                    } else {
                        //set status and rebind the keyupHandler
                        setStatus(params.texts.emailaddfail);
                        el.bind('keyup', keyupHandler);
                    }
                }, "json");
            } else {
                //email address is invalid
                setStatus(params.texts.emailinvalid);
                //focus field
                el.focus().select();
            }
            return false;
        }

        //checks the email address an change status + color of button
        function check() {
            email = el.val();
            if (verify(email)) {
                //valid email 
                button.css('background-color','#58ADCC');
				setStatus(params.texts.emailok);
            } else {
                //invalid email
                button.css('background-color','#999999');
                setStatus(params.texts.emailstatus);
            }
        }

        //verify the syntax of an email


        function verify(email) {
            email = $.trim(email.toLowerCase());
            return (email && /^([\w-]+(?:\.[\w-]+)*)\@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$|(\[?(\d{1,3}\.){3}\d{1,3}\]?)$/.test(email))
        }

        //public functions
        return {
            init: function () {
                init();
            }
        };
    };

/* EMAIL SUBSCRIPTION SECTION END
	*/


/* CONTACT FORM SECTION START
	*  
	*  This part for the Email Subscription
	*/

    var contact = function () {

        var timeout, email,
			nameel = $('#name'),
			emailel = $('#contactemail'),
			msgel = $('#contactmsg'),
            form = $('#contactform'),
            button = $('#contactsubmit'),
			valid = false;


        //init
        function init() {

			//add event handler for validation and submiting
			nameel.bind('keyup', keyupHandler);
			emailel.bind('keyup', keyupHandler);
			msgel.bind('keyup', keyupHandler);
			form.bind('submit', submitForm);

			//first check of email input
			check();
        }

        //checks the input after 500 ms
        function keyupHandler() {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                check();
            }, 500);
        }

        //sets the status


        function setStatus(status) {
            $('#contactstatus').show().html(status).delay(4000).fadeOut(1000);
        }

        //submits the email address
        function submitForm() {

            //If everything is correct
            if (valid) {
                //unbind event and clear interval to prevent false status
				nameel.unbind('keyup');
				emailel.unbind('keyup');
				msgel.unbind('keyup');
				form.unbind('submit');
				
				//disable button
				button.attr('disabled','disabled');
                setStatus(params.texts.contactformwait);
                //ajax call
                $.post("contact.php", {
                    name: $.trim(nameel.val()),
                    email: $.trim(emailel.val().toLowerCase()),
                    msg: $.trim(msgel.val())
                }, function (data) {
					//enable the input
					button.removeAttr('disabled');
                    if (data.success) {
                        //set status and clear the inputs
                        setStatus(params.texts.contactformadded);
                        nameel.val('').blur();
                        emailel.val('').blur();
                        msgel.val('').blur();
						//now its invalid again
						valid = false;
						
						init();
                    } else {
                        //set status and rebind the keyupHandler
                        setStatus(params.texts.contactformfail);
						nameel.bind('keyup', keyupHandler);
						emailel.bind('keyup', keyupHandler);
						msgel.bind('keyup', keyupHandler);
						//now its invalid again
						valid = false;
                    }
                }, "json");
            } else {
                //some fields are invalid
				var email = (emailel.val() == emailel.attr('placeholder')) ? '' : emailel.val();
				if(email != '' && !verify(email)){
					setStatus(params.texts.contactforminvalidemail);
				}else{
					setStatus(params.texts.contactforminvalid);
				}
            }
            return false;
        }

        //checks the inputs an change status + color of button
        function check() {
            email = emailel.val();
            if (verify(email) && nameel.val() != '' && msgel.val() != '' && nameel.val() != nameel.attr('placeholder') && msgel.val() != msgel.attr('placeholder')) {
                //valid inputs 
                button.css('background-color','#58ADCC');
                valid = true;
            } else {
                //invalid inputs
                button.css('background-color','#999999');
                valid = false;
            }
        }

        //verify the syntax of an email
        function verify(email) {
            email = $.trim(email.toLowerCase());
            return (email && /^([\w-]+(?:\.[\w-]+)*)\@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$|(\[?(\d{1,3}\.){3}\d{1,3}\]?)$/.test(email))
        }

        //public functions
        return {
            init: function () {
                init();
            }
        };
    };

/* CONTACT FORM SECTION END
	*/


	//init the whole thing
	init();
	
});


