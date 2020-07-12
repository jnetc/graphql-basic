const Query = {
  users(parent, args, ctx, info) {
    const { users } = ctx.db;
    if (!args.query) {
      return users;
    }
    return users.filter(user => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },

  posts(parent, args, ctx, info) {
    const { posts } = ctx.db;
    if (!args.query) {
      return posts;
    }
    return posts.filter(post => {
      return (
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    });
  },

  comments(parent, args, { db }, info) {
    return db.comments;
  },

  me() {
    return {
      id: 'wieurw131j3lk1jk',
      name: 'Petja Pupkin',
      email: 'petja@xakep.ru',
    };
  },

  post() {
    return {
      id: '4ds44fs5f4s55fs6',
      title: 'GrqphQL course',
      body: 'Starting learn GraphQL and it is fantastic',
      published: true,
    };
  },
};

export { Query as default };
