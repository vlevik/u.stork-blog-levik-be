'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post', {
  async create({ data }) {
    const { userId, ...rest } = data;
    const post = await strapi.query('api::post.post').create({
      data: {
        ...rest,
        User: { id: userId },
        publishedAt: new Date(),
      },
    });

    return post;
  },
  async update(id, { data }) {
    const ctx = strapi.requestContext.get();
    const postToUpdate = await strapi.query('api::post.post').findOne({ where: { id }, populate: ['User'] });

    if (postToUpdate.User.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not allowed to update this post');
    }

    return strapi.query('api::post.post').update({ where: { id }, data });
  },
  async delete(id) {
    const ctx = strapi.requestContext.get();
    const postToDelete = await strapi.query('api::post.post').findOne({ where: { id }, populate: ['User'] });
    if (postToDelete.User.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not allowed to delete this post');
    }
    return strapi.query('api::post.post').delete({ where: { id } });
  }
});
