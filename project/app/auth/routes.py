from app.auth import bp
from flask import render_template, flash, redirect, url_for
from app.auth.forms import LoginForm
from app.models import User, Product
import csv
from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so
from flask_login import current_user, login_user, logout_user
from flask_login import login_required

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = db.session.scalar(sa.select(User).where(User.usercode == form.usercode.data))
        if user is None :
            flash('Invalid usercode')
            return redirect(url_for('auth.login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('main.index'))
    return render_template('auth/login.html', title='Sign In', form=form)

@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@bp.route('/')
def run_csv():
    #Selection of all users in the users table (User class)
    queryu = sa.select(User)
    users = db.session.scalars(queryu).all()

    #Delete all existing users to reset database data to zero 
    for u in users : 
        db.session.delete(u)
    
    #Selection of all products in the produtcs table (Product class)
    #queryp = sa.select(Product)
    #products = db.session.scalars(queryp).all()

    #Delete all existing products to reset database data to zero 
    #for p in products : 
        #db.session.delete(p)
    
    #Changes are written to the database 
    db.session.commit()

    #Code to load data from users.csv file
    with open("users.csv", encoding='utf-8-sig') as f:
        reader = csv.reader(f, delimiter=";" )
        header = next(reader)
        for i in reader:
                kwargs = {column: value for column, value in zip(header, i)}
                new_entry = User(**kwargs)
                db.session.add(new_entry)
                db.session.commit()
    
    #Code to load data from products.csv file 
    #with open("products.csv", encoding='utf-8-sig') as f:
        #reader = csv.reader(f, delimiter=";" )
        #header = next(reader)
        #for i in reader:
                #kwargs = {column: value for column, value in zip(header, i)}
                #new_entry = Product(**kwargs)
                #db.session.add(new_entry)
                #db.session.commit()

    return redirect(url_for('auth.login'))
