const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserId } = require('../utils');

const Mutation = {
  createUser(parent, { firstname, lastname, email }, context, info) {
    return context.prisma.createUser(
      {
        firstname,
        lastname,
        email
      },
      info
    );
  },
  updateUser(parent, { id, firstname, lastname, email }, context, info) {
    return context.prisma.updateUser(
      {
        data: {
          firstname,
          lastname,
          email
        },
        where: { id: id }
      },
      info
    );
  },
  deleteUser(parent, { id }, context, info) {
    return context.prisma.deleteUser(
      {
        id
      },
      info
    );
  },
  createPost(parent, { published, title, content }, context, info) {
    return context.prisma.createPost(
      {
        published,
        title,
        content
      },
      info
    );
  },
  updatePost(parent, { id, published, title, content }, context, info) {
    return context.prisma.updatePost(
      {
        data: {
          published,
          title,
          content
        },
        where: { id }
      },
      inof
    );
  },
  deletePost(parent, { id }, context, info) {
    return context.prisma.deletePost(
      {
        id
      },
      info
    );
  },
  createCourse(
    parent,
    { published, name, description },
    context,
    info
  ) {
    const userId = getUserId(context);
    return context.prisma.createCourse(
      {
        published,
        name,
        description,
        instructor: {
            connect : {
                id: userId
            }
        }
      },
      info
    );
  },
  updateCourse(parent, { id, published, name, description }, context, info) {
    return context.prisma.updateCourse(
      {
        data: {
          published,
          name,
          description
        },
        where: { id }
      },
      info
    );
  },
  deleteCourse(parent, { id }, context, info) {
    return context.prisma.deleteCourse(
      {
        id
      },
      info
    );
  },
  async signup(parent, {email, password}, context, info) {
      const hash = await bcrypt.hash(password, 10);
      const user = await context.prisma.createUser({
        email,
        password: hash
      }, `{id}`);
      const token = jwt.sign({id: user.id}, process.env.APP_SECRET);
      return {
          token,
          user
      }
  },
  async login(parent, {email, password}, context, info) {
    const user = await context.prisma.user({email});
    if(!user) {
        throw new Error (`user with email ${email} not found`);
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
        throw new Error ("invalid password")
    }
    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
    return {
        token,
        user
    }
  }
};

module.exports = Mutation
