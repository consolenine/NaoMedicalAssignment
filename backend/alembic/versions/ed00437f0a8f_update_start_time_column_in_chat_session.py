"""update start_time column in chat_session

Revision ID: ed00437f0a8f
Revises: 59a8b2e2a19e
Create Date: 2024-12-15 20:08:12.489667

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ed00437f0a8f'
down_revision: Union[str, None] = '59a8b2e2a19e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###