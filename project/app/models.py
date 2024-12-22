from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db, login
from flask_login import UserMixin

@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))

# Wishlist Table
wishlist= sa.Table(
    'Wishlist',
    db.metadata,
    sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id'), primary_key=True),
    sa.Column('product_id', sa.Integer, sa.ForeignKey('product.id'),primary_key=True)
)

class User(UserMixin, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    usercode: so.Mapped[str] = so.mapped_column(sa.String(64), index=True,unique=True)
    reco1: so.Mapped[Optional[str]] = so.mapped_column(sa.String(64))
    reco2: so.Mapped[Optional[str]] = so.mapped_column(sa.String(64))
    reco3: so.Mapped[Optional[str]] = so.mapped_column(sa.String(64))
    reco4: so.Mapped[Optional[str]] = so.mapped_column(sa.String(64))
    reco5: so.Mapped[Optional[str]] = so.mapped_column(sa.String(64))
    wish_movies: so.WriteOnlyMapped['Product'] = so.relationship(
        secondary=wishlist,
        passive_deletes=True,
        back_populates='buyers',
    )

    def __repr__(self):
        return '<User {}>'.format(self.usercode)

    def has_wished(self, product):
        query = self.wish_movies.select().where(Product.id == product.id)
        return db.session.scalar(query) is not None

    def add_to_wishlist(self, product):
        if not self.has_wished(product):
            self.wish_movies.add(product)

    def remove_from_wishlist(self, product):
        if self.has_wished(product):
            self.wish_movies.remove(product)

class Product(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    movie_id : so.Mapped[str] = so.mapped_column(sa.String(64))
    title : so.Mapped[str] = so.mapped_column(sa.String(140))
    genres : so.Mapped[str] = so.mapped_column(sa.String(140))
    poster_id : so.Mapped[Optional[str]] = so.mapped_column(sa.String(64), nullable=True )
    buyers: so.WriteOnlyMapped['User'] = so.relationship(
        secondary=wishlist,
        passive_deletes=True,
        back_populates='wish_movies',
    )

    def __repr__(self):
        return '<Product {}>'.format(self.movie_id)

