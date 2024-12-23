"""wishlist

Revision ID: 3e38b121432d
Revises: fba0ed4996eb
Create Date: 2024-10-26 22:51:46.572938

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3e38b121432d'
down_revision = 'fba0ed4996eb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Wishlist',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['product_id'], ['product.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'product_id')
    )
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('poster_id',
               existing_type=sa.VARCHAR(length=64),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('poster_id',
               existing_type=sa.VARCHAR(length=64),
               nullable=False)

    op.drop_table('Wishlist')
    # ### end Alembic commands ###
