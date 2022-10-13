import time
import math
import string
import random
import json
import requests as rq
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore, initialize_app
from geopy.geocoders import Nominatim
load_dotenv()

# Set up Firebase creds & Firestore db
cred = credentials.Certificate('firebase.json')
default_app = initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def gen_random_str(str_len=8):
    '''
    Generates a random string of a given length made up with letters and digits
    
    Args:
        str_len (int): The length of the string to be generated

    Returns:
        str: The generated string of length str_len

    Raises:
        ValueError: If str_len is not an integer
    '''
    if not isinstance(str_len, int):
        raise ValueError("str_len must be an integer.")

    alphabet = string.ascii_letters + string.digits
    return ''.join(random.choice(alphabet) for i in range(str_len))

def create_establishment(name, menu_obj, city_id, lat, lon, add, e_pic_url):
    '''
    Creates a new establishment in the database

    Args:
        name (str): The name of the establishment
        menu_obj (dict): The menu object of the establishment
        city_id (int): The city id of the establishment
        lat (float): The latitude of the establishment
        lon (float): The longitude of the establishment
        add (str): The address of the establishment
        e_pic_url (str): The URL of the establishment's picture

    Returns:
        str: The id of the newly created establishment

    Raises:
        ValueError: If any of the arguments are not of the correct type
    '''
    if not isinstance(name, str):
        raise ValueError("name must be a string.")
    if not isinstance(menu_obj, dict):
        raise ValueError("menu_obj must be a dictionary.")
    if not isinstance(city_id, int):
        raise ValueError("city_id must be an integer.")
    if not isinstance(lat, float):
        raise ValueError("latitude must be a float.")
    if not isinstance(lon, float):
        raise ValueError("longitude must be a float.")
    if not isinstance(add, str):
        raise ValueError("address must be a string.")
    if not isinstance(e_pic_url, str):
        raise ValueError("e_pic_url must be a string.")

    est_ref = db.collection('establishments')
    est_id = gen_random_str()
    est_ref.document(est_id).set({
        'eid': est_id,
        'name': name,
        'menu': menu_obj,
        'cid': city_id,
        'lat': lat,
        'lon': lon,
        'address': add,
        'e_pic_url': e_pic_url,
        'created_at': time.time()
    })
    return est_id

def get_establishment(est_id):
    '''
    Gets an establishment from the database

    Args:
        est_id (str): The id of the establishment to be retrieved

    Returns:
        dict: The establishment object

    Raises:
        ValueError: If any of the arguments are not of the correct type
    '''
    if not isinstance(est_id, str):
        raise ValueError("est_id must be a string.")

    est_ref = db.collection('establishments').document(est_id)
    est = est_ref.get()
    return est.to_dict()

def update_establishment(est_id, changes):
    '''
    Updates an establishment in the database

    Args:
        est_id (str): The id of the establishment to be updated
        changes (dict): The changes to be made to the establishment

    Returns:
        dict: The dictionary of the updated establishment

    Raises:
        ValueError: If any of the arguments are not of the correct type
        KeyError: If any of the keys in changes are not valid
    '''
    if not isinstance(est_id, str):
        raise ValueError("est_id must be a string.")
    if not isinstance(changes, dict):
        raise ValueError("changes must be a dictionary.")
    if not any(field in changes for field in ['name', 'menu', 'city_id', 'lat', 'lon', 'address', 'e_pic_url']):
        raise KeyError("changes must contain at least one of the following fields: name, menu, city_id, lat, lon, address, e_pic_url")
    est_ref = db.collection('establishments').document(est_id)
    est = est_ref.get()
    if not est.exists:
        return None
    est_ref.update(changes)
    return est_ref.get().to_dict()

def delete_establishment(est_id):
    '''
    Deletes an establishment from the database

    Args:
        est_id (str): The id of the establishment to be deleted

    Returns:
        str: The id of the deleted establishment

    Raises:
        ValueError: If any of the arguments are not of the correct type
    '''
    if not isinstance(est_id, str):
        raise ValueError("est_id must be a string.")

    est_ref = db.collection('establishments').document(est_id)
    est_ref.delete()
    return est_id

def get_all_establishments():
    '''
    Gets all establishments from the database

    Args:
        None

    Returns:
        list: A list of all establishment objects
    '''
    est_ref = db.collection('establishments')
    ests = est_ref.stream()
    return [est.to_dict() for est in ests]

def get_establishments_by_city(city_id):
    '''
    Gets all establishments with city_id from the database

    Args:
        city_id (int): The id of the city to get establishments from

    Returns:
        list: A list of all establishment objects in the given city

    Raises:
        ValueError: If any of the arguments are not of the correct type
    '''
    if not isinstance(city_id, int):
        raise ValueError("city_id must be an integer.")

    est_ref = db.collection('establishments')
    ests = est_ref.where('cid', '==', city_id).stream()
    return [est.to_dict() for est in ests]

# TODO: Use google maps api to get the city id from the lat and lon
def lat_lon_to_city_name(lat, lon):
    '''
    Converts a latitude and longitude to a city name

    Args:
        lat (float): The latitude to be converted
        lon (float): The longitude to be converted

    Returns:
        str: The city name

    Raises:
        ValueError: If any of the arguments are not of the correct type
    '''
    if not isinstance(lat, float):
        raise ValueError("latitude must be a float.")
    if not isinstance(lon, float):
        raise ValueError("longitude must be a float.")

    geolocator = Nominatim(user_agent="foodie")
    location = geolocator.reverse("{}, {}".format(lat, lon))
    try:
        return location.raw['address']['city']
    except KeyError:
        return None

