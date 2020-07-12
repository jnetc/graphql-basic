// Связываем посты с пользователем через автора и комменты
const Post = {
  author(parent, args, { db }, info) {
    return db.users.find(user => user.id === parent.author);
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => comment.postId === parent.id);
  },
};

export { Post as default };
