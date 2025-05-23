import flask
from flask import request
from newCharlaBots.model import get_db
import newCharlaBots


@newCharlaBots.app.route("/createBot/", methods=['POST', 'GET'])
def create_bot():

    connection = get_db()
    data = flask.request.get_json()

    botname = data.get("botName")
    description = data.get("description")
    cannonicalCode = data.get("canonicalCode")

    connection.execute("INSERT INTO bots (botname, description, canonical) VALUES (?,?, ?)", 
    	(botname, description, cannonicalCode))

    context = {}

    return flask.jsonify(**context), 200


## with hardcoded values, delete this later
@newCharlaBots.app.route("/editBot/")
def edit_bot():
    connection = get_db()
    connection.execute("UPDATE bots SET canonical=?, botname=? WHERE botid=?", ("if any happy reply no end if", "Mark", "1"))
    context = {}
    return flask.jsonify(**context), 200

@newCharlaBots.app.route("/updateBot/", methods=["PATCH"])
def update_bot():
    connection = get_db()
    data = flask.request.get_json()

    botid = data.get("botID")
    botname = data.get("botName")
    description = data.get("description")
    code = data.get("canonicalCode")

    connection.execute(
        "UPDATE bots SET description=?, canonical=?, botname=? WHERE botid=?",
        (description, code, botname, botid)
    )
    connection.commit()

    return flask.jsonify(success=True), 200



@newCharlaBots.app.route("/getBotData/")
def get_bot_data():

    connection = get_db()

    botid = flask.request.args.get("botid")

    data = connection.execute("SELECT * FROM bots WHERE botid=?" , [botid] ).fetchone()

    context = {"data" : data}

    return flask.jsonify(**context), 200

#get's bot data for 2 bots
@newCharlaBots.app.route("/getBotData2/")
def get_bot_data2():

    connection = get_db()

    botid1 = flask.request.args.get("botid1")
    botid2 = flask.request.args.get("botid2")

    data1 = connection.execute("SELECT * FROM bots WHERE botid=?" , [botid1] ).fetchone()
    data2 = connection.execute("SELECT * FROM bots WHERE botid=?" , [botid2] ).fetchone()

    context = {"data1" : data1, "data2" : data2}

    return flask.jsonify(**context), 200

    
@newCharlaBots.app.route("/deleteBot/")
def delete_bot():

    connection = get_db()

    data = connection.execute("DELETE FROM bots WHERE botid=?" , ("1"))


    context = {}


    return flask.jsonify(**context), 200



@newCharlaBots.app.route("/getAllBotNames/")
def get_bot_names():

    connection = get_db()

    data = connection.execute("SELECT * FROM bots").fetchall()

    names = []

    for data in data:
        names.append({"name":data["botname"], "key":data["botid"]})

    context = {"data" : names}

    return flask.jsonify(**context), 200


@newCharlaBots.app.route("/getBotAndLang/")
def get_bot_and_lang():
    connection = get_db()
    botid = flask.request.args.get("botID")
    data_botID = connection.execute("SELECT * FROM bots WHERE botid=?" , [botid]).fetchone()

    langID = flask.request.args.get("langID")
    data_langID = connection.execute("SELECT * FROM languages WHERE languageid=?", [langID]).fetchone()
    context = {"botInfo" : data_botID, "langInfo" : data_langID}

    return flask.jsonify(**context), 200

@newCharlaBots.app.route("/postChat/", methods =["POST"])
def post_bot_chat():

    connection = get_db()

    botText = flask.request.json['botText']
    yourText = flask.request.json['yourText']
    botid = flask.request.args.get("botid")


    connection.execute("INSERT INTO messages(botid, isUser, text) VALUES (?, ?, ?)", (botid, 1, yourText))

    connection.execute("INSERT INTO messages(botid, isUser, text) VALUES (?, ?, ?)", (botid, 0, botText))


    return {"msg": "Added successfully"}, 204

@newCharlaBots.app.route("/clearChat/")
def clear_bot_chat():
    connection = get_db()

    connection.execute("DELETE FROM messages")

    return {"msg": "Deleted successfully"}, 204