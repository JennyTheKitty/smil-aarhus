import {
  createPlugin,
  DateComponent,
  DateProfile,
  Duration,
  ViewProps,
  DateRange,
  ViewContext,
} from '@fullcalendar/core';
import dayjs from 'dayjs';
import { h } from 'preact';

export const listViewProps = ref<
  ViewProps & { dateProfile: DateProfile; nextDayThreshold: Duration }
>();

export const listViewContext = ref<ViewContext>();

export const listViewRange = ref<DateRange>();

class ListView extends DateComponent<ViewProps> {
  render() {
    let { props, context } = this;
    listViewContext.value = context;
    listViewProps.value = props as any;
    return h('div', { id: 'calendar-list-view' }, []);
  }
  componentDidUpdate() {
    let { props } = this;
    listViewProps.value = props as any;
  }
}

export default createPlugin({
  views: {
    list: {
      component: ListView,
      visibleRange: function () {
        if (listViewRange.value === undefined) {
          listViewRange.value = {
            start: dayjs().toDate(),
            end: dayjs().add(1, 'months').toDate(),
          };
        }
        return listViewRange.value;
      },
    },
  },
});
