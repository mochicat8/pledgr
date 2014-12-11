angular.module('pledgr.profile', [])

.controller('ProfileController', function($scope, $window){
	// $scope.user.first;
	var charityList = [];
	charityList[0] = {
		name: 'ToysForTots',
		amount: 100
	};
	charityList[1] = {
		name: 'Veterans Retirement Fund',
		amount: 300
	};
	charityList[2] = {
		name: 'Academy Art Museum',
		amount: 500
	};

	$scope.charityList = charityList;

	var charityChartDiv = '<div id="charityChart"></div>';
	$('#highchart-container').append(charityChartDiv);

	$scope.makeChart = function(data){

		//Tally total contribution from user
		var totalContributions = data.reduce(function(previousValue, currentValue, index, array) {
			return previousValue + currentValue.amount;
		}, 0);
		

		//Calculate donation ratio		
		var individualRatio = data.map(function(input, index, array){
			return [input.name, parseFloat(input.amount/totalContributions)];
		});

		//Render user data info
		$('#charityChart').highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: 1,//null,
				plotShadow: false
			},
			credits: false,
			title: {
				text: 'Total Contributions'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %'
					}
				}
			},
			series: [{
				type: 'pie',
				name: 'Donations',
				data: individualRatio
			}]
		});
	}

	$scope.makeChart(charityList);

});