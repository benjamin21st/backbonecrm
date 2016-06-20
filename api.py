from flask import Flask, request, render_template, send_from_directory
import json

app = Flask(__name__, template_folder="templates")

users = [
    {"uid": "1", "created_at": 1437503027000, "organization": "South", "fullname": "Dwyane Wade", "type": "Admin", "email": "benjamin21st@icloud.com"},
    {"uid": "31", "created_at": 1441738271000, "organization": "East", "fullname": "LeBron James", "type": "User", "email": "senjamin.zjm+email6@gmail.com"},
    {"uid": "4", "created_at": 1441391158000, "organization": "East", "fullname": "Chris Bosh", "type": "User", "email": "user260@company.com"},
    {"uid": "3", "created_at": 1441220486000, "organization": "North", "fullname": "Kevin Druant", "type": "User", "email": "renjamin.zjm+user2@gmail.com"},
    {"uid": "26", "created_at": 1441736751000, "organization": "West", "fullname": "Chris Paul", "type": "Admin", "email": "yenjamin.zjm+email@gmail.com"},
    {"uid": "5", "created_at": 1441391158000, "organization": "South", "fullname": "Camelon Anthony", "type": "Admin", "email": "hser1@company.com"},
    {"uid": "25", "created_at": 1441736622000, "organization": "West", "fullname": "Ben Wallace", "type": "Customer", "email": "zenjamin21st@outlook.com"},
    {"uid": "8", "created_at": 1441391158000, "organization": "North", "fullname": "Dirk Nowisiki", "type": "Customer", "email": "kser901@company.com"},
    {"uid": "18", "created_at": 1441391159000, "organization": "East", "fullname": "Mike Biby", "type": "Customer", "email": "oser637@company.com"},
    {"uid": "19", "created_at": 14413911580000, "organization": "South", "fullname": "Allen Iverson", "type": "Admin", "email": "kser637@company.com"},
    {"uid": "22", "created_at": 1441491158000, "organization": "North", "fullname": "Kobe Bryant", "type": "Admin", "email": "sser637@company.com"},
    {"uid": "27", "created_at": 1441591158000, "organization": "West", "fullname": "Tracy MacGrady", "type": "Customer", "email": "oser637@company.com"},
    {"uid": "28", "created_at": 1441391258000, "organization": "South", "fullname": "Michael Jordan", "type": "Admin", "email": "pser637@company.com"},
    {"uid": "29", "created_at": 1441391358000, "organization": "South", "fullname": "Carl Marlon", "type": "Admin", "email": "wser637@company.com"},
    {"uid": "30", "created_at": 1441391458000, "organization": "South", "fullname": "Anthony Davis", "type": "Admin", "email": "iser637@company.com"},
    {"uid": "33", "created_at": 1442391158000, "organization": "North", "fullname": "John Wall", "type": "User", "email": "saser637@company.com"},
    {"uid": "36", "created_at": 1451391158000, "organization": "North", "fullname": "Bradly Bill", "type": "Customer", "email": "hser637@company.com"},
    {"uid": "38", "created_at": 1441394158000, "organization": "East", "fullname": "Steve Nash", "type": "Customer", "email": "kser637@company.com"},
    {"uid": "32", "created_at": 1441391188000, "organization": "East", "fullname": "Shaq Oneal", "type": "User", "email": "cser637@company.com"},
    {"uid": "34", "created_at": 1441391198000, "organization": "North", "fullname": "Steven Curry", "type": "Customer", "email": "mser637@company.com"},
    {"uid": "35", "created_at": 1441322158000, "organization": "East", "fullname": "Kaly Thompton", "type": "User", "email": "vcser637@company.com"},
    {"uid": "40", "created_at": 1441394158000, "organization": "West", "fullname": "Tim Ducan", "type": "Customer", "email": "zser637@company.com"},
    {"uid": "39", "created_at": 1441391668000, "organization": "East", "fullname": "Tony Paker", "type": "User", "email": "hjser637@company.com"},
    {"uid": "44", "created_at": 1641391158000, "organization": "South", "fullname": "Manu Ginobbily", "type": "User", "email": "dser637@company.com"},
    {"uid": "46", "created_at": 1461391158000, "organization": "East", "fullname": "Jason Willams", "type": "Customer", "email": "ooser637@company.com"},
    {"uid": "41", "created_at": 1446391158000, "organization": "West", "fullname": "Chris Webber", "type": "User", "email": "tser637@company.com"},
    {"uid": "42", "created_at": 1441691158000, "organization": "East", "fullname": "Mike Miller", "type": "Customer", "email": "qwser637@company.com"},
    {"uid": "43", "created_at": 1441361158000, "organization": "South", "fullname": "Ray Allen", "type": "User", "email": "oser637@company.com"},
    {"uid": "49", "created_at": 1441396158000, "organization": "East", "fullname": "Kevin Garrnet", "type": "User", "email": "oser637@company.com"}
  ]

def show_homepage():
    return render_template("index.html")


def get_all_users_for_admin():
    query_args = request.args
    limit = query_args.get('limit')
    offset = query_args.get('offset')

    if not limit and not offset:
        limit = 10
        offset = 0
    else:
        limit = int(limit)
        offset = int(offset)

    # TODO: Make sure the last bit of data is returnable
    start = offset
    end = offset + limit
    if end > len(users):
        end = len(users)

    res = {"message": "Success", "data": users[start: end], "success": True}
    return json.dumps(res), 200, {"ContentType": "application/json"}

def get_users(direction):
    result = []
    for user in users:
        if user["organization"] == direction:
            result.append(user)
    return json.dumps(result), 200, {"ContentType": "application/json"}

def get_users_from_east():
    return get_users('East')

def get_users_from_west():
    return get_users('West')

    
def get_users_from_south():
    return get_users('South')
    
def get_users_from_north():
    return get_users('North')

urls = [
    ("/",                           ["GET"],            show_homepage),
    ("/admin/users/all",            ["GET"],            get_all_users_for_admin),
    ("/admin/users/east",           ["GET"],            get_users_from_east), 
    ("/admin/users/west",           ["GET"],            get_users_from_west), 
    ("/admin/users/north",          ["GET"],            get_users_from_north), 
    ("/admin/users/south",          ["GET"],            get_users_from_south), 
  
  ]


for url in urls:
    app.add_url_rule(url[0], methods=url[1], view_func=url[2])

if __name__ == "__main__":
    app.run(port=5001, debug=True)

