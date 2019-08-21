# LazyCouchDB.js

## Summary

LazyCouchDB.js is a very simple JavaScript library for connecting to a [CouchDB](http://couchdb.apache.org/) database. Some basic tasks, such as _insert_, _find_ and _delete_ documents, are supported. It aims for small projects without a webserver, meaning your browser speaks directly via JavaScript with a CouchDB Server.

There is also a little how-to in a [later chapter](#docker) which describes how you can set up your own CouchDB server using [Docker](https://www.docker.com/) and enable CORS (Cross-Origin Resource Sharing).

LazyCouchDB.js has _no external dependencies_ like jQuery or other libraries, but there are still two requirements:

* Browser with [Fetch API support](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#Browser_compatibility)
* ECMAScript 2015 or higher (because of `class`)

## Usage

First include the JavaScript file into your HTML document:

```html
<head>
  <script src="lazycouchdb.js"></script>
</head>
```

Then you have to create an instance of the class `LazyCouchDB`, with the parameters `host`, `username` and `password`:

```javascript
const lcdb = new LazyCouchDB("http://localhost:5984", "username", "password");
const database = 'testdb';
```

### Find documents

If you want to search for documents, you first need to define a _search object_, so head over to the [CouchDB documentation](https://docs.couchdb.org/en/stable/api/database/find.html#operators) and see how you can create selector expressions. A little example:

```javascript
const searchObject = {
  "selector" : {},
  "fields": ["name", "address"]  
}
```

Now use the `find()` method with the two parameters `database` and `searchObject`:

```javascript
(async => {
  result = lcdb.find(database, searchObject);
  result.then((json) => {
    console.log(JSON.stringify(json, undefined, 2));
  });
})();
```

### Insert new documents

CouchDB supports bulk writes, which means you can insert multiple documents at once. First define an object which contains the documents:

```javascript
let myDocs = {
  "docs": [
    {
      name: "Bilbo Baggins",
      address: "The Shire"
    },
    {
      name: "Frodo Baggins",
      address: "The Shire"
    }
  ]
}
```

Then call the `bulkWrite()` function with the `database` string and `newDocuments` object:

```javascript
(async => {
  let result = lcdb.bulkWrite(database, newDocuments);
  result.then((json) => {
    console.log(JSON.stringify(json, undefined, 2));
  });
})();
```

For more information on bulk writes check the [CouchDB documentation](https://docs.couchdb.org/en/stable/api/database/bulk-api.html#inserting-documents-in-bulk).

### Updating documents

It's very simple to update documents, add `_id` and `_rev` fields to your document in the _insert object_ and use the function `bulkWrite()`; new attributes will be added, existing ones overwritten. [(CouchDB documentation)](https://docs.couchdb.org/en/stable/api/database/bulk-api.html#updating-documents-in-bulk)

### Delete documents

Two things are needed if you intend to delete a document:

1. The ID of the document (the `_id` field)
2. The revision ID (the `_rev` field)

After that you can call the `deleteDocument()` function with `database`, `id` and `revision` as parameters, for example:

```javascript
(async => {
  let result = lcdb.deleteDocument(database, "4e7e712a73172feb0e39d0e6a10082a9", "1-55d011d3ce897ec69f9b8402d1f22886");
  result.then((json) => {
    console.log(JSON.stringify(json, undefined, 2));
  });
})();
```

## Testing using Docker <a name="docker"></a>

In case you want to access CouchDB via JavaScript directly from your browser you have to enable __CORS__ (Cross-Origin Resource Sharing) in the integrated webserver, a corresponding configuration file is part of this repository, see `couchdb/etc/cors.ini`. For more informations on this topic see the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

1. Pull the official CouchDB image: `docker pull couchdb:latest`
2. Create the data directory: `mkdir $(pwd)/couchdb/data`
3. Deploy the container from the image:

```bash
docker run -d \
  --name couchdb \
  -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=secret \
  -p 127.0.0.1:5984:5984 \
  -v $(pwd)/couchdb/data:/opt/couchdb/data \
  -v $(pwd)/couchdb/etc:/opt/couchdb/etc/local.d \
  couchdb:latest
```

4. Check if the container is running: `docker container ls`
5. See the logs: `docker container logs --details couchdb`
6. Open the URL [http://localhost:5984/_utils/](http://localhost:5984/_utils/) in your browser to see if _Fauxton_ is reachable.
7. Login with `COUCHDB_USER` and `COUCHDB_PASSWORD` and create a database, e.g. `testdb`
8. Load `example.html` in your browser and see if everything is running

If you rather prefer using a webserver, execute the following steps:

1. Pull the nginx image: `docker pull nginx:alpine`
2. Deploy a container from the image:

```bash
docker run \
  -d \
  --name nginx \
  -p 8080:80 \
  -v $(pwd):/usr/share/nginx/html:ro \
  nginx:alpine
```

3. Click on the URL: [http://localhost:8080/example.html](http://localhost:8080/example.html)

## TODO

It's the __lazy__ in LazyCouchDB.js ;)

* Better error handling, utilizing `try`,`catch` and `throw`
* Maybe jQuery `$.ajax()` and `XMLHttpRequest()` variants
