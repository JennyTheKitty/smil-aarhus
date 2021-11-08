import { Add, CalendarToday as Icon } from '@material-ui/icons';
import { stringify } from 'query-string';
import RichTextInput from 'ra-input-rich-text';
import {
  AutocompleteInput,
  Button,
  Create,
  CreateButton,
  CreateProps,
  Datagrid,
  Edit,
  EditProps,
  ExportButton,
  Link,
  List,
  ListProps,
  ReferenceField,
  ReferenceInput,
  required,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
  TranslatableInputs,
} from 'react-admin';

interface EventTemplate {
  title: { [lang: string]: string };
  description: { [lang: string]: string };
  venue: { [lang: string]: string };
}

interface Props {
  record?: EventTemplate;
}

const ListActions = () => (
  <TopToolbar>
    {/*cloneElement(props.filters!, { context: 'button' })*/}
    <CreateButton label="Create new template" />
    <ExportButton />
  </TopToolbar>
);

const CreateEventButton = ({ record }: Props) => (
  <Button
    component={Link}
    onClick={(event) => event.stopPropagation()}
    label="Create event"
    to={{
      pathname: '/events/create',
      search: stringify({
        source: JSON.stringify({
          title: record?.title,
          description: record?.description,
          venue: record?.venue,
        }),
      }),
    }}
  >
    <Add />
  </Button>
);

export const EventTemplateList = (props: ListProps) => (
  <List {...props} actions={<ListActions />} title="List of templates">
    <Datagrid rowClick="edit">
      <TextField source="title.en" label="Title" sortable={false} />
      {/* <TextField source="description.en" label="Description" sortable={false} /> */}
      {/* <TextField source="venue.en" label="Venue" sortable={false} /> */}
      <ReferenceField source="categoryId" reference="EventCategories">
        <TextField source="title.en" />
      </ReferenceField>
      <CreateEventButton />
    </Datagrid>
  </List>
);

const EventTemplateTitle = ({ record }: Props) => {
  return <span>Template: {record ? `"${record.title.en}"` : ''}</span>;
};

export const EventTemplateEdit = (props: EditProps) => (
  <Edit {...props} title={<EventTemplateTitle />}>
    <SimpleForm>
      <TranslatableInputs locales={['en', 'da']}>
        <TextInput source="title" validate={required()} />
        <RichTextInput source="description" validate={required()} />
        <TextInput source="venue" validate={required()} />
      </TranslatableInputs>
      <ReferenceInput
        source="categoryId"
        reference="EventCategories"
        validate={required()}
      >
        <AutocompleteInput optionText="title.en" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const EventTemplateCreate = (props: CreateProps) => (
  <Create {...props}>
    <SimpleForm>
      <TranslatableInputs locales={['en', 'da']}>
        <TextInput source="title" validate={required()} />
        <RichTextInput source="description" validate={required()} />
        <TextInput source="venue" validate={required()} />
      </TranslatableInputs>
      <ReferenceInput
        source="categoryId"
        reference="EventCategories"
        validate={required()}
      >
        <AutocompleteInput optionText="title.en" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: EventTemplateList,
  edit: EventTemplateEdit,
  create: EventTemplateCreate,
  options: { label: 'Events templates' },
  icon: Icon,
};
