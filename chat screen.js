import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Attachment,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';

const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoid2ludGVyLXRvb3RoLTEiLCJleHAiOjE2Mjk3MjAwMTN9.s1wFXexkKg1UpzDM2ShL79YyLZJqHDkT4h_deiagbis';

const filters = { type: 'messaging', members: { $in: ['winter-tooth-1'] } };
const sort = { last_message_at: -1 };

const attachments = [
  {
    image: 'https://images-na.ssl-images-amazon.com/images/I/71k0cry-ceL._SL1500_.jpg',
    name: 'iPhone',
    type: 'product',
    url: 'https://goo.gl/ppFmcR',
  },
];

const CustomAttachment = (props) => {
  const { attachments } = props;
  const [attachment] = attachments || [];

  if (attachment?.type === 'product') {
    return (
      <div>
        Product:
        <a href={attachment.url} rel='noreferrer'>
          <img alt='custom-attachment' height='100px' src={attachment.image} />
          <br />
          {attachment.name}
        </a>
      </div>
    );
  }

  return <Attachment {...props} />;
};

const App = () => {
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance('dz5f4d5kzrue');

      await client.connectUser(
        {
          id: 'winter-tooth-1',
          name: 'winter',
          image: 'https://getstream.io/random_png/?id=winter-tooth-1&name=winter',
        },
        userToken,
      );

      const [channelResponse] = await client.queryChannels(filters, sort);

      await channelResponse.sendMessage({
        text: 'Your selected product is out of stock, would you like to select one of these alternatives?',
        attachments,
      });

      setChatClient(client);
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme='messaging light'>
      <ChannelList filters={filters} sort={sort} />
      <Channel Attachment={CustomAttachment}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;