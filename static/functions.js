var modal = document.getElementById('ModalNew');
var modalevent = document.getElementById('ModalEvent');
var span = document.getElementsByClassName("close")[0];
start();
	function start()
	{
		
		document.getElementById("cal").innerHTML='';
		document.getElementById("year").innerHTML=year;
		document.getElementById("month").innerHTML=months[month-1];
		var table = document.getElementById("cal");
		for(var i=0;i<a.length;i++)
		{
			var row = table.insertRow(i);
			for(var r=0;r<a[i].length;r++)
			{
				var cell = row.insertCell(r);
				if(a[i][r]==0)
				{
					cell.id="rand"+i+r;
					document.getElementById(cell.id).style.backgroundColor="#f8f8f8";
					continue;
				}
				cell.id='p'+a[i][r];
				var event_day_id=a[i][r];
				if(event_day_id.toString().length===1)
					event_day_id='0'+event_day_id; 
				var html= "<a href=\"javascript:show(" +a[i][r]+','+month+','+year+");\">"+a[i][r]+"</a>" + "<br><br><table class=\"innertable\" id=\"e" + event_day_id+ "\"></table>";
				//console.log(html);
				cell.innerHTML=html;
				cell.className="calendarDates"
				//document.getElementById(cell.id).style.backgroundColor="white";
				var d=a[i][r];
				(function(date){
        			cell.onclick=function () {
           			//alert(date);
           			show(date,month,year); 
       				 };
    				})(d);
			}
		}
		//alert(e);
		//alert(typeof(e));
		for(var i=0;i<e.length;i++)
		{

			var s=e[i]['start_date'].slice(8,10);
			s="e"+s;
			//document.getElementById(s).innerHTML="hello";
			var innerTable=document.getElementById(s);
			var rowin=innerTable.insertRow(0);
			var cellin=rowin.insertCell(0);
			cellin.innerHTML=e[i]['ename']+"<span class=\"right\">"+e[i]['start']+"</span>";
			cellin.className="events";
			cellin.id=e[i]['_id'];
			(function(oid){
        			cellin.onclick=function () {
           			//alert(date);
           			event_open(oid); 
       				 };
    				})(cellin.id);

		}
	}


	function show(d,m,y)
		{
			if(m.toString().length===1);
				m='0'+m;
			if(d.toString().length===1)
				d='0'+d;
			var date=y+'-'+m+'-'+d
			document.getElementById("start_date").value=date;
			document.getElementById("modaldate").innerHTML="Add New Event on: "+date;
			modalevent.style.display = "none";
			modal.style.display = "block";

		}
	function clear_form()
	{
		document.getElementById("ename").value='';
		document.getElementById("start").value='';
		document.getElementById("end").value='';
		document.getElementById("place").value='';
		document.getElementById("desc").value='';
		
	}

	function newEntry(sd,ename,start,end,place,desc)
	{
		var param="start_date="+sd+"&ename="+ename+"&start="+start+"&end="+end+"&place="+place+"&desc="+desc;
		//console.log(param);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  modal.style.display = "none";
		  clear_form();
		  after_event_update();
		}
		};
		xhttp.open("POST", "/new_event", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(param);
	}

	function after_event_update()
	{
		var param="year="+year+"&month="+month;
		//console.log(param);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  e=JSON.parse(this.responseText);
		 // console.log(e);
		  //console.log(e[0]);
		  start();
		}
		};
		xhttp.open("POST", "/get_events", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(param);
	}

	function prev()
	{
		if(month===1)
		{
			month=12;
			year=year-1;
		}
		else
		{
			month=month-1;
		}
		var param="year="+year+"&month="+month;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  a=JSON.parse(this.responseText);
		  after_event_update();
		}
		};
		xhttp.open("POST", "/get_cal", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(param);

	}

	function next()
	{
		if(month===12)
		{
			month=1;
			year=year+1;
		}
		else
		{
			month=month+1;
		}
		var param="year="+year+"&month="+month;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  a=JSON.parse(this.responseText);
		  after_event_update();
		}
		};
		xhttp.open("POST", "/get_cal", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(param);
	}

	function event_open(id)
	{
		var param="id="+id;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  //after_event_update();
		  var x=JSON.parse(this.responseText);
		  document.getElementById("mid").value=id;
		  document.getElementById("msd").value=x['start_date'];
		  document.getElementById("mename").value=x['ename'];
		  document.getElementById("mstart").value=x['start'];
		  document.getElementById("mend").value=x['end'];
		  document.getElementById("mplace").value=x['place'];
		  document.getElementById("mdesc").value=x['description'];
		  document.getElementById("eventdetailupdate").innerHTML=x['ename'];
		  console.log(x['desc']);
		  modal.style.display = "none";
		  modalevent.style.display = "block";


		}
		};
		xhttp.open("POST", "/get_event", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(param);
	}

	function delete_event()
	{
		modalevent.style.display = "none";
		var param="id="+document.getElementById("mid").value;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  after_event_update();
		}
		};
		xhttp.open("POST", "/delete_event", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(param);
	}	
	function update_event()
	{
		modalevent.style.display = "none";
		var param="oid="+document.getElementById("mid").value + "&sd=" + document.getElementById("msd").value + "&ename=" + document.getElementById("mename").value + "&start=" + document.getElementById("mstart").value + "&end=" + document.getElementById("mend").value + "&place="+ document.getElementById("mplace").value + "&desc="+ document.getElementById("mdesc").value ;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  after_event_update();
		}
		};
		xhttp.open("POST", "/update_event", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(param);
	}





function closemodals() {
    modal.style.display = "none";
    modalevent.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal || event.target == modalevent) {
        modal.style.display = "none";
        modalevent.style.display = "none";
    }
}