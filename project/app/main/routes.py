from flask import render_template, redirect, url_for, request
from app.main import bp
from app.main.forms import EmptyForm
from app import app
from flask_login import login_required
from app import db
from app.models import User, Product
from flask_login import current_user
import sqlalchemy as sa
import sqlalchemy.orm as so

#Route to home page 
@bp.route('/index')
@login_required
def index():
    reco1 = db.first_or_404(sa.select(Product).where(Product.movie_id == current_user.reco1))
    reco2 = db.first_or_404(sa.select(Product).where(Product.movie_id == current_user.reco2))
    reco3 = db.first_or_404(sa.select(Product).where(Product.movie_id == current_user.reco3))
    reco4 = db.first_or_404(sa.select(Product).where(Product.movie_id == current_user.reco4))
    reco5 = db.first_or_404(sa.select(Product).where(Product.movie_id == current_user.reco5))
    return render_template('main/index.html', title = 'Home', reco1= reco1, reco2= reco2, reco3= reco3, reco4= reco4, reco5= reco5)


#Route to all movies page 
@bp.route('/allmovies')
@login_required
def allmovies():
    queryp = sa.select(Product)
    page = request.args.get('page', 1, type=int)
    products= db.paginate(queryp, page=page, per_page=10, error_out=False)
    next_url = url_for('main.allmovies', page=products.next_num) \
        if products.has_next else None
    prev_url = url_for('main.allmovies', page=products.prev_num) \
        if products.has_prev else None
    return render_template('main/all_movies.html', title = 'All movies', products=products.items, next_url=next_url, prev_url=prev_url )

#Route to a product (movie) page 
@bp.route('/product/<title>')
@login_required
def product(title):
    product = db.first_or_404(sa.select(Product).where(Product.title == title))
    form = EmptyForm()
    return render_template('main/product_page.html', product = product, form = form)

@bp.route('/wish/<title>', methods=['POST'])
@login_required
def wish(title):
    product = db.first_or_404(sa.select(Product).where(Product.title == title))
    current_user.add_to_wishlist(product)
    db.session.commit()
    return redirect(url_for('main.product', title= product.title))


@bp.route('/unwish/<title>', methods=['POST'])
@login_required
def unwish(title):
    product = db.first_or_404(sa.select(Product).where(Product.title == title))
    current_user.remove_from_wishlist(product)
    db.session.commit()
    return redirect(url_for('main.wishlist'))

@bp.route('/wishlist')
@login_required
def wishlist():
    form = EmptyForm()
    query = current_user.wish_movies.select()
    wished_movies = db.session.scalars(query).all()
    return render_template('main/wishlist.html', wished_movies = wished_movies, form = form)