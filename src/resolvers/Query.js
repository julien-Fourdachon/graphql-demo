const Query = {
    user: (parent, { id }, context) => {
      return context.prisma.user({ where: id });
    },
    course: (parent, { id }, context) => {
      return context.prisma.course({ id });
    },
    post: (parent, args, context) => {
      return context.prisma.posts();
    },
    users: (parent, args, context) => {
      return context.prisma.users();
    },
    courses: (parent, args, context) => {
      return context.prisma.courses();
    },
    posts: (parent, { id }, context) => {
      return context.prisma.post({ id });
    }
  }
  module.exports = Query;