import {faker} from '@faker-js/faker'
export const  mockUsers = (length) => {
  const createRowData = (rowIndex) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const avatar = faker.image.avatar();
    const email = faker.internet.email();
    const phone = faker.phone.number();
    return {
      id: rowIndex + 1,
      firstName,
      name,
      lastName,
      avatar,
      email,
      phone,
    };
  };

  return Array.from({ length }).map((_, index) => {
    return createRowData(index);
  });
}
const generateFakeUser = () => {
  const uid = faker.string.uuid();
  const id = faker.string.uuid();
  const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;
  const avatar = faker.image.avatar();
  const timestamp = faker.date.between({from: '2023-11-01T00:00:00.000Z', to: '2023-11-16T00:00:00.000Z' });
  const lastseen = faker.date.between({from: '2023-11-17T00:00:00.000Z', to: '2023-11-18T00:00:00.000Z' });
  const isGroup = false;

  return {
    name,
    isGroup,
    uid,
    id,
    avatar,
    lastseen,
    timestamp,
  };
}

const getName = (uid) => {
  if(uid == 'nlgfYMAeNTgLBKf4iWebG74wGLE3'){
    return 'Hanumantha Reddy'
  }
  else{
    return 'Kiran Reddy'
  }
}
const getAvatar = (uid) => {
  if(uid == 'nlgfYMAeNTgLBKf4iWebG74wGLE3'){
    return 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/866.jpg'
  }
  else{
    return 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/935.jpg'
  }
}
const generateMessage = () => {
  const message = faker.helpers.arrayElement(
    [{
      type :'text',
      info : faker.lorem.sentence() 
    }
    ,
    {
      type: 'image',
      url :faker.image.url()}
    ,
    {
      type : 'video',
      url :faker.image.urlPicsumPhotos()}
    ,
    // {
    //   type : 'audio',
    //   url :faker.image.avatar()}
    // ,
    // {
    //   type : 'doc',
    //   url : 'https://docs.google.com/document/d/1Vq0Q00bZ32lHhHeqGAeLbKJeg8ZkJEet/edit?usp=sharing&ouid=114066885364079851764&rtpof=true&sd=true'
    // },
    // {
    //   type : 'pdf',
    //   url : 'https://drive.google.com/file/d/1b7B9XrkvXbcBY0wqvwVQodOSNtExcK_7/view?usp=sharing'
    // }
    ]
  )
  return message
}
const generateFakeMessage = () => {
  const uid = faker.string.uuid();
  const id = faker.string.uuid();
  const name =  getName(uid);
  const avatar = getAvatar(uid);
  const message = generateMessage();
  const timestamp = faker.date.between({from: '2023-11-01T00:00:00.000Z', to: '2023-11-16T00:00:00.000Z' });
  return {
    name,
    id,
    uid,
    avatar,
    message,
    timestamp,
  };
};
const generateFakeGroupMessages = () => {
  const uid = faker.string.uuid();
  const id = faker.string.uuid();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
const name = `${firstName} ${lastName}`;
const avatar = faker.image.avatar();
  const message = generateMessage();
  const timestamp = faker.date.between({from: '2023-11-01T00:00:00.000Z', to: '2023-11-16T00:00:00.000Z' });
  return {
    name,
    id,
    uid,
    avatar,
    message,
    timestamp,
  };
};
export const generateFakeGroupChat = (length) => {
  const groupChat = [];

  for (let i = 0; i < length; i++) {
    const message = generateFakeGroupMessages();
    groupChat.push(message);
  }

  return groupChat;
};
const generateGroup = () => {
  const name = faker.company.name();
  const id = faker.string.uuid();
  const avatar = faker.image.avatar();
  const description = faker.lorem.sentence();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const messages = generateFakeGroupChat(20);
  const isGroup = true;
  return {
    name,
    id,
    avatar,
    description,
    messages,
    isGroup,
    createdAt,
    updatedAt
  };
}

export const generateFakeGroupChats = (length) => {
  const groupChats = [];
    for (let i = 0; i < length; i++) {
    const messages = generateGroup();
    groupChats.push(messages);
  } 
  return groupChats;
};

export const generateFakeChat = (length) => {
  const messages = [];
  const chat = generateFakeUser();
  for (let i = 0; i < length; i++) {
    const chats = generateFakeMessage(length);
    messages.push(chats);
  } 
  return {
    ...chat,
    messages
  }
}

export const generateFakeChats = (length) => {
  const chats = [];
    for (let i = 0; i < length; i++) {
    const messages = generateFakeChat(length);
    chats.push(messages);
  } 
  return chats;
};