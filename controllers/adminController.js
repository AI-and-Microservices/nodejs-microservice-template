const App = require('../models/Application');
const kafkaService = require('../services/kafkaService');
const logger = require('../utils/logger');
const crossServerRequest = require('../utils/crossServiceRequest');

exports.createApp = async (req, res) => {
  try {
    const userId = req.user._id
    const name = req.getParams('name', '');
    const description = req.getParams('description', '');
    const type = req.getParams('type', '');
    const virtualRoles = req.getParams('virtualRoles', []);
    const cover = req.getParams('description', '');
    const logo = req.getParams('description', '');

    if (!name) return res.error('app Name is required', 400);
    if (!type) return res.error('app type is required', 400);

    const app = new App({ name, description, type, userId, virtualRoles, cover, logo });
    await app.save();
    logger.info('App created', { app })

    kafkaService.sendMessage('APP_CREATED', app);
    return res.success(app, 'App created successfully', 201);
  } catch (error) {
    return res.error(error, 400);
  }
};

exports.listApps = async (req, res) => {
  const limit = req.getParams('limit', 20);
  const offset = req.getParams('offset', 0);
  const search = req.getParams('search', '');
  const userId = req.user._id
  // const users = await crossServerRequest.get('/user/internal/users');
  const query = {userId}
  if (search) {
    query['$text'] = { $search: search } 
  }

  const apps = await App.find(query).skip(offset).limit(limit).sort({ _id: -1 });
  res.success(apps);
};

exports.getApp = async (req, res) => {
  const userId = req.user._id
  const appId = req.getParams('id', '')
  const app = await App.findOne({_id: appId, userId});
  if (!app) return res.error('App not found', 404);
  res.success(app);
};

exports.updateApp = async (req, res) => {
  const userId = req.user._id
  const name = req.getParams('name', '');
  const description = req.getParams('description', '');
  // const type = req.getParams('type', '');
  const virtualRoles = req.getParams('virtualRoles', []);
  const cover = req.getParams('description', '');
  const logo = req.getParams('description', '');
  const appId = req.getParams('id', '')
  const prompt = req.getParams('prompt', '')
  const app = await App.findOne({_id: appId, userId});
  if (!app) return res.error('App not found', 404);
  
  if (name) {
    app.name = name
  }
  if (description) {
    app.description = description
  }
  if (virtualRoles.length > 0) {
    app.virtualRoles = virtualRoles
  }
  if (cover) {
    app.cover = cover
  }
  if (logo) {
    app.logo = logo
  }
  if (prompt) {
    app.prompt = prompt
  }

  await app.save()

  res.success(app);
};


exports.publish = async (req, res) => {
  const userId = req.user._id
  const appId = req.getParams('id', '')
  //isPublic

  const isPublic = req.getParams('isPublic', '')
  const app = await App.findOne({_id: appId, userId});
  if (!app) return res.error('App not found', 404);
  
  app.isPublic = isPublic
  
  await app.save()

  res.success(app);
};

exports.deleteApp = async (req, res) => {
  const app = await App.findByIdAndDelete(req.getParams('id', ''));
  if (!app) return res.error('App not found', 404);
  res.success({ message: 'App deleted' });
};

exports.refreshToken = async (req, res) => {
  const token = req.getParams('refreshToken', '');
  if (!token) return res.error('Refresh token is required', 400);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const app = await App.findById(decoded.id);

    if (!app || app.refreshToken !== token) {
      return res.error('Invalid refresh token', 403);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(app);
    app.refreshToken = newRefreshToken;
    await app.save();

    res.success({ accessToken, refreshToken: newRefreshToken }, 'Token refreshed');
  } catch (err) {
    res.error('Invalid or expired refresh token', 403);
  }
};
