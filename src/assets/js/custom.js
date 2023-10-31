var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
            labels: ['30%', '30%', '30%', '30%'],
            datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            data: [20, 10, 5, 8],
            backgroundColor: [
            "#62A810",
            "#6598f7",           
            "#62A810",
            "#84d327",
            ],
            }]
            },

            // Configuration options go here
            options: {
            cutoutPercentage: 80,
            legend: {
            display: true,
            position: 'right',
            },
            centerText: {
            display: true,
            text: 'fgdfgfgf'
            }
            }
            });

 var ctx = document.getElementById('myChart2').getContext('2d');
            var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
            labels: ['30%', '30%', '30%', '30%'],
            datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            data: [20, 10, 5, 8],
            backgroundColor: [
            "#62A810",
            "#6598f7",           
            "#62A810",
            "#84d327",
            ],
            }]
            },

            // Configuration options go here
            options: {
            cutoutPercentage: 80,
            legend: {
            display: true,
            position: 'right',
            },
            }
            });

var ctx = document.getElementById('myChart5').getContext('2d');
            var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
            labels: ['30%', '30%', '30%', '30%'],
            datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            data: [20, 10, 5, 8],
            backgroundColor: [
            "#62A810",
            "#6598f7",           
            "#62A810",
            "#84d327",
            ],
            }]
            },

            // Configuration options go here
            options: {
            cutoutPercentage: 80,
            legend: {
            display: true,
            position: 'right',
            },
            }
            });

var ctx = document.getElementById('myChart3').getContext('2d');
            var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
            labels: ['30%', '30%', '30%', '30%'],
            datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            data: [20, 10, 5, 8],
            backgroundColor: [
            "#62A810",
            "#6598f7",           
            "#62A810",
            "#84d327",
            ],
            }]
            },

            // Configuration options go here
            options: {
            cutoutPercentage: 80,
            legend: {
            display: true,
            position: 'right',
            },
            }
            });

var ctx = document.getElementById('myChart4');
            var myChart = new Chart(ctx, {
            type: 'line',
            data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
            }]
            },
            options: {
            scales: {
            yAxes: [{
            ticks: {
            beginAtZero: true
            }
            }]
            }
            }
            });

// Date Picker
        $( function() {
            $( "#datepicker2" ).datepicker();
        });
// Date Picker
        $( function() {
            $( "#datepicker" ).datepicker();
        });