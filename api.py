from flask import Flask, request, render_template, send_from_directory
import json

app = Flask(__name__, template_folder="templates")

users = [
    {"uid": "1", "created_at": 1437503027000, "organization": "Baidu", "fullname": "fenjamin zhang", "type": "Admin", "email": "benjamin21st@icloud.com"},
    {"uid": "31", "created_at": 1441738271000, "organization": "Ten", "fullname": "henjamin gmail email6", "type": "User", "email": "senjamin.zjm+email6@gmail.com"},
    {"uid": "4", "created_at": 1441391158000, "organization": "Alibaba", "fullname": "firstname lastname", "type": "Demo User", "email": "user260@company.com"},
    {"uid": "3", "created_at": 1441220486000, "organization": "Abc", "fullname": "kenjamin user2", "type": "User", "email": "renjamin.zjm+user2@gmail.com"},
    {"uid": "26", "created_at": 1441736751000, "organization": "Bbc", "fullname": "jenjamin gmail email", "type": "Pser", "email": "yenjamin.zjm+email@gmail.com"},
    {"uid": "5", "created_at": 1441391158000, "organization": "South", "fullname": "firstname lastname", "type": "Rser", "email": "hser1@company.com"},
    {"uid": "25", "created_at": 1441736622000, "organization": "West", "fullname": "benjamin outlook", "type": "Wemo User", "email": "zenjamin21st@outlook.com"},
    {"uid": "8", "created_at": 1441391158000, "organization": "North", "fullname": "cirstname lastname", "type": "Tser", "email": "kser901@company.com"},
    {"uid": "18", "created_at": 1441391159000, "organization": "East", "fullname": "girstname lastname", "type": "Bser", "email": "oser637@company.com"},
    {"uid": "19", "created_at": 14413911580000, "organization": "Last", "fullname": "tirstname lastname", "type": "Vser", "email": "kser637@company.com"},
    {"uid": "22", "created_at": 1441491158000, "organization": "Qast", "fullname": "xirstname lastname", "type": "Zser", "email": "sser637@company.com"},
    {"uid": "27", "created_at": 1441591158000, "organization": "Yyast", "fullname": "rrirstname lastname", "type": "Wser", "email": "oser637@company.com"},
    {"uid": "28", "created_at": 1441391258000, "organization": "Nnast", "fullname": "yyirstname lastname", "type": "Eeser", "email": "pser637@company.com"},
    {"uid": "29", "created_at": 1441391358000, "organization": "Iiiast", "fullname": "oirstname lastname", "type": "Qqser", "email": "wser637@company.com"},
    {"uid": "30", "created_at": 1441391458000, "organization": "Rast", "fullname": "tirstname lastname", "type": "Yuiser", "email": "iser637@company.com"},
    {"uid": "33", "created_at": 1442391158000, "organization": "Oast", "fullname": "poiirstname lastname", "type": "Aser", "email": "saser637@company.com"},
    {"uid": "36", "created_at": 1451391158000, "organization": "Dsast", "fullname": "firstname lastname", "type": "Gfser", "email": "hser637@company.com"},
    {"uid": "38", "created_at": 1441394158000, "organization": "Jhast", "fullname": "khirstname lastname", "type": "Jrser", "email": "kser637@company.com"},
    {"uid": "32", "created_at": 1441391188000, "organization": "Last", "fullname": "zlirstname lastname", "type": "Xzser", "email": "cser637@company.com"},
    {"uid": "34", "created_at": 1441391198000, "organization": "Vcast", "fullname": "birstname lastname", "type": "Nasser", "email": "mser637@company.com"},
    {"uid": "35", "created_at": 1441322158000, "organization": "Mnast", "fullname": "nmirstname lastname", "type": "Bvser", "email": "vcser637@company.com"},
    {"uid": "40", "created_at": 1441394158000, "organization": "Cxast", "fullname": "xzirstname lastname", "type": "Zser", "email": "zser637@company.com"},
    {"uid": "39", "created_at": 1441391668000, "organization": "Lzast", "fullname": "klirstname lastname", "type": "Jser", "email": "hjser637@company.com"},
    {"uid": "44", "created_at": 1641391158000, "organization": "Ghjast", "fullname": "hgirstname lastname", "type": "Fgser", "email": "dser637@company.com"},
    {"uid": "46", "created_at": 1461391158000, "organization": "Sddast", "fullname": "airstname lastname", "type": "Paser", "email": "ooser637@company.com"},
    {"uid": "41", "created_at": 1446391158000, "organization": "Iast", "fullname": "uiirstname lastname", "type": "Yuser", "email": "tser637@company.com"},
    {"uid": "42", "created_at": 1441691158000, "organization": "Rtast", "fullname": "erirstname lastname", "type": "Wser", "email": "qwser637@company.com"},
    {"uid": "43", "created_at": 1441361158000, "organization": "Qwast", "fullname": "girstname lastname", "type": "Bser", "email": "oser637@company.com"},
    {"uid": "49", "created_at": 1441396158000, "organization": "East", "fullname": "girstname lastname", "type": "Ttser", "email": "oser637@company.com"}
  ]

def show_homepage():
    return render_template("index.html")


def get_all_users_for_admin():
    query_args = request.args
    limit = query_args.get('limit')
    offset = query_args.get('offset')

    print "Currently count of all users: %d", len(users)

    if not limit and not offset:
        limit = 10
        offset = 0
    else:
        limit = int(limit)
        offset = int(offset)

    # test
    # print offset
    # arr = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
    # print arr
    # print arr[offset]
    # arr[offset]
    # print users[1]


    # print "limit is:"
    # print limit
    # print "offset is"
    # print offset
    # print "__________"


    # TODO: Make sure the last bit of data is returnable
    start = offset
    end = offset + limit
    if end > len(users):
        end = len(users)

    res = {"message": "Success", "data": users[start: end], "success": True}
    return json.dumps(res), 200, {"ContentType": "application/json"}

urls = [
    ("/",                           ["GET"],            show_homepage),
    ("/admin/users/all",            ["GET"],            get_all_users_for_admin)
  ]









for url in urls:
    app.add_url_rule(url[0], methods=url[1], view_func=url[2])

if __name__ == "__main__":
    app.run(port=5001, debug=True)
