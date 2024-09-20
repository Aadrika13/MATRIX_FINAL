from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = "your_secret_key"

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/user_database"
mongo = PyMongo(app)

# Home route (Login page)
@app.route('/')
def home():
    return render_template('home.html', css_file='styles.css')

# Route to render the login page (GET request)
@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html', css_file='login.css')


# Login route
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    user = mongo.db.users.find_one({'username': username})

    if user:
        if user.get('banned_until') and user['banned_until'] > datetime.now():
            flash("Your account is banned until {}. Please try again later.".format(user['banned_until']), "error")
            return redirect(url_for('home'))

        if check_password_hash(user['password'], password):
            # Store user info in session
            session['username'] = username
            # Reset login attempts on successful login
            mongo.db.users.update_one({'username': username}, {'$set': {'login_attempts': 0, 'banned_until': None}})
            flash("Login Successful!", "success")
            return redirect(url_for('dashboard'))  # Redirect to the dashboard upon successful login
        else:
            # Increment login attempts
            new_attempts = user['login_attempts'] + 1
            if new_attempts >= 5:
                # Ban user for 12 hours
                mongo.db.users.update_one({'username': username}, {'$set': {'login_attempts': new_attempts, 'banned_until': datetime.now() + timedelta(hours=12)}})
                flash("Your account has been banned for 12 hours due to multiple failed login attempts.", "error")
            else:
                mongo.db.users.update_one({'username': username}, {'$set': {'login_attempts': new_attempts}})
            flash("Invalid credentials. Please try again.", "error")
            return redirect(url_for('home'))
    else:
        flash("Invalid credentials. Please try again.", "error")
        return redirect(url_for('home'))

# Sign-up route
@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/signup', methods=['POST'])
def register_user():
    name = request.form['name']
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    confirm_password = request.form['confirm_password']

    if password != confirm_password:
        flash("Passwords do not match!", "error")
        return redirect(url_for('signup'))

    hashed_password = generate_password_hash(password)

    mongo.db.users.insert_one({
        'name': name,
        'username': username,
        'email': email,
        'password': hashed_password,
        'login_attempts': 0,
        'banned_until': None
    })

    flash("Sign-up Successful!", "success")
    return redirect(url_for('home'))

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html', css_file='dashboard.css')

@app.route('/courses')
def courses():
    return render_template('courses.html', css_file='courses.css')

@app.route('/report')
def report():
    return render_template('report.html', css_file='report.css')

@app.route('/profile')
def profile():
    return render_template('profile.html', css_file='profile.css')

@app.route('/about')
def about():
    return render_template('about.html', css_file='about.css')

# Logout route
@app.route('/logout')
def logout():
    session.pop('username', None)  # Remove user from session
    flash("You have been logged out.", "success")
    return redirect(url_for('home'))  # Redirect to the home page

if __name__ == '__main__':
    app.run(debug=True)
