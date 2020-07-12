// Связываем пользователя с постами и коментами
const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter(post => parent.id === post.author);
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => comment.author === parent.id);
  },
};

export { User as default };
