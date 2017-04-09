from flask import *
from pymongo import MongoClient
import datetime,calendar
import json
from bson import ObjectId

app = Flask(__name__)

#client = MongoClient('mongodb://localhost:27017/Events')
client = MongoClient('mongodb://rishi1995:helloworld@cluster0-shard-00-00-fcb85.mongodb.net:27017,cluster0-shard-00-01-fcb85.mongodb.net:27017,cluster0-shard-00-02-fcb85.mongodb.net:27017/Events?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')
db=client.Events
coll=db.events

class JSONEncoder(json.JSONEncoder):
	def default(self, o):
		if isinstance(o, ObjectId):
			return str(o)
		return json.JSONEncoder.default(self, o)

@app.route('/',methods=['GET','POST'])
def cal():
	current=datetime.datetime.now()
	c_date=int(current.day)
	c_month=int(current.month)
	c_year=int(current.year)
	cal=calendar.monthcalendar(c_year,c_month)
	if len(str(c_month))==1:
		c_month='0'+str(c_month)
	if len(str(c_date))==1:
		c_date='0'+str(c_date)	
	today=str(c_year)+'-'+str(c_month)+'-'+str(c_date)
	events_this_month=[]
	events=coll.find()
	for e in events:
		if e['start_date'][:8]==today[:8]:
			events_this_month.append(e)
	return render_template("calendar.html", cal=cal, year=c_year, month=c_month, events=JSONEncoder().encode(events_this_month))

@app.route('/new_event',methods=['GET','POST'])
def new_event():
	if request.method=="POST":
		try:
			start_date=request.form.get("start_date",'')
			ename=request.form.get("ename",'')
			start=request.form.get("start",'')
			end=request.form.get("end",'')
			place=request.form.get("place",'')
			desc=request.form.get("desc",'')
			data={"start_date":start_date, "ename":ename,"start":start, "end":end, "place":place, "description":desc}
			coll.insert_one(data)
			return "Event Added"
		except:
			return "Some Error Occured"
	return "Invalid Call"


@app.route('/get_events',methods=['GET','POST'])
def get_events():
	if request.method=="POST":
		try:
			c_month=request.form.get("month",'')
			c_year=request.form.get("year",'')
			if len(str(c_month))==1:
				c_month='0'+str(c_month)	
			today=str(c_year)+'-'+str(c_month)
			events_this_month=[]
			events=coll.find()
			for e in events:
				if e['start_date'][:7]==today:
					events_this_month.append(e)
			response=JSONEncoder().encode(events_this_month)
			return response
			##return json.dumps(response)
		except:
			return 'Some Error'
	return "Invalid Call"

@app.route('/get_cal',methods=['GET','POST'])
def calender():
	if request.method=="POST":
		try:
			month=request.form.get("month")
			year=request.form.get("year")
			cal=calendar.monthcalendar(int(year),int(month))
			return str(cal)
		except:
			return 'Some Error'
	return "Invalid Call"

@app.route('/get_event',methods=['GET','POST'])
def get_event():
	if request.method=="POST":
		try:
			oid=request.form.get("id",'')
			response=coll.find({"_id":ObjectId(oid)})
			return JSONEncoder().encode(response[0])
		except:
			return 'Some Error'
	return "Invalid Call"

@app.route('/delete_event',methods=['GET','POST'])
def delete_event():
	if request.method=="POST":
		try:
			oid=request.form.get("id",'')
			#print(oid)
			coll.delete_one({"_id":ObjectId(oid)});
			return 'Deleted'
		except:
			return "Some Error"
	return "Invalid Call"

@app.route('/update_event',methods=['GET','POST'])
def update_event():
	if request.method=="POST":
		try:
			name=request.form.get("ename",'')
			sd=request.form.get("sd",'')
			start=request.form.get("start",'')
			end=request.form.get("end",'')
			place=request.form.get("place",'')
			desc=request.form.get("desc",'')
			oid=request.form.get("oid",'')
			coll.update_one(
				{"_id": ObjectId(oid)},
				{
				"$set": {
					"ename":name,
					"start_date":sd,
					"start":start,
					"end":end,
					"place":place,
					"description":desc,
				}
				}
			)
			return 'Updated'
		except:
			return "Some Error"
	return "Invalid Call"



if __name__ == '__main__':
    app.run( debug=True )