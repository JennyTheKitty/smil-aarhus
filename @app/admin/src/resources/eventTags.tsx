import { Category as Icon } from '@material-ui/icons';
import {
  Create,
  CreateProps,
  Datagrid,
  Edit,
  EditProps,
  List,
  ListProps,
  SimpleForm,
  TextField,
  TextInput,
  TranslatableInputs,
} from 'react-admin';

interface EventTag {
  title: { [lang: string]: string };
}

interface Props {
  record?: EventTag;
}

export const EventTagList = (props: ListProps) => (
  <List {...props} title="List of event categories">
    <Datagrid rowClick="edit">
      <TextField source="title.en" label="Title" sortable={false} />
    </Datagrid>
  </List>
);

const EventTagTitle = ({ record }: Props) => {
  return <span>Event category: {record ? `"${record.title.en}"` : ''}</span>;
};

export const EventTagEdit = (props: EditProps) => (
  <Edit {...props} title={<EventTagTitle />}>
    <SimpleForm>
      <TranslatableInputs locales={['en', 'da']}>
        <TextInput source="title" />
      </TranslatableInputs>
    </SimpleForm>
  </Edit>
);

export const EventTagCreate = (props: CreateProps) => (
  <Create {...props}>
    <SimpleForm>
      <TranslatableInputs locales={['en', 'da']}>
        <TextInput source="title" />
      </TranslatableInputs>
    </SimpleForm>
  </Create>
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: EventTagList,
  edit: EventTagEdit,
  create: EventTagCreate,
  options: { label: 'Event categories' },
  icon: Icon,
};
