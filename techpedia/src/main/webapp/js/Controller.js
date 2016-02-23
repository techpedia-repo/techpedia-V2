/*var techpedia = angular.module('techpedia', ['ui.bootstrap']);*/

var techpedia = angular.module('techpedia', []);

techpedia.service('MyService', ['$window',function ($window) {
	var service = {
			store: store,
			retrieve: retrieve,
			clear: clear,
			clearAll: clearAll
	};

	return service;


	function store(key, value) {
		$window.sessionStorage.setItem(key, angular.toJson(value, false));
	}

	function retrieve(key) {
		return angular.fromJson($window.sessionStorage.getItem(key));
	}

	function clear(key) {
		$window.sessionStorage.removeItem(key);
	}

	function clearAll() {
		$window.sessionStorage.clear();
	}


}]);

googlelogin = function(facebookdata){

	$.ajax({
		type: 'POST',
		url: 'ajax/emailVerification',
		contentType: 'application/x-www-form-urlencoded',
		data: {emailId : facebookdata.emailId },
		success: function(data) {
			if (data === 'success') {
				window.location.href="dashboard";
			} else if(data === 'Entered Email Id is not Existed in the database'){
				sessionStorage.setItem('googleProfile', angular.toJson(facebookdata,false));
				window.location.href="socialRegister";
			}
		},
		error: function(data) {
			alert(data);
		}
	});	
}


