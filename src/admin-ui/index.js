import React from 'react'; // eslint-disable-line

function Logo() { // eslint-disable-line
  return <img src="https://vic-web.herokuapp.com/images/logo.svg" />;
}

export default {
  logo: () => <Logo />,
  pages: () => [
    // Ordering existing list pages
    {
      label: 'Courses',
      children: [
        'Course',
        'FAQ',
        'Session',
        'Room',
        'MessageType',
        'Message',
        'Order',
        'Pricing',
        'Card',
        'Attachment',
      ],
    },
    {
      label: 'People',
      children: [
        { listKey: 'User' },
        { listKey: 'Trainer', label: 'Presenters' },
      ],
    },
    {
      label: 'Old (deprecated)',
      children: [
        { listKey: 'Content' },
        { listKey: 'LibrarySection' },
        { listKey: 'Schedule' },
        { listKey: 'Space' },
      ],
    },
  ],
};
