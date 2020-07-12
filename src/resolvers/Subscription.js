const SOMETHING_CHANGED_TOPIC = 'change data';

const Subscription = {
  post: {
    subscribe(parent, args, context, info) {
      return context.pubsub.asyncIterator('post');
    },
  },
  comment: {
    subscribe(parent, args, context, info) {
    
      const findPost = context.db.posts.find(
        post => post.id === args.postId && post.published
      );
        
      if (!findPost) {
        throw new Error('Post not found');
      }

      return context.pubsub.asyncIterator(`comment ${args.postId}`);
    },
  },
};

export { Subscription as default };
