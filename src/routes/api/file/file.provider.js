const File = _db('models/base/File');
const { verify } = require('fesjs/lib/jwt').instance;
const jimp = require('jimp');
const rootPath = process.env.ROOT_PATH || __dirroot;
const path = require('path');

async function handleGetFile(req, res, next) {
  try {
    let { filename } = req.params;
    // const fileId = filename.match(/(?!\w*-).*(?=\.\w+$)/).pop();
    // console.log('fileId', fileId);
    let { imgCode } = req.query;
    const userId = imgCode ? verify(imgCode) : null;
    let file = await File.findOne({ filename });
    if (!file) return next(_createError('File not found', 404));
    // Check permission access to file
    if (!file.isPublic && userId != file.owner) {
      return next(_createError('You cannot access to file', 403));
    }

    // if (/^\//.test(file.path) || /^\w:/.test(file.path)) {
    //   file.filePath = path.join(file.path, file.filename);
    // } else {
    //   file.filePath = path.join(rootPath, file.path, file.filename);
    // }

    // Send file to client
    if (/^image/.test(file.filetype)) {
      processImage(file, req.query).then(image => {
        image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
          res.set('Content-Type', jimp.MIME_JPEG);
          return res.send(buffer);
        });
      });
    } else {
      return res.download(file.path, filename, err => {
        if (!err) {
          _log('send file success', filename);
        } else {
          _log('send file error', filename, '%error%');
        }
      });
    }
  } catch (error) {
    return next(error);
  }
}

async function handleGetFileInfo(req, res, next) {
  try {
    let user = req.user;
    let { filename } = req.query;
    let file = await File.findOne({ filename: filename });
    if (file.isPublic) return res.json(file);
    else {
      if (!user) return next(_createError("You can't access file", 403));
      if (user && file.owner === user._id) return res.json(file);
      else return next(_createError("You can't access file", 403));
    }
  } catch (error) {
    return next(error);
  }
}

async function handleUpdateFile(req, res, next) {
  try {
    let user = req.user;
    let { filename, subOwner, tags, _id } = req.body;
    // const fileId = filename.match(/(?!\w*-).*(?=\.\w+$)/).pop();

    let file = await File.findOne({ _id });

    if (file.owner != null) {
      if (!user || user._id != file.owner)
        return next(_createError("You don't modify this file", 401));
      else {
        if (subOwner) file.subOwner = subOwner;
        if (tags) file.tags = file.tags;
      }
    } else {
      if (subOwner) file.subOwner = subOwner;
      if (tags) file.tags = file.tags;
      file.owner = user._id;
    }
    file.filename = filename;

    let result = await file.save();
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @param {*} file
 * @param {*} query
 * size=wxh,
 * crop=top,left,width,height
 * scale=
 */
async function processImage(file, query) {
  console.log('send image to client');
  let { size, crop, scale } = query;
  let image = await jimp.read(file.path);
  let w = image.getWidth();
  let h = image.getHeight();

  // Resize
  if (size) {
    w = Number(size.split('x')[0] || 50);
    h = Number(size.split('x')[1] || 50);
    image.resize(w, h);
  }

  // Crop
  if (crop) {
    let top = Number(crop.split(',')[0]);
    let left = Number(crop.split(',')[1]);
    let cWidth = Number(crop.split(',')[2]);
    let cHeight = Number(crop.split(',')[3]);
    if (left + cWidth > w) cWidth = w - left;
    if (top + cHeight > h) cHeight = h - top;
    image.crop(top, left, cWidth, cHeight);
  }

  // Scale
  if (scale) {
    scale = Number(scale);
    image.scale(scale);
  }

  return image;
}

module.exports = {
  handleGetFile,
  handleGetFileInfo,
  handleUpdateFile
};
