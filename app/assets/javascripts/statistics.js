function drawChart() {
  $.getJSON("/statistics/most_commonly_used_words.json",function(result){
    $("#stats-loading").replaceWith('<div id="chart_div" style="width: 100%;"></div>');
    
    result.unshift(["Words","Mentions"])
    var data = google.visualization.arrayToDataTable(
      result
    ); 

    var options = {
      title: 'Most Commonly Used Words'
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    $('#loading').hide();
  });
}