techpedia.controller('AboutUsController', function($scope, $http) {
	$scope.InitLoad = function() {
		$http({
			method : 'POST',
			url : 'ajax/getRecentNews',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.recentnews = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
});



techpedia.filter('anyInvalidDirtyFields', function() {
	return function(form) {
		for ( var prop in form) {
			if (form.hasOwnProperty(prop)) {
				if (form[prop].$invalid && form[prop].$dirty) {
					return true;
				}
			}
		}
		return false;
	};

});


techpedia.filter('truncate',function() {
	return function (value, wordwise, max, tail) {
		if (!value) return '';

		max = parseInt(max, 10);
		if (!max) return value;
		if (value.length == max) return value;

		value = value.substr(0, max);
		if (wordwise) {
			var lastspace = value.lastIndexOf(' ');
			if (lastspace != -1) {
				value = value.substr(0, lastspace);
			}
		}

		return value + (tail || ' …');
	};
});


techpedia.directive('datepicker-angular', function() {
	return {
		require : 'ngModel',
		link : function(scope, el, attr, ngModel) {
			$(el).datepicker({
				dateFormat : 'yy-mm-dd',	
				onSelect : function(dateText) {
					scope.$apply(function() {
						ngModel.$setViewValue(dateText);
					});
				}
			});
		}
	};
});



techpedia.directive("autoComplete", function() {
	return {
		restrict : "A",
		require : 'ngModel', // require ngModel controller
		scope : {
			AutoCompleteOptions : "=autoCompleteOptions", // use '=' instead
			// of '&'
		},
		link : function(scope, element, attrs, ngModelCtrl) {

			// prevent html5/browser auto completion
			attrs.$set('autocomplete', 'off');

			// add onSelect callback to update ngModel
			scope.AutoCompleteOptions.onSelect = function() {
				scope.$apply(function() {
					ngModelCtrl.$setViewValue(element.val());
				});
			};

			scope.autocomplete = $(element).autocomplete(scope.AutoCompleteOptions);
		}
	};
});

techpedia.directive('base64', function() {
	return {
		restrict : 'A',
		scope : {
			model : '=ngFile'
		},
		link : function(scope, elem, attrs) {

			scope.model = scope.model || {};

			scope.readerOnload = function(e) {
				var base64 = btoa(e.target.result);
				scope.model.base64 = base64;
				scope.$apply();
			};

			var reader = new FileReader();
			reader.onload = scope.readerOnload;

			elem.on('change', function() {
				var file = elem[0].files[0];
				scope.model.filetype = file.type;
				scope.model.filename = file.name;
				// converts file to binary string
				reader.readAsBinaryString(file);
			});
		}
	};
});

techpedia.controller('EditProjectController', function($scope, $http) {

	$scope.getUrlVars = function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	};

	$scope.InitLoad = function() {

		$scope.edit = {};
		$scope.edit.university = '';
		$scope.edit.studentID = '';
		$scope.edit.collge = '';
		$scope.edit.state = '';

		$http({
			method : 'POST',
			url : 'getId',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.registerId = data;

			$http({
				method : 'POST',
				url : 'editProfileLoad',
				data : $.param({}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.edit.university = data.university;
				$scope.edit.studentID = data.studentID;
				$scope.edit.collge = data.collge;
				$scope.edit.state = data.state;
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

		$http({
			method : 'POST',
			url : 'editProjectLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {

			var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

			// Getting the project ID from URL as the service returns 0

			// Converting date from millisecond format to human readable and app
			// required format
			data.projId = $scope.getUrlVars()["id"];
			// console.log(data.projStartDate);
			var projStartDate = new Date(Number(data.projStartDate));
			// console.log(projStartDate);
			var curr_date = projStartDate.getDate();
			var curr_month = projStartDate.getMonth();
			var curr_year = projStartDate.getFullYear();
			data.projStartDate = curr_date + "-" + m_names[curr_month].substring(0, 3) + "-" + curr_year;
			// console.log(curr_date + "-" + m_names[curr_month].substring(0, 3)
			// + "-" + curr_year);

			// console.log(data.projEndDate);
			var projEndDate = new Date(Number(data.projEndDate));
			// console.log(projEndDate);
			var curr_date = projEndDate.getDate();
			var curr_month = projEndDate.getMonth();
			var curr_year = projEndDate.getFullYear();
			data.projEndDate = curr_date + "-" + m_names[curr_month].substring(0, 3) + "-" + curr_year;
			// console.log(curr_date + "-" + m_names[curr_month].substring(0, 3)
			// + "-" + curr_year);

			// Getting branches into the select 2 options
			var dataArray = [];
			for (var i = 0; i < data.projKeywords.length; i++) {
				var keyword = data.projKeywords[i];
				var json = {};
				json.id = keyword;
				json.text = keyword;
				dataArray.push(json);
			}
			console.log(JSON.stringify(dataArray));
			$("#projectKeywords").select2("data", dataArray);

			// Getting keywords into the select 2 options
			var dataArray = [];
			for (var i = 0; i < data.projBranchList.length; i++) {
				var id = data.projBranchList[i].branchId;
				var text = data.projBranchList[i].projBranchDesc;
				// alert(id + " " + text);
				var json = {};
				json.id = id;
				json.text = text;
				dataArray.push(json);

			}
			console.log(JSON.stringify(dataArray));
			$("#projectBranches").select2("data", dataArray);
			$("#projectBranches").select2("readonly", true);


			var projteamid=data.projTeamId;

			$scope.edit = data;
			$http({
				method : 'POST',
				url : 'ajax/getTeamsListForOneUser',
				data : $.param({}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.teams = data;
				for (var i=0;i<=data.length;i++) {
					if ( data[i].teamID ==$scope.edit.projTeamId) {
						$scope.edit.projTeamDesc=data[i].teamName;
					}}

			})

		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};





});

techpedia.controller('FooterController', function($scope, $http) {
	$scope.InitLoad = function() {
		$http({
			method : 'POST',
			url : 'ajax/fetchHomePageMentors',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.mentors = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
	$scope.showEmailError = function() {
		$('#emailError').show();
	};
	$scope.hideEmailError = function() {
		$('#emailError').hide();
	};
	$scope.showNameError = function() {
		$('#nameError').show();
	};
	$scope.hideNameError = function() {
		$('#nameError').hide();
	};
	$scope.$watch('file', function() {
		$scope.mentor.photo = "data:" + $scope.file.filetype + ";base64," + $scope.file.base64;
	}, true);
	$scope.viewMentor = function(mentor) {
		window.location = 'mentorDetails' + mentor.mentorId;
	};

	$scope.sendEmail = function(name,email,message){

		var empty = '';

		$("input", contactUs).each(function() {
			if($.trim($("#name").val()) === "" || $.trim($("#email").val()) === ""){
				empty="isempty";

			}

			else{
				empty="notempty";

			}
		});


		if(empty == "isempty") {
			alert("Some of the field are empty . Please fill the * marked field");
			return false;

		}else{

			$scope.message = [];
			$http({
				method : 'POST',
				url : 'ajax/contactUs',
				data : $.param({
					username : name,
					emailId : email,
					message : message
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				if (data === 'success'){
					alert("Mail sent successfully");
				}else{
					alert(data.exceptionDetails);
				}
			}).error(function(data, status, headers, config) {
				alert("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};
});

techpedia.controller('collegeDetailsController', function($scope, $http) {
	$scope.recentprojects = [ {
		projTitle : 'Loading title',
		projDescription : 'Loading description'
	} ];
	//Latest News
	$http({
		method : 'POST',
		url : 'ajax/getRecentNews',
		data : $.param({}),
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
	}).success(function(data, status, headers, config) {
		$scope.recentnews1 = data;
	}).error(function(data, status, headers, config) {
		$scope.message = [];
		$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
	});
	//Recent Projects		
	$http({
		method : 'POST',
		url : 'recentProjectSpotlightLoad',
		data : $.param({}),
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
	}).success(function(data, status, headers, config) {
		$scope.recentprojects = data;
	}).error(function(data, status, headers, config) {
		$scope.recentprojects = [ {
			projTitle : 'Failed to load data',
			projDescription : 'Please try again later'
		} ];
	});
	$scope.recentProjectVisibility = function(){
		document.getElementById("recentProjects").style.display = "block";
		$('#popularProjects').hide();
		$('#recentProjects').show();
	}

});


techpedia.controller('IndexController', function($scope, $http) {
	$scope.InitLoad = function() {
		$scope.projects = [ {
			projTitle : 'Loading title',
			projDescription : 'Loading description'
		} ];

		$scope.recentprojects = [ {
			projTitle : 'Loading title',
			projDescription : 'Loading description'
		} ];

//		Popular Projects
		$http({
			method : 'POST',
			url : 'projectSpotlightLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.projects = data;
			for(var i=0;i<$scope.projects.length;i++){
				/*alert($scope.projects[i].projCollege);*/

				$scope.projects[i].projFullName=$scope.projects[i].projTitle;
				if($scope.projects[i].projTitle.length>30){
					$scope.projects[i].projTitle=$scope.projects[i].projTitle.substring(0, 30)+"...";
				}
			}

		}).error(function(data, status, headers, config) {
			$scope.projects = [ {
				projTitle : 'Failed to load data',
				projDescription : 'Please try again later'
			} ];
		});

//		Recent Projects		
		$http({
			method : 'POST',
			url : 'recentProjectSpotlightLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.recentprojects = data;
			for(var i=0;i<$scope.recentprojects.length;i++){
				/*alert($scope.projects[i].projCollege);*/
				$scope.recentprojects[i].projFullName=$scope.recentprojects[i].projTitle;

				if($scope.recentprojects[i].projTitle.length>30){
					$scope.recentprojects[i].projTitle=$scope.recentprojects[i].projTitle.substring(0, 30)+"...";
				}
			}
		}).error(function(data, status, headers, config) {
			$scope.recentprojects = [ {
				projTitle : 'Failed to load data',
				projDescription : 'Please try again later'
			} ];
		});

		$scope.popularProjectVisibility = function(){
			$('#recentProjects').hide();
			$('#popularProjects').show();
		}

		$scope.recentProjectVisibility = function(){
			document.getElementById("recentProjects").style.display = "block";
			$('#popularProjects').hide();
			$('#recentProjects').show();
		}

		var count = 0;
		setInterval(function() {
			count = (count + 1) % $scope.projects.length;
			$scope.project = $scope.projects[count];
			$scope.$apply();
		}, 3000);

		$scope.testimonials = [ {
			testimonial : 'I am extremely happy to see an initiative of SRISTI (Society for Research and Initiatives for Sustainable Technologies and Institutions) which has led to mapping of the mind of engineering youth of our country in an unprecedented manner.',
			cite : 'Prof ABC',
			image : 'images/1.png'
		}, {
			testimonial : 'I wish all the energy to the team and hope that they will continue to link academia, industry, informal sector and the creative youth of the country.',
			cite : 'Prof PQR',
			image : 'images/2.png'
		}, {
			testimonial : 'I am particularly pleased to know that several of the innovations by the school children are also being valorized by engineering college students.',
			cite : 'Prof XYZ',
			image : 'images/3.png'
		}

		];

		var count2 = 0 ;

		function changeTestimonial(){
			count2 = (count2 + 1) % $scope.testimonials.length;
			$scope.testimonial[0] = $scope.testimonials[0];
			$scope.testimonial[1] = $scope.testimonials[1];
			$scope.testimonial[2] = $scope.testimonials[2];
		}
		$scope.testimonial ={};
		setInterval(changeTestimonial,{
			/*	$scope.testimonial[0] = $scope.testimonials[0];
			$scope.testimonial[1] = $scope.testimonials[1];
			$scope.testimonial[2] = $scope.testimonials[2];
			$scope.$apply();*/
		}, 3000);

	};

	$scope.viewProject = function(project) {
		window.location = 'projectDetails' + project.projId;
	};





});

techpedia.controller('LoginModalController', function($scope, $http,MyService) {
	$scope.InitLoad = function() {
		;
	};

	$scope.forgotPassword = function() {
		$http({
			method : 'POST',
			url : 'ajax/forgotPassword',
			data : $.param({
				token : $scope.token
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if (data.status === 'success') {
				$scope.message = [];
				$scope.message.push("Password has been Successfully sent  to your registered Email ID");
			} else {
				$('#forgotPassword').val('');
				$scope.message = [];
				$scope.message.push("Failed to send request, try later");

			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};








	$scope.popuplogin = function(){

		FB.login(function (response) {
			if (response.authResponse) {
				$scope.checkLoginState();

			} else {
				//alert("Login attempt failed!");
			}
		}, { scope: 'email,user_photos,publish_actions' });

	}


	$scope.checkLoginState = function(){

		FB.getLoginStatus(function(response) {
			$scope.facebookLogin(response);
		});
	}




	$scope.facebookLogin = function(response) {
		console.log('facebookLogin');
		console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			$scope.testAPI();
		} else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			document.getElementById('status').innerHTML = 'Please log ' +
			'into this app.';
		} else {
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			document.getElementById('status').innerHTML = 'Please log ' +
			'into Facebook.';
		}

	};



	$scope.testAPI = function(){
		console.log('Welcome!  Fetching your information.... ');
		FB.api("/me",{fields: 'name,first_name,last_name,birthday,gender,hometown,email,picture'},
				function (response) {
			$scope.details = {};
			if (response && !response.error) {

				/* handle the result */
				var datearray = new Array();
				var picture = response.picture;
				$scope.firstname = response.first_name;
				$scope.lastname = response.last_name;
				$scope.birthday = response.birthday;
				datearray = $scope.birthday.split("/");
				$scope.dob = datearray[2]+"-"+datearray[1]+"-"+datearray[0];
				$scope.gender = response.gender;
				if( $scope.imgurl == ""){
					$scope.imgurl = "images/gravatar.png";
				}else{
					$scope.imgurl = response.picture.data.url;
				}
				$scope.emailId = response.email;
				$scope.details={'firstname' : $scope.firstname,
						'lastname'  : $scope.lastname,
						'birthday'  : $scope.dob,
						'gender'    : $scope.gender,
						'emailId'   : $scope.emailId,
						'imgurl'    : $scope.imgurl
				};
				$http({
					method : 'POST',
					url : 'ajax/emailVerification',
					data : $.param({
						emailId : $scope.emailId
					}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					if (data === 'success') {
						window.location.href="dashboard";
					} else if(data === 'Entered Email Id is not Existed in the database'){
						MyService.store('key',$scope.details);
						window.location.href="socialRegister";
					}
				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});


				console.log(response);
			}
		}
		);

	}






});

techpedia.controller('ChallengeDetailsController', function($scope, $http) {
	$scope.InitLoad = function() {


		$http({
			method : 'POST',
			url : 'getUserType',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.userType = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

		$http({
			method : 'POST',
			url : 'challengeDetailsLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.challenge = data;

			$http({
				method : 'POST',
				url : 'getId',
				data : $.param({}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.registerId = data;

				$http({
					method : 'POST',
					url : 'ajax/getChallengeDocuments',
					data : $.param({
						challengeId : $scope.challenge.challengId,
						registerId : $scope.registerId
					}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					$scope.challengeDocumentList = data;
				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});

				
				//Related Projects
				
				$http({
					method : 'POST',
					url : 'ajax/getChallengeTeams',
					data : $.param({
					challengeID : $scope.challenge.challengId
					}),
					headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
					}
					}).success(function(data, status, headers, config) {
					/*alert("getChallengeTeams");*/
					$scope.projects = data;
					for(var i=0;i<$scope.projects.length;i++){

					$scope.projects[i].projBranchName = $scope.projects[i].projBranchList[0].projBranchDesc.substring(0, 13)+"...";
					}
					for(var i=0;i<$scope.projects.length;i++){
					/*alert($scope.projects[i].projCollege);*/


					if($scope.projects[i].projTitle.length>30){
					$scope.projects[i].projTitle=$scope.projects[i].projTitle.substring(0, 30)+"...";
					}
					if($scope.projects[i].projCollege.length>13){
					$scope.projects[i].projCollege=$scope.projects[i].projCollege.substring(0, 13)+"...";
					}
					if($scope.projects[i].projFacultyName.length>13){
					$scope.projects[i].projFacultyName=$scope.projects[i].projFacultyName.substring(0, 13)+"...";
					}
					if($scope.projects[i].projTeamLeaderName.length>13){
					$scope.projects[i].projTeamLeaderName=$scope.projects[i].projTeamLeaderName.substring(0, 13)+"...";
					}

					}
					}).error(function(data, status, headers, config) {
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
					});

				// Get Public Comments
				$http({
					method : 'POST',
					url : 'ajax/getChallengeComments',
					data : $.param({
						challengeId : $scope.challenge.challengId,
						set : 0
					}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					$scope.Comments = data;

				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});

				// Get if the user follows the challenge
				$http({
					method : 'POST',
					url : 'ajax/checkChallengeFollow ',
					data : $.param({
						challengeId : $scope.challenge.challengId,
						userRgstrNo : $scope.registerId,
					}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					$scope.message = [];
					if (data.status == 'success'){
						$scope.checkChallengeFollow = true;
					}
					else
						$scope.checkChallengeFollow = false;

				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});






			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});



	};

	$scope.viewProject = function(project) {
		window.location = 'projectDetails' + project.projId;
	};
	
	$scope.clickTeam = function(project) {
		window.location = 'teamDetails' + project.projTeamId;
	};
	
	$scope.acceptChallenge = function(challenge) {
		window.location = window.location = 'acceptChallenge?challengeId=' + challenge.challengId+'&&challengeTitle='+challenge.challengTitle;/*'acceptChalle />nge?challengeId=' + challenge.challengId;*/
	};

	$scope.viewMoreComments = function(comment,setNumber) {

		$scope.messagepubliccomments = [];
		$http({
			method : 'POST',
			url : 'ajax/getChallengeComments',
			data : $.param({
				challengeId : $scope.challenge.challengId,
				set : setNumber+1
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			//alert(data.length)
			if(data.length>0){

				$scope.Comments = $scope.Comments.concat(data);

			}else{
				$scope.messagepubliccomments.push("No more comments found");	
				$('#publiccomments').hide();

			}
		}).error(function(data, status, headers, config) {
			$scope.messagepubliccomments.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

	};

	//Posting public and user comments
	$scope.postpublicComment = function(comment,regid) {

		$scope.registrId = null;
		if($scope.registerId==null){
			$scope.registrId = regid;
		}else{
			$scope.registrId = $scope.registerId;
		}

		location.reload();
		$http({
			method : 'POST',
			url : 'ajax/addcomment',
			data : $.param({
				challengeId : $scope.challenge.challengId,
				registerId :$scope.registrId,
//				registerId : regid,
				comment : $scope.teamComment

			}),

			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'

			}

		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data === 'N')
				$scope.message.push("Some error occured while posting the comment");
			else {
				$scope.InitLoad();
			}
			$scope.teamComment = '';
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	// delete comments

	$scope.deleteChallengeComment = function(comment) {

		if (confirm("Are you sure ?")) {
			$http({
				method : 'POST',
				url : 'ajax/deleteChallengeComments',
				data : $.param({
					challengeId : $scope.challenge.challengId,
					commentId : comment.commentId,
					registerId : comment.regstrId
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.message = [];
				if (data.status == 'failure'){
					alert('Failed to delete comment');}


				var index = $scope.Comments.indexOf(comment);

				$scope.Comments.splice(index, 1);


			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};




	/*	$scope.postComment = function(comment) {


		$http({
			method : 'POST',
			url : 'ajax/addcomment',
			data : $.param({
				challengeId : $scope.challenge.challengId,
				registerId : $scope.registerId,
//				registerId : regid,
				comment : $scope.teamComment

			}),

			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'

			}

		}).success(function(data, status, headers, config) {

			$scope.message = [];
			if (data === 'N')
				$scope.message.push("Some error occured while posting the comment");
			else {
				$scope.InitLoad();
			}
			 $scope.teamComment = '';
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};


	//end of posting comments
	 */



	$scope.deleteDocument = function(document) {
		$http({
			method : 'POST',
			url : 'ajax/deleteChallengeDocument',
			data : $.param({
				challengeId : $scope.challenge.challengId,
				registerId : $scope.registerId,
				documentName : document.docName
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if (data.status === 'success') {
				$scope.message = [];
				var index = $scope.challengeDocumentList.indexOf(document);
				$scope.challengeDocumentList.splice(index, 1);
				$scope.message.push("Document deleted");

			} else {
				$scope.message = [];
				$scope.message.push("Failed to delete document");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.downloadDocumentLink= function(document) {
		//window.location = document.docLink;
		$http({
			method : 'POST',
			url : 'ajax/DownloadFileLink',
			data : $.param({
				documentLink : document.docLink
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}

		}).success(function(data, status, headers, config) {
			window.location = 'DownloadFile';

		})
	};

	$scope.follow = function() {
		$http({
			method : 'POST',
			url : 'ajax/followthechallenge',
			data : $.param({
				challengeId : $scope.challenge.challengId,
				userRgstrNo : $scope.registerId
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data.status == 'failure'){
				$scope.checkChallengeFollow = false;
			}
			else
				$scope.checkChallengeFollow = true;

		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.unfollow = function() {
		$http({
			method : 'POST',
			url : 'ajax/removeChallengeFollow',
			data : $.param({
				challengeId : $scope.challenge.challengId,
				userRgstrNo : $scope.registerId
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data.status == 'failure')
				$scope.checkChallengeFollow = true;
			else
				$scope.checkChallengeFollow = false;

		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};




});

techpedia.controller('MentorDetailsController', function($scope, $http) {
	$scope.initLoad = function() {
		$http({
			method : 'POST',
			url : 'ajax/mentorDetailsLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.mentor = data;
			console.log(data);
			$http({
				method : 'POST',
				url : 'ajax/getPopularity',
				data : $.param({
					registerId : $scope.mentor.rgstrId
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.popularity = data;
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
});

techpedia.controller('TeamsController', function($scope, $http) {
	$scope.InitLoad = function() {
		$http({
			method : 'POST',
			url : 'getId',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {

			$scope.registerId = data;
			if ($scope.registerId > 0) {
				$http({
					method : 'POST',
					url : 'ajax/getTeamsListForOneUser',
					data : $.param({}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					$scope.teams = data;
				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.clickTeam = function(team) {
		window.location = 'teamDetails' + team.teamID;
	};
	
		
	

	$scope.showData = function( ){

		$scope.itemsPerPage = 8;
		$scope.currentPage = 0;

		$scope.range = function() {
			var rangeSize = 8;
			var ps = [];
			var start;

			start = $scope.currentPage;
			console.log($scope.pageCount(),$scope.currentPage)//8 0
			
			if ( start > $scope.pageCount()-rangeSize ) { //0>8-4
				start = $scope.pageCount()-rangeSize+1;
			}

			for (var i=start; i<start+rangeSize; i++) { //i=0, i<4
				if(i>=0) 
					ps.push(i);
			}
			return ps;
		};

		$scope.prevPage = function() {
			if ($scope.currentPage > 0) {
				$scope.currentPage--;
			}
		};

		$scope.DisablePrevPage = function() {
			return $scope.currentPage === 0 ? "disabled" : "";
		};

		$scope.pageCount = function() {
			return Math.ceil($scope.teams.length / $scope.itemsPerPage)-1;//8
		};

		$scope.nextPage = function() {
			if ($scope.currentPage < $scope.pageCount()) {
				$scope.currentPage++;
			}
		};

		$scope.DisableNextPage = function() {
			return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
		};

		$scope.setPage = function(n) {
			$scope.currentPage = n;
		};
	}
	
	
});

techpedia.filter('pagination', function() {
	  return function(input, start) {
	    start = parseInt(start, 10);
	    return input.slice(start);
	  };
	});

techpedia.controller('TeamDetailsController', function($scope, $http) {

	$scope.initLoad = function() {
		$scope.message1 = [];
		$scope.message = [];
		$scope.search = {};
		$scope.search.firstName = '';
		$scope.search.midName = '';
		$scope.search.lastName = '';
		$scope.search.collge = '';
		$scope.search.studentID = '';

		$http({
			method : 'POST',
			url : 'getTeamId',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.teamId = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

		/*Replace Team Lead code starts here*/

		$scope.replaceTeamLead=function(regstrId){
			if(confirm("Are you Sure?")){
				$http({
					method: 'POST',
					url: 'repalceTeamLead',
					data: $.param({
						teamId: $scope.teamId,
						regstrId: regstrId ,

					}),
					headers :{
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					if (data.status == 'success') {
						$scope.message = [];
						$scope.message.push("Team Lead Successfully Replaced");
					} else {
						$scope.message = [];
						$scope.message.push("Some problem occured while replacing Team Lead");
					}
					$scope.initLoad();
				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});
			}
		}


		/*Replace Team Lead end starts here*/

		$http({
			method : 'POST',
			url : 'ajax/teamDetailsLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.members = data;
			$scope.teamName = data[0].projTeamName;
			$scope.projectId = data[0].projId;
			$scope.projectName = data[0].projTitle;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
	$('#addmemberModal').on('hidden.bs.modal', function () {
		window.location.reload();
	})

	$scope.searchMember = function(search) {
		$http({
			method : 'POST',
			url : 'ajax/searchTeamMembers',
			data : $.param(search),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {

			$scope.searchResults = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.addMember = function(registerId,name) {
		$scope.message1 = [];
		$http({
			method : 'POST',
			url : 'ajax/addTeamMember',
			data : $.param({
				registerId : registerId,
				projectId : $scope.projectId,
				teamId : $scope.teamId
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			//alert(data);
			if (data.status == 'success') {
				/*$('#addmemberModal').on('hidden.bs.modal', function () {
					location.reload();
				})*/
				$scope.message1 = [];
				$scope.message1.push(name+" has been added successfully");

			} else {
				$scope.message1 = [];
				$scope.message1.push("Some error occured in adding team member");
			}
			/*$scope.initLoad();*/
		}).error(function(data, status, headers, config) {
			$scope.message1 = [];
			$scope.message1.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.removeMember = function(member) {
		if (confirm("Are you sure to remove this member ?")) {
			$http({
				method : 'POST',
				url : 'ajax/removeTeamMember',
				data : $.param({
					registerId : member.teamMemRegstrId,
					projectId : $scope.projectId,
					teamId : $scope.teamId
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				// alert(data);
				/*alert(data.teamLeaderId);
				alert(data.teamMemRegstrId);*/
				if (data.status == 'success') {
					$scope.message = [];
					$scope.message.push("Team member removed");
				} else {
					$scope.message = [];
					$scope.message.push("Some problem occured while removing team member");
				}
				$scope.initLoad();
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};

});

techpedia.controller('ManageChallengesController', function($scope, $http) {
	$scope.initLoad = function() {
		$scope.showchallenges = true;
		$scope.showchallengesIFollow = false;
		$scope.clickFilterApplied = "My Challenges";

		$http({
			method : 'POST',
			url : 'ajax/challengesIFollow',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.challengesIFollow = data;

		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

		$scope.clickFilter1 = function(type) {

			if (type === 'my') {

				$scope.showchallenges = true;
				$scope.showchallengesIFollow = false;	

				$scope.clickFilterApplied = "My Challenges";
			}

			if (type === 'follow') {

				$scope.showchallenges = false;
				$scope.showchallengesIFollow = true;

				$scope.clickFilterApplied = "Challenges I Follow";
			}

			if (type === 'all') {
				$scope.showchallenges = true;
				$scope.showchallengesIFollow = true;

				$scope.clickFilterApplied = "All Challenges";
			}
		};

		$http({
			method : 'POST',
			url : 'getUserType',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.userType = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
		$http({
			method : 'POST',
			url : 'getId',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.registerId = data;
			if ($scope.registerId > 0) {
				$http({
					method : 'POST',
					url : 'ajax/getChallengeListForOneUser',
					data : $.param({}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					$scope.challenges = data;
				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.deleteChallenge = function(challenge) {
		alert(challenge.challengDescription);
	};

	$scope.acceptChallenge = function(challenge) {
		window.location = window.location =  'acceptChallenge?challengeId=' + challenge.challengId+'&&challengeTitle='+challenge.challengTitle;

	};

	$scope.viewChallenge = function(challenge) {
		window.location = "challengeDetails" + challenge.challengId;
	};

	$scope.uploadChallengeDocument = function() {
		$http({
			method : 'POST',
			url : 'ajax/uploadChallengeDocument',
			data : $.param({
				registerId : $scope.registerId,
				challengeId : $scope.chosenChallenge.challengId,
				documentName : $scope.file.filename,
				documentBase64 : $scope.file.base64
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if (data.status == 'success'){
				$scope.message = [];
				$scope.message.push("Document uploaded succesfully");
			} else {
				$scope.message = [];
				$scope.message.push("Failed to upload document, Please try later");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.currentChallenge = function(challenge) {
		$scope.chosenChallenge = challenge;
	};
});



/*$scope.activateProfile = function() {
	$http({
		method : 'POST',
		url : 'ajax/activateProfile',
		data : $.param({
			registerId : $scope.registerId,

		}),
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
	}).success(function(data, status, headers, config) {
		if (data.status == 'success'){
			$scope.message = [];
			$scope.message.push("Profile Activated succesfully");
		} else {
			$scope.message = [];
			$scope.message.push("Failed to Activate  Profile, Please try later");
		}
	}).error(function(data, status, headers, config) {
		$scope.message = [];
		$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
	});
};
 */


techpedia.controller('DashboardController', function($scope, $http) {
	$scope.message = [];
	$scope.myProjects=[];
	$scope.initLoad = function() {

		$scope.showMyProjects = true;
		$scope.showProjectsIFollow = true;
		$scope.clickFilterApplied = "All";


		$http({
			method : 'POST',
			url : 'ajax/getProjectListForOneUser',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.myProjects = data;
			//console.log($scope.myProjects+"No project");
			if($scope.myProjects.length===0)
			{
				$scope.message.push("No Projects ");
			}
		}).error(function(data, status, headers, config) {

			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

		$http({
			method : 'POST',
			url : 'ajax/projectsIFollow',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.projectsIFollow = data;
		}).error(function(data, status, headers, config) {
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.viewProject = function(project) {
		window.location = 'projectDetails' + project.projId;
	};

	$scope.clickFilter = function(type) {
		if (type === 'my') {
			$scope.showMyProjects = true;
			$scope.showProjectsIFollow = false;

			$scope.clickFilterApplied = "My Projects";
		}

		if (type === 'follow') {
			$scope.showMyProjects = false;
			$scope.showProjectsIFollow = true;

			$scope.clickFilterApplied = "Projects I Follow";
		}

		if (type === 'all') {
			$scope.showMyProjects = true;
			$scope.showProjectsIFollow = true;

			$scope.clickFilterApplied = "All";
		}
	};
});

techpedia.controller('ManageProjectsController', function($scope, $http) {
	$scope.selectedItem='All Projects';
	$scope.manageProjectsInit = function() {
		$scope.selectedItem='All Projects';
		$http({
			method : 'POST',
			url : 'getUserType',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.userType = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

		$http({
			method : 'POST',
			url : 'ajax/getProjectListForOneUser',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.projects = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

		$http({
			method : 'POST',
			url : 'getId',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.registerId = data;
			console.log($scope.registerId);
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.submitProject = function(id) {
		$http({
			method : 'POST',
			url : 'ajax/submitProject',
			data : $.param({
				projectId : id,
				status : 3
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			alert("Do you want to submit the project?");
			$scope.message = [];
			if (data.status == 'success') {
				window.location.reload();
				$scope.message.push("Project submitted succesfully");
			} else {
				window.location.reload();
				$scope.message.push("Some problem occured while submitting the project. Please try again later.");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.pitchProject = function(project) {
		$scope.chosenProject = project;
		$http({
			method : 'POST',
			url : 'ajax/pitchProjectSearch',
			data : $.param({
				projectId : project.projId,
				registerId: $scope.registerId
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {

			$scope.suggestedMentors = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.addMentor = function(mentor) {
		$http({
			method : 'POST',
			url : 'ajax/addMentorToProject',
			data : $.param({
				projectId : $scope.chosenProject.projId,
				mentorId : mentor.rgstrId
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if (data.status == 'success') {
				window.location = 'projectDetails' + $scope.chosenProject.projId;
				$scope.message = [];
				$scope.message.push("Mentor added");
			} else {
				$scope.message = [];
				$scope.message.push("More than two mentor can not be added for a single project");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.viewProject = function(id) {
		window.location = "projectDetails" + id;
	};

	$scope.currentProject = function(project) {

		$scope.chosenProject = project;
	};
	$scope.datarefresh = function(){
		$scope.message = "";

		location.reload();
	}

	$scope.uploadProjectDocument = function() {
		$scope.message = "";
		$http({
			method : 'POST',
			url : 'ajax/uploadProjectDocument',
			data : $.param({
				registerId : $scope.registerId,
				projectId : $scope.chosenProject.projId,
				documentName : $scope.file.filename,
				documentBase64 : $scope.file.base64
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}

		}).success(function(data, status, headers, config) {
			if (data.status == 'success') {
				$scope.message = [];
				$scope.message.push("Document uploaded succesfully");
			} else {
				$scope.message = [];
				$scope.message.push("Failed to upload document, Please try later");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

	};

	$scope.deleteProject = function(project) {
		var response = confirm("Are your sure that you want to proceed ?");
		if (response) {
			$http({
				method : 'POST',
				url : 'ajax/deleteProject',
				data : $.param({
					id : project.projId
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.message = [];
				if (data === 'Y') {
					var index = $scope.projects.indexOf(project);
					$scope.projects.splice(index, 1);
					$scope.message.push("Project deleted succesfully");
				} else {
					$scope.message.push("Failed to delete project, please try again later");
				}
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};

	$scope.editProject = function(project) {
		window.location = 'editProject?id=' + project.projId;
	};

	$scope.initiateProject = function(state) {

		$http({
			method : 'POST',
			url : 'ajax/facultyInitiateProject',
			data : $.param({
				projectId : $scope.chosenProject.projId,
				facultyId : $scope.registerId,
				approvalStatus : state
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			//console.log(data);
			if (data.status ==='success') {

				if (state === 'Y') {location.reload();
				$scope.message.push("Project initiated succesfully.");
				} else {location.reload();
				$scope.message.push("Project initiation rejected by you");
				}
			} else {
				$scope.message.push("Failed to initiate project, please try again later");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	/*$scope.closeProject = function(state) {
		// alert($scope.registerId + $scope.chosenProject.projId + " " + state);
		$http({
			method : 'POST',
			url : 'ajax/facultyCloseProject',
			data : $.param({
				projectId : $scope.chosenProject.projId,
				facultyId : $scope.registerId,
				approvalStatus : state
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data.status == 'success') {
				if (state === 'Y') {location.reload();
				$scope.message.push("Project closed succesfully");
				} else {location.reload();
				$scope.message.push("Closing of project rejected by you");
				}
			} else {
				$scope.message.push("Failed to close project, please try again later");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
	 */

	/*Mark project as completed*/
	$scope.markAsCompletedProject = function(state,grade,notes) {
		// alert($scope.registerId + $scope.chosenProject.projId + " " + state);
		$http({
			method : 'POST',
			url : 'ajax/facultyMarkedProjectAsCompleted ',
			data : $.param({
				projectId : $scope.chosenProject.projId,
				facultyId : $scope.registerId,
				approvalStatus : state,
				projectGrade : grade,
				projectNotes : notes
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data.status == 'success') {
				if (state === 'Y') {location.reload();
				$scope.message.push("Project mark as completed succesfully");
				} else {location.reload();
				$scope.message.push("Completion of project rejected by you");
				}
			} else {
				$scope.message.push("Failed to close project, please try again later");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};



	/*Modify project*/
	$scope.modifyProject = function(state,reason) {
		// alert($scope.registerId + $scope.chosenProject.projId + " " + state);
		$http({
			method : 'POST',
			url : 'ajax/modifyProjectReason ',
			data : $.param({
				projectId : $scope.chosenProject.projId,
				facultyId : $scope.registerId,
				approvalStatus : state,
				rejectReason : reason
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data.status == 'success') {
				if (state === 'Y') {location.reload();
				$scope.message.push("Project needs some modification.");
				} else {location.reload();
				$scope.message.push("Modification of project rejected by you");
				}
			} else {
				$scope.message.push("Failed to close project, please try again later");
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};



	$scope.rejectnotesPopup = function(){

		//       e.preventDefault();
		$('#grade').hide();
		$('#notes').hide();
		$('#modify').hide();
		$('#markascompleted').hide();
		$('#myModalLabel1').hide();
		$('#rejectnotes').show();
		$('#modifywithRejectNotes').show();
		$('#myModalLabel2').show();

	}

	$('#closeProjectModal').on('hidden.bs.modal', function () {
		location.reload();
	})

	$('#rejectProjectModal').on('hidden.bs.modal', function () {
		location.reload();
	})


	/*Filter project codes starts here*/
	$scope.statusCompleted= function(regstrId){
		/*$scope.selectedItem;*/
		$scope.selectedItem ='Completed Projects';
		$scope.all='All Projects';
		/*alert($scope.selectedItem);*/
		$http({
			method :'POST',
			url :'filterProjectcompleted',
			data: $.param({

				regstrId: regstrId ,
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}

		}).success(function(data, status, headers, config) {
			$scope.projects = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	}

	$scope.statusWorking=function(regstrId){
		/*$scope.selectedItem;*/
		$scope.all='All Projects';
		$scope.selectedItem = 'Working Projects';
		/*alert($scope.selectedItem);*/
		$http({
			method :'POST',
			url :'filterProjectworking',
			data: $.param({

				regstrId: regstrId ,
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}

		}).success(function(data, status, headers, config) {
			$scope.projects = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	}



	$scope.allProject=function(regstrId){
		/*$scope.selectedItem;*/
		$scope.selectedItem = 'All Projects';
		$scope.all='All Projects';

		/*alert($scope.selectedItem);*/
		$http({
			method :'POST',
			url :'ajax/getProjectListForOneUser',
			data: $.param({

				regstrId: regstrId ,
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}

		}).success(function(data, status, headers, config) {
			$scope.projects = data;
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	}







	/*Filter project codes ends here*/




});

function ProjectDetail($scope, $http) {	
	$scope.viewProject = function(project) {
		window.location = 'projectDetails' + project.projId;
	};
	$http({
		method : 'POST',
		url : 'projectsFetch',
		data : $.param({
			set : 1
		}),
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
	}).success(function(data, status, headers, config) {
		$scope.projects = data;
		for(var i=0;i<$scope.projects.length;i++){

			if($scope.projects[i].projTitle.length>41){
				$scope.projects[i].projTitle=$scope.projects[i].projTitle.substring(0, 25)+"...";
			}
			if($scope.projects[i].projCollege.length>41){
				$scope.projects[i].projCollege=$scope.projects[i].projCollege.substring(0, 25)+"...";
			}
			if($scope.projects[i].projFacultyName.length>41){
				$scope.projects[i].projFacultyName=$scope.projects[i].projFacultyName.substring(0, 25)+"...";
			}
		}
	}).error(function(data, status, headers, config) {
		$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
	});

	$scope.count = 0;
	$scope.downloadDocumentLink= function(document) {
		//window.location = document.docLink;
		$http({
			method : 'POST',
			url : 'ajax/DownloadFileLink',
			data : $.param({
				documentLink : document.docLink
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}

		}).success(function(data, status, headers, config) {
			window.location = 'DownloadFile';

		})
	};
	/*	$scope.downloadDocument = function(document) {
		$http({
			data : $.param({
				documentLink : document.docLink
			}),

		})
		window.location = 'DownloadFile';

	};*/
	$http({
		method : 'POST',
		url : 'getId',
		data : $.param({}),
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
	}).success(function(data, status, headers, config) {
		$scope.registerId = data;
	})
	$scope.InitLoad = function() {
		$http({
			method : 'POST',
			url : 'projectDetailsLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.projectdetails = data;

			$http({
				method : 'POST',
				url : 'ajax/teamDetailsLoadfordownload',
				data : $.param({

					teamId :data.projTeamId
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {


				$scope.members = data;
				for (var i=0;i<=data.length;i++) {

					if ( data[i].teamMemRegstrId == $scope.registerId) {
						$scope.teamMember= true;
					}}
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});


			/*var dataArray = [];
			for (var i = 0; i < data.projTeamMemberList.length; i++) {
				var projTeamMemberListid = data.projKeywords[i];
				 if ( data.projKeywords[i].teamID ==$scope.edit.projTeamId) {
			        	$scope.edit.projTeamDesc=data[i].teamName;
			        }
				var json = {};
				json.id = keyword;
				json.text = keyword;
				dataArray.push(json);
			}
			console.log(JSON.stringify(dataArray));
			$("#projectKeywords").select2("data", dataArray);
			 */

		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
		$http({
			method : 'POST',
			url : 'projectId',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			$scope.projectId = data;

			$http({
				method : 'POST',
				url : 'ajax/getTeamComments',
				data : $.param({
					projectId : $scope.projectId,
					set : 0
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.teamComments = data;
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});

			$http({
				method : 'POST',
				url : 'ajax/getProjectMentors',
				data : $.param({
					projectId : $scope.projectId,
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {

				$scope.projectMentorList = data;



			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});

			$http({
				method : 'POST',
				url : 'ajax/getPublicComments',
				data : $.param({
					projectId : $scope.projectId,
					set : 0
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.publicComments = data;
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});

			$http({
				method : 'POST',
				url : 'getId',
				data : $.param({}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.message = [];
				$scope.registerId = data;
				//alert($scope.registerId);
				// Get project Documents
				$http({
					method : 'POST',
					url : 'ajax/getProjectDocuments',
					data : $.param({
						projectId : $scope.projectId,
						registerId : $scope.registerId
					}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					$scope.projectDocumentList = data;

				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});

				// Get if the user follows the project
				$http({
					method : 'POST',
					url : 'ajax/doesFollow',
					data : $.param({
						projectId : $scope.projectId,
						registerId : $scope.registerId,
					}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data, status, headers, config) {
					$scope.message = [];
					if (data.status == 'success')
						$scope.doesFollow = true;
					else
						$scope.doesFollow = false;

				}).error(function(data, status, headers, config) {
					$scope.message = [];
					$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
				});
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

	};
	$scope.viewMorePublicComments = function(comment,setNumber) {

		$scope.messagepubliccomments = [];
		$http({
			method : 'POST',
			url : 'ajax/getPublicComments',
			data : $.param({
				projectId : $scope.projectId,
				set : setNumber+1
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			//alert(data.length)
			if(data.length>0){

				$scope.publicComments = $scope.publicComments.concat(data);

			}else{
				$scope.messagepubliccomments.push("No more comments found");	
				$('#publiccomments').hide();

			}
		}).error(function(data, status, headers, config) {
			$scope.messagepubliccomments.push("Possibly the service is down, Please contact the admin if problem persists.");
		});


	};
	$scope.viewMoreTeamComments = function(comment,setNumber) {

		$scope.messageteamcomments = [];
		$http({
			method : 'POST',
			url : 'ajax/getTeamComments',
			data : $.param({
				projectId : $scope.projectId,
				set : setNumber+1
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if(data.length>0){
				$scope.teamComments = $scope.teamComments.concat(data);

			}else{
				$scope.messageteamcomments.push("No more comments found");	
				$('#teamcomments').hide();

			}
		}).error(function(data, status, headers, config) {
			$scope.messageteamcomments.push("Possibly the service is down, Please contact the admin if problem persists.");
		});


	};

	$scope.deleteMentor = function(mentor) {
		if(confirm("Are you sure ?")){
			$http({
				method : 'POST',
				url : 'ajax/deleteMentorFromProject',
				data : $.param({
					projectId : $scope.projectId,
					mentorId : mentor.rgstrId
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {

				if (data.status == 'success') {

					var index = $scope.projectMentorList.indexOf(mentor);
					$scope.projectMentorList.splice(index, 1);

					$scope.mentordeletemessage = [];
					$scope.mentordeletemessage.push("Mentor deleted");
				} else {
					$scope.mentordeletemessage = [];
					$scope.mentordeletemessage.push("Failed to delete mentor");
				}
			}).error(function(data, status, headers, config) {
				$scope.mentordeletemessage = [];
				$scope.mentordeletemessage.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};

	$scope.follow = function() {
		$http({
			method : 'POST',
			url : 'ajax/followProject',
			data : $.param({
				projectId : $scope.projectId,
				registerId : $scope.registerId,
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data.status == 'failure')
				$scope.doesFollow = false;
			else
				$scope.doesFollow = true;

		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.unfollow = function() {
		$http({
			method : 'POST',
			url : 'ajax/unfollowProject',
			data : $.param({
				projectId : $scope.projectId,
				registerId : $scope.registerId,
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data.status == 'failure')
				$scope.doesFollow = true;
			else
				$scope.doesFollow = false;

		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
	$scope.postpublicComment = function(comment,regid) {
		location.reload();
		$http({
			method : 'POST',
			url : 'ajax/postComment',
			data : $.param({
				projectId : $scope.projectId,
				registerId :regid,
//				registerId : regid,
				comment : $scope.teamComment

			}),

			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'

			}

		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data === 'N')
				$scope.message.push("Some error occured while posting the comment");
			else {
				$scope.InitLoad();
			}
			$scope.teamComment = '';
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
	$scope.postComment = function(comment) {


		$http({
			method : 'POST',
			url : 'ajax/postComment',
			data : $.param({
				projectId : $scope.projectId,
				registerId : $scope.registerId,
//				registerId : regid,
				comment : $scope.teamComment

			}),

			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'

			}

		}).success(function(data, status, headers, config) {

			$scope.message = [];
			if (data === 'N')
				$scope.message.push("Some error occured while posting the comment");
			else {
				$scope.InitLoad();
			}
			$scope.teamComment = '';
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
	$scope.deletePublicComment = function(comment, type) {
		var id=-1;
		if (confirm("Are you sure ?")) {
			$http({
				method : 'POST',
				url : 'ajax/deleteComment',
				data : $.param({
					projectId : $scope.projectId,
					commentId : comment.commentId,
					registerId : id,
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.message = [];
				if (data.status == 'failure'){
					alert('Failed to delete comment');}


				var index = $scope.publicComments.indexOf(comment);

				$scope.publicComments.splice(index, 1);


			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};
	$scope.deleteComment = function(comment, type) {
		if (confirm("Are you sure ?")) {
			$http({
				method : 'POST',
				url : 'ajax/deleteComment',
				data : $.param({
					projectId : $scope.projectId,
					commentId : comment.commentId,
					registerId : $scope.registerId,
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.message = [];
				if (data.status == 'failure')
					alert('Failed to delete comment');
				else {
					if (type === 'public') {
						var index = $scope.publicComments.indexOf(comment);
						$scope.publicComments.splice(index, 1);
					} else {
						var index = $scope.teamComments.indexOf(comment);
						console.log(comment.projComment);
						console.log($scope.teamComment);
						$scope.teamComments.splice(index, 1);
					}
				}
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};

	$scope.deleteDocument = function(document) {
		$http({
			method : 'POST',
			url : 'ajax/deleteProjectDocument',
			data : $.param({
				projectId : $scope.projectId,
				registerId : $scope.registerId,
				documentName : document.docName
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if (data.status == 'success') {
				$scope.deletedocmessage = [];
				$scope.deletedocmessage.push("Document deleted Successfully");
				var index = $scope.challengeDocumentList.indexOf(document);
				$scope.challengeDocumentList.splice(index, 1);
				$scope.deletedocmessage.push("Document deleted Successfully");


			} else {
				$scope.deletedocmessage = [];
				$scope.deletedocmessage.push("Failed to delete document");
			}
		}).error(function(data, status, headers, config) {
			$scope.deletedocmessage = [];
			$scope.deletedocmessage.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};



};

techpedia.controller('AddProjectController', function($scope, $http) {
	/*$scope.$watch('file', function() {
		$scope.addProject.imgByteArray = $scope.file.base64.substring(24,$scope.file.base64.length+1);
		$scope.addProject.imgName = $scope.file.filename;
		alert("image inside"+$scope.addProject.imgByteArray+"  Name"+$scope.addProject.imgName);	
	}, true);*/

	$scope.InitLoad = function() {
		$scope.addProject = {};
		$scope.addProject.university = '';
		$scope.addProject.studentID = '';
		$scope.addProject.collge = '';
		$scope.addProject.state = '';

		$http({
			method : 'POST',
			url : 'getId',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.registerId = data;

			$http({
				method : 'POST',
				url : 'editProfileLoad',
				data : $.param({}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.addProject.university = data.university;
				$scope.addProject.studentID = data.studentID;
				$scope.addProject.collge = data.collge;
				$scope.addProject.state = data.state;
				$scope.message = [];
			}).error(function(data, status, headers, config) {

				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};



	$scope.createdNewProject=function()	
	{
		/*$scope.$watch('file', function() {
			//$scope.addProject.photo = $scope.file.base64;
			$scope.addProject.imgByteArray=$scope.file.base64;
			$scope.addProject.imgName=$scope.file.filename;
		}, true);*/
		$scope.message = "";

		$http({
			method : 'POST',
			/*url : 'registerRequest?res='+$scope.v,*/

			url: 'addProject',

			data : $.param($scope.addProject),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			if (data === 'Y') {
				$scope.message.push("Photo uploaded successfully");
			}else if (data === 'N'){
				$scope.message.push("Photo Error");
			}else {
				$scope.message.push(data);
			}

		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

	}	
	/*codes for image project upload ends here*/









});

techpedia.controller('ChangePhotoController', function($scope, $http) {
	$scope.InitLoad = function() {
		$scope.canSaveImage = false;
	};
	var img=$scope.photo;
	$scope.$watch('file', function() {
		$scope.editProfile = {};
		$scope.msg = {};
		var head = "data:" + $scope.file.filetype + ";base64,";
		$scope.editProfile.photo = head + $scope.file.base64;
		$scope.editProfile.photoSize = Math.round(($scope.editProfile.photo.length - head.length) * 3 / 4) / 1000;
		if ($scope.editProfile.photoSize > 10) {
			$scope.msg.size = "File size should not me bore than 10 KB";
			$scope.canSaveImage = false;
		} else {
			$scope.msg.size = "";
			if ($scope.editProfile.photo.indexOf("undefined") > -1) {
				$scope.editProfile.photo = img;

				$scope.canSaveImage = false;
			} else {

				$scope.canSaveImage = true;
			}
		}

	}, true);

	$scope.saveImage = function() {
		$http({
			method : 'POST',
			url : 'getId',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.id = data;
			// alert($scope.id);
			$http({
				method : 'POST',
				url : 'ajax/changeImage',
				data : $.param({
					registerId : $scope.id,
					photoByteArray : "data:" + $scope.file.filetype + ";base64," + $scope.file.base64
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				if (data === 'Y') {
					$scope.message = [];
					$scope.message.push("Photo updated succesfully");
				} else {
					$scope.message = [];
					$scope.message.push(data);
				}
			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
});





techpedia.controller('ChangePhotoFacController', function($scope, $http) {
	$scope.InitLoad = function() {
		$scope.canSaveImage = false;
	};
	var img=$scope.photo;
	$scope.$watch('file', function() {
		$scope.editProfile = {};
		$scope.msg = {};
		var head = "data:" + $scope.file.filetype + ";base64,";
		$scope.editProfile.photo = head + $scope.file.base64;
		$scope.editProfile.photoSize = Math.round(($scope.editProfile.photo.length - head.length) * 3 / 4) / 1000;
		if ($scope.editProfile.photoSize > 10) {
			$scope.msg.size = "File size should not me bore than 10 KB";
			$scope.canSaveImage = false;
		} else {
			$scope.msg.size = "";
			if ($scope.editProfile.photo.indexOf("undefined") > -1) {
				$scope.editProfile.photo = img;

				$scope.canSaveImage = false;
			} else {

				$scope.canSaveImage = true;
			}
		}

	}, true);

	$scope.saveFacImage = function() {
		$http({
			method : 'POST',
			url : 'ajax/changeFacImage',
			data : $.param({

				photoByteArray : "data:" + $scope.file.filetype + ";base64," + $scope.file.base64
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if (data === 'Y') {
				$scope.message = [];
				$scope.message.push("Photo uploaded succesfully");
			} else {
				$scope.message = [];
				$scope.message.push(data);
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

	};
});



techpedia.controller('EditProfileController', function($scope, $http) {

	$scope.initialEditProfileData = function() {
		$scope.message = [];

		$http({
			method : 'POST',
			url : 'editProfileLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			$scope.edit = data;
			$scope.edit.photo = '';
		}).error(function(data, status, headers, config) {
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
		$scope.$watch('file1', function() {
			$scope.edit.logo = "data:" + $scope.file1.filetype + ";base64," + $scope.file1.base64;
		}, true);


		var dataArray = [];
		for (var i = 0; i < data.collge.length; i++) {
			//var id = data.projBranchList[i].branchId;
			var text = data.projBranchList[0];
			alert( "hai " + text);
			var json = {};
			//json.id = id;
			json.text = text;
			dataArray.push(json);

		}



		console.log(JSON.stringify(dataArray));
		$("#CollegeNames").select2("data", dataArray);


		/*$scope.data = [ {
			"branchId" : 1,
			"projBranchDesc" : "Chemical Engineering"
		}, {
			"branchId" : 2,
			"projBranchDesc" : "Electronic and Communiaction"
		}, {
			"branchId" : 3,
			"projBranchDesc" : "Mechanical"
		}, {
			"branchId" : 4,
			"projBranchDesc" : "Electrical Engineering"
		},{
			"branchId" : 5,
			"projBranchDesc" : "Computer Science"
		} ];*/
	};

	$scope.search = function() {
		// alert($scope.form.searchTerm);
		$http({
			method : 'GET',
			data : $.param({}),
			url : 'getSuggestedBranches?q=' + $scope.searchTerm
		}).success(function(data, status, headers, config) {
			$scope.data = data;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};

	$scope.deleteState = function(){
		$scope.edit.state = "";
		$('#state').select2('data',null);
		$('#s2id_state').show();
	};
	$scope.showState = function(){
		try{
			if($scope.edit.state === ''){
				$('#s2id_state').show();
			}else{
				$('#s2id_state').hide();
			}
			return $scope.edit.state === '';
		}catch(e){}
	};

	$scope.deleteCity = function(){
		$scope.edit.city = "";
		$('#city').select2('data',null);
		$('#s2id_city').show();
	};
	$scope.showCity = function(){
		try{
			if($scope.edit.city === ''){
				$('#s2id_city').show();
			}else{
				$('#s2id_city').hide();
			}
			return $scope.edit.city === '';
		}catch(e){}
	};



	$scope.deleteCollege = function(){
		$scope.edit.collge = "";
		$('#CollegeNames').select2('data',null);
		$('#s2id_CollegeNames').show();
		$('#clgState').show();
	};
	$scope.showCollege = function(){
		try{
			if($scope.edit.collge === ''){
				$('#s2id_CollegeNames').show();
			}else{
				$('#s2id_CollegeNames').hide();
			}
			return $scope.edit.collge === '';
		}catch(e){}
	};



	$scope.deleteUniversity = function(){
		$scope.edit.university = "";
		$('#university').select2('data',null);
		$('#s2id_University').show();
	};
	$scope.showUniversity = function(){
		try{
			if($scope.edit.university === ''){
				$('#s2id_university').show();
			}else{
				$('#s2id_university').hide();
			}
			return $scope.edit.university === '';
		}catch(e){}
	};





	$scope.deleteBranches = function(){
		$scope.edit.branchIdOfStudent2 = "";
		$('#branchIdOfStudent2').select2('data',null);
		$('#s2id_branchIdOfStudent2').show();
	};
	$scope.showBranches = function(){
		try{
			if($scope.edit.branchIdOfStudent2 === ''){
				$('#s2id_branchIdOfStudent2').show();
			}else{
				$('#s2id_branchIdOfStudent2').hide();
			}
			return $scope.edit.branchIdOfStudent2 === '';
		}catch(e){}
	};





	$scope.deleteCollgeOfFaculty = function(){
		$scope.edit.collgeOfFaculty = "";
		$('#collgeOfFaculty').select2('data',null);
		$('#s2id_collgeOfFaculty').show();
		$('#facultyClgState').show();
	};
	$scope.showCollgeOfFaculty = function(){
		try{
			if($scope.edit.collgeOfFaculty === ''){
				$('#s2id_collgeOfFaculty').show();
			}else{
				$('#s2id_collgeOfFaculty').hide();
			}
			return $scope.edit.collgeOfFaculty === '';
		}catch(e){}
	};



	$scope.deleteSpecializationOfFaculty = function(){
		$scope.edit.specializationOfFaculty2 = "";
		$('#specializationOfFaculty2').select2('data',null);
		$('#s2id_specializationOfFaculty2').show();
	};
	$scope.showSpecializationOfFaculty = function(){
		try{
			if($scope.edit.specializationOfFaculty2 === ''){
				$('#s2id_specializationOfFaculty2').show();
			}else{
				$('#s2id_specializationOfFaculty2').hide();
			}
			return $scope.edit.specializationOfFaculty2 === '';
		}catch(e){}
	};




	$scope.deleteUniversityOfFaculty = function(){
		$scope.edit.universityOfFaculty = "";
		$('#universityOfFaculty').select2('data',null);
		$('#s2id_universityOfFaculty').show();
	};
	$scope.showUniversityOfFaculty = function(){
		try{
			if($scope.edit.universityOfFaculty === ''){
				$('#s2id_universityOfFaculty').show();
			}else{
				$('#s2id_universityOfFaculty').hide();
			}
			return $scope.edit.universityOfFaculty === '';
		}catch(e){}
	};



	$scope.deleteBranchIdOfMentor2 = function(){
		$scope.edit.branchIdOfMentor2 = "";
		$('#branchIdOfMentor2').select2('data',null);
		$('#s2id_branchIdOfMentor2').show();
	};
	$scope.showBranchIdOfMentor2 = function(){
		try{
			if($scope.edit.branchIdOfMentor2 === ''){
				$('#s2id_branchIdOfMentor2').show();
			}else{
				$('#s2id_branchIdOfMentor2').hide();
			}
			return $scope.edit.branchIdOfMentor2 === '';
		}catch(e){}
	};



	//for university 	 	
	$scope.search1 = function() { 	 	
		alert($scope.form.searchUName); 	 	
		$http({ 	 	
			method : 'GET', 	 	
			data : $.param({}), 	 	
			url : 'getUniversityList?uName=' + $scope.searchUName 	 	
		}).success(function(data, status, headers, config) { 	 	
			$scope.data = data; 	 	
		}).error(function(data, status, headers, config) { 	 	
			// called asynchronously if an error occurs 	 	
			// or server returns response with an error status. 	 	
		}); 	 	
	};
	//--------------------------------------------------------------------------------

	$scope.editProfile = function() {
//		$scope.message = "";
		$scope.v = grecaptcha.getResponse();

		if($scope.v.length == 0)
		{
			error = true;

			errorString = 'You can not leave Captcha Code empty';
			$('getnewcaptcha').show();
		}
		/* var cval=$('#captchavalue span').text();
		   if (($('#captcha').val()== "") ||($('#captcha').val() != parseInt(cval))){

			  // alert(cval);   

	         error = true;

	         errorString = 'Captcha failed';
	         $('getnewcaptcha').show();


	  }*/
		else{

			$http({
				method : 'POST',
				url : 'editProfileRequest?res='+$scope.v,
				data : $.param($scope.edit),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				if (data === 'success') {
					$scope.message = [];
					$scope.message.push("Profile edited");

				}else if (data === 'Captcha Invalid'){
					$scope.message.push("Invalid Captcha");
				} else {
					$scope.message.push(data);
				}
			}).error(function(data, status, headers, config) {
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};
});

techpedia.controller('ChangePasswordController', function($scope, $http) {
	$scope.data = {};
	$scope.changePassword = function() {
		$http({
			method : 'POST',
			url : 'changePassword',
			data : $.param($scope.data),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if (data === 'success') {
				$scope.message = [];
				$scope.message.push("Password changed succesfully");
			} else {
				$scope.message = [];
				$scope.message.push(data);
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
});



techpedia.controller('SetPasswordFacultyController', function($scope, $http) {
	$scope.data = {};
	$scope.setPasswordFac = function() {

		$http({
			method : 'POST',
			url : 'setPasswordFac',
			data : $.param($scope.data),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			if (data === 'success') {
				$scope.message = [];
				$scope.message.push("Password Created succesfully");
			} else {
				$scope.message = [];
				$scope.message.push(data);
			}
		}).error(function(data, status, headers, config) {
			$scope.message = [];
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};
});


techpedia.controller('SocialRegisterController', function($scope, $http,MyService) {
	$scope.message = [];
	$scope.register = {};
	$scope.facebookdata = {};
	$scope.googledata = {};
	$scope.facebookdata = MyService.retrieve('key');
	$scope.googledata = angular.fromJson(sessionStorage.getItem('googleProfile'));
	if($scope.facebookdata !== null){
		$scope.register.firstName = $scope.facebookdata.firstname;
		$scope.register.lastName = $scope.facebookdata.lastname;
		$scope.register.email = $scope.facebookdata.emailId;
		$scope.register.dob = $scope.facebookdata.birthday;
		$scope.register.photo = $scope.facebookdata.imgurl;
		document.getElementById('profilePic').src =$scope.facebookdata.imgurl;
		MyService.clearAll();
	}
	if($scope.googledata !==null){
		$scope.register.email = $scope.googledata.emailId;
		document.getElementById('profilePic').src =$scope.googledata.imgurl;
		MyService.clearAll();
	}



	$scope.typeOfUser = function(data) {
		$scope.register.userType = data;
	};

	$scope.$watch('file', function() {
		$scope.register.photo = "data:" + $scope.file.filetype + ";base64," + $scope.file.base64;
	}, true);
	$scope.$watch('file1', function() {
		$scope.register.logo = "data:" + $scope.file1.filetype + ";base64," + $scope.file1.base64;
	}, true);
	$scope.InitLoad = function() {


		var url= window.location.href;

		var userTypes = ''
			var type = $('#type').val();	
		if(type === "student")
		{

			userTypes = 'student';
			jQuery('#facultyBtn').removeClass('btn-info');
			jQuery('#collegeBtn').removeClass('btn-info');
			jQuery('#mentorBtn').removeClass('btn-info');
			jQuery('#studentBtn').addClass('btn-info');
		}
		else if(type === "mentor")
		{				
			userTypes = 'mentor';
			jQuery('#studentBtn').removeClass('btn-info');
			jQuery('#collegeBtn').removeClass('btn-info');
			jQuery('#facultyBtn').removeClass('btn-info');
			jQuery('#mentorBtn').addClass('btn-info');
		}
		else if(type === "faculty")
		{
			userTypes = 'college';
			jQuery('#facultyBtn').removeClass('btn-info');
			jQuery('#studentBtn').removeClass('btn-info');
			jQuery('#mentorBtn').removeClass('btn-info');
			jQuery('#collegeBtn').addClass('btn-info');
		}


		$scope.typeOfUser(userTypes);

		$scope.register.userType = userTypes;
		$scope.register.iSactive = "Y";

		/*		$scope.data = [ {
			"branchId" : 1,
			"projBranchDesc" : "Chemical Engineering"
		}, {
			"branchId" : 2,
			"projBranchDesc" : "Electronic and Communiaction"
		}, {
			"branchId" : 3,
			"projBranchDesc" : "Mechanical"
		}, {
			"branchId" : 4,
			"projBranchDesc" : "Electrical Engineering"
		},
		 {
			"branchId" : 5,
			"projBranchDesc" : "Computer Science"
		}];*/
	};

	$scope.search = function() {
		// alert($scope.form.searchTerm);
		$http({
			method : 'GET',
			data : $.param({}),
			url : 'getSuggestedBranches?q=' + $scope.searchTerm
		}).success(function(data, status, headers, config) {
			$scope.data = data;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
	$scope.showError = function() {
		$('#pwdError').show();
	};
	$scope.hideError = function() {
		$('#pwdError').hide();
	};
	$scope.registerSubmit = function() {
		$scope.v = grecaptcha.getResponse();

		if($scope.v.length == 0)
		{
			error = true;

			errorString = 'You can not leave Captcha Code empty';
			$('getnewcaptcha').show();
		}


		/*var cval=$('#captchavalue span').text();
		   if (($('#captcha').val()== "") ||($('#captcha').val() != parseInt(cval))){

			  // alert(cval);   

               error = true;

               errorString = 'Captcha failed';
               $('getnewcaptcha').show();


        }*/
		else{
			$scope.message = "";
			$http({
				method : 'POST',
				url : 'registerRequest?res='+$scope.v,
				data : $.param($scope.register),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.message = [];
				if (data === 'success') {
					$scope.message.push("You profile has been created. Please use your credentials to login");
				}else if (data === 'Captcha Invalid'){
					$scope.message.push("Invalid Captcha");
				}else {
					$scope.message.push(data);
				}

			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};

});







techpedia.controller('RegisterController', function($scope, $http) {
	$scope.message = [];
	$scope.register = {};

	$scope.typeOfUser = function(data) {
		$scope.register.userType = data;
	};

	$scope.$watch('file', function() {
		$scope.register.photo = "data:" + $scope.file.filetype + ";base64," + $scope.file.base64;
	}, true);
	$scope.$watch('file1', function() {
		$scope.register.logo = "data:" + $scope.file1.filetype + ";base64," + $scope.file1.base64;
	}, true);
	$scope.InitLoad = function() {


		var url= window.location.href;
		var userTypes = ''

			if(url.toLowerCase().indexOf('student') > -1)
			{

				userTypes = 'student';
				jQuery('#facultyBtn').removeClass('btn-info');
				jQuery('#collegeBtn').removeClass('btn-info');
				jQuery('#mentorBtn').removeClass('btn-info');
				jQuery('#industryBtn').removeClass('btn-info');
				jQuery('#studentBtn').addClass('btn-info');
			}
			else if(url.toLowerCase().indexOf('mentor') > -1)
			{				
				userTypes = 'mentor';
				jQuery('#studentBtn').removeClass('btn-info');
				jQuery('#collegeBtn').removeClass('btn-info');
				jQuery('#facultyBtn').removeClass('btn-info');
				jQuery('#industryBtn').removeClass('btn-info');
				jQuery('#mentorBtn').addClass('btn-info');
			}
			else if(url.toLowerCase().indexOf('college') > -1)
			{
				userTypes = 'college';
				jQuery('#facultyBtn').removeClass('btn-info');
				jQuery('#studentBtn').removeClass('btn-info');
				jQuery('#mentorBtn').removeClass('btn-info');
				jQuery('#industryBtn').removeClass('btn-info');
				jQuery('#collegeBtn').addClass('btn-info');
			}
			else if(url.toLowerCase().indexOf('industry') > -1)
			{
				userTypes = 'industry';
				jQuery('#facultyBtn').removeClass('btn-info');
				jQuery('#studentBtn').removeClass('btn-info');
				jQuery('#mentorBtn').removeClass('btn-info');
				jQuery('#collegeBtn').removeClass('btn-info');
				jQuery('#industryBtn').addClass('btn-info');
			}
			else if(url.toLowerCase().indexOf('faculty') > -1)
			{
				userTypes = 'faculty';
				jQuery('#studentBtn').removeClass('btn-info');
				jQuery('#collegeBtn').removeClass('btn-info');
				jQuery('#mentorBtn').removeClass('btn-info');
				jQuery('#industryBtn').removeClass('btn-info');
				jQuery('#facultyBtn').addClass('btn-info');
			}

		$scope.typeOfUser(userTypes);
		$scope.register.iSactive = "N";
		$scope.register.userType = userTypes;
		/*		$scope.data = [ {
			"branchId" : 1,
			"projBranchDesc" : "Chemical Engineering"
		}, {
			"branchId" : 2,
			"projBranchDesc" : "Electronic and Communiaction"
		}, {
			"branchId" : 3,
			"projBranchDesc" : "Mechanical"
		}, {
			"branchId" : 4,
			"projBranchDesc" : "Electrical Engineering"
		},
		 {
			"branchId" : 5,
			"projBranchDesc" : "Computer Science"
		}];*/
	};

	$scope.search = function() {
		// alert($scope.form.searchTerm);
		$http({
			method : 'GET',
			data : $.param({}),
			url : 'getSuggestedBranches?q=' + $scope.searchTerm
		}).success(function(data, status, headers, config) {
			$scope.data = data;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
	$scope.showError = function() {
		$('#pwdError').show();
	};
	$scope.hideError = function() {
		$('#pwdError').hide();
	};
	$scope.registerSubmit = function() {
		$scope.v = grecaptcha.getResponse();
		if($scope.v.length == 0)
		{
			error = true;

			errorString = 'You can not leave Captcha Code empty';
			$('getnewcaptcha').show();
		}




		/* var cval=$('#captchavalue span').text();
		   if (($('#captcha').val()== "") ||($('#captcha').val() != parseInt(cval))){

			  // alert(cval);   

               error = true;

               errorString = 'Captcha failed';
               $('getnewcaptcha').show();


        }*/
		else{
			$scope.message = "";
			$http({
				method : 'POST',
				url : 'registerRequest?res='+$scope.v,
				data : $.param($scope.register),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.message = [];
				if (data === 'success') {
					$scope.message.push("You profile has been created. Please use your credentials to login");
				}else if (data === 'Captcha Invalid'){
					$scope.message.push("Invalid Captcha");
				}else{
					$scope.message.push(data);
				}

			}).error(function(data, status, headers, config) {
				$scope.message = [];
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};

});

techpedia.controller('AddChallengeController', function($scope, $http) {
	$scope.data = {};

	/*$scope.InitChallengeLoad = function() {
		$scope.data = [ {
			"challengTypeId" : 10,
			"challengTypeDesc" : "Academic"
		}, {
			"challengTypeId" : 20,
			"challengTypeDesc" : "Industry"
		}, {
			"challengTypeId" : 30,
			"challengTypeDesc" : "Innovation"
		}];
	};*/

	$scope.searchChallengeType = function() {
		//	alert($scope.form.searchTerm);
		$http({
			method : 'GET',
			data : $.param({}),
			url : 'getsuggestedchallenges?q=' + $scope.searchTerm
		}).success(function(data, status, headers, config) {
			$scope.data = data;

		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
	$scope.addChallenge = function() {
		$scope.message = [];
		$http({
			method : 'POST',
			url : 'addChallengeRequest',
			data : $.param($scope.challenge),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];

			$scope.message.push("Challenge added succesfully");
			$scope.cssClass = "success";


		}).error(function(data, status, headers, config) {
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			$scope.cssClass = "danger";
		});
	};



});

techpedia.controller('ProjectsPageController', function($scope, $http) {

	$scope.initialProjectsData = function() {
		$('#img').hide();
		$scope.isSearchResult = false;
		$scope.count = 1;
		$scope.message = [];
		$scope.projects = {};

		$scope.recentprojects = [ {
			projTitle : 'Loading title',
			projDescription : 'Loading description'
		} ];

		$scope.viewProject = function(project) {
			window.location = 'projectDetails' + project.projId;
		};
		//Recent Projects		
		$http({
			method : 'POST',
			url : 'latestProjectSpotlightLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.recentprojects = data;
			for(var i=0;i<$scope.recentprojects.length;i++){

				
				if($scope.recentprojects[i].projTitle.length>15){
					$scope.recentprojects[i].projTitle=$scope.recentprojects[i].projTitle.substring(0, 18)+"...";
				}
			}
		}).error(function(data, status, headers, config) {
			$scope.recentprojects = [ {
				projTitle : 'Failed to load data',
				projDescription : 'Please try again later'
			} ];
		});
		$scope.recentProjectVisibility = function(){
			document.getElementById("recentProjects").style.display = "block";
			$('#popularProjects').hide();
			$('#recentProjects').show();
		}

		$http({
			method : 'POST',
			url : 'projectsFetch',
			data : $.param({
				set : 1
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.projects = data;
			for(var i=0;i<$scope.projects.length;i++){

				$scope.projects[i].projBranchName = $scope.projects[i].projBranchList[0].projBranchDesc.substring(0, 13)+"...";
			}
			for(var i=0;i<$scope.projects.length;i++){
				/*alert($scope.projects[i].projCollege);*/


				if($scope.projects[i].projTitle.length>30){
					$scope.projects[i].projTitle=$scope.projects[i].projTitle.substring(0, 30)+"...";
				}
				if($scope.projects[i].projCollege.length>13){
					$scope.projects[i].projCollege=$scope.projects[i].projCollege.substring(0, 13)+"...";
				}
				if($scope.projects[i].projFacultyName.length>13){
					$scope.projects[i].projFacultyName=$scope.projects[i].projFacultyName.substring(0, 13)+"...";
				}
				if($scope.projects[i].projTeamLeaderName.length>13){
					$scope.projects[i].projTeamLeaderName=$scope.projects[i].projTeamLeaderName.substring(0, 13)+"...";
				}





			}
		}).error(function(data, status, headers, config) {
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});

	};







	$scope.viewMore = function(setNumber,keyword,branch) {	
		/*alert(setNumber);*/
		$('#showMoreBtn').hide();
		$('#img').show();


		if (keyword) {
			/*alert("in if");*/
			$scope.message = [];
			$http({
				method : 'POST',
				url : 'ajax/searchProjectByKeyword',
				data : $.param({
					term : keyword,
					set : setNumber+1,
					branch : branch
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$('#img').hide();
				$('#showMoreBtn').show();
				if(data.length>0)
				{
					$scope.projects = $scope.projects.concat(data);

					for(var i=0;i<$scope.projects.length;i++){

						$scope.projects[i].projBranchName = $scope.projects[i].projBranchList[0].projBranchDesc.substring(0, 13)+"...";
					}
					for(var i=0;i<$scope.projects.length;i++){
						/*alert($scope.projects[i].projCollege);*/



						if($scope.projects[i].projTitle.length>30){
							$scope.projects[i].projTitle=$scope.projects[i].projTitle.substring(0, 30)+"...";
						}
						if($scope.projects[i].projCollege.length>13){
							$scope.projects[i].projCollege=$scope.projects[i].projCollege.substring(0, 13)+"...";
						}
						if($scope.projects[i].projFacultyName.length>13){
							$scope.projects[i].projFacultyName=$scope.projects[i].projFacultyName.substring(0, 13)+"...";
						}
						if($scope.projects[i].projTeamLeaderName.length>13){
							$scope.projects[i].projTeamLeaderName=$scope.projects[i].projTeamLeaderName.substring(0, 13)+"...";
						}

					}
				}


				else{
					$scope.message.push("No more Project found with this title");	
					$('#showMoreBtn').hide(); 
				}
			}).error(function(data, status, headers, config) {
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		} else {
			/*alert("in else");*/
			$scope.message = [];
			$http({
				method : 'POST',
				url : 'projectsFetch',
				data : $.param({
					set : setNumber
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {

				$('#img').hide();
				$('#showMoreBtn').show();
				/*alert(data.length);*/
				if(data.length>0){
					$scope.projects = $scope.projects.concat(data);	
					for(var i=0;i<$scope.projects.length;i++){
						$scope.projects[i].projBranchName = $scope.projects[i].projBranchList[0].projBranchDesc.substring(0, 13)+"...";
					}
					for(var i=0;i<$scope.projects.length;i++){
						/*alert($scope.projects[i].projCollege);*/


						if($scope.projects[i].projTitle.length>30){
							$scope.projects[i].projTitle=$scope.projects[i].projTitle.substring(0, 30)+"...";
						}
						if($scope.projects[i].projCollege.length>13){
							$scope.projects[i].projCollege=$scope.projects[i].projCollege.substring(0, 13)+"...";
						}
						if($scope.projects[i].projFacultyName.length>13){
							$scope.projects[i].projFacultyName=$scope.projects[i].projFacultyName.substring(0, 13)+"...";
						}
						if($scope.projects[i].projTeamLeaderName.length>13){
							$scope.projects[i].projTeamLeaderName=$scope.projects[i].projTeamLeaderName.substring(0, 13)+"...";
						}

					}
				}else {
					$scope.message.push("No more Projects found");
					$('#showMoreBtn').hide(); 
				}


			}).error(function(data, status, headers, config) {

				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}

	};

	$scope.clickProject = function(id) {
		window.location = 'projectDetails' + id;
	};

	$scope.searchProjects = function(term, type,branch) {
		$scope.message = "";
		$("#search").click(function() {
			$("#hide").hide();
		});
		if (type == 'keyword') {
			$http({
				method : 'POST',
				url : 'ajax/searchProjectByKeyword',
				data : $.param({
					term : term,
					set : 1,
					branch : branch

				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.projects = data;
				for(var i=0;i<$scope.projects.length;i++){

					$scope.projects[i].projBranchName = $scope.projects[i].projBranchList[0].projBranchDesc.substring(0, 13)+"...";
				}
				for(var i=0;i<$scope.projects.length;i++){
					/*alert($scope.projects[i].projCollege);*/


					if($scope.projects[i].projTitle.length>30){
						$scope.projects[i].projTitle=$scope.projects[i].projTitle.substring(0, 30)+"...";
					}
					if($scope.projects[i].projCollege.length>13){
						$scope.projects[i].projCollege=$scope.projects[i].projCollege.substring(0, 13)+"...";
					}
					if($scope.projects[i].projFacultyName.length>13){
						$scope.projects[i].projFacultyName=$scope.projects[i].projFacultyName.substring(0, 13)+"...";
					}
					if($scope.projects[i].projTeamLeaderName.length>13){
						$scope.projects[i].projTeamLeaderName=$scope.projects[i].projTeamLeaderName.substring(0, 13)+"...";
					}


				}


				$scope.isSearchResult = true;
				$scope.count = 0;
				if(data.length <= 7){
					$("#showMoreBtn").hide();

				}else{
					$("#showMoreBtn").show();
				} 
			}).error(function(data, status, headers, config) {
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		} else {
			;// SERVICE NOT AVAILABLE
		}
	};
});

techpedia.controller('MentorsPageController', function($scope, $http) {
	$scope.initialMentorsData = function() {
		$('#img').hide();
		$scope.count = 1;
		$scope.message = [];
		$http({
			method : 'POST',
			url : 'mentorsFetch',
			data : $.param({
				set : 1
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.mentors = data;
		}).error(function(data, status, headers, config) {
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.viewMore = function(setNumber) {
		$('#showMoreBtn').hide();
		$('#img').show();
		$scope.message = [];
		$http({
			method : 'POST',
			url : 'mentorsFetch',
			data : $.param({
				set : setNumber
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$('#showMoreBtn').show();
			$('#img').hide();

			if(data.length <=8){
				$scope.mentors = $scope.mentors.concat(data);
			}else if(data.length=== 3961 ||data.length >8){
				$scope.message.push("No more mentor records found");
				$('#showMoreBtn').hide();
			}
		}).error(function(data, status, headers, config) {
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};

	$scope.clickMentor = function(id) {
		window.location = 'mentorDetails' + id;
	};
});

techpedia.controller('ChallengesPageController', function($scope, $http) {
	$scope.initialChallengesData = function() {
		$('#img').hide();
		$scope.isSearchResult = false;
		$scope.count = 1;
		$scope.message = [];
		$http({
			method : 'POST',
			url : 'challengesFetch',
			data : $.param({
				set : 1
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			console.log(data);
			$scope.challenges = data;
		}).error(function(data, status, headers, config) {
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
	};


	/*	techpedia.controller('CollaborationPageController', function($scope, $http) {
		$scope.initialCollaborationData = function() {
			$('#img').hide();
			$scope.isSearchResult = false;
			$scope.count = 1;
			$scope.message = [];
			$http({
				method : 'POST',
				url : 'collaboration',
				data : $.param({
					set : 1
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				console.log(data);
				$scope.collaboration = data;
			}).error(function(data, status, headers, config) {
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		};*/

	$scope.viewMore = function(setNumber,searchTerm) {
		$('#showMoreBtn').hide();
		$('#img').show();
		/*alert(setNumber);*/
		if (searchTerm ) {
			$scope.message = [];
			$http({
				method : 'POST',
				url : 'ajax/searchChallengeByTitle',
				data : $.param({
					term : searchTerm,
					set : setNumber+1
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$('#showMoreBtn').show();
				$('#img').hide();
				if(data.length>0)
				{
					$scope.challenges = $scope.challenges.concat(data);
				}


				else{
					$scope.message.push("No more challenge records found with this title");	
					$('#showMoreBtn').hide();
				}

			}).error(function(data, status, headers, config) {
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		} else {
			$scope.message = [];
			$http({
				method : 'POST',
				url : 'challengesFetch',
				data : $.param({
					set : setNumber
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$('#showMoreBtn').show();
				$('#img').hide();

				if(data.length>0){
					$scope.challenges = $scope.challenges.concat(data);
				}else{
					$("#showMoreBtn").hide();
					$scope.message.push("No more challenge records found");	
					$('#showMoreBtn').hide();

				}
			}).error(function(data, status, headers, config) {
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");

			});
		}
	};
	$scope.clickChallenge = function(id) {
		window.location = 'challengeDetails' + id;
	};

	$scope.searchChallenge = function(term, type) {
		$scope.message = ""; 


		if (type == 'title') {

			$http({
				method : 'POST',
				url : 'ajax/searchChallengeByTitle',
				data : $.param({
					term : term,
					set : 1
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				$scope.challenges = data;
				$scope.isSearchResult = true;
				$scope.count = 0;
				if(data.length <= 7){
					$("#showMoreBtn").hide();

				}else{
					$("#showMoreBtn").show();
				}

			}).error(function(data, status, headers, config) {
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		} else {
			;// SERVICE NOT AVAILABLE
		}
	};
});

techpedia.controller('NewMemberController', function($scope, $http) {
	;
});

techpedia.controller("TestController", function($scope) {
	$scope.InitLoad = function() {
		;
	};
});
techpedia.directive('passwordMatch', [function () {
	return {
		restrict: 'A',
		scope:true,
		require: 'ngModel',
		link: function (scope, elem , attrs,control) {
			var checker = function () {

				//get the value of the first password
				var e1 = scope.$eval(attrs.ngModel); 

				//get the value of the other password  
				var e2 = scope.$eval(attrs.passwordMatch);
				return e1 == e2;
			};
			scope.$watch(checker, function (n) {

				//set the form control to valid if both 
				//passwords are the same, else invalid
				control.$setValidity("pwmatch", n);
			});
		}
	};
}]);














techpedia.controller('NewFacultyController', function($scope, $http) {

	$scope.initialEditProfileData = function() {
		$scope.message = [];

		$http({
			method : 'POST',
			url : 'newFacultyLoad',
			data : $.param({}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data, status, headers, config) {
			$scope.message = [];
			$scope.edit = data;
			$scope.edit.photo = '';
		}).error(function(data, status, headers, config) {
			$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
		});
		$scope.$watch('file1', function() {
			$scope.edit.logo = "data:" + $scope.file1.filetype + ";base64," + $scope.file1.base64;
		}, true);


		var dataArray = [];
		for (var i = 0; i < data.collge.length; i++) {
			//var id = data.projBranchList[i].branchId;
			var text = data.projBranchList[0];
			alert( "hai " + text);
			var json = {};
			//json.id = id;
			json.text = text;
			dataArray.push(json);

		}


		console.log(JSON.stringify(dataArray));
		$("#CollegeNames").select2("data", dataArray);
		/*$scope.data = [ {
			"branchId" : 1,
			"projBranchDesc" : "Chemical Engineering"
		}, {
			"branchId" : 2,
			"projBranchDesc" : "Electronic and Communiaction"
		}, {
			"branchId" : 3,
			"projBranchDesc" : "Mechanical"
		}, {
			"branchId" : 4,
			"projBranchDesc" : "Electrical Engineering"
		},{
			"branchId" : 5,
			"projBranchDesc" : "Computer Science"
		} ];*/
	};

	$scope.search = function() {
		// alert($scope.form.searchTerm);
		$http({
			method : 'GET',
			data : $.param({}),
			url : 'getSuggestedBranches?q=' + $scope.searchTerm
		}).success(function(data, status, headers, config) {
			$scope.data = data;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};

	$scope.deleteCollege = function(){
		$scope.edit.collge = "";
		$('#CollegeNames').select2('data',null);
		$('#s2id_CollegeNames').show();
	};
	$scope.showCollege = function(){
		try{
			if($scope.edit.collge === ''){
				$('#s2id_CollegeNames').show();
			}else{
				$('#s2id_CollegeNames').hide();
			}
			return $scope.edit.collge === '';
		}catch(e){}
	};



	$scope.deleteUniversity = function(){
		$scope.edit.university = "";
		$('#university').select2('data',null);
		$('#s2id_University').show();
	};
	$scope.showUniversity = function(){
		try{
			if($scope.edit.university === ''){
				$('#s2id_university').show();
			}else{
				$('#s2id_university').hide();
			}
			return $scope.edit.university === '';
		}catch(e){}
	};





	$scope.deleteBranches = function(){
		$scope.edit.branchIdOfStudent2 = "";
		$('#branchIdOfStudent2').select2('data',null);
		$('#s2id_branchIdOfStudent2').show();
	};
	$scope.showBranches = function(){
		try{
			if($scope.edit.branchIdOfStudent2 === ''){
				$('#s2id_branchIdOfStudent2').show();
			}else{
				$('#s2id_branchIdOfStudent2').hide();
			}
			return $scope.edit.branchIdOfStudent2 === '';
		}catch(e){}
	};





	$scope.deleteCollgeOfFaculty = function(){
		$scope.edit.collgeOfFaculty = "";
		$('#collgeOfFaculty').select2('data',null);
		$('#s2id_collgeOfFaculty').show();
	};
	$scope.showCollgeOfFaculty = function(){
		try{
			if($scope.edit.collgeOfFaculty === ''){
				$('#s2id_collgeOfFaculty').show();
			}else{
				$('#s2id_collgeOfFaculty').hide();
			}
			return $scope.edit.collgeOfFaculty === '';
		}catch(e){}
	};



	$scope.deleteSpecializationOfFaculty = function(){
		$scope.edit.specializationOfFaculty2 = "";
		$('#specializationOfFaculty2').select2('data',null);
		$('#s2id_specializationOfFaculty2').show();
	};
	$scope.showSpecializationOfFaculty = function(){
		try{
			if($scope.edit.specializationOfFaculty2 === ''){
				$('#s2id_specializationOfFaculty2').show();
			}else{
				$('#s2id_specializationOfFaculty2').hide();
			}
			return $scope.edit.specializationOfFaculty2 === '';
		}catch(e){}
	};




	$scope.deleteUniversityOfFaculty = function(){
		$scope.edit.universityOfFaculty = "";
		$('#universityOfFaculty').select2('data',null);
		$('#s2id_universityOfFaculty').show();
	};
	$scope.showUniversityOfFaculty = function(){
		try{
			if($scope.edit.universityOfFaculty === ''){
				$('#s2id_universityOfFaculty').show();
			}else{
				$('#s2id_universityOfFaculty').hide();
			}
			return $scope.edit.universityOfFaculty === '';
		}catch(e){}
	};



	$scope.deleteBranchIdOfMentor2 = function(){
		$scope.edit.branchIdOfMentor2 = "";
		$('#branchIdOfMentor2').select2('data',null);
		$('#s2id_branchIdOfMentor2').show();
	};
	$scope.showBranchIdOfMentor2 = function(){
		try{
			if($scope.edit.branchIdOfMentor2 === ''){
				$('#s2id_branchIdOfMentor2').show();
			}else{
				$('#s2id_branchIdOfMentor2').hide();
			}
			return $scope.edit.branchIdOfMentor2 === '';
		}catch(e){}
	};



	//for university 	 	
	$scope.search1 = function() { 	 	
		alert($scope.form.searchUName); 	 	
		$http({ 	 	
			method : 'GET', 	 	
			data : $.param({}), 	 	
			url : 'getUniversityList?uName=' + $scope.searchUName 	 	
		}).success(function(data, status, headers, config) { 	 	
			$scope.data = data; 	 	
		}).error(function(data, status, headers, config) { 	 	
			// called asynchronously if an error occurs 	 	
			// or server returns response with an error status. 	 	
		}); 	 	
	};
	//--------------------------------------------------------------------------------

	$scope.newFaculty = function() {
//		$scope.message = "";
		var cval=$('#captchavalue span').text();
		if (($('#captcha').val()== "") ||($('#captcha').val() != parseInt(cval))){

			// alert(cval);   

			error = true;

			errorString = 'Captcha failed';
			$('getnewcaptcha').show();


		}
		else{

			$http({
				method : 'POST',
				url : 'newFacultyRequest',
				data : $.param($scope.edit),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(data, status, headers, config) {
				if (data === 'success') {
					$scope.message = [];
					$scope.message.push("You Profile has been created Successfully");

				} else {
					$scope.message.push(data);
				}
			}).error(function(data, status, headers, config) {
				$scope.message.push("Possibly the service is down, Please contact the admin if problem persists.");
			});
		}
	};
});
