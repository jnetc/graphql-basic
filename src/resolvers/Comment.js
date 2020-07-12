// Связываем комменты с пользователем и постами
const Comment = {
  author(parent, args, { db }, info) {
    return db.users.find(user => user.id === parent.author);
  },
  post(parent, args, { db }, info) {
    return db.posts.filter(post => post.id === parent.postId);
  },
};

export { Comment as default };
