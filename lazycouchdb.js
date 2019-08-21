"use strict";

/**
 * LazyCouchDB - a simple JavaScript class for CouchDB
 * 
 * @author Roman Mainer (https://github.com/rmainer/)
 */
class LazyCouchDB {

	/**
	 * Constructor
	 * 
	 * @constructor
	 * @param {string} uri Complete URI to the host 
	 * @param {string} username The username
	 * @param {string} password The password
	 */
	constructor(uri, username, password) {
		this.host = uri;
		this.username = username;
		this.password = password;
	}

	/**
	 * Returns all documents in given `database`, but only the fields `id`, `key` and `rev`
	 * 
	 * @param {string} database Name of the database
	 * @returns Promise for a result object
	 */
	async getAllDocuments(database) {
		return await fetch(this.host + '/' + database + '/_all_docs', {
			method: 'GET',
			headers: new Headers({
				'Accept': 'application/json',
				'Authorization': 'Basic ' + window.btoa(this.username + ':' + this.password), 
			}), 
		}).then(async (response) => {
			if(response.status != 200) console.log("find() error: status code " + response.status);
			return await response.json()
		}).catch((error) => {
			console.error(error);
		});
	}

	/**
	 * Find all documents in `database` matching the `searchObject`
	 * 
	 * @param {string} database Name of the database
	 * @param {Object} searchObject A search object
	 * @returns Promise for a result object
	 */
	async find(database, searchObject) {
		return await fetch(this.host + '/' + database + '/_find', {
			method: 'POST',
			headers: new Headers({
				'Accept': 'application/json',
				'Authorization': 'Basic ' + window.btoa(this.username + ':' + this.password), 
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify(searchObject)
		}).then(async (response) => {
			if(response.status != 200) console.log("find() error: status code " + response.status);
			return await response.json()
		}).catch((error) => {
			console.error(error);
		});		
	}

	/**
	 * Bulk write documents to `database`
	 * 
	 * @param {string} database Name of the database
	 * @param {Object} documents Object containing all documents
	 * @returns Promise for a result object
	 */
	async bulkWrite(database, documents) {
		return await fetch(this.host + '/' + database + '/_bulk_docs', {
			method: 'POST',
			headers: new Headers({
				'Accept': 'application/json',
				'Authorization': 'Basic ' + window.btoa(this.username + ':' + this.password), 
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify(documents)
		}).then(async (response) => {
			if(response.status != 201) console.log("find() error: status code " + response.status);
			return await response.json()
		}).catch((error) => {
			console.error(error);
		});	
	}

	/**
	 * Delete a document identified by `id` and `revision`
	 * 
	 * @param {*} database Name of the database
	 * @param {*} id ID of the document (`_id` field)
	 * @param {*} revision Revision ID of the document (`_rev` field)
	 * @returns Promise for a result object
	 */
	async deleteDocument(database, id, revision) {
		let deleteObject = {
			"docs": [
				{
					"_id": id,
					"_rev": revision,
					"_deleted": true
				}
			]
		};

		return await fetch(this.host + '/' + database + '/_bulk_docs', {
			method: 'POST',
			headers: new Headers({
				'Accept': 'application/json',
				'Authorization': 'Basic ' + window.btoa(this.username + ':' + this.password), 
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify(deleteObject)
		}).then(async (response) => {
			if(response.status != 201) console.log("find() error: status code " + response.status);
			return await response.json()
		}).catch((error) => {
			console.error(error);
		});	
	}
}