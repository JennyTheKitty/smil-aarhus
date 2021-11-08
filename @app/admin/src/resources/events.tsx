import { Typography } from '@material-ui/core';
import { Add, Event as Icon } from '@material-ui/icons';
import RichTextInput from 'ra-input-rich-text';
import {
  AutocompleteInput,
  BooleanField,
  BooleanInput,
  Button,
  Create,
  CreateButton,
  CreateProps,
  Datagrid,
  DateField,
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
  useTranslatableContext,
} from 'react-admin';
// @ts-ignore
import { DateInput, DateTimeInput } from 'react-admin-date-inputs';

const locales = ['en', 'da'];

interface Event {
  startsAt: Date;
  endsAt: Date;
  title: { [lang: string]: string };
  description: { [lang: string]: string };
  venue: { [lang: string]: string };
}

interface Props {
  record?: Event;
}

export const lessThan = {
  parse: (value: string): any => ({
    value,
    operator: 'lessThan',
  }),
  format: (obj: any) => obj && obj.value,
};

const eventFilters = [
  // eslint-disable-next-line react/jsx-key
  <ReferenceInput source="categoryId" reference="EventCategories" alwaysOn>
    <AutocompleteInput optionText="title.en" resettable />
  </ReferenceInput>,
  // eslint-disable-next-line react/jsx-key
  <DateInput
    source="startsAt"
    locales="da-DK"
    alwaysOn
    label="Starts before"
    {...lessThan}
  />,
  // eslint-disable-next-line react/jsx-key
  <DateInput
    source="startsAt@greaterThan"
    locales="da-DK"
    alwaysOn
    label="Starts after"
  />,
];

const ListActions = () => (
  <TopToolbar>
    {/*cloneElement(props.filters!, { context: 'button' })*/}
    <CreateButton label="Create from scratch" />
    <Button
      component={Link}
      label="Create from template"
      to={{
        pathname: '/EventTemplates',
      }}
    >
      <Add />
    </Button>
    <ExportButton />
  </TopToolbar>
);

export const EventList = (props: ListProps) => (
  <List
    {...props}
    filters={eventFilters}
    actions={<ListActions />}
    title="List of events"
  >
    <Datagrid rowClick="edit">
      <DateField source="startsAt" showTime locales="da-DK" />
      <DateField source="endsAt" showTime locales="da-DK" />
      <TextField source="title.en" label="Title" sortable={false} />
      {/* <TextField source="description.en" label="Description" sortable={false} /> */}
      {/* <TextField source="venue.en" label="Venue" sortable={false} /> */}
      <BooleanField source="special" />
      <ReferenceField source="categoryId" reference="EventCategories">
        <TextField source="title.en" />
      </ReferenceField>
    </Datagrid>
  </List>
);

const EventTitle = ({ record }: Props) => {
  return <span>Event: {record ? `"${record.title.en}"` : ''}</span>;
};

const EventHelp = () => {
  return (
    <Typography>
      Fill at least one of the languages below. If only one is filled, it will
      always be chosen.
    </Typography>
  );
};

export const EventEdit = (props: EditProps) => (
  <Edit {...props} title={<EventTitle />}>
    <SimpleForm>
      <EventHelp />
      <TranslatableInputs locales={locales}>
        <TextInput source="title" validate={required()} />
        <RichTextInput source="description" validate={required()} />
        <TextInput source="venue" validate={required()} />
      </TranslatableInputs>
      <DateTimeInput
        source="startsAt"
        label="Starts at"
        options={{ format: 'dd/MM/yyyy, HH:mm:ss', ampm: false }}
        validate={required()}
      />
      <DateTimeInput
        source="endsAt"
        label="Ends at"
        options={{ format: 'dd/MM/yyyy, HH:mm:ss', ampm: false }}
        validate={required()}
      />
      <BooleanInput source="special" />
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

// const eventValidate = (values: Event) => {
//   const errors = {} as any;
//   console.log(values)
//   for (const locale of locales) {
//     if ((values.description && values.description[locale]) || (values.title && values.title[locale]) || (values.venue && values.venue[locale])) {
//       if (!values.description || !values.description[locale]) {
//         errors.description[locale] = 'Aaaaa'
//       }
//       if (!values.title || !values.title[locale]) {
//         errors.title[locale] = 'Aaaaa'
//       }
//       if (!values.venue ||!values.venue[locale]) {
//         errors.venue[locale] = 'Aaaaa'
//       }
//     }
//   }
//   return errors
// };

const Selector = () => {
  const { locales, selectLocale, selectedLocale } = useTranslatableContext();

  return (
    <select
      aria-label="Select the locale"
      onChange={(event) => {
        selectLocale(event.target.value);
      }}
      value={selectedLocale}
    >
      {locales.map((locale) => (
        <option
          key={locale}
          value={locale}
          // This allows to correctly link the containers for each locale to their labels
          id={`translatable-header-${locale}`}
        >
          {locale}
        </option>
      ))}
    </select>
  );
};

export const EventCreate = (props: CreateProps) => (
  <Create {...props}>
    <SimpleForm>
      <EventHelp />
      <TranslatableInputs locales={locales} selector={<Selector />}>
        <TextInput source="title" fullWidth />
        <RichTextInput source="description" />
        <TextInput source="venue" fullWidth />
      </TranslatableInputs>
      <DateTimeInput
        source="startsAt"
        label="Starts at"
        options={{ format: 'dd/MM/yyyy, HH:mm:ss', ampm: false }}
        validate={required()}
      />
      <DateTimeInput
        source="endsAt"
        label="Ends at"
        options={{ format: 'dd/MM/yyyy, HH:mm:ss', ampm: false }}
        validate={required()}
      />
      <BooleanInput source="special" />
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
  list: EventList,
  edit: EventEdit,
  create: EventCreate,
  options: { label: 'Events' },
  icon: Icon,
};
