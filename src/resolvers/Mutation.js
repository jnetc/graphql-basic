import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  // СОЗДАНИЕ пользователя
  createUser(parent, args, { db }, info) {
    const isEmailExist = db.users.some(user => user.email === args.data.email);
    if (isEmailExist) {
      throw new Error('This email is exist');
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);
    return user;
  },
  // УДАЛЕНИЕ пользователя
  deleteUser(parent, args, { db }, info) {
    const idx = db.users.findIndex(user => user.id === args.id);

    if (idx === -1) {
      throw new Error('User not found');
    }

    // Отсеиваем посты пользователя
    const deleteUserPosts = db.posts.filter(
      post => post.author !== db.users[idx].id
    );
    // Перезаписываем отфильтрованые посты в основной массив постов
    db.posts = deleteUserPosts;

    // Отсеиваем комерты пользователя
    const deleteUserComments = db.comments.filter(
      comment => comment.author !== db.users[idx].id
    );
    db.comments = deleteUserComments;

    // Удаляем пользователя из массива
    const deletedUser = db.users.splice(idx, 1);

    // Запрос на удаленного пользователя
    return deletedUser[0];
  },
  // ОБНОВЛЕНИЕ пользователя
  updateUser(parent, { id, data }, { db }, info) {
    // Ищем пользователя в базе
    const idx = db.users.findIndex(user => user.id === id);
    // Проверка на пользователя
    if (idx === -1) {
      throw new Error('User not found');
    }
    // Обновляем пользователя в массиве, через метод объекта
    const updateUser = Object.assign(db.users[idx], data);
    // Возвращаем пользователя
    return updateUser;
  },

  // Создание / удаление / обновление поста
  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some(user => user.id === args.data.author);
    if (!userExist) {
      throw new Error('User not found');
    }

    const post = { id: uuidv4(), ...args.data };

    db.posts.push(post);
    // Подписываемся на пост, если он опубликован
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const idx = db.posts.findIndex(post => post.id === args.id);
    if (idx === -1) {
      throw new Error('Post not found');
    }

    const deletePostComments = db.comments.filter(
      comment => comment.postId !== db.posts[idx].id
    );
    db.comments = deletePostComments;

    const [post] = db.posts.splice(idx, 1);

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      });
    }

    return post;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    // Находим нужный пост
    const findedPost = db.posts.find(post => post.id === id);
    // Создаем копию найденого поста чтобы,
    // потом сравнить изменения публикации при проверке
    const originalPost = { ...findedPost };

    if (!findedPost) {
      throw new Error('Post not found');
    }

    if (typeof data.title === 'string') {
      findedPost.title = data.title;
    }

    if (typeof data.body === 'string') {
      findedPost.body = data.body;
    }

    // Проверка на публикацию
    if (typeof data.published === 'boolean') {
      findedPost.published = data.published;

      // Если обновленая публикация поста false, а оригинал true
      // subscribe DELETED
      if (!findedPost.published && originalPost.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: findedPost,
          },
        });
      }
      // Если публикация статьи true, а оригинал false
      // subscribe CREATED
      else if (findedPost.published && !originalPost.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: findedPost,
          },
        });
      }
    }
    // Если состояние публикации не извенилось,
    // а только содержание или заголовок
    // subscribe UPDATED
    else if (findedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: findedPost,
        },
      });
    }

    return findedPost;
  },

  // Создание / удаление / обновление коментария
  // Подписываемся на коментарии через (pubsub)
  createComment(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some(user => user.id === args.data.author);
    const postExist = db.posts.some(
      post => post.id === args.data.postId && post.published
    );

    if (!postExist || !userExist) {
      throw new Error('Post or user not found');
    }

    const newComment = { id: uuidv4(), ...args.data };

    db.comments.push(newComment);

    // Подписываемся на комент
    pubsub.publish(`comment ${args.data.postId}`, {
      comment: {
        mutation: 'CREATED',
        data: newComment,
      },
    });

    return newComment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const idx = db.comments.findIndex(comment => comment.id === args.id);
    if (idx === -1) {
      throw new Error('Comment not found');
    }
    const [deleteComment] = db.comments.splice(idx, 1);

    pubsub.publish(`comment ${deleteComment.postId}`, {
      comment: {
        mutation: 'DELETED',
        data: deleteComment,
      },
    });

    return deleteComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const findedComment = db.comments.find(
      comment => comment.id === args.id
    );
    if (!findedComment) {
      throw new Error('Comment not found');
    }

    const updateComment = Object.assign(findedComment, args);

    pubsub.publish(`comment ${updateComment.postId}`, {
      comment: {
        mutation: 'UPDATED',
        data: updateComment,
      },
    });

    return updateComment;
  },
};

export { Mutation as default };
