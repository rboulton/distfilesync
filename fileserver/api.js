const path = require('path');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const express = require('express');
const config = require('./config');

class Api {
  constructor(store) {
    this.store = store;
    this.host = config.get('app:host');
    this.port = config.get('app:port');
    this.scratchDir = config.get('scratchDir');
    this.uploadTmpDir = path.join(this.scratchDir, 'uploadTmp');
  }

  _getMulter() {
    return multer({dest: this.scratchDir});
  }

  uncaughtError(err, res) {
    console.log(err);
    res.status(500);
    res.json({ok: false});
  }

  async init() {
    this.app = express();

    this.app.get(
      '/api/filearea/',
      async (req, res) => {
        try {
          const fileareas = await this.store.query('file_areas_list');
          console.log('Fileareas', fileareas);
          res.json({fileareas});
        } catch (err) {
          return this.uncaughtError(err, res);
        }
      }
    );

    this.app.put(
      '/api/filearea/:filearea',
      async (req, res) => {
        const name = req.params.filearea;
        const uuid = uuidv4();
        console.log('Creating filearea', name, uuid);
        let id;
        try {
          id = await this.store.query('file_area_create', [uuid, name]);
        } catch (err) {
          try {
            id = await this.store.query('file_area_get', [name]);
          } catch (getErr) {
            console.log('Unable to create file area, or get existing one', getErr);
            this.uncaughtError(err, res);
            return;
          }
          console.log('File area already exists', id);
        }
        console.log('id', id);
        res.json({id});
      }
    );

    this.app.get(
      '/api/filearea/:filearea',
      (req, res) => {
        // Const filearea = this.store.query;
        res.json({});
      }
    );

    this.app.put(
      '/api/filearea/:filearea',
      (req, res) => {
        // Const filearea = this.store.query;
        res.json({});
      }
    );

    this.app.post(
      '/api/filearea/:filearea/file/:filename',
      this._getMulter().single('file'),
      (req, res) => {
        console.log(req.file);
        console.log(req.file.path);
        res.json({});
      }
    );
  }

  async run() {
    this.server = this.app.listen(this.port, this.host);
  }

  async end() {
  }
}

module.exports = {Api};