def create_city(city_name):
    '''
    Creates a city in the database

    Args:
        city_name (str): The name of the city to be created

    Returns:
        str: The name/id of the newly created city

    Raises:
        ValueError: If any of the arguments are not of the correct type
    '''
    if not isinstance(city_name, str):
        raise ValueError("city_name must be a string.")
    
    city_name = city_name.lower()
    city_ref = db.collection('cities')
    city = city_ref.document(city_name).get()

    if city.exists:
        return city.to_dict()['name']

    city_ref.document(city_name).set({
        'cid': city_name,
        'created_at': time.time()
    })
    return city_name

def address_to_lat_lon(address):
    '''
    Converts an address to a latitude and longitude

    Args:
        address (str): The address to be converted

    Returns:
        tuple: A tuple containing the latitude and longitude

    Raises:
        ValueError: If any of the arguments are not of the correct type
    '''
    if not isinstance(address, str):
        raise ValueError("address must be a string.")

    geolocator = Nominatim(user_agent="foodie")
    location = geolocator.geocode(address)
    return (location.latitude, location.longitude)

def create_order(order_obj, total, est_id, uid, lat, lon, cid, ts_group):
    '''
    Creates an order in the database

    Args:
        order_obj (dict): The order object to be created
        est_id (str): The id of the establishment the order is from
        uid (str): The id of the user who placed the order
        lat (float): The latitude of the user
        lon (float): The longitude of the user
        cid (str): The id of the city the order is in
        ts_group (str): The timestamp group the order is in

    Returns:
        str: The id of the newly created order

    Raises:
        ValueError: If any of the arguments are not of the correct type
    '''
    if not isinstance(order_obj, dict):
        raise ValueError("order_obj must be a dictionary.")
    if not isinstance(est_id, str):
        raise ValueError("est_id must be a string.")
    if not isinstance(uid, str):
        raise ValueError("uid must be a string.")
    if not isinstance(lat, float):
        raise ValueError("lat must be a float.")
    if not isinstance(lon, float):
        raise ValueError("lon must be a float.")
    if not isinstance(cid, str):
        raise ValueError("cid must be a string.")
    if not isinstance(ts_group, str):
        raise ValueError("ts_group must be a string.")

    order_ref = db.collection('orders')
    order_id = order_ref.document().id
    order_ref.document(order_id).set({
        'oid': order_id,
        'eid': est_id,
        'total': total,
        'uid': uid,
        'lat': lat,
        'lon': lon,
        'cid': cid,
        'ts_group': ts_group,
        'order_obj': order_obj,
        'created_at': time.time()
    })
    return order_id

@app.route('/')
@cross_origin()
def root():
    rand_str = address_to_lat_lon("3820 Oak Ridge Circle")
    return jsonify({'message': 'Hello World!', 'random_string': rand_str}), 200

@app.route('/get-est', methods=['POST'])
@cross_origin()
def get_establishment_details():
    eid = request.form.get('eid')
    est = get_establishment(eid)
    if est:
        return jsonify(est), 200
    else:
        return jsonify({'message': 'Establishment not found.'}), 404

@app.route('/create-est', methods=['POST'])
@cross_origin()
def create_establishment_route():
    name = request.form.get('name')
    menu_obj = {} # Start with empty menu
    city_id = int(request.form.get('city_id'))
    lat = float(request.form.get('lat'))
    lon = float(request.form.get('lon'))
    add = request.form.get('address')
    e_pic_url = request.form.get('e_pic_url') if request.form.get('e_pic_url') else ''
    est_id = create_establishment(name, menu_obj, city_id, lat, lon, add, e_pic_url)
    try:
        est_id = create_establishment(name, menu_obj, city_id, lat, lon, add, e_pic_url)
        return jsonify({'message': 'Establishment created successfully', 'est_id': est_id}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

@app.route('/update-est', methods=['POST'])
@cross_origin()
def update_establishment_route():
    est_id = request.form.get('est_id')
    changes = json.loads(request.form.get('changes'))
    try:
        est_updated = update_establishment(est_id, changes)
        if est_updated:
            return jsonify(est_updated), 200
        else:
            return jsonify({'message': 'Establishment not found.'}), 404
    except KeyError as e:
        return jsonify({'message': 'Invalid field(s) in establishment update.'}), 400
    except ValueError as e:
        return jsonify({'message': 'Invalid value(s) in establishment update.'}), 400

@app.route('/delete-est', methods=['POST'])
@cross_origin()
def delete_establishment_route():
    est_id = request.form.get('est_id')
    u_id = request.form.get('u_id')
    try:
        # TODO: Check if user is authorized to delete establishment
        est_id = delete_establishment(est_id)
        return jsonify({'message': 'Establishment deleted successfully', 'est_id': est_id}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

@app.route('/get-all-est', methods=['POST'])
@cross_origin()
def get_all_establishments():
    return jsonify(get_all_establishments()), 200

@app.route('/get-est-by-city', methods=['POST'])
@cross_origin()
def get_establishments_by_city_route():
    city_id = int(request.form.get('city_id'))
    try:
        ests = get_establishments_by_city(city_id)
        if ests:
            return jsonify(ests), 200
        else:
            return jsonify({'message': 'No establishments found.'}), 404
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

@app.route('/lat-lon-to-city', methods=['POST'])
@cross_origin()
def lat_lon_to_city_name_route():
    lat = float(request.form.get('lat'))
    lon = float(request.form.get('lon'))
    try:
        city_name = lat_lon_to_city_name(lat, lon)
        return jsonify({'city_name': city_name}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)