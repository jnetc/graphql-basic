let users = [
  {
    id: '1',
    name: 'Andrey',
    email: 'andrey@mail.com',
    age: 25,
    posts: [],
    comments: [],
  },
  {
    id: '2',
    name: 'Talia',
    email: 'talia@mail.com',
    posts: [],
    comments: [],
  },
  {
    id: '3',
    name: 'Missy',
    email: 'missy@mail.com',
    age: 18,
    posts: [],
    comments: [],
  },
];

let posts = [
  {
    id: '1',
    title: 'GraphQL lesson 1',
    body:
      'Это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
    published: true,
    author: '1',
    comments: [],
  },
  {
    id: '2',
    title: 'Node.js',
    body:
      'В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum for lesson для распечатки образцов.',
    published: false,
    author: '1',
    comments: [],
  },
  {
    id: '3',
    title: 'Vue.js lesson 32',
    body:
      'Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн.',
    published: false,
    author: '3',
    comments: [],
  },
];

let comments = [
  {
    id: '1',
    text: 'GraphQL очень здоровская штукенция!! =)',
    author: '3',
    postId: '1',
  },
  {
    id: '2',
    text: 'Тоже заинтересовался GraphQL, выглядит современно',
    author: '2',
    postId: '1',
  },
  {
    id: '3',
    text: 'После Node, хочу погрузится во Vue, теже яйца только в профиль',
    author: '2',
    postId: '3',
  },
  {
    id: '4',
    text: 'А я полностью хочу в Backend и Node в приоритете +)',
    author: '1',
    postId: '2',
  },
];

const db = {
  users,
  posts,
  comments
}

export { db as default }