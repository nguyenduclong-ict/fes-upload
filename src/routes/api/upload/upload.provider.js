const fs = require('fs');
const File = _db('models/base/File');

// Setup multer
const multer = require('multer');
const path = require('path');
const uploadPath = process.env.UPLOAD_PATH || 'upload';
const rootPath = process.env.ROOT_PATH || __dirroot;
const MIME_TYPE_MAP = [
  /image\/*/,
  /video\/*/,
  /audio\/*/,
  /\.zip/,
  /text\/*/,
  /application\/*/
];

// Storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const arr = [uploadPath];
    // Prepare upload dir
    if (req.user) {
      const now = new Date();
      const userPath = req.user.username || req.user.email;
      const timePath = `${now.getFullYear()}-${now.getMonth() + 1}`;
      arr.push('private', userPath, timePath);
    } else {
      arr.push('anonymus');
    }
    let uPath = '';
    arr.forEach(e => {
      uPath = path.join(uPath, e);
      const pp = path.join(rootPath, uPath);
      if (!fs.existsSync(pp)) {
        fs.mkdirSync(pp, '774');
        console.log('Created folder ...', path.join(pp));
      }
    });
    uPath = path.join(rootPath, uPath);
    _log('filePath', uPath);
    cb(null, uPath);
  },
  filename: (req, file, cb) => {
    if (!MIME_TYPE_MAP.some(mimetype => mimetype.test(file.mimetype))) {
      return cb(
        _createError('Định dạng file không được hỗ trợ', 500, { isJson: true }),
        null
      );
    } else {
      const ext = file.originalname.split('.').pop();
      const name = file.originalname.replace(new RegExp(`\.${ext}$`), '');
      cb(null, `${name}-${Date.now()}.${ext}`);
    }
  }
});

// Init upload
var upload = multer({
  storage: storage,
  limits: { fileSize: '50mb' }
});

// Upload array of file
async function handleUploadFiles(req, res, next) {
  let promise = [];
  try {
    let { subOwner = [], tags = [], isPublic = true } = req.body;
    req.files.forEach(async (element, i) => {
      let filepath = element.path;
      let [filetype, ext] = element.mimetype.split('/');
      console.log(element);
      let obj = {
        owner: req.user ? req.user._id : null,
        subOwner: subOwner,
        ext: ext,
        path: filepath,
        filetype: filetype,
        isPublic: isPublic,
        tags: tags
      };

      let file = new File(obj);
      promise.push(file.save());
    });

    Promise.all(promise).then(result => {
      return res.json(result);
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  handleUploadFiles,
  upload
};
