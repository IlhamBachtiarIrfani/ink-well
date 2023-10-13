import pymongo


class MongoDBHandler:
    def __init__(self, host, port, username, password, database_name):
        self.client = None
        self.database = None
        self.host = host
        self.port = int(port)
        self.username = username
        self.password = password
        self.database_name = database_name

    def _connect(self):
        try:
            # Create a MongoDB URI with authentication
            mongo_uri = f"mongodb://{self.username}:{self.password}@{self.host}:{self.port}/?authMechanism=DEFAULT"

            # Connect to MongoDB using the URI
            self.client = pymongo.MongoClient(mongo_uri)
            self.database = self.client[self.database_name]
        except Exception as e:
            print(f" [!] Connection error: {str(e)}")

    def insert_document(self, collection_name, document):
        self._connect()
        try:
            collection = self.database[collection_name]
            result = collection.insert_one(document)
            return result.inserted_id
        except Exception as e:
            print(f" [!] Insert error: {str(e)}")
            return None
        finally:
            self._close()

    def find_documents(self, collection_name, query=None):
        self._connect()
        try:
            collection = self.database[collection_name]
            if query is None:
                result = collection.find()
            else:
                result = collection.find(query)
            return list(result)
        except Exception as e:
            print(f" [!] Find error: {str(e)}")
            return []
        finally:
            self._close()

    def update_document(self, collection_name, query, update_data):
        self._connect()
        try:
            collection = self.database[collection_name]
            result = collection.update_one(query, {"$set": update_data})
            return result.modified_count
        except Exception as e:
            print(f" [!] Update error: {str(e)}")
            return 0
        finally:
            self._close()

    def delete_document(self, collection_name, query):
        self._connect()
        try:
            collection = self.database[collection_name]
            result = collection.delete_one(query)
            return result.deleted_count
        except Exception as e:
            print(f" [!] Delete error: {str(e)}")
            return 0
        finally:
            self._close()

    def _close(self):
        if self.client:
            self.client.close()
