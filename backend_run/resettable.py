from database import engine
from models import Base

# drop old table
Base.metadata.drop_all(bind=engine)

# create new table with updated schema
Base.metadata.create_all(bind=engine)

print("Table recreated successfully")