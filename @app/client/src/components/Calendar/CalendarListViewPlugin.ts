import { createPlugin, sliceEvents } from '@fullcalendar/core';
import { Component } from 'preact';

class ListView extends Component {
  render(props: any, context: any) {
    let segs = sliceEvents(props, true);

    console.log(segs, context, props);
    // TODO: Implement proper list view
    return 'TODO';
  }
}

export default createPlugin({
  views: {
    list: {
      component: ListView,
      visibleRange: {
        start: '2020-03-22',
        end: '2020-07-25',
      },
    },
  },
});
