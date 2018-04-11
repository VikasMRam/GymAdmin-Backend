import React from 'react';
import { storiesOf } from '@storybook/react';
import RoomTile from '.';

const onInquireOrBookClicked = () => {
    alert('open book modal');
};

storiesOf('Molecules|RoomTile', module)
    .add('shared', () => (<RoomTile onInquireOrBookClicked={onInquireOrBookClicked} price={4900} type="shared" img="https://d1qiigpe5txw4q.cloudfront.net/uploads/19898cec23e2a814366385f3488c29be/Vintage-Golden-Gate_San-Francisco_Assisted-Living_Original-16_hd.jpg" />))
    .add('private', () => (<RoomTile onInquireOrBookClicked={onInquireOrBookClicked} price={5295} type="private" img="https://d1qiigpe5txw4q.cloudfront.net/uploads/19898cec23e2a814366385f3488c29be/Vintage-Golden-Gate_San-Francisco_Assisted-Living_Original-16_hd.jpg" />))
    .add('1bedroom', () => (<RoomTile onInquireOrBookClicked={onInquireOrBookClicked} price={6100} type="1bedroom" img="https://d1qiigpe5txw4q.cloudfront.net/uploads/19898cec23e2a814366385f3488c29be/Vintage-Golden-Gate_San-Francisco_Assisted-Living_Original-16_hd.jpg" />));
