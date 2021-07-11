import React from 'react'; // eslint-disable-line

function Logo() { // eslint-disable-line
  return <img src="https://vic.peacefactory.fr/images/logo.svg" />;
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
      ],
    },
    {
      label: 'People',
      children: [
        { listKey: 'User' },
        { listKey: 'Trainer', label: 'Session Hosts' },
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
